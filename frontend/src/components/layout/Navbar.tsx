import React, { useState } from 'react';
import { Menu, Globe, Bell, CheckCircle2, AlertTriangle, ShieldCheck, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface NavbarProps {
  onOpenMobileMenu: () => void;
  language: 'en' | 'hi';
  onLanguageToggle: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenMobileMenu,
  language,
  onLanguageToggle
}) => {
  const navigate = useNavigate();
  const [showNotificationModal, setShowNotificationModal] = useState(false);

  return (
    <header className="bg-white border-b border-[#E2ECE8] sticky top-0 z-20 px-4 md:px-8 py-3.5">
      <div className="flex items-center justify-between max-w-7xl mx-auto">
        {/* Left: Mobile Menu, Brand & Greeting */}
        <div className="flex items-center gap-3">
          <button
            onClick={onOpenMobileMenu}
            className="md:hidden p-2 text-[#43544E] hover:text-[#176B5B] hover:bg-[#F0F8F6] rounded-lg"
            aria-label="Open navigation menu"
          >
            <Menu className="w-5 h-5" />
          </button>

          {/* Mobile Mentor360 Brand Redirect */}
          <button
            onClick={() => navigate('/')}
            title="Go to Mentor360 Hero Page"
            className="md:hidden flex items-center gap-1.5 p-1 rounded-lg hover:bg-[#F0F8F6] transition-colors cursor-pointer"
          >
            <div className="w-7 h-7 rounded-lg bg-[#176B5B] text-white flex items-center justify-center font-black text-xs shadow-xs">
              M<span className="text-[#F4B942]">360</span>
            </div>
            <span className="font-bold text-sm text-[#25332F]">Mentor<span className="text-[#176B5B]">360</span></span>
          </button>

          <div className="hidden sm:block">
            <div className="flex items-center gap-2">
              <h2 className="text-base md:text-lg font-bold text-[#25332F] tracking-tight">
                {language === 'hi'
                  ? 'शुभ प्रभात! क्या आप आज शिक्षकों का सहयोग करने के लिए तैयार हैं?'
                  : 'Good morning! Ready to support your teachers today?'}
              </h2>
            </div>
            <p className="hidden md:block text-xs text-[#5A6F68] font-medium">
              Cluster: <span className="font-semibold text-[#176B5B]">Barabanki Rural (संकुल - 04)</span> • 6 Government Schools
            </p>
          </div>
        </div>

        {/* Right: Storage pill, Hero button, Language toggle, Notifications, Profile */}
        <div className="flex items-center gap-2 md:gap-3">
          {/* Hero Page Shortcut */}
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#AFDCD1] bg-[#F0F8F6] hover:bg-[#E0F1EC] text-xs font-bold text-[#176B5B] transition-colors cursor-pointer"
            title="Return to Mentor360 Hero Page"
          >
            <span className="w-2 h-2 rounded-full bg-[#176B5B]"></span>
            <span>Hero Page</span>
          </button>

          {/* Storage limitation tag */}
          <div className="hidden lg:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#F7F9F8] border border-[#E2ECE8] text-xs font-semibold text-[#5A6F68]">
            <ShieldCheck className="w-3.5 h-3.5 text-[#176B5B]" />
            <span>Local Storage</span>
          </div>

          {/* Language Toggle */}
          <button
            onClick={onLanguageToggle}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#E2ECE8] hover:bg-[#F7F9F8] text-xs font-semibold text-[#25332F] transition-colors"
            title="Switch Language"
          >
            <Globe className="w-3.5 h-3.5 text-[#176B5B]" />
            <span>{language === 'en' ? 'EN' : 'हिन्दी'}</span>
          </button>

          {/* Notifications bell */}
          <div className="relative">
            <button
              onClick={() => setShowNotificationModal(!showNotificationModal)}
              className="p-2 text-[#5A6F68] hover:text-[#176B5B] hover:bg-[#F0F8F6] rounded-lg transition-colors relative"
              aria-label="View notifications"
            >
              <Bell className="w-4 h-4" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#F4B942]"></span>
            </button>

            {showNotificationModal && (
              <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-floating border border-[#E2ECE8] p-4 z-50 text-xs">
                <div className="flex items-center justify-between pb-2 border-b border-[#E2ECE8]">
                  <span className="font-bold text-[#25332F]">Mentor Notifications</span>
                  <span className="text-[10px] bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full font-bold">1 Overdue</span>
                </div>
                <div className="py-2.5 space-y-2">
                  <div className="p-2.5 bg-amber-50 rounded-lg border border-amber-200">
                    <p className="font-semibold text-amber-900">Follow-up Overdue</p>
                    <p className="text-[#5A6F68] mt-0.5 text-[11px]">
                      Shakti Govt Primary School: Ganit Mala demonstration was due on Oct 8.
                    </p>
                  </div>
                  <div className="p-2.5 bg-[#F0F8F6] rounded-lg border border-[#D7EDE7]">
                    <p className="font-semibold text-[#176B5B]">Planned Visit Tomorrow</p>
                    <p className="text-[#5A6F68] mt-0.5 text-[11px]">
                      Saraswati Primary School: Grade 2 reading fluency observation at 10:00 AM.
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setShowNotificationModal(false)}
                  className="w-full mt-1 text-center py-1.5 bg-[#F7F9F8] hover:bg-[#E2ECE8] rounded-lg font-semibold text-[#25332F]"
                >
                  Close
                </button>
              </div>
            )}
          </div>

          {/* Profile Shortcut */}
          <button
            onClick={() => navigate('/app/profile')}
            className="flex items-center gap-2 pl-2 border-l border-[#E2ECE8] hover:opacity-85 transition-opacity"
          >
            <div className="w-8 h-8 rounded-full bg-[#176B5B] text-white flex items-center justify-center font-bold text-xs shadow-xs">
              RC
            </div>
            <div className="hidden xl:block text-left">
              <p className="text-xs font-bold text-[#25332F] leading-tight">Ramesh C.</p>
              <p className="text-[10px] text-[#5A6F68] leading-none">CRP Mentor</p>
            </div>
          </button>
        </div>
      </div>
    </header>
  );
};
