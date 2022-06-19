from dispatcher import account
import aiohttp
import requests


""" 

    REQUESTS:

    get_request: Функция для получения данных с сервера
    post_request: Функция для отправки данных на сервер

"""

async def get_request(url: str, headers: dict) -> requests.Response:
    async with aiohttp.ClientSession(headers=headers) as session:
        async with session.get(url) as response:
            return await response.json()


async def post_request(url: str, headers: dict, data: dict) -> requests.Response:
    async with aiohttp.ClientSession(headers=headers) as session:
        async with session.post(url, json=data) as response:
            return await response.json()





"""

Accounts:

is_token_valid: проверяет валидность токена, если валидный, то обновляет аккаунт
is_email_valid: проверяет валидность email

Password: проверяет пароль на валидность

"""


def is_token_valid(user_responce: requests.Response, user_id: int) -> bool:
    return account.update_user_account(
            user_id = user_id,
            token = user_responce.json().get('access_token'),
            account_uses = 1
        )
        
    
def is_email_valid(email: str) -> bool:
    if '@' in email:
        return True
    else:
        return False


class Password:
    def __init__(self, password: str):
        if self.is_valid(password):
            self.password = password
        else:
            raise ValueError('Password is not valid')

    def __str__(self):
        return self.password
    

    def is_valid(self, value: str) -> bool:
        if self._is_len(value) and self._is_has_number(value) and self._is_upper(value):
            return True


    def _is_len(self, value: str) -> bool:
        if len(value) >= 5 and len(value) <= 10:
            return True
        else:
            raise ValueError('Длина пароля должна быть от 5 до 10 символов')
    
    def _is_has_number(self, value: str) -> bool:
        if any(char.isdigit() for char in value):
            return True
        else:
            raise ValueError('В пароле должна быть хотя бы одна цифра')
    
    def _is_upper(self, value: str) -> bool:
        if any(char.isupper() for char in value):
            return True
        else:
            raise ValueError('В пароле должна быть хотя бы одна заглавная буква')

    def is_strong(self) -> bool:
        if self.password.isalnum():
            return True
        else:
            return False
        

