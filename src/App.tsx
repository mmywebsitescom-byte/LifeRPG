import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { GameProvider } from './context/GameContext';
import { ThemeProvider, useTheme } from './context/ThemeContext';
import { AppLayout } from './components/layout/AppLayout';
import ClickSpark from './components/common/ClickSpark';

// Pages
import { LandingPage } from './pages/LandingPage';
import { HowItWorksPage } from './pages/HowItWorksPage';
import { LoginPage } from './pages/LoginPage';
import { SignUpPage } from './pages/SignUpPage';
import { CharacterCreationPage } from './pages/CharacterCreationPage';
import { DashboardPage } from './pages/DashboardPage';
import { QuestsPage } from './pages/QuestsPage';
import { CreateQuestPage } from './pages/CreateQuestPage';
import { DiscoverPage } from './pages/DiscoverPage';
import { CharacterPage } from './pages/CharacterPage';
import { ProgressPage } from './pages/ProgressPage';
import { AchievementsPage } from './pages/AchievementsPage';
import { RewardsPage } from './pages/RewardsPage';
import { SettingsPage } from './pages/SettingsPage';

function AppContent() {
  const { isDark } = useTheme();

  return (
    <ClickSpark
      sparkColor={isDark ? '#F87171' : '#5D866C'}
      sparkSize={10}
      sparkRadius={22}
      sparkCount={8}
      duration={400}
    >
      <BrowserRouter>
        <Routes>
          {/* Public Landing & Authentication */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/how-it-works" element={<HowItWorksPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignUpPage />} />
          <Route path="/character-creation" element={<CharacterCreationPage />} />

          {/* Main RPG In-App Views */}
          <Route element={<AppLayout />}>
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/quests" element={<QuestsPage />} />
            <Route path="/quests/create" element={<CreateQuestPage />} />
            <Route path="/discover" element={<DiscoverPage />} />
            <Route path="/character" element={<CharacterPage />} />
            <Route path="/progress" element={<ProgressPage />} />
            <Route path="/achievements" element={<AchievementsPage />} />
            <Route path="/rewards" element={<RewardsPage />} />
            <Route path="/settings" element={<SettingsPage />} />
          </Route>

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </BrowserRouter>
    </ClickSpark>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <GameProvider>
        <AppContent />
      </GameProvider>
    </ThemeProvider>
  );
}
