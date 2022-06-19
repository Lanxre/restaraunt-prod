import sqlalchemy.orm
from fastapi import Depends, FastAPI, HTTPException, status
from api.Schemas import *
from api.models import models
import sqlalchemy.orm as orm
import random

async def add_orders_details(db, orders_details: OrderTableDetailSchemeList):
	for detail in orders_details.data:
		db.add(
			models.OrderDetailTable(
				order_id=detail.order_id,
				table_id=detail.table_id,
				user_id=detail.user_id,
			)
		)

	db.commit()
	return orders_details


async def add_orders_menu_details(db, orders_details: OrderMenuDetailSchemeList):
	for detail in orders_details.data:
		db.add(
			models.OrderDetailMenu(
				order_id=detail.order_id,
				dish_id=detail.dish_id,
				dish_type=detail.dish_type,
				user_id=detail.user_id,
				quantity=detail.quantity,
				total_price=detail.total_price,

			)
		)

	db.commit()
	return orders_details


async def get_dish_by_type(db, dish_id: int, type_id: int):
	dish = db.query(models.Dish).filter(models.Dish.type == type_id)[dish_id]
	return dish


async def get_not_confirmed_order_menu_by_user_id(db, user_id: int):
	order_menu = db.query(models.OrderDetailMenu).filter(models.OrderDetailMenu.user_id == user_id,
	                                                     models.OrderDetailMenu.manager_id == None,
	                                                     models.OrderDetailMenu.sale_person_id == None)

	if order_menu is None:
		raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Order not found")

	unique_list_order_id = set()
	[unique_list_order_id.add(obj.order_id) for obj in order_menu if obj.order_id not in order_menu]
	unique_list_order_id = list(unique_list_order_id)

	order_list_info = []
	for order_id in unique_list_order_id:
		order_info = db.query(models.Order).filter(models.Order.id == order_id,
		                                           models.Order.status == 'Ожидание подтверждения').first()
		order_list_info.append(order_info)


	if order_list_info is None:
		raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Order detail not found")

	order_list_send = []
	i = 0
	for order_info in order_list_info:

		if order_info is None:
			raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Order detail not found")

		order_send = {
			"id": unique_list_order_id[i],
			"status": order_info.status,
			"date": order_info.date,
			"price": order_info.price,
			"details": [{
				"dish_name": db.query(models.Dish).filter(models.Dish.type == detail.dish_type)[detail.dish_id].name,
				'quantity': detail.quantity,
				'total_price': detail.total_price,
			} for detail in db.query(models.OrderDetailMenu).filter(models.OrderDetailMenu.order_id == unique_list_order_id[i])]
		}
		i += 1
		order_list_send.append(order_send)


	return order_list_send



async def get_confirmed_order_menu_by_user_id(db, user_id: int):
	order_menu = db.query(models.OrderDetailMenu).filter(models.OrderDetailMenu.user_id == user_id,
	                                                     models.OrderDetailMenu.manager_id != None,
	                                                     models.OrderDetailMenu.sale_person_id != None)

	if order_menu is None:
		raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Order not found")

	unique_list_order_id = set()
	[unique_list_order_id.add(obj.order_id) for obj in order_menu if obj.order_id not in order_menu]
	unique_list_order_id = list(unique_list_order_id)


	order_list_info = []
	for order_id in unique_list_order_id:
		order_info = db.query(models.Order).filter(models.Order.id == order_id,
		                                           models.Order.status == 'Потверждено').first()
		order_list_info.append(order_info)


	if order_list_info is None:
		raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Order detail not found")

	order_list_send = []
	i = 0
	for order_info in order_list_info:

		if order_info is None:
			raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Order detail not found")

		manager = db.query(models.ManagerPerson).get(db.query(models.OrderDetailMenu).filter(
									models.OrderDetailMenu.order_id == unique_list_order_id[i]
									).first().manager_id)
		sale_person = db.query(models.SalePerson).get(db.query(models.OrderDetailMenu).filter(
			models.OrderDetailMenu.order_id == unique_list_order_id[i]
		).first().sale_person_id)
		order_send = {
			"id": unique_list_order_id[i],
			"status": order_info.status,
			"date": order_info.date,
			"price": order_info.price,
			"manager": manager.FirstName + ' ' + manager.LastName,
			"sale_person": sale_person.FirstName + ' ' + sale_person.LastName,
			"details": [{
				"dish_name": db.query(models.Dish).filter(models.Dish.type == detail.dish_type)[detail.dish_id].name,
				'quantity': detail.quantity,
				'total_price': detail.total_price,
			} for detail in db.query(models.OrderDetailMenu).filter(models.OrderDetailMenu.order_id == unique_list_order_id[i])]
		}
		i += 1
		order_list_send.append(order_send)


	return order_list_send


