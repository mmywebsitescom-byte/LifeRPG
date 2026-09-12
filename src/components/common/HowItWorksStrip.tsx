import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { 
  Target, 
  Flame, 
  Coins, 
  Crown, 
  Brain, 
  ShoppingBag, 
  ArrowRight, 
  Sparkles 
} from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

interface StepItem {
  id: string;
  num: string;
  title: string;
  category: string;
  description: string;
  icon: React.ElementType;
  route: string;
  actionText: string;
  iconInactiveBg: string;
  iconInactiveColor: string;
  activeBgClass: string;
  activeBgClassDark: string;
  activeBorderClass: string;
  activeBadgeColor: string;
}

const STEPS: StepItem[] = [
  {
    id: 'step-quests',
    num: '01',
    title: 'Define Quests',
    category: 'Task Setup',
    description: 'Turn study sessions, gym workouts, and coding milestones into epic bounties with custom difficulty ratings and deadlines.',
    icon: Target,
    route: '/quests/create',
    actionText: 'CREATE QUEST',
    iconInactiveBg: 'bg-blue-100 text-blue-600 dark:bg-[#201518] dark:text-[#F87171]',
    iconInactiveColor: 'text-blue-600',
    activeBgClass: 'bg-[#DCEEE2]',
    activeBgClassDark: 'bg-[#2A1417]',
    activeBorderClass: 'border-[#5D866C] dark:border-[#F87171]',
    activeBadgeColor: 'bg-[#5D866C] text-white dark:bg-[#F87171] dark:text-black',
  },
  {
    id: 'step-focus',
    num: '02',
    title: 'Real-Life Action',
    category: 'Deep Focus',
    description: 'Execute your real-world tasks. Use integrated Pomodoro timers, maintain concentration, and defend daily streaks from decay.',
    icon: Flame,
    route: '/quests',
    actionText: 'VIEW ACTIVE',
    iconInactiveBg: 'bg-rose-100 text-rose-500 dark:bg-[#201518] dark:text-[#F87171]',
    iconInactiveColor: 'text-rose-500',
    activeBgClass: 'bg-[#FBE8DE]',
    activeBgClassDark: 'bg-[#31161A]',
    activeBorderClass: 'border-[#C2A68C] dark:border-[#F87171]',
    activeBadgeColor: 'bg-[#C2A68C] text-white dark:bg-[#F87171] dark:text-black',
  },
  {
    id: 'step-xp',
    num: '03',
    title: 'Instant Loot & XP',
    category: 'Feedback Loop',
    description: 'Check off bounties for instant audiovisual fanfare. Experience synthesized chimes, earn gold coins, and fill your XP gauge.',
    icon: Coins,
    route: '/progress',
    actionText: 'CHECK PROGRESS',
    iconInactiveBg: 'bg-emerald-100 text-emerald-600 dark:bg-[#201518] dark:text-[#F87171]',
    iconInactiveColor: 'text-emerald-600',
    activeBgClass: 'bg-[#D2EEDC]',
    activeBgClassDark: 'bg-[#281316]',
    activeBorderClass: 'border-[#5D866C] dark:border-[#F87171]',
    activeBadgeColor: 'bg-[#5D866C] text-white dark:bg-[#F87171] dark:text-black',
  },
  {
    id: 'step-ascension',
    num: '04',
    title: 'Hero Ascension',
    category: 'Rank Progression',
    description: 'Cross experience thresholds to trigger dramatic level-up celebrations, unlock grand titles, and access higher-difficulty quest boards.',
    icon: Crown,
    route: '/character',
    actionText: 'VIEW PROFILE',
    iconInactiveBg: 'bg-amber-100 text-amber-600 dark:bg-[#201518] dark:text-[#F87171]',
    iconInactiveColor: 'text-amber-600',
    activeBgClass: 'bg-[#F6EDE0]',
    activeBgClassDark: 'bg-[#35171B]',
    activeBorderClass: 'border-[#C2A68C] dark:border-[#F87171]',
    activeBadgeColor: 'bg-[#B45309] text-white dark:bg-[#F87171] dark:text-black',
  },
  {
    id: 'step-attributes',
    num: '05',
    title: 'Radar Stats',
    category: 'Polymath Growth',
    description: 'Develop 6 core life attributes: Strength, Intelligence, Wisdom, Discipline, Endurance, and Creativity with real-time stat radars.',
    icon: Brain,
    route: '/character',
    actionText: 'RADAR STATS',
    iconInactiveBg: 'bg-purple-100 text-purple-600 dark:bg-[#201518] dark:text-[#F87171]',
    iconInactiveColor: 'text-purple-600',
    activeBgClass: 'bg-[#EAE4F2]',
    activeBgClassDark: 'bg-[#2E1519]',
    activeBorderClass: 'border-purple-300 dark:border-[#F87171]',
    activeBadgeColor: 'bg-purple-600 text-white dark:bg-[#F87171] dark:text-black',
  },
  {
    id: 'step-spoils',
    num: '06',
    title: 'Mythic Armory',
    category: 'Virtual Rewards',
    description: 'Reinvest your hard-earned gold bounties into legendary blades, mystic cloaks, collectible badges, and customizable avatar cosmetics.',
    icon: ShoppingBag,
    route: '/rewards',
    actionText: 'ENTER SHOP',
    iconInactiveBg: 'bg-sky-100 text-sky-600 dark:bg-[#201518] dark:text-[#F87171]',
    iconInactiveColor: 'text-sky-600',
    activeBgClass: 'bg-[#CBEBFC]',
    activeBgClassDark: 'bg-[#37191E]',
    activeBorderClass: 'border-sky-400 dark:border-[#F87171]',
    activeBadgeColor: 'bg-sky-600 text-white dark:bg-[#F87171] dark:text-black',
  },
];

