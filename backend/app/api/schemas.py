from pydantic import BaseModel
from typing import Optional

class PredictionInput(BaseModel):
    # Base ML Features
    month: int
    hour: int
    TEMP: float
    PRES: float
    DEWP: float
    RAIN: float
    WSPM: float
    PM2_5_lag1: float
    PM10_lag1: float
    SO2_lag1: float
    NO2_lag1: float
    CO_lag1: float
    O3_lag1: float
