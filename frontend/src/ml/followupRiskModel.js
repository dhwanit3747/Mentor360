export default {
  "modelType": "Logistic Regression",
  "trainingData": "Synthetic demonstration data; not real school or mentor records",
  "featureNames": [
    "followUpDays",
    "needsSupportCount",
    "partlyObservedCount"
  ],
  "featureScales": [
    30,
    6,
    6
  ],
  "intercept": -1.68518908702706,
  "weights": [
    0.9353660178431695,
    1.8340370540983182,
    0.4710921242127317
  ],
  "trainingSamples": 1920,
  "evaluationSamples": 480,
  "syntheticEvaluation": {
    "accuracy": 0.6333333333333333,
    "precision": 0.5833333333333334,
    "recall": 0.5666666666666667,
    "f1": 0.5748792270531401
  }
};
