import { Observation } from '../types';
import { DEMO_ACTIVITIES } from '../services/demoActivityLibrary';

export interface GeneratedFeedbackDraft {
  strengths: string;
  improvementArea: string;
  recommendedActivityId: string;
  demonstrationActivity: string;
  agreedAction: string;
  followUpDate: string;
  successIndicator: string;
}

export function generateFeedbackDraftFromObservation(obs: Observation): GeneratedFeedbackDraft {
  const isLiteracy = obs.lessonFocus === 'Literacy';

  // 1. Synthesize Strengths from recorded observation notes or fallback
  let strengths = obs.strengths?.trim() || '';
  if (!strengths) {
    if (obs.indicators.lessonObjective === 'Observed') {
      strengths = `Clear articulation of lesson goals and warm classroom engagement with learners during ${obs.subject}.`;
    } else {
      strengths = `Encouraging and patient classroom demeanor, keeping students attentive during the lesson.`;
    }
  }

  // 2. Identify the single highest priority improvement opportunity based on indicators
  let improvementArea = '';
  let selectedActivity = DEMO_ACTIVITIES[0];

  if (obs.indicators.studentParticipation === 'Needs Support') {
    improvementArea = 'Shift from purely whole-class choral repetition to active peer participation so all students practice.';
    selectedActivity = isLiteracy ? DEMO_ACTIVITIES[0] : DEMO_ACTIVITIES[5]; // Guided Partner Reading or Think-Pair-Share Math Talk
  } else if (obs.indicators.formativeAssessment === 'Needs Support') {
    improvementArea = 'Incorporate quick, non-verbal formative checks during the lesson rather than only asking front-row volunteers.';
    selectedActivity = DEMO_ACTIVITIES[4]; // Quick Thumbs Check / Exit Slates
  } else if (obs.indicators.useOfTLM === 'Needs Support' || obs.indicators.useOfTLM === 'Partly Observed') {
    if (isLiteracy) {
      improvementArea = 'Use tactile letter-sound charts and word cards so students physically connect sounds to symbols.';
      selectedActivity = DEMO_ACTIVITIES[1]; // Akshar-Chitra Wall Chart
    } else {
      improvementArea = 'Introduce concrete manipulatives (Ganit Mala bead strings or stick bundles) before abstract blackboard arithmetic.';
      selectedActivity = DEMO_ACTIVITIES[2]; // Ganit Mala
    }
  } else if (obs.indicators.teachingStrategy === 'Needs Support' || obs.indicators.teachingStrategy === 'Partly Observed') {
    if (isLiteracy) {
      improvementArea = 'Demonstrate guided peer reading to build fluency in hesitant readers.';
      selectedActivity = DEMO_ACTIVITIES[0];
    } else {
      improvementArea = 'Demonstrate concrete place-value regrouping with stick bundles before vertical arithmetic.';
      selectedActivity = DEMO_ACTIVITIES[3];
    }
  } else if (obs.indicators.inclusiveParticipation === 'Needs Support') {
    improvementArea = 'Ensure back-row and hesitant learners receive structured opportunities to answer in pairs or with slates.';
    selectedActivity = isLiteracy ? DEMO_ACTIVITIES[0] : DEMO_ACTIVITIES[5];
  } else {
    // Default to first matching activity
    selectedActivity = DEMO_ACTIVITIES.find(a => a.category === obs.lessonFocus) || DEMO_ACTIVITIES[0];
    improvementArea = selectedActivity.targetNeed;
  }

  // Calculate default follow-up date (7 to 10 days from today)
  const defaultFollowUp = new Date();
  defaultFollowUp.setDate(defaultFollowUp.getDate() + 9);
  const followUpDateStr = defaultFollowUp.toISOString().split('T')[0];

  return {
    strengths,
    improvementArea: obs.supportAreas?.trim() || improvementArea,
    recommendedActivityId: selectedActivity.id,
    demonstrationActivity: `${selectedActivity.title}: ${selectedActivity.summary}`,
    agreedAction: selectedActivity.suggestedActionForTeacher,
    followUpDate: followUpDateStr,
    successIndicator: selectedActivity.observableSuccessIndicator
  };
}
