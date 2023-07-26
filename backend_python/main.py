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
    allow_methods=["GET", "POST"],
    allow_headers=["*"],
)


@app.sio.on("connection")
async def handle_connection(self):
    print("connected")


@app.sio.on("join")
async def handle_join(sid, args):
    room = make_room_id(args["user"], args["friend"])
    print(room)
    app.sio.enter_room(sid, room)
    await app.sio.emit("lobby", {"room": room}, room=room)


@app.sio.on("redy")
async def handle_redy(sid, args):
    room = args["room"]
    await app.sio.emit("redy", {}, room=room, skip_sid=sid)


@app.sio.on("board")
async def handle_board(sid, args):
    room = args["room"]
    await app.sio.emit("board", {"board": args["board"]}, room=room, skip_sid=sid)


@app.sio.on("blocks")
async def handle_blocks(sid, args):
    room = args["room"]
    await app.sio.emit("blocks", {"blocks": args["blocks"]}, room=room, skip_sid=sid)


@app.sio.on("ubongo")
async def handle_ubongo(sid, args):
    room = args["room"]
    await app.sio.emit("ubongo", {}, room=room, skip_sid=sid)


@app.sio.on("invite")
async def handle_join(sid, args):
    print("invite", args)
    await app.sio.emit(args["friend"], {"type": "invite", "user": args["user"]})


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
