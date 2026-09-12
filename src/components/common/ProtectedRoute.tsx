import React from 'react';
import { Navigate, useLocation, Outlet } from 'react-router-dom';
import { useGame } from '../../context/GameContext';
import { useTheme } from '../../context/ThemeContext';

interface ProtectedRouteProps {
  children?: React.ReactNode;
}

/**
 * Route protection guard:
 * Prevents anyone from accessing dashboard or in-app views without signing in.
 * If not authenticated, redirects directly to /login with state.from set.
 */
export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { user, loading } = useGame();
  const { isDark } = useTheme();
  const location = useLocation();

  // Show a clean RPG loading state while checking the authentication session
  if (loading) {
    return (
      <div className={`min-h-screen flex flex-col items-center justify-center transition-colors ${
        isDark ? 'bg-[#0A0A0A] text-white' : 'bg-[#F5F5F0] text-[#1C1917]'
      }`}>
        <div className="flex flex-col items-center gap-4">
          <div className={`w-12 h-12 rounded-2xl flex items-center justify-center animate-bounce shadow-lg ${
            isDark ? 'bg-[#F87171] text-black shadow-[#F87171]/30' : 'bg-[#5D866C] text-white shadow-[#5D866C]/30'
          }`}>
            <span className="text-2xl font-bold">⚔</span>
          </div>
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full animate-ping ${isDark ? 'bg-[#F87171]' : 'bg-[#5D866C]'}`} />
            <span className="text-xs font-mono font-bold tracking-widest uppercase">
              Verifying Adventurer...
            </span>
          </div>
        </div>
      </div>
    );
  }

  // If unauthenticated, redirect directly to /login
  if (!user || !user.email) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children ? <>{children}</> : <Outlet />;
};

/**
 * Public-only route guard:
 * Prevents logged-in users from needlessly visiting /login or /signup,
 * directing them directly to /dashboard.
 */
export const PublicOnlyRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, loading } = useGame();

  if (!loading && user && user.email) {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
};
