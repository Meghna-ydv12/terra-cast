from fastapi import APIRouter, HTTPException
import pandas as pd
import os
import random
from app.api.schemas import PredictionInput
from app.services.model_service import model_service
from app.services.shap_service import shap_service
from app.services.expert_service import llm_service
from app.core.config import settings

router = APIRouter()

@router.get("/dataset/sample")
def get_dataset_sample(station: str = None):
    """
    Returns a random historical row from the Beijing PRSA dataset.
    If 'station' is provided, it filters by that specific station.
    """
    try:
        csv_path = r"C:\Users\shash\.gemini\antigravity\scratch\TerraCast\backend\dataset\beijing_aqi_merged.csv"
        # Load just a subset for speed, or sample efficiently
        df = pd.read_csv(csv_path)
        df.dropna(inplace=True)
        
        if station:
            station_df = df[df['station'].str.lower() == station.lower()]
            if not station_df.empty:
                df = station_df
        
        # Pick a random row
        row = df.sample(1).iloc[0]
        
        return {
            "month": int(row['month']),
            "hour": int(row['hour']),
            "TEMP": round(float(row['TEMP']), 1),
            "PRES": round(float(row['PRES']), 1),
            "DEWP": round(float(row['DEWP']), 1),
            "RAIN": round(float(row['RAIN']), 1),
            "WSPM": round(float(row['WSPM']), 1),
            "PM2_5_lag1": round(float(row['PM2.5']), 1),
            "PM10_lag1": round(float(row['PM10']), 1),
            "SO2_lag1": round(float(row['SO2']), 1),
            "NO2_lag1": round(float(row['NO2']), 1),
            "CO_lag1": round(float(row['CO']), 1),
            "O3_lag1": round(float(row['O3']), 1),
            "station": str(row['station']),
            "year": int(row['year']),
            "day": int(row['day'])
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/predict/fast")
def predict_fast(data: PredictionInput):
    """
    Returns only the ML predictions and SHAP values for ultra-fast real-time rendering.
    """
    try:
        aqi_pred, category_name, input_data = model_service.predict(data)
        top_features = shap_service.get_top_features(input_data, top_n=6)
        
        return {
            "aqi_prediction": round(aqi_pred, 1),
            "health_category": category_name,
            "top_driving_features": top_features
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/predict/policy")
def predict_policy(data: PredictionInput):
    """
    Generates the LLM policy brief. This is slower and should be called asynchronously.
    """
    try:
        aqi_pred, category_name, input_data = model_service.predict(data)
        top_features = shap_service.get_top_features(input_data, top_n=6)
        
        policy_brief = llm_service.generate_policy_brief(
            round(aqi_pred, 1), 
            category_name, 
            top_features, 
            extended_context=data
        )

        return {
            "policy_brief": policy_brief
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
