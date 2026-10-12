import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Building2,
  CalendarPlus,
  ClipboardCheck,
  ListChecks
} from 'lucide-react';

export const BottomNav: React.FC = () => {
  const navItems = [
    { to: '/app', label: 'Today', icon: LayoutDashboard },
    { to: '/app/schools', label: 'Schools', icon: Building2 },
    { to: '/app/plan-visit', label: 'Plan', icon: CalendarPlus },
    { to: '/app/observation', label: 'Observe', icon: ClipboardCheck },
    { to: '/app/follow-ups', label: 'Follow-up', icon: ListChecks },
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-[#E2ECE8] z-40 px-2 py-1 shadow-lg select-none">
      <div className="flex items-center justify-around">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === '/app'}
              className={({ isActive }) =>
                `flex flex-col items-center justify-center py-1.5 px-3 rounded-lg text-[10px] font-semibold transition-colors ${
                  isActive
                    ? 'text-[#176B5B]'
                    : 'text-[#5A6F68] hover:text-[#176B5B]'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <div
                    className={`p-1 rounded-full transition-transform ${
                      isActive ? 'bg-[#E6F2EF] scale-110' : ''
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className="mt-0.5">{item.label}</span>
                </>
              )}
            </NavLink>
          );
        })}
      </div>
    </nav>
  );
};
