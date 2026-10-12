import React, { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import { MentorProfile } from '../types';
import {
  getMentorProfile,
  saveMentorProfile,
  getStorageSummary,
  resetDatabaseToSeed
} from '../services/database';
import {
  User,
  ShieldCheck,
  HardDrive,
  Globe,
  Bell,
  HelpCircle,
  RefreshCw,
  AlertTriangle,
  CheckCircle2,
  BookOpen,
  Info,
  Check
} from 'lucide-react';

export const ProfileSettingsPage: React.FC = () => {
  const { language } = useOutletContext<{ language: 'en' | 'hi' }>();

  const [profile, setProfile] = useState<MentorProfile | null>(null);
  const [storageInfo, setStorageInfo] = useState<{
    schoolsCount: number;
    visitsCount: number;
    observationsCount: number;
    actionPlansCount: number;
    isDeviceLocal: boolean;
    indexedDBName: string;
  } | null>(null);

  const [savedSuccess, setSavedSuccess] = useState(false);
  const [resetSuccess, setResetSuccess] = useState(false);
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [loading, setLoading] = useState(true);

  // Profile fields matching Screen 9
  const [name, setName] = useState('Ananya Sharma');
  const [designation, setDesignation] = useState('Cluster Academic Coordinator');
  const [cluster, setCluster] = useState('Raipur Rural Cluster (6 schools)');
  const [selectedLanguage, setSelectedLanguage] = useState<'en' | 'hi'>('en');
  const [reminders, setReminders] = useState(true);
  const [alerts, setAlerts] = useState(true);
  const [weeklySummary, setWeeklySummary] = useState(false);

  useEffect(() => {
    loadProfileAndStorage();
  }, []);

  const loadProfileAndStorage = async () => {
    try {
      setLoading(true);
      const [prof, st] = await Promise.all([
        getMentorProfile(),
        getStorageSummary()
      ]);
      setProfile(prof);
      setStorageInfo(st);

      if (prof) {
        setName(prof.name);
        setDesignation(prof.designation);
        setCluster(prof.cluster);
        setSelectedLanguage(prof.language);
        setReminders(prof.notificationsEnabled);
        setAlerts(prof.smsAlerts);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile) return;

    const updated: MentorProfile = {
      ...profile,
      name,
      designation,
      cluster,
      language: selectedLanguage,
      notificationsEnabled: reminders,
      smsAlerts: alerts
    };

    await saveMentorProfile(updated);
    setProfile(updated);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const handleResetData = async () => {
    await resetDatabaseToSeed();
    setShowResetConfirm(false);
    setResetSuccess(true);
    await loadProfileAndStorage();
    setTimeout(() => setResetSuccess(false), 4000);
  };

  if (loading || !profile) {
    return (
      <div className="py-24 text-center text-charcoal-500 text-sm">
        Loading mentor profile & settings...
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Top Header matching Figma Screen 9 */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-[#25332F] tracking-tight">
            Profile & Settings
          </h1>
          <p className="text-xs text-[#5A6F68] mt-0.5">
            Manage your cluster details, field preferences, and local device storage.
          </p>
        </div>

        <button
          onClick={handleSaveSettings}
          className="bg-[#176B5B] hover:bg-[#125447] text-white font-bold py-2.5 px-4 rounded-xl text-xs flex items-center gap-1.5 self-start sm:self-auto shadow-xs transition-colors"
        >
          <Check className="w-4 h-4 text-[#F4B942]" />
          <span>Save Preferences</span>
        </button>
      </div>

      {savedSuccess && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold rounded-xl flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>Profile preferences saved to local device!</span>
        </div>
      )}

      {resetSuccess && (
        <div className="p-3 bg-amber-50 border border-amber-200 text-amber-800 text-xs font-semibold rounded-xl flex items-center gap-2">
          <RefreshCw className="w-4 h-4 text-amber-600" />
          <span>Database reset to initial demo state with 6 schools and action plans.</span>
        </div>
      )}

      {/* Main 2-column Grid matching Screen 9 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Mentor Profile, Language, Notifications, Guidance */}
        <div className="lg:col-span-2 space-y-5">
          {/* Mentor Profile Card */}
          <div className="card-base p-6 bg-white space-y-5">
            <h2 className="text-base font-bold text-[#25332F] pb-3 border-b border-[#E2ECE8]">
              Mentor Profile
            </h2>

            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-full bg-[#176B5B] text-white flex items-center justify-center font-extrabold text-xl shadow-xs">
                AS
              </div>
              <div>
                <h3 className="font-extrabold text-base text-[#25332F]">{name}</h3>
                <p className="text-xs text-[#5A6F68]">{designation}</p>
                <span className="inline-block mt-1 text-[11px] font-bold text-[#176B5B] bg-[#E6F2EF] px-2 py-0.5 rounded">
                  Raipur Rural Cluster
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs pt-2">
              <div>
                <label className="block text-[#7B928A] uppercase font-bold text-[10px] mb-1">Full name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full p-2 bg-[#F7F9F8] border border-[#E2ECE8] rounded-xl font-medium focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-[#7B928A] uppercase font-bold text-[10px] mb-1">Official designation</label>
                <input
                  type="text"
                  value={designation}
                  onChange={(e) => setDesignation(e.target.value)}
                  className="w-full p-2 bg-[#F7F9F8] border border-[#E2ECE8] rounded-xl font-medium focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-[#7B928A] uppercase font-bold text-[10px] mb-1">Email address</label>
                <input
                  type="email"
                  value={profile.email}
                  disabled
                  className="w-full p-2 bg-gray-100 border border-[#E2ECE8] rounded-xl font-medium text-gray-500 cursor-not-allowed"
                />
              </div>

              <div>
                <label className="block text-[#7B928A] uppercase font-bold text-[10px] mb-1">Assigned cluster</label>
                <input
                  type="text"
                  value={cluster}
                  onChange={(e) => setCluster(e.target.value)}
                  className="w-full p-2 bg-[#F7F9F8] border border-[#E2ECE8] rounded-xl font-medium focus:bg-white"
                />
              </div>
            </div>
          </div>

          {/* Language Preference Card */}
          <div className="card-base p-6 bg-white space-y-3">
            <h3 className="font-bold text-sm text-[#25332F] pb-2 border-b border-[#E2ECE8]">
              Language Preference
            </h3>
            <p className="text-xs text-[#5A6F68]">
              Select interface language. Bilingual report generation is active for Hindi classroom terminology.
            </p>

            <div className="flex items-center gap-3 pt-1">
              <button
                type="button"
                onClick={() => setSelectedLanguage('en')}
                className={`py-2 px-4 rounded-xl text-xs font-bold border transition-colors ${
                  selectedLanguage === 'en'
                    ? 'bg-[#176B5B] text-white border-[#176B5B]'
                    : 'bg-[#F7F9F8] text-[#5A6F68] border-[#E2ECE8]'
                }`}
              >
                English
              </button>
              <button
                type="button"
                onClick={() => setSelectedLanguage('hi')}
                className={`py-2 px-4 rounded-xl text-xs font-bold border transition-colors ${
                  selectedLanguage === 'hi'
                    ? 'bg-[#176B5B] text-white border-[#176B5B]'
                    : 'bg-[#F7F9F8] text-[#5A6F68] border-[#E2ECE8]'
                }`}
              >
                हिंदी (Hindi)
              </button>
            </div>
          </div>

          {/* Notification Preferences Card */}
          <div className="card-base p-6 bg-white space-y-3">
            <h3 className="font-bold text-sm text-[#25332F] pb-2 border-b border-[#E2ECE8]">
              Notification Preferences
            </h3>

            <div className="space-y-3 text-xs">
              <label className="flex items-center justify-between p-2 rounded-xl bg-[#F7F9F8] border border-[#E2ECE8] cursor-pointer">
                <div>
                  <span className="font-bold text-[#25332F] block">Upcoming visit reminders</span>
                  <span className="text-[11px] text-[#5A6F68]">Alert 24 hours prior to scheduled school visits</span>
                </div>
                <input
                  type="checkbox"
                  checked={reminders}
                  onChange={(e) => setReminders(e.target.checked)}
                  className="w-4 h-4 rounded text-[#176B5B]"
                />
              </label>

              <label className="flex items-center justify-between p-2 rounded-xl bg-[#F7F9F8] border border-[#E2ECE8] cursor-pointer">
                <div>
                  <span className="font-bold text-[#25332F] block">Overdue follow-up alerts</span>
                  <span className="text-[11px] text-[#5A6F68]">Highlight action plans past agreed follow-up dates</span>
                </div>
                <input
                  type="checkbox"
                  checked={alerts}
                  onChange={(e) => setAlerts(e.target.checked)}
                  className="w-4 h-4 rounded text-[#176B5B]"
                />
              </label>

              <label className="flex items-center justify-between p-2 rounded-xl bg-[#F7F9F8] border border-[#E2ECE8] cursor-pointer">
                <div>
                  <span className="font-bold text-[#25332F] block">Weekly cluster summary report</span>
                  <span className="text-[11px] text-[#5A6F68]">Digest of visits completed and action plan statuses</span>
                </div>
                <input
                  type="checkbox"
                  checked={weeklySummary}
                  onChange={(e) => setWeeklySummary(e.target.checked)}
                  className="w-4 h-4 rounded text-[#176B5B]"
                />
              </label>
            </div>
          </div>

          {/* Classroom Observation Guidance FAQ */}
          <div className="card-base p-6 bg-white space-y-3">
            <h3 className="font-bold text-sm text-[#25332F] pb-2 border-b border-[#E2ECE8] flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-[#176B5B]" />
              <span>Observation & Mentoring Guidance</span>
            </h3>

            <div className="space-y-2 text-xs text-[#5A6F68] leading-relaxed">
              <p>
                <strong>Developmental Purpose:</strong> Mentor360 is built exclusively for formative support. It avoids performance scores or rankings that could induce teacher anxiety.
              </p>
              <p>
                <strong>Grounding in Evidence:</strong> Record factual counts (e.g. <em>"18 of 24 students had open textbooks"</em>) to co-plan practical 10-minute demonstrations.
              </p>
            </div>
          </div>
        </div>

        {/* Right 1 Col: Storage on this Device, Sync Status, About */}
        <div className="space-y-5">
          {/* Storage on this device matching Figma */}
          <div className="card-base p-5 bg-white space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-[#E2ECE8]">
              <h3 className="font-bold text-sm text-[#25332F]">
                Storage on this device
              </h3>
              <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                Offline active
              </span>
            </div>

            <p className="text-xs text-[#5A6F68] leading-relaxed">
              All records are stored locally in your browser via IndexedDB (<code>mentor360_db</code>). Works with zero internet connectivity in field schools.
            </p>

            <div className="grid grid-cols-2 gap-2 text-xs pt-1">
              <div className="p-2 bg-[#F7F9F8] rounded-lg border border-[#E2ECE8]">
                <span className="text-[#7B928A] text-[10px] uppercase font-bold block">Schools</span>
                <span className="text-sm font-extrabold text-[#25332F]">{storageInfo?.schoolsCount || 6}</span>
              </div>
              <div className="p-2 bg-[#F7F9F8] rounded-lg border border-[#E2ECE8]">
                <span className="text-[#7B928A] text-[10px] uppercase font-bold block">Visits</span>
                <span className="text-sm font-extrabold text-[#25332F]">{storageInfo?.visitsCount || 12}</span>
              </div>
              <div className="p-2 bg-[#F7F9F8] rounded-lg border border-[#E2ECE8]">
                <span className="text-[#7B928A] text-[10px] uppercase font-bold block">Observations</span>
                <span className="text-sm font-extrabold text-[#25332F]">{storageInfo?.observationsCount || 5}</span>
              </div>
              <div className="p-2 bg-[#F7F9F8] rounded-lg border border-[#E2ECE8]">
                <span className="text-[#7B928A] text-[10px] uppercase font-bold block">Action Plans</span>
                <span className="text-sm font-extrabold text-[#25332F]">{storageInfo?.actionPlansCount || 7}</span>
              </div>
            </div>

            <div className="p-2.5 bg-[#FEF9E6] rounded-xl border border-[#FDE68A] text-[11px] text-[#92400E]">
              Notice: Clearing browser cookies/site data will remove locally stored data.
            </div>

            <button
              type="button"
              onClick={() => setShowResetConfirm(true)}
              className="w-full mt-2 py-2 bg-red-50 hover:bg-red-100 text-red-700 text-xs font-bold rounded-xl border border-red-200 transition-colors"
            >
              Reset demo data to default
            </button>
          </div>

          {/* Sync Status Card */}
          <div className="card-base p-5 bg-[#F0F8F6] border-[#AFDCD1] space-y-2">
            <h3 className="font-bold text-sm text-[#176B5B]">
              Sync architecture
            </h3>
            <p className="text-xs text-[#25332F] leading-relaxed">
              Offline-first field tool. No external synchronization required. Your records remain private and secure on this physical device.
            </p>
          </div>

          {/* About Mentor360 */}
          <div className="card-base p-5 bg-white space-y-2 text-xs">
            <h3 className="font-bold text-sm text-[#25332F] pb-1 border-b border-[#E2ECE8]">
              About Mentor360
            </h3>
            <p className="text-[#5A6F68]">
              Version 1.0.0 (Field MVP)
            </p>
            <p className="text-[#5A6F68]">
              Field-support platform for Cluster Resource Persons and academic coordinators supporting government schools in India.
            </p>
          </div>
        </div>
      </div>

      {/* Confirmation Modal */}
      {showResetConfirm && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-floating border border-[#E2ECE8] max-w-md w-full p-6 space-y-4">
            <div className="flex items-center gap-3 text-amber-600">
              <AlertTriangle className="w-6 h-6" />
              <h3 className="font-bold text-base text-[#25332F]">Reset Local Demo Data?</h3>
            </div>
            <p className="text-xs text-[#5A6F68] leading-relaxed">
              This will re-populate the database with the initial synthetic Indian government school dataset (Raipur Rural cluster). Any new visits or notes you recorded will be replaced.
            </p>
            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowResetConfirm(false)}
                className="px-4 py-2 border rounded-xl text-xs font-semibold text-gray-600 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleResetData}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-xl"
              >
                Yes, Reset Data
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
