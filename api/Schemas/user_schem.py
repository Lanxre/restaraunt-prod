import pydantic
import typing
from typing import Optional

class Token(pydantic.BaseModel):
    access_token: str
    token_type: str


class TokenData(pydantic.BaseModel):
    username: Optional[str] = None


class User(pydantic.BaseModel):
    user_id: str
    uesr_email: typing.Optional[str] = None
    user_login: Optional[str] = None
    user_password: Optional[str] = None
    role_id: Optional[int] = None
    class Config:
        orm_mode = True

class UserPanel(pydantic.BaseModel):
    user_id: str
    uesr_email: typing.Optional[str] = None
    user_login: Optional[str] = None
    role_id: Optional[int] = None
    class Config:
        orm_mode = True

class UserCreate(pydantic.BaseModel):
    username: str
    email: str
    password: str

    class Config:
        orm_mode = True



class UserInDB(User):
    hashed_password: str