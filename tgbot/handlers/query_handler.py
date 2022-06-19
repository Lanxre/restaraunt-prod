from ast import Index
from aiogram import types
from aiogram.dispatcher import FSMContext
from dispatcher import dp, account, cart
from .states import *
from .base_logic import post_request, get_request
from aiogram.dispatcher.filters import Text
from datetime import datetime


@dp.callback_query_handler(Text(equals="cansel", ignore_case=True), state="*")
async def cansel_states(call: types.CallbackQuery, state: FSMContext):
    current_state = await state.get_state()
    if current_state:
        await state.finish()
        await call.message.answer('Отмена операции выполнена')
    else:
        await call.message.answer('Операция не начата')
        return


@dp.callback_query_handler(Text(equals="clear_cart", ignore_case=True))
async def clear_cart(call: types.CallbackQuery):
    cart.clear_cart(call.from_user.id)
    await call.message.answer('Корзина очищена')


@dp.callback_query_handler(Text(equals="is_not_auth", ignore_case=True))
async def is_not_auth(call: types.CallbackQuery):
    await call.message.answer('Вы не авторизованы')



async def show_cart(cart, message: types.Message):
    try:
        await message.answer('Ваша корзина:')
        for dish in cart:
            dish_name = await get_request(f'http://localhost:8000/api/dishes/{dish.dish_id}', 
                    headers={'Content-Type': 'application/json'})
            await message.answer(f'{dish_name.get("name")} - {dish.price}$. Количество: {dish.quantity}')

    except Exception as e:
        raise ValueError(f'Ошибка базы данных: {e}')



@dp.callback_query_handler(Text(equals="make_order", ignore_case=True))
async def make_order(call: types.CallbackQuery):
    try:
        user_products = cart.get_success_cart(call.from_user.id)
        if user_products:
            await show_cart(user_products, call.message)
            await call.message.answer(f'Всего: {sum(dish.price * dish.quantity for dish in user_products)}$')
            await call.message.answer('Ваш заказ принят!')

            order = await post_request(f'http://localhost:8000/api/orders/',
                    headers={'Content-Type': 'application/json',
                            "Authorization": f"Bearer {account.get_token(call.from_user.id)}"},
                    data={
                        "status": "Ожидание подтверждения",
                        "price": sum(dish.price * dish.quantity for dish in user_products),
                        "date" :f'{str(datetime.now().strftime("%d-%m-%Y"))}',

                    })
            user_data = await get_request("http://localhost:8000/api/users/me/",
             headers={"Authorization": f"Bearer {account.get_token(call.from_user.id)}"})

            await post_request('http://localhost:8000/api/order/menu-detail/',
                    headers={'Content-Type': 'application/json',
                            "Authorization": f"Bearer {account.get_token(call.from_user.id)}"},
                    data={
                        "data": [{
                            
                            "order_id": order.get("id"),
                            "dish_id": dish.dish_id,
                            "dish_type": dish.dish_type,
                            "user_id": user_data.get('user_id'),
                            "quantity": dish.quantity,
                            "total_price": dish.price * dish.quantity
                        } for dish in user_products]

                    })

            cart.clear_cart(call.from_user.id)
        else:
            await call.message.answer('Корзина пуста')

    except Exception as e:
        await call.message.answer('Ошибка при оформлении заказа' + str(e))


import re
@dp.callback_query_handler(lambda call: re.match('table_order_', call.data))
async def table_order(call: types.CallbackQuery):
    try:
        await call.message.answer('Ваш заказ принят!')
        table_id = int(call.data.split('_')[2])
        
        table = await get_request( url=f"http://localhost:8000/api/tables/{table_id}",
                                headers={"Content-Type": "application/json"})

        
        if table:
            order = await post_request(f'http://localhost:8000/api/orders/',
                    headers={'Content-Type': 'application/json',
                            "Authorization": f"Bearer {account.get_token(call.from_user.id)}"},
                    data={
                        "status": "Ожидание подтверждения",
                        "price": 10 if table_id <= 10 else 20,
                        "date" :f'{str(datetime.now().strftime("%d-%m-%Y"))}',

                    })
            user_data = await get_request("http://localhost:8000/api/users/me/",
                                            headers={"Authorization": f"Bearer {account.get_token(call.from_user.id)}"})
            await post_request('http://localhost:8000/api/order/table-detail/',
                                            headers={'Content-Type': 'application/json',
                                                    "Authorization": f"Bearer {account.get_token(call.from_user.id)}"},
                                            data={
                                                "data":[{
                                                    "order_id": order.get("id"),
                                                    "table_id": table_id,
                                                    "user_id": user_data.get('user_id'),

                                                }]
                                            })
            

        else:
            raise ValueError('Таблица не найдена')

    except IndexError:
        await call.message.answer('Ошибка при оформлении заказа')

    except Exception as e:
        await call.message.answer('Ошибка при оформлении заказа: ' + str(e).lower())



