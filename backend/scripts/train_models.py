import pandas as pd
import numpy as np
import os
import joblib
from xgboost import XGBRegressor
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split
from sklearn.metrics import mean_squared_error, mean_absolute_error, r2_score, accuracy_score, f1_score

dataset_dir = r"C:\Users\shash\.gemini\antigravity\scratch\TerraCast\backend\dataset"
models_dir = r"C:\Users\shash\.gemini\antigravity\scratch\TerraCast\backend\models"
os.makedirs(models_dir, exist_ok=True)

csv_path = os.path.join(dataset_dir, "beijing_aqi_merged.csv")
print("Loading merged dataset...")
df = pd.read_csv(csv_path)

# 1. Feature Engineering
print("Engineering features...")
# Calculate a composite pseudo-AQI (Addressing Gap 4: Threshold Ignorance)
# Using a simplified weighted max function across all major pollutants
df['AQI'] = df[['PM2.5', 'PM10', 'SO2', 'NO2', 'CO', 'O3']].apply(
    lambda row: max(row['PM2.5']*1.2, row['PM10']*0.8, row['NO2']*1.1), axis=1
)

# Define Health Risk Categories (Addressing Gap 3: Dual-Task)
# 0: Good (0-50), 1: Moderate (51-100), 2: Unhealthy (101-200), 3: Hazardous (200+)
bins = [-1, 50, 100, 200, 9999]
labels = [0, 1, 2, 3]
df['AQI_Category'] = pd.cut(df['AQI'], bins=bins, labels=labels)

# Create 1-hour lag features for time-series forecasting to avoid data leakage
# We group by station to prevent shifting data across different locations
df = df.sort_values(by=['station', 'year', 'month', 'day', 'hour'])
df['PM2_5_lag1'] = df.groupby('station')['PM2.5'].shift(1)
df['PM10_lag1'] = df.groupby('station')['PM10'].shift(1)
df['NO2_lag1'] = df.groupby('station')['NO2'].shift(1)
df['SO2_lag1'] = df.groupby('station')['SO2'].shift(1)
df['CO_lag1'] = df.groupby('station')['CO'].shift(1)
df['O3_lag1'] = df.groupby('station')['O3'].shift(1)
df.dropna(inplace=True) # Drop the first hour that has NaN lags

# Select Features and Targets
features = ['month', 'hour', 'TEMP', 'PRES', 'DEWP', 'RAIN', 'WSPM', 
            'PM2_5_lag1', 'PM10_lag1', 'SO2_lag1', 'NO2_lag1', 'CO_lag1', 'O3_lag1']
X = df[features]
y_reg = df['AQI']
y_cls = df['AQI_Category']

# We'll take a smaller subset for faster training during this internship demo
# e.g., 50,000 random samples
print("Sampling data for faster training...")
X_sample, _, y_reg_sample, _, y_cls_sample, _ = train_test_split(
    X, y_reg, y_cls, train_size=50000, random_state=42, stratify=y_cls
)

X_train, X_test, yr_train, yr_test, yc_train, yc_test = train_test_split(
    X_sample, y_reg_sample, y_cls_sample, test_size=0.2, random_state=42
)

# 2. Train Regression Model (XGBoost)
print("Training Regression Model (XGBoost)...")
reg_model = XGBRegressor(n_estimators=100, learning_rate=0.1, random_state=42, n_jobs=-1)
reg_model.fit(X_train, yr_train)
yr_pred = reg_model.predict(X_test)

print("\n--- Regression Metrics ---")
print(f"RMSE: {np.sqrt(mean_squared_error(yr_test, yr_pred)):.2f}")
print(f"MAE:  {mean_absolute_error(yr_test, yr_pred):.2f}")
print(f"R2:   {r2_score(yr_test, yr_pred):.2f}")

# 3. Train Classification Model (Random Forest)
print("\nTraining Classification Model (Random Forest)...")
cls_model = RandomForestClassifier(n_estimators=50, random_state=42, n_jobs=-1)
cls_model.fit(X_train, yc_train)
yc_pred = cls_model.predict(X_test)

print("\n--- Classification Metrics ---")
print(f"Accuracy: {accuracy_score(yc_test, yc_pred):.2f}")
print(f"F1 Score: {f1_score(yc_test, yc_pred, average='weighted'):.2f}")

# 4. Save Models
print("\nSaving models...")
joblib.dump(reg_model, os.path.join(models_dir, "xgboost_regression.pkl"))
joblib.dump(cls_model, os.path.join(models_dir, "rf_classification.pkl"))
print("Model training complete and saved to backend/models/")
