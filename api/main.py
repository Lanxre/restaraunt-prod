import pydantic.types

from api.database import database
from api.basesqldata import get_base_data
from api.Services import *
from api.routings import *

from fastapi.middleware.cors import CORSMiddleware
from fastapi import FastAPI, Path, Query, Header, HTTPException, Body

models.Base.metadata.create_all(bind=database.engine)

app = FastAPI()

origins = [
    "http://localhost:3000",
    "https://localhost:3000",
    "http://localhost",
    "http://localhost:8000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

""" USERS """
@app.post("/api/token", response_model=Token, tags=["users"])
async def login_for_access_token(form_data: OAuth2PasswordRequestForm = Depends(),
                                 db: orm.Session = Depends(get_db)):

    user = authenticate_user(db, form_data.username, form_data.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token = create_access_token(
        data=User.from_orm(user)
    )
    return {"access_token": access_token, "token_type": "bearer"}


@app.get('/api/users',response_model=pydantic.types.List[UserPanel] ,tags=["users"])
async def get_all_users( user: User = Depends(get_current_user),
                         db: orm.Session = Depends(get_db)):

    return await get_all_users_db(db)


@app.get("/api/users/me/", response_model=User, tags=["users"])
async def read_users_me(current_user: User = Depends(get_current_user)):
    return current_user


@app.post("/api/users", tags=["users"])
async def create_user(
    user: UserCreate, db: orm.Session = Depends(get_db)
):
    db_user =  get_user_by_email(user.email, db)
    if db_user:
        raise HTTPException(status_code=400, detail="Email already in use")


    user = await create_user_db(user, db)
    access_token = create_access_token(
        data=User.from_orm(user)
    )
    return {"access_token": access_token, "token_type   ": "bearer"}

@app.put("/api/users", tags=["users"])
async def update_user(
    new_user: UserCreate, user: User = Depends(get_current_user),  db: orm.Session = Depends(get_db)
):
    update_obj = await update_user_db(new_user.email, new_user, db)
    access_token = create_access_token(
        data=User.from_orm(update_obj)
    )
    return {"access_token": access_token, "token_type": "bearer"}

# @app.get("/api/user/{user_id}", response_model=User, tags=["user"])
# async def get_one_user(user: User = Depends(get_current_user),
#                        user_id: int = Path(..., alias="id"),
#                        db: orm.Session = Depends(get_db)):
#
#     return get_user_by_id_db(db, user_id)

# """ USERS ROLES """
#
# """ Administration """
#
# """Admin"""
# @app.get('/api/administrators',response_model=pydantic.types.List[RoleScheme] ,tags=["admins"])
# async def get_administrators(
#                      user: User = Depends(get_current_user),
#                      db: orm.Session = Depends(get_db)):
#
#     return await get_admins_db(db)
#
# """ Manager """
# @app.get('/api/managers',response_model=pydantic.types.List[ManagerScheme] ,tags=["managers"])
# async def get_managers(
#                      user: User = Depends(get_current_user),
#                      db: orm.Session = Depends(get_db)):
#
#     return await get_managers_db(db)

# """ Customer """
# @app.get('/api/customers',response_model=pydantic.types.List[RoleScheme] ,tags=["customers"])
# async def get_customers(
#                      user: User = Depends(get_current_user),
#                      db: orm.Session = Depends(get_db)):
#
#     return await get_customer_db(db)

@app.post("/api/order/table-detail", tags=["order table details"])
async def create_table_detail(
    data: OrderTableDetailSchemeList,
    user: User = Depends(get_current_user),
    db: orm.Session = Depends(get_db)
):
    return await add_orders_details(db, data)

@app.get("/api/dishes-type/", tags=["dishes type"], response_model=DishScheme)
async def get_dishes_type(
    dish_id: str | None = None,
    type_id: str | None = Query(None, min_length=1, max_length=3),
    user: User = Depends(get_current_user),
    db: orm.Session = Depends(get_db)
):
    return await get_dish_by_type(db, int(dish_id), int(type_id))

@app.post("/api/order/menu-detail", tags=["order menu details"])
async def create_menu_detail(
    data: OrderMenuDetailSchemeList,
    user: User = Depends(get_current_user),
    db: orm.Session = Depends(get_db)
):
    return await add_orders_menu_details(db, data)


@app.get("/api/order/menu-detail-not-confirm", tags=["order menu details"])
async def get_not_confirmed_order_detail_menu_by_user(
    user: User = Depends(get_current_user),
    db: orm.Session = Depends(get_db)
):
    return await get_not_confirmed_order_menu_by_user_id(db, int(user.user_id))


@app.get("/api/order/menu-detail-not-confirm-all", tags=["order menu details"])
async def get_not_confirmed_order_detail_menu_all(
    db: orm.Session = Depends(get_db)
):
    return await get_not_confirmed_order_menu(db)



@app.get("/api/order/menu-detail-confirm", tags=["order menu details"])
async def get_confirmed_order_detail_menu_by_user(
    user: User = Depends(get_current_user),
    db: orm.Session = Depends(get_db)
):
    return await get_confirmed_order_menu_by_user_id(db, int(user.user_id))


@app.get("/api/order/table-detail-not-confirm", tags=["order table details"])
async def get_not_confirmed_order_table_details_by_user(
    user: User = Depends(get_current_user),
    db: orm.Session = Depends(get_db)
):
    return await get_order_table_details_not_confirm(db, int(user.user_id))

@app.get("/api/order/table-detail-not-confirm-all", tags=["order table details"])
async def get_not_confirmed_order_table_details_by_all(
    db: orm.Session = Depends(get_db)
):
    return await get_order_table_details_not_confirm_all(db)


@app.put("/api/order/update-order", tags=["order offer"])
async def confirm_order_offer(
        db: orm.Session = Depends(get_db),
        data: OrderItem = Body(...),
        user: User = Depends(get_current_user)
):
    return await confirm_order(db, int(user.user_id), data)



@app.get("/api/order/table-detail-confirm", tags=["order table details"])
async def get_confirmed_order_table_details_by_user(
    user: User = Depends(get_current_user),
    db: orm.Session = Depends(get_db)
):
    return await get_order_table_details_confirm(db, int(user.user_id))

@app.get("/api/comments/user", tags=["comments"])
async def get_comments_by_user(
    user: User = Depends(get_current_user),
    db: orm.Session = Depends(get_db)
):
    return await get_comments_user(db, int(user.user_id))


@app.get("/api/statistics/sales", tags=["statistics"],
                                  response_model=StatisticsScheme)
async def get_statistics_sales(
    user: User = Depends(get_current_user),
    db: orm.Session = Depends(get_db)
):
    return await get_sales_statistics(db)

@app.get("/api/statistics/booking", tags=["statistics"])
async def get_statistics_booking(
    user: User = Depends(get_current_user),
    db: orm.Session = Depends(get_db)
):
    return await get_booking_statistics(db)


@app.get("/api/statistics/order", tags=["statistics"])
async def get_statistics_order(
    user: User = Depends(get_current_user),
    db: orm.Session = Depends(get_db)
):
    return await get_order_statistics(db)


app.include_router(router_manager, dependencies=[Depends(get_current_user)])
app.include_router(router_customer, dependencies=[Depends(get_current_user)])
app.include_router(router_admins, dependencies=[Depends(get_current_user)])
app.include_router(router_users, dependencies=[Depends(get_current_user)])
app.include_router(router_tables)
app.include_router(router_dishes)
app.include_router(router_orders, dependencies=[Depends(get_current_user)])
app.include_router(router_comments, dependencies=[Depends(get_current_user)])
app.include_router(router_news)