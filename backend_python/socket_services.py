import string
from typing import List, Dict

# Store the room ids mapping to the room property object
# The room property object looks like this {"roomId": str, "players": List[Player]}
rooms = {}


class Player:
    def __init__(self, name: str, room: str):
        self.name = name
        self.room = room


class Board:
    def __init__(self):
        self.game = [None] * 9
        self.turn = None

    # ... Implementation of other Board methods ...


def make_room_id(user: Player, friend: Player):
    return "".join(sorted([user, friend]))


# Promise function to make sure room id is unique
def make_room(new_room: str):
    if new_room in rooms:
        return
    else:
        rooms[new_room] = {"roomId": new_room, "players": [], "board": None}
    return new_room


# Put the newly joined player into a room's player list
def join_room(user: Player, room: str):
    if not room in rooms:
        make_room(room)
    current_room = rooms[room]
    current_room["players"].append(user)


# Remove the latest player joined from a room's player list
def leave(user: Player, room: str):
    current_room = rooms[room]
    current_room["players"].remove(user)


# Check how many player is currently in the room
def get_room_players_num(user: Player, friend: Player):
    return len(rooms[make_room_id(user, friend)]["players"])


# Initialize a new board to a room
def new_game(user: Player, friend: Player):
    current_room = rooms[make_room_id(user, friend)]
    board = Board()
    current_room["board"] = board
