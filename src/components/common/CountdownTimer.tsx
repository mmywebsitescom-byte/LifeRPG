import React from 'react';
import { Clock, Flame, AlertTriangle, Hourglass } from 'lucide-react';
import { useQuestCountdown } from '../../utils/timeUtils';
import { Quest } from '../../types';

interface CountdownTimerProps {
  quest: Pick<Quest, 'dueDate' | 'dueTime' | 'status'>;
  variant?: 'badge' | 'banner' | 'compact';
  className?: string;
}

export const CountdownTimer: React.FC<CountdownTimerProps> = ({ 
  quest, 
  variant = 'badge',
  className = '' 
}) => {
  const { isUrgent, isOverdue, formatted } = useQuestCountdown(quest);

  // If completed, don't show countdown
  if (quest.status === 'Completed') {
    return null;
  }

  if (variant === 'banner') {
    if (isUrgent) {
      return (
        <div 
          className={`flex items-center justify-between px-3 py-1.5 rounded-xl bg-[#E6D8C3] border-2 border-[#5D866C] text-[#5D866C] shadow-sm animate-pulse ${className}`}
        >
          <div className="flex items-center gap-1.5 text-xs font-black uppercase tracking-wider">
            <Flame className="w-4 h-4 text-[#5D866C] fill-[#5D866C]/30" />
            <span>URGENT BOUNTY</span>
          </div>
          <div className="flex items-center gap-1 font-mono font-bold text-xs text-[#5D866C]">
            <Hourglass className="w-3.5 h-3.5 text-[#5D866C]" />
            <span>{formatted} left</span>
          </div>
        </div>
      );
    }

    if (isOverdue) {
      return (
        <div 
          className={`flex items-center justify-between px-3 py-1.5 rounded-xl bg-[#E6D8C3] border border-[#5D866C]/70 text-[#5D866C] ${className}`}
        >
          <div className="flex items-center gap-1.5 text-xs font-black uppercase tracking-wider">
            <AlertTriangle className="w-4 h-4 text-[#5D866C]" />
            <span>BOUNTY EXPIRED</span>
          </div>
          <span className="font-mono text-xs font-bold text-[#5D866C]">{formatted}</span>
        </div>
      );
    }

    return (
      <div 
        className={`flex items-center justify-between px-3 py-1.5 rounded-xl bg-[#E6D8C3] border border-[#C2A68C] text-[#1C1917] text-xs font-mono ${className}`}
      >
        <span className="flex items-center gap-1.5 text-[#78716C]">
          <Clock className="w-3.5 h-3.5 text-[#5D866C]" />
          <span>Remaining:</span>
        </span>
        <span className="text-[#1C1917] font-bold">{formatted}</span>
      </div>
    );
  }

  // Badge / Compact Variant
  if (isUrgent) {
    return (
      <div
        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#E6D8C3] border-2 border-[#5D866C] text-[#5D866C] font-mono text-xs font-black tracking-wide shadow-sm animate-pulse ${className}`}
        title="Urgent bounty: Due within the next 4 hours!"
      >
        <Flame className="w-3.5 h-3.5 text-[#5D866C] fill-[#5D866C]/30 shrink-0" />
        <span className="text-[10px] uppercase font-sans font-extrabold tracking-wider bg-[#5D866C] text-white px-1.5 py-0.5 rounded text-center">
          &lt; 4H
        </span>
        <span className="text-[#5D866C]">{formatted}</span>
      </div>
    );
  }

  if (isOverdue) {
    return (
      <div
        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#E6D8C3] border border-[#5D866C]/60 text-[#5D866C] font-mono text-xs font-bold ${className}`}
        title="Quest past due date"
      >
        <AlertTriangle className="w-3 h-3 text-[#5D866C] shrink-0" />
        <span className="text-[11px]">{formatted}</span>
      </div>
    );
  }

  return (
    <div
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#E6D8C3] border border-[#C2A68C] text-[#1C1917] font-mono text-xs ${className}`}
      title="Time remaining"
    >
      <Clock className="w-3 h-3 text-[#78716C] shrink-0" />
      <span className="text-[#1C1917] font-semibold">{formatted}</span>
    </div>
  );
};
