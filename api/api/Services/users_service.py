from datetime import datetime, timedelta

from fastapi import Depends, FastAPI, HTTPException, status
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from jose import JWTError, jwt
from passlib.context import CryptContext

from ..Schemas import *
from ..models import models
from ..database.database import SessionLocal

import sqlalchemy.orm as orm

SECRET_KEY = "09d25e094faa6ca2556c818166b7a9563b93f7099f6f0f4caa6cf63b88e8d3e7"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30


pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/token")

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)


def get_password_hash(password):
    return pwd_context.hash(password)


def authenticate_user(db, username: str, password: str):
    user = get_user_by_email(username, db)
    if not user:
        return False

    if not verify_password(password, user.user_password):
        return False
    return user


def create_access_token(data: dict):
    to_encode = data.copy()
    encoded_jwt = jwt.encode(to_encode.dict(), SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt


async def get_current_user(
        db: orm.Session = Depends(get_db),
        token: str = Depends(oauth2_scheme),
):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=["HS256"])
        user = db.query(models.User).get(payload["user_id"])
    except:
        raise HTTPException(
            status_code=401, detail="Invalid Email or Password"
        )
    return User.from_orm(user)


def get_user_by_email(email: str, db: orm.Session):
    return db.query(models.User).filter(models.User.uesr_email == email).first()

async def get_all_users_db(db: orm.Session):
    return db.query(models.User).all()

async def get_user_by_id_db(db: orm.Session, user_id: int):
    return db.query(models.User).get(user_id)


async def create_user_db(user: UserCreate, db: orm.Session):
    user_obj = models.User(
        user_login=user.username,
        uesr_email=user.email,
        user_password=get_password_hash(user.password),
        role_id=3
    )
    db.add(user_obj)
    db.commit()
    return user_obj

async def update_user_db(email: str, new_user: User, db: orm.Session):
    old_user = get_user_by_email(email, db)
    old_user.user_login = new_user.username
    old_user.user_password = new_user.password
    db.commit()
    return old_user