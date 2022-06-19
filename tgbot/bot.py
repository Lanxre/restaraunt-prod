from aiogram import executor
from dispatcher import dp


from handlers import *

async def on_startup(dispatcher):
    from commands import set_default_commands
    await set_default_commands(dispatcher)


if __name__ == "__main__":
    print('Bot started')
    executor.start_polling(dp, on_startup=on_startup)
