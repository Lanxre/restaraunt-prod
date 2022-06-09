import pydantic
from typing import Optional, Dict



class StatisticsScheme(pydantic.BaseModel):
    total_sales_stats: Dict =  dict(zip([str(month) for month in range(1, 12)], [0] * 12))
    total_confirmed_sales_stats: Dict =  dict(zip([str(month) for month in range(1, 12)], [0] * 12))
    class Config:
        orm_mode = True