import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { Mail, Lock, AlertCircle, Sparkles, ArrowRight, ArrowLeft, LogOut, CheckCircle2 } from 'lucide-react';
import { authApi } from '../api/authApi';
import { useGame } from '../context/GameContext';
import { useTheme } from '../context/ThemeContext';
import { ThemeToggle } from '../components/common/ThemeToggle';

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { user, login, addToast, logout } = useGame();
  const { isDark } = useTheme();

  const [email, setEmail] = useState('hero@liferpg.dev');
  const [password, setPassword] = useState('questmaster123');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (e?: React.FormEvent, customEmail?: string, customPass?: string) => {
    if (e) e.preventDefault();
    setError(null);

    const loginEmail = customEmail !== undefined ? customEmail : email;
    const loginPass = customPass !== undefined ? customPass : password;

    if (!loginEmail.trim() || !loginEmail.includes('@')) {
      setError('Please provide a valid adventurer email address.');
      return;
    }
    if (!loginPass) {
      setError('Please enter your passphrase.');
      return;
    }

    setLoading(true);
    try {
      await login(loginEmail, loginPass);
      addToast({
        type: 'success',
        title: 'Welcome Back, Hero!',
        message: 'Resuming your active quest campaign.',
      });
      navigate('/dashboard', { replace: true });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Invalid credentials';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    try {
      await authApi.loginWithGoogle();
      addToast({
        type: 'success',
        title: 'Authenticated via Google',
        message: 'Welcome Back, Hero!',
      });
      navigate('/dashboard', { replace: true });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Google sign-in failed';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`min-h-screen flex flex-col justify-between p-4 sm:p-6 relative overflow-hidden transition-colors duration-300 ${
      isDark 
        ? 'bg-[#0A0A0A] text-[#FAFAFA] selection:bg-[#F87171] selection:text-black' 
        : 'bg-[#F5F5F0] text-[#1C1917] selection:bg-[#C2A68C] selection:text-[#5D866C]'
    }`}>
      {/* Top Header Bar with Back button & Theme toggle */}
      <header className="max-w-4xl w-full mx-auto flex items-center justify-between z-20 pt-2 pb-6">
        <Link
          to="/"
          className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
            isDark
              ? 'bg-[#141414] hover:bg-[#1E1719] border border-[#F87171]/30 text-white hover:text-[#F87171]'
              : 'bg-white hover:bg-[#E6D8C3] border border-[#C2A68C] text-[#1C1917]'
          }`}
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Realm Home</span>
        </Link>

        <div className="flex items-center gap-3">
          <ThemeToggle />
        </div>
      </header>

      {/* Ambient background glow */}
      <div className={`absolute top-1/4 -right-20 w-80 h-80 rounded-full blur-3xl pointer-events-none ${
        isDark ? 'bg-[#F87171]/10' : 'bg-[#C2A68C]/50'
      }`} />
      <div className={`absolute bottom-1/4 -left-20 w-80 h-80 rounded-full blur-3xl pointer-events-none ${
        isDark ? 'bg-[#EF4444]/5' : 'bg-[#E6D8C3]'
      }`} />

      {/* Main Container */}
      <div className="flex-1 flex items-center justify-center relative z-10 my-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className={`max-w-md w-full rounded-3xl p-6 sm:p-8 border shadow-2xl transition-colors ${
            isDark 
              ? 'bg-[#141414] border-[#F87171]/40 shadow-black' 
              : 'bg-white border-[#C2A68C]'
          }`}
        >
          {/* If user is already signed in, show convenient quick resume options */}
          {user && user.email ? (
            <div className="text-center space-y-6">
              <div className={`w-14 h-14 mx-auto rounded-2xl flex items-center justify-center text-white font-black shadow-lg ${
                isDark ? 'bg-[#F87171] text-black shadow-[#F87171]/30' : 'bg-[#5D866C] shadow-[#5D866C]/30'
              }`}>
                <CheckCircle2 className="w-8 h-8" />
              </div>

              <div>
                <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold tracking-wider uppercase border mb-2 ${
                  isDark 
                    ? 'bg-[#1E1214] border-[#F87171]/40 text-[#F87171]' 
                    : 'bg-[#E6D8C3] border-[#C2A68C] text-[#5D866C]'
                }`}>
                  Active Hero Session
                </span>
                <h2 className={`text-2xl font-black font-rpg tracking-wide ${isDark ? 'text-white' : 'text-[#1C1917]'}`}>
                  ALREADY SIGNED IN
                </h2>
                <p className={`text-xs mt-1 ${isDark ? 'text-zinc-400' : 'text-[#78716C]'}`}>
                  You are currently logged in as <strong className={isDark ? 'text-white' : 'text-[#1C1917]'}>{user.name}</strong> ({user.email}).
                </p>
              </div>

              <div className="space-y-3 pt-2">
                <button
                  type="button"
                  id="btn-go-to-dashboard-session"
                  onClick={() => navigate('/dashboard')}
                  className={`w-full py-3.5 px-4 rounded-xl font-black text-xs uppercase tracking-wider shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer ${
                    isDark 
                      ? 'bg-[#F87171] hover:bg-[#EF4444] text-black shadow-[#F87171]/30' 
                      : 'bg-[#5D866C] hover:bg-[#4B6E57] text-white shadow-[#5D866C]/30'
                  }`}
                >
                  <span>GO TO DASHBOARD</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <button
                  type="button"
                  id="btn-switch-account-logout"
                  onClick={async () => {
                    await logout();
                  }}
                  className={`w-full py-2.5 px-4 rounded-xl border text-xs font-bold transition-colors flex items-center justify-center gap-2 cursor-pointer ${
                    isDark
                      ? 'bg-[#1C1719] hover:bg-[#251A1C] border-[#F87171]/30 text-[#F87171]'
                      : 'bg-rose-50 hover:bg-rose-100 border-rose-200 text-rose-700'
                  }`}
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Switch Account / Sign Out</span>
                </button>
              </div>
            </div>
          ) : (
            <>
              {/* Brand Header */}
              <div className="text-center mb-6">
                <div className={`w-12 h-12 mx-auto rounded-2xl flex items-center justify-center font-black shadow-lg mb-3 ${
                  isDark 
                    ? 'bg-[#F87171] text-black shadow-[#F87171]/30' 
                    : 'bg-[#5D866C] text-white shadow-[#5D866C]/30'
                }`}>
                  <span className="text-2xl">⚔</span>
                </div>
                <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full border text-[11px] font-bold tracking-wider uppercase mb-2 ${
                  isDark 
                    ? 'bg-[#1E1214] border-[#F87171]/40 text-[#F87171]' 
                    : 'bg-[#E6D8C3] border-[#C2A68C] text-[#5D866C]'
                }`}>
                  Sign In Portal
                </div>
                <h2 className={`text-2xl font-black font-rpg tracking-wide ${isDark ? 'text-white' : 'text-[#1C1917]'}`}>
                  SIGN IN TO LIFE RPG
                </h2>
                <p className={`text-xs mt-1 ${isDark ? 'text-zinc-400' : 'text-[#78716C]'}`}>
                  Access your character sheet, quest log, and guild rewards
                </p>
              </div>

              {/* Error Alert */}
              {error && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className={`p-3 mb-5 rounded-xl border text-xs flex items-center gap-2 ${
                    isDark 
                      ? 'bg-rose-950/50 border-rose-800 text-rose-300' 
                      : 'bg-rose-50 border-rose-200 text-rose-700'
                  }`}
                >
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{error}</span>
                </motion.div>
              )}

              {/* Form */}
              <form onSubmit={handleLogin} className="space-y-4">
                <div>
                  <label className={`block text-xs font-semibold mb-1.5 ${isDark ? 'text-zinc-300' : 'text-[#1C1917]'}`}>
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className={`w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 ${isDark ? 'text-zinc-500' : 'text-[#78716C]'}`} />
                    <input
                      type="email"
                      id="login-input-email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="hero@realm.dev"
                      className={`w-full pl-10 pr-3.5 py-2.5 rounded-xl text-xs focus:outline-none transition-colors border ${
                        isDark 
                          ? 'bg-[#1F1F1F] border-zinc-700 text-white placeholder-zinc-500 focus:border-[#F87171]' 
                          : 'bg-[#F5F5F0] border-[#C2A68C] text-[#1C1917] placeholder-[#78716C] focus:border-[#5D866C]'
                      }`}
                    />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className={`text-xs font-semibold ${isDark ? 'text-zinc-300' : 'text-[#1C1917]'}`}>
                      Passphrase
                    </label>
                    <button
                      type="button"
                      onClick={() => addToast({ type: 'info', title: 'Password Recovery', message: 'A recovery scroll has been dispatched to your raven.' })}
                      className={`text-[11px] font-medium transition-colors cursor-pointer ${
                        isDark ? 'text-[#F87171] hover:text-[#EF4444]' : 'text-[#5D866C] hover:text-[#4B6E57]'
                      }`}
                    >
                      Forgot Password?
                    </button>
                  </div>
                  <div className="relative">
                    <Lock className={`w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 ${isDark ? 'text-zinc-500' : 'text-[#78716C]'}`} />
                    <input
                      type="password"
                      id="login-input-password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className={`w-full pl-10 pr-3.5 py-2.5 rounded-xl text-xs focus:outline-none transition-colors border ${
                        isDark 
                          ? 'bg-[#1F1F1F] border-zinc-700 text-white placeholder-zinc-500 focus:border-[#F87171]' 
                          : 'bg-[#F5F5F0] border-[#C2A68C] text-[#1C1917] placeholder-[#78716C] focus:border-[#5D866C]'
                      }`}
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  id="btn-login-submit"
                  disabled={loading}
                  className={`w-full mt-2 py-3 px-4 rounded-xl font-black text-xs uppercase tracking-wider shadow-md transition-all disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer ${
                    isDark 
                      ? 'bg-[#F87171] hover:bg-[#EF4444] text-black shadow-[#F87171]/30' 
                      : 'bg-[#5D866C] hover:bg-[#4B6E57] text-white shadow-[#5D866C]/30'
                  }`}
                >
                  {loading ? (
                    <>
                      <Sparkles className="w-4 h-4 animate-spin" />
                      <span>Signing In...</span>
                    </>
                  ) : (
                    <>
                      <span>SIGN IN</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>

              {/* Quick Adventurer 1-Click Sign In */}
              <button
                type="button"
                id="btn-quick-guest-login"
                onClick={() => {
                  setEmail('hero@liferpg.dev');
                  setPassword('questmaster123');
                  handleLogin(undefined, 'hero@liferpg.dev', 'questmaster123');
                }}
                disabled={loading}
                className={`w-full mt-2.5 py-2.5 px-4 rounded-xl border font-bold text-xs transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-sm ${
                  isDark 
                    ? 'bg-[#1C1719] hover:bg-[#251A1C] border-[#F87171]/30 text-[#F87171]' 
                    : 'bg-[#F5F5F0] hover:bg-[#E6D8C3] border-[#C2A68C] text-[#5D866C]'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>1-Click Hero Sign In (Demo)</span>
              </button>

              <div className="relative my-6 text-center">
                <div className="absolute inset-0 flex items-center">
                  <div className={`w-full border-t ${isDark ? 'border-zinc-800' : 'border-[#C2A68C]'}`} />
                </div>
                <span className={`relative px-3 text-[11px] uppercase tracking-wider font-semibold ${
                  isDark ? 'bg-[#141414] text-zinc-500' : 'bg-white text-[#78716C]'
                }`}>
                  Or Guild Federation
                </span>
              </div>

              {/* Continue with Google */}
              <button
                type="button"
                id="btn-login-google"
                onClick={handleGoogleLogin}
                disabled={loading}
                className={`w-full py-2.5 px-4 rounded-xl border font-semibold text-xs transition-colors flex items-center justify-center gap-2.5 cursor-pointer shadow-sm ${
                  isDark 
                    ? 'bg-[#1E1E1E] hover:bg-[#262626] border-zinc-700 text-white' 
                    : 'bg-[#E6D8C3] hover:bg-[#C2A68C] border-[#C2A68C] text-[#1C1917]'
                }`}
              >
                <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                  <path
                    fill="#EA4335"
                    d="M12 5c1.6 0 3 .6 4.1 1.7l3.1-3.1C17.3 1.8 14.8 1 12 1 7.5 1 3.7 3.6 1.9 7.3l3.7 2.9C6.5 7.3 9 5 12 5z"
                  />
                  <path
                    fill="#4285F4"
                    d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.5h6.5c-.3 1.5-1.1 2.8-2.4 3.7l3.7 2.9c2.2-2 3.7-5 3.7-8.8z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.6 14.8c-.3-.8-.4-1.8-.4-2.8s.2-2 .4-2.8L1.9 6.3C.7 8.7 0 10.3 0 12s.7 3.3 1.9 5.7l3.7-2.9z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c3.2 0 6-1.1 8-3l-3.7-2.9c-1.1.7-2.5 1.2-4.3 1.2-3 0-5.5-2.3-6.4-5.2L1.9 16C3.7 19.7 7.5 23 12 23z"
                  />
                </svg>
                <span>Continue with Google</span>
              </button>

              {/* Footer Link */}
              <div className={`mt-6 text-center text-xs ${isDark ? 'text-zinc-500' : 'text-[#78716C]'}`}>
                New adventurer?{' '}
                <Link
                  to="/signup"
                  className={`font-bold transition-colors ${
                    isDark ? 'text-[#F87171] hover:text-[#EF4444]' : 'text-[#5D866C] hover:text-[#4B6E57]'
                  }`}
                >
                  Create Your Character
                </Link>
              </div>
            </>
          )}
        </motion.div>
      </div>

      <footer className="text-center text-[11px] opacity-60 pb-2">
        Life RPG • Gamify your personal growth
      </footer>
    </div>
  );
};
