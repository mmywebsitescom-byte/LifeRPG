import React, { useState } from 'react';
import { 
  CheckCircle2, 
  Clock, 
  Coins, 
  Sparkles, 
  MoreVertical, 
  Trash2, 
  Edit3, 
  Calendar, 
  Repeat, 
  Flame, 
  Hourglass
} from 'lucide-react';
import { motion } from 'motion/react';
import { Quest } from '../../types';
import { useGame } from '../../context/GameContext';
import { useTheme } from '../../context/ThemeContext';
import { useQuestCountdown } from '../../utils/timeUtils';
import { CountdownTimer } from './CountdownTimer';

interface QuestCardProps {
  quest: Quest;
  onEdit?: (quest: Quest) => void;
  className?: string;
}

const difficultyBadgeColorsLight: Record<Quest['difficulty'], string> = {
  Easy: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  Medium: 'bg-blue-50 text-blue-700 border-blue-200',
  Hard: 'bg-amber-50 text-amber-800 border-amber-200',
  Epic: 'bg-purple-50 text-purple-700 border-purple-200 shadow-sm',
};

const difficultyBadgeColorsDark: Record<Quest['difficulty'], string> = {
  Easy: 'bg-emerald-950/60 text-emerald-400 border-emerald-600/40',
  Medium: 'bg-blue-950/60 text-blue-400 border-blue-600/40',
  Hard: 'bg-amber-950/60 text-amber-400 border-amber-600/40',
  Epic: 'bg-purple-950/60 text-purple-400 border-purple-600/40 shadow-sm',
};

const categoryBadgeColorsLight: Record<Quest['category'], string> = {
  Knowledge: 'text-purple-700 bg-purple-50 border-purple-200',
  Coding: 'text-cyan-700 bg-cyan-50 border-cyan-200',
  Fitness: 'text-rose-700 bg-rose-50 border-rose-200',
  Health: 'text-emerald-700 bg-emerald-50 border-emerald-200',
  Creativity: 'text-pink-700 bg-pink-50 border-pink-200',
  Discipline: 'text-amber-800 bg-amber-50 border-amber-200',
  Personal: 'text-indigo-700 bg-indigo-50 border-indigo-200',
  Other: 'text-stone-600 bg-stone-100 border-stone-200',
};

const categoryBadgeColorsDark: Record<Quest['category'], string> = {
  Knowledge: 'text-purple-300 bg-purple-950/60 border-purple-600/40',
  Coding: 'text-cyan-300 bg-cyan-950/60 border-cyan-600/40',
  Fitness: 'text-rose-300 bg-rose-950/60 border-rose-600/40',
  Health: 'text-emerald-300 bg-emerald-950/60 border-emerald-600/40',
  Creativity: 'text-pink-300 bg-pink-950/60 border-pink-600/40',
  Discipline: 'text-amber-300 bg-amber-950/60 border-amber-600/40',
  Personal: 'text-indigo-300 bg-indigo-950/60 border-indigo-600/40',
  Other: 'text-zinc-400 bg-zinc-800/80 border-zinc-700',
};

