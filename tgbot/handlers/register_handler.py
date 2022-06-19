from aiogram import types
from aiogram.dispatcher import FSMContext
from dispatcher import dp, account
from .states import FSMRegister
from keyboards import get_inline_cansel_button
from base_text import phrases
import requests
import json


@dp.message_handler(state='*', commands="cansel")
@dp.message_handler(commands="NewAccount", state=None)
async def new_account(message: types.Message):
    if not account.get_token(message.from_user.id):
        await message.answer(phrases.get('input_email'), reply_markup=get_inline_cansel_button())
        await FSMRegister.email.set()
    else:
        await message.answer(phrases.get('is_auth'))


@dp.message_handler(state='*', commands="cansel")
@dp.message_handler(state=FSMRegister.email)
async def set_email(message: types.Message, state: FSMContext):
    from .base_logic import is_email_valid
    async with state.proxy() as data:
        if is_email_valid(message.text):
            data['email'] = message.text
            await FSMRegister.next()
            await message.answer(phrases.get('input_login'), reply_markup=get_inline_cansel_button())
        else:
            await message.answer(phrases.get('invalid_email'))


@dp.message_handler(state='*', commands="cansel")
@dp.message_handler(state=FSMRegister.login)
async def set_login(message: types.Message, state: FSMContext):
    async with state.proxy() as data:
        data['login'] = message.text

    await FSMRegister.next()
    await message.answer(phrases.get('input_pass'), reply_markup=get_inline_cansel_button())


@dp.message_handler(state='*', commands="cansel")
@dp.message_handler(state=FSMRegister.password)
async def set_passw(message: types.Message, state: FSMContext):
    from .base_logic import is_token_valid, Password
    async with state.proxy() as data:
        try:
            password = Password(message.text)
            data['password'] = str(password)
        
            user_responce = requests.post("http://127.0.0.1:8000/api/users",
                data=json.dumps({
                    "username": data.get('login'),
                    "email": data.get('email'),
                    "password": data.get('password')
                }),
                headers={"Content-Type": "application/json"}
            )

            if is_token_valid(user_responce, message.from_user.id):

                await message.answer(f'Аккаунт успешно зарегистрирован и авторизован !')
            
            else:
                await state.finish()
                await message.answer(f'Аккаунт с такой почтой уже существует!')

        except Exception as e:
            await state.finish()
            await message.answer(f'Ошибка: {e}')


