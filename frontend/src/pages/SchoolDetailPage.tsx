import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { School, Visit, Observation, ActionPlan } from '../types';
import {
  getSchoolById,
  getAllVisits,
  getAllObservations,
  getAllActionPlans
} from '../services/database';
import {
  Building2,
  MapPin,
  Users,
  Calendar,
  Clock,
  ArrowLeft,
  PlusCircle,
  ClipboardCheck,
  CheckCircle2,
  AlertCircle,
  FileText,
  Sparkles,
  ChevronRight,
  ShieldCheck
} from 'lucide-react';
import { VisitStatusBadge, ActionStatusBadge, IndicatorBadge } from '../components/common/Badge';
import { PriorityBadge } from '../components/common/PriorityBadge';

export const SchoolDetailPage: React.FC = () => {
  const { schoolId } = useParams<{ schoolId: string }>();
  const navigate = useNavigate();

  const [school, setSchool] = useState<School | null>(null);
  const [visits, setVisits] = useState<Visit[]>([]);
  const [observations, setObservations] = useState<Observation[]>([]);
  const [actionPlans, setActionPlans] = useState<ActionPlan[]>([]);
  const [activeTab, setActiveTab] = useState<'overview' | 'visits' | 'observations' | 'actionPlans'>('overview');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (schoolId) {
      loadDetails(schoolId);
    }
  }, [schoolId]);

  const loadDetails = async (id: string) => {
    try {
      setLoading(true);
      const [schoolData, allVisits, allObs, allPlans] = await Promise.all([
        getSchoolById(id),
        getAllVisits(),
        getAllObservations(),
        getAllActionPlans()
      ]);

      if (schoolData) {
        setSchool(schoolData);
        setVisits(allVisits.filter(v => v.schoolId === id));
        setObservations(allObs.filter(o => o.schoolId === id));
        setActionPlans(allPlans.filter(p => p.schoolId === id));
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="py-24 text-center text-charcoal-500 text-sm">
        Loading school profile and visit history...
      </div>
    );
  }

  if (!school) {
    return (
      <div className="card-base p-12 text-center">
        <Building2 className="w-12 h-12 text-charcoal-400 mx-auto mb-3" />
        <h2 className="text-lg font-bold text-charcoal-800">School Not Found</h2>
        <button
          onClick={() => navigate('/app/schools')}
          className="mt-4 px-4 py-2 bg-[#176B5B] text-white text-xs font-semibold rounded-lg"
        >
          Back to Directory
        </button>
      </div>
    );
  }

  const nextVisit = visits.find(v => v.status === 'Scheduled');

  return (
    <div className="space-y-6">
      {/* Back button */}
      <button
        onClick={() => navigate('/app/schools')}
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#5A6F68] hover:text-[#176B5B] transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to School Directory</span>
      </button>

      {/* Header matching Figma Screen 3 */}
      <div className="card-base p-6 bg-white space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
          <div className="space-y-1">
            <h1 className="text-2xl font-extrabold text-[#25332F]">
              {school.name}
            </h1>
            <p className="text-xs text-[#5A6F68]">
              {school.code} • {school.location}
            </p>
          </div>

          <button
            onClick={() => navigate('/app/plan-visit', { state: { preselectedSchoolId: school.id } })}
            className="bg-[#176B5B] hover:bg-[#125447] text-white font-bold py-2 px-4 rounded-xl text-xs flex items-center gap-1.5 self-start sm:self-auto shadow-xs"
          >
            <Calendar className="w-4 h-4 text-[#F4B942]" />
            <span>Plan a visit</span>
          </button>
        </div>

        {/* Metadata Chips */}
        <div className="flex flex-wrap gap-2 pt-2 border-t border-[#E2ECE8] text-xs">
          <span className="px-3 py-1 rounded-lg bg-[#F7F9F8] border border-[#E2ECE8] text-[#25332F] font-medium">
            <strong>Head Teacher:</strong> {school.headTeacher}
          </span>
          <span className="px-3 py-1 rounded-lg bg-[#F7F9F8] border border-[#E2ECE8] text-[#25332F] font-medium">
            {school.totalTeachers} Teachers • {school.totalStudents} Students
          </span>
          <span className="px-3 py-1 rounded-lg bg-[#F7F9F8] border border-[#E2ECE8] text-[#25332F] font-medium">
            {school.grades}
          </span>
          <span className="px-3 py-1 rounded-lg bg-[#E6F2EF] text-[#176B5B] font-bold">
            Raipur Rural Cluster
          </span>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 pt-2 border-b border-[#E2ECE8]">
          {(['overview', 'visits', 'observations', 'actionPlans'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`pb-2.5 px-3 text-xs font-bold transition-all border-b-2 -mb-px capitalize ${
                activeTab === tab
                  ? 'border-[#176B5B] text-[#176B5B]'
                  : 'border-transparent text-[#5A6F68] hover:text-[#25332F]'
              }`}
            >
              {tab === 'actionPlans' ? 'Action Plans' : tab === 'visits' ? 'Visit History' : tab}
            </button>
          ))}
        </div>
      </div>

      {/* 2-Column Layout matching Figma Screen 3 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Visit History & Support Needs */}
        <div className="lg:col-span-2 space-y-5">
          {/* Visit History Section */}
          <div className="card-base p-5 bg-white space-y-4">
            <h3 className="font-bold text-base text-[#25332F] pb-2 border-b border-[#E2ECE8]">
              Visit History
            </h3>

            <div className="space-y-4">
              <div className="p-3.5 rounded-xl border border-[#E2ECE8] bg-white space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-[#25332F]">4 Oct 2026 • Grade 3 Hindi</span>
                  <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded">Completed</span>
                </div>
                <p className="text-xs text-[#25332F] font-semibold">
                  Observation & Feedback: Guided reading pairs practice
                </p>
                <p className="text-xs text-[#5A6F68] leading-relaxed">
                  Teacher Smt. Radhika Verma demonstrated positive classroom rapport. Observed choral recitation during story reading. Agreed on trying a 10-minute partner reading trial with back rows.
                </p>
                <div className="pt-1 flex items-center justify-between text-[11px] text-[#176B5B]">
                  <span>Action plan: 1 agreed action in progress</span>
                  <button
                    onClick={() => navigate('/app/feedback-plan')}
                    className="font-bold hover:underline"
                  >
                    View Plan →
                  </button>
                </div>
              </div>

              <div className="p-3.5 rounded-xl border border-[#E2ECE8] bg-white space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-[#25332F]">18 Sep 2026 • Grade 2 Math</span>
                  <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded">Completed</span>
                </div>
                <p className="text-xs text-[#25332F] font-semibold">
                  Observation: Place value with Ganit Mala
                </p>
                <p className="text-xs text-[#5A6F68] leading-relaxed">
                  Co-modeled Ganit Mala bead sliding for 2-digit number grouping. Students engaged eagerly in sliding beads for number 24.
                </p>
              </div>

              <div className="p-3.5 rounded-xl border border-[#E2ECE8] bg-white space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-[#25332F]">28 Aug 2026 • School Planning</span>
                  <span className="text-[10px] bg-gray-100 text-gray-700 font-bold px-2 py-0.5 rounded">Baseline</span>
                </div>
                <p className="text-xs text-[#5A6F68]">
                  Baseline term check-in with Head Teacher Smt. Sunita Devi and classroom observation schedule setup.
                </p>
              </div>
            </div>
          </div>

          {/* Identified Support Needs */}
          <div className="card-base p-5 bg-white space-y-3">
            <h3 className="font-bold text-sm text-[#25332F] pb-2 border-b border-[#E2ECE8]">
              Identified support needs
            </h3>
            <p className="text-xs text-[#5A6F68]">
              Target focus areas agreed upon during cluster mentoring debriefs:
            </p>
            <div className="flex flex-wrap gap-2">
              {school.supportNeeds.map((need, idx) => (
                <span
                  key={idx}
                  className="px-3 py-1.5 bg-[#E6F2EF] text-[#176B5B] border border-[#AFDCD1] rounded-lg text-xs font-semibold"
                >
                  {need}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Right 1 Col: Next Visit, Action Plans, Roster, Disclaimer */}
        <div className="space-y-5">
          {/* Next scheduled visit card matching Figma */}
          <div className="card-base p-5 bg-[#F0F8F6] border-[#AFDCD1] space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#176B5B]">
                Next scheduled visit
              </span>
              <span className="text-[10px] font-bold bg-[#176B5B] text-white px-2 py-0.5 rounded">
                Today, 12 Oct
              </span>
            </div>

            <div>
              <p className="text-xl font-extrabold text-[#25332F]">
                10:00 - 11:30 AM
              </p>
              <p className="text-xs font-bold text-[#176B5B] mt-0.5">
                Focus: Grade 3 Hindi - Reading Fluency
              </p>
              <p className="text-xs text-[#5A6F68]">
                Teacher: Smt. Radhika Verma
              </p>
            </div>

            <button
              onClick={() =>
                navigate('/app/observation', {
                  state: {
                    selectedSchoolId: school.id,
                    selectedVisitId: nextVisit?.id
                  }
                })
              }
              className="w-full py-2.5 bg-[#176B5B] hover:bg-[#125447] text-white text-xs font-bold rounded-xl shadow-xs flex items-center justify-center gap-1.5 transition-colors"
            >
              <span>Start Visit now</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* Agreed Action Plans Card */}
          <div className="card-base p-5 bg-white space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-[#E2ECE8]">
              <h3 className="font-bold text-sm text-[#25332F]">
                Agreed action plans
              </h3>
              <span className="text-[10px] font-bold text-[#176B5B]">{actionPlans.length} active</span>
            </div>

            <div className="space-y-2">
              <div className="p-2.5 bg-[#F7F9F8] rounded-xl border border-[#E2ECE8] text-xs space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-[#25332F]">Pair reading practice</span>
                  <span className="text-[10px] bg-blue-100 text-blue-800 font-bold px-1.5 py-0.2 rounded">In Progress</span>
                </div>
                <p className="text-[11px] text-[#5A6F68]">
                  Smt. Radhika Verma • Grade 3 Hindi
                </p>
                <p className="text-[10px] text-amber-700 font-semibold">
                  Due: Today, 12 Oct
                </p>
              </div>
            </div>
          </div>

          {/* Teacher Roster */}
          <div className="card-base p-5 bg-white space-y-3">
            <h3 className="font-bold text-sm text-[#25332F] pb-2 border-b border-[#E2ECE8]">
              Teacher roster
            </h3>
            <ul className="text-xs space-y-2 text-[#25332F]">
              <li className="flex items-center justify-between">
                <span>Smt. Radhika Verma</span>
                <span className="text-[11px] text-[#5A6F68]">Grade 3</span>
              </li>
              <li className="flex items-center justify-between">
                <span>Shri Rajesh Kumar</span>
                <span className="text-[11px] text-[#5A6F68]">Grade 4 - 5</span>
              </li>
              <li className="flex items-center justify-between">
                <span>Smt. Sunita Devi</span>
                <span className="text-[11px] text-[#5A6F68]">Head Teacher</span>
              </li>
            </ul>
          </div>

          {/* Local Storage Disclaimer Box matching Screenshot */}
          <div className="p-3 bg-[#FEF9E6] border border-[#FDE68A] rounded-xl text-xs text-[#92400E] flex items-start gap-2">
            <ShieldCheck className="w-4 h-4 text-[#92400E] flex-shrink-0 mt-0.5" />
            <p className="text-[11px] leading-tight">
              All school visit records are stored locally on this device. Not synchronized to external servers.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
