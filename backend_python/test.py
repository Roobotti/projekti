from pymongo_get_database import get_database


import requests
import json


dbname = get_database()
collection_name = dbname["boards"]
item_details = collection_name.find()
collection_length = collection_name.count_documents({})


url = "http://localhost:6969/blocks"
url2 = "http://localhost:6969/board"

# Define the query parameter
query_param = [
    [0, 0],
    [1, 0],
    [2, 0],
    [3, 0],
    [1, 1],
    [2, 1],
    [3, 1],
    [4, 1],
    [1, 2],
    [2, 2],
]

serialized_param = json.dumps(query_param)

# Send a GET request to the server with the query parameter
response = requests.get(url, params={"param": serialized_param})

# Check the response status code
if response.status_code == 200:
    # Print the response data
    print(response.json())
else:
    # Print an error message if the request failed
    print("Request failed with status code:", response.status_code)
