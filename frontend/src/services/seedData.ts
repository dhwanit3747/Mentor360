import { School, Visit, Observation, ActionPlan, MentorProfile } from '../types';
import { calculatePriorityScore } from '../utils/priorityScoring';

export const SEED_PROFILE: MentorProfile = {
  id: 'mentor-1',
  name: 'Ananya Sharma',
  designation: 'Cluster Resource Person (CRP / संकुल समन्वयक)',
  cluster: 'Raipur Rural Cluster (संकुल - 04)',
  block: 'Raipur Block',
  district: 'Raipur',
  state: 'Chhattisgarh',
  phone: '+91 94252 87104',
  email: 'ananya.sharma.crp@cg.nic.in',
  assignedSchoolsCount: 6,
  language: 'en',
  notificationsEnabled: true,
  smsAlerts: true,
  lastSyncTime: 'Local Device Storage (Device Only)'
};

export const SEED_SCHOOLS: School[] = [
  {
    id: 'school-1',
    name: 'Saraswati Primary School',
    code: 'UDISE 22100401201',
    location: 'Raipur Rural, Post Mandir Hasaud',
    block: 'Raipur',
    district: 'Raipur',
    grades: 'Grades 1 - 5',
    totalTeachers: 4,
    totalStudents: 118,
    headTeacher: 'Smt. Sunita Devi',
    phone: '+91 98261 12345',
    lastVisitDate: '2026-10-04',
    nextVisitDate: '2026-10-12',
    supportNeeds: [
      'Reading fluency in early grades',
      'Student participation in back rows',
      'Guided partner reading practice'
    ],
    notes: 'Grade 3 teacher Smt. Radhika Verma requested support on engaging hesitant readers during Hindi story sessions.'
  },
  {
    id: 'school-2',
    name: 'Shakti Government Primary School',
    code: 'UDISE 22100401402',
    location: 'Raipur Rural, Dhamangaon Gram',
    block: 'Raipur',
    district: 'Raipur',
    grades: 'Grades 1 - 5',
    totalTeachers: 5,
    totalStudents: 142,
    headTeacher: 'Shri Anand Prakash',
    phone: '+91 97520 56789',
    lastVisitDate: '2026-09-28',
    nextVisitDate: '2026-10-13',
    supportNeeds: [
      'Numeracy TLM usage & Ganit Mala',
      'Place value regrouping in Grade 3',
      'Overdue action plan verification'
    ],
    notes: 'Teacher Smt. Manju Kumari agreed to practice bead-line number bundling. Follow-up visit is due.'
  },
  {
    id: 'school-3',
    name: 'Adarsh Prathmik Shala',
    code: 'UDISE 22100401705',
    location: 'Raipur Rural, Pimpalgaon Majra',
    block: 'Raipur',
    district: 'Raipur',
    grades: 'Grades 1 - 5',
    totalTeachers: 3,
    totalStudents: 86,
    headTeacher: 'Shri Vinod Sharma',
    phone: '+91 94255 98765',
    lastVisitDate: '2026-09-15',
    nextVisitDate: '2026-10-16',
    supportNeeds: [
      'Multigrade seating arrangement',
      'Formative checks using slates',
      'TLM corner accessibility'
    ],
    notes: 'Routine visit to review combined multigrade seating and simultaneous slate response checks.'
  },
  {
    id: 'school-4',
    name: 'Kendriya Prathmik Vidyalaya',
    code: 'UDISE 22100402102',
    location: 'Raipur Rural, Belsar Kasba',
    block: 'Raipur',
    district: 'Raipur',
    grades: 'Grades 1 - 5',
    totalTeachers: 6,
    totalStudents: 185,
    headTeacher: 'Shri Mahesh Chandra',
    phone: '+91 94250 45678',
    lastVisitDate: '2026-10-02',
    nextVisitDate: '2026-10-18',
    supportNeeds: [
      'Math kit utilization in Grade 4',
      'Peer problem solving routines'
    ],
    notes: 'Adequate TLM available; mentoring requested on practical teacher demonstration during math hours.'
  },
  {
    id: 'school-5',
    name: 'Rajkiya Buniyadi Shala',
    code: 'UDISE 22100402503',
    location: 'Raipur Rural, Shirasgaon',
    block: 'Raipur',
    district: 'Raipur',
    grades: 'Grades 1 - 5',
    totalTeachers: 4,
    totalStudents: 104,
    headTeacher: 'Smt. Geeta Mishra',
    phone: '+91 99260 34567',
    lastVisitDate: '2026-09-20',
    nextVisitDate: '2026-10-22',
    supportNeeds: [
      'Foundational phonics & Varnamala songs',
      'Grade 1 student attendance continuity'
    ],
    notes: 'High need for foundational literacy demonstration for multigrade classroom management.'
  },
  {
    id: 'school-6',
    name: 'Zilla Parishad Primary School',
    code: 'UDISE 22100402901',
    location: 'Raipur Rural, Wadgaon Purwa',
    block: 'Raipur',
    district: 'Raipur',
    grades: 'Grades 1 - 5',
    totalTeachers: 3,
    totalStudents: 74,
    headTeacher: 'Smt. Pratibha Yadav',
    phone: '+91 98270 67890',
    lastVisitDate: '2026-09-10',
    nextVisitDate: '2026-10-25',
    supportNeeds: [
      'Foundational word formation',
      'Morning assembly learning activities'
    ],
    notes: 'Small rural primary school with dedicated single-teacher multigrade sessions.'
  }
];

