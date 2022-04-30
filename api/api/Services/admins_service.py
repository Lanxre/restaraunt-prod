from fastapi import Depends, FastAPI, HTTPException, status
from api.Schemas import *
from api.models import models
import sqlalchemy.orm as orm

async def get_admins_db(db: orm.Session):
	return db.query(models.Administator).all()

async def get_managers_db(db: orm.Session):
	return db.query(models.ManagerPerson).all()

async def get_customer_db(db: orm.Session):
	return db.query(models.Customer).all()
