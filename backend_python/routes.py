import jwt

from fastapi import APIRouter, Depends, Request, HTTPException, Body, UploadFile


from services import *
from config import ACCESS_TOKEN_EXPIRE_MINUTES
from typing import Optional
from pymongo_get_database import get_database
from pymongo import UpdateOne, UpdateMany
from typing import List
from solver import (
    generate_base,
    find_good_combination,
    solve_puzzle,
    generate_basic_puzzle,
    piece_colors,
)
import random
import json
import numpy as np
import base64
from io import BytesIO
from PIL import Image

router = APIRouter()

dbname = get_database()
boards = dbname["own_boards"]
solutions = dbname["own_solutions"]
users = dbname["users"]

item_details = boards.find()
solutions_details = solutions.find()
boards_length = boards.count_documents({})
solutions_length = solutions.count_documents({})


@router.get("/boards/{index}", response_description="get board")
def board_selected(index: int):
    coordinates = list(item_details[min(index, 71)].values())[1]
    base = {"base": generate_base(coordinates), "coordinates": coordinates}
    encodedNumpyBase = json.dumps(base, default=lambda x: x.tolist())
    print(base)
    return encodedNumpyBase


##solutions stands for blocks ?
@router.get("/solutions/{index}", response_description="get board and target blocks")
def solution_selected(index: int):
    coordinates = list(item_details[min(index, 71)].values())[1]
    base = {"base": generate_base(coordinates), "coordinates": coordinates}
    encodedNumpyBase = json.dumps(base, default=lambda x: x.tolist())
    print(base)
    return encodedNumpyBase


@router.post("/blocks/solution", response_description="get solution")
def solution_selected(body: SolutionRequest):
    [count, solutions] = solve_puzzle(generate_basic_puzzle(body.board, 2), body.blocks)
    print("count:", count)
    print("solution:", solutions[0][0])
    solution = solutions[0][0]
    non_zero_rows = ~np.all(solution == 0, axis=1)
    non_zero_columns = ~np.all(solution == 0, axis=0)
    encodedNumpyBase = json.dumps(
        solution[non_zero_rows][:, non_zero_columns],
        default=lambda x: np.vectorize(piece_colors.get)(x).tolist(),
    )
    print("solution:", encodedNumpyBase)
    return encodedNumpyBase


@router.get("/board", response_description="get board")
def board():
    random_int = random.randint(0, boards_length - 1)
    print("board endpoint reached...")
    coordinates = list(item_details[random_int].values())[1]
    base = {"base": generate_base(coordinates), "coordinates": coordinates}
    encodedNumpyBase = json.dumps(base, default=lambda x: x.tolist())
    print(base)
    return encodedNumpyBase


@router.get("/blocks&board", response_description="get blocks and board")
def blocks_and_board():
    while True:
        try:
            random_int = random.randint(0, solutions_length - 1)
            print("board and blocks endpoint reached...")
            data = list(solutions_details[random_int].values())[1]

            coordinates = data["board"]
            blocks = random.choice(data["solutions"])
            print("data:", data)
            base = {"base": generate_base(coordinates), "coordinates": coordinates}
            encodedNumpyBase = json.dumps(base, default=lambda x: x.tolist())
            print(base)
            return {"board": encodedNumpyBase, "blocks": blocks}
        except:
            print("no solutions")


@router.post("/blocks", response_description="get blocks", response_model=List)
def blocks(body: List[List[int]]):
    print("blocks endpoint reached...")
    query_param = body
    combination, solution = find_good_combination(([(c[0], c[1]) for c in query_param]))
    return combination


@router.get("/users/me/", response_model=User)
async def read_users_me(
    current_user: Annotated[User, Depends(get_current_active_user)]
):
    return current_user


@router.put("/users/me/avatar", response_model=User)
async def upload_avatar(
    current_user: Annotated[User, Depends(get_current_active_user)],
    body: str = Body(...),
):
    print("data_fdound")

    # update self
    users.update_one(
        {"username": current_user.username},
        {"$set": {"avatar": body}},
    )

    # update friends
    users.update_many(
        {
            "username": {"$in": [f.username for f in current_user.friends]},
            "friends.username": current_user.username,
        },
        {"$set": {"friends.$.avatar": body}},
    )

    # update requested friends
    users.update_many(
        {
            "username": {"$in": [f.username for f in current_user.sentRequests]},
            "requests.username": current_user.username,
        },
        {"$set": {"requests.$.avatar": body}},
    )

    # update users who have sent request
    users.update_many(
        {
            "username": {"$in": [f.username for f in current_user.requests]},
            "sentRequests.username": current_user.username,
        },
        {"$set": {"sentRequests.$.avatar": body}},
    )

    print("len", len(body))
    return current_user


@router.get("/friend/{friend}", response_model=Friend)
async def get_friend(friend: str):
    friend = users.find_one({"username": friend})
    return friend


@router.get("/users/me/lobby", response_model=User)
async def read_users_me(
    current_user: Annotated[User, Depends(get_current_active_user)]
):
    return current_user


@router.put("/users/me/wins/{friend}", response_model=User)
async def update_user_wins(
    friend: str, current_user: User = Depends(get_current_active_user)
):
    users.update_one({"username": current_user.username}, {"$push": {"wins": friend}})
    users.update_one({"username": friend}, {"$push": {"loses": current_user.username}})
    return current_user


