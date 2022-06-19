from aiogram import types
from database import Product
from dispatcher import dp, account, cart
import aiogram.utils.markdown as fmt 
from base_text import *
from .base_logic import get_request 
from aiogram.utils.callback_data import CallbackData


call_card = CallbackData('add_to_card', "dish_id", "dish_type", "price", "quantity")

@dp.inline_handler(lambda query: query.query == "menu")
async def menu_inline(query: types.InlineQuery):
    menu = await get_request('http://localhost:8000/api/dishes',
                             headers={"Content-Type": "application/json"})
    
    if menu:
        if account.get_token(query.from_user.id):
            articles = [types.InlineQueryResultArticle(
            id=str(i),
            title=menu_item.get('name'),
            input_message_content=types.InputTextMessageContent(
                fmt.hbold(menu_item.get('name')) + '\n'
                 + (menu_item.get('description') if menu_item.get('description') != None else 'Нет описания!')
                 + '\n' + fmt.hbold('Цена: ') + menu_item.get('price') + '$'
            ),
            hide_url=False,
            description=(menu_item.get('description') if menu_item.get('description') != None else 'Нет описания!'),

            thumb_url='https://www.gastronom.ru/binfiles/images/20191113/b50e9f2a.jpg',
            reply_markup=types.InlineKeyboardMarkup().add(
                types.InlineKeyboardButton(
                    text='Заказать',
                    callback_data= call_card.new(dish_id=menu_item.get('id'),dish_type=menu_item.get('type'),
                                                price=menu_item.get('price'),quantity=1)
                    
            ))

            ) for i, menu_item in enumerate(menu)]
        else:
            articles = [types.InlineQueryResultArticle(
            id=str(i),
            title=menu_item.get('name'),
            input_message_content=types.InputTextMessageContent(
                fmt.hbold(menu_item.get('name')) + '\n'
                 + (menu_item.get('description') if menu_item.get('description') != None else 'Нет описания!')
                 + '\n' + fmt.hbold('Цена: ') + menu_item.get('price') + '$'
            ),
            hide_url=False,
            description=(menu_item.get('description') if menu_item.get('description') != None else 'Нет описания!'),

            thumb_url='https://www.gastronom.ru/binfiles/images/20191113/b50e9f2a.jpg',

            ) for i, menu_item in enumerate(menu)]

            
        

        await query.answer(articles, cache_time=60)

    else:
        await query.answer(f'Не удалось получить меню')


@dp.callback_query_handler(call_card.filter())
async def add_to_card(callback_query: types.CallbackQuery, callback_data: dict):
    cart.add_to_cart(
        callback_query.from_user.id,
        Product(
            dish_id=callback_data.get('dish_id'),
            dish_type=callback_data.get('dish_type'),
            price=callback_data.get('price'),
            quantity=callback_data.get('quantity'),
            status=0
        )
    )
    await dp.bot.send_message(
        chat_id=callback_query.from_user.id,
        text=f'Введите: "id: {callback_data.get("dish_id")} Добавить: №", где № - количество порций',
        reply_markup=types.ForceReply(selective=True)
    )
    
    await callback_query.answer()
    

