import { ActionPlan, Observation, School, Visit } from '../types';
import { MlPriorityInput } from '../services/api';

const indicatorKeys = [
  'lessonObjective',
  'teachingStrategy',
  'studentParticipation',
  'useOfTLM',
  'formativeAssessment',
  'inclusiveParticipation'
] as const;

function indicatorValue(value: string | undefined): number {
  if (value === 'Observed') return 2;
  if (value === 'Needs Support') return 0;
  return 1;
}

export function buildMlPriorityInput(
  school: School,
  visits: Visit[],
  observations: Observation[],
  actionPlans: ActionPlan[]
): MlPriorityInput {
  const completedVisits = visits.filter(visit => visit.status === 'Completed');
  const latestObservation = [...observations].sort((a, b) =>
    b.createdAt.localeCompare(a.createdAt)
  )[0];
  const completedVisitDates = completedVisits
    .map(visit => visit.completedDate || visit.scheduledDate)
    .sort();
  const latestVisitDate = school.lastVisitDate || completedVisitDates[completedVisitDates.length - 1];
  const daysSinceLastVisit = latestVisitDate
    ? Math.max(0, Math.floor((Date.now() - new Date(`${latestVisitDate}T00:00:00`).getTime()) / 86400000))
    : 21;
  const completedPlans = actionPlans.filter(plan => plan.status === 'Completed').length;
  const indicators = Object.fromEntries(
    indicatorKeys.map(key => [key, indicatorValue(latestObservation?.indicators[key])])
  );

  return {
    total_students: school.totalStudents,
    total_teachers: school.totalTeachers,
    days_since_last_visit: daysSinceLastVisit,
    previous_visit_count: completedVisits.length,
    past_followup_completion_rate: actionPlans.length
      ? completedPlans / actionPlans.length
      : 0.65,
    unresolved_needs_count: Math.max(
      actionPlans.filter(plan => plan.status !== 'Completed').length,
      school.supportNeeds.length
    ),
    indicators
  };
}
