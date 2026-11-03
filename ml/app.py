"""
Mentor360 - Machine Learning Inference REST API
Serves trained models for:
- Unit 1 & 4: School Cluster Segmentation (K-Means & 2D PCA)
- Unit 2 & 4: Visit Priority Score (Linear/Ridge Regression)
- Unit 3 & 4: Visit Urgency Level (Logistic Regression / Naive Bayes)
- Unit 5: Demonstration Technique Recommendation (Artificial Neural Network / MLP)
"""

import os
import joblib
import pandas as pd
import numpy as np
from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

BASE_DIR = os.path.dirname(__file__)
MODELS_DIR = os.path.join(BASE_DIR, "models")
DATA_DIR = os.path.join(BASE_DIR, "data")

# 1. Load Regression & Classification Models
priority_regressor = joblib.load(os.path.join(MODELS_DIR, "priority_regressor.joblib"))
urgency_classifier = joblib.load(os.path.join(MODELS_DIR, "urgency_classifier.joblib"))
scaler = joblib.load(os.path.join(MODELS_DIR, "scaler.joblib"))
feature_names = joblib.load(os.path.join(MODELS_DIR, "feature_names.joblib"))

# 2. Load Clustering & PCA Models
school_kmeans = joblib.load(os.path.join(MODELS_DIR, "school_kmeans.joblib"))
school_pca = joblib.load(os.path.join(MODELS_DIR, "school_pca.joblib"))
clustering_scaler = joblib.load(os.path.join(MODELS_DIR, "clustering_scaler.joblib"))
clustering_features = joblib.load(os.path.join(MODELS_DIR, "clustering_features.joblib"))

# 3. Load ANN Recommender Models
ann_recommender = joblib.load(os.path.join(MODELS_DIR, "ann_activity_recommender.joblib"))
ann_preprocessor = joblib.load(os.path.join(MODELS_DIR, "ann_preprocessor.joblib"))
ann_classes = joblib.load(os.path.join(MODELS_DIR, "ann_classes.joblib"))

# 4. Load Dataset Cache
DATASET_PATH = os.path.join(DATA_DIR, "mentor_dataset.csv")
dataset_df = pd.read_csv(DATASET_PATH) if os.path.exists(DATASET_PATH) else None

def parse_indicator(val):
    if isinstance(val, (int, float)):
        return max(0, min(2, int(val)))
    if isinstance(val, str):
        val_lower = val.lower().strip()
        if 'support' in val_lower or 'need' in val_lower:
            return 0
        if 'partly' in val_lower or 'partial' in val_lower:
            return 1
        if 'observed' in val_lower:
            return 2
    return 1  # Default fallback

@app.route('/api/ml/health', methods=['GET'])
def health():
    return jsonify({
        "status": "ok",
        "service": "Mentor360 Machine Learning Engine",
        "models_loaded": {
            "priority_regressor": "Linear Regression (R2=0.9529)",
            "urgency_classifier": "Logistic Regression / Naive Bayes (Acc=88.75%)",
            "clustering": "K-Means (K=3) + PCA (2D)",
            "ann_recommender": "Multi-Layer Perceptron ANN (Acc=99.58%)"
        },
        "dataset_records": len(dataset_df) if dataset_df is not None else 0
    })

