from pymongo import MongoClient
import certifi
from config import ATLAS_URI


def get_database():
    client = MongoClient(ATLAS_URI, tlsCAFile=certifi.where())
    return client["base"]


# This is added so that many files can reuse the function get_database()
if __name__ == "__main__":
    dbname = get_database()
