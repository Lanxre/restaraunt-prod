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