from api.Schemas import *
from api.models import models
from typing import Dict, List
import sqlalchemy.orm as orm




def _get_month_stats_dict(month_stats: List[int]) -> Dict[int, int]:
    month_id = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]
    month_stats_dict = dict(zip(month_id, month_stats))
    return month_stats_dict


def _get_initial_month_stats() -> List[int]:
    month_count = 12
    month_stats = [0] * month_count
    return month_stats

def _get_moth_stats_list(month_stats: List[int], orders, db: orm.Session) -> List[int]:

    for order in orders:
        month_index = order.date.split('-')[1]
        month_stats[int(month_index) - 1] += len(db.query(models.Order).filter(models.Order.id == order.id).all())

    return month_stats

async def get_sales_statistics(db: orm.Session):
    """
    Get sales statistics
    """

    orders = db.query(models.Order).all()
    orders_confirmed = db.query(models.Order).filter(models.Order.status == 'Потверждено').all()
    

    return {"total_sales_stats":_get_month_stats_dict(_get_moth_stats_list(_get_initial_month_stats(), orders, db)),
            "total_confirmed_sales_stats":_get_month_stats_dict(_get_moth_stats_list(_get_initial_month_stats(), orders_confirmed, db))}


async def get_booking_statistics(db: orm.Session):
    """
    Get booking statistics
    """
    month_stats = _get_initial_month_stats()

    orders = db.query(models.Order).filter(models.Order.status == 'Потверждено').all()

    for order in orders:
        month_index = order.date.split('-')[1]
        if(db.query(models.OrderDetailTable).filter(models.OrderDetailTable.order_id == order.id).first()):
            month_stats[int(month_index) - 1] += 1
    

    return {"total_booking_stats":_get_month_stats_dict(month_stats)}



async def get_order_statistics(db: orm.Session):
    """
    Get orders statistics
    """
    month_stats = _get_initial_month_stats()
    orders = db.query(models.Order).filter(models.Order.status == 'Потверждено').all()

    for order in orders:
        month_index = order.date.split('-')[1]
        if(db.query(models.OrderDetailMenu).filter(models.OrderDetailMenu.order_id == order.id).first()):
            month_stats[int(month_index) - 1] += 1
        


    return {"total_orders_stats":_get_month_stats_dict(month_stats)}