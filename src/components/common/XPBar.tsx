import React from 'react';
import { motion } from 'motion/react';
import { Sparkles } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

interface XPBarProps {
  currentXp: number;
  requiredXp: number;
  percentage?: number;
  level?: number;
  size?: 'sm' | 'md' | 'lg';
  showDetails?: boolean;
  className?: string;
}

export const XPBar: React.FC<XPBarProps> = ({
  currentXp,
  requiredXp,
  percentage,
  level,
  size = 'md',
  showDetails = true,
  className = '',
}) => {
  const { isDark } = useTheme();
  const calculatedPercentage =
    percentage !== undefined
      ? percentage
      : Math.min(100, Math.max(0, Math.round((currentXp / Math.max(1, requiredXp)) * 100)));

  const heightClasses = {
    sm: 'h-2',
    md: 'h-3.5',
    lg: 'h-5',
  };

  return (
    <div className={`w-full ${className}`}>
      {showDetails && (
        <div className="flex items-center justify-between text-xs mb-1.5 font-medium">
          <div className={`flex items-center gap-1.5 font-bold tracking-wide ${
            isDark ? 'text-[#F87171]' : 'text-[#5D866C]'
          }`}>
            <Sparkles className="w-3.5 h-3.5 animate-pulse" />
            <span>EXPERIENCE</span>
            {level !== undefined && (
              <span className={`font-normal ${isDark ? 'text-zinc-400' : 'text-[#78716C]'}`}>
                (Next: Lvl {level + 1})
              </span>
            )}
          </div>
          <div className={`font-mono text-xs ${isDark ? 'text-zinc-400' : 'text-[#78716C]'}`}>
            <span className={`font-bold ${isDark ? 'text-[#F87171]' : 'text-[#5D866C]'}`}>
              {currentXp.toLocaleString()}
            </span>
            <span className="mx-1">/</span>
            <span>{requiredXp.toLocaleString()} XP</span>
            <span className={`ml-2 font-bold ${isDark ? 'text-white' : 'text-[#5D866C]'}`}>
              ({calculatedPercentage}%)
            </span>
          </div>
        </div>
      )}

      {/* Outer container with crisp border and background */}
      <div className={`w-full rounded-full p-0.5 border shadow-inner overflow-hidden relative ${
        isDark
          ? 'bg-zinc-900 border-zinc-700'
          : 'bg-[#C2A68C]/60 border-[#C2A68C]'
      } ${heightClasses[size]}`}>
        {/* Background track */}
        <div className={`absolute inset-0 rounded-full ${
          isDark ? 'bg-zinc-800/80' : 'bg-[#E6D8C3]/60'
        }`} />

        {/* Animated fill bar */}
        <motion.div
          className={`h-full rounded-full relative shadow-sm ${
            isDark
              ? 'bg-gradient-to-r from-[#F87171] via-[#FB7185] to-[#F43F5E]'
              : 'bg-gradient-to-r from-[#5D866C] via-[#6E967D] to-[#5D866C]'
          }`}
          initial={{ width: 0 }}
          animate={{ width: `${Math.max(calculatedPercentage > 0 ? 2 : 0, calculatedPercentage)}%` }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        >
          {/* Subtle animated shimmer line across progress */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -skew-x-12 animate-pulse" />
        </motion.div>
      </div>
    </div>
  );
};
