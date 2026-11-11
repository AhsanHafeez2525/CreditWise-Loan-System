# CreditWise Loan System - Complete Project Roadmap

## Tech Stack

### ML/Data Science (Backend Brain)
| Tool | Purpose |
|------|---------|
| **Python 3.11+** | Core language |
| **Pandas** | Data cleaning, manipulation |
| **NumPy** | Numerical operations |
| **Matplotlib + Seaborn** | EDA, correlation heatmap, visualizations |
| **Scikit-learn** | Feature encoding, scaling, model training, evaluation |
| **Jupyter Notebook** | Step-by-step ML workflow (course submission) |
| **Joblib / Pickle** | Save trained model for backend use |

### Backend (API Server)
| Tool | Purpose |
|------|---------|
| **FastAPI** | REST API framework (modern, fast, auto-docs) |
| **Uvicorn** | ASGI server to run FastAPI |
| **Pydantic** | Request/response validation |
| **Joblib** | Load saved ML model |
| **Pandas** | Transform incoming data same as training |

### Frontend (User Interface)
| Tool | Purpose |
|------|---------|
| **React.js (Vite)** | UI framework |
| **Tailwind CSS** | Styling |
| **Axios** | API calls to backend |
| **Recharts** | Show charts/visualizations in UI |

### Project Structure
```
CreditWiseLoanSystem/
├── notebook/
│   └── loan_analysis.ipynb        # Full ML workflow (course submission)
├── backend/
│   ├── app.py                     # FastAPI server
│   ├── model/
│   │   ├── train.py               # Training script
│   │   ├── loan_model.pkl         # Saved model
│   │   └── scaler.pkl             # Saved scaler
│   └── requirements.txt
├── frontend/
│   ├── src/
│   │   ├── App.jsx
│   │   ├── components/
│   │   │   ├── LoanForm.jsx       # Input form
│   │   │   ├── ResultCard.jsx     # Prediction result
│   │   │   └── Dashboard.jsx      # EDA charts
│   │   └── api/
│   │       └── predict.js         # Axios calls
│   └── package.json
├── loan_approval_data.csv
└── PROJECT_ROADMAP.md
```

---

## Step-by-Step ML Workflow

### 1. Data Loading & Initial Exploration
```python
import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import seaborn as sns

df = pd.read_csv('loan_approval_data.csv')
df.shape              # (1000, 20)
df.info()             # dtypes, non-null counts
df.describe()         # statistics
df.head()
```

### 2. Handle Missing Values & Duplicates

**Missing Values:**
```python
# Check missing
df.isnull().sum()
df.isnull().mean() * 100  # percentage

# Strategy:
# - Numerical columns (Age, Credit_Score, etc.) → fill with median
# - Categorical columns (Gender, Loan_Purpose, etc.) → fill with mode

num_cols = df.select_dtypes(include='number').columns
cat_cols = df.select_dtypes(include='object').columns

for col in num_cols:
    df[col].fillna(df[col].median(), inplace=True)

for col in cat_cols:
    df[col].fillna(df[col].mode()[0], inplace=True)
```

**Duplicates:**
```python
df.duplicated().sum()
df.drop_duplicates(inplace=True)
# Also drop Applicant_ID (not a feature)
df.drop('Applicant_ID', axis=1, inplace=True)
```

### 3. Exploratory Data Analysis (EDA)

```python
# Target distribution
df['Loan_Approved'].value_counts().plot(kind='bar')
plt.title('Loan Approval Distribution')

# Numerical distributions
df.hist(figsize=(15, 10), bins=20)

# Categorical vs Target
for col in cat_cols:
    pd.crosstab(df[col], df['Loan_Approved']).plot(kind='bar')
    plt.title(f'{col} vs Loan Approval')

# Boxplots for outliers
for col in ['Applicant_Income', 'Loan_Amount', 'Credit_Score']:
    sns.boxplot(x='Loan_Approved', y=col, data=df)
    plt.show()
```

### 4. Feature Encoding

```python
from sklearn.preprocessing import LabelEncoder, OneHotEncoder

# Target column: map Yes/No to 1/0
df['Loan_Approved'] = df['Loan_Approved'].map({'Yes': 1, 'No': 0})

# Label Encoding for binary/ordinal columns
le = LabelEncoder()
binary_cols = ['Gender', 'Marital_Status']
for col in binary_cols:
    df[col] = le.fit_transform(df[col])

# One-Hot Encoding for nominal columns
nominal_cols = ['Employment_Status', 'Loan_Purpose', 'Property_Area',
                'Education_Level', 'Employer_Category']
df = pd.get_dummies(df, columns=nominal_cols, drop_first=True)
```

