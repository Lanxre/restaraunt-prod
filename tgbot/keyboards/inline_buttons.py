from aiogram import types


def get_inline_cansel_button():
    return types.InlineKeyboardMarkup(resize_keyboard=True)\
          .add(types.InlineKeyboardButton(text='Отмена', callback_data='cansel'))