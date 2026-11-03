"""
Mentor360 - Artificial Neural Network (ANN) Activity Recommender
Covers:
- Unit 5: Artificial Neural Networks (ANN)
  - Architecture: Multi-Layer Perceptron (Input Layer -> Hidden Layers -> Output Layer)
  - Activation Functions: ReLU for hidden representations, Softmax for multi-class probabilities
  - Learning Process: Backpropagation, Cross-Entropy Loss, Adam Optimizer
  - Evaluation: Loss curve, Accuracy, Confusion Matrix
"""

import os
import joblib
import pandas as pd
import numpy as np
import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt
import seaborn as sns

from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler, OneHotEncoder
from sklearn.compose import ColumnTransformer
from sklearn.neural_network import MLPClassifier
from sklearn.metrics import accuracy_score, classification_report, confusion_matrix

def train_ann_recommender():
    base_dir = os.path.dirname(__file__)
    data_path = os.path.join(base_dir, "data", "mentor_dataset.csv")
    models_dir = os.path.join(base_dir, "models")
    reports_dir = os.path.join(base_dir, "reports", "ann")
    os.makedirs(models_dir, exist_ok=True)
    os.makedirs(reports_dir, exist_ok=True)
    
    df = pd.read_csv(data_path)
    
    print("\n" + "=" * 65)
    print("UNIT 5: ARTIFICIAL NEURAL NETWORK (ANN) RECOMMENDER")
    print("=" * 65)
    
    # Features: Classroom observation indicators + Context
    cat_features = ['subject', 'grade']
    num_features = [
        'ind_lesson_objective', 'ind_teaching_strategy', 'ind_student_participation',
        'ind_use_of_tlm', 'ind_formative_assessment', 'ind_inclusive_participation'
    ]
    
    X = df[cat_features + num_features]
    y = df['recommended_activity']
    
    # Preprocessor: One-Hot encode categorical features, scale numerical features
    preprocessor = ColumnTransformer(
        transformers=[
            ('cat', OneHotEncoder(drop='first', sparse_output=False), cat_features),
            ('num', StandardScaler(), num_features)
        ]
    )
    
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.20, random_state=42, stratify=y
    )
    
    X_train_proc = preprocessor.fit_transform(X_train)
    X_test_proc = preprocessor.transform(X_test)
    
    print(f"Neural Network Architecture:")
    print(f"  - Input Layer Size: {X_train_proc.shape[1]} neurons")
    print(f"  - Hidden Layer 1: 64 neurons (ReLU activation)")
    print(f"  - Hidden Layer 2: 32 neurons (ReLU activation)")
    print(f"  - Output Layer: {len(np.unique(y))} classes (Softmax probability)")
    print(f"  - Optimizer: Adam (Backpropagation with Cross-Entropy Loss)")
    
    # Fit MLPClassifier (ANN)
    ann = MLPClassifier(
        hidden_layer_sizes=(64, 32),
        activation='relu',
        solver='adam',
        alpha=0.001,
        batch_size=32,
        learning_rate_init=0.005,
        max_iter=400,
        random_state=42,
        early_stopping=True,
        n_iter_no_change=15
    )
    
    ann.fit(X_train_proc, y_train)
    
    # Evaluate
    y_pred = ann.predict(X_test_proc)
    acc = accuracy_score(y_test, y_pred)
    print(f"\n>> ANN Test Set Accuracy: {acc*100:.2f}%\n")
    print("Classification Report:")
    print(classification_report(y_test, y_pred))
    
    # 1. Loss Curve Plot (Learning Process & Backpropagation)
    plt.figure(figsize=(8, 5))
    plt.plot(ann.loss_curve_, color='#176B5B', linewidth=2, label="Cross-Entropy Loss")
    plt.title("ANN Training Loss Curve (Backpropagation Progress)", fontweight="bold")
    plt.xlabel("Training Iterations (Epochs)")
    plt.ylabel("Loss")
    plt.grid(True)
    plt.legend()
    plt.tight_layout()
    loss_plot_path = os.path.join(reports_dir, "ann_loss_curve.png")
    plt.savefig(loss_plot_path, dpi=300)
    plt.close()
    print(f"[Saved Plot] Loss Curve saved to: {loss_plot_path}")
    
    # 2. Confusion Matrix Plot
    classes = sorted(list(np.unique(y)))
    cm = confusion_matrix(y_test, y_pred, labels=classes)
    plt.figure(figsize=(9, 7))
    sns.heatmap(cm, annot=True, fmt='d', cmap='Greens', xticklabels=classes, yticklabels=classes)
    plt.title("ANN Recommender Confusion Matrix", fontweight="bold")
    plt.xlabel("Predicted Activity")
    plt.ylabel("Actual Activity")
    plt.xticks(rotation=45, ha='right')
    plt.tight_layout()
    cm_plot_path = os.path.join(reports_dir, "ann_confusion_matrix.png")
    plt.savefig(cm_plot_path, dpi=300)
    plt.close()
    print(f"[Saved Plot] Confusion Matrix saved to: {cm_plot_path}")
    
    # Save Model Artifacts
    joblib.dump(ann, os.path.join(models_dir, "ann_activity_recommender.joblib"))
    joblib.dump(preprocessor, os.path.join(models_dir, "ann_preprocessor.joblib"))
    joblib.dump(classes, os.path.join(models_dir, "ann_classes.joblib"))
    print("ANN model artifacts saved successfully!")

if __name__ == "__main__":
    train_ann_recommender()

