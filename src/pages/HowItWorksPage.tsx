import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Sparkles, Compass, ArrowRight, LifeBuoy, Mail } from 'lucide-react';
import { HowItWorksStrip } from '../components/common/HowItWorksStrip';
import PillNav, { PillNavItem } from '../components/common/PillNav';
import { useGame } from '../context/GameContext';
import { useTheme } from '../context/ThemeContext';
import { ThemeToggle } from '../components/common/ThemeToggle';

export const HowItWorksPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useGame();
  const { isDark } = useTheme();

  const isAuthenticated = Boolean(user && user.email);

  const navItems: PillNavItem[] = [
    { label: 'Home', href: '/' },
    { label: 'About', href: '/#about' },
    { label: 'How It Works', href: '/how-it-works' },
  ];

  const handleCtaAction = () => {
    if (isAuthenticated) {
      navigate('/dashboard');
    } else {
      navigate('/login');
    }
  };

  return (
    <div className={`min-h-screen flex flex-col transition-colors duration-300 ${
      isDark 
        ? 'bg-[#0A0A0A] text-[#FAFAFA] selection:bg-[#F87171] selection:text-black' 
        : 'bg-[#F5F5F0] text-[#1C1917] selection:bg-[#C2A68C] selection:text-[#5D866C]'
    }`}>
      {/* Top Header - clean, borderless floating buttons */}
      <header className="sticky top-0 z-40 w-full px-4 sm:px-10 py-4 flex items-center justify-between gap-4 pointer-events-none">
        <div className="flex items-center gap-4 shrink-0 pointer-events-auto">
          <Link
            to="/"
            className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${
              isDark 
                ? 'bg-[#141414] text-white hover:text-[#F87171]' 
                : 'bg-white text-[#1C1917] hover:text-[#5D866C]'
            }`}
            aria-label="Back to Home"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
        </div>

        {/* PillNav Header Bar Buttons */}
        <div className="flex-1 flex justify-center pointer-events-auto">
          <PillNav
            items={navItems}
            activeHref="/how-it-works"
            baseColor={isDark ? '#141414' : '#FFFFFF'}
            pillColor={isDark ? '#F87171' : '#5D866C'}
            pillTextColor={isDark ? '#FAFAFA' : '#1C1917'}
            hoveredPillTextColor={isDark ? '#000000' : '#FFFFFF'}
          />
        </div>

        {/* Right Corner: ThemeToggle & CTA Button */}
        <div className="flex items-center gap-3 shrink-0 pointer-events-auto">
          <ThemeToggle />

          <button
            type="button"
            id="howitworks-cta-get-started"
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

      {/* Main Content */}
      <main className="flex-1 py-12 sm:py-16 px-4 sm:px-8 max-w-7xl mx-auto w-full flex flex-col justify-center">
        {/* Title Section */}
        <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-14">
          <h1 className={`text-3xl sm:text-5xl font-black font-rpg tracking-tight mb-4 ${
            isDark ? 'text-white' : 'text-[#1C1917]'
          }`}>
            HOW IT WORKS
          </h1>
          <p className={`text-sm sm:text-base leading-relaxed ${
            isDark ? 'text-zinc-400' : 'text-[#57534E]'
          }`}>
            Hover your cursor across the steps below to explore how real-world habits transform into an epic RPG progression campaign.
          </p>
        </div>

        {/* The Interactive Strip matching image.png */}
        <HowItWorksStrip className="mb-14" />

        {/* Quick Help / Call to Action */}
        <div className={`p-6 sm:p-8 rounded-3xl shadow-md flex flex-col sm:flex-row items-center justify-between gap-6 text-center sm:text-left transition-colors ${
          isDark 
            ? 'bg-[#141414] shadow-black' 
            : 'bg-white shadow-sm'
        }`}>
          <div className="flex items-center gap-4">
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${
              isDark 
                ? 'bg-[#241518] text-[#F87171]' 
                : 'bg-[#E6D8C3] text-[#5D866C]'
            }`}>
              <Compass className="w-6 h-6" />
            </div>
            <div>
              <h3 className={`text-base font-bold font-rpg ${
                isDark ? 'text-white' : 'text-[#1C1917]'
              }`}>
                Ready to forge your adventurer destiny?
              </h3>
              <p className={`text-xs mt-0.5 ${
                isDark ? 'text-zinc-400' : 'text-[#78716C]'
              }`}>
                Join thousands of heroes conquering tasks with iron discipline.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => navigate(isAuthenticated ? '/quests' : '/login')}
              className={`px-6 py-3 rounded-xl font-bold text-xs uppercase tracking-wider transition-colors cursor-pointer border ${
                isDark 
                  ? 'bg-[#1C1719] hover:bg-[#251A1C] text-white border-[#F87171]/40' 
                  : 'bg-[#E6D8C3] hover:bg-[#C2A68C]/40 text-[#1C1917] border-[#C2A68C]'
              }`}
            >
              {isAuthenticated ? 'Open Quests' : 'Sign In'}
            </button>
            <button
              type="button"
              onClick={handleCtaAction}
              className={`px-6 py-3 rounded-xl font-black text-xs uppercase tracking-wider shadow-md transition-all hover:scale-105 cursor-pointer ${
                isDark 
                  ? 'bg-[#F87171] hover:bg-[#EF4444] text-black shadow-[#F87171]/30' 
                  : 'bg-[#5D866C] hover:bg-[#4B6E57] text-white shadow-[#5D866C]/30'
              }`}
            >
              {isAuthenticated ? 'Go Dashboard' : 'Get Started'}
            </button>
          </div>
        </div>

        {/* Small Support Section */}
        <div className={`mt-10 p-6 rounded-3xl border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 transition-all ${
          isDark 
            ? 'bg-[#141414] border-[#F87171]/25' 
            : 'bg-white border-[#C2A68C]'
        }`}>
          <div className="flex items-center gap-3.5">
            <div className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 ${
              isDark ? 'bg-[#F87171]/20 text-[#F87171]' : 'bg-[#5D866C]/20 text-[#5D866C]'
            }`}>
              <LifeBuoy className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold font-rpg">Need Technical Assistance?</h3>
              <p className={`text-xs ${isDark ? 'text-zinc-400' : 'text-[#78716C]'}`}>
                Contact our technical engineers at <span className="font-mono font-bold">support@liferpg.dev</span> or visit the support sanctuary.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <a
              href="mailto:support@liferpg.dev?subject=[LIFE%20RPG]%20Support"
              className={`px-4 py-2 rounded-xl text-xs font-bold border transition-all flex items-center gap-1.5 ${
                isDark ? 'bg-white/5 border-white/10 text-white hover:bg-white/10' : 'bg-[#F5F5F0] border-[#C2A68C] text-[#1C1917]'
              }`}
            >
              <Mail className="w-3.5 h-3.5" />
              <span>Email</span>
            </a>
            <button
              type="button"
              onClick={() => navigate('/support')}
              className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer ${
                isDark ? 'bg-[#F87171] text-black hover:bg-[#ef4444]' : 'bg-[#5D866C] text-white hover:bg-[#4d705a]'
              }`}
            >
              Support Page
            </button>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className={`mt-auto border-t py-8 px-6 sm:px-12 max-w-7xl mx-auto w-full flex flex-col sm:flex-row items-center justify-between gap-4 text-xs transition-colors ${
        isDark ? 'border-[#F87171]/20 text-zinc-500' : 'border-[#C2A68C] text-[#78716C]'
      }`}>
        <div className="flex items-center gap-2">
          <span className={`font-rpg font-bold ${isDark ? 'text-white' : 'text-[#1C1917]'}`}>⚔ LIFE RPG</span>
          <span>•</span>
          <span>“Don't just complete your tasks. Level up your life.”</span>
        </div>
        <div className="flex items-center gap-6">
          <Link to="/support" className={`hover:underline ${isDark ? 'hover:text-[#F87171]' : 'hover:text-[#5D866C]'}`}>
            Support
          </Link>
          <span>© 2026 Life RPG</span>
        </div>
      </footer>
    </div>
  );
};
