# TerraCast: Urban Air Quality Forecasting & Anomaly Detection

TerraCast is an advanced, hybrid machine learning framework designed to predict Air Quality Index (AQI) and automatically translate complex predictive models into actionable environmental policy briefs for city officials.

## 🚀 Features
* **Dual-Task Architecture:** Simultaneously predicts the exact AQI numerical value (XGBoost Regression) and classifies the environmental health risk category (Random Forest Classification).
* **Deterministic Expert System:** Processes mathematical SHAP (Explainable AI) values through a localized rule engine to generate human-readable policy briefs.
* **Digital Twin Simulator:** An interactive web dashboard allowing urban planners to adjust environmental sliders (e.g., simulating traffic restrictions) and view real-time impact forecasts.
* **API-Driven Backend:** Fully decoupled Python FastAPI backend serving a responsive React/Vite frontend.

## 🛠️ Technology Stack
* **Frontend:** React, Vite, TailwindCSS, Recharts, Lucide-React
* **Backend:** Python, FastAPI, Pandas, Scikit-Learn, XGBoost, SHAP
* **Dataset:** Beijing Multi-Site Air-Quality Data Set (UCI Machine Learning Repository)

## ⚙️ Installation & Setup

### 1. Backend Setup
```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
python -m uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

### 2. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

## 📊 Project Structure
* `/backend`: Contains the FastAPI application, ML model `.pkl` files, Expert System logic, and SHAP explainer services.
* `/frontend`: Contains the React UI components, Overview Dashboard, and the Scenario Lab.
* `/dataset`: Historical CSV data used for the historical snapshot overviews.
