from flask import Flask, jsonify, Request

from pymongo_get_database import get_database
from pandas import DataFrame
from solver import generate_base, find_good_combination
import random

import json
from json import JSONEncoder
import numpy

dbname = get_database()
collection_name = dbname["boards"]
item_details = collection_name.find()
collection_length = collection_name.count_documents({})
random_int = random.randint(0, collection_length - 1)


class NumpyArrayEncoder(JSONEncoder):
    def default(self, obj):
        if isinstance(obj, numpy.ndarray):
            return obj.tolist()
        return JSONEncoder.default(self, obj)


app = Flask(__name__)


@app.route("/")
def hello():
    return "Hello, World!"


@app.route("/board", methods=["GET"])
def board():
    print("board endpoint reached...")
    coordinates = list(item_details[random_int].values())[1]
    base = {"base": generate_base(coordinates), "coordinates": coordinates}
    encodedNumpyBase = json.dumps(base, cls=NumpyArrayEncoder)
    print(base)
    return encodedNumpyBase


@app.route("/blocks", methods=["GET"])
def blocks(request: Request):
    print("blocks endpoint reached...")
    query_param = request.args.get("param")
    combination, solution = find_good_combination(query_param)

    return jsonify(combination)


if __name__ == "__main__":
    app.run("localhost", 6969)
