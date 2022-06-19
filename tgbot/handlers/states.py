from aiogram.dispatcher.filters.state import State, StatesGroup

class FSMAuth(StatesGroup):
    email = State()
    password = State()

class FSMRegister(StatesGroup):
    email = State()
    login = State()
    password = State()