### 5. Correlation Heatmap

```python
plt.figure(figsize=(16, 12))
correlation = df.corr()
sns.heatmap(correlation, annot=True, fmt='.2f', cmap='coolwarm',
            center=0, linewidths=0.5)
plt.title('Feature Correlation Heatmap')
plt.tight_layout()
plt.show()

# Top correlated features with target
print(correlation['Loan_Approved'].sort_values(ascending=False))
```

### 6. Feature Scaling

```python
from sklearn.preprocessing import StandardScaler

X = df.drop('Loan_Approved', axis=1)
y = df['Loan_Approved']

scaler = StandardScaler()
X_scaled = pd.DataFrame(scaler.fit_transform(X), columns=X.columns)

# Save scaler for backend use
import joblib
joblib.dump(scaler, 'backend/model/scaler.pkl')
```

### 7. Model Training & Evaluation

```python
from sklearn.model_selection import train_test_split
from sklearn.linear_model import LogisticRegression
from sklearn.ensemble_model import RandomForestClassifier
from sklearn.svm import SVC
from sklearn.metrics import (accuracy_score, precision_score, recall_score,
                             f1_score, confusion_matrix, classification_report,
                             roc_auc_score, roc_curve)

X_train, X_test, y_train, y_test = train_test_split(
    X_scaled, y, test_size=0.2, random_state=42, stratify=y
)

# Train multiple models
models = {
    'Logistic Regression': LogisticRegression(max_iter=1000),
    'Random Forest': RandomForestClassifier(n_estimators=100, random_state=42),
    'SVM': SVC(probability=True, random_state=42)
}

results = {}
for name, model in models.items():
    model.fit(X_train, y_train)
    y_pred = model.predict(X_test)
    results[name] = {
        'Accuracy': accuracy_score(y_test, y_pred),
        'Precision': precision_score(y_test, y_pred),
        'Recall': recall_score(y_test, y_pred),
        'F1 Score': f1_score(y_test, y_pred),
        'ROC AUC': roc_auc_score(y_test, model.predict_proba(X_test)[:, 1])
    }

# Compare
results_df = pd.DataFrame(results).T
print(results_df)

# Confusion Matrix for best model
best_model = models['Random Forest']  # usually best for tabular data
y_pred = best_model.predict(X_test)
sns.heatmap(confusion_matrix(y_test, y_pred), annot=True, fmt='d', cmap='Blues')
plt.xlabel('Predicted')
plt.ylabel('Actual')
plt.title('Confusion Matrix')

# ROC Curve
for name, model in models.items():
    fpr, tpr, _ = roc_curve(y_test, model.predict_proba(X_test)[:, 1])
    plt.plot(fpr, tpr, label=f'{name} (AUC={results[name]["ROC AUC"]:.3f})')
plt.plot([0,1],[0,1],'--', color='gray')
plt.xlabel('False Positive Rate')
plt.ylabel('True Positive Rate')
plt.title('ROC Curves')
plt.legend()
plt.show()

# Save best model
joblib.dump(best_model, 'backend/model/loan_model.pkl')
```

### 8. Feature Engineering (Improve Model)

```python
# Create new meaningful features BEFORE encoding/scaling

# 1. Total Income
df['Total_Income'] = df['Applicant_Income'] + df['Coapplicant_Income']

# 2. Income to Loan Ratio
df['Income_Loan_Ratio'] = df['Total_Income'] / (df['Loan_Amount'] + 1)

# 3. EMI Estimate (rough monthly payment)
df['EMI_Estimate'] = df['Loan_Amount'] / (df['Loan_Term'] + 1)

# 4. EMI to Income Ratio
df['EMI_Income_Ratio'] = df['EMI_Estimate'] / (df['Total_Income'] + 1)

# 5. Collateral Coverage Ratio
df['Collateral_Coverage'] = df['Collateral_Value'] / (df['Loan_Amount'] + 1)

# 6. Savings to Loan Ratio
df['Savings_Loan_Ratio'] = df['Savings'] / (df['Loan_Amount'] + 1)

# 7. Credit Risk Flag (low credit score)
df['Low_Credit'] = (df['Credit_Score'] < 600).astype(int)

# 8. High DTI Flag
df['High_DTI'] = (df['DTI_Ratio'] > 0.5).astype(int)

# 9. Age Binning
df['Age_Group'] = pd.cut(df['Age'], bins=[18, 30, 45, 60, 100],
                         labels=['Young', 'Middle', 'Senior', 'Elder'])

# Now re-run encoding, scaling, and training → compare metrics
```

