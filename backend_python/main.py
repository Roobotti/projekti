from fastapi import FastAPI
from fastapi_socketio import SocketManager
from fastapi.middleware.cors import CORSMiddleware
from dotenv import dotenv_values
from pymongo import MongoClient
from routes import router as board_router
from socket_services import *

from initalData import board_solutions

import json
import random
import string
from typing import List, Dict

config = dotenv_values(".env")

app = FastAPI()
socket_manager = SocketManager(app=app, cors_allowed_origins=[])

origins = ["*"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT"],
    allow_headers=["*"],
)

current_rooms = {}
empty_room = {"host": [], "board": [], "blocks": [], "redy": {}}


@app.sio.on("connection")
async def handle_connection(self):
    print("connected")


@app.sio.on("join")
async def handle_join(sid, args):
    room = make_room_id(args["user"], args["friend"])

    print(room)
    current_rooms[room] = current_rooms.get(room, empty_room)

    current_rooms[room]["redy"][args["user"]] = False

    if not (current_rooms[room]["host"]):
        current_rooms[room]["host"] = args["user"]

    print(current_rooms[room])

    app.sio.enter_room(sid, room)
    await app.sio.emit(
        "room",
        {
            "room": room,
            "host": current_rooms[room]["host"],
            "board": current_rooms[room]["board"],
            "blocks": current_rooms[room]["blocks"],
        },
        room=sid,
    )


@app.sio.on("leave")
async def handle_leave(sid, args):
    app.sio.leave_room(sid, args["room"])
    await app.sio.emit("left", {"user": args["user"]}, room=args["room"])


@app.sio.on("redy")
async def handle_redy(sid, args):
    room = args["room"]
    current_rooms[room]["redy"][args["user"]] = True

    if all(current_rooms[room]["redy"].values()):
        await app.sio.emit("redy", {}, room=room)


@app.sio.on("data")
async def handle_data(sid, args):
    room = args["room"]
    board = args["board"]
    blocks = args["blocks"]
    current_rooms[room]["board"] = board
    current_rooms[room]["blocks"] = blocks
    await app.sio.emit("game_data", {"board": board, "blocks": blocks}, room=room)


@app.sio.on("loading")
async def handle_loading(sid, args):
    room = args["room"]
    current_rooms[room]["loading"] = True
    await app.sio.emit("loading", {}, room=room, skip_sid=sid)


@app.sio.on("ubongo")
async def handle_ubongo(sid, args):
    room = args["room"]
    current_rooms[room]["redy"] = False
    current_rooms[room]["board"] = []
    current_rooms[room]["blocks"] = []
    await app.sio.emit("ubongo", {}, room=room, skip_sid=sid)
    await app.sio.emit("game_data", {"board": [], "blocks": []}, room=room)


@app.sio.on("invite")
async def handle_invite(sid, args):
    print("invite", args)
    await app.sio.emit(
        f"{args['friend']}/post", {"type": "invite", "user": args["user"]}, skip_sid=sid
    )


@app.sio.on("cancel_invites")
async def handle_cancel_invites(sid, args):
    print("cancel invites")
    await app.sio.emit(
        f"{args['friend']}/post",
        {"type": "cancel_invite", "user": args["user"]},
        skip_sid=sid,
    )


@app.sio.on("accept")
async def handle_accept(sid, args):
    print("accept", args)
    await app.sio.emit(
        f"{args['friend']}/post", {"type": "accept", "user": args["user"]}, skip_sid=sid
    )


@app.sio.on("request")
async def handle_request(sid, args):
    print("request", args)
    await app.sio.emit(
        f"{args['friend']}/post",
        {"type": "request", "user": args["user"]},
        skip_sid=sid,
    )


@app.on_event("startup")
def startup_db_client():
    app.mongodb_client = MongoClient(config["ATLAS_URI"])
    app.database = app.mongodb_client[config["DB_NAME"]]
    print("Connected to the MongoDB database!")


@app.on_event("shutdown")
def shutdown_db_client():
    app.mongodb_client.close()


@app.get("/")
async def root():
    return "Hello, World!"


app.include_router(board_router, tags=["boards"], prefix="/api")
