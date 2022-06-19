from aiogram import types
from dispatcher import dp
import aiogram.utils.markdown as fmt 
from base_text import *
from .base_logic import get_request 


@dp.message_handler(commands="news")
async def news(message: types.Message):
    news = await get_request(url='http://localhost:8000/api/news',
                    headers={"Content-Type": "application/json"})


    if news:
        msg = '\n'.join([fmt.hbold(news_item.get('date')) + ':' + news_item.get('article') for news_item in news[-5:]])
        await message.answer('{:=^50s}'.format(' Новости ') + '\n\n' + msg)
        await dp.bot.send_sticker(message.chat.id, STICKERS.get('News'))
    else:
        await message.answer(f'Не удалось получить новостную ленту')