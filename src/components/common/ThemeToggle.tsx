import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

interface ThemeToggleProps {
  className?: string;
  showLabel?: boolean;
}

export const ThemeToggle: React.FC<ThemeToggleProps> = ({ className = '', showLabel = false }) => {
  const { theme, isDark, toggleTheme } = useTheme();

  return (
    <button
      type="button"
      onClick={toggleTheme}
      id="theme-toggle-btn"
      aria-label={`Switch to ${isDark ? 'light' : 'dark'} mode`}
      className={`relative inline-flex items-center gap-2 p-2 rounded-full transition-all duration-300 cursor-pointer ${
        isDark
          ? 'bg-[#18181B] text-[#F87171] border border-[#F87171]/40 shadow-sm shadow-[#F87171]/20 hover:border-[#F87171] hover:bg-[#27272A]'
          : 'bg-white text-[#5D866C] border border-[#C2A68C] shadow-sm hover:border-[#5D866C] hover:bg-[#F5F5F0]'
      } ${className}`}
      title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode (Black & Light Red)'}
    >
      <div className="relative w-5 h-5 flex items-center justify-center">
        {isDark ? (
          <Moon className="w-4 h-4 transition-transform duration-300 rotate-0 text-[#F87171] fill-[#F87171]/20" />
        ) : (
          <Sun className="w-4 h-4 transition-transform duration-300 rotate-0 text-[#5D866C] fill-[#5D866C]/20" />
        )}
      </div>
      {showLabel && (
        <span className="text-xs font-bold pr-1 font-mono uppercase tracking-wider">
          {isDark ? 'Dark' : 'Light'}
        </span>
      )}
    </button>
  );
};
