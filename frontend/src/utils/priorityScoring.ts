/**
 * Mentor360 Rule-Based Visit & Task Priority Scoring System
 *
 * FORMULA:
 * P = 4*U + 3*N + 2*F + D
 *
 * Where:
 * - U (Urgency, 0 to 2):
 *     0 = Routine visit / Low urgency (>7 days away)
 *     1 = Approaching deadline / Moderate urgency (3-7 days away)
 *     2 = High urgency / Immediate attention required (due today or within 48h)
 *
 * - N (Unresolved Support-Need Severity, 0 to 2):
 *     0 = No pending critical support needs recorded
 *     1 = Ongoing moderate pedagogical support needs identified
 *     2 = High support needs (e.g. foundational learning gap / multiple struggling areas)
 *
 * - F (Follow-up Importance, 0 to 2):
 *     0 = General check-in / No specific teacher action plan pending
 *     1 = Standard follow-up on agreed classroom demonstration
 *     2 = Critical pedagogical action plan requiring verification
 *
 * - D (Overdue Level, 0 to 2):
 *     0 = On schedule / Not overdue
 *     1 = 1-5 days past agreed timeline
 *     2 = >5 days overdue / significantly delayed visit
 *
 * Maximum Score: 20
 *
 * NOTE: This score is strictly a planning and scheduling aid for the mentor,
 * never an objective measure or punitive ranking of teacher quality or school performance.
 */

export interface PriorityBreakdown {
  score: number;
  maxScore: number;
  urgency: number;
  needSeverity: number;
  followUpImportance: number;
  overdueLevel: number;
  level: 'High Priority' | 'Medium Priority' | 'Normal Priority';
  colorClass: string;
  badgeBg: string;
  badgeText: string;
  primaryReason: string;
  componentsText: string[];
}

export function calculatePriorityScore(
  urgency: number,
  needSeverity: number,
  followUpImportance: number,
  overdueLevel: number
): PriorityBreakdown {
  // Clamp values strictly between 0 and 2
  const U = Math.min(2, Math.max(0, Math.round(urgency)));
  const N = Math.min(2, Math.max(0, Math.round(needSeverity)));
  const F = Math.min(2, Math.max(0, Math.round(followUpImportance)));
  const D = Math.min(2, Math.max(0, Math.round(overdueLevel)));

  const score = (4 * U) + (3 * N) + (2 * F) + D;

  // Determine priority classification level
  let level: 'High Priority' | 'Medium Priority' | 'Normal Priority' = 'Normal Priority';
  let colorClass = 'text-teal-700 bg-teal-50 border-teal-200';
  let badgeBg = '#E6F2EF';
  let badgeText = '#176B5B';

  if (score >= 14) {
    level = 'High Priority';
    colorClass = 'text-amber-800 bg-amber-50 border-amber-300';
    badgeBg = '#FEF3C7';
    badgeText = '#B45309';
  } else if (score >= 8) {
    level = 'Medium Priority';
    colorClass = 'text-emerald-800 bg-emerald-50 border-emerald-200';
    badgeBg = '#ECFDF5';
    badgeText = '#065F46';
  }

  // Construct readable explanation reasons
  const componentsText: string[] = [];
  if (D === 2) componentsText.push('Follow-up significantly overdue (>5 days)');
  else if (D === 1) componentsText.push('Follow-up slightly overdue');

  if (U === 2) componentsText.push('Scheduled visit is imminent or due today');
  else if (U === 1) componentsText.push('Visit scheduled within the upcoming 3-7 days');

  if (N === 2) componentsText.push('Multiple high foundational literacy/numeracy support needs recorded');
  else if (N === 1) componentsText.push('Unresolved teaching strategy support areas identified');

  if (F === 2) componentsText.push('Crucial agreed teacher action plan pending observation');
  else if (F === 1) componentsText.push('Routine post-observation follow-up scheduled');

  let primaryReason = 'Routine scheduled mentoring visit.';
  if (D >= 1 && F >= 1) {
    primaryReason = 'Suggested first: an agreed support action plan is overdue for classroom review.';
  } else if (U === 2 && N >= 1) {
    primaryReason = 'High urgency: active classroom support request awaiting mentor demonstration.';
  } else if (N === 2) {
    primaryReason = 'High pedagogical focus: unresolved literacy/numeracy learning gaps noted in last visit.';
  } else if (score >= 12) {
    primaryReason = 'Priority visit: combined approaching deadline and pending teacher action plan.';
  } else if (componentsText.length > 0) {
    primaryReason = componentsText[0];
  }

  return {
    score,
    maxScore: 20,
    urgency: U,
    needSeverity: N,
    followUpImportance: F,
    overdueLevel: D,
    level,
    colorClass,
    badgeBg,
    badgeText,
    primaryReason,
    componentsText
  };
}

/**
 * Format score into display string
 */
export function formatPriorityScoreDisplay(score: number, override?: number | null): string {
  if (override !== undefined && override !== null) {
    return `${override}/20 (Overridden)`;
  }
  return `${score}/20`;
}
