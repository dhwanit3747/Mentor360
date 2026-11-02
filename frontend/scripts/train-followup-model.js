import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const scriptDirectory = dirname(fileURLToPath(import.meta.url));
const outputPath = resolve(scriptDirectory, '../src/ml/followupRiskModel.js');
const declarationPath = resolve(scriptDirectory, '../src/ml/followupRiskModel.d.ts');
const sampleCount = 2400;
const featureCount = 3;
let randomState = 3602026;

function random() {
  randomState = (1664525 * randomState + 1013904223) >>> 0;
  return randomState / 0x100000000;
}

function sigmoid(value) {
  return 1 / (1 + Math.exp(-value));
}

function createSyntheticExample() {
  const followUpDays = 3 + Math.floor(random() * 28);
  const supportNeeds = Math.floor(random() * 7);
  const partialIndicators = Math.floor(random() * (7 - supportNeeds));
  const features = [
    followUpDays / 30,
    supportNeeds / 6,
    partialIndicators / 6
  ];

  const syntheticDelayProbability = sigmoid(
    -2.2 + 1.1 * features[0] + 2.4 * features[1] + 0.9 * features[2]
  );

  return { features, label: random() < syntheticDelayProbability ? 1 : 0 };
}

const examples = Array.from({ length: sampleCount }, createSyntheticExample);
const trainingExamples = examples.slice(0, Math.floor(sampleCount * 0.8));
const evaluationExamples = examples.slice(trainingExamples.length);
const weights = Array(featureCount).fill(0);
let intercept = 0;
const learningRate = 0.08;
const epochs = 3000;

for (let epoch = 0; epoch < epochs; epoch += 1) {
  const weightGradients = Array(featureCount).fill(0);
  let interceptGradient = 0;

  for (const example of trainingExamples) {
    const prediction = sigmoid(
      intercept + example.features.reduce((sum, feature, index) => sum + feature * weights[index], 0)
    );
    const error = prediction - example.label;
    interceptGradient += error;

    for (let index = 0; index < featureCount; index += 1) {
      weightGradients[index] += error * example.features[index];
    }
  }

  intercept -= learningRate * interceptGradient / trainingExamples.length;
  for (let index = 0; index < featureCount; index += 1) {
    weights[index] -= learningRate * weightGradients[index] / trainingExamples.length;
  }
}

let correct = 0;
let truePositives = 0;
let falsePositives = 0;
let falseNegatives = 0;

for (const example of evaluationExamples) {
  const probability = sigmoid(
    intercept + example.features.reduce((sum, feature, index) => sum + feature * weights[index], 0)
  );
  const predicted = probability >= 0.5 ? 1 : 0;

  if (predicted === example.label) correct += 1;
  if (predicted === 1 && example.label === 1) truePositives += 1;
  if (predicted === 1 && example.label === 0) falsePositives += 1;
  if (predicted === 0 && example.label === 1) falseNegatives += 1;
}

const precision = truePositives / Math.max(1, truePositives + falsePositives);
const recall = truePositives / Math.max(1, truePositives + falseNegatives);
const model = {
  modelType: 'Logistic Regression',
  trainingData: 'Synthetic demonstration data; not real school or mentor records',
  featureNames: ['followUpDays', 'needsSupportCount', 'partlyObservedCount'],
  featureScales: [30, 6, 6],
  intercept,
  weights,
  trainingSamples: trainingExamples.length,
  evaluationSamples: evaluationExamples.length,
  syntheticEvaluation: {
    accuracy: correct / evaluationExamples.length,
    precision,
    recall,
    f1: 2 * precision * recall / Math.max(Number.EPSILON, precision + recall)
  }
};

mkdirSync(dirname(outputPath), { recursive: true });
writeFileSync(outputPath, `export default ${JSON.stringify(model, null, 2)};\n`);
writeFileSync(
  declarationPath,
  `declare const model: {
  readonly modelType: string;
  readonly trainingData: string;
  readonly featureNames: readonly string[];
  readonly featureScales: readonly number[];
  readonly intercept: number;
  readonly weights: readonly number[];
  readonly trainingSamples: number;
  readonly evaluationSamples: number;
  readonly syntheticEvaluation: {
    readonly accuracy: number;
    readonly precision: number;
    readonly recall: number;
    readonly f1: number;
  };
};
export default model;
`
);

console.log(`Trained ${model.modelType} on ${model.trainingSamples} synthetic examples.`);
console.log(`Held-out synthetic evaluation: ${(model.syntheticEvaluation.accuracy * 100).toFixed(1)}% accuracy.`);
console.log(`Model saved to ${outputPath}`);
console.log('These metrics measure only the synthetic demonstration data, not real-world performance.');
