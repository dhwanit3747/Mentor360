"""
Mentor360 - Supervised Priority & Urgency Modeling Pipeline
Covers:
- Unit 2: Model Evaluation (MSE, RMSE, MAE, R2, Confusion Matrix, Classification Report)
- Unit 3: Bayesian Learning (Gaussian Naive Bayes)
- Unit 4: Supervised Regression (Linear, Ridge, Decision Tree, Random Forest)
          Supervised Classification (Logistic Regression, Random Forest, SVM, Naive Bayes)
"""

import os
import joblib
import pandas as pd
import numpy as np
import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt
import seaborn as sns

from sklearn.preprocessing import StandardScaler
from sklearn.linear_model import LinearRegression, Ridge, LogisticRegression
from sklearn.tree import DecisionTreeRegressor, DecisionTreeClassifier
from sklearn.ensemble import RandomForestRegressor, RandomForestClassifier
from sklearn.naive_bayes import GaussianNB
from sklearn.svm import SVC
from sklearn.metrics import (
    mean_squared_error, mean_absolute_error, r2_score,
    accuracy_score, precision_score, recall_score, f1_score,
    confusion_matrix, classification_report
)

def train_priority_models():
    base_dir = os.path.dirname(__file__)
    train_path = os.path.join(base_dir, "data", "train.csv")
    test_path = os.path.join(base_dir, "data", "test.csv")
    models_dir = os.path.join(base_dir, "models")
    reports_dir = os.path.join(base_dir, "reports", "models")
    os.makedirs(models_dir, exist_ok=True)
    os.makedirs(reports_dir, exist_ok=True)
    
    train_df = pd.read_csv(train_path)
    test_df = pd.read_csv(test_path)
    
    # Feature Selection (Unit 2: Feature Subset Selection)
    feature_cols = [
        'total_students', 'total_teachers', 'ptr', 'days_since_last_visit',
        'previous_visit_count', 'past_followup_completion_rate', 'unresolved_needs_count',
        'ind_lesson_objective', 'ind_teaching_strategy', 'ind_student_participation',
        'ind_use_of_tlm', 'ind_formative_assessment', 'ind_inclusive_participation'
    ]
    
    X_train = train_df[feature_cols]
    X_test = test_df[feature_cols]
    
    # Target 1: Regression (Priority Score, 0-100)
    y_reg_train = train_df['priority_score']
    y_reg_test = test_df['priority_score']
    
    # Target 2: Classification (Urgency Level: Normal, Medium, High)
    y_clf_train = train_df['urgency_level']
    y_clf_test = test_df['urgency_level']
    
    # Standardize Features
    scaler = StandardScaler()
    X_train_scaled = scaler.fit_transform(X_train)
    X_test_scaled = scaler.transform(X_test)
    
    # Save Scaler and Feature Names for Inference
    joblib.dump(scaler, os.path.join(models_dir, "scaler.joblib"))
    joblib.dump(feature_cols, os.path.join(models_dir, "feature_names.joblib"))
    
    # ========================================================
    # PART 1: SUPERVISED REGRESSION (Unit 4 & Unit 2)
    # ========================================================
    print("\n" + "=" * 65)
    print("PART 1: SUPERVISED REGRESSION (Priority Score Prediction)")
    print("=" * 65)
    
    regression_models = {
        "Linear Regression": LinearRegression(),
        "Ridge Regression (alpha=1.0)": Ridge(alpha=1.0),
        "Decision Tree Regressor": DecisionTreeRegressor(max_depth=6, random_state=42),
        "Random Forest Regressor": RandomForestRegressor(n_estimators=100, max_depth=8, random_state=42)
    }
    
    reg_results = []
    best_reg_model = None
    best_r2 = -float("inf")
    best_reg_name = ""
    
    for name, model in regression_models.items():
        # Tree models can use unscaled, but scaled works for all
        model.fit(X_train_scaled, y_reg_train)
        y_pred = model.predict(X_test_scaled)
        
        mse = mean_squared_error(y_reg_test, y_pred)
        rmse = np.sqrt(mse)
        mae = mean_absolute_error(y_reg_test, y_pred)
        r2 = r2_score(y_reg_test, y_pred)
        
        reg_results.append({
            "Model": name,
            "MSE": round(mse, 3),
            "RMSE": round(rmse, 3),
            "MAE": round(mae, 3),
            "R2 Score": round(r2, 4)
        })
        
        if r2 > best_r2:
            best_r2 = r2
            best_reg_model = model
            best_reg_name = name
            
    reg_df = pd.DataFrame(reg_results)
    print(reg_df.to_string(index=False))
    print(f"\n>> Best Regression Model: {best_reg_name} (R2 = {best_r2:.4f})")
    joblib.dump(best_reg_model, os.path.join(models_dir, "priority_regressor.joblib"))
    
    # Residual Plot for Best Regression Model
    y_best_pred = best_reg_model.predict(X_test_scaled)
    residuals = y_reg_test - y_best_pred
    plt.figure(figsize=(8, 5))
    plt.scatter(y_best_pred, residuals, alpha=0.6, color="#176B5B", edgecolors='k')
    plt.axhline(0, color='red', linestyle='--')
    plt.title(f"Residual Plot - {best_reg_name}", fontweight="bold")
    plt.xlabel("Predicted Priority Score")
    plt.ylabel("Residuals (Actual - Predicted)")
    plt.tight_layout()
    plt.savefig(os.path.join(reports_dir, "regression_residuals.png"), dpi=300)
    plt.close()
    
    # ========================================================
    # PART 2: SUPERVISED CLASSIFICATION & BAYESIAN LEARNING (Unit 3 & 4)
    # ========================================================
    print("\n" + "=" * 65)
    print("PART 2: SUPERVISED CLASSIFICATION & BAYESIAN LEARNING")
    print("=" * 65)
    
    classification_models = {
        "Gaussian Naive Bayes (Unit 3)": GaussianNB(),
        "Logistic Regression": LogisticRegression(max_iter=500, random_state=42),
        "Random Forest Classifier": RandomForestClassifier(n_estimators=100, max_depth=6, random_state=42),
        "Support Vector Machine (SVM)": SVC(kernel='rbf', probability=True, random_state=42)
    }
    
    clf_results = []
    best_clf_model = None
    best_acc = 0.0
    best_clf_name = ""
    
    for name, model in classification_models.items():
        model.fit(X_train_scaled, y_clf_train)
        y_pred = model.predict(X_test_scaled)
        
        acc = accuracy_score(y_clf_test, y_pred)
        prec = precision_score(y_clf_test, y_pred, average='weighted')
        rec = recall_score(y_clf_test, y_pred, average='weighted')
        f1 = f1_score(y_clf_test, y_pred, average='weighted')
        
        clf_results.append({
            "Algorithm": name,
            "Accuracy": round(acc, 4),
            "Precision": round(prec, 4),
            "Recall": round(rec, 4),
            "F1-Score": round(f1, 4)
        })
        
        if acc > best_acc:
            best_acc = acc
            best_clf_model = model
            best_clf_name = name
            
    clf_df = pd.DataFrame(clf_results)
    print(clf_df.to_string(index=False))
    print(f"\n>> Best Classification Model: {best_clf_name} (Accuracy = {best_acc*100:.2f}%)")
    joblib.dump(best_clf_model, os.path.join(models_dir, "urgency_classifier.joblib"))
    
    # Confusion Matrix for Best Classification Model
    labels = ["Normal Priority", "Medium Priority", "High Priority"]
    y_best_clf_pred = best_clf_model.predict(X_test_scaled)
    cm = confusion_matrix(y_clf_test, y_best_clf_pred, labels=labels)
    
    plt.figure(figsize=(7, 6))
    sns.heatmap(cm, annot=True, fmt='d', cmap='Blues', xticklabels=labels, yticklabels=labels)
    plt.title(f"Confusion Matrix - {best_clf_name}", fontweight="bold")
    plt.xlabel("Predicted Urgency Level")
    plt.ylabel("Actual Urgency Level")
    plt.tight_layout()
    plt.savefig(os.path.join(reports_dir, "classification_confusion_matrix.png"), dpi=300)
    plt.close()
    
    print("\nDetailed Classification Report (Best Model):")
    print(classification_report(y_clf_test, y_best_clf_pred, target_names=labels))
    print("Models and evaluation reports saved successfully!")

if __name__ == "__main__":
    train_priority_models()

