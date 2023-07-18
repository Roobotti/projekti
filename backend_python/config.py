from dotenv import load_dotenv
import os

load_dotenv(".env")

CONNECTION_STRING = os.getenv("CONNECTION_STRING")
