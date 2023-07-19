from fastapi import APIRouter, Request
from pymongo_get_database import get_database
from typing import List
from solver import generate_base, find_good_combination
import random
import json
import numpy as np

router = APIRouter()

dbname = get_database()
collection_name = dbname["boards"]
item_details = collection_name.find()
collection_length = collection_name.count_documents({})


@router.get("/board", response_description="get board")
def board():
    random_int = random.randint(0, collection_length - 1)
    print("board endpoint reached...")
    coordinates = list(item_details[random_int].values())[1]
    base = {"base": generate_base(coordinates), "coordinates": coordinates}
    encodedNumpyBase = json.dumps(base, default=lambda x: x.tolist())
    print(base)
    return encodedNumpyBase


@router.post("/blocks", response_description="get blocks", response_model=List)
def blocks(body: List[List[int]]):
    print("blocks endpoint reached...")
    query_param = body
    combination, solution = find_good_combination(([(c[0], c[1]) for c in query_param]))
    return combination
