"""
Mentor360 - EDA and Preprocessing Pipeline
Covers:
- Unit 1: Data Pre-Processing, Data Quality, Feature Structures, Scaling
- Unit 2: Feature Engineering, Correlation Analysis, Train-Test Split (80/20)
"""

import os
import pandas as pd
import numpy as np
import matplotlib
matplotlib.use('Agg') # Headless backend for server environment
import matplotlib.pyplot as plt
import seaborn as sns
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler

def run_eda_and_preprocessing():
    base_dir = os.path.dirname(__file__)
    data_path = os.path.join(base_dir, "data", "mentor_dataset.csv")
    reports_dir = os.path.join(base_dir, "reports", "eda")
    os.makedirs(reports_dir, exist_ok=True)
    
    print("=" * 60)
    print("UNIT 1 & 2: DATA EXPLORATION & PRE-PROCESSING")
    print("=" * 60)
    
    # 1. Load Data
    df = pd.read_csv(data_path)
    print(f"Dataset Shape: {df.shape[0]} rows, {df.shape[1]} columns\n")
    
    # 2. Check Data Quality & Missing Values
    missing_counts = df.isnull().sum()
    print("Missing Values Check:")
    print(missing_counts[missing_counts > 0] if missing_counts.sum() > 0 else "  No missing values detected (100% clean).")
    
    # 3. Numeric Summary Statistics
    num_cols = [
        'total_students', 'total_teachers', 'ptr', 'days_since_last_visit',
        'previous_visit_count', 'past_followup_completion_rate', 'unresolved_needs_count',
        'composite_pedagogical_score', 'priority_score'
    ]
    print("\nSummary Statistics of Key Numerical Features:")
    print(df[num_cols].describe().round(2))
    
    # 4. Generate Correlation Heatmap (Unit 2: Feature Relationship Analysis)
    plt.figure(figsize=(10, 8))
    corr_matrix = df[num_cols].corr()
    sns.heatmap(corr_matrix, annot=True, cmap="coolwarm", fmt=".2f", linewidths=0.5)
    plt.title("Mentor360 Feature Correlation Matrix", fontsize=14, fontweight="bold")
    plt.tight_layout()
    corr_plot_path = os.path.join(reports_dir, "correlation_heatmap.png")
    plt.savefig(corr_plot_path, dpi=300)
    plt.close()
    print(f"\n[Saved Plot] Correlation Heatmap saved to: {corr_plot_path}")
    
    # 5. Generate Target Distributions Plot
    fig, axes = plt.subplots(1, 2, figsize=(14, 5))
    
    # Priority Score Histogram (Regression Target)
    sns.histplot(df['priority_score'], kde=True, ax=axes[0], color="#176B5B", bins=25)
    axes[0].set_title("Distribution of Priority Score (Target 1 - Regression)", fontweight="bold")
    axes[0].set_xlabel("Priority Score (0 to 100)")
    axes[0].axvline(df['priority_score'].mean(), color='red', linestyle='--', label=f"Mean: {df['priority_score'].mean():.1f}")
    axes[0].legend()
    
    # Urgency Level Bar Chart (Classification Target)
    urgency_order = ["Normal Priority", "Medium Priority", "High Priority"]
    sns.countplot(data=df, x='urgency_level', order=urgency_order, ax=axes[1], palette=["#2E7D32", "#F4B942", "#D32F2F"])
    axes[1].set_title("Distribution of Urgency Level (Target 2 - Classification)", fontweight="bold")
    axes[1].set_xlabel("Urgency Level")
    axes[1].set_ylabel("Count")
    
    plt.tight_layout()
    dist_plot_path = os.path.join(reports_dir, "target_distributions.png")
    plt.savefig(dist_plot_path, dpi=300)
    plt.close()
    print(f"[Saved Plot] Target Distributions saved to: {dist_plot_path}")
    
    # 6. Train-Test Split (Unit 2: Stratified 80/20 Split)
    train_df, test_df = train_test_split(
        df,
        test_size=0.20,
        random_state=42,
        stratify=df['urgency_level']
    )
    
    train_path = os.path.join(base_dir, "data", "train.csv")
    test_path = os.path.join(base_dir, "data", "test.csv")
    train_df.to_csv(train_path, index=False)
    test_df.to_csv(test_path, index=False)
    print(f"\n[Data Splits] Saved Train Set ({len(train_df)} samples) to: {train_path}")
    print(f"[Data Splits] Saved Test Set ({len(test_df)} samples) to: {test_path}")
    print("\nEDA and Pre-processing completed successfully!")

if __name__ == "__main__":
    run_eda_and_preprocessing()

