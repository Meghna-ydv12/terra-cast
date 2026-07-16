# TerraCast: Integrated Machine Learning Pipeline for Urban Air Quality Forecasting

## 📌 Problem Statement
Rapid urbanization has led to severe air quality degradation across major metropolitan areas. However, existing air quality forecasting models often act as "black boxes" that struggle to predict sudden pollution anomalies or explain their underlying causes. This makes it nearly impossible for city officials and urban planners to formulate actionable, real-time environmental interventions.

## 🎯 Project Objective
To develop a **Dual-Task machine learning framework (Regression + Classification)** enhanced by a **Rule-Based Recommendation Engine**. TerraCast aims to accurately forecast the Air Quality Index (AQI) and automatically translate SHAP-based feature importance into natural language policy briefs within an **Interactive Scenario Simulator**. 

---

## 🚀 Research Gaps Addressed

Based on extensive literature reviews, TerraCast directly solves 5 critical gaps in modern Air Quality Machine Learning research:

| Gap Identified | Limitations in Existing Research | The TerraCast Solution |
| :--- | :--- | :--- |
| **The "Black-Box" Problem** | Highly accurate Deep Learning models lack interpretability. Explanations (like SHAP graphs) are mathematically complex and unusable by non-technical officials. | Integrates a **Rule-Based Recommendation Engine** to seamlessly translate mathematical SHAP values into readable Natural Language policy briefs. |
| **Lack of Real-Time "What-If" Simulation** | Most models focus entirely on offline, static predictions rather than dynamic intervention testing. | Features an **Interactive Scenario Simulator UI** where policymakers can adjust environmental sliders for instant predictive feedback. |
| **Uncertainty Handling in Multi-Task Scenarios** | Studies focus either purely on numerical forecasting (Regression) or risk categorization (Classification), but rarely both. | Employs a **Dual-Task architecture** that runs XGBoost Regression (AQI Value) and Random Forest Classification (Health Risk) simultaneously. |
| **"Threshold Ignorance"** | Advanced models often focus exclusively on predicting PM2.5, ignoring other primary pollutants necessary for calculating a true AQI. | Built as an aggregated model that factors in all primary pollutants (**PM2.5, PM10, NO2, SO2, CO, O3**) and meteorology. |
| **Lack of Automated Real-Time Decision Support** | Research models frequently output predictions without providing rule-based deterministic recommendations for interventions. | Engineered with an integrated rule engine that directly links live inference outputs to actionable environmental policies. |

---

## 🛠️ Technology Stack

**Frontend Architecture (Interactive Scenario Simulator)**
* **Framework:** React.js + Vite
* **Styling:** TailwindCSS 
* **Data Visualization:** Recharts, Lucide-React
* **State Management:** React Context API & React Query

**Backend Architecture (ML Inference API)**
* **Framework:** Python FastAPI
* **Machine Learning:** Scikit-Learn, XGBoost, Pandas
* **Explainable AI:** SHAP (SHapley Additive exPlanations)
* **Heuristics:** Custom Python-based Rule-Based Recommendation Engine

**Dataset**
* **Source:** Beijing Multi-Site Air-Quality Data Set (UCI Machine Learning Repository)
* **Size:** 420,768 records with 18 temporal and environmental attributes.

---

## 📊 Core Features

1. **Live Air Map Dashboard:** A real-time overview panel visualizing current pollution nodes, historical datasets, and meteorological data.
2. **Dual-Task Inference Engine:** Our backend utilizes an ensemble approach, querying both an `xgboost_regression.pkl` and `rf_classification.pkl` model to provide comprehensive statistical outputs.
3. **Interactive Scenario Simulator:** A dedicated, isolated sandbox environment. Users can drag sliders to artificially lower or raise pollutant metrics (e.g., simulating a 30% drop in traffic emissions) to see the exact predictive outcome.
4. **Automated Policy Briefs:** The Rule-Based Recommendation Engine evaluates SHAP impact arrays in real-time, instantly generating recommended interventions (e.g., "Mandate dust suppression at major construction sites") based on the dominant polluting variables.

## 📂 Project Structure

```text
terra-cast/
├── backend/
│   ├── app/            # FastAPI backend and ML Expert services
│   ├── dataset/        # Air quality datasets (CSV files)
│   ├── models/         # Trained ML models (.pkl)
│   ├── scripts/        # Data preprocessing and model training scripts
│   └── requirements.txt
├── frontend/           # React + Vite frontend (Interactive Scenario Simulator)
└── README.md           # Project documentation
```

---

## ⚙️ Installation & Local Setup

### 1. Clone the Repository
```bash
git clone https://github.com/Meghna-ydv12/terra-cast.git
cd terra-cast
```

### 2. Backend Setup
Start the FastAPI server, which hosts the Machine Learning models and Expert System.
```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows use: venv\Scripts\activate
pip install -r requirements.txt
python -m uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

### 3. Frontend Setup
Start the Vite development server to launch the TerraCast Interactive Scenario Simulator.
```bash
cd ../frontend
npm install
npm run dev
```
## 📂 Project Structure

```text
terra-cast/
├── backend/        # FastAPI backend and ML services
├── frontend/       # React + Vite frontend
├── dataset/        # Air quality datasets
├── models/         # Trained ML models (.pkl)
├── scripts/        # Data preprocessing and model training
└── README.md
```
