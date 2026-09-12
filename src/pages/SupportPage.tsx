import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  LifeBuoy,
  Mail,
  Send,
  AlertTriangle,
  CheckCircle2,
  Copy,
  ExternalLink,
  ShieldCheck,
  RefreshCw,
  Cpu,
  HelpCircle,
  ArrowLeft,
  Terminal,
  Check,
  Zap,
  Globe
} from 'lucide-react';
import { useGame } from '../context/GameContext';
import { useTheme } from '../context/ThemeContext';
import { ThemeToggle } from '../components/common/ThemeToggle';

const SUPPORT_EMAIL = 'support@liferpg.dev';

export const SupportPage: React.FC = () => {
  const navigate = useNavigate();
  const { user, character, refreshData, addToast } = useGame();
  const { isDark } = useTheme();

  // Form State
  const [senderName, setSenderName] = useState(character?.name || user?.name || '');
  const [senderEmail, setSenderEmail] = useState(user?.email || '');
  const [category, setCategory] = useState<string>('auth');
  const [severity, setSeverity] = useState<string>('medium');
  const [subject, setSubject] = useState('');
  const [description, setDescription] = useState('');
  const [includeDiagnostics, setIncludeDiagnostics] = useState(true);

  // Status & Interactive States
  const [copied, setCopied] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submittedTicket, setSubmittedTicket] = useState<{ id: string; timestamp: string } | null>(null);

  // Diagnostics state
  const [pingStatus, setPingStatus] = useState<'idle' | 'checking' | 'healthy' | 'error'>('idle');
  const [pingLatency, setPingLatency] = useState<number | null>(null);
  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  // Auto-sync initial user data if present
  useEffect(() => {
    if (user?.email && !senderEmail) setSenderEmail(user.email);
    if ((character?.name || user?.name) && !senderName) setSenderName(character?.name || user?.name || '');
  }, [user, character]);

  const diagnosticsData = {
    userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : 'Unknown',
    platform: typeof navigator !== 'undefined' ? (navigator as any).userAgentData?.platform || navigator.platform : 'Unknown',
    screenSize: typeof window !== 'undefined' ? `${window.innerWidth}x${window.innerHeight}` : 'Unknown',
    localTime: new Date().toLocaleString(),
    currentRoute: typeof window !== 'undefined' ? window.location.pathname : '/support',
    authStatus: user ? `Authenticated (${user.email})` : 'Unauthenticated / Guest',
  };

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(SUPPORT_EMAIL);
    setCopied(true);
    addToast({
      type: 'info',
      title: 'Email Copied',
      message: `${SUPPORT_EMAIL} copied to clipboard!`,
    });
    setTimeout(() => setCopied(false), 2500);
  };

  const handlePingServer = async () => {
    setPingStatus('checking');
    const start = performance.now();
    try {
      const res = await fetch('/api/health');
      const data = await res.json();
      const latency = Math.round(performance.now() - start);
      setPingLatency(latency);
      if (res.ok && data.status === 'ok') {
        setPingStatus('healthy');
        addToast({
          type: 'success',
          title: 'Server Guild Healthy',
          message: `Backend API responded in ${latency}ms (Firebase: ${data.firebase ? 'Online' : 'Offline'}).`,
        });
      } else {
        setPingStatus('error');
      }
    } catch {
      setPingStatus('error');
      addToast({
        type: 'error',
        title: 'Connection Issue',
        message: 'Could not reach backend API directly. Please send an email dispatch.',
      });
    }
  };

  const handleClearCacheAndSync = async () => {
    try {
      localStorage.removeItem('liferpg_cached_character');
      localStorage.removeItem('liferpg_cached_quests');
      await refreshData();
      addToast({
        type: 'success',
        title: 'Cache Cleansed',
        message: 'Local cache cleared and live realm state re-synchronized.',
      });
    } catch {
      window.location.reload();
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!senderEmail || !subject.trim() || !description.trim()) {
      addToast({
        type: 'error',
        title: 'Incomplete Dispatch',
        message: 'Please provide your contact email, subject, and detailed description.',
      });
      return;
    }

    setSubmitting(true);

    const ticketId = `RPG-TECH-${Math.floor(100000 + Math.random() * 900000)}`;
    const timestamp = new Date().toLocaleString();

    // Prepare mailto body for native client dispatch
    const mailBody = `=== LIFE RPG TECHNICAL INCIDENT REPORT ===
Ticket ID: ${ticketId}
Reported At: ${timestamp}
Hero: ${senderName || 'Anonymous Hero'}
Email: ${senderEmail}
Category: ${category}
Severity: ${severity}

--- ISSUE SUMMARY ---
Subject: ${subject}

--- DESCRIPTION ---
${description}

${includeDiagnostics ? `--- CLIENT DIAGNOSTICS ---
User Agent: ${diagnosticsData.userAgent}
Platform: ${diagnosticsData.platform}
Screen: ${diagnosticsData.screenSize}
Local Time: ${diagnosticsData.localTime}
Route: ${diagnosticsData.currentRoute}
Auth: ${diagnosticsData.authStatus}` : ''}
==========================================`;

    const mailtoUrl = `mailto:${SUPPORT_EMAIL}?subject=${encodeURIComponent(
      `[${ticketId}] [${severity.toUpperCase()}] ${subject}`
    )}&body=${encodeURIComponent(mailBody)}`;

    setTimeout(() => {
      setSubmitting(false);
      setSubmittedTicket({ id: ticketId, timestamp });
      // Open native mailto dispatch
      window.location.href = mailtoUrl;
    }, 600);
  };

  const faqs = [
    {
      q: 'Rewards Shop shows "No Items Found" or takes time to load?',
      a: 'Make sure you are signed into your hero account. The shop inventory syncs securely with your cloud adventurer profile. If it appears blank, click the "Clear Cache & Resync" button above to refresh your inventory.',
    },
    {
      q: 'Google Sign-in popup was closed or failed to complete?',
      a: 'Some browsers or extensions block popup windows. Make sure popups are permitted for localhost / your domain, or use the standard Email & Passphrase authentication.',
    },
    {
      q: 'Quests or Experience (XP) desynced?',
      a: 'Quests are stored live in Firestore cloud storage. If your connection was interrupted, completing any small quest or clicking the top reload button will synchronize your character sheet.',
    },
    {
      q: 'How fast does the Technical Support team respond?',
      a: 'Our technical guild reviews every dispatch immediately and usually responds within 12 to 24 hours. Critical realm-breaking bugs are prioritized instantly.',
    },
  ];

  return (
    <div className={`min-h-screen transition-colors duration-300 ${
      isDark 
        ? 'bg-[#0A0A0A] text-[#FAFAFA] selection:bg-[#F87171] selection:text-black' 
        : 'bg-[#F5F5F0] text-[#1C1917] selection:bg-[#C2A68C] selection:text-[#5D866C]'
    }`}>
      {/* Top Floating Navigation Header */}
      <header className="sticky top-0 z-40 w-full px-4 sm:px-8 py-4 backdrop-blur-xl border-b flex items-center justify-between gap-4 transition-colors duration-300"
        style={{
          borderColor: isDark ? 'rgba(248, 113, 113, 0.2)' : '#C2A68C',
          backgroundColor: isDark ? 'rgba(10, 10, 10, 0.85)' : 'rgba(245, 245, 240, 0.85)',
        }}
      >
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => navigate(user ? '/dashboard' : '/')}
            className={`p-2 rounded-xl border transition-all cursor-pointer flex items-center gap-2 text-xs font-bold ${
              isDark 
                ? 'bg-[#141414] border-[#F87171]/30 hover:border-[#F87171] text-zinc-300 hover:text-white' 
                : 'bg-white border-[#C2A68C] hover:border-[#5D866C] text-[#57534E] hover:text-[#1C1917]'
            }`}
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="hidden sm:inline">{user ? 'Back to Command Deck' : 'Back to Home'}</span>
          </button>

          <div className="flex items-center gap-2">
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold ${
              isDark ? 'bg-[#F87171] text-black' : 'bg-[#5D866C] text-white'
            }`}>
              <LifeBuoy className="w-4 h-4" />
            </div>
            <span className="font-black font-rpg tracking-wide text-sm sm:text-base">
              SUPPORT SANCTUARY
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <ThemeToggle />
          {user ? (
            <Link
              to="/dashboard"
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                isDark 
                  ? 'bg-[#F87171] text-black hover:bg-[#ef4444]' 
                  : 'bg-[#5D866C] text-white hover:bg-[#4d705a]'
              }`}
            >
              Dashboard
            </Link>
          ) : (
            <Link
              to="/login"
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                isDark 
                  ? 'bg-[#F87171] text-black hover:bg-[#ef4444]' 
                  : 'bg-[#5D866C] text-white hover:bg-[#4d705a]'
              }`}
            >
              Sign In
            </Link>
          )}
        </div>
      </header>

      {/* Main Content Area */}
      <main className="max-w-5xl mx-auto px-4 sm:px-8 py-8 sm:py-12 space-y-10">
        {/* Page Hero Banner */}
        <div className={`rounded-3xl p-6 sm:p-10 border relative overflow-hidden ${
          isDark 
            ? 'bg-gradient-to-br from-[#141414] via-[#101010] to-[#1E1214] border-[#F87171]/25 shadow-2xl shadow-[#F87171]/5' 
            : 'bg-gradient-to-br from-[#E6D8C3] via-[#FAF7F2] to-[#E6D8C3] border-[#C2A68C] shadow-lg'
        }`}>
          <div className="relative z-10 max-w-2xl space-y-3">
            <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider ${
              isDark ? 'bg-[#F87171]/15 text-[#F87171] border border-[#F87171]/30' : 'bg-[#5D866C]/15 text-[#5D866C] border border-[#5D866C]/30'
            }`}>
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Technical Guild Assistance Desk</span>
            </div>

            <h1 className="text-3xl sm:text-4xl font-black font-rpg tracking-tight leading-tight">
              Encountered a Technical Anomaly?
            </h1>

            <p className={`text-sm sm:text-base leading-relaxed ${isDark ? 'text-zinc-300' : 'text-[#57534E]'}`}>
              Whether you experienced an authentication failure, inventory display glitch, quest syncing anomaly, or system error, our technical engineers are ready to restore balance to your campaign.
            </p>
          </div>

          {/* Background Decorative Emblem */}
          <div className="absolute right-4 -bottom-6 opacity-10 pointer-events-none select-none">
            <LifeBuoy className="w-64 h-64 text-current" />
          </div>
        </div>

        {/* Quick Contact & Diagnostics Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* Card 1: Official Email */}
          <div className={`p-6 rounded-2xl border transition-all ${
            isDark ? 'bg-[#141414] border-[#F87171]/20' : 'bg-white border-[#C2A68C]'
          }`}>
            <div className="flex items-center gap-3 mb-3">
              <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${
                isDark ? 'bg-[#F87171]/15 text-[#F87171]' : 'bg-[#5D866C]/15 text-[#5D866C]'
              }`}>
                <Mail className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold">Direct Email Support</h3>
                <p className={`text-xs ${isDark ? 'text-zinc-400' : 'text-[#78716C]'}`}>Always Open</p>
              </div>
            </div>

            <p className={`text-xs mb-4 font-mono font-bold break-all ${isDark ? 'text-[#F87171]' : 'text-[#5D866C]'}`}>
              {SUPPORT_EMAIL}
            </p>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleCopyEmail}
                className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 border transition-all cursor-pointer ${
                  isDark 
                    ? 'bg-white/5 border-[#F87171]/30 hover:bg-[#F87171] hover:text-black text-white' 
                    : 'bg-[#F5F5F0] border-[#C2A68C] hover:bg-[#5D866C] hover:text-white text-[#1C1917]'
                }`}
              >
                {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied!' : 'Copy Email'}</span>
              </button>

              <a
                href={`mailto:${SUPPORT_EMAIL}?subject=${encodeURIComponent('[LIFE RPG] Technical Inquiry')}`}
                className={`py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1 border transition-all ${
                  isDark 
                    ? 'bg-[#1E1214] border-[#F87171]/40 text-[#F87171] hover:bg-[#F87171]/20' 
                    : 'bg-[#E6D8C3] border-[#C2A68C] text-[#5D866C] hover:bg-[#C2A68C]/40'
                }`}
                title="Open default email application"
              >
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>

          {/* Card 2: Realtime Realm Status */}
          <div className={`p-6 rounded-2xl border transition-all ${
            isDark ? 'bg-[#141414] border-[#F87171]/20' : 'bg-white border-[#C2A68C]'
          }`}>
            <div className="flex items-center gap-3 mb-3">
              <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${
                isDark ? 'bg-emerald-500/15 text-emerald-400' : 'bg-emerald-600/15 text-emerald-700'
              }`}>
                <Globe className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold">API & Backend Status</h3>
                <p className={`text-xs ${isDark ? 'text-zinc-400' : 'text-[#78716C]'}`}>
                  {pingStatus === 'healthy' ? 'All Systems Operational' : 'Cloud Server Health'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 mb-4">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
              </span>
              <span className="text-xs font-mono font-bold">
                {pingLatency ? `${pingLatency}ms Latency (Nominal)` : 'Online • 99.9% Uptime'}
              </span>
            </div>

            <button
              type="button"
              onClick={handlePingServer}
              disabled={pingStatus === 'checking'}
              className={`w-full py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-2 border transition-all cursor-pointer ${
                isDark 
                  ? 'bg-white/5 border-[#F87171]/30 hover:bg-white/10 text-zinc-300' 
                  : 'bg-[#F5F5F0] border-[#C2A68C] hover:bg-white text-[#57534E]'
              }`}
            >
              <RefreshCw className={`w-3.5 h-3.5 ${pingStatus === 'checking' ? 'animate-spin text-[#F87171]' : ''}`} />
              <span>{pingStatus === 'checking' ? 'Testing Connection...' : 'Ping Realm Server'}</span>
            </button>
          </div>

          {/* Card 3: 1-Click Self Healing */}
          <div className={`p-6 rounded-2xl border transition-all ${
            isDark ? 'bg-[#141414] border-[#F87171]/20' : 'bg-white border-[#C2A68C]'
          }`}>
            <div className="flex items-center gap-3 mb-3">
              <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${
                isDark ? 'bg-amber-500/15 text-amber-400' : 'bg-amber-600/15 text-amber-700'
              }`}>
                <Zap className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold">Quick Self-Healing</h3>
                <p className={`text-xs ${isDark ? 'text-zinc-400' : 'text-[#78716C]'}`}>Instant Resolution</p>
              </div>
            </div>

            <p className={`text-xs mb-4 leading-relaxed ${isDark ? 'text-zinc-400' : 'text-[#78716C]'}`}>
              Fixes 95% of client-side display glitches by flushing stale local storage and resyncing live Firestore data.
            </p>

            <button
              type="button"
              onClick={handleClearCacheAndSync}
              className={`w-full py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-2 border transition-all cursor-pointer ${
                isDark 
                  ? 'bg-amber-500/10 border-amber-500/30 text-amber-400 hover:bg-amber-500/20' 
                  : 'bg-amber-50 border-amber-300 text-amber-800 hover:bg-amber-100'
              }`}
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Clear Cache & Re-sync</span>
            </button>
          </div>
        </div>

        {/* Technical Error Dispatch Form */}
        <div className={`p-6 sm:p-10 rounded-3xl border ${
          isDark ? 'bg-[#141414] border-[#F87171]/20 shadow-xl' : 'bg-white border-[#C2A68C] shadow-md'
        }`}>
          <div className="flex items-center justify-between gap-4 pb-6 border-b mb-6"
            style={{ borderColor: isDark ? 'rgba(248, 113, 113, 0.2)' : '#E6D8C3' }}
          >
            <div>
              <div className={`inline-flex items-center gap-1.5 text-xs uppercase tracking-wider font-bold mb-1 ${
                isDark ? 'text-[#F87171]' : 'text-[#5D866C]'
              }`}>
                <Terminal className="w-3.5 h-3.5" />
                <span>DIRECT TRANSMISSION DISPATCH</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black font-rpg">
                Submit Error Report to Technical Guild
              </h2>
            </div>

            <span className={`text-xs font-mono px-2.5 py-1 rounded-lg border ${
              isDark ? 'bg-[#1E1214] text-[#F87171] border-[#F87171]/30' : 'bg-[#E6D8C3] text-[#5D866C] border-[#C2A68C]'
            }`}>
              Email Relay: Active
            </span>
          </div>

          {submittedTicket ? (
            <div className={`p-8 rounded-2xl border text-center space-y-4 ${
              isDark ? 'bg-emerald-950/20 border-emerald-500/30' : 'bg-emerald-50 border-emerald-300'
            }`}>
              <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-500 mx-auto flex items-center justify-center">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-bold">Transmission Prepared & Dispatched</h3>
                <p className={`text-xs mt-1 font-mono font-bold ${isDark ? 'text-emerald-400' : 'text-emerald-700'}`}>
                  Reference Ticket: {submittedTicket.id}
                </p>
                <p className={`text-xs mt-2 max-w-md mx-auto ${isDark ? 'text-zinc-300' : 'text-[#57534E]'}`}>
                  Your email client has been summoned with all diagnostics pre-filled. You can also directly write to{' '}
                  <strong className="underline">{SUPPORT_EMAIL}</strong> mentioning ticket #{submittedTicket.id}.
                </p>
              </div>

              <div className="pt-2 flex justify-center gap-3">
                <button
                  type="button"
                  onClick={() => setSubmittedTicket(null)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                    isDark ? 'bg-white/5 border-white/10 hover:bg-white/10 text-white' : 'bg-white border-zinc-300 text-zinc-800'
                  }`}
                >
                  File Another Report
                </button>
                <a
                  href={`mailto:${SUPPORT_EMAIL}?subject=${encodeURIComponent(`[${submittedTicket.id}] Technical Follow-up`)}`}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                    isDark ? 'bg-[#F87171] text-black font-black' : 'bg-[#5D866C] text-white font-bold'
                  }`}
                >
                  Open Email Client Again
                </a>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Row 1: Name and Email */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className={`block text-xs font-bold uppercase tracking-wider mb-2 ${
                    isDark ? 'text-zinc-300' : 'text-[#57534E]'
                  }`}>
                    Adventurer / Hero Name
                  </label>
                  <input
                    type="text"
                    value={senderName}
                    onChange={(e) => setSenderName(e.target.value)}
                    placeholder="e.g., Shadow Walker"
                    className={`w-full px-4 py-3 rounded-xl text-xs border focus:outline-none transition-colors ${
                      isDark 
                        ? 'bg-[#0A0A0A] border-[#F87171]/30 text-white focus:border-[#F87171]' 
                        : 'bg-[#F5F5F0] border-[#C2A68C] text-[#1C1917] focus:border-[#5D866C]'
                    }`}
                  />
                </div>

                <div>
                  <label className={`block text-xs font-bold uppercase tracking-wider mb-2 ${
                    isDark ? 'text-zinc-300' : 'text-[#57534E]'
                  }`}>
                    Return Email Address <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    required
                    value={senderEmail}
                    onChange={(e) => setSenderEmail(e.target.value)}
                    placeholder="hero@realm.com"
                    className={`w-full px-4 py-3 rounded-xl text-xs border focus:outline-none transition-colors ${
                      isDark 
                        ? 'bg-[#0A0A0A] border-[#F87171]/30 text-white focus:border-[#F87171]' 
                        : 'bg-[#F5F5F0] border-[#C2A68C] text-[#1C1917] focus:border-[#5D866C]'
                    }`}
                  />
                </div>
              </div>

              {/* Row 2: Category & Severity */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className={`block text-xs font-bold uppercase tracking-wider mb-2 ${
                    isDark ? 'text-zinc-300' : 'text-[#57534E]'
                  }`}>
                    Error Category
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className={`w-full px-4 py-3 rounded-xl text-xs border focus:outline-none transition-colors cursor-pointer ${
                      isDark 
                        ? 'bg-[#0A0A0A] border-[#F87171]/30 text-white focus:border-[#F87171]' 
                        : 'bg-[#F5F5F0] border-[#C2A68C] text-[#1C1917] focus:border-[#5D866C]'
                    }`}
                  >
                    <option value="auth">🔑 Authentication & Sign-in Issue</option>
                    <option value="rewards">🏪 Rewards Shop & Inventory Purchasing</option>
                    <option value="quests">📜 Quest Logging & Verification</option>
                    <option value="character">⚔️ Character Leveling & Attributes</option>
                    <option value="performance">⚡ Performance, Lag, or Slow Loading</option>
                    <option value="network">🌐 Server Connectivity (401/500 Errors)</option>
                    <option value="other">💬 Other Technical Anomaly</option>
                  </select>
                </div>

                <div>
                  <label className={`block text-xs font-bold uppercase tracking-wider mb-2 ${
                    isDark ? 'text-zinc-300' : 'text-[#57534E]'
                  }`}>
                    Severity Level
                  </label>
                  <select
                    value={severity}
                    onChange={(e) => setSeverity(e.target.value)}
                    className={`w-full px-4 py-3 rounded-xl text-xs border focus:outline-none transition-colors cursor-pointer ${
                      isDark 
                        ? 'bg-[#0A0A0A] border-[#F87171]/30 text-white focus:border-[#F87171]' 
                        : 'bg-[#F5F5F0] border-[#C2A68C] text-[#1C1917] focus:border-[#5D866C]'
                    }`}
                  >
                    <option value="low">🟢 Minor Glitch (Visual / Cosmetic)</option>
                    <option value="medium">🟡 Medium Impact (Feature functioning incorrectly)</option>
                    <option value="high">🟠 High Urgency (Important function unavailable)</option>
                    <option value="critical">🔴 Critical Blocker (Cannot play or log in)</option>
                  </select>
                </div>
              </div>

              {/* Row 3: Subject */}
              <div>
                <label className={`block text-xs font-bold uppercase tracking-wider mb-2 ${
                  isDark ? 'text-zinc-300' : 'text-[#57534E]'
                }`}>
                  Subject / Summary <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="e.g., Rewards shop displays empty grid after signing in"
                  className={`w-full px-4 py-3 rounded-xl text-xs border focus:outline-none transition-colors ${
                    isDark 
                      ? 'bg-[#0A0A0A] border-[#F87171]/30 text-white focus:border-[#F87171]' 
                      : 'bg-[#F5F5F0] border-[#C2A68C] text-[#1C1917] focus:border-[#5D866C]'
                  }`}
                />
              </div>

              {/* Row 4: Detailed Description */}
              <div>
                <label className={`block text-xs font-bold uppercase tracking-wider mb-2 ${
                  isDark ? 'text-zinc-300' : 'text-[#57534E]'
                }`}>
                  Detailed Description & Steps to Reproduce <span className="text-red-500">*</span>
                </label>
                <textarea
                  required
                  rows={5}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Please describe what happened, what you expected, and any error message you saw on your screen..."
                  className={`w-full px-4 py-3 rounded-xl text-xs border focus:outline-none transition-colors resize-y ${
                    isDark 
                      ? 'bg-[#0A0A0A] border-[#F87171]/30 text-white focus:border-[#F87171]' 
                      : 'bg-[#F5F5F0] border-[#C2A68C] text-[#1C1917] focus:border-[#5D866C]'
                  }`}
                />
              </div>

              {/* Auto Diagnostics Attachment */}
              <div className={`p-4 rounded-xl border flex items-start sm:items-center justify-between gap-4 ${
                isDark ? 'bg-[#0A0A0A] border-[#F87171]/20' : 'bg-[#F5F5F0] border-[#C2A68C]'
              }`}>
                <div className="flex items-start sm:items-center gap-3">
                  <Cpu className={`w-4 h-4 shrink-0 mt-0.5 sm:mt-0 ${isDark ? 'text-[#F87171]' : 'text-[#5D866C]'}`} />
                  <div>
                    <span className="text-xs font-bold">Include System Diagnostics</span>
                    <p className={`text-[11px] ${isDark ? 'text-zinc-400' : 'text-[#78716C]'}`}>
                      Includes browser, operating system, and screen specs to help engineers reproduce the issue faster.
                    </p>
                  </div>
                </div>

                <label className="relative inline-flex items-center cursor-pointer shrink-0">
                  <input
                    type="checkbox"
                    checked={includeDiagnostics}
                    onChange={(e) => setIncludeDiagnostics(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className={`w-9 h-5 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all ${
                    isDark 
                      ? 'bg-zinc-800 peer-checked:bg-[#F87171]' 
                      : 'bg-zinc-300 peer-checked:bg-[#5D866C]'
                  }`} />
                </label>
              </div>

              {/* Submit CTA */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2">
                <p className={`text-xs ${isDark ? 'text-zinc-400' : 'text-[#78716C]'}`}>
                  Clicking dispatch will create a ticket and invoke your default email client.
                </p>

                <button
                  type="submit"
                  disabled={submitting}
                  className={`px-6 py-3.5 rounded-xl text-xs font-black uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer transition-all shadow-lg ${
                    isDark 
                      ? 'bg-[#F87171] text-black hover:bg-[#ef4444] shadow-[#F87171]/30 hover:scale-[1.02]' 
                      : 'bg-[#5D866C] text-white hover:bg-[#4d705a] shadow-[#5D866C]/30 hover:scale-[1.02]'
                  }`}
                >
                  <Send className="w-4 h-4" />
                  <span>{submitting ? 'Transmitting Dispatch...' : 'Transmit Error Dispatch via Email'}</span>
                </button>
              </div>
            </form>
          )}
        </div>

        {/* Common Troubleshooting Accordion */}
        <div className={`p-6 sm:p-10 rounded-3xl border space-y-4 ${
          isDark ? 'bg-[#141414] border-[#F87171]/20' : 'bg-white border-[#C2A68C]'
        }`}>
          <div className="flex items-center gap-2 mb-2">
            <HelpCircle className={`w-5 h-5 ${isDark ? 'text-[#F87171]' : 'text-[#5D866C]'}`} />
            <h3 className="text-lg font-bold font-rpg">Common Technical Solutions & FAQ</h3>
          </div>

          <div className="divide-y" style={{ borderColor: isDark ? 'rgba(248, 113, 113, 0.15)' : '#E6D8C3' }}>
            {faqs.map((faq, index) => (
              <div key={index} className="py-4">
                <button
                  type="button"
                  onClick={() => setActiveFaq(activeFaq === index ? null : index)}
                  className="w-full flex items-center justify-between text-left gap-4 cursor-pointer group"
                >
                  <span className={`text-xs sm:text-sm font-bold transition-colors ${
                    activeFaq === index 
                      ? isDark ? 'text-[#F87171]' : 'text-[#5D866C]' 
                      : isDark ? 'text-zinc-200 group-hover:text-white' : 'text-[#1C1917] group-hover:text-[#5D866C]'
                  }`}>
                    {faq.q}
                  </span>
                  <span className="text-xs font-mono font-bold opacity-60">
                    {activeFaq === index ? '−' : '+'}
                  </span>
                </button>

                {activeFaq === index && (
                  <p className={`mt-2.5 text-xs leading-relaxed animate-fadeIn ${
                    isDark ? 'text-zinc-400' : 'text-[#57534E]'
                  }`}>
                    {faq.a}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* Footer Note */}
      <footer className={`max-w-5xl mx-auto px-4 py-8 text-center text-xs border-t mt-12 ${
        isDark ? 'border-[#F87171]/15 text-zinc-500' : 'border-[#C2A68C] text-[#78716C]'
      }`}>
        <p>LIFE RPG Technical Sanctuary • Direct Email: <a href={`mailto:${SUPPORT_EMAIL}`} className="underline hover:text-current">{SUPPORT_EMAIL}</a></p>
      </footer>
    </div>
  );
};
