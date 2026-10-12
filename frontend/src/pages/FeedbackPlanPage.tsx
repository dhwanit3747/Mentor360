import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  Observation,
  ActionPlan,
  School,
  DemonstrationActivityTemplate
} from '../types';
import {
  getAllObservations,
  getObservationById,
  getAllSchools,
  saveActionPlan
} from '../services/database';
import {
  generateFeedbackDraftFromObservation,
  GeneratedFeedbackDraft
} from '../utils/feedbackGenerator';
import { DEMO_ACTIVITIES } from '../services/demoActivityLibrary';
import {
  Sparkles,
  CheckCircle2,
  BookOpen,
  Calendar,
  AlertCircle,
  ArrowRight,
  HelpCircle,
  ThumbsUp,
  RefreshCw,
  Check
} from 'lucide-react';
import { IndicatorBadge } from '../components/common/Badge';

export const FeedbackPlanPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const state = location.state as {
    preloadedObservationId?: string;
    isNewObservation?: boolean;
  } | undefined;

  const [observations, setObservations] = useState<Observation[]>([]);
  const [schools, setSchools] = useState<School[]>([]);
  const [selectedObsId, setSelectedObsId] = useState<string>(state?.preloadedObservationId || '');
  const [currentObservation, setCurrentObservation] = useState<Observation | null>(null);
  const [loading, setLoading] = useState(true);

  // 6 Mentoring Plan Components matching Figma Screen 6
  const [strengths, setStrengths] = useState('');
  const [improvementArea, setImprovementArea] = useState('');
  const [selectedActivityId, setSelectedActivityId] = useState('act-lit-1');
  const [demonstrationActivity, setDemonstrationActivity] = useState('');
  const [agreedAction, setAgreedAction] = useState('');
  const [followUpDate, setFollowUpDate] = useState('2026-10-14');
  const [successIndicator, setSuccessIndicator] = useState('');

  const [savedSuccess, setSavedSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [obsList, schoolList] = await Promise.all([
        getAllObservations(),
        getAllSchools()
      ]);
      setObservations(obsList);
      setSchools(schoolList);

      const targetId = state?.preloadedObservationId || (obsList.length > 0 ? obsList[0].id : '');
      if (targetId) {
        setSelectedObsId(targetId);
        const obs = obsList.find(o => o.id === targetId);
        if (obs) applyObservationToPlan(obs);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const applyObservationToPlan = (obs: Observation) => {
    setCurrentObservation(obs);
    const draft = generateFeedbackDraftFromObservation(obs);
    setStrengths(draft.strengths);
    setImprovementArea(draft.improvementArea);
    setSelectedActivityId(draft.recommendedActivityId);
    setDemonstrationActivity(draft.demonstrationActivity);
    setAgreedAction(draft.agreedAction);
    setFollowUpDate(draft.followUpDate);
    setSuccessIndicator(draft.successIndicator);
  };

  const handleSelectObservation = (obsId: string) => {
    setSelectedObsId(obsId);
    const obs = observations.find(o => o.id === obsId);
    if (obs) applyObservationToPlan(obs);
  };

  const handleSelectActivity = (activity: DemonstrationActivityTemplate) => {
    setSelectedActivityId(activity.id);
    setDemonstrationActivity(`${activity.title}: ${activity.summary}`);
    setAgreedAction(activity.suggestedActionForTeacher);
    setSuccessIndicator(activity.observableSuccessIndicator);
  };

  const handleApprovePlan = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentObservation) {
      setErrorMsg('Please select a valid observation first.');
      return;
    }
    if (!strengths.trim() || !improvementArea.trim() || !agreedAction.trim() || !followUpDate || !successIndicator.trim()) {
      setErrorMsg('Please fill in all required fields before approving the plan.');
      return;
    }
    setErrorMsg('');

    const newPlan: ActionPlan = {
      id: `plan-${Date.now()}`,
      schoolId: currentObservation.schoolId,
      visitId: currentObservation.visitId,
      observationId: currentObservation.id,
      teacherName: currentObservation.teacherName,
      grade: currentObservation.grade,
      improvementArea,
      demonstrationActivity,
      agreedAction,
      followUpDate,
      successIndicator,
      status: 'In Progress',
      followUpNotes: 'Action plan approved during mentoring debrief. Teacher agreed to try during next classes.',
      triedActivity: null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    try {
      await saveActionPlan(newPlan);
      setSavedSuccess(true);
      setTimeout(() => {
        navigate('/app/follow-ups', {
          state: { newlyCreatedPlanId: newPlan.id }
        });
      }, 1200);
    } catch (err) {
      console.error(err);
      setErrorMsg('Failed to save action plan.');
    }
  };

  const targetSchool = schools.find(s => s.id === currentObservation?.schoolId);
  const activeActivity = DEMO_ACTIVITIES.find(a => a.id === selectedActivityId) || DEMO_ACTIVITIES[0];

  return (
    <div className="space-y-6">
      {/* Top Header matching Figma Screen 6 */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-[#25332F] tracking-tight">
            Feedback & Demonstration Plan
          </h1>
          <p className="text-xs text-[#5A6F68] mt-0.5">
            Teacher debriefing: <strong className="text-[#25332F]">{currentObservation?.teacherName || 'Smt. Radhika Verma'}</strong> • {targetSchool?.name} ({currentObservation?.grade})
          </p>
        </div>

        <button
          onClick={handleApprovePlan}
          className="bg-[#176B5B] hover:bg-[#125447] text-white font-bold py-2.5 px-4 rounded-xl text-xs flex items-center gap-1.5 self-start sm:self-auto shadow-xs transition-colors"
        >
          <CheckCircle2 className="w-4 h-4 text-[#F4B942]" />
          <span>Approve & Save Action Plan</span>
        </button>
      </div>

      {savedSuccess && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold rounded-xl flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>Action Plan Approved & Saved! Redirecting to Follow-up Tracker...</span>
        </div>
      )}

      {/* Stepper matching Figma Screen 6 */}
      <div className="card-base p-3 bg-white">
        <div className="flex items-center justify-between max-w-2xl mx-auto text-xs font-bold">
          <span className="flex items-center gap-1.5 text-gray-400">
            <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center text-[10px]">✓</span>
            <span>1. Observation</span>
          </span>
          <span className="text-gray-300">───</span>
          <span className="flex items-center gap-1.5 text-gray-400">
            <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center text-[10px]">✓</span>
            <span>2. Strengths</span>
          </span>
          <span className="text-gray-300">───</span>
          <span className="flex items-center gap-1.5 text-[#176B5B]">
            <span className="w-5 h-5 rounded-full bg-[#176B5B] text-white flex items-center justify-center text-[10px]">3</span>
            <span>3. Demonstration</span>
          </span>
          <span className="text-gray-300">───</span>
          <span className="flex items-center gap-1.5 text-gray-400">
            <span className="w-5 h-5 rounded-full bg-[#E6F2EF] text-[#176B5B] flex items-center justify-center text-[10px]">4</span>
            <span>4. Action Plan</span>
          </span>
        </div>
      </div>

      {/* Main 2-column Grid matching Screen 6 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 1 Col: Observation Evidence & Demonstration Preview */}
        <div className="space-y-5">
          {/* Observation Evidence Summary */}
          <div className="card-base p-5 bg-white space-y-3">
            <h3 className="font-bold text-sm text-[#25332F] pb-2 border-b border-[#E2ECE8]">
              Observation evidence summary
            </h3>

            <div className="space-y-3 text-xs">
              <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 space-y-1">
                <span className="font-bold text-emerald-900 block text-[11px]">
                  Observed strengths
                </span>
                <p className="text-emerald-800 leading-relaxed text-[11px]">
                  {strengths || 'Clear, expressive read-aloud; warm classroom rapport; children were attentive during storytelling.'}
                </p>
              </div>

              <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 space-y-1">
                <span className="font-bold text-amber-900 block text-[11px]">
                  Identified developmental need
                </span>
                <p className="text-amber-800 leading-relaxed text-[11px]">
                  {improvementArea || 'When asked to read individually, only 3 front-row students participated; back rows were disengaged.'}
                </p>
              </div>
            </div>
          </div>

          {/* Selected Demonstration Technique Guide */}
          <div className="card-base p-5 bg-[#F0F8F6] border-[#AFDCD1] space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-[#AFDCD1]">
              <h3 className="font-bold text-sm text-[#176B5B]">
                Demonstration technique
              </h3>
              <span className="text-[10px] font-bold bg-[#176B5B] text-white px-2 py-0.5 rounded">
                FLN Library
              </span>
            </div>

            <div>
              <h4 className="font-bold text-xs text-[#25332F]">
                {activeActivity.title}
              </h4>
              <p className="text-[11px] text-[#5A6F68] mt-0.5">
                {activeActivity.summary}
              </p>
            </div>

            <div className="space-y-1.5 pt-1">
              <span className="text-[10px] font-bold uppercase text-[#7B928A]">Demonstration Steps:</span>
              <ul className="space-y-1 text-[11px] text-[#25332F]">
                {activeActivity.stepByStepGuide.map((step, idx) => (
                  <li key={idx} className="flex items-start gap-1.5">
                    <span className="text-[#176B5B] font-bold">{idx + 1}.</span>
                    <span>{step}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Right 2 Cols: Mentoring & Demonstration Plan Form */}
        <div className="lg:col-span-2 card-base p-6 bg-white space-y-5">
          <h2 className="text-base font-bold text-[#25332F] pb-3 border-b border-[#E2ECE8]">
            Mentoring & Demonstration Plan (Agreed with Teacher)
          </h2>

          <form onSubmit={handleApprovePlan} className="space-y-4">
            {/* 1. What teacher did well */}
            <div>
              <label className="block text-xs font-bold text-[#25332F] uppercase mb-1">
                1. What the teacher did well (Strengths) <span className="text-red-500">*</span>
              </label>
              <textarea
                rows={2}
                value={strengths}
                onChange={(e) => setStrengths(e.target.value)}
                className="w-full p-2.5 bg-[#F7F9F8] border border-[#E2ECE8] rounded-xl text-xs focus:bg-white focus:border-[#176B5B]"
              />
            </div>

            {/* 2. One specific growth opportunity */}
            <div>
              <label className="block text-xs font-bold text-[#25332F] uppercase mb-1">
                2. One specific growth opportunity <span className="text-red-500">*</span>
              </label>
              <textarea
                rows={2}
                value={improvementArea}
                onChange={(e) => setImprovementArea(e.target.value)}
                className="w-full p-2.5 bg-[#F7F9F8] border border-[#E2ECE8] rounded-xl text-xs focus:bg-white focus:border-[#176B5B]"
              />
            </div>

            {/* 3. Demonstration teaching technique */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-bold text-[#25332F] uppercase">
                  3. Demonstration teaching technique <span className="text-red-500">*</span>
                </label>
                <span className="text-[11px] text-[#176B5B] font-semibold">Choose from library:</span>
              </div>

              {/* Selector pills */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mb-2">
                {DEMO_ACTIVITIES.slice(0, 3).map((act) => (
                  <button
                    key={act.id}
                    type="button"
                    onClick={() => handleSelectActivity(act)}
                    className={`p-2 rounded-lg border text-left text-xs transition-colors ${
                      act.id === selectedActivityId
                        ? 'bg-[#E6F2EF] border-[#176B5B] text-[#176B5B] font-bold'
                        : 'bg-white border-[#E2ECE8] text-[#5A6F68] hover:bg-[#F7F9F8]'
                    }`}
                  >
                    <span className="block truncate">{act.title.split('(')[0]}</span>
                  </button>
                ))}
              </div>

              <textarea
                rows={2}
                value={demonstrationActivity}
                onChange={(e) => setDemonstrationActivity(e.target.value)}
                className="w-full p-2.5 bg-[#F7F9F8] border border-[#E2ECE8] rounded-xl text-xs focus:bg-white focus:border-[#176B5B]"
              />
            </div>

            {/* 4. Small action for teacher's next lesson */}
            <div>
              <label className="block text-xs font-bold text-[#25332F] uppercase mb-1">
                4. Small action for teacher's next lesson <span className="text-red-500">*</span>
              </label>
              <textarea
                rows={2}
                value={agreedAction}
                onChange={(e) => setAgreedAction(e.target.value)}
                className="w-full p-2.5 bg-[#F7F9F8] border border-[#E2ECE8] rounded-xl text-xs focus:bg-white focus:border-[#176B5B]"
              />
            </div>

            {/* 5. Agreed follow-up date & 6. Observable success indicator */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-[#25332F] uppercase mb-1">
                  5. Agreed follow-up date <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  value={followUpDate}
                  onChange={(e) => setFollowUpDate(e.target.value)}
                  className="w-full p-2.5 bg-[#F7F9F8] border border-[#E2ECE8] rounded-xl text-xs focus:bg-white focus:border-[#176B5B]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#25332F] uppercase mb-1">
                  6. Observable success indicator <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={successIndicator}
                  onChange={(e) => setSuccessIndicator(e.target.value)}
                  className="w-full p-2.5 bg-[#F7F9F8] border border-[#E2ECE8] rounded-xl text-xs focus:bg-white focus:border-[#176B5B]"
                />
              </div>
            </div>

            {/* Submit Bar */}
            <div className="pt-4 border-t border-[#E2ECE8] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <p className="text-[11px] text-[#5A6F68]">
                Grounds all feedback in recorded evidence without automated ranking.
              </p>

              <button
                type="submit"
                className="px-6 py-2.5 bg-[#176B5B] hover:bg-[#125447] text-white text-xs font-bold rounded-xl shadow-xs flex items-center justify-center gap-1.5 transition-colors"
              >
                <CheckCircle2 className="w-4 h-4 text-[#F4B942]" />
                <span>Approve & Save Action Plan</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
