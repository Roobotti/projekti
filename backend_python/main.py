from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from dotenv import dotenv_values
from pymongo import MongoClient
from routes import router as board_router
import json
from fastapi import FastAPI
from fastapi_socketio import SocketManager

config = dotenv_values(".env")

app = FastAPI()
socket_manager = SocketManager(app=app)
# Store active WebSocket connections
active_connections = set()

# Store the active lobbies and their users
active_lobbies = {}


origins = ["*"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["GET", "POST"],
    allow_headers=["*"],
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


@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    await websocket.accept()
    active_connections.add(websocket)

    try:
        while True:
            data = await websocket.receive_text()
            print(f"Received data: {data}")

            # Process the WebSocket message here
            if data.startswith('{"type":"invite"'):
                invite_data = data.json()
                recipient = invite_data["recipient"]
                sender = invite_data["sender"]
                # Check if the recipient is connected and add the user to the lobby
                if recipient in active_lobbies and recipient != sender:
                    active_lobbies[recipient]["members"].append(sender)
                    invite_response = {
                        "type": "invite_response",
                        "sender": sender,
                        "recipient": recipient,
                        "accepted": True,
                    }
                    # Notify the recipient about the invite
                    await websocket.send_text(json.dumps(invite_response))
                    # Notify the recipient's WebSocket connection about the invite
                    recipient_websocket = next(
                        (
                            connection
                            for connection in active_connections
                            if connection.path_params["username"] == recipient
                        ),
                        None,
                    )
                    if recipient_websocket:
                        await recipient_websocket.send_text(json.dumps(invite_response))
                else:
                    invite_response = {
                        "type": "invite_response",
                        "sender": sender,
                        "recipient": recipient,
                        "accepted": False,
                    }
                    # Notify the sender that the invite failed
                    await websocket.send_text(json.dumps(invite_response))

            elif data.startswith('{"type":"join"'):
                join_data = data.json()
                recipient = join_data["recipient"]
                sender = join_data["sender"]
                # Check if the recipient is connected and add the user to the recipient's lobby
                if recipient in active_lobbies and recipient != sender:
                    active_lobbies[recipient]["members"].append(sender)
                    join_response = {
                        "type": "join_response",
                        "sender": sender,
                        "recipient": recipient,
                        "accepted": True,
                    }
                    # Notify the recipient about the join
                    await websocket.send_text(json.dumps(join_response))
                    # Notify the recipient's WebSocket connection about the join
                    recipient_websocket = next(
                        (
                            connection
                            for connection in active_connections
                            if connection.path_params["username"] == recipient
                        ),
                        None,
                    )
                    if recipient_websocket:
                        await recipient_websocket.send_text(json.dumps(join_response))
                else:
                    join_response = {
                        "type": "join_response",
                        "sender": sender,
                        "recipient": recipient,
                        "accepted": False,
                    }
                    # Notify the sender that the join request failed
                    await websocket.send_text(json.dumps(join_response))

    except WebSocketDisconnect:
        active_connections.remove(websocket)


app.include_router(board_router, tags=["boards"], prefix="/api")
