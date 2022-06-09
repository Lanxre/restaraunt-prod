import pydantic
from typing import Optional


class TableScheme(pydantic.BaseModel):
	table_id: Optional[int] = None
	table_availability: Optional[str] = None

	class Config:
		orm_mode = True


class TableSchemeCreate(pydantic.BaseModel):
	table_availability: Optional[str] = None

	class Config:
		orm_mode = True


class DishScheme(pydantic.BaseModel):
	menu_id: Optional[str] = None
	name: Optional[str] = None
	description: Optional[str] = None
	type: Optional[str] = None
	price: Optional[str] = None

	class Config:
		orm_mode = True


class DishSchemeCreate(pydantic.BaseModel):
	name: Optional[str] = None
	description: Optional[str] = None
	type: Optional[str] = None
	price: Optional[int] = None
	menu_id: Optional[int] = 1

	class Config:
		orm_mode = True


from datetime import date


class OrderScheme(pydantic.BaseModel):
	id: Optional[int] = None
	price: Optional[int] = None
	date: Optional[str] = date.today().strftime("%d-%m-%Y")
	status: Optional[str] = 'expectation'

	class Config:
		orm_mode = True


class OrderSchemeCreate(pydantic.BaseModel):
	price: Optional[int] = None
	date: Optional[str] = date.today().strftime("%d-%m-%Y")
	status: Optional[str] = 'expectation'

	class Config:
		orm_mode = True


class OrderTableDetailScheme(pydantic.BaseModel):
	id: Optional[int] = None
	order_id: Optional[int] = None
	table_id: Optional[int] = None
	user_id: Optional[int] = None
	manager_id: Optional[int] = None
	sale_person_id: Optional[int] = None

	class Config:
		orm_mode = True


class OrderTableDetailSchemeCreate(pydantic.BaseModel):
	order_id: Optional[int] = None
	table_id: Optional[int] = None
	user_id: Optional[int] = None

	class Config:
		orm_mode = True


class OrderDishDetailSchemeUpdate(pydantic.BaseModel):
	manager_id: Optional[int] = None
	sale_person_id: Optional[int] = None

	class Config:
		orm_mode = True

class OrderTableDetailSchemeList(pydantic.BaseModel):
	data: pydantic.types.List[OrderTableDetailSchemeCreate] = [
		{
			"order_id": 0,
			"table_id": 0,
			"user_id": 0
		}
	]

	class Config:
		orm_mode = True



class OrderMenuDetailScheme(pydantic.BaseModel):
	id: Optional[int] = None
	order_id: Optional[int] = None
	dish_id: Optional[int] = None
	quantity: Optional[int] = None
	total_price: Optional[int] = None
	user_id: Optional[int] = None
	manager_id: Optional[int] = None
	sale_person_id: Optional[int] = None

	class Config:
		orm_mode = True


class OrderMenuDetailSchemeCreate(pydantic.BaseModel):
	order_id: Optional[int] = None
	dish_id: Optional[int] = None
	dish_type: Optional[int] = None
	user_id: Optional[int] = None
	quantity: Optional[int] = None
	total_price: Optional[int] = None

	class Config:
		orm_mode = True


class OrderMenuDetailSchemeUpdate(pydantic.BaseModel):
	manager_id: Optional[int] = None
	sale_person_id: Optional[int] = None

	class Config:
		orm_mode = True


class OrderMenuDetailSchemeList(pydantic.BaseModel):
	data: pydantic.types.List[OrderMenuDetailSchemeCreate] = [
		{
			"order_id": 0,
			"dish_id": 0,
			"dish_type": 0,
			"user_id": 0,
			"quantity": 0,
			'total_price': 0
		}
	]

	class Config:
		orm_mode = True


class CommentsScheme(pydantic.BaseModel):
	order_id: Optional[int] = None
	user_id: Optional[int] = None
	comments: Optional[str] = None

	class Config:
		orm_mode = True


class CommentsSchemeUpdate(pydantic.BaseModel):
	comments: Optional[str] = None

	class Config:
		orm_mode = True





class OrderItem(pydantic.BaseModel):
	order_id: Optional[int] = None
	order_type: Optional[str] = None
	details: Optional[pydantic.types.List[dict]] = [{
		'table_id' : 1,
	}]



class NewsScheme(pydantic.BaseModel):
	id: Optional[int] = None
	date: Optional[str] = '09-06-2022'
	article: Optional[str] = 'some news'

	class Config:
		orm_mode = True