from dataclasses import dataclass
from enum import Enum

@dataclass
class TGUSERS:
    id: int
    first_name: str
    last_name: str
    token: str
    account_uses: str


@dataclass
class Product:
    dish_id: int
    dish_type: int
    price: int
    quantity: int
    status: bool


class RoleType(Enum):
    Admin = 1, 'Администратор'
    Manager = 2, 'Менеджер'
    User = 3, 'Пользователь'

    def __new__(cls, value, name):
        member = object.__new__(cls)
        member._value_ = value
        member.type = name
        return member

    def __int__(self):
        return self.value
    

