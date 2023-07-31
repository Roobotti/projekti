from fastapi import FastAPI
from fastapi_socketio import SocketManager
from fastapi.middleware.cors import CORSMiddleware
from dotenv import dotenv_values
from pymongo import MongoClient
from routes import router as board_router
from socket_services import *


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
empty_room = {"host": [], "board": [], "blocks": [], "loading": False}


@app.sio.on("connection")
async def handle_connection(self):
    print("connected")


@app.sio.on("join")
async def handle_join(sid, args):
    room = make_room_id(args["user"], args["friend"])

    print(room)
    current_rooms[room] = current_rooms.get(room, empty_room)
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
            "loading": current_rooms[room]["loading"],
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
    await app.sio.emit("redy", {}, room=room, skip_sid=sid)


@app.sio.on("board")
async def handle_board(sid, args):
    room = args["room"]
    current_rooms[room]["board"] = args["board"]
    current_rooms[room]["blocks"] = []
    await app.sio.emit("board", {"board": args["board"]}, room=room, skip_sid=sid)


@app.sio.on("blocks")
async def handle_blocks(sid, args):
    room = args["room"]
    current_rooms[room]["blocks"] = args["blocks"]
    current_rooms[room]["loading"] = False
    await app.sio.emit(
        "blocks",
        {"blocks": args["blocks"], "board": current_rooms[room]["board"]},
        room=room,
        skip_sid=sid,
    )


@app.sio.on("loading")
async def handle_loading(sid, args):
    room = args["room"]
    current_rooms[room]["loading"] = True
    await app.sio.emit("loading", {}, room=room)


@app.sio.on("giveData")
async def handle_giveData(sid, args):
    room = args["room"]
    print("give data")
    await app.sio.emit("hostGiveData", {}, room=room, skip_sid=sid)


@app.sio.on("ubongo")
async def handle_ubongo(sid, args):
    room = args["room"]
    await app.sio.emit("ubongo", {}, room=room, skip_sid=sid)


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
