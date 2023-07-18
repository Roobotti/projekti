from pymongo_get_database import get_database
from pandas import DataFrame
from solver import generate_base
import requests

dbname = get_database()
collection_name = dbname["boards"]
item_details = collection_name.find()
collection_length = collection_name.count_documents({})


# Define the URL of the Flask server
url = "http://localhost:6969/blocks"
url2 = "http://localhost:6969/board"

# Define the query parameter
query_param = [
    (0, 0),
    (1, 0),
    (2, 0),
    (3, 0),
    (1, 1),
    (2, 1),
    (3, 1),
    (4, 1),
    (1, 2),
    (2, 2),
]

# Send a GET request to the server with the query parameter
res = requests.get(url2).json()
coordinates = [(c[0], c[1]) for c in res["coordinates"]]
print(coordinates)
response = requests.get(url, params={"param": coordinates})

# Check the response status code
if response.status_code == 200:
    # Print the response data
    print(response.json())
else:
    # Print an error message if the request failed
    print("Request failed with status code:", response.status_code)
