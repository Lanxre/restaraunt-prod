from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

SQLALCHEMY_DATABASE_URL = "sqlite:///api/database/database.db"

engine = create_engine(
    SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False}
)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()


# get_base_data(database.SessionLocal(), [
#     models.Roles(
#         role_id = 1,
#         title = 'Administrator',
#         description= 'Admin'
#     ),
#     models.Roles(
#         role_id = 2,
#         title = 'Manager',
#         description= 'manager'
#     ),
#     models.Roles(
#         role_id = 3,
#         title = 'Customer',
#         description= 'cust'
#     ),
#     models.Roles(
#         role_id = 4,
#         title = 'SalePerson',
#         description= 'saleperson'
#     ),
# ])