@router.put("/users/me/sentRequests/{request}", response_model=bool)
async def update_user_sentRequests(
    request: str, current_user: User = Depends(get_current_active_user)
):
    ## check if reques should be sent
    friend = Friend(**users.find_one({"username": request}))
    friend_dict = friend.to_dict()
    if not friend_dict or request in [
        *current_user.sentRequests,
        *current_user.friends,
    ]:
        return False

    user = convert_user_to_friend(current_user)
    user_dict = user.to_dict()

    if any([r.username == request for r in current_user.requests]):
        users.update_one(
            {"username": current_user.username},
            {
                "$pull": {
                    "sentRequests": {"username": friend.username},
                    "requests": {"username": friend.username},
                },
                "$push": {"friends": friend_dict},
            },
        )
        users.update_one(
            {"username": friend.username},
            {
                "$pull": {
                    "sentRequests": {"username": current_user.username},
                    "requests": {"username": current_user.username},
                },
                "$push": {"friends": user_dict},
            },
        )
        return False

    users.update_one(
        {"username": current_user.username},
        {"$push": {"sentRequests": friend_dict}},
    )
    print(request)
    print(current_user.username)
    users.update_one(
        {"username": friend.username},
        {"$push": {"requests": user_dict}},
    )
    return True


@router.put("/users/me/sentInvite/{invite}", response_model=bool)
async def update_user_sentRequests(
    invite: str, current_user: User = Depends(get_current_active_user)
):
    users.update_one(
        {"username": current_user.username},
        {
            "$push": {"sentInvite": invite},
        },
    )
    users.update_one(
        {"username": invite},
        {
            "$push": {"invites": current_user.username},
        },
    )
    return True


@router.put("/users/me/deleteFriend/{friend}", response_model=bool)
async def delete_friend(
    friend: str, current_user: User = Depends(get_current_active_user)
):
    users.update_one(
        {"username": current_user.username},
        {"$pull": {"friends": {"username": friend}}},
    )

    users.update_one(
        {"username": friend},
        {"$pull": {"friends": {"username": current_user.username}}},
    )
    return True


@router.put("/users/me/deleteSentRequest/{friend}", response_model=bool)
async def delete_sent_request(
    friend: str, current_user: User = Depends(get_current_active_user)
):
    users.update_one(
        {"username": current_user.username},
        {"$pull": {"sentRequests": {"username": friend}}},
    )

    users.update_one(
        {"username": friend},
        {"$pull": {"requests": {"username": current_user.username}}},
    )
    return True


@router.put("/users/me/deleteRequest/{friend}", response_model=bool)
async def delete_friend(
    friend: str, current_user: User = Depends(get_current_active_user)
):
    users.update_one(
        {"username": friend},
        {"$pull": {"sentRequests": {"username": current_user.username}}},
    )
    users.update_one(
        {"username": current_user.username},
        {"$pull": {"requests": {"username": friend}}},
    )
    return True


@router.post("/signup")
async def sign_up(form_data: OAuth2PasswordRequestForm = Depends()):
    hashed_password = get_password_hash(form_data.password)
    user_data = {
        "username": form_data.username,
        "hashed_password": hashed_password,
        "friends": [],
        "requests": [],
        "sentRequests": [],
        "wins": [],
        "lobby": "",
        "loses": [],
        "lobby": "",
        "avatar": "/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAFA3PEY8MlBGQUZaVVBfeMiCeG5uePWvuZHI////////////////////////////////////////////////////2wBDAVVaWnhpeOuCguv/////////////////////////////////////////////////////////////////////////wAARCAGSAhkDASIAAhEBAxEB/8QAGQABAQEBAQEAAAAAAAAAAAAAAAQDAQIF/8QALRABAAIBAgUDAwUAAwEAAAAAAAECAxExBBIhQVEycYEiUmETFEKRoTNisSP/xAAUAQEAAAAAAAAAAAAAAAAAAAAA/8QAFBEBAAAAAAAAAAAAAAAAAAAAAP/aAAwDAQACEQMRAD8AtAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABnfLSm9vgGgmtxX21+ZZWzZLfy09gWzMRvOjxObHH8o+EUzruArniaR5n4eZ4mO1Z/tMAo/df8AT/T91/0/1OAp/dR9v+uxxVO8TCUBXHEY576fDSL1ttaJ+UAD6I+fW9q7WmGteJvHqiJBWMa8RS2/0z+WsTExrE6g6AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADLJmrTpvPgGrG/EUr0j6pT5Mtsm89PEPANL5r376R4hmAAAAAAAAAAAAAAADtbWrOtZmHAFFOJna8fMN63reNazqgImazrE6SD6Imx8T2v/cKImJjWJ1gHQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAHJmKxrM6Q8ZMlccaz8QkyZLZJ1nbwDTLxE26U6R5YgAAAAAAAAAAAAAAAAAAAAAAA9UyWxzrWfh5AWYs1cn4nw1fOidJ1hThz6/TffyCgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABnlyxjjzPaDLljHXzM7QjtabTMzOsyBa03tradZcAAAAAAAAAAAAAAAAAAAAAAAAAAAAAG+HPy/TfbtPhU+c2wZuX6bbdp8ArAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAeMl4x11n4h2ZisTM7Qiy5JyW17doBy1pvaZndwAAAAAAAAAAAAAAAAAAAA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",
    }

    existing_user = users.find_one({"username": form_data.username})
    if existing_user:
        raise HTTPException(status_code=400, detail="Username already exists")

    users.insert_one(user_data)
    return {"message": "User created successfully"}


@router.post("/token", response_model=Token)
async def login_for_access_token(form_data: OAuth2PasswordRequestForm = Depends()):
    user = authenticate_user(users, form_data.username, form_data.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user.username}, expires_delta=access_token_expires
    )
    print("access_token", access_token)
    return {"access_token": access_token, "token_type": "bearer"}
