from fastapi import FastAPI
from fastapi_socketio import SocketManager
from fastapi.middleware.cors import CORSMiddleware
from dotenv import dotenv_values
from pymongo import MongoClient
from routes import router as board_router
from socket_services import *


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
empty_room = {
    "host": "",
    "solutions": [],
    "blocks": [],
    "hostRedy": False,
    "playerRedy": False,
}


@app.sio.on("connection")
async def handle_connection(self):
    print("connected")


@app.sio.on("join")
async def handle_join(sid, args):
    room = make_room_id(args["user"], args["friend"])

    current_rooms[room] = current_rooms.get(room, empty_room.copy())

    if not (current_rooms[room]["host"]):
        current_rooms[room] = empty_room.copy()
        current_rooms[room]["host"] = args["user"]

    app.sio.enter_room(sid, room)
    await app.sio.emit(
        "room",
        {
            "room": room,
            "host": current_rooms[room]["host"],
            "blocks": current_rooms[room]["blocks"],
            "solutions": current_rooms[room]["solutions"],
        },
        room=sid,
    )


@app.sio.on("leave")
async def handle_leave(sid, args):
    room = args["room"]
    user = args["user"]

    if user == current_rooms[room]["host"]:
        current_rooms[room]["host"] = ""
        current_rooms[room]["hostRedy"] = current_rooms[room]["playerRedy"]
        await app.sio.emit("left", {"user": user}, room=room, skip_sid=sid)

    app.sio.leave_room(sid, room)


@app.sio.on("host")
async def handle_host(sid, args):
    room = make_room_id(args["user"], args["friend"])
    current_rooms[room]["host"] = args["user"]


@app.sio.on("userRedy")
async def handle_redy(sid, args):
    room = args["room"]
    if args["user"] == current_rooms[room]["host"]:
        current_rooms[room]["hostRedy"] = True
    else:
        current_rooms[room]["playerRedy"] = True

    if current_rooms[room]["hostRedy"] and current_rooms[room]["playerRedy"]:
        await app.sio.emit("redy", {}, room=room)


@app.sio.on("data")
async def handle_data(sid, args):
    room = args["room"]
    solutions = args["solutions"]
    blocks = args["blocks"]
    current_rooms[room]["solutions"] = solutions
    current_rooms[room]["blocks"] = blocks
    await app.sio.emit(
        "game_data", {"solutions": solutions, "blocks": blocks}, room=room
    )


@app.sio.on("loading")
async def handle_loading(sid, args):
    room = args["room"]
    current_rooms[room]["loading"] = True
    await app.sio.emit("loading", {}, room=room, skip_sid=sid)


@app.sio.on("ubongo")
async def handle_ubongo(sid, args):
    room = args["room"]
    current_rooms[room]["hostRedy"] = False
    current_rooms[room]["playerRedy"] = False
    current_rooms[room]["solutions"] = []
    current_rooms[room]["blocks"] = []
    await app.sio.emit("ubongo", {}, room=room, skip_sid=sid)


@app.sio.on("contest")
async def handle_contest(sid, args):
    room = args["room"]
    await app.sio.emit("contested", {}, room=room, skip_sid=sid)


@app.sio.on("contest_result")
async def handle_contest(sid, args):
    room = args["room"]
    result = args["result"]
    await app.sio.emit("contestResult", {"result": result}, room=room, skip_sid=sid)


@app.sio.on("invite")
async def handle_invite(sid, args):
    await app.sio.emit(
        f"{args['friend']}/post",
        {"type": "invite", "user": args["user"], "mode": args["mode"]},
        skip_sid=sid,
    )


@app.sio.on("cancel_invites")
async def handle_cancel_invites(sid, args):
    await app.sio.emit(
        f"{args['friend']}/post",
        {"type": "cancel_invite", "user": args["user"]},
        skip_sid=sid,
    )


@app.sio.on("accept")
async def handle_accept(sid, args):
    await app.sio.emit(
        f"{args['friend']}/post", {"type": "accept", "user": args["user"]}, skip_sid=sid
    )


@app.sio.on("request")
async def handle_request(sid, args):
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
