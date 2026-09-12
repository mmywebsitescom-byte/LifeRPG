import React from 'react';
import { Shield } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

interface LevelBadgeProps {
  level: number;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
  className?: string;
}

export const LevelBadge: React.FC<LevelBadgeProps> = ({
  level,
  size = 'md',
  showLabel = false,
  className = '',
}) => {
  const { isDark } = useTheme();

  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5 gap-1',
    md: 'text-sm px-2.5 py-1 gap-1.5',
    lg: 'text-base px-3.5 py-1.5 gap-2',
  };

  const iconSizes = {
    sm: 'w-3 h-3',
    md: 'w-3.5 h-3.5',
    lg: 'w-4 h-4',
  };

  return (
    <div
      className={`inline-flex items-center rounded-full font-bold uppercase tracking-wider shadow-sm border-2 ${
        isDark
          ? 'bg-[#1E1214] border-[#F87171] text-[#F87171]'
          : 'bg-[#E6D8C3] border-[#5D866C] text-[#5D866C]'
      } ${sizeClasses[size]} ${className}`}
    >
      <Shield className={`${iconSizes[size]} ${
        isDark ? 'text-[#F87171] fill-[#F87171]/20' : 'text-[#5D866C] fill-[#5D866C]/20'
      }`} />
      {showLabel && (
        <span className={`font-semibold text-[10px] sm:text-xs ${
          isDark ? 'text-zinc-400' : 'text-[#78716C]'
        }`}>
          LVL
        </span>
      )}
      <span className="font-mono font-black">{level}</span>
    </div>
  );
};