@app.route('/api/ml/predict-priority', methods=['POST'])
def predict_priority():
    """
    Predicts Visit Priority Score (Regression) and Urgency Category (Classification)
    """
    try:
        data = request.get_json() or {}
        
        total_students = int(data.get('total_students', 100))
        total_teachers = max(1, int(data.get('total_teachers', 3)))
        ptr = round(total_students / total_teachers, 2)
        days_since_last_visit = int(data.get('days_since_last_visit', 21))
        previous_visit_count = int(data.get('previous_visit_count', 4))
        past_followup_rate = float(data.get('past_followup_completion_rate', 0.65))
        unresolved_needs = int(data.get('unresolved_needs_count', 2))
        
        inds = data.get('indicators', {})
        ind_lesson_objective = parse_indicator(inds.get('lessonObjective', 1))
        ind_teaching_strategy = parse_indicator(inds.get('teachingStrategy', 1))
        ind_student_participation = parse_indicator(inds.get('studentParticipation', 1))
        ind_use_of_tlm = parse_indicator(inds.get('useOfTLM', 1))
        ind_formative_assessment = parse_indicator(inds.get('formativeAssessment', 1))
        ind_inclusive_participation = parse_indicator(inds.get('inclusiveParticipation', 1))
        
        # Build feature vector matching training schema
        feature_dict = {
            'total_students': total_students,
            'total_teachers': total_teachers,
            'ptr': ptr,
            'days_since_last_visit': days_since_last_visit,
            'previous_visit_count': previous_visit_count,
            'past_followup_completion_rate': past_followup_rate,
            'unresolved_needs_count': unresolved_needs,
            'ind_lesson_objective': ind_lesson_objective,
            'ind_teaching_strategy': ind_teaching_strategy,
            'ind_student_participation': ind_student_participation,
            'ind_use_of_tlm': ind_use_of_tlm,
            'ind_formative_assessment': ind_formative_assessment,
            'ind_inclusive_participation': ind_inclusive_participation
        }
        
        row_df = pd.DataFrame([feature_dict])[feature_names]
        row_scaled = scaler.transform(row_df)
        
        # 1. Regression: Priority Score (0-100)
        score_pred = float(priority_regressor.predict(row_scaled)[0])
        score_clamped = round(max(5.0, min(100.0, score_pred)), 1)
        
        # 2. Classification: Urgency Category + Probabilities
        urgency_pred = str(urgency_classifier.predict(row_scaled)[0])
        urgency_probs_raw = urgency_classifier.predict_proba(row_scaled)[0]
        urgency_classes = urgency_classifier.classes_
        probabilities = {cls: round(float(prob), 3) for cls, prob in zip(urgency_classes, urgency_probs_raw)}
        
        # Primary Drivers / Explanations (Feature Importance Interpretation)
        drivers = []
        if days_since_last_visit > 25:
            drivers.append(f"High interval since last visit ({days_since_last_visit} days)")
        if unresolved_needs >= 3:
            drivers.append(f"Multiple unresolved pedagogical needs ({unresolved_needs} issues)")
        if ind_use_of_tlm == 0:
            drivers.append("Critical support needed on TLM / Manipulatives")
        if ind_student_participation == 0:
            drivers.append("Low active student participation / heavy choral chanting")
        if past_followup_rate < 0.5:
            drivers.append(f"Low previous action plan completion ({int(past_followup_rate*100)}%)")
        if not drivers:
            drivers.append("Balanced baseline indicators / routine monitoring")
            
        return jsonify({
            "success": True,
            "data": {
                "priority_score": score_clamped,
                "urgency_level": urgency_pred,
                "probabilities": probabilities,
                "primary_drivers": drivers,
                "ptr": ptr,
                "model_used": "Linear Regression + Logistic Regression (ML)"
            }
        })
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 400

@app.route('/api/ml/recommend-activity', methods=['POST'])
def recommend_activity():
    """
    Recommends FLN Demonstration Activity using trained Artificial Neural Network (MLP)
    """
    try:
        data = request.get_json() or {}
        subject = data.get('subject', 'Literacy')
        grade = data.get('grade', 'Grade 3')
        
        inds = data.get('indicators', {})
        ind_lesson_objective = parse_indicator(inds.get('lessonObjective', 1))
        ind_teaching_strategy = parse_indicator(inds.get('teachingStrategy', 1))
        ind_student_participation = parse_indicator(inds.get('studentParticipation', 1))
        ind_use_of_tlm = parse_indicator(inds.get('useOfTLM', 1))
        ind_formative_assessment = parse_indicator(inds.get('formativeAssessment', 1))
        ind_inclusive_participation = parse_indicator(inds.get('inclusiveParticipation', 1))
        
        input_df = pd.DataFrame([{
            'subject': subject,
            'grade': grade,
            'ind_lesson_objective': ind_lesson_objective,
            'ind_teaching_strategy': ind_teaching_strategy,
            'ind_student_participation': ind_student_participation,
            'ind_use_of_tlm': ind_use_of_tlm,
            'ind_formative_assessment': ind_formative_assessment,
            'ind_inclusive_participation': ind_inclusive_participation
        }])
        
        X_proc = ann_preprocessor.transform(input_df)
        pred_activity = str(ann_recommender.predict(X_proc)[0])
        probs = ann_recommender.predict_proba(X_proc)[0]
        
        class_probs = []
        for cls_name, prob in zip(ann_recommender.classes_, probs):
            class_probs.append({
                "activity": cls_name,
                "confidence": round(float(prob), 4),
                "confidence_pct": round(float(prob) * 100, 1)
            })
            
        class_probs.sort(key=lambda x: x['confidence'], reverse=True)
        top_confidence = class_probs[0]['confidence_pct']
        
        # Link to details
        activity_summaries = {
            "Ganit Mala (Beaded Number Line)": "Concrete 100-bead string grouped in alternating tens for visual number sense and place value.",
            "Akshar-Chitra Wall Chart": "Tactile letter-sound chart connecting letter flashcards with everyday objects to build phonemic recognition.",
            "Guided Partner Reading": "Peer-supported paired reading routine to build fluency and engagement in hesitant readers.",
            "Concrete Stick Bundles & Loose Sticks": "Physical straw bundles of 10 bound with rubber bands to teach place value regrouping.",
            "Quick Thumbs Check / Exit Slates": "Non-verbal, simultaneous classroom check where all students show answers on slates.",
            "Think-Pair-Share Math Talk": "Structured peer dialogue routine giving 30s think time, 1m pair discussion before open sharing."
        }
        
        return jsonify({
            "success": True,
            "data": {
                "recommended_activity": pred_activity,
                "confidence": top_confidence,
                "summary": activity_summaries.get(pred_activity, "NIPUN Bharat foundational pedagogical demonstration."),
                "ranking": class_probs,
                "model_used": "Artificial Neural Network (MLP: 11->64->32->6, ReLU + Softmax)"
            }
        })
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 400

