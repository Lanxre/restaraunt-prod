from database import RoleType

phrases = {

    'is_auth': 'Вы уже авторизованы! Используйте команду /exit для выхода из системы аккаунта.',
    'is_not_auth': 'Вы не авторизованы! Используйте команду /start для начала работы с системой.',
    'input_pass' : 'Введите пароль аккаунта:',
    'input_login' : 'Введите логин аккаунта:',
    'input_email' : 'Введите email аккаунта:',
    'invalid_email' : 'Неверный формат email аккаунта!',

}

STICKERS = {
    'Hello' : 'CAACAgIAAxkBAAISrV9jK2iLT87OMPNYNR-6FEOWm8qrAAInAwACtXHaBg_03s-gxd3sGwQ',
    'Hi': 'CAACAgIAAxkBAAEFBXFiplQJIsGzQKgO5hKr2ytV-TARpQACQg4AAhDcqUs9X0s2c4fRbCQE',
    'Welcome' : 'CAACAgIAAxkBAAEFBW1iplH_p-ia5DyjEpC_BNIyBGFEowACmA4AAjqbqUu_R4Ll-uteSyQE',
    'Bye': 'CAACAgIAAxkBAAEFBW9iplM-5Ru5UK8M5rue0RdwKIGGWwACZA8AAmg7sUueVPH15mzfcSQE',
    'News': 'CAACAgIAAxkBAAEFCY1iqHnj9nqzpjfKOUbmI3qWSG9YaQAC8wsAAr6DsEsYqMtSuDpUUiQE'
}


ROLES = {
    RoleType.Admin.value : 'Администратор',
    RoleType.User.value : 'Пользователь',
    RoleType.Manager.value : 'Менеджер',
}