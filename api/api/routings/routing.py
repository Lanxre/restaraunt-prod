from api.Schemas import *
from api.models import models
from api.Services import get_db
from fastapi_crudrouter import SQLAlchemyCRUDRouter

router_manager = SQLAlchemyCRUDRouter(
    schema= RoleScheme,
    create_schema=RoleSchemeCreate,
    delete_all_route=False,
    db_model=models.ManagerPerson,
    db=get_db,
    tags=["managers"],
    prefix='/api/managers',
)

router_customer = SQLAlchemyCRUDRouter(
    schema= CustomerScheme,
    create_schema=RoleSchemeCreate,
    update_schema=CustomerScheme,
    delete_all_route=False,
    db_model=models.Customer,
    db=get_db,
    tags=["customers"],
    prefix='/api/customers',
)

router_admins = SQLAlchemyCRUDRouter(
    schema= AdminScheme,
    create_schema=RoleSchemeCreate,
    update_schema=AdminScheme,
    delete_all_route=False,
    db_model=models.Administator,
    db=get_db,
    tags=["admins"],
        prefix='/api/administrators',
)

router_users = SQLAlchemyCRUDRouter(
    schema= User,
    create_schema=UserCreate,
    update_schema=User,
    delete_all_route=False,
    db_model=models.User,
    db=get_db,
    tags=["user"],
    prefix='/api/user',
)
router_tables = SQLAlchemyCRUDRouter(
    schema= TableScheme,
    create_schema=TableSchemeCreate,
    update_schema=TableScheme,
    delete_all_route=False,
    db_model=models.Table,
    db=get_db,
    tags=["tables"],
    prefix='/api/tables',
)

router_dishes = SQLAlchemyCRUDRouter(
    schema= DishScheme,
    create_schema=DishSchemeCreate,
    update_schema=DishScheme,
    delete_all_route=False,
    db_model=models.Dish,
    db=get_db,
    tags=["dishes"],
    prefix='/api/dishes',
)
