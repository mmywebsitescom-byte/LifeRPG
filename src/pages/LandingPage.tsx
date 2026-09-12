import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { 
  Sparkles, 
  Flame, 
  Award, 
  Target, 
  Coins, 
  ArrowRight, 
  Brain, 
  TrendingUp, 
  UserCheck, 
  Compass, 
  ShieldCheck, 
  Shield, 
  Star,
  LifeBuoy,
  Mail,
  Copy,
  Check
} from 'lucide-react';
import { useGame } from '../context/GameContext';
import { useTheme } from '../context/ThemeContext';
import { HowItWorksStrip } from '../components/common/HowItWorksStrip';
import PillNav, { PillNavItem } from '../components/common/PillNav';
import BorderGlow from '../components/common/BorderGlow';
import { ThemeToggle } from '../components/common/ThemeToggle';
// ── Scroll Reveal Animation Variants ─────────────────────────────────────────
const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.05,
    },
  },
};

const staggerItem = {
  hidden: { opacity: 0, y: 30, scale: 0.96 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      type: 'spring',
      damping: 20,
      stiffness: 120,
    },
  },
};

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};

export const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useGame();
  const { isDark } = useTheme();
  const [copiedEmail, setCopiedEmail] = React.useState(false);

  // If the user is authenticated
  const isAuthenticated = Boolean(user && user.email);

  const handleCopySupportEmail = () => {
    navigator.clipboard.writeText('support@liferpg.dev');
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 2000);
  };

  const handleCtaAction = () => {
    if (isAuthenticated) {
      navigate('/dashboard');
    } else {
      navigate('/login');
    }
  };

  const progressionSteps = [
    { label: 'TASK', desc: 'Real-world habit or goal', icon: Target, color: isDark ? 'text-[#F87171]' : 'text-[#5D866C]' },
    { label: 'XP', desc: 'Instant feedback loop', icon: Sparkles, color: isDark ? 'text-[#F87171]' : 'text-[#5D866C]' },
    { label: 'LEVEL', desc: 'Character ascension', icon: TrendingUp, color: isDark ? 'text-rose-400' : 'text-purple-600' },
    { label: 'CHARACTER', desc: 'Stat growth & equipment', icon: UserCheck, color: isDark ? 'text-red-400' : 'text-emerald-600' },
    { label: 'REWARDS', desc: 'Shop gear & pride', icon: Coins, color: isDark ? 'text-[#FCA5A5]' : 'text-[#B45309]' },
  ];

  const features = [
    {
      icon: Target,
      title: '⚔ Real-Life Quests',
      description: 'Turn study sessions, gym workouts, and coding milestones into epic bounties with tangible rewards.',
    },
    {
      icon: Flame,
      title: '🔥 Daily Habit Streaks',
      description: 'Build indestructible discipline. Maintain momentum with streak shields and unlock exponential multiplier rewards.',
    },
    {
      icon: Brain,
      title: '🧬 Attribute Progression',
      description: 'Level up 6 real-life stats: Strength, Intelligence, Wisdom, Discipline, Endurance, and Creativity.',
    },
    {
      icon: Coins,
      title: '🪙 The Mystic Armory',
      description: 'Spend earned gold coins on legendary equipment, badges, and customizable avatar vanity gear.',
    },
    {
      icon: ShieldCheck,
      title: '🛡 Guilds & Parties',
      description: 'Form adventuring parties with colleagues and friends. Defeat procrastination dungeon bosses together.',
    },
    {
      icon: Award,
      title: '🏆 Epic Achievements',
      description: 'Unlock feats of glory as you hit 100 completed quests, 30-day streaks, and polymath masteries.',
    },
  ];

  const landingNavItems: PillNavItem[] = [
    { label: 'Home', href: '/' },
    { label: 'About', href: '#about' },
    { label: 'How It Works', href: '/how-it-works' },
    { label: 'Support', href: '#support' },
  ];

  const handleNavItemClick = (item: PillNavItem) => {
    if (item.href === '#about') {
      const el = document.getElementById('about');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    } else if (item.href === '#support') {
      const el = document.getElementById('support');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    } else if (item.href === '/' || item.href === '#') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <div className={`min-h-screen transition-colors duration-300 flex flex-col ${
      isDark 
        ? 'bg-[#0A0A0A] text-[#FAFAFA] selection:bg-[#F87171] selection:text-black' 
        : 'bg-[#F5F5F0] text-[#1C1917] selection:bg-[#C2A68C] selection:text-[#5D866C]'
    }`}>
      {/* Header - Buttons only, no header bar */}
      <header className="sticky top-0 z-40 w-full px-4 sm:px-10 py-4 flex items-center justify-between gap-4 pointer-events-none">
        {/* Invisible spacer on left to keep pill nav centered on desktop */}
        <div className="hidden sm:block w-28 shrink-0" />

        {/* PillNav Buttons: Home, About, How It Works */}
        <div className="flex-1 flex justify-center pointer-events-auto">
          <PillNav
            items={landingNavItems}
            baseColor={isDark ? '#141414' : '#FFFFFF'}
            pillColor={isDark ? '#F87171' : '#5D866C'}
            pillTextColor={isDark ? '#FAFAFA' : '#1C1917'}
            hoveredPillTextColor={isDark ? '#000000' : '#FFFFFF'}
            ease="power3.out"
            onItemClick={handleNavItemClick}
          />
        </div>

        {/* Right Corner Buttons: Theme Toggle & Get Started */}
        <div className="flex items-center gap-3 shrink-0 pointer-events-auto">
          <ThemeToggle />

          <button
            type="button"
            id="landing-cta-get-started"
            onClick={handleCtaAction}
            className={`px-5 py-2.5 rounded-full font-bold text-xs uppercase tracking-wider transition-all hover:scale-105 cursor-pointer flex items-center gap-1.5 ${
              isDark 
                ? 'bg-[#F87171] hover:bg-[#EF4444] text-black shadow-lg shadow-[#F87171]/30' 
                : 'bg-[#5D866C] hover:bg-[#4B6E57] text-white shadow-md shadow-[#5D866C]/30'
            }`}
          >
            <span>{isAuthenticated ? 'Go Dashboard' : 'Get Started'}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-16 sm:pt-24 pb-20 px-6 sm:px-12 w-full flex flex-col items-center text-center overflow-hidden">


        {/* Big Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className={`relative z-10 text-4xl sm:text-6xl lg:text-7xl font-black font-rpg tracking-tight max-w-4xl leading-tight mb-6 ${
            isDark ? 'text-white drop-shadow-lg' : 'text-[#1C1917]'
          }`}
        >
          LEVEL UP YOUR <span className={isDark ? 'text-[#F87171]' : 'text-[#5D866C]'}>LIFE</span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.5 }}
          className={`relative z-10 text-lg sm:text-xl max-w-2xl font-medium mb-10 leading-relaxed ${
            isDark ? 'text-zinc-300' : 'text-[#57534E]'
          }`}
        >
          “Turn your real-world goals into epic quests.”
          <br />
          <span className={`text-sm ${isDark ? 'text-zinc-400' : 'text-[#78716C]'}`}>
            Don't just complete your tasks. Transform studying, coding, and fitness into an exhilarating RPG adventure.
          </span>
        </motion.p>

        {/* Primary Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="relative z-10 flex flex-col sm:flex-row items-center gap-4 mb-16"
        >
          <button
            type="button"
            id="hero-primary-start-journey"
            onClick={handleCtaAction}
            className={`w-full sm:w-auto px-8 py-4 rounded-2xl font-black text-sm uppercase tracking-wider hover:scale-105 transition-all flex items-center justify-center gap-2.5 cursor-pointer ${
              isDark 
                ? 'bg-[#F87171] hover:bg-[#EF4444] text-black shadow-xl shadow-[#F87171]/25' 
                : 'bg-[#5D866C] hover:bg-[#4B6E57] text-white shadow-lg shadow-[#5D866C]/30'
            }`}
          >
            <span>{isAuthenticated ? 'Go Dashboard' : 'Get Started'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
          <button
            type="button"
            id="hero-secondary-dashboard-preview"
            onClick={() => navigate(isAuthenticated ? '/quests' : '/login')}
            className={`w-full sm:w-auto px-8 py-4 rounded-2xl border font-bold text-sm uppercase tracking-wider transition-all cursor-pointer shadow-sm ${
              isDark 
                ? 'bg-[#141414] hover:bg-[#1E1719] text-white border-[#F87171]/30 hover:border-[#F87171]' 
                : 'bg-white hover:bg-[#E6D8C3] text-[#1C1917] border-[#C2A68C]'
            }`}
          >
            {isAuthenticated ? 'Open Quests' : 'Sign In'}
          </button>
        </motion.div>

        {/* Core Loop Progression Pipeline */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.5 }}
          className={`relative z-10 w-full max-w-4xl p-6 rounded-3xl border mb-16 shadow-lg transition-colors ${
            isDark 
              ? 'bg-[#141414]/80 border-[#F87171]/20 shadow-black backdrop-blur-sm' 
              : 'bg-white/80 border-[#C2A68C] backdrop-blur-sm'
          }`}
        >
          <div className={`text-xs uppercase font-bold tracking-widest mb-6 ${
            isDark ? 'text-[#F87171]' : 'text-[#78716C]'
          }`}>
            The Hero's Progression Loop
          </div>
          <motion.div 
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            className="grid grid-cols-1 sm:grid-cols-5 gap-3"
          >
            {progressionSteps.map((step, idx) => {
              const Icon = step.icon;
              return (
                <motion.div 
                  variants={staggerItem}
                  key={idx} 
                  className={`relative flex flex-col items-center p-3 rounded-2xl border text-center transition-colors ${
                  isDark 
                    ? 'bg-[#1A1315] border-[#F87171]/25' 
                    : 'bg-[#F5F5F0] border-[#C2A68C]'
                }`}>
                  <div className={`w-9 h-9 rounded-xl border flex items-center justify-center mb-2 ${
                    isDark 
                      ? 'bg-[#24171A] border-[#F87171]/30' 
                      : 'bg-white border-[#C2A68C]'
                  } ${step.color}`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <span className={`font-mono font-bold text-xs ${isDark ? 'text-white' : 'text-[#1C1917]'}`}>
                    {step.label}
                  </span>
                  <span className={`text-[10px] mt-0.5 ${isDark ? 'text-zinc-400' : 'text-[#78716C]'}`}>
                    {step.desc}
                  </span>
                </motion.div>
              );
            })}
          </motion.div>
        </motion.div>
      </section>

      {/* Feature Section with glowing highlighted border cards */}
      <section id="features" className="py-20 px-6 sm:px-12 max-w-7xl mx-auto w-full">
        <motion.div 
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          className="text-center max-w-2xl mx-auto mb-16"
        >
          <h2 className={`text-3xl sm:text-4xl font-extrabold font-rpg mb-4 ${
            isDark ? 'text-white' : 'text-[#1C1917]'
          }`}>
            EVERYTHING YOU NEED TO LEVEL UP
          </h2>
          <p className={`text-sm ${isDark ? 'text-zinc-400' : 'text-[#78716C]'}`}>
            Engineered with game theory mechanics to keep you focused, motivated, and perpetually growing.
          </p>
        </motion.div>

        <motion.div 
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {features.map((feat, idx) => (
            <motion.div variants={staggerItem} key={idx} className="h-full">
              <BorderGlow
                borderRadius={20}
                className="h-full"
              >
                <div className="p-6 h-full flex flex-col justify-between">
                  <div>
                    <h3 className={`text-base font-bold font-rpg mb-2.5 ${
                      isDark ? 'text-white' : 'text-[#1C1917]'
                    }`}>
                      {feat.title}
                    </h3>
                    <p className={`text-xs leading-relaxed ${
                      isDark ? 'text-zinc-400' : 'text-[#57534E]'
                    }`}>
                      {feat.description}
                    </p>
                  </div>
                </div>
              </BorderGlow>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* About Section with glowing highlighted border cards */}
      <section id="about" className={`py-20 px-6 sm:px-12 max-w-7xl mx-auto w-full border-t transition-colors ${
        isDark ? 'border-[#F87171]/20' : 'border-[#C2A68C]/50'
      }`}>
        <motion.div 
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          className="text-center max-w-2xl mx-auto mb-16"
        >
          <div className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold tracking-wide mb-4 shadow-sm border ${
            isDark 
              ? 'bg-[#1C1214] border-[#F87171]/40 text-[#F87171]' 
              : 'bg-[#E6D8C3] border-[#C2A68C] text-[#5D866C]'
          }`}>
            <Compass className="w-3.5 h-3.5" />
            <span>THE MANIFESTO</span>
          </div>
          <h2 className={`text-3xl sm:text-4xl font-extrabold font-rpg mb-4 ${
            isDark ? 'text-white' : 'text-[#1C1917]'
          }`}>
            ABOUT LIFE RPG
          </h2>
          <p className={`text-sm leading-relaxed ${
            isDark ? 'text-zinc-400' : 'text-[#78716C]'
          }`}>
            Human minds are hardwired for immediate adventure, clear objectives, and tangible feedback loops. 
            Traditional productivity apps treat your daily work like a tedious chore checklist. We transform your real-world goals into an epic quest for heroic mastery.
          </p>
        </motion.div>

        <motion.div 
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.15 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          <motion.div variants={staggerItem} className="h-full"><BorderGlow borderRadius={24} className="h-full">
            <div className="p-7 h-full flex flex-col justify-between">
              <div>
                <div className={`w-12 h-12 rounded-2xl border flex items-center justify-center mb-5 ${
                  isDark 
                    ? 'bg-[#241518] border-[#F87171]/40 text-[#F87171]' 
                    : 'bg-[#E6D8C3] border-[#C2A68C] text-[#5D866C]'
                }`}>
                  <Target className="w-6 h-6" />
                </div>
                <h3 className={`text-lg font-bold font-rpg mb-2 ${
                  isDark ? 'text-white' : 'text-[#1C1917]'
                }`}>
                  Real-World XP & Bounties
                </h3>
                <p className={`text-xs leading-relaxed ${
                  isDark ? 'text-zinc-400' : 'text-[#57534E]'
                }`}>
                  Whether mastering an algorithm, lifting weights, or writing research notes, each focused session rewards you with XP, virtual gold, and attribute growth.
                </p>
              </div>
              <div className={`mt-6 pt-4 border-t text-[11px] font-mono font-bold ${
                isDark ? 'border-[#F87171]/20 text-[#F87171]' : 'border-[#C2A68C]/40 text-[#5D866C]'
              }`}>
                Attribute Impact • STR • INT • DIS
              </div>
            </div>
          </BorderGlow></motion.div>

          <motion.div variants={staggerItem} className="h-full"><BorderGlow borderRadius={24} className="h-full">
            <div className="p-7 h-full flex flex-col justify-between">
              <div>
                <div className={`w-12 h-12 rounded-2xl border flex items-center justify-center mb-5 ${
                  isDark 
                    ? 'bg-[#241518] border-[#F87171]/40 text-[#F87171]' 
                    : 'bg-[#E6D8C3] border-[#C2A68C] text-[#5D866C]'
                }`}>
                  <Brain className="w-6 h-6" />
                </div>
                <h3 className={`text-lg font-bold font-rpg mb-2 ${
                  isDark ? 'text-white' : 'text-[#1C1917]'
                }`}>
                  Behavioral Game Science
                </h3>
                <p className={`text-xs leading-relaxed ${
                  isDark ? 'text-zinc-400' : 'text-[#57534E]'
                }`}>
                  By bridging micro-celebrations with long-term ascension milestones, Life RPG reduces procrastination friction and fosters joyful, sustainable habits.
                </p>
              </div>
              <div className={`mt-6 pt-4 border-t text-[11px] font-mono font-bold ${
                isDark ? 'border-[#F87171]/20 text-[#F87171]' : 'border-[#C2A68C]/40 text-[#5D866C]'
              }`}>
                Dopamine Loops • Zero Burnout
              </div>
            </div>
          </BorderGlow></motion.div>

          <motion.div variants={staggerItem} className="h-full"><BorderGlow borderRadius={24} className="h-full">
            <div className="p-7 h-full flex flex-col justify-between">
              <div>
                <div className={`w-12 h-12 rounded-2xl border flex items-center justify-center mb-5 ${
                  isDark 
                    ? 'bg-[#241518] border-[#F87171]/40 text-[#F87171]' 
                    : 'bg-[#E6D8C3] border-[#C2A68C] text-[#5D866C]'
                }`}>
                  <Coins className="w-6 h-6" />
                </div>
                <h3 className={`text-lg font-bold font-rpg mb-2 ${
                  isDark ? 'text-white' : 'text-[#1C1917]'
                }`}>
                  The Mystic Marketplace
                </h3>
                <p className={`text-xs leading-relaxed ${
                  isDark ? 'text-zinc-400' : 'text-[#57534E]'
                }`}>
                  Trade your earned gold coins for custom real-life treats (coffee, reading hour, guilt-free relaxation) or prestige virtual vanity cosmetics.
                </p>
              </div>
              <div className={`mt-6 pt-4 border-t text-[11px] font-mono font-bold ${
                isDark ? 'border-[#F87171]/20 text-[#F87171]' : 'border-[#C2A68C]/40 text-[#5D866C]'
              }`}>
                Self-Defined Rewards • Real Pride
              </div>
            </div>
          </BorderGlow></motion.div>
        </motion.div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-20 px-4 sm:px-8 max-w-7xl mx-auto w-full">
        <motion.div 
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          className="text-center max-w-2xl mx-auto mb-14"
        >
          <div className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold tracking-wide mb-4 shadow-sm border ${
            isDark 
              ? 'bg-[#1C1214] border-[#F87171]/40 text-[#F87171]' 
              : 'bg-[#E6D8C3] border-[#C2A68C] text-[#5D866C]'
          }`}>
            <Sparkles className="w-3.5 h-3.5" />
            <span>PROGRESSION ENGINE</span>
          </div>
          <h2 className={`text-3xl sm:text-4xl font-extrabold font-rpg mb-4 ${
            isDark ? 'text-white' : 'text-[#1C1917]'
          }`}>
            HOW IT WORKS
          </h2>
          <p className={`text-sm ${isDark ? 'text-zinc-400' : 'text-[#78716C]'}`}>
            Hover over any step to reveal its progression mechanic and interactive action loop.
          </p>
        </motion.div>

        <HowItWorksStrip />
      </section>

      {/* Final Call to Action */}
      <section id="rewards" className="py-20 px-6 sm:px-12 max-w-5xl mx-auto w-full text-center">
        <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.3 }} className={`p-8 sm:p-12 rounded-3xl border-2 shadow-xl relative overflow-hidden transition-colors ${
          isDark 
            ? 'bg-[#181113] border-[#F87171]/50 shadow-black' 
            : 'bg-[#E6D8C3] border-[#C2A68C]'
        }`}>
          <h2 className={`text-3xl sm:text-4xl font-black font-rpg mb-4 ${
            isDark ? 'text-white' : 'text-[#1C1917]'
          }`}>
            BEGIN YOUR JOURNEY
          </h2>
          <p className={`text-sm max-w-lg mx-auto mb-8 ${
            isDark ? 'text-zinc-300' : 'text-[#57534E]'
          }`}>
            Your real-world destiny awaits. Create your character and start claiming bounties today.
          </p>
          <button
            type="button"
            onClick={handleCtaAction}
            className={`px-10 py-4 rounded-2xl font-black text-sm uppercase tracking-wider hover:scale-105 transition-all cursor-pointer ${
              isDark 
                ? 'bg-[#F87171] hover:bg-[#EF4444] text-black shadow-xl shadow-[#F87171]/30' 
                : 'bg-[#5D866C] hover:bg-[#4B6E57] text-white shadow-lg shadow-[#5D866C]/30'
            }`}
          >
            {isAuthenticated ? 'Go Dashboard' : 'Get Started'}
          </button>
        </motion.div>
      </section>

      {/* Support Section on Landing Page */}
      <section id="support" className="py-8 px-6 sm:px-12 max-w-5xl mx-auto w-full">
        <div className={`p-6 sm:p-8 rounded-3xl border transition-all ${
          isDark 
            ? 'bg-gradient-to-br from-[#141414] via-[#120F10] to-[#1E1214] border-[#F87171]/30 shadow-xl shadow-[#F87171]/5' 
            : 'bg-gradient-to-br from-[#FAF7F2] via-[#E6D8C3]/50 to-[#FAF7F2] border-[#C2A68C] shadow-md'
        }`}>
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
            <div className="space-y-2.5 max-w-xl">
              <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider ${
                isDark ? 'bg-[#F87171]/15 text-[#F87171] border border-[#F87171]/30' : 'bg-[#5D866C]/15 text-[#5D866C] border border-[#5D866C]/30'
              }`}>
                <LifeBuoy className="w-3.5 h-3.5" />
                <span>Technical Support &amp; Incident Desk</span>
              </div>

              <h3 className={`text-xl sm:text-2xl font-black font-rpg tracking-tight ${
                isDark ? 'text-white' : 'text-[#1C1917]'
              }`}>
                Need Technical Assistance?
              </h3>

              <p className={`text-xs sm:text-sm leading-relaxed ${
                isDark ? 'text-zinc-300' : 'text-[#57534E]'
              }`}>
                Encountering an error, sign-in glitch, or syncing anomaly? Reach our technical engineers directly or contact us via email.
              </p>

              <div className="flex flex-wrap items-center gap-3 pt-1 text-xs">
                <span className="flex items-center gap-1.5 font-mono font-bold">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                  </span>
                  <span className={isDark ? 'text-zinc-400' : 'text-zinc-600'}>support@liferpg.dev</span>
                </span>
                <span className="opacity-40">•</span>
                <span className={`text-[11px] font-mono ${isDark ? 'text-zinc-400' : 'text-zinc-600'}`}>
                  Response: &lt; 24 Hours
                </span>
              </div>
            </div>

            {/* Support Actions */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 w-full lg:w-auto shrink-0">
              <button
                type="button"
                onClick={handleCopySupportEmail}
                className={`px-4 py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-2 border transition-all cursor-pointer ${
                  isDark 
                    ? 'bg-white/5 border-[#F87171]/30 hover:bg-white/10 text-white' 
                    : 'bg-white border-[#C2A68C] hover:bg-[#F5F5F0] text-[#1C1917]'
                }`}
              >
                {copiedEmail ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedEmail ? 'Email Copied!' : 'Copy Email'}</span>
              </button>

              <a
                href="mailto:support@liferpg.dev?subject=[LIFE%20RPG]%20Technical%20Assistance%20Request"
                className={`px-4 py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-2 border transition-all ${
                  isDark 
                    ? 'bg-[#1E1214] border-[#F87171]/40 text-[#F87171] hover:bg-[#F87171]/20' 
                    : 'bg-[#E6D8C3] border-[#C2A68C] text-[#5D866C] hover:bg-[#C2A68C]/40'
                }`}
              >
                <Mail className="w-3.5 h-3.5" />
                <span>Send Email</span>
              </a>

              <button
                type="button"
                onClick={() => navigate('/support')}
                className={`px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-md cursor-pointer ${
                  isDark 
                    ? 'bg-[#F87171] text-black hover:bg-[#ef4444] shadow-[#F87171]/25' 
                    : 'bg-[#5D866C] text-white hover:bg-[#4d705a] shadow-[#5D866C]/25'
                }`}
              >
                <span>Support Sanctuary</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Clean Footer */}
      <footer className={`mt-auto border-t py-8 px-6 sm:px-12 max-w-7xl mx-auto w-full flex flex-col sm:flex-row items-center justify-between gap-4 text-xs transition-colors ${
        isDark 
          ? 'border-[#F87171]/20 text-zinc-500' 
          : 'border-[#C2A68C] text-[#78716C]'
      }`}>
        <div className="flex items-center gap-2">
          <span className={`font-rpg font-bold ${isDark ? 'text-white' : 'text-[#1C1917]'}`}>⚔ LIFE RPG</span>
          <span>•</span>
          <span>“Don't just complete your tasks. Level up your life.”</span>
        </div>
        <div className="flex items-center gap-6">
          <span className={`cursor-pointer ${isDark ? 'hover:text-[#F87171]' : 'hover:text-[#1C1917]'}`} onClick={() => navigate('/login')}>Login</span>
          <span className={`cursor-pointer ${isDark ? 'hover:text-[#F87171]' : 'hover:text-[#1C1917]'}`} onClick={() => navigate('/support')}>Support</span>
          <span className={`cursor-pointer ${isDark ? 'hover:text-[#F87171]' : 'hover:text-[#1C1917]'}`} onClick={() => navigate(isAuthenticated ? '/dashboard' : '/login')}>{isAuthenticated ? 'Dashboard' : 'Sign In'}</span>
          <span>© 2026 Life RPG</span>
        </div>
      </footer>
    </div>
  );
};
