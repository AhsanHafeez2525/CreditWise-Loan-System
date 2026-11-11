# CreditWise Loan System - Topics & Their Role in the Project

## Overview

Is project me ek applicant ka data input hota hai (jaise screenshot me: Income 514, Age 88, Credit Score 58, DTI Ratio 81, etc.) aur ML model predict karta hai ki **Loan Approved hoga ya Rejected**. Screenshot me model ne 93% confidence ke saath **Rejected** predict kiya — kyunki low income, very low credit score, high DTI ratio, aur extreme age hai.

Neeche har topic ka role explain kiya hai ki wo is project me **kya karta hai aur kyun zaroori hai**.

---

## 1. Handling Missing Values & Duplicates

### Kya hai?
Dataset me kuch rows me values missing hoti hain (blank cells) aur kuch rows exactly duplicate hoti hain.

### Project me role:
- Humari dataset (1000 rows) me **~50 missing values** the har column me aur **50 rows me target (Loan_Approved) hi missing** tha
- ML models NaN (empty) values handle nahi kar sakte — seedha error dete hain
- **Numerical columns** (Income, Age, Credit_Score) → **median** se fill kiya (median outliers se affect nahi hota)
- **Categorical columns** (Gender, Loan_Purpose) → **mode** (sabse common value) se fill kiya
- Duplicate rows remove kiye taaki model ek hi data se baar baar na seekhe (overfitting se bache)

### Agar ye na karte?
Model train hi nahi hota — `ValueError: Input contains NaN` error aata. Duplicates se model biased ho jaata specific patterns ki taraf.

---

## 2. Exploratory Data Analysis (EDA)

### Kya hai?
Data ko visually explore karna — charts, graphs, statistics se samajhna ki data kaisa dikhta hai, kaunse patterns hain.

### Project me role:
- **Target Distribution** → pata chala ki ~65% loans Rejected hain, ~35% Approved — class imbalance hai, isliye humne `stratify=y` use kiya train-test split me
- **Histograms** → Income aur Loan Amount right-skewed hain, isliye `Log_Income` aur `Log_LoanAmount` features banaye
- **Categorical Plots** → pata chala ki Employment Status, Property Area ka loan approval pe effect hai
- **Boxplots** → outliers detect kiye Income aur Collateral Value me — ye samajhne me madad kiya ki data me extreme values hain
- **Pairplot** → Credit Score aur DTI Ratio ka strong relation dikhta hai approval ke saath

### Agar ye na karte?
Blind model training hoti — na outliers ka pata chalta, na class imbalance ka, na kaunse features important hain. Feature engineering ka direction hi nahi milta.

---

## 3. Feature Encoding

### Kya hai?
ML models sirf **numbers** samajhte hain, text/categories nahi. Encoding ka matlab hai categories ko numbers me convert karna.

### Project me role:
Humari dataset me 7 categorical columns the:

| Column | Type | Encoding | Example |
|--------|------|----------|---------|
| Gender | Binary (2 values) | **Label Encoding** | Male→1, Female→0 |
| Marital_Status | Binary | **Label Encoding** | Married→1, Single→0 |
| Employment_Status | Nominal (3+ values) | **One-Hot Encoding** | Salaried→[1,0], Self-Employed→[0,1] |
| Loan_Purpose | Nominal | **One-Hot Encoding** | Home→[1,0,0,0], Personal→[0,0,1,0] |
| Property_Area | Nominal | **One-Hot Encoding** | Urban→[1,0], Rural→[0,0] |
| Education_Level | Nominal | **One-Hot Encoding** | Graduate→[1,0], Postgraduate→[0,1] |
| Employer_Category | Nominal | **One-Hot Encoding** | Govt→[0,0], Private→[1,0] |

- **Label Encoding** → 2 categories ke liye (0 aur 1)
- **One-Hot Encoding** → 3+ categories ke liye (har category ka alag column banta hai)
- `drop_first=True` use kiya multicollinearity se bachne ke liye

### Screenshot se example:
Jab user "Salaried", "Personal", "Semiurban" select karta hai → backend me ye one-hot encoded hota hai → model ko numbers milte hain predict karne ke liye.

### Agar ye na karte?
Model error deta — `could not convert string to float`. Ya agar directly numbers assign karte (Home=1, Education=2, Personal=3) toh model sochta ki Personal > Home, jo galat hai.

---

## 4. Correlation Heatmap

### Kya hai?
Har feature ka har doosre feature ke saath **kitna strong relation** hai, ye ek matrix me dikhata hai. Value -1 se +1 ke beech hoti hai.

### Project me role:
- **+1** = perfect positive correlation (ek badhta hai toh doosra bhi badhta hai)
- **-1** = perfect negative correlation (ek badhta hai toh doosra ghatta hai)
- **0** = koi relation nahi

