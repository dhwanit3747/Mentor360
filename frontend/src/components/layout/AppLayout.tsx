import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Navbar } from './Navbar';
import { BottomNav } from './BottomNav';
import { X, Info } from 'lucide-react';

export const AppLayout: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [language, setLanguage] = useState<'en' | 'hi'>('en');
  const [showStorageNotice, setShowStorageNotice] = useState(true);

  const toggleLanguage = () => {
    setLanguage(prev => (prev === 'en' ? 'hi' : 'en'));
  };

  return (
    <div className="flex h-screen bg-[#F7F9F8] overflow-hidden text-[#25332F]">
      {/* Desktop Persistent Sidebar */}
      <div className="hidden md:flex flex-shrink-0">
        <Sidebar />
      </div>

      {/* Mobile Drawer Overlay */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-xs z-50 md:hidden flex"
          onClick={() => setMobileMenuOpen(false)}
        >
          <div
            className="w-72 bg-white h-full shadow-2xl flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-end p-3 border-b border-[#E2ECE8]">
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="p-1.5 rounded-lg text-charcoal-500 hover:bg-charcoal-100"
                aria-label="Close menu"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <Sidebar onCloseMobile={() => setMobileMenuOpen(false)} />
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Navbar
          onOpenMobileMenu={() => setMobileMenuOpen(true)}
          language={language}
          onLanguageToggle={toggleLanguage}
        />

        {/* Offline / Local Storage Advisory Banner */}
        {showStorageNotice && (
          <div className="bg-[#E6F2EF] border-b border-[#AFDCD1] px-4 py-2 text-xs text-[#176B5B] flex items-center justify-between">
            <div className="flex items-center gap-2 max-w-5xl mx-auto flex-1">
              <Info className="w-4 h-4 flex-shrink-0 text-[#176B5B]" />
              <p className="font-medium text-[11px] md:text-xs">
                <strong>Field Ready:</strong> All mentor records are stored in this browser via IndexedDB. Works completely offline. Clearing browser site data will remove local records.
              </p>
            </div>
            <button
              onClick={() => setShowStorageNotice(false)}
              className="p-1 hover:bg-[#AFDCD1]/40 rounded text-[#176B5B] ml-2"
              title="Dismiss notice"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* Scrollable page body */}
        <main className="flex-1 overflow-y-auto px-4 md:px-8 py-6 pb-20 md:pb-8">
          <div className="max-w-7xl mx-auto">
            <Outlet context={{ language }} />
          </div>
        </main>

        {/* Mobile Bottom Navigation */}
        <BottomNav />
      </div>
    </div>
  );
};
