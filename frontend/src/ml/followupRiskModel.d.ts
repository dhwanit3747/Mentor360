declare const model: {
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
