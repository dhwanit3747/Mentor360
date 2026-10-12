import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  School,
  Visit,
  Observation,
  IndicatorStatus,
  LessonFocusType,
  ObservationIndicators
} from '../types';
import {
  getAllSchools,
  getAllVisits,
  saveObservation,
  getObservationById
} from '../services/database';
import {
  ClipboardCheck,
  CheckCircle2,
  Save,
  BookOpen,
  Calculator,
  Info,
  Clock,
  MapPin,
  Sparkles,
  ChevronRight
} from 'lucide-react';

export const ClassroomObservationPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const state = location.state as {
    selectedSchoolId?: string;
    selectedVisitId?: string;
    editObservationId?: string;
  } | undefined;

  const [schools, setSchools] = useState<School[]>([]);
  const [visits, setVisits] = useState<Visit[]>([]);
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3 | 4>(2);
  const [loading, setLoading] = useState(true);
  const [successDraft, setSuccessDraft] = useState(false);

  // Form Fields matching Screen 5
  const [schoolId, setSchoolId] = useState(state?.selectedSchoolId || 'school-1');
  const [visitId, setVisitId] = useState(state?.selectedVisitId || 'visit-1');
  const [teacherName, setTeacherName] = useState('Smt. Radhika Verma');
  const [grade, setGrade] = useState('Grade 3');
  const [subject, setSubject] = useState('Foundational Literacy (भाषा - कलरव)');
  const [topic, setTopic] = useState('चिड़िया और बंदर (Story reading and comprehension)');
  const [lessonFocus, setLessonFocus] = useState<LessonFocusType>('Literacy');

  // 6 Indicators
  const [indicators, setIndicators] = useState<ObservationIndicators>({
    lessonObjective: 'Observed',
    teachingStrategy: 'Partly Observed',
    studentParticipation: 'Needs Support',
    useOfTLM: 'Partly Observed',
    formativeAssessment: 'Needs Support',
    inclusiveParticipation: 'Partly Observed'
  });

  // Evidence & Notes
  const [evidenceNotes, setEvidenceNotes] = useState(
    'Teacher read aloud clearly and drew animals on the blackboard. Students repeated chorally. When asked individual questions, only 3 front-row students raised hands; 12 students in rows 3-4 remained silent and did not point to words in the textbook.'
  );
  const [strengths, setStrengths] = useState(
    'Clear, expressive read-aloud; warm classroom rapport; children were attentive during storytelling.'
  );
  const [supportAreas, setSupportAreas] = useState(
    'Shift from purely whole-class choral repetition to active peer pair-reading so back-row learners practice.'
  );

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [sData, vData] = await Promise.all([
        getAllSchools(),
        getAllVisits()
      ]);
      setSchools(sData);
      setVisits(vData);

      if (state?.editObservationId) {
        const existing = await getObservationById(state.editObservationId);
        if (existing) {
          setSchoolId(existing.schoolId);
          setVisitId(existing.visitId);
          setTeacherName(existing.teacherName);
          setGrade(existing.grade);
          setSubject(existing.subject);
          setTopic(existing.topic);
          setLessonFocus(existing.lessonFocus);
          setIndicators(existing.indicators);
          setEvidenceNotes(existing.evidenceNotes);
          setStrengths(existing.strengths);
          setSupportAreas(existing.supportAreas);
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const setIndicatorValue = (key: keyof ObservationIndicators, value: IndicatorStatus) => {
    setIndicators(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleSaveObservation = async (status: 'Draft' | 'Completed') => {
    const obsId = state?.editObservationId || `obs-${Date.now()}`;
    const newObservation: Observation = {
      id: obsId,
      schoolId,
      visitId: visitId || `visit-${Date.now()}`,
      teacherName,
      grade,
      subject,
      topic,
      lessonFocus,
      indicators,
      evidenceNotes,
      strengths,
      supportAreas,
      status,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    await saveObservation(newObservation);

    if (status === 'Draft') {
      setSuccessDraft(true);
      setTimeout(() => setSuccessDraft(false), 3000);
    } else {
      navigate('/app/feedback-plan', {
        state: {
          preloadedObservationId: obsId,
          isNewObservation: true
        }
      });
    }
  };

  const targetSchool = schools.find(s => s.id === schoolId) || schools[0];

  const dimensions = [
    {
      key: 'lessonObjective' as const,
      num: '1',
      title: 'Lesson objective communicated',
      desc: 'Teacher clearly communicates lesson target and students understand what they will practice.'
    },
    {
      key: 'teachingStrategy' as const,
      num: '2',
      title: 'Teaching strategy & modeling',
      desc: 'Progressive modeling ("I Do, We Do, You Do") before independent or paired student practice.'
    },
    {
      key: 'studentParticipation' as const,
      num: '3',
      title: 'Active student participation',
      desc: 'All children actively read, manipulate objects, or write rather than only whole-class passive listening.'
    },
    {
      key: 'useOfTLM' as const,
      num: '4',
      title: 'Use of TLM / reading materials',
      desc: 'Effective hands-on use of Ganit Mala, graded story cards, alphabet charts, or slates.'
    },
    {
      key: 'formativeAssessment' as const,
      num: '5',
      title: 'Formative assessment & checks',
      desc: 'Teacher checks room-wide comprehension (e.g. slates, thumbs) during the lesson.'
    },
    {
      key: 'inclusiveParticipation' as const,
      num: '6',
      title: 'Inclusive participation (back rows & girls)',
      desc: 'Hesitant learners, back rows, and all children receive non-punitive speaking/reading turns.'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Top Header matching Figma Screen 5 */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-[#25332F] tracking-tight">
            Classroom Observation
          </h1>
          <p className="text-xs text-[#5A6F68] mt-0.5">
            Structured, developmental observation to guide supportive teacher mentoring.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            onClick={() => handleSaveObservation('Draft')}
            className="px-3.5 py-2 bg-white border border-[#AFDCD1] text-[#176B5B] text-xs font-bold rounded-xl hover:bg-[#F0F8F6] flex items-center gap-1.5 transition-colors"
          >
            <Save className="w-3.5 h-3.5" />
            <span>Save Draft</span>
          </button>
          <button
            onClick={() => handleSaveObservation('Completed')}
            className="px-4 py-2 bg-[#176B5B] hover:bg-[#125447] text-white text-xs font-bold rounded-xl shadow-xs flex items-center gap-1.5 transition-colors"
          >
            <CheckCircle2 className="w-3.5 h-3.5 text-[#F4B942]" />
            <span>Save Observation</span>
          </button>
        </div>
      </div>

      {successDraft && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold rounded-xl flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>Observation draft saved locally on this device!</span>
        </div>
      )}

      {/* Stepper matching Figma Screen 5 */}
      <div className="card-base p-3 bg-white">
        <div className="flex items-center justify-between max-w-2xl mx-auto text-xs font-bold">
          <button
            onClick={() => setCurrentStep(1)}
            className={`flex items-center gap-1.5 ${currentStep === 1 ? 'text-[#176B5B]' : 'text-gray-400'}`}
          >
            <span className="w-5 h-5 rounded-full bg-[#E6F2EF] text-[#176B5B] flex items-center justify-center text-[10px]">1</span>
            <span>Details</span>
          </button>
          <span className="text-gray-300">───</span>
          <button
            onClick={() => setCurrentStep(2)}
            className={`flex items-center gap-1.5 ${currentStep === 2 ? 'text-[#176B5B]' : 'text-gray-400'}`}
          >
            <span className="w-5 h-5 rounded-full bg-[#176B5B] text-white flex items-center justify-center text-[10px]">2</span>
            <span>Pedagogy Checklist</span>
          </button>
          <span className="text-gray-300">───</span>
          <button
            onClick={() => setCurrentStep(3)}
            className={`flex items-center gap-1.5 ${currentStep === 3 ? 'text-[#176B5B]' : 'text-gray-400'}`}
          >
            <span className="w-5 h-5 rounded-full bg-[#E6F2EF] text-[#176B5B] flex items-center justify-center text-[10px]">3</span>
            <span>Evidence & Notes</span>
          </button>
        </div>
      </div>

      {/* Main 2-column Grid matching Screen 5 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Form */}
        <div className="lg:col-span-2 space-y-5">
          {/* Section: Lesson and classroom context */}
          <div className="card-base p-5 bg-white space-y-4">
            <h2 className="text-base font-bold text-[#25332F] pb-2 border-b border-[#E2ECE8]">
              Lesson and classroom context
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div>
                <label className="block text-[#7B928A] uppercase font-bold text-[10px] mb-1">School</label>
                <select
                  value={schoolId}
                  onChange={(e) => setSchoolId(e.target.value)}
                  className="w-full p-2 bg-[#F7F9F8] border border-[#E2ECE8] rounded-lg font-medium"
                >
                  {schools.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                </select>
              </div>

              <div>
                <label className="block text-[#7B928A] uppercase font-bold text-[10px] mb-1">Teacher</label>
                <input
                  type="text"
                  value={teacherName}
                  onChange={(e) => setTeacherName(e.target.value)}
                  className="w-full p-2 bg-[#F7F9F8] border border-[#E2ECE8] rounded-lg font-medium"
                />
              </div>

              <div>
                <label className="block text-[#7B928A] uppercase font-bold text-[10px] mb-1">Grade</label>
                <select value={grade} onChange={(e) => setGrade(e.target.value)} className="w-full p-2 bg-[#F7F9F8] border border-[#E2ECE8] rounded-lg font-medium">
                  <option>Grade 1</option><option>Grade 2</option><option>Grade 3</option><option>Grade 4</option><option>Grade 5</option>
                </select>
              </div>
              <div>
                <label className="block text-[#7B928A] uppercase font-bold text-[10px] mb-1">Subject</label>
                <select value={subject} onChange={(e) => setSubject(e.target.value)} className="w-full p-2 bg-[#F7F9F8] border border-[#E2ECE8] rounded-lg font-medium">
                  <option>Foundational Literacy (Hindi)</option><option>Foundational Numeracy (Math)</option><option>Hindi</option><option>Mathematics</option>
                </select>
              </div>
              <div>
                <label className="block text-[#7B928A] uppercase font-bold text-[10px] mb-1">Topic</label>
                <input
                  type="text"
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  className="w-full p-2 bg-[#F7F9F8] border border-[#E2ECE8] rounded-lg font-medium"
                />
              </div>
            </div>
          </div>

          {/* Section: 6 Pedagogical Dimensions matching Figma */}
          <div className="card-base p-5 bg-white space-y-4">
            <h2 className="text-base font-bold text-[#25332F] pb-2 border-b border-[#E2ECE8]">
              Teaching Practice Checklist (6 Dimensions)
            </h2>

            <div className="space-y-4">
              {dimensions.map((dim) => {
                const current = indicators[dim.key];
                return (
                  <div
                    key={dim.key}
                    className="p-3.5 rounded-xl border border-[#E2ECE8] bg-white space-y-2 hover:border-[#AFDCD1] transition-all"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                      <span className="font-bold text-xs text-[#25332F]">
                        {dim.num}. {dim.title}
                      </span>
                    </div>
                    <p className="text-[11px] text-[#5A6F68] leading-tight">
                      {dim.desc}
                    </p>

                    {/* 3 Choice Buttons */}
                    <div className="grid grid-cols-3 gap-2 pt-1">
                      <button
                        type="button"
                        onClick={() => setIndicatorValue(dim.key, 'Observed')}
                        className={`py-1.5 px-2 rounded-lg text-xs font-bold border transition-all text-center ${
                          current === 'Observed'
                            ? 'bg-emerald-600 border-emerald-600 text-white shadow-xs'
                            : 'bg-emerald-50/60 border-emerald-200 text-emerald-800 hover:bg-emerald-100'
                        }`}
                      >
                        ✓ Observed
                      </button>

                      <button
                        type="button"
                        onClick={() => setIndicatorValue(dim.key, 'Partly Observed')}
                        className={`py-1.5 px-2 rounded-lg text-xs font-bold border transition-all text-center ${
                          current === 'Partly Observed'
                            ? 'bg-amber-500 border-amber-500 text-white shadow-xs'
                            : 'bg-amber-50/60 border-amber-200 text-amber-800 hover:bg-amber-100'
                        }`}
                      >
                        ◐ Partly Observed
                      </button>

                      <button
                        type="button"
                        onClick={() => setIndicatorValue(dim.key, 'Needs Support')}
                        className={`py-1.5 px-2 rounded-lg text-xs font-bold border transition-all text-center ${
                          current === 'Needs Support'
                            ? 'bg-red-600 border-red-600 text-white shadow-xs'
                            : 'bg-red-50/60 border-red-200 text-red-800 hover:bg-red-100'
                        }`}
                      >
                        ! Needs Support
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Section: Qualitative Notes & Classroom Evidence matching Figma */}
          <div className="card-base p-5 bg-white space-y-4">
            <h2 className="text-base font-bold text-[#25332F] pb-2 border-b border-[#E2ECE8]">
              Qualitative notes & classroom evidence
            </h2>

            <div>
              <label className="block text-xs font-bold text-[#25332F] uppercase mb-1">
                Factual evidence observed
              </label>
              <textarea
                rows={3}
                value={evidenceNotes}
                onChange={(e) => setEvidenceNotes(e.target.value)}
                className="w-full p-2.5 bg-[#F7F9F8] border border-[#E2ECE8] rounded-xl text-xs focus:bg-white focus:border-[#176B5B]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#25332F] uppercase mb-1">
                Teacher strengths observed
              </label>
              <textarea
                rows={2}
                value={strengths}
                onChange={(e) => setStrengths(e.target.value)}
                className="w-full p-2.5 bg-[#F7F9F8] border border-[#E2ECE8] rounded-xl text-xs focus:bg-white focus:border-[#176B5B]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#25332F] uppercase mb-1">
                One priority area where support will help
              </label>
              <textarea
                rows={2}
                value={supportAreas}
                onChange={(e) => setSupportAreas(e.target.value)}
                className="w-full p-2.5 bg-[#F7F9F8] border border-[#E2ECE8] rounded-xl text-xs focus:bg-white focus:border-[#176B5B]"
              />
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="button"
                onClick={() => handleSaveObservation('Completed')}
                className="px-5 py-2.5 bg-[#176B5B] hover:bg-[#125447] text-white text-xs font-bold rounded-xl shadow-xs flex items-center gap-1.5 transition-colors"
              >
                <span>Save Observation & Generate Action Plan</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Right 1 Col: Visit Info, Observation Guide, Language Reminder */}
        <div className="space-y-5">
          {/* Visit info card matching Figma */}
          <div className="card-base p-5 bg-white space-y-3">
            <h3 className="font-bold text-sm text-[#25332F] pb-2 border-b border-[#E2ECE8]">
              Visit info
            </h3>
            <div className="space-y-2 text-xs">
              <div>
                <span className="text-[#7B928A] block text-[10px] uppercase font-bold">School</span>
                <span className="font-bold text-[#25332F]">{targetSchool?.name}</span>
              </div>
              <div>
                <span className="text-[#7B928A] block text-[10px] uppercase font-bold">Teacher</span>
                <span className="text-[#25332F]">{teacherName}</span>
              </div>
              <div>
                <span className="text-[#7B928A] block text-[10px] uppercase font-bold">Date & Time</span>
                <span className="text-[#25332F]">12 Oct 2026 • 10:00 AM</span>
              </div>
            </div>
          </div>

          {/* Observation guide card matching Figma */}
          <div className="card-base p-5 bg-white space-y-3">
            <h3 className="font-bold text-sm text-[#25332F] pb-2 border-b border-[#E2ECE8]">
              Observation guide
            </h3>
            <ul className="space-y-2 text-xs text-[#43544E]">
              <li className="flex items-start gap-2">
                <span className="text-[#176B5B] font-bold">•</span>
                <span>Observe for at least 30 minutes before recording structured ratings.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#176B5B] font-bold">•</span>
                <span>Focus on student engagement and participation, not teacher compliance.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#176B5B] font-bold">•</span>
                <span>Count participating students; note concrete examples of answers.</span>
              </li>
            </ul>
          </div>

          {/* Non-judgmental reminder matching Figma */}
          <div className="p-4 bg-[#F0F8F6] border border-[#AFDCD1] rounded-xl text-xs space-y-1">
            <span className="font-bold text-[#176B5B] block text-[11px]">
              Non-judgmental language reminder
            </span>
            <p className="text-[11px] text-[#25332F] leading-relaxed">
              Use neutral, observable facts: <em>"4 of 28 students responded"</em> rather than <em>"students were inattentive"</em>. Focus on support over inspection.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