async def get_order_table_details_not_confirm(db, user_id: int):
	order_table_details = db.query(models.OrderDetailTable).filter(models.OrderDetailTable.user_id == user_id,
	                                                     models.OrderDetailTable.manager_id == None,
	                                                     models.OrderDetailTable.sale_person_id == None)

	if order_table_details is None:
		raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Order not found")
	
	
	unique_list_order_id = set()
	[unique_list_order_id.add(obj.order_id) for obj in order_table_details if obj.order_id not in order_table_details]
	unique_list_order_id = list(unique_list_order_id)

	order_list_info = []
	for order_id in unique_list_order_id:
		order_info = db.query(models.Order).filter(models.Order.id == order_id,
		                                           models.Order.status == 'Ожидание подтверждения').first()
		order_list_info.append(order_info)

	if order_list_info is None:
		raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Order detail not found")

	order_list_send = []
	i = 0
	for order_info in order_list_info:
		if order_info is None:
			raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Order detail not found")

		order_send = {
			"id": unique_list_order_id[i],
			"status": order_info.status,
			"date": order_info.date,
			"price": order_info.price,
			"details": [{
				"table_id": detail.table_id,
			} for detail in db.query(models.OrderDetailTable).filter(models.OrderDetailTable.order_id == unique_list_order_id[i])]
		}
		i += 1
		order_list_send.append(order_send)

	return order_list_send


async def get_order_table_details_confirm(db, user_id: int):
	order_table_details = db.query(models.OrderDetailTable).filter(models.OrderDetailTable.user_id == user_id,
	                                                               models.OrderDetailTable.manager_id != None,
	                                                               models.OrderDetailTable.sale_person_id != None)

	if order_table_details is None:
		raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Order not found")

	unique_list_order_id = set()
	[unique_list_order_id.add(obj.order_id) for obj in order_table_details if obj.order_id not in order_table_details]
	unique_list_order_id = list(unique_list_order_id)

	order_list_info = []
	for order_id in unique_list_order_id:
		order_info = db.query(models.Order).filter(models.Order.id == order_id,
		                                           models.Order.status == 'Потверждено').first()
		if order_info is not None:
			order_list_info.append(order_info)

	if order_list_info is None:
		raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Order detail not found")

	order_list_send = []
	i = 0
	for order_info in order_list_info:
		if order_info is None:
			raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Order detail not found")

		manager = db.query(models.ManagerPerson).get(db.query(models.OrderDetailTable).filter(
			models.OrderDetailTable.order_id == unique_list_order_id[i]
		).first().manager_id)
		sale_person = db.query(models.SalePerson).get(db.query(models.OrderDetailTable).filter(
			models.OrderDetailTable.order_id == unique_list_order_id[i]
		).first().sale_person_id)
		order_send = {
			"id": unique_list_order_id[i],
			"status": order_info.status,
			"date": order_info.date,
			"price": order_info.price,
			"manager": manager.FirstName + ' ' + manager.LastName,
			"sale_person": sale_person.FirstName + ' ' + sale_person.LastName,
			"details": [{
				"table_id": detail.table_id,
			} for detail in db.query(models.OrderDetailTable).filter(models.OrderDetailTable.order_id == unique_list_order_id[i])]
		}
		i += 1
		order_list_send.append(order_send)

	return order_list_send


async def get_comments_user(db, user_id: int):
	return db.query(models.Comment).filter(models.Comment.user_id == user_id).all()



async def get_not_confirmed_order_menu(db):
	order_menu = db.query(models.OrderDetailMenu).filter(
	                                                     models.OrderDetailMenu.manager_id == None,
	                                                     models.OrderDetailMenu.sale_person_id == None)

	if order_menu is None:
		raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Order not found")

	unique_list_order_id = set()
	[unique_list_order_id.add(obj.order_id) for obj in order_menu if obj.order_id not in order_menu]
	unique_list_order_id = list(unique_list_order_id)

	order_list_info = []
	for order_id in unique_list_order_id:
		order_info = db.query(models.Order).filter(models.Order.id == order_id,
		                                           models.Order.status == 'Ожидание подтверждения').first()
		order_list_info.append(order_info)


	if order_list_info is None:
		raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Order detail not found")

	order_list_send = []
	i = 0
	for order_info in order_list_info:

		if order_info is None:
			raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Order detail not found")

		order_send = {
			"id": unique_list_order_id[i],
			"status": order_info.status,
			"date": order_info.date,
			"price": order_info.price,
			"details": [{
				"dish_name": db.query(models.Dish).filter(models.Dish.type == detail.dish_type)[detail.dish_id].name,
				'quantity': detail.quantity,
				'total_price': detail.total_price,
			} for detail in db.query(models.OrderDetailMenu).filter(models.OrderDetailMenu.order_id == unique_list_order_id[i])]
		}
		i += 1
		order_list_send.append(order_send)


	return order_list_send

