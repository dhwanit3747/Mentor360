import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { School, Visit } from '../types';
import { getAllSchools, getAllVisits, saveVisit, deleteVisit } from '../services/database';
import { calculatePriorityScore } from '../utils/priorityScoring';
import { PriorityBadge } from '../components/common/PriorityBadge';
import {
  CalendarPlus,
  Clock,
  Building2,
  Sliders,
  CheckCircle2,
  Trash2,
  AlertCircle,
  HelpCircle,
  ArrowRight,
  Info,
  CheckSquare,
  Square
} from 'lucide-react';

export const VisitPlanningPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const preselectedSchoolId = (location.state as any)?.preselectedSchoolId || '';

  const [schools, setSchools] = useState<School[]>([]);
  const [existingVisits, setExistingVisits] = useState<Visit[]>([]);
  const [loading, setLoading] = useState(true);

  // Form state matching Figma Screen 4
  const [selectedSchoolId, setSelectedSchoolId] = useState(preselectedSchoolId);
  const [scheduledDate, setScheduledDate] = useState(() => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  });
  const [scheduledTime, setScheduledTime] = useState('10:00 - 11:30 AM');
  const [visitPurpose, setVisitPurpose] = useState('Follow-up on agreed action plan');
  const [targetGrade, setTargetGrade] = useState('Grade 3');
  const [targetSubject, setTargetSubject] = useState('Foundational Literacy (Hindi)');
  const [teacherName, setTeacherName] = useState('Smt. Radhika Verma');
  const [focusArea, setFocusArea] = useState('Reading fluency & guided partner reading');
  const [notes, setNotes] = useState('Bring graded readers and review previous observation notes.');

  // Priority scoring parameters (0-2)
  const [urgency, setUrgency] = useState<number>(2);
  const [needSeverity, setNeedSeverity] = useState<number>(1);
  const [followUpImportance, setFollowUpImportance] = useState<number>(2);
  const [overdueLevel, setOverdueLevel] = useState<number>(1);

  // Manual Override state
  const [enableOverride, setEnableOverride] = useState(false);
  const [overrideScore, setOverrideScore] = useState<number>(16);
  const [overrideReason, setOverrideReason] = useState('');

  // Checklist state
  const [checklist, setChecklist] = useState({
    readers: true,
    reviewNotes: true,
    coordinateHT: false,
    slateChecks: false
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    if (preselectedSchoolId) {
      setSelectedSchoolId(preselectedSchoolId);
    }
  }, [preselectedSchoolId]);

  const loadData = async () => {
    try {
      setLoading(true);
      const [sData, vData] = await Promise.all([
        getAllSchools(),
        getAllVisits()
      ]);
      setSchools(sData);
      setExistingVisits(vData);

      if (!selectedSchoolId && sData.length > 0) {
        setSelectedSchoolId(sData[0].id);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const priorityBreakdown = calculatePriorityScore(
    urgency,
    needSeverity,
    followUpImportance,
    overdueLevel
  );

  const selectedSchool = schools.find(s => s.id === selectedSchoolId);

  const validate = () => {
    const newErrors: { [key: string]: string } = {};
    if (!selectedSchoolId) newErrors.school = 'Please select a school';
    if (!scheduledDate) newErrors.date = 'Please select a date';
    if (enableOverride && !overrideReason.trim()) {
      newErrors.overrideReason = 'Please explain the reason for the manual priority override';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!validate()) return;

    const newVisit: Visit = {
      id: `visit-${Date.now()}`,
      schoolId: selectedSchoolId,
      schoolName: selectedSchool?.name || 'School',
      scheduledDate,
      scheduledTime,
      purpose: `${visitPurpose}: ${focusArea} (${targetGrade} ${targetSubject})`,
      status: 'Scheduled',
      focusArea,
      notes,
      urgency,
      needSeverity,
      followUpImportance,
      overdueLevel,
      priorityScore: priorityBreakdown.score,
      priorityReason: priorityBreakdown.primaryReason,
      mentorPriorityOverride: enableOverride ? overrideScore : null,
      mentorOverrideReason: enableOverride ? overrideReason : null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    try {
      await saveVisit(newVisit);
      setSuccessMessage(`Visit planned for ${selectedSchool?.name}! Priority: ${enableOverride ? overrideScore : priorityBreakdown.score}/20.`);
      const updatedVisits = await getAllVisits();
      setExistingVisits(updatedVisits);
      setTimeout(() => setSuccessMessage(null), 4000);
    } catch (err) {
      console.error(err);
    }
  };

  const toggleCheck = (key: keyof typeof checklist) => {
    setChecklist(prev => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="space-y-6">
      {/* Header matching Figma Screen 4 */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-[#25332F] tracking-tight">
            Plan a school visit
          </h1>
          <p className="text-xs text-[#5A6F68] mt-0.5">
            Schedule a targeted mentoring visit with transparent priority scoring.
          </p>
        </div>

        <button
          onClick={handleSubmit}
          className="bg-[#176B5B] hover:bg-[#125447] text-white font-bold py-2.5 px-4 rounded-xl text-xs flex items-center gap-1.5 self-start sm:self-auto shadow-xs transition-colors"
        >
          <CalendarPlus className="w-4 h-4 text-[#F4B942]" />
          <span>Save & Add to Plan</span>
        </button>
      </div>

      {successMessage && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold rounded-xl flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
            <span>{successMessage}</span>
          </div>
          <button
            onClick={() => navigate('/app')}
            className="px-3 py-1 bg-[#176B5B] hover:bg-[#125447] text-white rounded-lg text-xs font-bold transition-colors cursor-pointer flex-shrink-0"
          >
            View in Dashboard →
          </button>
        </div>
      )}

      {/* Main 2-column Grid matching Screen 4 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Form & Priority Engine */}
        <div className="lg:col-span-2 card-base p-6 bg-white space-y-5">
          <h2 className="text-base font-bold text-[#25332F] pb-3 border-b border-[#E2ECE8]">
            Visit Details & Objectives
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* School selector */}
            <div>
              <label className="block text-xs font-bold text-[#25332F] uppercase mb-1">
                Select school <span className="text-red-500">*</span>
              </label>
              <select
                value={selectedSchoolId}
                onChange={(e) => setSelectedSchoolId(e.target.value)}
                className="w-full p-2.5 bg-[#F7F9F8] border border-[#E2ECE8] rounded-xl text-sm focus:bg-white focus:border-[#176B5B]"
              >
                {schools.map(s => (
                  <option key={s.id} value={s.id}>
                    {s.name} ({s.code})
                  </option>
                ))}
              </select>
            </div>

            {/* Date & Time */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-[#25332F] uppercase mb-1">
                  Visit date <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  value={scheduledDate}
                  onChange={(e) => setScheduledDate(e.target.value)}
                  className="w-full p-2.5 bg-[#F7F9F8] border border-[#E2ECE8] rounded-xl text-sm focus:bg-white focus:border-[#176B5B]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#25332F] uppercase mb-1">
                  Planned time <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={scheduledTime}
                  onChange={(e) => setScheduledTime(e.target.value)}
                  placeholder="e.g. 10:00 - 11:30 AM"
                  className="w-full p-2.5 bg-[#F7F9F8] border border-[#E2ECE8] rounded-xl text-sm focus:bg-white focus:border-[#176B5B]"
                />
              </div>
            </div>

            {/* Visit Purpose */}
            <div>
              <label className="block text-xs font-bold text-[#25332F] uppercase mb-1">
                Visit purpose
              </label>
              <select
                value={visitPurpose}
                onChange={(e) => setVisitPurpose(e.target.value)}
                className="w-full p-2.5 bg-[#F7F9F8] border border-[#E2ECE8] rounded-xl text-sm focus:bg-white focus:border-[#176B5B]"
              >
                <option value="Follow-up on agreed action plan">Follow-up on agreed action plan</option>
                <option value="Classroom observation">Classroom observation</option>
                <option value="Demonstration lesson">Demonstration lesson & co-teaching</option>
                <option value="Routine cluster support">Routine cluster support</option>
              </select>
            </div>

            {/* Target Grade & Subject */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-[#25332F] uppercase mb-1">
                  Target grade
                </label>
                <select
                  value={targetGrade}
                  onChange={(e) => setTargetGrade(e.target.value)}
                  className="w-full p-2.5 bg-[#F7F9F8] border border-[#E2ECE8] rounded-xl text-sm focus:bg-white focus:border-[#176B5B]"
                >
                  <option value="Grade 1">Grade 1 (कक्षा 1)</option>
                  <option value="Grade 2">Grade 2 (कक्षा 2)</option>
                  <option value="Grade 3">Grade 3 (कक्षा 3)</option>
                  <option value="Grade 4">Grade 4 (कक्षा 4)</option>
                  <option value="Grade 5">Grade 5 (कक्षा 5)</option>
                  <option value="Multigrade 1-2">Multigrade (कक्षा 1-2 संयुक्त)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#25332F] uppercase mb-1">
                  Target subject
                </label>
                <select
                  value={targetSubject}
                  onChange={(e) => setTargetSubject(e.target.value)}
                  className="w-full p-2.5 bg-[#F7F9F8] border border-[#E2ECE8] rounded-xl text-sm focus:bg-white focus:border-[#176B5B]"
                >
                  <option value="Foundational Literacy (Hindi)">Foundational Literacy (Hindi)</option>
                  <option value="Foundational Numeracy (Math)">Foundational Numeracy (Math)</option>
                  <option value="Composite Primary">Composite Primary</option>
                </select>
              </div>
            </div>

            {/* Specific focus area & teacher */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-[#25332F] uppercase mb-1">
                  Teacher to support
                </label>
                <input
                  type="text"
                  value={teacherName}
                  onChange={(e) => setTeacherName(e.target.value)}
                  className="w-full p-2.5 bg-[#F7F9F8] border border-[#E2ECE8] rounded-xl text-sm focus:bg-white focus:border-[#176B5B]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#25332F] uppercase mb-1">
                  Specific focus area
                </label>
                <input
                  type="text"
                  value={focusArea}
                  onChange={(e) => setFocusArea(e.target.value)}
                  className="w-full p-2.5 bg-[#F7F9F8] border border-[#E2ECE8] rounded-xl text-sm focus:bg-white focus:border-[#176B5B]"
                />
              </div>
            </div>

            {/* Priority Recommendation Engine matching Screenshot */}
            <div className="pt-3 border-t border-[#E2ECE8] space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#25332F] uppercase flex items-center gap-1.5">
                  <Sliders className="w-4 h-4 text-[#176B5B]" />
                  Priority recommendation engine
                </span>
                <span className="text-[11px] font-bold text-[#176B5B] bg-[#E6F2EF] px-2 py-0.5 rounded">
                  P = 4U + 3N + 2F + D
                </span>
              </div>

              {/* Amber Alert Box */}
              <div className="p-3.5 bg-[#FEF9E6] border border-[#FDE68A] rounded-xl space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-extrabold text-[#92400E]">
                    Suggested priority: High (Score: {priorityBreakdown.score}/20)
                  </span>
                  <span className="text-[10px] bg-[#F4B942] text-[#25332F] font-bold px-2 py-0.5 rounded">
                    Rank #1
                  </span>
                </div>
                <p className="text-xs text-[#92400E] leading-relaxed">
                  {priorityBreakdown.primaryReason}
                </p>
              </div>

              {/* Sliders row */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs bg-[#F7F9F8] p-3 rounded-xl border border-[#E2ECE8]">
                <div>
                  <span className="font-bold text-[#25332F] block">Urgency: {urgency}/2</span>
                  <input
                    type="range"
                    min="0"
                    max="2"
                    value={urgency}
                    onChange={(e) => setUrgency(Number(e.target.value))}
                    className="w-full accent-[#176B5B]"
                  />
                </div>
                <div>
                  <span className="font-bold text-[#25332F] block">Need: {needSeverity}/2</span>
                  <input
                    type="range"
                    min="0"
                    max="2"
                    value={needSeverity}
                    onChange={(e) => setNeedSeverity(Number(e.target.value))}
                    className="w-full accent-[#176B5B]"
                  />
                </div>
                <div>
                  <span className="font-bold text-[#25332F] block">Follow-up: {followUpImportance}/2</span>
                  <input
                    type="range"
                    min="0"
                    max="2"
                    value={followUpImportance}
                    onChange={(e) => setFollowUpImportance(Number(e.target.value))}
                    className="w-full accent-[#176B5B]"
                  />
                </div>
                <div>
                  <span className="font-bold text-[#25332F] block">Overdue: {overdueLevel}/2</span>
                  <input
                    type="range"
                    min="0"
                    max="2"
                    value={overdueLevel}
                    onChange={(e) => setOverdueLevel(Number(e.target.value))}
                    className="w-full accent-[#176B5B]"
                  />
                </div>
              </div>

              {/* Override Checkbox */}
              <div className="pt-1">
                <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-[#25332F]">
                  <input
                    type="checkbox"
                    checked={enableOverride}
                    onChange={(e) => setEnableOverride(e.target.checked)}
                    className="rounded text-[#176B5B]"
                  />
                  <span>Override suggested priority recommendation</span>
                </label>

                {enableOverride && (
                  <div className="mt-2 p-3 bg-white border border-[#AFDCD1] rounded-xl space-y-2">
                    <div className="flex items-center gap-2 text-xs">
                      <span>Custom Score (0-20):</span>
                      <input
                        type="number"
                        min="0"
                        max="20"
                        value={overrideScore}
                        onChange={(e) => setOverrideScore(Number(e.target.value))}
                        className="w-16 p-1 border rounded text-center font-bold"
                      />
                    </div>
                    <input
                      type="text"
                      placeholder="Reason for manual priority adjustment..."
                      value={overrideReason}
                      onChange={(e) => setOverrideReason(e.target.value)}
                      className="w-full p-2 border rounded-lg text-xs"
                    />
                  </div>
                )}
              </div>
            </div>
          </form>
        </div>

        {/* Right 1 Col: Visit Context Preview & Checklist */}
        <div className="space-y-5">
          {/* Visit Context Preview matching Figma */}
          <div className="card-base p-5 bg-white space-y-3">
            <h3 className="font-bold text-sm text-[#25332F] pb-2 border-b border-[#E2ECE8]">
              Visit context preview
            </h3>

            <div className="space-y-2 text-xs">
              <div>
                <span className="text-[#7B928A] block text-[10px] uppercase font-bold">Selected school</span>
                <span className="font-bold text-sm text-[#25332F]">{selectedSchool?.name}</span>
              </div>
              <div>
                <span className="text-[#7B928A] block text-[10px] uppercase font-bold">Last visit</span>
                <span className="text-[#25332F]">{selectedSchool?.lastVisitDate} (Grade 3 Hindi)</span>
              </div>
              <div>
                <span className="text-[#7B928A] block text-[10px] uppercase font-bold">Pending action plan</span>
                <span className="text-[#176B5B] font-semibold">Guided reading pairs trial in Grade 3</span>
              </div>
              <div>
                <span className="text-[#7B928A] block text-[10px] uppercase font-bold">Teacher</span>
                <span className="text-[#25332F]">{teacherName}</span>
              </div>
            </div>
          </div>

          {/* Today's preparation checklist matching Screenshot */}
          <div className="card-base p-5 bg-white space-y-3">
            <h3 className="font-bold text-sm text-[#25332F] pb-2 border-b border-[#E2ECE8]">
              Today's preparation checklist
            </h3>

            <div className="space-y-2 text-xs">
              <label
                onClick={() => toggleCheck('readers')}
                className="flex items-start gap-2 cursor-pointer"
              >
                {checklist.readers ? (
                  <CheckSquare className="w-4 h-4 text-[#176B5B] flex-shrink-0 mt-0.5" />
                ) : (
                  <Square className="w-4 h-4 text-gray-400 flex-shrink-0 mt-0.5" />
                )}
                <span className={checklist.readers ? 'line-through text-gray-400' : 'text-[#25332F]'}>
                  Carry Ganit Mala & graded readers
                </span>
              </label>

              <label
                onClick={() => toggleCheck('reviewNotes')}
                className="flex items-start gap-2 cursor-pointer"
              >
                {checklist.reviewNotes ? (
                  <CheckSquare className="w-4 h-4 text-[#176B5B] flex-shrink-0 mt-0.5" />
                ) : (
                  <Square className="w-4 h-4 text-gray-400 flex-shrink-0 mt-0.5" />
                )}
                <span className={checklist.reviewNotes ? 'line-through text-gray-400' : 'text-[#25332F]'}>
                  Review notes from previous visit (4 Oct)
                </span>
              </label>

              <label
                onClick={() => toggleCheck('coordinateHT')}
                className="flex items-start gap-2 cursor-pointer"
              >
                {checklist.coordinateHT ? (
                  <CheckSquare className="w-4 h-4 text-[#176B5B] flex-shrink-0 mt-0.5" />
                ) : (
                  <Square className="w-4 h-4 text-gray-400 flex-shrink-0 mt-0.5" />
                )}
                <span className={checklist.coordinateHT ? 'line-through text-gray-400' : 'text-[#25332F]'}>
                  Coordinate with Head Teacher on arrival
                </span>
              </label>

              <label
                onClick={() => toggleCheck('slateChecks')}
                className="flex items-start gap-2 cursor-pointer"
              >
                {checklist.slateChecks ? (
                  <CheckSquare className="w-4 h-4 text-[#176B5B] flex-shrink-0 mt-0.5" />
                ) : (
                  <Square className="w-4 h-4 text-gray-400 flex-shrink-0 mt-0.5" />
                )}
                <span className={checklist.slateChecks ? 'line-through text-gray-400' : 'text-[#25332F]'}>
                  Prepare student slate check-in questions
                </span>
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
