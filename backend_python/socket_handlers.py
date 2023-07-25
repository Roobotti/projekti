from .main import app
from .main import socket_manager as sm


@app.sio.on("join")
async def handle_join(sid, *args, **kwargs):
    await app.sio.emit("lobby", "User joined")


@sm.on("leave")
async def handle_leave(sid, *args, **kwargs):
    await sm.emit("lobby", "User left")
