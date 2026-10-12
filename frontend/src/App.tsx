import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppLayout } from './components/layout/AppLayout';
import { LandingPage } from './pages/LandingPage';
import { DashboardPage } from './pages/DashboardPage';
import { SchoolDirectoryPage } from './pages/SchoolDirectoryPage';
import { SchoolDetailPage } from './pages/SchoolDetailPage';
import { VisitPlanningPage } from './pages/VisitPlanningPage';
import { ClassroomObservationPage } from './pages/ClassroomObservationPage';
import { FeedbackPlanPage } from './pages/FeedbackPlanPage';
import { FollowUpTrackerPage } from './pages/FollowUpTrackerPage';
import { InsightsPage } from './pages/InsightsPage';
import { ProfileSettingsPage } from './pages/ProfileSettingsPage';
import { initializeDatabase } from './services/database';

export const App: React.FC = () => {
  useEffect(() => {
    // Initialize IndexedDB with seed data on mount
    initializeDatabase().catch(console.error);
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        {/* Public landing / hero page */}
        <Route path="/" element={<LandingPage />} />

        {/* App (dashboard) routes — all under /app */}
        <Route path="/app" element={<AppLayout />}>
          <Route index element={<DashboardPage />} />
          <Route path="schools" element={<SchoolDirectoryPage />} />
          <Route path="schools/:schoolId" element={<SchoolDetailPage />} />
          <Route path="plan-visit" element={<VisitPlanningPage />} />
          <Route path="observation" element={<ClassroomObservationPage />} />
          <Route path="feedback-plan" element={<FeedbackPlanPage />} />
          <Route path="follow-ups" element={<FollowUpTrackerPage />} />
          <Route path="insights" element={<InsightsPage />} />
          <Route path="profile" element={<ProfileSettingsPage />} />
        </Route>

        {/* Direct route aliases for resilience */}
        <Route path="/schools" element={<Navigate to="/app/schools" replace />} />
        <Route path="/schools/:schoolId" element={<Navigate to="/app/schools/:schoolId" replace />} />
        <Route path="/dashboard" element={<Navigate to="/app" replace />} />

        {/* Fallback: redirect unknown paths to landing */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
