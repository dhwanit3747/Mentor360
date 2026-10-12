import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  School,
  Visit,
  ActionPlan,
  Observation
} from '../types';
import {
  getAllSchools,
  getAllVisits,
  getAllActionPlans,
  getAllObservations
} from '../services/database';
import { PriorityBadge } from '../components/common/PriorityBadge';
import { VisitStatusBadge, ActionStatusBadge } from '../components/common/Badge';
import {
  Building2,
  Calendar,
  CheckCircle2,
  AlertCircle,
  PlusCircle,
  ArrowRight,
  Clock,
  Sparkles,
  ChevronRight,
  MapPin,
  Flame,
  Info,
  BookOpen
} from 'lucide-react';

export const DashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const [schools, setSchools] = useState<School[]>([]);
  const [visits, setVisits] = useState<Visit[]>([]);
  const [actionPlans, setActionPlans] = useState<ActionPlan[]>([]);
  const [observations, setObservations] = useState<Observation[]>([]);
  const [taskFilter, setTaskFilter] = useState<'all' | 'high' | 'followup'>('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const [schoolsData, visitsData, plansData, obsData] = await Promise.all([
        getAllSchools(),
        getAllVisits(),
        getAllActionPlans(),
        getAllObservations()
      ]);
      setSchools(schoolsData);
      setVisits(visitsData);
      setActionPlans(plansData);
      setObservations(obsData);
    } catch (err) {
      console.error('Failed to load dashboard data', err);
    } finally {
      setLoading(false);
    }
  };

  const plannedVisits = visits.filter(v => v.status === 'Scheduled');
  const completedVisits = visits.filter(v => v.status === 'Completed');
  const pendingFollowups = actionPlans.filter(p => p.status === 'In Progress' || p.status === 'Needs Further Support');
  const overdueFollowups = actionPlans.filter(p => p.status !== 'Completed' && new Date(p.followUpDate) < new Date());
  const completedActions = actionPlans.filter(p => p.status === 'Completed');

  // Visits this month (completed or scheduled in current month)
  const now = new Date();
  const thisMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
  const visitsThisMonth = visits.filter(v => v.scheduledDate?.startsWith(thisMonth)).length;

  // Filter tasks
  const prioritizedTasks = [...plannedVisits]
    .sort((a, b) => (b.mentorPriorityOverride ?? b.priorityScore) - (a.mentorPriorityOverride ?? a.priorityScore))
    .filter(v => {
      const activeScore = v.mentorPriorityOverride ?? v.priorityScore;
      if (taskFilter === 'high') return activeScore >= 14;
      if (taskFilter === 'followup') return v.followUpImportance >= 1 || v.purpose.toLowerCase().includes('follow-up');
      return true;
    });

  // Build dynamic 6-day week strip starting Monday of current week
  const today = new Date();
  const dayOfWeek = today.getDay(); // 0=Sun
  const mondayOffset = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
  const monday = new Date(today); monday.setDate(today.getDate() + mondayOffset);
  const dayNames = ['Mon','Tue','Wed','Thu','Fri','Sat'];
  const weekDays = Array.from({ length: 6 }, (_, i) => {
    const d = new Date(monday); d.setDate(monday.getDate() + i);
    const dStr = d.toISOString().split('T')[0];
    return {
      name: dayNames[i],
      date: d.getDate(),
      isToday: dStr === today.toISOString().split('T')[0],
      hasVisits: visits.some(v => v.scheduledDate === dStr)
    };
  });

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-24 space-y-3">
        <div className="w-10 h-10 border-4 border-[#176B5B] border-t-transparent rounded-full animate-spin"></div>
        <p className="text-sm font-medium text-charcoal-500">Loading your mentoring dashboard...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Top Header matching Figma Screen 1 */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-[#25332F] tracking-tight">
            My Work Today
          </h1>
          <p className="text-xs text-[#5A6F68] mt-0.5">
            Welcome back, <strong className="text-[#25332F]">Ananya</strong>. Here's your mentoring focus for Thursday, 12 Oct 2026.
          </p>
        </div>

        <button
          onClick={() => navigate('/app/observation')}
          className="bg-[#176B5B] hover:bg-[#125447] text-white font-bold py-2.5 px-4 rounded-xl text-xs flex items-center gap-2 self-start sm:self-auto shadow-xs transition-all hover:scale-102"
        >
          <PlusCircle className="w-4 h-4 text-[#F4B942]" />
          <span>Start a School Visit</span>
        </button>
      </div>

      {/* 4 KPI Summary Cards matching Screenshot */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1 */}
        <div className="card-base p-4 bg-white space-y-1">
          <p className="text-[11px] font-bold text-[#7B928A] uppercase tracking-wider">
            Schools in cluster
          </p>
          <div className="text-3xl font-extrabold text-[#25332F]">
            {schools.length}
          </div>
          <p className="text-[11px] text-[#176B5B] font-semibold flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-[#176B5B]"></span>
            Raipur Rural Cluster
          </p>
        </div>

        {/* Card 2 */}
        <div className="card-base p-4 bg-white space-y-1">
          <p className="text-[11px] font-bold text-[#7B928A] uppercase tracking-wider">
            Visits this month
          </p>
          <div className="text-3xl font-extrabold text-[#25332F]">
            {visitsThisMonth}
          </div>
          <p className="text-[11px] text-[#5A6F68]">
            Scheduled or completed this month
          </p>
        </div>

        {/* Card 3 */}
        <div className="card-base p-4 bg-white space-y-1">
          <p className="text-[11px] font-bold text-[#7B928A] uppercase tracking-wider">
            Follow-ups due
          </p>
          <div className="text-3xl font-extrabold text-[#D97706]">
            {pendingFollowups.length}
          </div>
          <p className="text-[11px] text-amber-700 font-semibold">
            {overdueFollowups.length > 0 ? `${overdueFollowups.length} overdue` : 'All on track'}
          </p>
        </div>

        {/* Card 4 */}
        <div className="card-base p-4 bg-white space-y-1">
          <p className="text-[11px] font-bold text-[#7B928A] uppercase tracking-wider">
            Action plans closed
          </p>
          <div className="text-3xl font-extrabold text-emerald-700">
            {completedActions.length}
          </div>
          <p className="text-[11px] text-emerald-700 font-semibold">
            In the last 30 days
          </p>
        </div>
      </div>

      {/* Main Content Layout: Tasks (Left 65%) & Weekly Preview (Right 35%) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Tasks & Reminder Banner */}
        <div className="lg:col-span-2 space-y-5">
          {/* Card: What needs your attention */}
          <div className="card-base p-5 bg-white space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-[#E2ECE8] gap-2">
              <div>
                <h2 className="text-base font-bold text-[#25332F]">
                  What needs your attention
                </h2>
                <p className="text-xs text-[#5A6F68]">
                  Prioritized by developmental urgency and overdue action plans.
                </p>
              </div>

              {/* Filter pills */}
              <div className="flex items-center gap-1.5 text-xs font-semibold">
                <button
                  onClick={() => setTaskFilter('all')}
                  className={`px-3 py-1 rounded-lg transition-colors ${
                    taskFilter === 'all'
                      ? 'bg-[#176B5B] text-white'
                      : 'bg-[#F0F4F2] text-[#43544E] hover:bg-[#E2ECE8]'
                  }`}
                >
                  All tasks
                </button>
                <button
                  onClick={() => setTaskFilter('high')}
                  className={`px-3 py-1 rounded-lg transition-colors ${
                    taskFilter === 'high'
                      ? 'bg-[#176B5B] text-white'
                      : 'bg-[#F0F4F2] text-[#43544E] hover:bg-[#E2ECE8]'
                  }`}
                >
                  High priority
                </button>
                <button
                  onClick={() => setTaskFilter('followup')}
                  className={`px-3 py-1 rounded-lg transition-colors ${
                    taskFilter === 'followup'
                      ? 'bg-[#176B5B] text-white'
                      : 'bg-[#F0F4F2] text-[#43544E] hover:bg-[#E2ECE8]'
                  }`}
                >
                  Follow-ups
                </button>
              </div>
            </div>

            {/* Tasks List */}
            <div className="divide-y divide-[#E2ECE8] space-y-3">
              {prioritizedTasks.map((visit, index) => {
                const school = schools.find(s => s.id === visit.schoolId);
                const isHigh = (visit.mentorPriorityOverride ?? visit.priorityScore) >= 14;

                return (
                  <div
                    key={visit.id}
                    className="pt-3 first:pt-0 flex flex-col sm:flex-row sm:items-start justify-between gap-3 group"
                  >
                    <div className="space-y-1.5 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-bold text-sm text-[#25332F] group-hover:text-[#176B5B] transition-colors">
                          {visit.schoolName || school?.name}
                        </span>
                        <PriorityBadge
                          score={visit.priorityScore}
                          overrideScore={visit.mentorPriorityOverride}
                          urgency={visit.urgency}
                          needSeverity={visit.needSeverity}
                          followUpImportance={visit.followUpImportance}
                          overdueLevel={visit.overdueLevel}
                        />
                        {index === 0 && (
                          <span className="text-[10px] font-bold bg-[#F4B942]/25 text-[#92400E] px-2 py-0.5 rounded">
                            Action Due
                          </span>
                        )}
                      </div>

                      <p className="text-xs font-semibold text-[#25332F]">
                        {visit.purpose}
                      </p>

                      <div className="flex flex-wrap items-center gap-3 text-[11px] text-[#5A6F68]">
                        <span className="flex items-center gap-1 font-medium text-[#176B5B]">
                          <Clock className="w-3.5 h-3.5 text-[#176B5B]" />
                          {visit.scheduledDate === '2026-10-12' ? 'Today, ' : ''}{visit.scheduledTime}
                        </span>
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5 text-[#7B928A]" />
                          {school?.location || 'Raipur Rural'}
                        </span>
                        <span className="bg-[#E6F2EF] text-[#176B5B] px-2 py-0.5 rounded font-medium">
                          {visit.focusArea}
                        </span>
                      </div>
                    </div>

                    <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-2 flex-shrink-0">
                      <button
                        onClick={() => {
                          navigate('/app/observation', {
                            state: {
                              selectedSchoolId: visit.schoolId,
                              selectedVisitId: visit.id
                            }
                          });
                        }}
                        className="px-3.5 py-1.5 bg-[#176B5B] hover:bg-[#125447] text-white text-xs font-bold rounded-lg shadow-xs flex items-center gap-1 transition-all"
                      >
                        <span>Start Visit</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>

                      <button
                        onClick={() => navigate(`/app/schools/${visit.schoolId}`)}
                        className="text-[11px] font-semibold text-[#5A6F68] hover:text-[#176B5B]"
                      >
                        Details
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Constructive Feedback Banner matching Figma */}
          <div className="card-base p-4 bg-[#E6F2EF] border-[#AFDCD1] flex items-start gap-3 text-xs text-[#176B5B]">
            <Sparkles className="w-5 h-5 text-[#176B5B] flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-bold text-xs text-[#176B5B]">
                Constructive Feedback Reminder:
              </p>
              <p className="text-[11px] text-[#25332F] mt-0.5 leading-relaxed">
                Focus on 1–2 actionable teaching practices per visit rather than extensive checklists. Support teachers with practical classroom demonstrations and celebrate small instructional improvements.
              </p>
            </div>
          </div>
        </div>

        {/* Right Column: Weekly Schedule & Monthly Progress */}
        <div className="space-y-5">
          {/* Card: This Week Strip */}
          <div className="card-base p-5 bg-white space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-[#E2ECE8]">
              <h3 className="font-bold text-sm text-[#25332F]">This week</h3>
              <span className="text-[11px] font-semibold text-[#176B5B]">9 – 14 Oct</span>
            </div>

            {/* 6-day strip */}
            <div className="grid grid-cols-6 gap-1.5 text-center">
              {weekDays.map((d) => (
                <div
                  key={d.name}
                  className={`py-2 px-1 rounded-xl transition-all ${
                    d.isToday
                      ? 'bg-[#176B5B] text-white font-bold shadow-xs'
                      : 'bg-[#F7F9F8] text-[#5A6F68] hover:bg-[#F0F8F6]'
                  }`}
                >
                  <span className="block text-[10px] uppercase font-bold">{d.name}</span>
                  <span className="block text-sm font-extrabold mt-0.5">{d.date}</span>
                  {d.hasVisits && (
                    <span
                      className={`block w-1.5 h-1.5 rounded-full mx-auto mt-1 ${
                        d.isToday ? 'bg-[#F4B942]' : 'bg-[#176B5B]'
                      }`}
                    ></span>
                  )}
                </div>
              ))}
            </div>

            {/* Scheduled for today snippet */}
            <div className="p-3 bg-[#F0F8F6] rounded-xl border border-[#AFDCD1] space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-[#176B5B] uppercase text-[10px]">Today's Planned Visit</span>
                <span className="text-[10px] font-bold text-[#25332F]">10:00 - 11:30 AM</span>
              </div>
              <p className="text-xs font-bold text-[#25332F]">
                Saraswati Primary School
              </p>
              <p className="text-[11px] text-[#5A6F68]">
                Grade 3 Hindi • Smt. Radhika Verma
              </p>
              <p className="text-[11px] text-[#176B5B] font-medium bg-white p-1.5 rounded border border-[#AFDCD1]">
                Demonstrate: Guided partner reading
              </p>
            </div>
          </div>

          {/* Card: Your monthly progress */}
          <div className="card-base p-5 bg-white space-y-4">
            <h3 className="font-bold text-sm text-[#25332F] pb-2 border-b border-[#E2ECE8]">
              Your monthly progress
            </h3>

            {/* Progress metric 1 */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="font-medium text-[#5A6F68]">Visits completed</span>
                <span className="font-bold text-[#25332F]">12 of 16 planned</span>
              </div>
              <div className="w-full bg-[#E2ECE8] h-2 rounded-full overflow-hidden">
                <div className="bg-[#176B5B] h-full rounded-full" style={{ width: '75%' }}></div>
              </div>
            </div>

            {/* Progress metric 2 */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="font-medium text-[#5A6F68]">Follow-ups verified</span>
                <span className="font-bold text-[#25332F]">8 of 10 agreed</span>
              </div>
              <div className="w-full bg-[#E2ECE8] h-2 rounded-full overflow-hidden">
                <div className="bg-[#F4B942] h-full rounded-full" style={{ width: '80%' }}></div>
              </div>
            </div>

            {/* Progress metric 3 */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="font-medium text-[#5A6F68]">Cluster coverage</span>
                <span className="font-bold text-[#25332F]">6 of 6 schools visited</span>
              </div>
              <div className="w-full bg-[#E2ECE8] h-2 rounded-full overflow-hidden">
                <div className="bg-emerald-600 h-full rounded-full" style={{ width: '100%' }}></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
