from api.database import database
from api.basesqldata import get_base_data
from api.Services import *

from fastapi.middleware.cors import CORSMiddleware


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


@app.post("/api/token", response_model=Token)
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


@app.get("/api/users/me/", response_model=User)
async def read_users_me(current_user: User = Depends(get_current_user)):
    return current_user


@app.post("/api/users")
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

@app.put("/api/users")
async def update_user(
    new_user: UserCreate, user: User = Depends(get_current_user),  db: orm.Session = Depends(get_db)
):
    update_obj = await update_user_db(new_user.email, new_user, db)
    access_token = create_access_token(
        data=User.from_orm(update_obj)
    )
    return {"access_token": access_token, "token_type": "bearer"}