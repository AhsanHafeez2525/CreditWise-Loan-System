from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import joblib
import pandas as pd
import numpy as np
from pathlib import Path

MODEL_DIR = Path(__file__).parent / "model"

model = joblib.load(MODEL_DIR / "loan_model.pkl")
scaler = joblib.load(MODEL_DIR / "scaler.pkl")
feature_columns = joblib.load(MODEL_DIR / "feature_columns.pkl")

app = FastAPI(title="CreditWise Loan Prediction API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)


class LoanApplication(BaseModel):
    Applicant_Income: float
    Coapplicant_Income: float
    Employment_Status: str
    Age: float
    Marital_Status: str
    Dependents: float
    Credit_Score: float
    Existing_Loans: float
    DTI_Ratio: float
    Savings: float
    Collateral_Value: float
    Loan_Amount: float
    Loan_Term: float
    Loan_Purpose: str
    Property_Area: str
    Education_Level: str
    Gender: str
    Employer_Category: str


def preprocess(data: LoanApplication) -> pd.DataFrame:
    row = data.model_dump()
    df = pd.DataFrame([row])

    # Label encode binary columns (same mapping the training LabelEncoder produced)
    df["Gender"] = df["Gender"].map({"Female": 0, "Male": 1}).fillna(0).astype(int)
    df["Marital_Status"] = df["Marital_Status"].map({"Married": 0, "Single": 1}).fillna(0).astype(int)

    # Feature engineering
    df["Total_Income"] = df["Applicant_Income"] + df["Coapplicant_Income"]
    df["Income_Loan_Ratio"] = df["Total_Income"] / (df["Loan_Amount"] + 1)
    df["EMI_Estimate"] = df["Loan_Amount"] / (df["Loan_Term"] + 1)
    df["EMI_Income_Ratio"] = df["EMI_Estimate"] / (df["Total_Income"] + 1)
    df["Collateral_Coverage"] = df["Collateral_Value"] / (df["Loan_Amount"] + 1)
    df["Savings_Loan_Ratio"] = df["Savings"] / (df["Loan_Amount"] + 1)
    df["Low_Credit"] = (df["Credit_Score"] < 600).astype(int)
    df["High_DTI"] = (df["DTI_Ratio"] > 0.5).astype(int)
    df["Log_Income"] = np.log1p(df["Applicant_Income"])
    df["Log_LoanAmount"] = np.log1p(df["Loan_Amount"])

    # One-hot encode nominal columns (drop_first=True mirrors training)
    nominal_cols = ["Employment_Status", "Loan_Purpose", "Property_Area",
                    "Education_Level", "Employer_Category"]
    df = pd.get_dummies(df, columns=nominal_cols, drop_first=True)

    # Convert bool columns to int
    for col in df.select_dtypes(include="bool").columns:
        df[col] = df[col].astype(int)

    # Align to training feature columns (missing cols get 0, extra cols dropped)
    df = df.reindex(columns=feature_columns, fill_value=0)

    # Scale
    df_scaled = pd.DataFrame(scaler.transform(df), columns=feature_columns)
    return df_scaled


@app.get("/health")
def health():
    return {"status": "ok"}


@app.get("/model-info")
def model_info():
    return {
        "model": type(model).__name__,
        "features_count": len(feature_columns),
        "features": feature_columns,
    }


@app.post("/predict")
def predict(data: LoanApplication):
    df_scaled = preprocess(data)
    prediction = int(model.predict(df_scaled)[0])
    probabilities = model.predict_proba(df_scaled)[0]
    return {
        "approved": prediction == 1,
        "prediction": prediction,
        "confidence": round(float(max(probabilities)), 4),
        "probability_approved": round(float(probabilities[1]), 4),
        "probability_rejected": round(float(probabilities[0]), 4),
    }