// Helper calculations for realistic priority score
const v1Priority = calculatePriorityScore(2, 2, 2, 2); // 4*2 + 3*2 + 2*2 + 2 = 20
const v2Priority = calculatePriorityScore(2, 1, 1, 0); // 4*2 + 3*1 + 2*1 + 0 = 13
const v3Priority = calculatePriorityScore(1, 1, 1, 0); // 4*1 + 3*1 + 2*1 + 0 = 9
const v4Priority = calculatePriorityScore(0, 1, 0, 0); // 4*0 + 3*1 + 0 + 0 = 3

export const SEED_VISITS: Visit[] = [
  {
    id: 'visit-1',
    schoolId: 'school-1',
    schoolName: 'Saraswati Primary School',
    scheduledDate: '2026-10-12',
    scheduledTime: '10:00 - 11:30 AM',
    purpose: 'Follow-up due: Guided reading pairs trial in Grade 3 Hindi lesson',
    status: 'Scheduled',
    urgency: 2,
    needSeverity: 2,
    followUpImportance: 2,
    overdueLevel: 2,
    priorityScore: v1Priority.score,
    priorityReason: 'Suggested first: an agreed support action plan is overdue by 3 days. Recommend prioritizing this visit.',
    focusArea: 'Literacy & Reading Fluency',
    notes: 'Observe Smt. Radhika Verma conducting 10-minute partner reading; bring graded readers for pair activity.',
    createdAt: '2026-10-09T08:00:00Z',
    updatedAt: '2026-10-09T08:00:00Z'
  },
  {
    id: 'visit-2',
    schoolId: 'school-2',
    schoolName: 'Shakti Government Primary School',
    scheduledDate: '2026-10-13',
    scheduledTime: '10:00 AM',
    purpose: 'First observation of term: Numeracy TLM usage and Ganit Mala place-value',
    status: 'Scheduled',
    urgency: 2,
    needSeverity: 1,
    followUpImportance: 1,
    overdueLevel: 0,
    priorityScore: v2Priority.score,
    priorityReason: 'Upcoming visit within 48h with active teacher support request for math manipulative modeling.',
    focusArea: 'Foundational Numeracy & Place Value',
    notes: 'Demonstrate Ganit Mala bead-bundling for 2-digit addition with Smt. Manju Kumari.',
    createdAt: '2026-10-10T09:30:00Z',
    updatedAt: '2026-10-10T09:30:00Z'
  },
  {
    id: 'visit-3',
    schoolId: 'school-3',
    schoolName: 'Adarsh Prathmik Shala',
    scheduledDate: '2026-10-16',
    scheduledTime: '11:00 AM',
    purpose: 'Routine visit: Review multigrade seating arrangement and slate formative checks',
    status: 'Scheduled',
    urgency: 1,
    needSeverity: 1,
    followUpImportance: 1,
    overdueLevel: 0,
    priorityScore: v3Priority.score,
    priorityReason: 'Scheduled visit within upcoming week for classroom formative assessment routines.',
    focusArea: 'Multigrade Seating & Slates',
    notes: 'Check if Grade 1-2 students are using individual slates simultaneously.',
    createdAt: '2026-10-08T11:00:00Z',
    updatedAt: '2026-10-08T11:00:00Z'
  },
  {
    id: 'visit-4',
    schoolId: 'school-4',
    schoolName: 'Kendriya Prathmik Vidyalaya',
    scheduledDate: '2026-10-18',
    scheduledTime: '10:30 AM',
    purpose: 'Routine classroom observation and monthly teacher reflection meeting',
    status: 'Scheduled',
    urgency: 0,
    needSeverity: 1,
    followUpImportance: 0,
    overdueLevel: 0,
    priorityScore: v4Priority.score,
    priorityReason: 'Routine scheduled visit for monthly cluster support.',
    focusArea: 'Math Kit Utilization',
    notes: 'Observe Grade 4 math hour.',
    createdAt: '2026-10-05T10:00:00Z',
    updatedAt: '2026-10-05T10:00:00Z'
  },
  {
    id: 'visit-5',
    schoolId: 'school-1',
    schoolName: 'Saraswati Primary School',
    scheduledDate: '2026-10-04',
    scheduledTime: '10:00 AM',
    purpose: 'Classroom observation of Grade 3 Hindi Language & Reading Fluency',
    status: 'Completed',
    urgency: 1,
    needSeverity: 1,
    followUpImportance: 1,
    overdueLevel: 0,
    priorityScore: 8,
    priorityReason: 'Completed baseline observation visit.',
    focusArea: 'Foundational Literacy',
    notes: 'Observed expressive storytelling; teacher read aloud clearly. Agreed on partner reading trial.',
    completedDate: '2026-10-04',
    createdAt: '2026-10-01T10:00:00Z',
    updatedAt: '2026-10-04T12:30:00Z'
  }
];

