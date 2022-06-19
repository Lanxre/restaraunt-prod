from aiogram import types
from dispatcher import dp, account, cart
from base_text import *
from .base_logic import get_request
import aiogram.utils.markdown as fmt 


@dp.message_handler(commands="start")
async def start(message: types.Message):
    
    if not account.get_user_account(message.from_user.id):
        
        account.create_user_account(
            user_id=message.from_user.id,
            first_name=message.from_user.first_name,
            last_name=message.from_user.last_name
        )
    

    if not account.get_token(message.from_user.id):

        user_name = f'{message.from_user.first_name} {message.from_user.last_name}' if any([message.from_user.first_name,
        message.from_user.last_name]) else message.from_user.username

        await message.answer(
        f'{fmt.bold(f"Здраствуй {user_name}, я телеграмм бот системы LanoreCorp")}\n\n\n'
        f'{fmt.italic("Для использования своего аккаунта системы:")}\n/Account\n'
        f'{fmt.italic("Для создания нового аккаунта системы:")}\n/NewAccount\n', parse_mode="markdown")

        await dp.bot.send_sticker(message.chat.id, STICKERS['Hello'])
    
    else:
        await message.answer(
        f'{fmt.bold(f"Здраствуй  {message.from_user.first_name} {message.from_user.last_name}, я телеграмм бот системы LanoreCorp")}\n\n\n'
        f'{fmt.italic("Для выхода из аккаунта системы используй:")}\n/exit\n'
        f'{fmt.italic("Для просмотра своего профиля:")}\n/profile\n', parse_mode="markdown")

        await dp.bot.send_sticker(message.chat.id, STICKERS['Welcome'])



@dp.message_handler(commands="exit")
async def exit(message: types.Message):
    if account.get_token(message.from_user.id):
        account.logout(message.from_user.id)
        await message.answer('Вы вышли из системы аккаунта.')
        await dp.bot.send_sticker(message.chat.id, STICKERS['Bye'])
    else:
        await message.answer('Вы не авторизованы!')

@dp.message_handler(commands="dishes")
async def dishes(message: types.Message):
    await message.answer('Нажми на кнопку для просмотра меню', reply_markup=types.InlineKeyboardMarkup()
    .add(types.InlineKeyboardButton(text="Просмотреть меню",
                                    switch_inline_query_current_chat='menu',)))


import re
@dp.message_handler(lambda message: re.search('Добавить:', message.text))
async def add_to_card(message: types.Message):
    try:
        dish_id = int(message.text.split(' ')[1])
        is_dish_exist = await get_request(f"http://localhost:8000/api/dishes/{dish_id}", headers={"Content-Type": "application/json"})
        quantity = int(message.text.split(' ')[3])
        
        if is_dish_exist.get('detail'):
            raise Exception('Блюдо не найдено')

        if quantity > 0 and quantity < 100:
            cart.update_user_cart(
                user_id=message.from_user.id,
                quantity=quantity,
                status = 1,
                dish_id=dish_id
            )
            await message.answer(f'Вы добавили {is_dish_exist.get("name")} количество {quantity} порций в корзину',
                                 reply_markup=types.InlineKeyboardMarkup(
                                    inline_keyboard=[
                                        [
                                            types.InlineKeyboardButton(text='Оформить заказ', callback_data='make_order'),
                                            types.InlineKeyboardButton(text='Продолжить покупки', switch_inline_query_current_chat='menu'),
                                            types.InlineKeyboardButton(text='Очистить корзину', callback_data='clear_cart')
                                        ]
                                    ]
                                 ))
        else:
            await message.answer('Такого блюда нет в меню')

    except ValueError:
        await message.answer(f'Некорректное количество')

    except IndexError:
        await message.answer(f'Некорректное количество, правильный формат запроса: id:q <id блюда> Добавить: <количество>')
    
    except Exception as e:
        await message.answer(f'Что-то пошло не так! Возможно: {str(e).lower()}')




@dp.message_handler(commands="tables")
async def tables(message: types.Message):
    try:
        tables = await get_request( url="http://localhost:8000/api/tables/",
                                headers={"Content-Type": "application/json",
                                         "Authorization": f"Token {account.get_token(message.from_user.id)}"})

        if isinstance(tables, dict):
            raise Exception('Таблицы не найдены')

        buttons = [types.InlineKeyboardButton(text=f'Стол №{table.get("table_id")}', callback_data=(f'table_order_{table.get("table_id")}'\
        if account.get_token(message.from_user.id) else 'is_not_auth'))\
                    for table in tables if table.get("table_availability") == str(True)]

        
        await message.answer('Доступные столы для брони:', reply_markup=types.InlineKeyboardMarkup(inline_keyboard=[[button] for button in buttons]))

    except Exception as e:
        await message.answer(f'Что-то пошло не так! Возможно: {str(e).lower()}')
