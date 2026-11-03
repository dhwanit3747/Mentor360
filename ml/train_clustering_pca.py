"""
Mentor360 - Unsupervised Learning & Dimensionality Reduction Pipeline
Covers:
- Unit 1: Dimensionality Reduction (PCA - Principal Component Analysis)
- Unit 4: Unsupervised Learning & Clustering (K-Means Clustering, Elbow Method, Silhouette Analysis)
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
from sklearn.decomposition import PCA
from sklearn.cluster import KMeans
from sklearn.metrics import silhouette_score

def train_clustering_and_pca():
    base_dir = os.path.dirname(__file__)
    data_path = os.path.join(base_dir, "data", "mentor_dataset.csv")
    models_dir = os.path.join(base_dir, "models")
    reports_dir = os.path.join(base_dir, "reports", "clustering")
    os.makedirs(models_dir, exist_ok=True)
    os.makedirs(reports_dir, exist_ok=True)
    
    df = pd.read_csv(data_path)
    
    # Pedagogical and School Metrics to Profile & Cluster
    cluster_features = [
        'ptr', 'days_since_last_visit', 'past_followup_completion_rate',
        'ind_lesson_objective', 'ind_teaching_strategy', 'ind_student_participation',
        'ind_use_of_tlm', 'ind_formative_assessment', 'ind_inclusive_participation'
    ]
    
    X = df[cluster_features]
    scaler = StandardScaler()
    X_scaled = scaler.fit_transform(X)
    
    print("\n" + "=" * 65)
    print("UNSUPERVISED LEARNING: K-MEANS CLUSTERING & PCA (Unit 1 & 4)")
    print("=" * 65)
    
    # 1. Elbow Method to Determine Optimal K (Unit 4)
    inertias = []
    silhouette_scores = []
    k_range = range(2, 9)
    
    for k in k_range:
        km = KMeans(n_clusters=k, random_state=42, n_init=10)
        km.fit(X_scaled)
        inertias.append(km.inertia_)
        score = silhouette_score(X_scaled, km.labels_)
        silhouette_scores.append(score)
        print(f"K = {k}: Inertia = {km.inertia_:.1f}, Silhouette Score = {score:.4f}")
        
    # Plot Elbow & Silhouette Curves
    fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(14, 5))
    ax1.plot(k_range, inertias, 'bo-', linewidth=2, markersize=8)
    ax1.set_title("Elbow Method for Optimal K", fontweight="bold")
    ax1.set_xlabel("Number of Clusters (K)")
    ax1.set_ylabel("Inertia (Within-Cluster Sum of Squares)")
    ax1.grid(True)
    
    ax2.plot(k_range, silhouette_scores, 'ro-', linewidth=2, markersize=8)
    ax2.set_title("Silhouette Score vs Number of Clusters", fontweight="bold")
    ax2.set_xlabel("Number of Clusters (K)")
    ax2.set_ylabel("Silhouette Score")
    ax2.grid(True)
    
    plt.tight_layout()
    elbow_path = os.path.join(reports_dir, "kmeans_elbow_curve.png")
    plt.savefig(elbow_path, dpi=300)
    plt.close()
    print(f"\n[Saved Plot] Elbow and Silhouette Curve saved to: {elbow_path}")
    
    # 2. Fit Final K-Means Model (Optimal K = 3)
    # Clusters represent 3 real-world school profiles:
    # Cluster 0: High need (Struggling with Manipulatives & Participation)
    # Cluster 1: Moderate need (Fair baseline, needs formative assessment & pacing)
    # Cluster 2: Low need (High performing benchmark schools)
    optimal_k = 3
    kmeans = KMeans(n_clusters=optimal_k, random_state=42, n_init=15)
    cluster_labels = kmeans.fit_predict(X_scaled)
    df['support_cluster'] = cluster_labels
    
    # 3. PCA Dimensionality Reduction (Unit 1: 9 features -> 2 principal components)
    pca = PCA(n_components=2, random_state=42)
    pca_coords = pca.fit_transform(X_scaled)
    df['pca_1'] = pca_coords[:, 0]
    df['pca_2'] = pca_coords[:, 1]
    
    var_exp = pca.explained_variance_ratio_
    print(f"\nPCA Explained Variance: PC1 = {var_exp[0]*100:.1f}%, PC2 = {var_exp[1]*100:.1f}% (Total = {sum(var_exp)*100:.1f}%)")
    
    # Plot 2D PCA Clusters
    plt.figure(figsize=(9, 7))
    cluster_names = {
        0: "Cluster 0: High Pedagogical Support Need",
        1: "Cluster 1: Moderate Need / Routine Follow-up",
        2: "Cluster 2: Benchmark / Self-Sustaining Schools"
    }
    df['cluster_name'] = df['support_cluster'].map(cluster_names)
    
    sns.scatterplot(
        data=df,
        x='pca_1', y='pca_2',
        hue='cluster_name',
        palette=["#D32F2F", "#F4B942", "#2E7D32"],
        alpha=0.75, s=60, edgecolor='none'
    )
    plt.title("Cluster School Profiles (2D PCA Projection)", fontsize=14, fontweight="bold")
    plt.xlabel(f"Principal Component 1 ({var_exp[0]*100:.1f}% Variance)")
    plt.ylabel(f"Principal Component 2 ({var_exp[1]*100:.1f}% Variance)")
    plt.legend(title="Support Archetype", loc="upper right")
    plt.tight_layout()
    pca_plot_path = os.path.join(reports_dir, "pca_clusters_2d.png")
    plt.savefig(pca_plot_path, dpi=300)
    plt.close()
    print(f"[Saved Plot] 2D PCA Cluster visualization saved to: {pca_plot_path}")
    
    # Save Models
    joblib.dump(kmeans, os.path.join(models_dir, "school_kmeans.joblib"))
    joblib.dump(pca, os.path.join(models_dir, "school_pca.joblib"))
    joblib.dump(scaler, os.path.join(models_dir, "clustering_scaler.joblib"))
    joblib.dump(cluster_features, os.path.join(models_dir, "clustering_features.joblib"))
    print("Clustering and PCA models saved successfully!")

if __name__ == "__main__":
    train_clustering_and_pca()

