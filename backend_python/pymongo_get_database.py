from pymongo import MongoClient
import certifi
from config import CONNECTION_STRING


def get_database():
    # Create a connection using MongoClient. You can import MongoClient or use pymongo.MongoClient
    client = MongoClient(CONNECTION_STRING, tlsCAFile=certifi.where())

    # Create the database for our example (we will use the same database throughout the tutorial
    return client["base"]


# This is added so that many files can reuse the function get_database()
if __name__ == "__main__":
    # Get the database
    print("hello")
    dbname = get_database()