interface HowItWorksStripProps {
  className?: string;
}

export const HowItWorksStrip: React.FC<HowItWorksStripProps> = ({ className = '' }) => {
  const navigate = useNavigate();
  const { isDark } = useTheme();
  const [activeStepIndex, setActiveStepIndex] = useState<number>(5);

  return (
    <div className={`w-full ${className}`}>
      {/* Outer wrapper for visual depth */}
      <div 
        className={`p-3 sm:p-6 rounded-[2.5rem] relative transition-colors duration-300 ${
          isDark 
            ? 'bg-[#110D0F] border border-[#F87171]/20' 
            : 'bg-[#E6D8C3]/30 border border-[#C2A68C]/30'
        }`}
        style={{
          backgroundImage: isDark 
            ? 'radial-gradient(rgba(248, 113, 113, 0.2) 1.2px, transparent 1.2px)' 
            : 'radial-gradient(#C2A68C 1.2px, transparent 1.2px)',
          backgroundSize: '24px 24px',
        }}
      >
        {/* Main unified card container */}
        <div 
          id="how-it-works-carousel-strip"
          className={`rounded-[2rem] border overflow-hidden transition-colors duration-300 ${
            isDark
              ? 'bg-[#141414] border-[#F87171]/25 shadow-2xl shadow-black'
              : 'bg-white border-[#C2A68C]/30 shadow-xl shadow-[#C2A68C]/15'
          }`}
        >
          {/* 6-box responsive grid layout */}
          <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 divide-y sm:divide-y-0 lg:divide-x ${
            isDark ? 'divide-[#F87171]/15' : 'divide-[#C2A68C]/20'
          }`}>
            {STEPS.map((step, idx) => {
              const Icon = step.icon;
              const isActive = activeStepIndex === idx;

              return (
                <div
                  key={step.id}
                  id={`how-it-works-step-${idx + 1}`}
                  onMouseEnter={() => setActiveStepIndex(idx)}
                  onFocus={() => setActiveStepIndex(idx)}
                  onClick={() => setActiveStepIndex(idx)}
                  tabIndex={0}
                  className={`relative p-6 sm:p-7 flex flex-col justify-between transition-all duration-300 cursor-pointer select-none group min-h-[340px] sm:min-h-[370px] ${
                    isActive
                      ? isDark
                        ? `${step.activeBgClassDark} shadow-inner lg:rounded-3xl m-1 sm:m-1.5 border border-[#F87171]/50`
                        : `${step.activeBgClass} shadow-inner lg:rounded-3xl m-1 sm:m-1.5`
                      : isDark
                        ? 'bg-[#141414] hover:bg-[#1E1719]'
                        : 'bg-white hover:bg-[#F5F5F0]/60'
                  }`}
                >
                  {/* Top: Circular Icon */}
                  <div>
                    <div className="flex items-center justify-between mb-7">
                      <motion.div
                        animate={{
                          scale: isActive ? 1.08 : 1,
                        }}
                        transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                        className={`w-13 h-13 rounded-full flex items-center justify-center transition-all duration-300 ${
                          isActive
                            ? isDark
                              ? 'bg-[#F87171] text-black shadow-lg shadow-[#F87171]/30'
                              : 'bg-white shadow-md text-[#1C1917]'
                            : `${step.iconInactiveBg}`
                        }`}
                      >
                        <Icon className="w-6 h-6 stroke-[2.2]" />
                      </motion.div>

                      {/* Step index badge on active */}
                      {isActive && (
                        <motion.span
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          className={`text-[10px] font-black uppercase font-mono px-2 py-0.5 rounded-full ${step.activeBadgeColor}`}
                        >
                          STEP {step.num}
                        </motion.span>
                      )}
                    </div>

                    {/* Step Title */}
                    <h3 
                      className={`text-lg sm:text-xl font-black font-rpg tracking-tight mb-3 transition-colors ${
                        isActive
                          ? isDark ? 'text-white' : 'text-[#1C1917]'
                          : isDark
                            ? 'text-zinc-200 group-hover:text-[#F87171]'
                            : 'text-[#1C1917] group-hover:text-[#5D866C]'
                      }`}
                    >
                      {step.title}
                    </h3>

                    {/* Step Description */}
                    <p 
                      className={`text-xs sm:text-sm leading-relaxed transition-colors line-clamp-5 ${
                        isActive
                          ? isDark ? 'text-zinc-300 font-medium' : 'text-[#292524] font-medium'
                          : isDark ? 'text-zinc-400' : 'text-[#57534E]'
                      }`}
                    >
                      {step.description}
                    </p>
                  </div>

                  {/* Bottom: Learn More / Action Link (visible and highlighted when active) */}
                  <div className={`mt-8 pt-4 border-t ${isDark ? 'border-zinc-800' : 'border-black/5'}`}>
                    {isActive ? (
                      <motion.div
                        initial={{ opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex items-center justify-between"
                      >
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate(step.route);
                          }}
                          className={`inline-flex items-center gap-2 text-xs font-black uppercase tracking-wider pb-0.5 transition-all cursor-pointer border-b-2 ${
                            isDark
                              ? 'text-[#F87171] border-[#F87171] hover:text-white hover:border-white'
                              : 'text-[#1C1917] hover:text-[#5D866C] border-[#1C1917] hover:border-[#5D866C]'
                          }`}
                        >
                          <span>{step.actionText}</span>
                          <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
                        </button>
                        <Sparkles className={`w-4 h-4 ${isDark ? 'text-[#F87171]' : 'text-[#5D866C]/60'}`} />
                      </motion.div>
                    ) : (
                      <div className={`text-[11px] font-bold flex items-center gap-1.5 transition-colors uppercase tracking-wider ${
                        isDark ? 'text-zinc-500 group-hover:text-[#F87171]' : 'text-[#A8A29E] group-hover:text-[#5D866C]'
                      }`}>
                        <span>HOVER TO EXPLORE</span>
                        <ArrowRight className="w-3 h-3 opacity-60 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all" />
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
