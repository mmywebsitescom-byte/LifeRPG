import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { User, Mail, Lock, AlertCircle, ArrowRight, ArrowLeft } from 'lucide-react';
import { authApi } from '../api/authApi';
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
      const msg = err instanceof Error ? err.message : 'Registration failed';
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
                <span>Inscribing Codex...</span>
              ) : (
                <>
                  <span>BEGIN CAMPAIGN</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

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
        </motion.div>
      </div>

      <footer className="text-center text-[11px] opacity-60 pb-2">
        Life RPG • Level up your real-world stats
      </footer>
    </div>
  );
};
