import React from 'react';
import { 
  Dumbbell, 
  Brain, 
  BookOpen, 
  Target, 
  Heart, 
  Palette, 
  TrendingUp 
} from 'lucide-react';
import { motion } from 'motion/react';
import { AttributeType } from '../../types';
import { useTheme } from '../../context/ThemeContext';

interface AttributeCardProps {
  type: AttributeType;
  value: number;
  recentGain?: number;
  maxValue?: number;
  showExplanation?: boolean;
  className?: string;
}

const attributeMeta: Record<
  AttributeType,
  {
    name: string;
    description: string;
    icon: React.ElementType;
    color: string;
    progressGradient: string;
    progressGradientDark: string;
    textColor: string;
    textColorDark: string;
  }
> = {
  strength: {
    name: 'Strength',
    description: 'Physical vigor, gym lifting, and raw muscular power.',
    icon: Dumbbell,
    color: 'rose',
    progressGradient: 'from-[#5D866C] to-rose-400',
    progressGradientDark: 'from-rose-600 to-rose-400',
    textColor: 'text-rose-600',
    textColorDark: 'text-rose-400',
  },
  intelligence: {
    name: 'Intelligence',
    description: 'Analytical capacity, coding skill, and algorithmic logic.',
    icon: Brain,
    color: 'blue',
    progressGradient: 'from-blue-600 to-cyan-500',
    progressGradientDark: 'from-blue-600 to-cyan-400',
    textColor: 'text-blue-600',
    textColorDark: 'text-blue-400',
  },
  wisdom: {
    name: 'Wisdom',
    description: 'Insight through reading, reflection, and life experience.',
    icon: BookOpen,
    color: 'purple',
    progressGradient: 'from-purple-600 to-indigo-500',
    progressGradientDark: 'from-purple-600 to-indigo-400',
    textColor: 'text-purple-600',
    textColorDark: 'text-purple-400',
  },
  discipline: {
    name: 'Discipline',
    description: 'Consistency, morning habits, and resistance to distraction.',
    icon: Target,
    color: 'amber',
    progressGradient: 'from-[#D97706] to-amber-500',
    progressGradientDark: 'from-amber-600 to-amber-400',
    textColor: 'text-amber-700',
    textColorDark: 'text-amber-400',
  },
  endurance: {
    name: 'Endurance',
    description: 'Cardiovascular stamina, hydration, sleep, and recovery.',
    icon: Heart,
    color: 'emerald',
    progressGradient: 'from-emerald-600 to-teal-500',
    progressGradientDark: 'from-emerald-600 to-teal-400',
    textColor: 'text-emerald-700',
    textColorDark: 'text-emerald-400',
  },
  creativity: {
    name: 'Creativity',
    description: 'Design innovation, lateral ideation, and artistic output.',
    icon: Palette,
    color: 'pink',
    progressGradient: 'from-[#5D866C] to-pink-500',
    progressGradientDark: 'from-pink-600 to-pink-400',
    textColor: 'text-pink-600',
    textColorDark: 'text-pink-400',
  },
};

export const AttributeCard: React.FC<AttributeCardProps> = ({
  type,
  value = 0,
  recentGain = 0,
  maxValue = 100,
  showExplanation = false,
  className = '',
}) => {
  const meta = attributeMeta[type];
  const Icon = meta.icon;
  const { isDark } = useTheme();
  const percentage = Math.min(100, Math.round((value / maxValue) * 100));

  return (
    <div
      className={`rounded-2xl p-4 border shadow-sm transition-all duration-200 ${
        isDark
          ? 'bg-[#141414] border-[#F87171]/20 hover:border-[#F87171]/50 shadow-black'
          : 'bg-white border-[#C2A68C] hover:border-[#5D866C]/40'
      } ${className}`}
    >
      <div className="flex items-start justify-between mb-2">
        <div className="flex items-center gap-2.5">
          <div className={`p-2 rounded-xl border ${
            isDark
              ? `bg-[#1E1214] border-[#F87171]/30 ${meta.textColorDark}`
              : `bg-[#E6D8C3] border-[#C2A68C] ${meta.textColor}`
          }`}>
            <Icon className="w-4 h-4" />
          </div>
          <div>
            <h4 className={`text-sm font-bold ${isDark ? 'text-white' : 'text-[#1C1917]'}`}>
              {meta.name}
            </h4>
            {showExplanation && (
              <p className={`text-[11px] max-w-[200px] leading-snug ${isDark ? 'text-zinc-400' : 'text-[#78716C]'}`}>
                {meta.description}
              </p>
            )}
          </div>
        </div>

        <div className="flex flex-col items-end">
          <span className={`text-lg font-mono font-extrabold ${isDark ? 'text-white' : 'text-[#1C1917]'}`}>
            {value}
          </span>
          {recentGain > 0 && (
            <span className="text-[10px] font-mono text-emerald-500 flex items-center gap-0.5 font-bold">
              <TrendingUp className="w-2.5 h-2.5" />+{recentGain}
            </span>
          )}
        </div>
      </div>

      {/* Progress Bar with Crisp Visible Line */}
      <div className={`w-full h-2 rounded-full overflow-hidden border p-0.5 mt-2 ${
        isDark ? 'bg-zinc-800/90 border-zinc-700' : 'bg-[#C2A68C]/60 border-[#C2A68C]'
      }`}>
        <motion.div
          className={`h-full rounded-full bg-gradient-to-r ${
            isDark ? meta.progressGradientDark : meta.progressGradient
          }`}
          initial={{ width: 0 }}
          animate={{ width: `${Math.max(value > 0 ? 4 : 0, percentage)}%` }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
        />
      </div>
    </div>
  );
};
