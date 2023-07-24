from dotenv import load_dotenv
import os

load_dotenv(".env")

ATLAS_URI = os.getenv("ATLAS_URI")
JWT_SECRET = os.getenv("JWT_SECRET")
JWT_ALGORITHM = os.getenv("JWT_ALGORITHM")
ACCESS_TOKEN_EXPIRE_MINUTES = 60 * 24 * 7
