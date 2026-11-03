"""
Mentor360 - Dataset Generator for Machine Learning
Generates realistic, domain-grounded NIPUN Bharat FLN classroom observation and school visit data.

Aligned with Adani University ML Course Syllabus:
- Unit 1: Data Pre-processing, feature structures, data quality
- Unit 2: Supervised regression & classification modeling targets
- Unit 4: Unsupervised clustering targets (school profiles)
- Unit 5: Multi-class targets for Artificial Neural Network (ANN) activity recommender
"""

import os
import numpy as np
import pandas as pd

def generate_mentor_dataset(n_samples=1200, random_state=42):
    np.random.seed(random_state)
    
    # 1. School Identifiers & Names
    school_prefixes = [
        "Saraswati Primary School", "Shakti Govt Primary School", "Adarsh Prathmik Shala",
        "Kendriya Prathmik Vidyalaya", "Rajkiya Buniyadi Shala", "Zilla Parishad Primary School",
        "Vivekananda Shiksha Niketan", "Mahatma Gandhi Bal Vidyalaya", "Kasturba Gandhi Balika Vidyalaya",
        "Navodaya Prathmik Shala", "Prathmik Vidyalaya Rampur", "Prathmik Shala Shaktipur",
        "Gramin Buniyadi Shala", "Panchayat Primary School", "Bal Bharti Vidyalaya"
    ]
    clusters = ["Raipur Rural Cluster 1", "Raipur Rural Cluster 2", "Raipur Rural Cluster 3", "Raipur Rural Cluster 4"]
    grades_list = ["Grade 1", "Grade 2", "Grade 3", "Grade 4", "Grade 5"]
    subjects_list = ["Literacy", "Numeracy"]
    
    records = []
    
    for i in range(n_samples):
        school_id = f"SCH-{1000 + (i % 80)}"
        school_name = f"{np.random.choice(school_prefixes)} - Sector {((i % 80) // 10) + 1}"
        cluster = np.random.choice(clusters)
        grade = np.random.choice(grades_list)
        subject = np.random.choice(subjects_list, p=[0.52, 0.48])
        
        # School demographics (Rural Indian Primary School distribution)
        total_teachers = int(np.random.choice([2, 3, 4, 5, 6, 7], p=[0.15, 0.30, 0.25, 0.15, 0.10, 0.05]))
        ptr_target = np.random.normal(32, 7)  # Typical Pupil-Teacher Ratio
        ptr_target = max(15, min(55, ptr_target))
        total_students = int(np.clip(total_teachers * ptr_target + np.random.normal(0, 10), 35, 260))
        actual_ptr = round(total_students / total_teachers, 2)
        
        # Historical visit & timeline features
        days_since_last_visit = int(np.clip(np.random.exponential(scale=22) + 4, 3, 75))
        previous_visit_count = int(np.clip(np.random.poisson(lam=4) + 1, 1, 14))
        past_followup_completion_rate = round(float(np.clip(np.random.beta(a=4, b=2), 0.0, 1.0)), 3)
        unresolved_needs_count = int(np.random.choice([0, 1, 2, 3, 4, 5], p=[0.20, 0.30, 0.25, 0.15, 0.07, 0.03]))
        
        # Latent school capacity factor (governs pedagogical struggle vs excellence)
        # Higher capacity -> better indicators, lower urgency
        school_capacity = np.clip(
            0.5 * (1.0 - (actual_ptr - 15) / 40.0) +
            0.3 * past_followup_completion_rate -
            0.2 * (unresolved_needs_count / 5.0) +
            np.random.normal(0, 0.15),
            0.0, 1.0
        )
        
        # 6 NIPUN Bharat Classroom Observation Dimensions
        # 0 = Needs Support, 1 = Partly Observed, 2 = Observed
        def sample_indicator(bias):
            p0 = max(0.05, min(0.85, 0.6 - bias * 0.5))
            p2 = max(0.05, min(0.85, 0.1 + bias * 0.6))
            p1 = max(0.10, 1.0 - p0 - p2)
            total = p0 + p1 + p2
            return int(np.random.choice([0, 1, 2], p=[p0/total, p1/total, p2/total]))
        
        ind_lesson_objective = sample_indicator(school_capacity + np.random.normal(0, 0.1))
        ind_teaching_strategy = sample_indicator(school_capacity - 0.05)
        # High PTR directly hurts active student participation & inclusive participation
        ptr_penalty = (actual_ptr - 30) / 50.0
        ind_student_participation = sample_indicator(school_capacity - ptr_penalty)
        ind_use_of_tlm = sample_indicator(school_capacity + (0.1 if subject == 'Literacy' else -0.1))
        ind_formative_assessment = sample_indicator(school_capacity - 0.1)
        ind_inclusive_participation = sample_indicator(school_capacity - ptr_penalty * 0.8)
        
        # Composite Pedagogical Support Gap (0 to 12 scale, where 12 = full mastery, 0 = severe need)
        composite_pedagogical_score = (
            ind_lesson_objective + ind_teaching_strategy + ind_student_participation +
            ind_use_of_tlm + ind_formative_assessment + ind_inclusive_participation
        )
        pedagogical_gap = 12 - composite_pedagogical_score  # Higher gap = more support needed
        
        # Target 1: Continuous Priority Score (0 to 100) for Supervised Regression
        # Real-world dynamic weighting with non-linear factors and interaction terms
        base_urgency = (
            3.2 * (days_since_last_visit / 7.0) +           # Overdue weight (~0 to 35 pts)
            3.8 * pedagogical_gap +                          # Support gap weight (~0 to 45 pts)
            4.5 * unresolved_needs_count +                   # Unresolved needs (~0 to 22 pts)
            12.0 * (1.0 - past_followup_completion_rate) +   # Follow-up neglect penalty (~0 to 12 pts)
            0.25 * (actual_ptr - 30)                         # PTR pressure factor
        )
        noise = np.random.normal(0, 3.5)
        priority_score = float(np.clip(base_urgency + noise, 5.0, 98.5))
        priority_score = round(priority_score, 2)
        
        # Target 2: Discrete Urgency Category for Supervised Classification & Naive Bayes
        if priority_score >= 65.0:
            urgency_level = "High Priority"
        elif priority_score >= 40.0:
            urgency_level = "Medium Priority"
        else:
            urgency_level = "Normal Priority"
            
        # Target 3: Recommended FLN Demonstration Activity for ANN (Multi-Layer Perceptron)
        # 6 activity classes based on NIPUN Bharat FLN pedagogy library
        if ind_use_of_tlm == 0:
            if subject == "Numeracy":
                recommended_activity = "Ganit Mala (Beaded Number Line)"
            else:
                recommended_activity = "Akshar-Chitra Wall Chart"
        elif ind_student_participation == 0:
            if subject == "Literacy":
                recommended_activity = "Guided Partner Reading"
            else:
                recommended_activity = "Think-Pair-Share Math Talk"
        elif ind_formative_assessment == 0:
            recommended_activity = "Quick Thumbs Check / Exit Slates"
        elif ind_teaching_strategy == 0 and subject == "Numeracy":
            recommended_activity = "Concrete Stick Bundles & Loose Sticks"
        else:
            # Fallback according to primary subject focus
            if subject == "Literacy":
                recommended_activity = "Guided Partner Reading" if ind_inclusive_participation <= 1 else "Akshar-Chitra Wall Chart"
            else:
                recommended_activity = "Think-Pair-Share Math Talk" if ind_inclusive_participation <= 1 else "Ganit Mala (Beaded Number Line)"
                
        records.append({
            "record_id": f"REC-{i+1:04d}",
            "school_id": school_id,
            "school_name": school_name,
            "cluster": cluster,
            "grade": grade,
            "subject": subject,
            "total_students": total_students,
            "total_teachers": total_teachers,
            "ptr": actual_ptr,
            "days_since_last_visit": days_since_last_visit,
            "previous_visit_count": previous_visit_count,
            "past_followup_completion_rate": past_followup_completion_rate,
            "unresolved_needs_count": unresolved_needs_count,
            "ind_lesson_objective": ind_lesson_objective,
            "ind_teaching_strategy": ind_teaching_strategy,
            "ind_student_participation": ind_student_participation,
            "ind_use_of_tlm": ind_use_of_tlm,
            "ind_formative_assessment": ind_formative_assessment,
            "ind_inclusive_participation": ind_inclusive_participation,
            "composite_pedagogical_score": composite_pedagogical_score,
            "priority_score": priority_score,
            "urgency_level": urgency_level,
            "recommended_activity": recommended_activity
        })
        
    df = pd.DataFrame(records)
    return df

if __name__ == "__main__":
    output_dir = os.path.join(os.path.dirname(__file__), "data")
    os.makedirs(output_dir, exist_ok=True)
    
    csv_path = os.path.join(output_dir, "mentor_dataset.csv")
    df = generate_mentor_dataset(n_samples=1200, random_state=42)
    df.to_csv(csv_path, index=False)
    
    print(f"Generated {len(df)} records successfully saved to:\n  {csv_path}\n")
    print("Class Distribution of 'urgency_level' (Classification Target):")
    print(df['urgency_level'].value_counts())
    print("\nClass Distribution of 'recommended_activity' (ANN Target):")
    print(df['recommended_activity'].value_counts())
    print("\nSummary Statistics of 'priority_score' (Regression Target):")
    print(df['priority_score'].describe())