async def get_order_table_details_not_confirm_all(db):
	order_table_details = db.query(models.OrderDetailTable).filter(
	                                                     models.OrderDetailMenu.manager_id == None,
	                                                     models.OrderDetailMenu.sale_person_id == None)

	if order_table_details is None:
		raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Order not found")

	unique_list_order_id = set()
	[unique_list_order_id.add(obj.order_id) for obj in order_table_details if obj.order_id not in order_table_details]
	unique_list_order_id = list(unique_list_order_id)

	order_list_info = []
	for order_id in unique_list_order_id:
		order_info = db.query(models.Order).filter(models.Order.id == order_id,
		                                           models.Order.status == 'Ожидание подтверждения').first()
		order_list_info.append(order_info)

	if order_list_info is None:
		raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Order detail not found")

	order_list_send = []
	i = 0
	for order_info in order_list_info:
		if order_info is None:
			raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Order detail not found")

		order_send = {
			"id": unique_list_order_id[i],
			"status": order_info.status,
			"date": order_info.date,
			"price": order_info.price,
			"details": [{
				"table_id": db.query(models.Table).filter(models.Table.table_id == detail.table_id).first().table_id,
			} for detail in db.query(models.OrderDetailTable).filter(models.OrderDetailTable.order_id == unique_list_order_id[i])]
		}
		i += 1
		order_list_send.append(order_send)

	return order_list_send


async def confirm_order(db, user_id, data):

	managers = db.query(models.ManagerPerson).filter(models.ManagerPerson.user_id == user_id)
	sale_person = random.choice(db.query(models.SalePerson).all())
	if managers.first():
		manager = random.choice(managers)

		if data.order_type == 'table':
			db.query(models.OrderDetailTable).filter(models.OrderDetailTable.order_id == data.order_id).update(
				{"manager_id": manager.id}
			)
			db.query(models.OrderDetailTable).filter(models.OrderDetailTable.order_id == data.order_id).update(
				{"sale_person_id": sale_person.id}
			)
			for detail in data.details:
				db.query(models.Table).filter(models.Table.table_id == detail['table_id']).update(
					{"table_availability" : 0}
				)
			db.query(models.Order).filter(models.Order.id == data.order_id).update(
					{"status" : "Потверждено"}
				)
		else:
			db.query(models.OrderDetailMenu).filter(models.OrderDetailMenu.order_id == data.order_id).update(
				{"manager_id": manager.id}
			)
			db.query(models.OrderDetailMenu).filter(models.OrderDetailMenu.order_id == data.order_id).update(
				{"sale_person_id": sale_person.id}
			)
			db.query(models.Order).filter(models.Order.id == data.order_id).update(
				{"status": "Потверждено"}
			)


	else:
		manager = random.choice(db.query(models.ManagerPerson).all())
		if data.order_type == 'table':
			db.query(models.OrderDetailTable).filter(models.OrderDetailTable.order_id == data.order_id).update(
				{"manager_id": manager.id}
			)
			db.query(models.OrderDetailTable).filter(models.OrderDetailTable.order_id == data.order_id).update(
				{"sale_person_id": sale_person.id}
			)
			for detail in data.details:
				db.query(models.Table).filter(models.Table.table_id == detail['table_id']).update(
					{"table_availability" : 0}
				)
			print(data.order_id)
			db.query(models.Order).filter(models.Order.id == data.order_id).update(
					{"status" : "Потверждено"}
				)
		else:
			db.query(models.OrderDetailMenu).filter(models.OrderDetailMenu.order_id == data.order_id).update(
				{"manager_id": manager.id}
			)
			db.query(models.OrderDetailMenu).filter(models.OrderDetailMenu.order_id == data.order_id).update(
				{"sale_person_id": sale_person.id}
			)
			db.query(models.Order).filter(models.Order.id == data.order_id).update(
				{"status": "Потверждено"}
			)

	db.commit()
	return {"message" : 'ok'}




