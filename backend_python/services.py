from datetime import datetime, timedelta
from typing_extensions import Annotated

from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from jose import JWTError, jwt
from passlib.context import CryptContext
from pydantic import BaseModel
from pymongo_get_database import get_database

from config import JWT_SECRET, JWT_ALGORITHM

dbname = get_database()
users = dbname["users"]


class SignUpRequest(BaseModel):
    username: str
    password: str


class SolutionRequest(BaseModel):
    board: list[list[int]]
    blocks: list[str]


class Token(BaseModel):
    access_token: str
    token_type: str


class TokenData(BaseModel):
    username: str | None = None


class Avatar(BaseModel):
    image_data: str


class Friend(BaseModel):
    username: str
    avatar: str
    wins: list[str]
    loses: list[str]

    def to_dict(self):
        return self.dict()


class User(BaseModel):
    username: str
    friends: list[Friend]
    requests: list[Friend]
    sentRequests: list[Friend]
    wins: list[str]
    loses: list[str]
    lobby: str
    avatar: str
    disabled: bool | None = None

    def json(self, *args, **kwargs):
        return super().json(*args, **kwargs, exclude_none=True, by_alias=True)


class UserInDB(User):
    hashed_password: str


pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="api/token")


def convert_user_to_friend(user: User) -> Friend:
    friend = Friend(
        username=user.username, avatar=user.avatar, wins=user.wins, loses=user.loses
    )
    return friend


def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)


def get_password_hash(password):
    return pwd_context.hash(password)


def get_user(db, username: str):
    user = db.find_one({"username": username})
    if user:
        return UserInDB(**user)


def authenticate_user(users, username: str, password: str):
    user = get_user(users, username)
    print("user.hashed_password", user.hashed_password)
    if not user:
        return False
    if not verify_password(password, user.hashed_password):
        return False
    return user


def create_access_token(data: dict, expires_delta: timedelta | None = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=15)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, JWT_SECRET, algorithm=JWT_ALGORITHM)
    return encoded_jwt


async def get_current_user(token: Annotated[str, Depends(oauth2_scheme)]):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, JWT_SECRET, algorithms=[JWT_ALGORITHM])
        username: str = payload.get("sub")
        if username is None:
            raise credentials_exception
        token_data = TokenData(username=username)
    except JWTError:
        raise credentials_exception
    user = get_user(users, username=token_data.username)
    if user is None:
        raise credentials_exception
    return user


async def get_current_active_user(
    current_user: Annotated[User, Depends(get_current_user)]
):
    if current_user.disabled:
        print("inactive")
    return current_user