export const QuestCard: React.FC<QuestCardProps> = ({ quest, onEdit, className = '' }) => {
  const { completeQuest, setDeleteConfirmation } = useGame();
  const { isDark } = useTheme();
  const [completing, setCompleting] = useState(false);
  const [showMenu, setShowMenu] = useState(false);

  const isCompleted = quest.status === 'Completed';
  const { isUrgent, formatted } = useQuestCountdown(quest);

  const handleComplete = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isCompleted || completing) return;
    setCompleting(true);
    try {
      await completeQuest(quest.id);
    } finally {
      setCompleting(false);
    }
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowMenu(false);
    setDeleteConfirmation({
      questId: quest.id,
      questTitle: quest.title,
    });
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      whileHover={{ y: -2 }}
      transition={{ duration: 0.2 }}
      id={`quest-card-${quest.id}`}
      className={`group relative rounded-2xl p-5 border transition-all duration-200 ${
        isCompleted
          ? isDark 
            ? 'border-zinc-800 bg-[#121011] opacity-75' 
            : 'border-[#C2A68C] bg-[#E6D8C3]/50 opacity-80'
          : isUrgent
          ? isDark
            ? 'border-2 border-[#F87171] shadow-lg shadow-[#F87171]/15 bg-gradient-to-b from-[#201214] to-[#141414]'
            : 'border-2 border-[#5D866C] shadow-lg shadow-[#5D866C]/15 ring-1 ring-[#5D866C]/30 bg-gradient-to-b from-[#E6D8C3] to-white'
          : isDark
            ? 'border-[#F87171]/25 hover:border-[#F87171]/60 bg-[#141414] shadow-black hover:shadow-[0_0_15px_rgba(248,113,113,0.12)]'
            : 'border-[#C2A68C] hover:border-[#5D866C]/60 bg-white shadow-sm hover:shadow-md'
      } ${className}`}
    >
      {/* Urgent Warning Banner (< 4H) */}
      {!isCompleted && isUrgent && (
        <div className={`flex items-center justify-between px-3 py-1.5 mb-3.5 rounded-xl border-2 animate-pulse ${
          isDark
            ? 'bg-[#2A1518] border-[#F87171] text-[#F87171]'
            : 'bg-[#E6D8C3] border-[#5D866C] text-[#5D866C]'
        }`}>
          <div className="flex items-center gap-1.5 text-[11px] font-black uppercase tracking-wider">
            <Flame className="w-3.5 h-3.5" />
            <span>URGENT BOUNTY — DUE &lt; 4 HOURS</span>
          </div>
          <div className="flex items-center gap-1 font-mono text-xs font-black">
            <Hourglass className="w-3 h-3" />
            <span>{formatted}</span>
          </div>
        </div>
      )}

      {/* Top row: Badges and Menu */}
      <div className="flex items-center justify-between gap-2 mb-3">
        <div className="flex items-center flex-wrap gap-2">
          {/* Category */}
          <span
            className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full border ${
              isDark ? categoryBadgeColorsDark[quest.category] : categoryBadgeColorsLight[quest.category]
            }`}
          >
            {quest.category}
          </span>

          {/* Difficulty */}
          <span
            className={`text-[11px] font-bold px-2 py-0.5 rounded-md border uppercase tracking-wider ${
              isDark ? difficultyBadgeColorsDark[quest.difficulty] : difficultyBadgeColorsLight[quest.difficulty]
            }`}
          >
            {quest.difficulty}
          </span>

          {quest.repeat !== 'None' && (
            <span className={`text-[10px] flex items-center gap-1 px-2 py-0.5 rounded-md border ${
              isDark
                ? 'bg-[#1E1214] border-[#F87171]/30 text-zinc-400'
                : 'bg-[#E6D8C3] border-[#C2A68C] text-[#78716C]'
            }`}>
              <Repeat className="w-2.5 h-2.5" />
              {quest.repeat}
            </span>
          )}
        </div>

        {/* Action Menu */}
        <div className="relative">
          <button
            type="button"
            id={`quest-options-${quest.id}`}
            aria-label="Quest options"
            onClick={() => setShowMenu((prev) => !prev)}
            className={`p-1 rounded-lg transition-colors cursor-pointer ${
              isDark
                ? 'text-zinc-400 hover:text-white hover:bg-white/10'
                : 'text-[#78716C] hover:text-[#1C1917] hover:bg-[#C2A68C]/40'
            }`}
          >
            <MoreVertical className="w-4 h-4" />
          </button>

          {showMenu && (
            <>
              <div
                className="fixed inset-0 z-20"
                onClick={() => setShowMenu(false)}
              />
              <div className={`absolute right-0 top-full mt-1 w-36 rounded-xl shadow-xl z-30 py-1 text-xs border ${
                isDark
                  ? 'bg-[#181214] border-[#F87171]/40 text-zinc-200'
                  : 'bg-white border-[#C2A68C] text-[#1C1917]'
              }`}>
                {onEdit && (
                  <button
                    type="button"
                    onClick={() => {
                      setShowMenu(false);
                      onEdit(quest);
                    }}
                    className={`w-full px-3 py-2 text-left flex items-center gap-2 cursor-pointer ${
                      isDark ? 'hover:bg-white/10 text-zinc-200' : 'hover:bg-[#E6D8C3] text-[#1C1917]'
                    }`}
                  >
                    <Edit3 className="w-3.5 h-3.5 text-[#57534E]" />
                    Edit Quest
                  </button>
                )}
                <button
                  type="button"
                  onClick={handleDelete}
                  className={`w-full px-3 py-2 text-left flex items-center gap-2 cursor-pointer ${
                    isDark ? 'hover:bg-rose-950/60 text-rose-400' : 'hover:bg-rose-50 text-rose-700'
                  }`}
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  Abandon Quest
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Quest Title & Description */}
      <div className="mb-4">
        <h3
          className={`text-base font-bold transition-colors ${
            isCompleted
              ? 'line-through text-zinc-500'
              : isDark
                ? 'text-white group-hover:text-[#F87171]'
                : 'text-[#1C1917] group-hover:text-[#5D866C]'
          }`}
        >
          {quest.title}
        </h3>
        {quest.description && (
          <p className={`text-xs mt-1 line-clamp-2 leading-relaxed ${
            isDark ? 'text-zinc-400' : 'text-[#57534E]'
          }`}>
            {quest.description}
          </p>
        )}
      </div>

      {/* Rewards Row */}
      <div className={`flex items-center flex-wrap gap-2.5 py-2.5 px-3 rounded-xl border mb-4 text-xs font-mono ${
        isDark
          ? 'bg-[#1A1416] border-[#F87171]/25'
          : 'bg-[#E6D8C3] border-[#C2A68C]'
      }`}>
        <div className={`flex items-center gap-1.5 font-bold ${
          isDark ? 'text-[#F87171]' : 'text-[#5D866C]'
        }`} title="XP Reward">
          <Sparkles className="w-3.5 h-3.5" />
          <span>+{quest.xpReward} XP</span>
        </div>

        <div className={`flex items-center gap-1.5 font-bold ${
          isDark ? 'text-[#FBBF24]' : 'text-[#B45309]'
        }`} title="Gold Reward">
          <Coins className="w-3.5 h-3.5" />
          <span>+{quest.goldReward} Gold</span>
        </div>

        <div className={`flex items-center gap-1.5 capitalize font-medium ${
          isDark ? 'text-zinc-300' : 'text-[#57534E]'
        }`} title="Attribute Gain">
          <span className={`w-1.5 h-1.5 rounded-full ${isDark ? 'bg-[#F87171]' : 'bg-[#5D866C]'}`} />
          <span>
            {quest.attribute} +{quest.attributeReward}
          </span>
        </div>
      </div>

      {/* Footer: Due Date, Countdown Timer & Complete Button */}
      <div className={`flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2.5 border-t ${
        isDark ? 'border-[#F87171]/20' : 'border-[#C2A68C]'
      }`}>
        <div className={`flex items-center flex-wrap gap-2.5 text-[11px] ${
          isDark ? 'text-zinc-400' : 'text-[#78716C]'
        }`}>
          <span className="flex items-center gap-1">
            <Clock className="w-3 h-3" />
            {quest.estimatedTime}
          </span>
          <span className="flex items-center gap-1">
            <Calendar className="w-3 h-3" />
            {quest.dueDate}
            {quest.dueTime ? ` @ ${quest.dueTime}` : ''}
          </span>
          {!isCompleted && (
            <CountdownTimer quest={quest} variant={isUrgent ? 'badge' : 'compact'} />
          )}
        </div>

        {/* Complete button */}
        {isCompleted ? (
          <span className={`inline-flex items-center gap-1 text-xs font-semibold px-3 py-1.5 rounded-xl border ${
            isDark
              ? 'text-emerald-400 bg-emerald-950/60 border-emerald-500/40'
              : 'text-emerald-700 bg-emerald-50 border-emerald-200'
          }`}>
            <CheckCircle2 className="w-3.5 h-3.5" />
            Completed
          </span>
        ) : (
          <motion.button
            whileTap={{ scale: 0.95 }}
            type="button"
            id={`btn-complete-quest-${quest.id}`}
            onClick={handleComplete}
            disabled={completing}
            className={`inline-flex items-center gap-1.5 text-xs font-bold px-4 py-2 rounded-xl shadow-md transition-all font-sans cursor-pointer disabled:opacity-50 ${
              isDark
                ? 'bg-[#F87171] hover:bg-[#EF4444] text-black font-black shadow-[#F87171]/20'
                : 'bg-[#5D866C] hover:bg-[#4B6E57] text-white shadow-[#5D866C]/25'
            }`}
          >
            {completing ? (
              <>
                <Sparkles className="w-3.5 h-3.5 animate-spin" />
                Completing...
              </>
            ) : (
              <>
                <CheckCircle2 className="w-3.5 h-3.5" />
                COMPLETE
              </>
            )}
          </motion.button>
        )}
      </div>
    </motion.div>
  );
};
