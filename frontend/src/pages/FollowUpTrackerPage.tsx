import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ActionPlan, School, Observation, ActionPlanStatus } from '../types';
import {
  getAllActionPlans,
  getAllSchools,
  getAllObservations,
  saveActionPlan
} from '../services/database';
import { ActionStatusBadge, IndicatorBadge } from '../components/common/Badge';
import {
  ListChecks,
  Search,
  Calendar,
  CheckCircle2,
  AlertCircle,
  Clock,
  ChevronRight,
  RotateCcw,
  Check,
  X,
  TrendingUp,
  FileText
} from 'lucide-react';

export const FollowUpTrackerPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const state = location.state as { newlyCreatedPlanId?: string } | undefined;

  const [actionPlans, setActionPlans] = useState<ActionPlan[]>([]);
  const [schools, setSchools] = useState<School[]>([]);
  const [observations, setObservations] = useState<Observation[]>([]);
  const [loading, setLoading] = useState(true);

  // Selected plan in right panel
  const [selectedPlanId, setSelectedPlanId] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<'All' | 'Due Soon' | 'Overdue' | 'Completed'>('All');
  const [searchTerm, setSearchTerm] = useState('');

  // Right column verification fields
  const [triedActivity, setTriedActivity] = useState<boolean>(true);
  const [followUpNotes, setFollowUpNotes] = useState(
    'Conducted co-teaching partner reading trial. Paired hesitant learners with confident peers. Observed 22 of 28 students actively tracking words.'
  );
  const [activityReflection, setActivityReflection] = useState(
    'Teacher noted that hesitant learners enjoyed having a peer help them with unfamiliar syllables rather than feeling singled out.'
  );
  const [selectedStatus, setSelectedStatus] = useState<ActionPlanStatus>('In Progress');
  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [plans, schs, obs] = await Promise.all([
        getAllActionPlans(),
        getAllSchools(),
        getAllObservations()
      ]);
      setActionPlans(plans);
      setSchools(schs);
      setObservations(obs);

      const targetId = state?.newlyCreatedPlanId || (plans.length > 0 ? plans[0].id : '');
      if (targetId) {
        setSelectedPlanId(targetId);
        const p = plans.find(plan => plan.id === targetId);
        if (p) {
          setSelectedStatus(p.status);
          setTriedActivity(p.triedActivity ?? true);
          if (p.followUpNotes) setFollowUpNotes(p.followUpNotes);
          if (p.activityReflection) setActivityReflection(p.activityReflection);
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectPlan = (plan: ActionPlan) => {
    setSelectedPlanId(plan.id);
    setSelectedStatus(plan.status);
    setTriedActivity(plan.triedActivity ?? true);
    setFollowUpNotes(plan.followUpNotes || '');
    setActivityReflection(plan.activityReflection || '');
  };

  const handleSaveVerification = async () => {
    const plan = actionPlans.find(p => p.id === selectedPlanId);
    if (!plan) return;

    const updated: ActionPlan = {
      ...plan,
      status: selectedStatus,
      triedActivity,
      followUpNotes,
      activityReflection,
      updatedAt: new Date().toISOString()
    };

    await saveActionPlan(updated);
    setSavedSuccess(true);
    const refreshed = await getAllActionPlans();
    setActionPlans(refreshed);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const selectedPlan = actionPlans.find(p => p.id === selectedPlanId) || actionPlans[0];
  const selectedSchool = schools.find(s => s.id === selectedPlan?.schoolId);
  const selectedObs = observations.find(o => o.id === selectedPlan?.observationId);

  // Filter logic
  const filteredPlans = actionPlans.filter((p) => {
    const school = schools.find(s => s.id === p.schoolId);
    const matchesSearch = p.teacherName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.agreedAction.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (school?.name || '').toLowerCase().includes(searchTerm.toLowerCase());
    if (!matchesSearch) return false;

    if (statusFilter === 'Completed') return p.status === 'Completed';
    if (statusFilter === 'Overdue') return new Date(p.followUpDate) < new Date() && p.status !== 'Completed';
    if (statusFilter === 'Due Soon') return p.status === 'In Progress';
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Top Header matching Figma Screen 7 */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-[#25332F] tracking-tight">
            Follow-up Tracker
          </h1>
          <p className="text-xs text-[#5A6F68] mt-0.5">
            Track agreed teacher action plans, verify classroom practice changes, and schedule follow-ups.
          </p>
        </div>

        <button
          onClick={() => navigate('/app/plan-visit', { state: { preselectedSchoolId: selectedPlan?.schoolId } })}
          className="bg-[#176B5B] hover:bg-[#125447] text-white font-bold py-2.5 px-4 rounded-xl text-xs flex items-center gap-1.5 self-start sm:self-auto shadow-xs transition-colors"
        >
          <Calendar className="w-4 h-4 text-[#F4B942]" />
          <span>Schedule Follow-up Visit</span>
        </button>
      </div>

      {savedSuccess && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold rounded-xl flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>Follow-up record and classroom comparison saved to local storage!</span>
        </div>
      )}

      {/* Main 2-column Grid matching Screen 7 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 1 Col: List with Search & Filters */}
        <div className="space-y-4">
          <div className="card-base p-4 bg-white space-y-3">
            <div className="relative">
              <Search className="w-4 h-4 text-[#7B928A] absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search action plans..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 text-xs bg-[#F7F9F8] border border-[#E2ECE8] rounded-xl focus:bg-white focus:border-[#176B5B]"
              />
            </div>

            {/* Filter pills */}
            <div className="flex items-center gap-1 overflow-x-auto text-[11px] font-semibold">
              {(['All', 'Due Soon', 'Overdue', 'Completed'] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setStatusFilter(tab)}
                  className={`px-2.5 py-1 rounded-lg whitespace-nowrap transition-colors ${
                    statusFilter === tab
                      ? 'bg-[#176B5B] text-white'
                      : 'bg-[#F0F4F2] text-[#43544E] hover:bg-[#E2ECE8]'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>

          {/* Cards List */}
          <div className="space-y-3">
            {filteredPlans.map((plan) => {
              const school = schools.find(s => s.id === plan.schoolId);
              const isSelected = plan.id === selectedPlanId;
              const isOverdue = new Date(plan.followUpDate) < new Date() && plan.status !== 'Completed';

              return (
                <div
                  key={plan.id}
                  onClick={() => handleSelectPlan(plan)}
                  className={`card-base p-4 cursor-pointer transition-all space-y-2 ${
                    isSelected
                      ? 'border-[#176B5B] bg-[#F0F8F6]/60 shadow-xs ring-1 ring-[#176B5B]'
                      : 'bg-white hover:border-[#AFDCD1]'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <span className="font-bold text-xs text-[#25332F] line-clamp-1">
                      {plan.improvementArea.split(':')[0]}
                    </span>
                    <ActionStatusBadge status={plan.status} />
                  </div>

                  <p className="text-[11px] text-[#5A6F68]">
                    {school?.name} • {plan.teacherName}
                  </p>

                  <div className="flex items-center justify-between text-[10px] pt-1 border-t border-[#E2ECE8]">
                    <span className={isOverdue ? 'text-red-700 font-bold' : 'text-[#5A6F68]'}>
                      Due: {plan.followUpDate} {isOverdue && '(Overdue)'}
                    </span>
                    <span className="text-[#176B5B] font-bold">Select →</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right 2 Cols: Detailed Tracker & Verification */}
        {selectedPlan && (
          <div className="lg:col-span-2 space-y-5">
            {/* Header Card for Selected Plan */}
            <div className="card-base p-5 bg-white space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 pb-3 border-b border-[#E2ECE8]">
                <div>
                  <h2 className="text-base font-extrabold text-[#25332F]">
                    {selectedPlan.improvementArea.split(':')[0]}
                  </h2>
                  <p className="text-xs text-[#5A6F68]">
                    {selectedSchool?.name} • {selectedPlan.teacherName} ({selectedPlan.grade || 'Grade 3 Hindi'})
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <ActionStatusBadge status={selectedPlan.status} />
                  <span className="text-xs font-bold text-[#176B5B] bg-[#E6F2EF] px-2.5 py-1 rounded-full">
                    Target: {selectedPlan.followUpDate}
                  </span>
                </div>
              </div>

              {/* Agreed Action & Observable Indicator */}
              <div className="space-y-2 text-xs">
                <div className="p-3 bg-[#F7F9F8] rounded-xl border border-[#E2ECE8]">
                  <span className="font-bold text-[#7B928A] uppercase text-[10px] block">
                    Agreed teacher action
                  </span>
                  <p className="text-[#25332F] font-semibold mt-0.5">
                    {selectedPlan.agreedAction}
                  </p>
                </div>

                <div className="p-3 bg-[#F7F9F8] rounded-xl border border-[#E2ECE8]">
                  <span className="font-bold text-[#7B928A] uppercase text-[10px] block">
                    Observable progress indicator
                  </span>
                  <p className="text-[#176B5B] font-semibold mt-0.5">
                    {selectedPlan.successIndicator}
                  </p>
                </div>
              </div>
            </div>

            {/* Observation Comparison Card matching Figma Screen 7 */}
            <div className="card-base p-5 bg-white space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-[#E2ECE8]">
                <h3 className="font-bold text-sm text-[#25332F] flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-[#176B5B]" />
                  <span>Previous and current observation comparison</span>
                </h3>
                <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                  +36% Participation
                </span>
              </div>

              {/* Progress metrics row */}
              <div className="grid grid-cols-2 gap-4">
                <div className="p-3.5 bg-[#F7F9F8] rounded-xl border border-[#E2ECE8] text-center space-y-1">
                  <span className="text-[10px] uppercase font-bold text-[#7B928A]">Baseline Visit (4 Oct)</span>
                  <div className="text-xl font-extrabold text-[#25332F]">12 of 28</div>
                  <p className="text-[11px] text-[#5A6F68]">Active participation (43%)</p>
                  <span className="inline-block text-[10px] bg-red-100 text-red-800 px-2 py-0.5 rounded font-bold">
                    Needs Support
                  </span>
                </div>

                <div className="p-3.5 bg-[#F0F8F6] rounded-xl border border-[#AFDCD1] text-center space-y-1">
                  <span className="text-[10px] uppercase font-bold text-[#176B5B]">Follow-up Trial (12 Oct)</span>
                  <div className="text-xl font-extrabold text-[#176B5B]">22 of 28</div>
                  <p className="text-[11px] text-[#176B5B]">Active participation (79%)</p>
                  <span className="inline-block text-[10px] bg-amber-100 text-amber-800 px-2 py-0.5 rounded font-bold">
                    Partly Observed
                  </span>
                </div>
              </div>

              <p className="text-[11px] text-[#5A6F68] pt-1">
                Note: Demonstrates positive adoption of partner reading. Hesitant students actively pointed to words with peers.
              </p>
            </div>

            {/* Record What Happened During This Visit Form */}
            <div className="card-base p-5 bg-white space-y-4">
              <h3 className="font-bold text-sm text-[#25332F] pb-2 border-b border-[#E2ECE8]">
                Record what happened during this visit
              </h3>

              {/* Teacher tried activity? */}
              <div>
                <label className="block text-xs font-bold text-[#25332F] uppercase mb-1.5">
                  Did the teacher try the agreed activity?
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setTriedActivity(true)}
                    className={`py-2 px-3 rounded-xl text-xs font-bold border transition-colors flex items-center justify-center gap-1.5 ${
                      triedActivity === true
                        ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                        : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50'
                    }`}
                  >
                    <Check className="w-3.5 h-3.5" />
                    <span>Yes, attempted in class</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setTriedActivity(false)}
                    className={`py-2 px-3 rounded-xl text-xs font-bold border transition-colors flex items-center justify-center gap-1.5 ${
                      triedActivity === false
                        ? 'bg-amber-600 text-white border-amber-600 shadow-xs'
                        : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50'
                    }`}
                  >
                    <X className="w-3.5 h-3.5" />
                    <span>Not yet / Faced challenges</span>
                  </button>
                </div>
              </div>

              {/* Field notes */}
              <div>
                <label className="block text-xs font-bold text-[#25332F] uppercase mb-1">
                  Field notes & mentor observations
                </label>
                <textarea
                  rows={2}
                  value={followUpNotes}
                  onChange={(e) => setFollowUpNotes(e.target.value)}
                  className="w-full p-2.5 bg-[#F7F9F8] border border-[#E2ECE8] rounded-xl text-xs focus:bg-white focus:border-[#176B5B]"
                />
              </div>

              {/* Teacher reflection */}
              <div>
                <label className="block text-xs font-bold text-[#25332F] uppercase mb-1">
                  Teacher reflection & feedback
                </label>
                <textarea
                  rows={2}
                  value={activityReflection}
                  onChange={(e) => setActivityReflection(e.target.value)}
                  className="w-full p-2.5 bg-[#F7F9F8] border border-[#E2ECE8] rounded-xl text-xs focus:bg-white focus:border-[#176B5B]"
                />
              </div>

              {/* Status Selector */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
                <div>
                  <label className="block text-xs font-bold text-[#25332F] uppercase mb-1">
                    Update status
                  </label>
                  <select
                    value={selectedStatus}
                    onChange={(e) => setSelectedStatus(e.target.value as ActionPlanStatus)}
                    className="w-full p-2 bg-[#F7F9F8] border border-[#E2ECE8] rounded-xl text-xs font-semibold focus:border-[#176B5B]"
                  >
                    <option value="In Progress">In Progress (Practicing regularly)</option>
                    <option value="Completed">Completed (Method successfully adopted)</option>
                    <option value="Needs Further Support">Needs Further Support (Co-teaching required)</option>
                  </select>
                </div>

                <div className="pt-4 flex justify-end">
                  <button
                    type="button"
                    onClick={handleSaveVerification}
                    className="w-full sm:w-auto px-5 py-2.5 bg-[#176B5B] hover:bg-[#125447] text-white text-xs font-bold rounded-xl shadow-xs transition-colors"
                  >
                    Save Follow-up Record
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
