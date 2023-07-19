from dotenv import load_dotenv
import os

load_dotenv(".env")

ATLAS_URI = os.getenv("ATLAS_URI")
