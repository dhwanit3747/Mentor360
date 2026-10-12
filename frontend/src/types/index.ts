export type IndicatorStatus = 'Observed' | 'Partly Observed' | 'Needs Support';

export type ActionPlanStatus = 'Not Started' | 'In Progress' | 'Completed' | 'Needs Further Support';

export type VisitStatus = 'Scheduled' | 'In Progress' | 'Completed' | 'Cancelled';

export type LessonFocusType = 'Literacy' | 'Numeracy';

export interface ObservationIndicators {
  lessonObjective: IndicatorStatus;
  teachingStrategy: IndicatorStatus;
  studentParticipation: IndicatorStatus;
  useOfTLM: IndicatorStatus;
  formativeAssessment: IndicatorStatus;
  inclusiveParticipation: IndicatorStatus;
}

export interface School {
  id: string;
  name: string;
  code: string;
  location: string;
  block: string;
  district: string;
  grades: string;
  totalTeachers: number;
  totalStudents: number;
  headTeacher: string;
  phone: string;
  lastVisitDate: string | null;
  nextVisitDate: string | null;
  supportNeeds: string[];
  notes: string;
}

export interface Visit {
  id: string;
  schoolId: string;
  schoolName?: string;
  scheduledDate: string; // YYYY-MM-DD
  scheduledTime: string; // HH:MM
  purpose: string;
  status: VisitStatus;
  priorityScore: number;
  priorityReason: string;
  urgency: number; // 0-2
  needSeverity: number; // 0-2
  followUpImportance: number; // 0-2
  overdueLevel: number; // 0-2
  mentorPriorityOverride?: number | null;
  mentorOverrideReason?: string | null;
  focusArea: string;
  notes: string;
  completedDate?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface Observation {
  id: string;
  schoolId: string;
  visitId: string;
  teacherName: string;
  grade: string;
  subject: string;
  topic: string;
  lessonFocus: LessonFocusType;
  indicators: ObservationIndicators;
  evidenceNotes: string;
  strengths: string;
  supportAreas: string;
  status: 'Draft' | 'Completed';
  createdAt: string;
  updatedAt: string;
}

export interface ActionPlan {
  id: string;
  schoolId: string;
  visitId: string;
  observationId: string;
  teacherName: string;
  grade?: string;
  improvementArea: string;
  demonstrationActivity: string;
  agreedAction: string;
  followUpDate: string;
  successIndicator: string;
  status: ActionPlanStatus;
  followUpNotes: string;
  triedActivity: boolean | null;
  activityReflection?: string;
  createdAt: string;
  updatedAt: string;
}

export interface MentorProfile {
  id: string;
  name: string;
  designation: string;
  cluster: string;
  block: string;
  district: string;
  state: string;
  phone: string;
  email: string;
  assignedSchoolsCount: number;
  language: 'en' | 'hi';
  notificationsEnabled: boolean;
  smsAlerts: boolean;
  lastSyncTime: string;
}

export interface DemonstrationActivityTemplate {
  id: string;
  category: LessonFocusType;
  title: string;
  focusArea: string;
  targetNeed: string;
  summary: string;
  stepByStepGuide: string[];
  suggestedActionForTeacher: string;
  observableSuccessIndicator: string;
}
