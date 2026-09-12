import React from 'react';
import { Coins } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

interface GoldBalanceProps {
  amount?: number;
  gold?: number;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'pill' | 'default';
  showLabel?: boolean;
  animated?: boolean;
  className?: string;
}

export const GoldBalance: React.FC<GoldBalanceProps> = ({
  amount,
  gold,
  size = 'md',
  variant = 'default',
  showLabel = true,
  className = '',
}) => {
  const { isDark } = useTheme();
  const value = Math.max(0, amount ?? gold ?? 0);

  const sizeClasses = {
    sm: 'text-xs px-2.5 py-1 gap-1.5',
    md: 'text-sm px-3 py-1.5 gap-2',
    lg: 'text-base px-4 py-2 gap-2.5',
  };

  const iconSizes = {
    sm: 'w-3.5 h-3.5',
    md: 'w-4 h-4',
    lg: 'w-5 h-5',
  };

  return (
    <div
      id="gold-balance-indicator"
      className={`inline-flex items-center rounded-xl font-bold shadow-sm transition-all border ${
        isDark
          ? 'bg-[#1E1214] border-[#F87171]/30 text-[#FBBF24] hover:border-[#F87171]/60'
          : 'bg-[#E6D8C3] border-[#C2A68C] text-[#B45309] hover:border-[#5D866C]/50'
      } ${sizeClasses[size]} ${className}`}
      title={`${value.toLocaleString()} Virtual Gold`}
    >
      <div className="relative flex items-center justify-center">
        <Coins className={`${iconSizes[size]} text-[#D97706] fill-[#D97706]/20`} />
        <span className={`absolute -top-0.5 -right-0.5 w-1.5 h-1.5 rounded-full animate-ping opacity-75 ${
          isDark ? 'bg-[#F87171]' : 'bg-[#5D866C]'
        }`} />
      </div>
      <span className="font-mono tracking-tight">{value.toLocaleString()}</span>
      {showLabel && (
        <span className={`text-[11px] uppercase tracking-widest font-sans font-semibold ${
          isDark ? 'text-amber-400/90' : 'text-[#B45309]/80'
        }`}>
          GOLD
        </span>
      )}
    </div>
  );
};