export const SEED_OBSERVATIONS: Observation[] = [
  {
    id: 'obs-1',
    schoolId: 'school-1',
    visitId: 'visit-5',
    teacherName: 'Smt. Radhika Verma',
    grade: 'Grade 3',
    subject: 'Foundational Literacy (भाषा - कलरव)',
    topic: 'Lesson 4: चिड़िया और बंदर (Story Reading & Comprehension)',
    lessonFocus: 'Literacy',
    indicators: {
      lessonObjective: 'Observed',
      teachingStrategy: 'Partly Observed',
      studentParticipation: 'Needs Support',
      useOfTLM: 'Partly Observed',
      formativeAssessment: 'Needs Support',
      inclusiveParticipation: 'Partly Observed'
    },
    evidenceNotes: 'Teacher read the story aloud clearly and drew animals on blackboard. Students repeated chorally. When asked individual questions, only 3 front-row students raised hands; 12 students in rows 3-4 remained silent and did not point to words in the textbook.',
    strengths: 'Clear, expressive read-aloud; warm classroom rapport; children were attentive during storytelling.',
    supportAreas: 'Shift from purely whole-class choral repetition to active peer pair-reading so back-row learners practice.',
    status: 'Completed',
    createdAt: '2026-10-04T11:45:00Z',
    updatedAt: '2026-10-04T12:00:00Z'
  }
];

export const SEED_ACTION_PLANS: ActionPlan[] = [
  {
    id: 'plan-1',
    schoolId: 'school-1',
    visitId: 'visit-5',
    observationId: 'obs-1',
    teacherName: 'Smt. Radhika Verma',
    grade: 'Grade 3',
    improvementArea: 'Reading participation in Grade 3: shift from whole-class choral recital to peer pair-reading',
    demonstrationActivity: 'Guided Partner Reading (साझा पठन): Pairs of students read alternating sentences while the partner tracks words with their finger.',
    agreedAction: 'Try 10 minutes of partner reading using textbook story paragraphs in tomorrow\'s class.',
    followUpDate: '2026-10-12',
    successIndicator: 'At least 80% (22+ of 28) paired students actively point to words and read aloud together rather than waiting passively.',
    status: 'In Progress',
    followUpNotes: 'Teacher arranged benches into pairs. Waiting for mentor co-teaching demonstration during today\'s visit.',
    triedActivity: true,
    activityReflection: 'Students were enthusiastic about sitting in pairs, but some needed help knowing whose turn it was to read.',
    createdAt: '2026-10-04T12:15:00Z',
    updatedAt: '2026-10-07T14:00:00Z'
  },
  {
    id: 'plan-2',
    schoolId: 'school-2',
    visitId: 'visit-2',
    observationId: 'obs-prior-2',
    teacherName: 'Smt. Manju Kumari',
    grade: 'Grade 3',
    improvementArea: 'Ganit Mala 2-digit addition: concrete place-value understanding before vertical sums',
    demonstrationActivity: 'Ganit Mala / Beaded Number Line (गिनतारा व संख्या माला): Concrete grouping into tens and units with color-coded beads.',
    agreedAction: 'Use the Ganit Mala bead string for 15 minutes before writing numbers on blackboard.',
    followUpDate: '2026-10-08',
    successIndicator: 'Students correctly explain numbers as bundles of tens and loose units before writing addition problems.',
    status: 'Needs Further Support',
    followUpNotes: 'Follow-up was delayed due to school sports day. Teacher needs mentor to co-teach a bead session.',
    triedActivity: false,
    activityReflection: 'Teacher felt unsure how to manage 25 children with one bead string without losing classroom discipline.',
    createdAt: '2026-09-28T12:00:00Z',
    updatedAt: '2026-10-08T10:00:00Z'
  },
  {
    id: 'plan-3',
    schoolId: 'school-3',
    visitId: 'visit-3',
    observationId: 'obs-prior-3',
    teacherName: 'Smt. Anita Sharma',
    grade: 'Grade 1',
    improvementArea: 'Exit ticket formative checks: simultaneous slate display without singling out struggling students',
    demonstrationActivity: 'Quick Thumbs Check / Exit Slates (त्वरित समझ जाँच): Simultaneous slate display on "Ready, Show!" command.',
    agreedAction: 'Use mini chalk slates for simultaneous letter writing checks twice per lesson.',
    followUpDate: '2026-10-06',
    successIndicator: 'All children show slates simultaneously; teacher scans room in 10 seconds without punitive callouts.',
    status: 'Completed',
    followUpNotes: 'Successfully adopted! Observed Grade 1 children enthusiastically showing slates. Struggling students received non-judgmental partner support.',
    triedActivity: true,
    activityReflection: 'Teacher remarked that slate checks reduced lesson anxiety and revealed 4 students who needed extra phonics games.',
    createdAt: '2026-09-22T11:00:00Z',
    updatedAt: '2026-10-06T15:00:00Z'
  }
];
