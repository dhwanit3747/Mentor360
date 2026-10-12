import { DemonstrationActivityTemplate, LessonFocusType } from '../types';

export const DEMO_ACTIVITIES: DemonstrationActivityTemplate[] = [
  {
    id: 'act-lit-1',
    category: 'Literacy',
    title: 'Guided Partner Reading (साझा पठन)',
    focusArea: 'Student Participation & Reading Fluency',
    targetNeed: 'Passive student engagement during whole-class textbook reading',
    summary: 'Pairs of students read short grade-appropriate sentences together using "read-then-check" peer support.',
    stepByStepGuide: [
      'Model reading one sentence clearly while pointing with a finger.',
      'Pair learners: one stronger reader with a peer needing practice.',
      'Students read alternating sentences while the partner tracks the words with their finger.',
      'Mentor & teacher circulate to provide gentle prompting rather than direct correction.'
    ],
    suggestedActionForTeacher: 'Organize a 10-minute partner reading slot in the next language class using the textbook story paragraphs.',
    observableSuccessIndicator: 'At least 80% of paired students actively point to words and read aloud together rather than waiting passively.'
  },
  {
    id: 'act-lit-2',
    category: 'Literacy',
    title: 'Akshar-Chitra Wall Chart (वर्ण-चित्र मिलान)',
    focusArea: 'Use of TLM & Phonemic Awareness',
    targetNeed: 'Difficulty associating sounds with letter symbols (varnamala recognition)',
    summary: 'A low-cost wall display where children connect letter flashcards with everyday physical objects and pictures.',
    stepByStepGuide: [
      'Display 4-5 target letter cards (e.g. क, म, ल, र) at child eye level.',
      'Invite 3-4 children to find pictures or classroom items beginning with that sound.',
      'Have students trace the letter shape in the air while repeating the initial sound.',
      'Teacher asks learners to create two-letter blends on the chalk slate.'
    ],
    suggestedActionForTeacher: 'Introduce 2 target letter cards with familiar local object pictures at the start of tomorrow’s phonics lesson.',
    observableSuccessIndicator: 'Students independently identify the target sound in spoken words and point accurately on the wall chart.'
  },
  {
    id: 'act-num-1',
    category: 'Numeracy',
    title: 'Ganit Mala / Beaded Number Line (गिनतारा व संख्या माला)',
    focusArea: 'Foundational Number Sense & Place Value',
    targetNeed: 'Rote counting without conceptual understanding of quantity and place value',
    summary: 'A 100-bead string grouped in alternating tens (white and red beads) for concrete number placement and addition.',
    stepByStepGuide: [
      'Show the Ganit Mala hung across the blackboard at students’ chest level.',
      'Mentor demonstrates finding number 24 by sliding 2 tens (20 beads) and 4 individual beads.',
      'Invite students to attach number clips to designated numbers (e.g. 15, 38).',
      'Encourage children to verbalize: "2 tens and 4 units make 24".'
    ],
    suggestedActionForTeacher: 'Use bead counts or bundle-stick sets during the initial 15 minutes of tomorrow’s two-digit addition lesson.',
    observableSuccessIndicator: 'Students correctly explain two-digit numbers as bundles of tens and loose units using the bead string.'
  },
  {
    id: 'act-num-2',
    category: 'Numeracy',
    title: 'Concrete Stick Bundles & Loose Sticks (तिलियाँ और बंडल)',
    focusArea: 'Teaching Strategies & TLM Utilization',
    targetNeed: 'Difficulty with carry-over and place value in basic operations',
    summary: 'Using broomsticks or straw bundles of 10 bound with rubber bands to concretely show regrouping.',
    stepByStepGuide: [
      'Distribute sets of 10 loose sticks and 3 rubber bands to pairs of students.',
      'Ask students to make bundles of 10 whenever loose sticks reach 10.',
      'Show how 13 loose sticks become 1 bundle of ten and 3 loose sticks.',
      'Connect the concrete bundles to the blackboard place value columns (दहाई / इकाई).'
    ],
    suggestedActionForTeacher: 'Have students use straw bundles on their desks to solve 3 simple addition problems with regrouping.',
    observableSuccessIndicator: 'Learners demonstrate regrouping by physically bundling ten sticks before writing the carry-over digit.'
  },
  {
    id: 'act-gen-1',
    category: 'Literacy',
    title: 'Quick Thumbs Check / Exit Slates (त्वरित समझ जाँच)',
    focusArea: 'Formative Assessment & Real-time Feedback',
    targetNeed: 'Checking understanding only at the end of class through individual call-outs',
    summary: 'A 2-minute non-threatening check where all students respond simultaneously on slates or using hand signals.',
    stepByStepGuide: [
      'Teacher asks one conceptual check question (e.g., "Which word starts with \'स\'?").',
      'All children write their letter or word on mini slates simultaneously.',
      'On count of 3 ("Ready, Show!"), all students hold up their slates.',
      'Teacher scans the room in 10 seconds to assess understanding before advancing.'
    ],
    suggestedActionForTeacher: 'Conduct two mini slate check-ins during the middle and conclusion of the next lesson instead of only asking the front row.',
    observableSuccessIndicator: 'Teacher pauses and adapts instruction based on immediate slate responses from the entire class.'
  },
  {
    id: 'act-gen-2',
    category: 'Numeracy',
    title: 'Think-Pair-Share Math Talk (सोचो-जोड़ी बनाओ-साझा करो)',
    focusArea: 'Inclusive Participation & Mathematical Discourse',
    targetNeed: 'Only high-performing students answering math questions while others remain silent',
    summary: 'Giving 30 seconds of quiet thinking time, followed by 1 minute with a peer, before open classroom discussion.',
    stepByStepGuide: [
      'Pose an open problem: "How many ways can we make the number 12 using two numbers?"',
      'Ask for 30 seconds of silent thinking with fingers on temples.',
      'Say "Turn to your partner and share your number pairs."',
      'Call upon pairs who usually do not volunteer to share their combined ideas.'
    ],
    suggestedActionForTeacher: 'Implement Think-Pair-Share for one word problem in tomorrow’s mathematics class.',
    observableSuccessIndicator: 'Previously hesitant students share solutions with their partner and confidently represent their pair’s answer.'
  }
];

export function getDemoActivitiesByCategory(category: LessonFocusType): DemonstrationActivityTemplate[] {
  return DEMO_ACTIVITIES.filter(act => act.category === category);
}

export function getDemoActivityById(id: string): DemonstrationActivityTemplate | undefined {
  return DEMO_ACTIVITIES.find(act => act.id === id);
}
