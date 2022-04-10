import sqlalchemy.types
from sqlalchemy import Integer, ForeignKey, String, Column, Boolean
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import relationship

from api.database.mongodb import MongoBase


Base = declarative_base()

''' ROLES AND USERS '''

class Roles(Base):
    __tablename__ = 'Roles'

    role_id = Column(Integer, primary_key=True, index=True)
    title = Column(String)
    description = Column(String)

    address_user = relationship('Users', back_populates='address_roles')

class Users(Base):
    __tablename__ = 'Users'

    user_id = Column(Integer, primary_key=True, autoincrement=True)
    user_login = Column(String)
    user_password = Column(String)
    uesr_email = Column(String)
    role_id = Column(Integer, ForeignKey('Roles.role_id'))

    address_roles = relationship('Roles',back_populates='address_user')
    address_saleperson = relationship('SalePerson',back_populates='address_user')
    address_admin = relationship('Administator', back_populates='address_user')
    address_manager = relationship('ManagerPerson', back_populates='address_user')
    address_customer = relationship('Customer', back_populates='address_user')

class SalePerson(Base):
    __tablename__ = 'SalePerson'

    id = Column(Integer, primary_key=True)
    FirstName = Column(String)
    LastName = Column(String)
    Age = Column(String)
    Email = Column(String)
    Phone = Column(String)
    user_id = Column(Integer, ForeignKey('Users.user_id'))

    address_user = relationship('Users', back_populates='address_saleperson')
    address_booking = relationship('Booking', back_populates='address_saleperson')

class ManagerPerson(Base):
    __tablename__ = 'ManagerPerson'

    id = Column(Integer, primary_key=True)
    FirstName = Column(String)
    LastName = Column(String)
    Age = Column(String)
    Email = Column(String)
    Phone = Column(String)
    user_id = Column(Integer, ForeignKey('Users.user_id'))

    address_user = relationship('Users', back_populates='address_manager')

class Administator(Base):
    __tablename__ = 'Administator'

    administrator_id = Column(Integer, primary_key=True)
    FirstName = Column(String)
    LastName = Column(String)
    Age = Column(String)
    Email = Column(String)
    Phone = Column(String)
    user_id = Column(Integer, ForeignKey('Users.user_id'))

    address_user = relationship('Users', back_populates='address_admin')

class Customer(Base):
    __tablename__ = 'Customer'

    customer_id = Column(Integer, primary_key=True)
    FirstName = Column(String)
    LastName = Column(String)
    Age = Column(String)
    Email = Column(String)
    Phone = Column(String)
    user_id = Column(Integer, ForeignKey('Users.user_id'))

    address_user = relationship('Users', back_populates='address_customer')
    address_booking = relationship('Booking', back_populates='address_customer')

""" TABLE AND BOOKING """
class Table(Base):
    __tablename__ = 'Table'

    table_id = Column(Integer, primary_key=True, index=True)
    table_availability = Column(Boolean)

    address_booking = relationship('Booking', back_populates='address_table')

class Booking(Base):
    __tablename__ = 'Booking'

    booking_id = Column(Integer, primary_key=True, index=True)
    table_id = Column(Integer, ForeignKey('Table.table_id'))
    customer_id = Column(Integer, ForeignKey('Customer.customer_id'))
    saleperson_id =  Column(Integer, ForeignKey('SalePerson.id'))

    address_table = relationship('Table', back_populates='address_booking')
    address_customer = relationship('Customer', back_populates='address_booking')
    address_saleperson = relationship('SalePerson', back_populates='address_booking')


class Menu(MongoBase):
    menu_type: str
    dishes: list

    @property
    def get_collections(self):
        return super(Menu, self).db['menu']

class Order(MongoBase):
    date: str
    customer: dict
    manager : dict
    costs: float

    @property
    def get_collections(self):
        return super(Order, self).db['order']


class Comments(MongoBase):
    date: str
    customer: dict
    comment: str

    @property
    def get_collections(self):
        return super(Comments, self).db['comments']