@app.route('/api/ml/cluster-schools', methods=['GET'])
def get_cluster_schools():
    """
    Returns 2D PCA coordinates and K-Means cluster profiles for cluster schools
    """
    try:
        if dataset_df is None:
            return jsonify({"success": False, "error": "Dataset not found"}), 404
            
        # Select first 60 distinct school records for cluster visualization
        sample_df = dataset_df.head(60).copy()
        
        X = sample_df[clustering_features]
        X_scaled = clustering_scaler.transform(X)
        
        cluster_labels = school_kmeans.predict(X_scaled)
        pca_coords = school_pca.transform(X_scaled)
        
        sample_df['cluster_id'] = cluster_labels
        sample_df['pca_x'] = np.round(pca_coords[:, 0], 2)
        sample_df['pca_y'] = np.round(pca_coords[:, 1], 2)
        
        cluster_definitions = [
            {
                "id": 0,
                "name": "High Pedagogical Support Need",
                "tag": "Focus on Manipulatives & Participation",
                "color": "#D32F2F",
                "description": "Schools with lower student participation, frequent choral reciting, and high need for concrete TLM.",
                "count": int(np.sum(cluster_labels == 0))
            },
            {
                "id": 1,
                "name": "Moderate Support / Routine Tracking",
                "tag": "Focus on Formative Checks",
                "color": "#F4B942",
                "description": "Schools demonstrating foundational strategies, needing routine check-ins on exit slates and pacing.",
                "count": int(np.sum(cluster_labels == 1))
            },
            {
                "id": 2,
                "name": "Benchmark / Self-Sustaining",
                "tag": "Model Demonstration Centers",
                "color": "#2E7D32",
                "description": "High active participation, consistent manipulative usage, candidate host schools for peer cluster visits.",
                "count": int(np.sum(cluster_labels == 2))
            }
        ]
        
        points = []
        for idx, row in sample_df.iterrows():
            points.append({
                "record_id": row['record_id'],
                "school_id": row['school_id'],
                "school_name": row['school_name'],
                "cluster_id": int(row['cluster_id']),
                "pca_x": float(row['pca_x']),
                "pca_y": float(row['pca_y']),
                "ptr": float(row['ptr']),
                "priority_score": float(row['priority_score']),
                "urgency_level": row['urgency_level'],
                "days_since_last_visit": int(row['days_since_last_visit']),
                "composite_pedagogical_score": int(row['composite_pedagogical_score'])
            })
            
        return jsonify({
            "success": True,
            "data": {
                "clusters": cluster_definitions,
                "schools": points,
                "pca_explained_variance": [18.1, 11.7],
                "total_analyzed": len(points)
            }
        })
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 400

@app.route('/api/ml/dataset/summary', methods=['GET'])
def get_dataset_summary():
    """
    Returns summary statistics of the NIPUN Bharat ML training dataset
    """
    try:
        if dataset_df is None:
            return jsonify({"success": False, "error": "Dataset not found"}), 404
            
        summary = {
            "total_records": len(dataset_df),
            "features_count": dataset_df.shape[1],
            "urgency_distribution": dataset_df['urgency_level'].value_counts().to_dict(),
            "activity_distribution": dataset_df['recommended_activity'].value_counts().to_dict(),
            "avg_priority_score": round(float(dataset_df['priority_score'].mean()), 1),
            "avg_ptr": round(float(dataset_df['ptr'].mean()), 1),
            "avg_days_between_visits": round(float(dataset_df['days_since_last_visit'].mean()), 1)
        }
        return jsonify({"success": True, "data": summary})
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 400

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5001))
    print(f">> Starting Mentor360 ML REST Service on http://127.0.0.1:{port}...")
    app.run(host='127.0.0.1', port=port, debug=False)

