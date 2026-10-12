import test from 'node:test';
import assert from 'node:assert';
import { calculatePriorityScore } from '../src/utils/priorityScoring.ts';

test('Priority Score Calculation: Max Score is 20 when all components are 2', () => {
  // P = 4(2) + 3(2) + 2(2) + 2 = 8 + 6 + 4 + 2 = 20
  const result = calculatePriorityScore(2, 2, 2, 2);
  assert.strictEqual(result.score, 20);
  assert.strictEqual(result.level, 'High Priority');
  assert.strictEqual(result.urgency, 2);
  assert.strictEqual(result.needSeverity, 2);
  assert.strictEqual(result.followUpImportance, 2);
  assert.strictEqual(result.overdueLevel, 2);
});

test('Priority Score Calculation: Min Score is 0 when all components are 0', () => {
  // P = 4(0) + 3(0) + 2(0) + 0 = 0
  const result = calculatePriorityScore(0, 0, 0, 0);
  assert.strictEqual(result.score, 0);
  assert.strictEqual(result.level, 'Normal Priority');
});

test('Priority Score Calculation: Moderate urgency and standard follow-up', () => {
  // U=1, N=1, F=1, D=0 => 4(1) + 3(1) + 2(1) + 0 = 9
  const result = calculatePriorityScore(1, 1, 1, 0);
  assert.strictEqual(result.score, 9);
  assert.strictEqual(result.level, 'Medium Priority');
});

test('Priority Score Calculation: Bounds Clamping', () => {
  // Values above 2 or below 0 should clamp to [0, 2]
  const result = calculatePriorityScore(5, -2, 10, -1);
  assert.strictEqual(result.urgency, 2);
  assert.strictEqual(result.needSeverity, 0);
  assert.strictEqual(result.followUpImportance, 2);
  assert.strictEqual(result.overdueLevel, 0);
  // P = 4(2) + 3(0) + 2(2) + 0 = 12
  assert.strictEqual(result.score, 12);
});
