from aiogram import types


async def set_default_commands(dp):
    await dp.bot.set_my_commands([
        types.BotCommand("start", "Начать использование бота"),
        types.BotCommand("exit", "Выйти из аккаунта"),
        types.BotCommand("profile", "Профиль"),
        types.BotCommand("account", "Войти в аккаунт системы"),
        types.BotCommand("newaccount", "Создать аккаунт системы"),
        types.BotCommand("cansel", "Отмена операции"),
        types.BotCommand("news", "Новости компании"),
        types.BotCommand("tables", "Показать доступные столы"),
        types.BotCommand("dishes", "Показать меню блюд"),
    ])

