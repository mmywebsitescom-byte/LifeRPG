import React from 'react';
import { Flame, ShieldCheck, Check, Sparkles } from 'lucide-react';
import { motion } from 'motion/react';

interface StreakCardProps {
  currentStreak: number;
  longestStreak: number;
  protectionActive?: boolean;
  history?: { day: string; date: string; completed: boolean }[];
  className?: string;
}

export const StreakCard: React.FC<StreakCardProps> = ({
  currentStreak,
  longestStreak,
  protectionActive = true,
  history = [
    { day: 'M', date: '1', completed: true },
    { day: 'T', date: '2', completed: true },
    { day: 'W', date: '3', completed: true },
    { day: 'T', date: '4', completed: true },
    { day: 'F', date: '5', completed: true },
    { day: 'S', date: '6', completed: true },
    { day: 'S', date: '7', completed: true },
  ],
  className = '',
}) => {
  return (
    <div
      id="streak-card-panel"
      className={`relative overflow-hidden rounded-2xl p-5 bg-white border border-[#C2A68C] shadow-sm ${className}`}
    >
      {/* Background ambient flame glow */}
      <div className="absolute -top-12 -right-12 w-36 h-36 bg-[#C2A68C]/40 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2.5">
          <div className="relative w-10 h-10 rounded-xl bg-[#5D866C] flex items-center justify-center shadow-md shadow-[#5D866C]/25">
            <motion.div
              animate={{ scale: [1, 1.15, 1], rotate: [-2, 2, -2] }}
              transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
            >
              <Flame className="w-6 h-6 text-white fill-white/30" />
            </motion.div>
          </div>
          <div>
            <div className="text-[11px] uppercase tracking-wider text-[#5D866C] font-bold">ACTIVE STREAK</div>
            <div className="text-xl font-bold font-rpg text-[#1C1917] flex items-baseline gap-1.5">
              <span>{currentStreak}</span>
              <span className="text-xs font-sans text-[#78716C] uppercase font-semibold">Days Continuous</span>
            </div>
          </div>
        </div>

        {/* Longest streak pill */}
        <div className="text-right">
          <div className="text-[10px] uppercase tracking-wider text-[#78716C] font-medium">BEST RECORD</div>
          <div className="font-mono text-xs font-semibold text-[#5D866C]">
            {longestStreak} Days
          </div>
        </div>
      </div>

      {/* Streak 7-day calendar row */}
      <div className="mb-4">
        <div className="text-xs text-[#57534E] mb-2 flex items-center justify-between">
          <span>Weekly Quest Cadence</span>
          <span className="text-[11px] text-[#5D866C] font-bold">100% Completed</span>
        </div>
        <div className="grid grid-cols-7 gap-1.5">
          {history.map((item, idx) => (
            <div
              key={idx}
              className="flex flex-col items-center gap-1.5"
            >
              <div
                className={`w-full aspect-square rounded-lg flex items-center justify-center transition-all ${
                  item.completed
                    ? 'bg-[#E6D8C3] border border-[#5D866C] text-[#5D866C] shadow-sm'
                    : 'bg-[#F5F5F0] border border-[#C2A68C] text-[#78716C]'
                }`}
              >
                {item.completed ? (
                  <Check className="w-3.5 h-3.5 stroke-[3] text-[#5D866C]" />
                ) : (
                  <span className="w-1.5 h-1.5 rounded-full bg-[#C2A68C]" />
                )}
              </div>
              <span className="text-[10px] font-mono text-[#78716C] font-medium">
                {item.day}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Streak Protection Feature */}
      {protectionActive && (
        <div className="flex items-center justify-between pt-3 border-t border-[#C2A68C] text-xs">
          <div className="flex items-center gap-2 text-[#1C1917]">
            <ShieldCheck className="w-4 h-4 text-[#5D866C]" />
            <span className="font-medium text-[11px]">Streak Aegis Protection: Active</span>
          </div>
          <span className="text-[10px] bg-[#E6D8C3] text-[#5D866C] border border-[#C2A68C] px-2 py-0.5 rounded-full flex items-center gap-1 font-mono font-bold">
            <Sparkles className="w-2.5 h-2.5" /> 1 Free Miss
          </span>
        </div>
      )}
    </div>
  );
};