### Key findings:
- Credit_Score ka Loan_Approved se **positive correlation** → high credit score = approval chances zyada
- DTI_Ratio ka Loan_Approved se **negative correlation** → high debt-to-income = rejection chances zyada
- Applicant_Income aur Coapplicant_Income ka aapas me **low correlation** → dono independent info dete hain, dono rakhna sahi hai
- Agar 2 features ka correlation **>0.9** hota toh ek remove karte (multicollinearity) — humari dataset me aisa nahi mila

### Agar ye na karte?
Redundant features model me rehte jo noise add karte. Important features ka pata nahi chalta. Feature engineering ka direction nahi milta.

---

## 5. Feature Scaling

### Kya hai?
Saare numerical features ko **same scale** pe laana. Example: Income 500-50000 range me hai, DTI_Ratio 0-1 me — model Income ko zyada important samjhega sirf range ki wajah se.

### Project me role:
- **StandardScaler** use kiya → har feature ka mean=0, std=1 ho jaata hai
- Formula: `z = (x - mean) / std`

### Example:
| Feature | Before Scaling | After Scaling |
|---------|---------------|---------------|
| Applicant_Income | 514 | -1.23 |
| DTI_Ratio | 0.81 | 2.45 |
| Credit_Score | 58 | -3.12 |

### Important rules followed:
1. **Train-test split PEHLE kiya, scaling BAAD me** → warna data leakage hoti (test data ki info training me aa jaati)
2. **Scaler sirf training data pe fit kiya** → `scaler.fit_transform(X_train)` then `scaler.transform(X_test)`
3. **Same scaler save kiya** (`scaler.pkl`) → backend me bhi same scaling lagti hai jab user form bharta hai

### Screenshot se example:
Jab user Income=514, Credit_Score=58 bharta hai → backend me saved scaler inhe scale karta hai → scaled values model ko jaati hain → prediction aati hai.

### Agar ye na karte?
SVM aur KNN jaise models bahut kharab perform karte (ye distance-based hain). Logistic Regression bhi biased hoti bade range wale features ki taraf.

---

## 6. Model Training & Evaluation

### Kya hai?
Data se patterns seekhna (training) aur phir check karna ki kitna sahi seekha (evaluation).

### Project me role:
5 models train kiye aur compare kiya:

| Model | Kya karta hai | Best for |
|-------|--------------|----------|
| **Logistic Regression** | Linear boundary banata hai approved/rejected ke beech | Baseline, interpretable |
| **Random Forest** | 100 decision trees ka ensemble — majority vote se predict karta hai | Tabular data, non-linear patterns |
| **SVM** | Best separating hyperplane dhundhta hai | Scaled data, clear margins |
| **Decision Tree** | If-else rules banata hai (like: if Credit_Score > 600 AND DTI < 0.5 → Approved) | Interpretability |
| **KNN** | 5 nearest similar applicants dekhta hai — agar unme majority approved → approved | Simple, no training needed |

### Evaluation Metrics explained:

| Metric | Kya measure karta hai | Is project me kyun important |
|--------|----------------------|------------------------------|
| **Accuracy** | Overall kitne sahi the | Misleading jab classes imbalanced hain (65% rejected hai toh sirf "Rejected" bolke bhi 65% accuracy aa jaati) |
| **Precision** | Jo Approved predict kiye unme se kitne sach me Approved the | Bank ke liye important — galat Approval = financial loss |
| **Recall** | Jo actually Approved the unme se kitne pakde | Customer ke liye important — sahi applicant reject na ho |
| **F1 Score** | Precision aur Recall ka balance | **Primary metric** — dono ko balance karta hai |
| **ROC AUC** | Model kitna accha distinguish karta hai Approved vs Rejected | Overall discrimination ability |
| **Confusion Matrix** | TP, FP, TN, FN ka breakdown | Visual samajh — kitne sahi, kitne galat, kahan galat |

### Screenshot se connection:
93% confidence ka matlab hai ki model ko 93% sure hai ki ye applicant **Rejected** category me aata hai (Random Forest ke 100 trees me se ~93 ne Rejected bola).

### Agar ye na karte?
Sirf ek model banate toh pata nahi chalta ki wo best hai ya nahi. Sirf accuracy dekhte toh misleading hota.

---

## 7. Feature Engineering

### Kya hai?
Existing features se **naye meaningful features banana** jo model ko better patterns seekhne me madad kare.

### Project me 10 new features banaye:

