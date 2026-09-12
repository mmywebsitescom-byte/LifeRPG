import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { User, Mail, Lock, AlertCircle, ArrowRight, ArrowLeft, Sparkles } from 'lucide-react';
import { authApi, formatFirebaseAuthError } from '../api/authApi';
import { useGame } from '../context/GameContext';
import { useTheme } from '../context/ThemeContext';
import { ThemeToggle } from '../components/common/ThemeToggle';

export const SignUpPage: React.FC = () => {
  const navigate = useNavigate();
  const { signup, addToast } = useGame();
  const { isDark } = useTheme();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validation checks
    if (!name.trim()) {
      setError('Hero name is required to forge your identity.');
      return;
    }
    if (!email.trim() || !email.includes('@')) {
      setError('Please provide a valid adventurer email address.');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters of arcane complexity.');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match. Please verify your passphrase.');
      return;
    }

    setLoading(true);
    try {
      await signup(name, email, password);
      addToast({
        type: 'success',
        title: 'Hero Identity Forged!',
        message: 'Welcome to Life RPG. Entering the Realm Dashboard!',
      });
      navigate('/dashboard', { replace: true });
    } catch (err: unknown) {
      const msg = err instanceof Error ? formatFirebaseAuthError(err) : 'Registration failed';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    setError(null);
    try {
      await authApi.loginWithGoogle();
      addToast({
        type: 'success',
        title: 'Hero Identity Forged via Google!',
        message: 'Welcome to Life RPG. Entering the Realm Dashboard!',
      });
      navigate('/dashboard', { replace: true });
    } catch (err: unknown) {
      const msg = err instanceof Error ? formatFirebaseAuthError(err) : 'Google sign-in failed';
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
      {/* Top Header Bar */}
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

      {/* Ambient background orbs */}
      <div className={`absolute top-1/4 -left-20 w-80 h-80 rounded-full blur-3xl pointer-events-none ${
        isDark ? 'bg-[#F87171]/10' : 'bg-[#C2A68C]/50'
      }`} />
      <div className={`absolute bottom-1/4 -right-20 w-80 h-80 rounded-full blur-3xl pointer-events-none ${
        isDark ? 'bg-[#EF4444]/5' : 'bg-[#E6D8C3]'
      }`} />

      {/* Main Form Container */}
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
          {/* Header */}
          <div className="text-center mb-6">
            <div className={`w-12 h-12 mx-auto rounded-2xl flex items-center justify-center font-black shadow-lg mb-3 ${
              isDark 
                ? 'bg-[#F87171] text-black shadow-[#F87171]/30' 
                : 'bg-[#5D866C] text-white shadow-[#5D866C]/30'
            }`}>
              <span className="text-2xl">✨</span>
            </div>
            <h2 className={`text-2xl font-black font-rpg tracking-wide ${isDark ? 'text-white' : 'text-[#1C1917]'}`}>
              FORGE HERO LEGEND
            </h2>
            <p className={`text-xs mt-1 ${isDark ? 'text-zinc-400' : 'text-[#78716C]'}`}>
              Create your adventurer account to begin your journey
            </p>
          </div>

          {/* Error Alert */}
          {error && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className={`p-3.5 mb-5 rounded-xl border text-xs flex flex-col gap-2 ${
                isDark 
                  ? 'bg-rose-950/50 border-rose-800/80 text-rose-300' 
                  : 'bg-rose-50 border-rose-200 text-rose-700'
              }`}
            >
              <div className="flex items-start gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <span className="font-medium leading-relaxed">{error}</span>
              </div>
              {error.toLowerCase().includes('authorized domain') && (
                <div className={`mt-1 pt-2 border-t text-[11px] space-y-1.5 ${
                  isDark ? 'border-rose-900 text-zinc-300' : 'border-rose-200 text-zinc-700'
                }`}>
                  <p className="font-bold text-amber-400">🛠️ How to fix in Firebase Console:</p>
                  <p>1. Open <a href="https://console.firebase.google.com" target="_blank" rel="noreferrer" className="underline font-bold text-amber-300">Firebase Console</a></p>
                  <p>2. Go to <strong>Authentication</strong> → <strong>Settings</strong> tab</p>
                  <p>3. Scroll down to <strong>Authorized domains</strong> → click <strong>Add domain</strong></p>
                  <p>4. Add your domain: <code className="px-1.5 py-0.5 rounded bg-black/40 font-mono text-amber-300">{window.location.hostname}</code></p>
                </div>
              )}
            </motion.div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className={`block text-xs font-semibold mb-1.5 ${isDark ? 'text-zinc-300' : 'text-[#1C1917]'}`}>
                Hero Moniker / Name
              </label>
              <div className="relative">
                <User className={`w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 ${isDark ? 'text-zinc-500' : 'text-[#78716C]'}`} />
                <input
                  type="text"
                  id="signup-input-name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Roland Emberheart"
                  className={`w-full pl-10 pr-3.5 py-2.5 rounded-xl text-xs focus:outline-none transition-colors border ${
                    isDark 
                      ? 'bg-[#1F1F1F] border-zinc-700 text-white placeholder-zinc-500 focus:border-[#F87171]' 
                      : 'bg-[#F5F5F0] border-[#C2A68C] text-[#1C1917] placeholder-[#78716C] focus:border-[#5D866C]'
                  }`}
                />
              </div>
            </div>

            <div>
              <label className={`block text-xs font-semibold mb-1.5 ${isDark ? 'text-zinc-300' : 'text-[#1C1917]'}`}>
                Email Address
              </label>
              <div className="relative">
                <Mail className={`w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 ${isDark ? 'text-zinc-500' : 'text-[#78716C]'}`} />
                <input
                  type="email"
                  id="signup-input-email"
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
              <label className={`block text-xs font-semibold mb-1.5 ${isDark ? 'text-zinc-300' : 'text-[#1C1917]'}`}>
                Passphrase
              </label>
              <div className="relative">
                <Lock className={`w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 ${isDark ? 'text-zinc-500' : 'text-[#78716C]'}`} />
                <input
                  type="password"
                  id="signup-input-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="At least 6 characters"
                  className={`w-full pl-10 pr-3.5 py-2.5 rounded-xl text-xs focus:outline-none transition-colors border ${
                    isDark 
                      ? 'bg-[#1F1F1F] border-zinc-700 text-white placeholder-zinc-500 focus:border-[#F87171]' 
                      : 'bg-[#F5F5F0] border-[#C2A68C] text-[#1C1917] placeholder-[#78716C] focus:border-[#5D866C]'
                  }`}
                />
              </div>
            </div>

            <div>
              <label className={`block text-xs font-semibold mb-1.5 ${isDark ? 'text-zinc-300' : 'text-[#1C1917]'}`}>
                Confirm Passphrase
              </label>
              <div className="relative">
                <Lock className={`w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 ${isDark ? 'text-zinc-500' : 'text-[#78716C]'}`} />
                <input
                  type="password"
                  id="signup-input-confirm-password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Repeat password"
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
              id="btn-signup-submit"
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
                  <span>Inscribing Codex...</span>
                </>
              ) : (
                <>
                  <span>BEGIN CAMPAIGN</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

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
            id="btn-signup-google"
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
            Already have an adventurer scroll?{' '}
            <Link
              to="/login"
              className={`font-bold transition-colors ${
                isDark ? 'text-[#F87171] hover:text-[#EF4444]' : 'text-[#5D866C] hover:text-[#4B6E57]'
              }`}
            >
              Login Here
            </Link>
          </div>

          <div className={`mt-2.5 text-center text-xs ${isDark ? 'text-zinc-500' : 'text-[#78716C]'}`}>
            Encountering a technical error?{' '}
            <Link
              to="/support"
              className={`font-bold underline transition-colors ${
                isDark ? 'text-zinc-300 hover:text-[#F87171]' : 'text-[#1C1917] hover:text-[#5D866C]'
              }`}
            >
              Contact Technical Support
            </Link>
          </div>
        </motion.div>
      </div>

      <footer className="text-center text-[11px] opacity-60 pb-2">
        Life RPG • Level up your real-world stats
      </footer>
    </div>
  );
};
