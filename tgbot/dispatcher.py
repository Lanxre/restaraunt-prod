from aiogram import Bot, Dispatcher
from aiogram.contrib.fsm_storage.memory import MemoryStorage
from database import Database, AccountWorkRepository, AccountController, Cart
import config


if not config.BOT_TOKEN:
    exit("No token provided")


storage = MemoryStorage()

database = Database(config.DB_NAME)
account: AccountController  = AccountController(AccountWorkRepository(database))
cart: Cart = Cart(database)
bot = Bot(token=config.BOT_TOKEN, parse_mode="HTML")
dp = Dispatcher(bot, storage=storage)