from aiogram import types
from dispatcher import dp, account
import aiogram.utils.markdown as fmt 
from base_text import ROLES
from .base_logic import get_request 



async def edit_text_procent(message: types.Message):
    for num in range(0, 100, 5):
            await message.edit_text(f'Ожидайте: {num}%')


@dp.message_handler(commands="profile")
async def profile(message: types.Message):
    if account.get_token(message.from_user.id):

        TOKEN = account.get_token(message.from_user.id)

        msg = await message.answer('Ожидайте:')
        await edit_text_procent(msg)


        user_data = await get_request("http://localhost:8000/api/users/me/",
             headers={"Authorization": f"Bearer {TOKEN}"})
        
        user_menu_detail_confirm = await get_request('http://localhost:8000/api/order/menu-detail-confirm',
            headers={"Authorization": f"Bearer {TOKEN}"})

        user_table_detail_confirm = await get_request('http://localhost:8000/api/order/table-detail-confirm',
            headers={"Authorization": f"Bearer {TOKEN}"})

        user_menu_detail_not_confirm = await get_request('http://localhost:8000/api/order/menu-detail-not-confirm',
            headers={"Authorization": f"Bearer {TOKEN}"})
        
        user_table_detail_not_confirm = await get_request('http://localhost:8000/api/order/table-detail-not-confirm',
            headers={"Authorization": f"Bearer {TOKEN}"})

        
        await msg.edit_text(
            fmt.hbold('{0:*^20s} {1} ***'.format(" Ваш профиль ", ROLES.get(user_data.get('role_id'))) + '\n\n')
            + fmt.hitalic('{:=^50s}'.format(' Логин '.upper())) + '\n\n'
            + fmt.hbold('{:>50}'.format(user_data.get('user_login'))) + '\n\n'
            + fmt.hitalic('{:=^50s}'.format(' Почта '.upper())) + '\n\n'
            + fmt.hspoiler('{:>50}'.format(user_data.get('uesr_email'))) + '\n\n'
            + '✅ Общее количество сделанных заказов:  ' + fmt.hbold(str(len(user_menu_detail_confirm))) + '\n\n'
            + '✅ Общее количество забранированных столов:  ' + fmt.hbold(str(len(user_table_detail_confirm))) +  '\n\n'
            + '❓ Не расмотренные заказы:  ' + fmt.hbold(str(len(user_menu_detail_not_confirm))) + '\n\n'
            + '❓ Не расмотренные брони:  ' + fmt.hbold(str(len(user_table_detail_not_confirm))) +  '\n\n'
            ,parse_mode='HTML')
    else:
        await message.answer('Вы не авторизованы! :(')
                