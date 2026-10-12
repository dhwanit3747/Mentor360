import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { School, Visit, ActionPlan } from '../types';
import { getAllSchools, getAllVisits, getAllActionPlans } from '../services/database';
import {
  Building2,
  Search,
  MapPin,
  Calendar,
  Clock,
  AlertCircle,
  ChevronRight,
  PlusCircle,
  Users,
  CheckCircle2,
  FileText,
  BookOpen,
  Sparkles
} from 'lucide-react';

export const SchoolDirectoryPage: React.FC = () => {
  const navigate = useNavigate();
  const [schools, setSchools] = useState<School[]>([]);
  const [visits, setVisits] = useState<Visit[]>([]);
  const [actionPlans, setActionPlans] = useState<ActionPlan[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'upcoming' | 'pendingFollowup' | 'highNeed'>('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSchools();
  }, []);

  const loadSchools = async () => {
    try {
      setLoading(true);
      const [sData, vData, aData] = await Promise.all([
        getAllSchools(),
        getAllVisits(),
        getAllActionPlans()
      ]);
      setSchools(sData);
      setVisits(vData);
      setActionPlans(aData);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const filteredSchools = schools.filter((school) => {
    const matchesSearch = school.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      school.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
      school.code.toLowerCase().includes(searchTerm.toLowerCase());

    if (!matchesSearch) return false;

    if (filterType === 'upcoming') {
      return Boolean(school.nextVisitDate);
    }
    if (filterType === 'pendingFollowup') {
      return actionPlans.some(
        p => p.schoolId === school.id && (p.status === 'In Progress' || p.status === 'Needs Further Support')
      );
    }
    if (filterType === 'highNeed') {
      return school.supportNeeds && school.supportNeeds.length >= 2;
    }

    return true;
  });

  return (
    <div className="space-y-6">
      {/* Header matching Figma Screen 2 */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-[#25332F] tracking-tight">
            School Directory
          </h1>
          <p className="text-xs text-[#5A6F68] mt-0.5">
            Find schools in your cluster, track visits, and plan developmental support.
          </p>
        </div>

        <button
          onClick={() => navigate('/app/plan-visit')}
          className="bg-[#176B5B] hover:bg-[#125447] text-white font-bold py-2.5 px-4 rounded-xl text-xs flex items-center gap-2 self-start sm:self-auto shadow-xs transition-colors"
        >
          <PlusCircle className="w-4 h-4 text-[#F4B942]" />
          <span>Plan a School Visit</span>
        </button>
      </div>

      {/* Filter toolbar */}
      <div className="card-base p-3 bg-white flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-[#7B928A] absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by school name, UDISE code, or village..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs bg-[#F7F9F8] border border-[#E2ECE8] rounded-xl focus:bg-white focus:border-[#176B5B]"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto text-xs font-semibold">
          <button
            onClick={() => setFilterType('all')}
            className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-colors ${
              filterType === 'all'
                ? 'bg-[#176B5B] text-white'
                : 'bg-[#F0F4F2] text-[#43544E] hover:bg-[#E2ECE8]'
            }`}
          >
            All schools ({schools.length})
          </button>
          <button
            onClick={() => setFilterType('upcoming')}
            className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-colors ${
              filterType === 'upcoming'
                ? 'bg-[#176B5B] text-white'
                : 'bg-[#F0F4F2] text-[#43544E] hover:bg-[#E2ECE8]'
            }`}
          >
            Upcoming visits (4)
          </button>
          <button
            onClick={() => setFilterType('pendingFollowup')}
            className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-colors ${
              filterType === 'pendingFollowup'
                ? 'bg-[#176B5B] text-white'
                : 'bg-[#F0F4F2] text-[#43544E] hover:bg-[#E2ECE8]'
            }`}
          >
            Pending follow-ups (2)
          </button>
          <button
            onClick={() => setFilterType('highNeed')}
            className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-colors ${
              filterType === 'highNeed'
                ? 'bg-[#176B5B] text-white'
                : 'bg-[#F0F4F2] text-[#43544E] hover:bg-[#E2ECE8]'
            }`}
          >
            High need (3)
          </button>
        </div>
      </div>

      {/* Main 2-column layout matching Figma Screen 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: School Cards */}
        <div className="lg:col-span-2 space-y-4">
          {filteredSchools.map((school) => {
            const pendingPlans = actionPlans.filter(
              p => p.schoolId === school.id && (p.status === 'In Progress' || p.status === 'Needs Further Support')
            );

            return (
              <div
                key={school.id}
                className="card-base p-5 bg-white hover:border-[#AFDCD1] transition-all space-y-3"
              >
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                  <div className="space-y-1">
                    <h3 className="font-bold text-base text-[#25332F]">
                      {school.name}
                    </h3>
                    <p className="text-[11px] text-[#7B928A] font-medium">
                      {school.code} • {school.location}
                    </p>
                  </div>

                  <button
                    onClick={() => navigate(`/app/schools/${school.id}`)}
                    className="px-3.5 py-1.5 bg-[#E6F2EF] hover:bg-[#AFDCD1]/40 text-[#176B5B] text-xs font-bold rounded-lg flex items-center gap-1 self-start sm:self-auto transition-colors"
                  >
                    <span>View school</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Visit summary strip */}
                <div className="grid grid-cols-2 gap-3 p-2.5 rounded-lg bg-[#F7F9F8] border border-[#E2ECE8] text-xs">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-[#7B928A] block">Last visit</span>
                    <span className="font-semibold text-[#25332F]">
                      {school.lastVisitDate ? `${school.lastVisitDate} (Grade 3)` : 'None recorded'}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold text-[#7B928A] block">Next planned visit</span>
                    <span className="font-bold text-[#176B5B]">
                      {school.nextVisitDate ? `${school.nextVisitDate} • 10:00 AM` : 'Not scheduled'}
                    </span>
                  </div>
                </div>

                {/* Support needs tags */}
                <div className="flex flex-wrap items-center gap-1.5 pt-1">
                  <span className="text-[10px] font-bold text-[#7B928A] uppercase mr-1">Focus:</span>
                  {school.supportNeeds.map((need, idx) => (
                    <span
                      key={idx}
                      className="text-[11px] px-2 py-0.5 rounded-md bg-[#F0F8F6] text-[#176B5B] border border-[#AFDCD1]/60 font-medium"
                    >
                      {need}
                    </span>
                  ))}
                </div>

                {pendingPlans.length > 0 && (
                  <div className="pt-2 border-t border-[#F0F4F2] flex items-center gap-1.5 text-xs text-amber-800">
                    <AlertCircle className="w-3.5 h-3.5 text-amber-600" />
                    <span>{pendingPlans.length} active teacher action plan pending follow-up review</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Right 1 Col: Cluster Summary & Resources matching Figma */}
        <div className="space-y-5">
          {/* Your assigned cluster */}
          <div className="card-base p-5 bg-white space-y-3">
            <h3 className="font-bold text-sm text-[#25332F] pb-2 border-b border-[#E2ECE8]">
              Your assigned cluster
            </h3>
            <div>
              <h4 className="font-extrabold text-base text-[#176B5B]">Raipur Rural</h4>
              <p className="text-xs text-[#5A6F68]">Block: Raipur • District: Raipur (Chhattisgarh)</p>
            </div>
            <div className="p-3 bg-[#F0F8F6] rounded-xl text-xs space-y-1">
              <p className="font-bold text-[#25332F]">6 primary schools • 25 teachers</p>
              <p className="text-[11px] text-[#5A6F68]">Cluster coverage: 75% visits completed this month</p>
            </div>
          </div>

          {/* Support summary */}
          <div className="card-base p-5 bg-white space-y-3">
            <h3 className="font-bold text-sm text-[#25332F] pb-2 border-b border-[#E2ECE8]">
              Support summary
            </h3>
            <ul className="space-y-2 text-xs text-[#25332F]">
              <li className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#176B5B]"></span>
                <span><strong>5 schools</strong> with active action plans</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#D97706]"></span>
                <span><strong>1 school</strong> overdue for follow-up</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-blue-600"></span>
                <span><strong>2 schools</strong> requesting demonstration</span>
              </li>
            </ul>
          </div>

          {/* Quick resources */}
          <div className="card-base p-5 bg-white space-y-3">
            <h3 className="font-bold text-sm text-[#25332F] pb-2 border-b border-[#E2ECE8]">
              Quick resources
            </h3>
            <div className="space-y-2 text-xs">
              <a
                href="#rubric"
                onClick={(e) => { e.preventDefault(); navigate('/app/observation'); }}
                className="flex items-center justify-between p-2 rounded-lg bg-[#F7F9F8] hover:bg-[#E6F2EF] text-[#25332F] hover:text-[#176B5B] transition-colors"
              >
                <span className="flex items-center gap-2">
                  <BookOpen className="w-3.5 h-3.5 text-[#176B5B]" />
                  <span>Observation Rubric & Indicators</span>
                </span>
                <ChevronRight className="w-3.5 h-3.5" />
              </a>

              <a
                href="#guide"
                onClick={(e) => { e.preventDefault(); navigate('/app/feedback-plan'); }}
                className="flex items-center justify-between p-2 rounded-lg bg-[#F7F9F8] hover:bg-[#E6F2EF] text-[#25332F] hover:text-[#176B5B] transition-colors"
              >
                <span className="flex items-center gap-2">
                  <Sparkles className="w-3.5 h-3.5 text-[#176B5B]" />
                  <span>FLN Demonstration Library</span>
                </span>
                <ChevronRight className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
