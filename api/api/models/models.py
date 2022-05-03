import sqlalchemy.types
from sqlalchemy import Boolean, Column, ForeignKey, Integer, String, Table, text
from sqlalchemy.sql.sqltypes import NullType
from sqlalchemy.orm import relationship
from sqlalchemy.ext.declarative import declarative_base
# from api.database.mongodb import MongoBase


Base = declarative_base()
metadata = Base.metadata

class DishType(Base):
    __tablename__ = 'DishType'

    id = Column(Integer, primary_key=True)
    type_name = Column(String)


class Menu(Base):
    __tablename__ = 'Menu'

    menu_id = Column(Integer, primary_key=True)
    menu_name = Column(String)
    menu_description = Column(String)


class Role(Base):
    __tablename__ = 'Roles'

    role_id = Column(Integer, primary_key=True, index=True)
    title = Column(String)
    description = Column(String)


class Table(Base):
    __tablename__ = 'Table'

    table_id = Column(Integer, primary_key=True, index=True)
    table_availability = Column(Boolean)


    t_sqlite_sequence = Table(
        'sqlite_sequence', metadata,
        Column('name', String),
        Column('seq', NullType)
    )


class Dish(Base):
    __tablename__ = 'Dish'

    id = Column(Integer, primary_key=True)
    menu_id = Column(ForeignKey('Menu.menu_id'))
    name = Column(String)
    description = Column(String)
    type = Column(ForeignKey('DishType.id'))
    price = Column(Integer, server_default=text("1"))

    menu = relationship('Menu')
    DishType = relationship('DishType')


class User(Base):
    __tablename__ = 'Users'

    user_id = Column(Integer, primary_key=True)
    user_login = Column(String)
    user_password = Column(String)
    uesr_email = Column(String)
    role_id = Column(ForeignKey('Roles.role_id'))

    role = relationship('Role')


class Administator(Base):
    __tablename__ = 'Administator'

    administrator_id = Column(Integer, primary_key=True)
    FirstName = Column(String)
    LastName = Column(String)
    Age = Column(String)
    Email = Column(String)
    Phone = Column(String)
    user_id = Column(ForeignKey('Users.user_id'))

    user = relationship('User')


class Comment(Base):
    __tablename__ = 'Comments'

    id = Column(Integer, primary_key=True)
    user_id = Column(ForeignKey('Users.user_id'))
    comments = Column(String)
    order_id = Column(ForeignKey('Orders.id'))

    order = relationship('Order')
    user = relationship('User')


class Customer(Base):
    __tablename__ = 'Customer'

    customer_id = Column(Integer, primary_key=True)
    FirstName = Column(String)
    LastName = Column(String)
    Age = Column(String)
    Email = Column(String)
    Phone = Column(String)
    user_id = Column(ForeignKey('Users.user_id'))

    user = relationship('User')


class Ingredient(Base):
    __tablename__ = 'Ingredients'

    id = Column(Integer, primary_key=True)
    ingredient_name = Column(String)
    ingredient_count = Column(Integer, server_default=text("1"))
    dish_id = Column(ForeignKey('Dish.id'))

    dish = relationship('Dish')


class ManagerPerson(Base):
    __tablename__ = 'ManagerPerson'

    id = Column(Integer, primary_key=True)
    FirstName = Column(String)
    LastName = Column(String)
    Age = Column(String)
    Email = Column(String)
    Phone = Column(String)
    user_id = Column(ForeignKey('Users.user_id'))

    user = relationship('User')


class SalePerson(Base):
    __tablename__ = 'SalePerson'

    id = Column(Integer, primary_key=True)
    FirstName = Column(String)
    LastName = Column(String)
    Age = Column(String)
    Email = Column(String)
    Phone = Column(String)
    user_id = Column(ForeignKey('Users.user_id'))

    user = relationship('User')


class Booking(Base):
    __tablename__ = 'Booking'

    booking_id = Column(Integer, primary_key=True, index=True)
    table_id = Column(ForeignKey('Table.table_id'))
    customer_id = Column(ForeignKey('Customer.customer_id'))
    saleperson_id = Column(ForeignKey('SalePerson.id'))

    customer = relationship('Customer')
    saleperson = relationship('SalePerson')
    table = relationship('Table')


class OrderDetailMenu(Base):
    __tablename__ = 'OrderDetailMenu'

    id = Column(Integer, primary_key=True)
    order_id = Column(ForeignKey('Orders.id'))
    dish_id = Column(ForeignKey('Dish.id'))
    dish_type = Column(ForeignKey('DishType.id'))
    quantity = Column(Integer, server_default=text("1"))
    total_price = Column(Integer, server_default=text("1"))
    user_id = Column(ForeignKey('Users.user_id'))
    manager_id = Column(ForeignKey('ManagerPerson.id'))
    sale_person_id = Column(ForeignKey('SalePerson.id'))

    dish = relationship('Dish')
    manager = relationship('ManagerPerson')
    order = relationship('Order')
    sale_person = relationship('SalePerson')
    user = relationship('User')
    type = relationship('DishType')


class Order(Base):
    __tablename__ = 'Orders'

    id = Column(Integer, primary_key=True)
    price = Column(Integer, server_default=text("1"))
    date = Column(String)
    status = Column(String, server_default=text("expectation"))


class OrderDetailTable(Base):
    __tablename__ = 'OrderDetailTables'

    id = Column(Integer, primary_key=True)
    order_id = Column(ForeignKey('Orders.id'))
    table_id = Column(ForeignKey('Table.table_id'))
    user_id = Column(ForeignKey('Users.user_id'))
    manager_id = Column(ForeignKey('ManagerPerson.id'))
    sale_person_id = Column(ForeignKey('SalePerson.id'))

    manager = relationship('ManagerPerson')
    order = relationship('Order')
    sale_person = relationship('SalePerson')
    table = relationship('Table')
    user = relationship('User')





