from aiogram import types
from aiogram.dispatcher import FSMContext
from dispatcher import dp, account
from .states import FSMAuth
from keyboards import get_inline_cansel_button
from base_text import *
import requests
import json



@dp.message_handler(state='*', commands="cansel")
@dp.message_handler(commands="Account", state=None)
async def set_account(message: types.Message):
    if not account.get_token(message.from_user.id):
        await message.answer(phrases.get('input_email'), reply_markup=get_inline_cansel_button())
        await FSMAuth.email.set()
    else:
        await message.answer(phrases.get('is_auth'))


@dp.message_handler(state='*', commands="cansel")
@dp.message_handler(state=FSMAuth.email)
async def set_login(message: types.Message, state: FSMContext):
    from .base_logic import is_email_valid
    async with state.proxy() as data:
        if is_email_valid(message.text):
            data['email'] = message.text
            await FSMAuth.next()
            await message.answer(phrases.get('input_pass'), reply_markup=get_inline_cansel_button())
        else:
            await message.answer(phrases.get('invalid_email'))


@dp.message_handler(state='*', commands="cansel")
@dp.message_handler(state=FSMAuth.password)
async def set_pass(message: types.Message, state: FSMContext):
    from .base_logic import is_token_valid
    async with state.proxy() as data:
        
        try:
            data['password'] = message.text

            user_responce = requests.post("http://localhost:8000/api/token",
         json=json.dumps(f"grant_type=&username={data.get('email')}&password={data.get('password')}&scope=&client_id=&client_secret="),
         headers={"Content-Type": "application/x-www-form-urlencoded"})
         
         

            if is_token_valid(user_responce, message.from_user.id):
                await message.answer(f'Аккаунт успешно авторизован')
                await dp.bot.send_sticker(message.chat.id, STICKERS['Hi'])
        
            else:
                await message.answer(f'Неверный логин или пароль')
        
        except Exception:
            await state.finish()
            await message.answer(f'Неверный логин или пароль')
    
    await state.finish()