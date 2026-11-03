# Experimental follow-up risk model

Mentor360 includes a Logistic Regression prototype that estimates whether an agreed action plan may receive a late follow-up. It uses:

- The planned number of days between action-plan creation and its follow-up date.
- The number of classroom-observation indicators marked "Needs Support."
- The number of indicators marked "Partly Observed."

The estimate appears in the Follow-up Tracker as decision support. It is not a rating of a teacher, school, or mentor and should not be used to make operational decisions.

## Train the model

From the `frontend` directory, run:

```bash
npm run train:followup-model
```

The script deterministically generates 2,400 synthetic examples, trains a Logistic Regression classifier with gradient descent, evaluates it on a held-out synthetic split, and writes the model parameters to `src/ml/followupRiskModel.js`.

The current held-out synthetic metrics are approximately 63.3% accuracy, 58.3% precision, 56.7% recall, and 57.5% F1. These measure how well the classifier learns the script's hypothetical data-generation process; they do **not** measure real-world predictive performance.

## Before real-world use

The app's current records are demo/seed data and do not provide enough trustworthy completed follow-up outcomes to train or validate a real predictive model. Replace the synthetic examples with appropriately consented, de-identified historical action-plan records and their actual follow-up outcomes. Define "late" consistently, evaluate on data held out by time or school, and have mentors review the predictions before using them to guide visits.
