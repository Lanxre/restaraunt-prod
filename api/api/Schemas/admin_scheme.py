import pydantic
from typing import Optional


class RoleBase(pydantic.BaseModel):
    FirstName: Optional[str] = None
    LastName: Optional[str] = None
    Age: Optional[int] = None
    Email: Optional[str] = None
    Phone: Optional[str] = None
    class Config:
        orm_mode = True

class RoleScheme(RoleBase):
    id: Optional[int] = None
    class Config:
        orm_mode = True

class RoleSchemeCreate(RoleBase):
    user_id: Optional[int] = None
    class Config:
        orm_mode = True


""" Customer fix """

class CustomerScheme(RoleBase):
    customer_id: Optional[int] = None
    class Config:
        orm_mode = True


""" Administrator fix """
class AdminScheme(RoleBase):
    administrator_id: Optional[int] = None
    class Config:
        orm_mode = True