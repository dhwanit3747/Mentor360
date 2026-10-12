import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Building2,
  CalendarPlus,
  ClipboardCheck,
  Sparkles,
  ListChecks,
  BarChart3,
  Settings,
  HardDrive,
  PlusCircle,
  ShieldCheck
} from 'lucide-react';

interface SidebarProps {
  onCloseMobile?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ onCloseMobile }) => {
  const navigate = useNavigate();

  const navItems = [
    { to: '/app', label: 'My Work Today', icon: LayoutDashboard },
    { to: '/app/schools', label: 'School Directory', icon: Building2 },
    { to: '/app/plan-visit', label: 'Plan a School Visit', icon: CalendarPlus },
    { to: '/app/observation', label: 'Classroom Observation', icon: ClipboardCheck },
    { to: '/app/feedback-plan', label: 'Feedback & Demonstration', icon: Sparkles },
    { to: '/app/follow-ups', label: 'Follow-up Tracker', icon: ListChecks },
    { to: '/app/insights', label: 'Insights & Reports', icon: BarChart3 },
  ];

  const handleNavClick = () => {
    if (onCloseMobile) onCloseMobile();
  };

  return (
    <aside className="w-72 bg-[#FFFFFF] border-r border-[#E2ECE8] h-screen flex flex-col justify-between flex-shrink-0 z-30 select-none">
      {/* Top Header & Brand */}
      <div>
        <div className="p-5 border-b border-[#E2ECE8] flex items-center justify-between">
          <NavLink
            to="/"
            title="Go to Mentor360 Hero Page"
            onClick={handleNavClick}
            className="flex items-center gap-3 group cursor-pointer hover:opacity-90 transition-all"
          >
            <div className="w-9 h-9 rounded-lg bg-[#176B5B] text-white flex items-center justify-center shadow-xs font-black text-sm tracking-tighter group-hover:bg-[#125447] transition-colors">
              M<span className="text-[#F4B942]">360</span>
            </div>
            <div>
              <h1 className="font-bold text-base text-[#25332F] leading-tight group-hover:text-[#176B5B] transition-colors">
                Mentor<span className="text-[#176B5B]">360</span>
              </h1>
              <p className="text-[11px] text-[#5A6F68] font-medium leading-none mt-0.5">
                Field Mentor Edition
              </p>
            </div>
          </NavLink>
        </div>

        {/* Start a School Visit Button */}
        <div className="px-4 pt-4 pb-2">
          <button
            onClick={() => {
              navigate('/app/observation');
              handleNavClick();
            }}
            className="w-full bg-[#176B5B] hover:bg-[#125447] text-white font-semibold py-2.5 px-3.5 rounded-xl shadow-xs transition-all flex items-center justify-center gap-2 text-xs group"
          >
            <PlusCircle className="w-4 h-4 text-[#F4B942] group-hover:scale-105 transition-transform" />
            <span>Start a School Visit</span>
          </button>
        </div>

        {/* Navigation items */}
        <nav className="p-3 space-y-1 overflow-y-auto max-h-[calc(100vh-320px)]">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                onClick={handleNavClick}
                end={item.to === '/app'}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                    isActive
                      ? 'bg-[#E6F2EF] text-[#176B5B] font-bold shadow-xs'
                      : 'text-[#43544E] hover:bg-[#F0F8F6] hover:text-[#176B5B]'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <Icon
                      className={`w-4 h-4 flex-shrink-0 transition-colors ${
                        isActive ? 'text-[#176B5B]' : 'text-[#7B928A]'
                      }`}
                    />
                    <span className="truncate">{item.label}</span>
                  </>
                )}
              </NavLink>
            );
          })}
        </nav>
      </div>

      {/* Bottom Area: Storage Card + Settings + User Profile */}
      <div className="p-3 border-t border-[#E2ECE8] bg-[#F7F9F8] space-y-2">
        {/* Storage on this device card */}
        <div className="p-2.5 bg-white rounded-xl border border-[#E2ECE8] space-y-1">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-[#25332F] flex items-center gap-1.5 text-[11px]">
              <HardDrive className="w-3.5 h-3.5 text-[#176B5B]" />
              Storage on this device
            </span>
            <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
              Active
            </span>
          </div>
          <p className="text-[10px] text-[#5A6F68] leading-tight">
            All records saved locally via IndexedDB. Works completely offline.
          </p>
        </div>

        {/* Settings Link */}
        <NavLink
          to="/app/profile"
          onClick={handleNavClick}
          className={({ isActive }) =>
            `flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-semibold transition-colors ${
              isActive
                ? 'bg-[#E6F2EF] text-[#176B5B]'
                : 'text-[#43544E] hover:bg-white hover:text-[#176B5B]'
            }`
          }
        >
          <Settings className="w-4 h-4 text-[#7B928A]" />
          <span>Settings & Help</span>
        </NavLink>

        {/* User Profile Footer */}
        <div
          onClick={() => {
            navigate('/app/profile');
            handleNavClick();
          }}
          className="flex items-center gap-2.5 p-2 rounded-xl bg-white border border-[#E2ECE8] hover:border-[#AFDCD1] cursor-pointer transition-all"
        >
          <div className="w-8 h-8 rounded-full bg-[#176B5B] text-white flex items-center justify-center font-bold text-xs shadow-xs flex-shrink-0">
            AS
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-xs font-bold text-[#25332F] truncate leading-tight">
              Ananya Sharma
            </p>
            <p className="text-[10px] text-[#5A6F68] truncate leading-none mt-0.5">
              Cluster Mentor • Raipur
            </p>
          </div>
        </div>
      </div>
    </aside>
  );
};