**Feature Importance (post-training):**
```python
# Random Forest feature importance
importances = best_model.feature_importances_
feat_imp = pd.Series(importances, index=X.columns).sort_values(ascending=False)
feat_imp[:15].plot(kind='barh', figsize=(10, 6))
plt.title('Top 15 Feature Importances')
plt.show()
```

---

## Important Pointers

### Data Cleaning
- Always handle missing values BEFORE encoding
- Check for data leakage (target info leaking into features)
- `Applicant_ID` is an identifier, NOT a feature — drop it

### EDA
- Check class imbalance in target variable — if imbalanced, use `stratify` in train_test_split and consider SMOTE
- Look for outliers in income and loan amount — consider capping at 99th percentile
- Categorical value counts: watch for rare categories

### Encoding
- **Label Encoding** → for binary or ordinal categories (Male/Female, Yes/No)
- **One-Hot Encoding** → for nominal categories with no order (Loan_Purpose, Property_Area)
- Always use `drop_first=True` to avoid multicollinearity

### Scaling
- **StandardScaler** → when data is normally distributed
- **MinMaxScaler** → when data has no strong outliers
- Only fit scaler on training data, transform both train and test

### Model Selection
- **Logistic Regression** → baseline, interpretable
- **Random Forest** → usually best for tabular data, handles non-linearity
- **SVM** → good with scaled data, fewer features
- Always compare multiple models, don't just pick one

### Evaluation Metrics
- **Accuracy** → misleading if classes are imbalanced
- **Precision** → of predicted approvals, how many were correct? (bank cares)
- **Recall** → of actual approvals, how many did we catch? (customer cares)
- **F1 Score** → balance between precision and recall
- **ROC AUC** → overall model discrimination ability
- **Confusion Matrix** → visual understanding of TP, FP, TN, FN

### Feature Engineering
- Domain knowledge > random features
- Always check if new features actually improve the model
- Remove highly correlated features (>0.9) to reduce multicollinearity

### Common Mistakes to Avoid
- Scaling before train/test split (data leakage)
- Not handling the target column encoding (Yes/No → 1/0)
- Using accuracy alone for imbalanced datasets
- Forgetting to save scaler + model for deployment
- Not using `random_state` for reproducibility

---

## Backend API (FastAPI) - Quick Reference

```python
# backend/app.py
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import joblib
import pandas as pd

app = FastAPI()
app.add_middleware(CORSMiddleware, allow_origins=["*"],
                  allow_methods=["*"], allow_headers=["*"])

model = joblib.load("model/loan_model.pkl")
scaler = joblib.load("model/scaler.pkl")

class LoanApplication(BaseModel):
    Applicant_Income: float
    Coapplicant_Income: float
    Credit_Score: float
    Loan_Amount: float
    Loan_Term: float
    # ... all features

@app.post("/predict")
def predict(data: LoanApplication):
    df = pd.DataFrame([data.dict()])
    # Apply same encoding + feature engineering as training
    df_scaled = scaler.transform(df)
    prediction = model.predict(df_scaled)[0]
    probability = model.predict_proba(df_scaled)[0]
    return {
        "approved": bool(prediction),
        "confidence": float(max(probability))
    }
```

**Run:** `uvicorn app:app --reload --port 8000`
**Auto docs:** `http://localhost:8000/docs`

---

## Frontend (React + Vite) - Quick Reference

```bash
npm create vite@latest frontend -- --template react
cd frontend
npm install axios recharts tailwindcss @tailwindcss/vite
```

Key components:
- **LoanForm** → collects all applicant details
- **ResultCard** → shows Approved/Rejected with confidence %
- **Dashboard** → displays EDA charts (use Recharts)

---

## Order of Implementation

| Step | What | Where |
|------|------|-------|
| 1 | Complete ML workflow | `notebook/loan_analysis.ipynb` |
| 2 | Train final model, save `.pkl` files | `backend/model/` |
| 3 | Build FastAPI server | `backend/app.py` |
| 4 | Test API with Swagger docs | `localhost:8000/docs` |
| 5 | Build React frontend | `frontend/` |
| 6 | Connect frontend to API | Axios calls |
| 7 | Add EDA dashboard page | Recharts visualizations |

---

## Install Commands

```bash
# Backend
pip install pandas numpy matplotlib seaborn scikit-learn fastapi uvicorn joblib jupyter

# Frontend
npm create vite@latest frontend -- --template react
cd frontend && npm install axios recharts tailwindcss @tailwindcss/vite
```
