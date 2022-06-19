from aiogram import types


def get_cansel_button():
    return types.ReplyKeyboardMarkup(resize_keyboard=True)\
          .add(types.InlineKeyboardButton(text='Отмена', callback_data='cansel'))
