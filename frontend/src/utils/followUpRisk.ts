import model from '../ml/followupRiskModel.js';
import type { ActionPlan, Observation } from '../types';

export interface FollowUpRiskPrediction {
  probability: number;
  level: 'Lower' | 'Moderate' | 'Higher';
  followUpDays: number;
  needsSupportCount: number;
  partlyObservedCount: number;
  hasObservation: boolean;
}

function sigmoid(value: number): number {
  return 1 / (1 + Math.exp(-value));
}

export function predictFollowUpRisk(
  plan: ActionPlan,
  observation?: Observation
): FollowUpRiskPrediction {
  const followUpDays = Math.max(
    0,
    Math.round(
      (Date.parse(`${plan.followUpDate}T00:00:00Z`) - Date.parse(plan.createdAt)) /
        (24 * 60 * 60 * 1000)
    )
  );
  const statuses = observation ? Object.values(observation.indicators) : [];
  const needsSupportCount = statuses.filter(status => status === 'Needs Support').length;
  const partlyObservedCount = statuses.filter(status => status === 'Partly Observed').length;
  const features = [
    followUpDays / model.featureScales[0],
    needsSupportCount / model.featureScales[1],
    partlyObservedCount / model.featureScales[2]
  ];
  const probability = sigmoid(
    model.intercept + features.reduce((sum, feature, index) => sum + feature * model.weights[index], 0)
  );

  return {
    probability,
    level: probability >= 0.6 ? 'Higher' : probability >= 0.35 ? 'Moderate' : 'Lower',
    followUpDays,
    needsSupportCount,
    partlyObservedCount,
    hasObservation: Boolean(observation)
  };
}
