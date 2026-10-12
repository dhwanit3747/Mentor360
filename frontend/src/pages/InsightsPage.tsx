import React, { useState, useEffect } from 'react';
import {
  getAllVisits,
  getAllActionPlans,
  getAllObservations,
  getAllSchools
} from '../services/database';
import { Visit, ActionPlan, Observation, School } from '../types';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  CartesianGrid
} from 'recharts';
import {
  BarChart3,
  Download,
  Info,
  Calendar,
  Sparkles,
  BookOpen
} from 'lucide-react';

export const InsightsPage: React.FC = () => {
  const [visits, setVisits] = useState<Visit[]>([]);
  const [actionPlans, setActionPlans] = useState<ActionPlan[]>([]);
  const [observations, setObservations] = useState<Observation[]>([]);
  const [schools, setSchools] = useState<School[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters matching Figma Screen 8
  const [selectedSchoolFilter, setSelectedSchoolFilter] = useState('all');
  const [selectedPeriod, setSelectedPeriod] = useState('month');
  const [selectedCategory, setSelectedCategory] = useState('all');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [v, a, o, s] = await Promise.all([
        getAllVisits(),
        getAllActionPlans(),
        getAllObservations(),
        getAllSchools()
      ]);
      setVisits(v);
      setActionPlans(a);
      setObservations(o);
      setSchools(s);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Horizontal bar chart data for Common Mentoring Needs matching Screen 8
  const commonNeedsData = [
    { practice: 'Active student participation', count: 8 },
    { practice: 'Use of TLM / manipulatives', count: 6 },
    { practice: 'Formative assessment & checks', count: 5 },
    { practice: 'Reading fluency practice', count: 4 },
    { practice: 'Inclusive engagement', count: 3 },
  ];

  // Trend line chart data matching Screen 8
  const trendData = [
    { week: 'W1 (1-7 Oct)', visits: 4, followups: 2 },
    { week: 'W2 (8-14 Oct)', visits: 5, followups: 4 },
    { week: 'W3 (15-21 Oct)', visits: 4, followups: 3 },
    { week: 'W4 (22-28 Oct)', visits: 3, followups: 2 },
  ];

  // Changes in observed practice table matching Screen 8
  const practiceChanges = [
    { dimension: 'Lesson objective communicated', baseline: '70%', current: '85%', status: '+15%' },
    { dimension: 'Teaching strategy & progressive modeling', baseline: '50%', current: '65%', status: '+15%' },
    { dimension: 'Active student participation (non-choral)', baseline: '38%', current: '58%', status: '+20%' },
    { dimension: 'Use of TLM / reading manipulatives', baseline: '55%', current: '72%', status: '+17%' },
    { dimension: 'Formative checks during lesson (slates)', baseline: '35%', current: '52%', status: '+17%' },
  ];

  // Dynamic computations from live DB
  const filteredVisits = selectedSchoolFilter === 'all' ? visits : visits.filter(v => v.schoolId === selectedSchoolFilter);
  const filteredPlans = selectedSchoolFilter === 'all' ? actionPlans : actionPlans.filter(p => p.schoolId === selectedSchoolFilter);
  const completedVisitsCount = filteredVisits.filter(v => v.status === 'Completed').length;
  const activePlansCount = filteredPlans.filter(p => p.status === 'In Progress' || p.status === 'Needs Further Support').length;
  const triedCount = filteredPlans.filter(p => p.triedActivity === true).length;
  const adoptionPercent = filteredPlans.length > 0 ? Math.round((triedCount / filteredPlans.length) * 100) : 71;
  const avgVisits = schools.length > 0 ? (filteredVisits.length / schools.length).toFixed(1) : '2.0';

  const handleExportSummary = () => {
    const csvRows = [
      ['School', 'Date', 'Purpose', 'Focus Area', 'Status', 'Priority Score'],
      ...filteredVisits.map(v => [v.schoolName || '', v.scheduledDate || '', v.purpose || '', v.focusArea || '', v.status || '', String(v.priorityScore || '')]),
      [],
      ['Action Plan Teacher', 'School', 'Improvement Area', 'Agreed Action', 'Follow-up Date', 'Status', 'Tried Activity'],
      ...filteredPlans.map(a => [a.teacherName || '', a.schoolId || '', a.improvementArea || '', a.agreedAction || '', a.followUpDate || '', a.status || '', a.triedActivity ? 'Yes' : 'No'])
    ];
    const csvContent = "data:text/csv;charset=utf-8," + csvRows.map(e => e.map(cell => `"${String(cell || '').replace(/"/g, '""')}"`).join(",")).join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `Mentor360_Cluster_Insights_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* Top Header matching Figma Screen 8 */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-[#25332F] tracking-tight">
            Insights & Reports
          </h1>
          <p className="text-xs text-[#5A6F68] mt-0.5">
            Cluster-level data from mentoring visits and classroom observations in Raipur Rural.
          </p>
        </div>

        <button
          onClick={handleExportSummary}
          className="bg-white hover:bg-[#F7F9F8] border border-[#E2ECE8] text-[#25332F] font-bold py-2 px-4 rounded-xl text-xs flex items-center gap-1.5 self-start sm:self-auto shadow-xs transition-colors cursor-pointer"
        >
          <Download className="w-4 h-4 text-[#176B5B]" />
          <span>Export Summary (CSV)</span>
        </button>
      </div>

      {/* Filter toolbar matching Figma Screen 8 */}
      <div className="card-base p-3 bg-white flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-1.5">
            <span className="font-bold text-[#7B928A] uppercase text-[10px]">School:</span>
            <select
              value={selectedSchoolFilter}
              onChange={(e) => setSelectedSchoolFilter(e.target.value)}
              className="p-1.5 bg-[#F7F9F8] border border-[#E2ECE8] rounded-lg font-medium text-xs"
            >
              <option value="all">All 6 cluster schools</option>
              {schools.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
            </select>
          </div>

          <div className="flex items-center gap-1.5">
            <span className="font-bold text-[#7B928A] uppercase text-[10px]">Time period:</span>
            <select
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value)}
              className="p-1.5 bg-[#F7F9F8] border border-[#E2ECE8] rounded-lg font-medium text-xs"
            >
              <option value="month">This month (Oct 2026)</option>
              <option value="term">Term 1 (Aug - Oct 2026)</option>
            </select>
          </div>

          <div className="flex items-center gap-1.5">
            <span className="font-bold text-[#7B928A] uppercase text-[10px]">Teaching Practice:</span>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="p-1.5 bg-[#F7F9F8] border border-[#E2ECE8] rounded-lg font-medium text-xs"
            >
              <option value="all">All categories</option>
              <option value="literacy">Foundational Literacy</option>
              <option value="numeracy">Foundational Numeracy</option>
            </select>
          </div>
        </div>

        <span className="text-[11px] text-[#5A6F68] font-medium">
          Cluster: <strong>Raipur Rural</strong>
        </span>
      </div>

      {/* KPI Row matching Figma Screen 8 */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="card-base p-4 bg-white space-y-1">
          <span className="text-[10px] font-bold uppercase text-[#7B928A]">Visits completed</span>
          <div className="text-2xl font-extrabold text-[#25332F]">{completedVisitsCount} / 16</div>
          <p className="text-[11px] text-[#176B5B] font-semibold">{Math.round((completedVisitsCount / 16) * 100)}% target achieved</p>
        </div>

        <div className="card-base p-4 bg-white space-y-1">
          <span className="text-[10px] font-bold uppercase text-[#7B928A]">Average visits/school</span>
          <div className="text-2xl font-extrabold text-[#25332F]">{avgVisits}</div>
          <p className="text-[11px] text-[#5A6F68]">Across {schools.length || 6} primary schools</p>
        </div>

        <div className="card-base p-4 bg-white space-y-1">
          <span className="text-[10px] font-bold uppercase text-[#7B928A]">Active action plans</span>
          <div className="text-2xl font-extrabold text-[#D97706]">{activePlansCount}</div>
          <p className="text-[11px] text-amber-700 font-semibold">Currently being practiced</p>
        </div>

        <div className="card-base p-4 bg-white space-y-1">
          <span className="text-[10px] font-bold uppercase text-[#7B928A]">Adoption rate</span>
          <div className="text-2xl font-extrabold text-emerald-700">{adoptionPercent}%</div>
          <p className="text-[11px] text-emerald-700 font-semibold">{triedCount} of {filteredPlans.length || 1} teachers attempted</p>
        </div>
      </div>

      {/* Charts Grid matching Figma Screen 8 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Chart: Common mentoring needs */}
        <div className="card-base p-5 bg-white space-y-3">
          <div className="border-b border-[#E2ECE8] pb-2">
            <h3 className="font-bold text-sm text-[#25332F]">
              Common mentoring needs
            </h3>
            <p className="text-[11px] text-[#5A6F68]">
              Frequency of identified pedagogical focus areas in visits
            </p>
          </div>

          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={commonNeedsData}
                layout="vertical"
                margin={{ top: 10, right: 20, left: 20, bottom: 0 }}
              >
                <XAxis type="number" tick={{ fontSize: 10, fill: '#5A6F68' }} allowDecimals={false} />
                <YAxis dataKey="practice" type="category" tick={{ fontSize: 10, fill: '#25332F' }} width={130} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#FFFFFF',
                    borderColor: '#E2ECE8',
                    borderRadius: '8px',
                    fontSize: '12px'
                  }}
                />
                <Bar dataKey="count" fill="#176B5B" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Right Chart: Visits and follow-ups trend */}
        <div className="card-base p-5 bg-white space-y-3">
          <div className="border-b border-[#E2ECE8] pb-2">
            <h3 className="font-bold text-sm text-[#25332F]">
              Visits and follow-ups trend
            </h3>
            <p className="text-[11px] text-[#5A6F68]">
              Weekly cadence of planned visits and follow-up checks
            </p>
          </div>

          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={trendData} margin={{ top: 15, right: 20, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#F0F4F2" />
                <XAxis dataKey="week" tick={{ fontSize: 10, fill: '#5A6F68' }} />
                <YAxis tick={{ fontSize: 10, fill: '#5A6F68' }} allowDecimals={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#FFFFFF',
                    borderColor: '#E2ECE8',
                    borderRadius: '8px',
                    fontSize: '12px'
                  }}
                />
                <Line type="monotone" dataKey="visits" stroke="#176B5B" strokeWidth={2} name="Visits" dot={{ r: 4 }} />
                <Line type="monotone" dataKey="followups" stroke="#F4B942" strokeWidth={2} name="Follow-ups" dot={{ r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="flex items-center justify-center gap-6 text-xs text-[#5A6F68]">
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-0.5 bg-[#176B5B]"></span> Visits
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-0.5 bg-[#F4B942]"></span> Follow-ups
            </span>
          </div>
        </div>
      </div>

      {/* Bottom Section: Changes in Observed Practice & What Data Tells You */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Table (2 cols) */}
        <div className="lg:col-span-2 card-base p-5 bg-white space-y-3">
          <h3 className="font-bold text-sm text-[#25332F] pb-2 border-b border-[#E2ECE8]">
            Changes in observed practice across cluster
          </h3>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead>
                <tr className="border-b border-[#E2ECE8] text-[#7B928A] text-[10px] uppercase font-bold">
                  <th className="py-2">Pedagogical Dimension</th>
                  <th className="py-2 text-center">Baseline Rate</th>
                  <th className="py-2 text-center">Current Rate</th>
                  <th className="py-2 text-right">Progression</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F0F4F2]">
                {practiceChanges.map((row, idx) => (
                  <tr key={idx} className="hover:bg-[#F7F9F8]">
                    <td className="py-2.5 font-medium text-[#25332F]">{row.dimension}</td>
                    <td className="py-2.5 text-center text-[#5A6F68]">{row.baseline}</td>
                    <td className="py-2.5 text-center font-bold text-[#176B5B]">{row.current}</td>
                    <td className="py-2.5 text-right font-extrabold text-emerald-700">{row.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* What the data tells you box matching Figma */}
        <div className="card-base p-5 bg-[#F0F8F6] border-[#AFDCD1] space-y-3">
          <h3 className="font-bold text-sm text-[#176B5B] flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[#176B5B]" />
            <span>What the data tells you</span>
          </h3>

          <div className="space-y-2 text-xs text-[#25332F] leading-relaxed">
            <p>
              <strong>Top Cluster Need:</strong> Student active participation and TLM usage continue to be the primary support requests from teachers in Raipur Rural.
            </p>
            <p>
              <strong>High Adoption:</strong> 71% of teachers attempted agreed action plans after a mentor demonstration, compared to only 30% when given verbal advice alone.
            </p>
            <p className="text-[11px] text-[#5A6F68] pt-1">
              Field Insight: Practical 10-minute co-teaching demonstrations yield the highest classroom adoption.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
