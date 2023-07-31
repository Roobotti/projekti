import jwt

from fastapi import APIRouter, Depends, Request, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from services import *
from config import ACCESS_TOKEN_EXPIRE_MINUTES
from typing import Optional
from pymongo_get_database import get_database
from typing import List
from solver import generate_base, find_good_combination
import random
import json
import numpy as np

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


@router.get("/solutions/{index}", response_description="get solution")
def solution_selected(index: int):
    coordinates = list(item_details[min(index, 71)].values())[1]
    base = {"base": generate_base(coordinates), "coordinates": coordinates}
    encodedNumpyBase = json.dumps(base, default=lambda x: x.tolist())
    print(base)
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


@router.get("/users/me/lobby", response_model=User)
async def read_users_me(
    current_user: Annotated[User, Depends(get_current_active_user)]
):
    return current_user


@router.put("/users/me/wins/{win}", response_model=User)
async def update_user_wins(
    win: str, current_user: User = Depends(get_current_active_user)
):
    await users.update_one(
        {"username": current_user.username},
        {"$push": {"wins": win}},
    )
    return current_user


@router.put("/users/me/requests/{request}", response_model=User)
async def update_user_requests(
    request: str, current_user: User = Depends(get_current_active_user)
):
    if request in current_user.friends:
        return current_user

    try:
        index = current_user.sentRequests.index(request)
    except:
        users.update_one(
            {"username": current_user.username},
            {"$push": {"requests": request}},
        )
    return current_user


@router.put("/users/me/sentRequests/{request}", response_model=bool)
async def update_user_sentRequests(
    request: str, current_user: User = Depends(get_current_active_user)
):
    ## check if reques should be sent
    if request in [*current_user.sentRequests, *current_user.friends]:
        return False

    found = True
    try:
        index = current_user.requests.index(request)
        newFriend = current_user.requests[index]
    except:
        found = False

    if found:
        users.update_one(
            {"username": current_user.username},
            {
                "$pull": {"sentRequests": newFriend, "requests": newFriend},
                "$push": {"friends": newFriend},
            },
        )
        users.update_one(
            {"username": newFriend},
            {
                "$pull": {
                    "sentRequests": current_user.username,
                    "requests": current_user.username,
                },
                "$push": {"friends": current_user.username},
            },
        )
        return False

    users.update_one(
        {"username": current_user.username},
        {"$push": {"sentRequests": request}},
    )
    print(request)
    print(current_user.username)
    users.update_one(
        {"username": request},
        {"$push": {"requests": current_user.username}},
    )
    return True


@router.put("/users/me/sentInvite/{request}", response_model=bool)
async def update_user_sentRequests(
    request: str, current_user: User = Depends(get_current_active_user)
):
    ## check if reques should be sent
    if request in [*current_user.sentRequests, *current_user.friends]:
        return False

    found = True
    try:
        index = current_user.requests.index(request)
        newFriend = current_user.requests[index]
    except:
        found = False

    if found:
        users.update_one(
            {"username": current_user.username},
            {
                "$pull": {"sentRequests": newFriend, "requests": newFriend},
                "$push": {"friends": newFriend},
            },
        )
        users.update_one(
            {"username": newFriend},
            {
                "$pull": {
                    "sentRequests": current_user.username,
                    "requests": current_user.username,
                },
                "$push": {"friends": current_user.username},
            },
        )
        return False

    users.update_one(
        {"username": current_user.username},
        {"$push": {"sentRequests": request}},
    )
    print(request)
    print(current_user.username)
    users.update_one(
        {"username": request},
        {"$push": {"requests": current_user.username}},
    )
    return True


@router.post("/signup")
def sign_up(form_data: OAuth2PasswordRequestForm = Depends()):
    hashed_password = get_password_hash(form_data.password)
    user_data = {
        "username": form_data.username,
        "hashed_password": hashed_password,
        "friends": [],
        "requests": [],
        "sentRequests": [],
        "wins": [],
        "lobby": "",
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