| New Feature | Formula | Kyun banaya |
|-------------|---------|-------------|
| **Total_Income** | Applicant_Income + Coapplicant_Income | Combined repayment capacity |
| **Income_Loan_Ratio** | Total_Income / Loan_Amount | Kitna income hai loan ke comparison me |
| **EMI_Estimate** | Loan_Amount / Loan_Term | Approximate monthly payment |
| **EMI_Income_Ratio** | EMI_Estimate / Total_Income | Income ka kitna % EMI me jaayega |
| **Collateral_Coverage** | Collateral_Value / Loan_Amount | Collateral se loan kitna covered hai |
| **Savings_Loan_Ratio** | Savings / Loan_Amount | Savings se loan kitna cover ho sakta hai |
| **Low_Credit** | 1 if Credit_Score < 600 | Risk flag — low credit score |
| **High_DTI** | 1 if DTI_Ratio > 0.5 | Risk flag — high debt burden |
| **Log_Income** | log(1 + Income) | Skewness reduce karta hai |
| **Log_LoanAmount** | log(1 + Loan_Amount) | Skewness reduce karta hai |

### Screenshot se example:
User ne Income=514, Coapplicant=750, Loan=20, Term=68 bhara:
- Total_Income = 514 + 750 = **1264**
- Income_Loan_Ratio = 1264 / 21 = **60.2** (good ratio but income very low)
- EMI_Estimate = 20 / 69 = **0.29**
- Credit Score = 58 → Low_Credit = **1** (risk flag ON)
- DTI = 81 → High_DTI = **1** (risk flag ON)

Ye sab features model ko extra signals dete hain → isliye 93% confidence se Rejected predict kiya.

### Before vs After comparison:
Feature engineering ke baad models ka performance improve hua — especially F1 Score aur ROC AUC me.

### Agar ye na karte?
Model sirf raw data se seekhta — combined income, EMI burden, risk flags jaise important patterns miss ho jaate.

---

## 8. Feature Importance

### Kya hai?
Random Forest batata hai ki **kaunsa feature kitna important** tha prediction me.

### Project me role:
Top important features (typically):
1. **Credit_Score** — sabse important predictor
2. **DTI_Ratio** — debt burden
3. **Income_Loan_Ratio** — income vs loan comparison
4. **Collateral_Coverage** — loan security
5. **Total_Income** — repayment capacity

### Screenshot se connection:
Is applicant ka Credit_Score=58 (extremely low, normal 300-900 hota hai) aur DTI_Ratio=81 (extremely high, 0.5 se upar risk zone) — ye dono top important features hain aur dono extreme negative values pe hain → isliye **93% confidence se Rejected**.

---

## Full Pipeline Flow (Screenshot Example)

```
User Form Input (Screenshot)
    │
    ├── Income: 514, CoIncome: 750, Age: 88
    ├── Credit Score: 58, DTI: 81, Existing Loans: 57
    ├── Loan: 20, Term: 68, Savings: 29, Collateral: 65
    ├── Gender: Male, Marital: Single, Employment: Salaried
    ├── Purpose: Personal, Area: Semiurban, Education: Postgraduate
    └── Employer: Private
         │
         ▼
    [Feature Engineering] ← Topic 7
    │  Total_Income = 1264
    │  Income_Loan_Ratio = 60.2
    │  Low_Credit = 1 (flag ON)
    │  High_DTI = 1 (flag ON)
    │  + 6 more features
         │
         ▼
    [Feature Encoding] ← Topic 3
    │  Male → 1, Single → 0
    │  Salaried → [1,0], Personal → [0,0,1,0]
    │  Semiurban → [0,1], etc.
         │
         ▼
    [Feature Scaling] ← Topic 5
    │  StandardScaler transforms all values
    │  Income 514 → -1.23 (scaled)
    │  Credit 58 → -3.12 (scaled)
         │
         ▼
    [Model Prediction] ← Topic 6
    │  Random Forest (100 trees vote)
    │  ~93 trees say REJECTED
    │  ~7 trees say APPROVED
         │
         ▼
    Result: LOAN REJECTED (93.0% Confidence)
```

---

## Topics Mapping Summary

| # | Topic | Where in Code | Role |
|---|-------|--------------|------|
| 1 | Missing & Duplicates | Notebook Cell 6-9 | Data ko clean karna taaki model train ho sake |
| 2 | EDA | Notebook Cell 10-17 | Data ko samajhna, patterns dhundhna, decisions lena |
| 3 | Feature Encoding | Notebook Cell 18-20 | Categories ko numbers me convert karna |
| 4 | Correlation Heatmap | Notebook Cell 21-22 | Feature relationships samajhna, redundancy check |
| 5 | Feature Scaling | Notebook Cell 23-25 | Saare features ko same scale pe laana |
| 6 | Model Training & Evaluation | Notebook Cell 26-29 | Models train karna, best select karna |
| 7 | Feature Engineering | Notebook Cell 30-34 | Naye features banana, model improve karna |
| 8 | Feature Importance | Notebook Cell 34 | Kaunsa feature kitna matter karta hai |
