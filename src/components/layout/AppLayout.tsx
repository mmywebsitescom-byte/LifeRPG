import React from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from '../common/Sidebar';
import { TopBar } from '../common/TopBar';
import { MobileNavigation } from '../common/MobileNavigation';
import { ToastContainer } from '../common/ToastContainer';
import { LevelUpModal } from '../modals/LevelUpModal';
import { QuestCompleteModal } from '../modals/QuestCompleteModal';
import { ConfirmModal } from '../modals/ConfirmModal';
import { ErrorBoundary } from '../common/ErrorBoundary';
import { useTheme } from '../../context/ThemeContext';

export const AppLayout: React.FC = () => {
  const { isDark } = useTheme();

  return (
    <div className={`min-h-screen flex flex-col md:flex-row antialiased transition-colors duration-200 ${
      isDark 
        ? 'bg-[#0A0A0A] text-[#FAFAFA] selection:bg-[#F87171] selection:text-black' 
        : 'bg-[#F5F5F0] text-[#1C1917] selection:bg-[#C2A68C] selection:text-[#5D866C]'
    }`}>
      {/* Desktop Sidebar */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 pb-[calc(5rem+env(safe-area-inset-bottom,0px))] md:pb-8">
        <TopBar />
        <main className="flex-1 px-4 sm:px-8 py-6 max-w-7xl w-full mx-auto">
          <ErrorBoundary>
            <Outlet />
          </ErrorBoundary>
        </main>
      </div>

      {/* Mobile Bottom Navigation */}
      <MobileNavigation />

      {/* Global Modals & Notifications */}
      <ToastContainer />
      <LevelUpModal />
      <QuestCompleteModal />
      <ConfirmModal />
    </div>
  );
};
