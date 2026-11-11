# CreditWise Loan System

An intelligent **ML-powered loan approval system** that predicts whether a loan application should be **Approved** or **Rejected** based on applicant details. Built with a complete pipeline: Data Analysis → Model Training → FastAPI Backend → React Frontend.

![Python](https://img.shields.io/badge/Python-3.11+-blue?logo=python&logoColor=white)
![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=white)
![FastAPI](https://img.shields.io/badge/FastAPI-0.115+-009688?logo=fastapi&logoColor=white)
![scikit-learn](https://img.shields.io/badge/scikit--learn-1.5+-F7931E?logo=scikit-learn&logoColor=white)

---

## Problem Statement

**SecureTrust Bank** offers personal and home loans across India. Their manual verification process is:
- **Time-consuming** and inconsistent
- Good customers sometimes get **rejected** (business loss)
- High-risk customers sometimes get **approved** (financial loss)

This system uses **Machine Learning** to automatically analyze applicant details and predict loan approval with confidence scores.

---

## Features

- **Complete ML Pipeline** — Data cleaning, EDA, feature engineering, model training & evaluation
- **5 ML Models** — Logistic Regression, Random Forest, SVM, Decision Tree, KNN
- **10 Engineered Features** — Total Income, EMI/Income Ratio, Collateral Coverage, Credit Risk Flags, etc.
- **FastAPI Backend** — REST API with automatic Swagger docs
- **React Frontend** — Loan application form + Analytics dashboard with interactive charts
- **Real-time Prediction** — Submit form → get instant Approved/Rejected with confidence %

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| **ML/Data Science** | Python, Pandas, NumPy, Scikit-learn, Seaborn, Matplotlib |
| **Backend** | FastAPI, Uvicorn, Pydantic, Joblib |
| **Frontend** | React (Vite), Recharts, Axios |
| **Notebook** | Jupyter Notebook |

---

## Project Structure

```
CreditWiseLoanSystem/
├── notebook/
│   └── loan_analysis.ipynb        # Complete ML workflow with outputs
├── backend/
│   ├── app.py                     # FastAPI server
│   ├── model/
│   │   ├── loan_model.pkl         # Trained Random Forest model
│   │   ├── scaler.pkl             # StandardScaler
│   │   └── feature_columns.pkl    # Feature column order
│   └── requirements.txt
├── frontend/
│   ├── src/
│   │   ├── App.jsx
│   │   └── components/
│   │       ├── LoanForm.jsx       # Loan application form
│   │       ├── ResultCard.jsx     # Prediction result display
│   │       └── Dashboard.jsx      # EDA analytics dashboard
│   └── package.json
├── loan_approval_data.csv         # Dataset (1000 rows, 20 columns)
├── PROJECT_ROADMAP.md             # Detailed implementation guide
├── TOPICS_EXPLAINED.md            # ML topics explanation (Hindi/English)
└── README.md
```

---

## Dataset

**1000 loan applications** with 20 features:

| Feature | Description |
|---------|-------------|
| Applicant_Income | Monthly income of applicant |
| Coapplicant_Income | Monthly income of co-applicant |
| Credit_Score | Credit bureau score |
| DTI_Ratio | Debt-to-Income ratio |
| Loan_Amount | Loan amount requested |
| Loan_Term | Loan duration (months) |
| Collateral_Value | Value of collateral provided |
| Savings | Savings balance |
| Employment_Status | Salaried / Self-Employed / Business |
| Loan_Purpose | Home / Education / Personal / Business / Car |
| Property_Area | Urban / Semi-Urban / Rural |
| **Loan_Approved** | **Target: Yes / No** |

---

## ML Workflow (Jupyter Notebook)

| Step | Topic | Description |
|------|-------|-------------|
| 1 | **Data Cleaning** | Handle missing values (median/mode), remove duplicates |
| 2 | **EDA** | Target distribution, histograms, categorical plots, boxplots |
| 3 | **Feature Encoding** | Label Encoding (binary), One-Hot Encoding (nominal) |
| 4 | **Correlation Heatmap** | Feature relationships & multicollinearity check |
| 5 | **Feature Scaling** | StandardScaler (fit on train, transform both) |
| 6 | **Model Training** | 5 models trained and compared |
| 7 | **Evaluation** | Accuracy, Precision, Recall, F1, ROC AUC, Confusion Matrix |
| 8 | **Feature Engineering** | 10 new features → retrain → compare improvement |
| 9 | **Feature Importance** | Top features: Credit Score, DTI Ratio, Income/Loan Ratio |

---

## Getting Started

### Prerequisites
- Python 3.11+
- Node.js 18+
- npm

### 1. Clone the repo
```bash
git clone https://github.com/AhsanHafeez2525/CreditWise-Loan-System.git
cd CreditWise-Loan-System
```

### 2. Run the Jupyter Notebook (optional — model already saved)
```bash
pip install pandas numpy matplotlib seaborn scikit-learn jupyter joblib
cd notebook
jupyter notebook loan_analysis.ipynb
```

### 3. Start the Backend
```bash
pip install fastapi uvicorn pandas scikit-learn joblib
cd backend
uvicorn app:app --reload --port 8000
```
API docs available at: `http://localhost:8000/docs`

### 4. Start the Frontend
```bash
cd frontend
npm install
npm run dev
```
Open: `http://localhost:5173`

---

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/predict` | Submit loan application → get prediction |
| `GET` | `/health` | Health check |
| `GET` | `/model-info` | Model details & feature columns |

### Example Request
```json
POST /predict
{
  "Applicant_Income": 15000,
  "Coapplicant_Income": 3000,
  "Credit_Score": 720,
  "Loan_Amount": 100000,
  "Loan_Term": 60,
  "DTI_Ratio": 0.25,
  "Savings": 50000,
  "Collateral_Value": 200000,
  "Age": 35,
  "Dependents": 1,
  "Existing_Loans": 1,
  "Gender": "Male",
  "Marital_Status": "Married",
  "Employment_Status": "Salaried",
  "Education_Level": "Graduate",
  "Loan_Purpose": "Home",
  "Property_Area": "Urban",
  "Employer_Category": "Private"
}
```

### Example Response
```json
{
  "approved": true,
  "prediction": 1,
  "confidence": 0.59,
  "probability_approved": 0.59,
  "probability_rejected": 0.41
}
```

---

## Screenshots

### Loan Application Form
The form collects all 18 applicant details and sends them to the ML model for prediction.

### Prediction Result
Shows **Approved** (green) or **Rejected** (red) with confidence percentage and probability split.

### Analytics Dashboard
Interactive EDA charts — approval distribution, credit score analysis, income distribution, feature importance, model comparison, and radar chart.

---

## Author

**Ahsan Hafeez**
- GitHub: [@AhsanHafeez2525](https://github.com/AhsanHafeez2525)
