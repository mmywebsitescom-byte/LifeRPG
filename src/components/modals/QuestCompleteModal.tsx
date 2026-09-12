import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, Coins, TrendingUp, Check, ArrowRight } from 'lucide-react';
import { useGame } from '../../context/GameContext';
import { useTheme } from '../../context/ThemeContext';

export const QuestCompleteModal: React.FC = () => {
  const { activeQuestCompleteReward, closeQuestCompleteReward, character } = useGame();
  const { isDark } = useTheme();

  if (!activeQuestCompleteReward) return null;

  return (
    <AnimatePresence>
      <div
        id="quest-complete-modal-backdrop"
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.8, y: 25 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.85, y: 20 }}
          transition={{ type: 'spring', damping: 22, stiffness: 350 }}
          className={`relative max-w-md w-full rounded-3xl p-7 text-center border-2 shadow-2xl overflow-hidden transition-colors ${
            isDark
              ? 'bg-[#141414] border-[#F87171]/40 shadow-black'
              : 'bg-white border-[#C2A68C]'
          }`}
        >
          {/* Flare background */}
          <div className={`absolute -top-20 left-1/2 -translate-x-1/2 w-64 h-64 rounded-full blur-3xl pointer-events-none ${
            isDark ? 'bg-[#F87171]/15' : 'bg-[#C2A68C]/60'
          }`} />

          {/* Glowing checkmark badge */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: [0, 1.2, 1] }}
            transition={{ duration: 0.4 }}
            className={`w-16 h-16 mx-auto rounded-2xl flex items-center justify-center shadow-lg mb-4 ${
              isDark
                ? 'bg-[#F87171] text-black shadow-[#F87171]/30'
                : 'bg-[#5D866C] text-white shadow-[#5D866C]/30'
            }`}
          >
            <Check className="w-9 h-9 stroke-[3]" />
          </motion.div>

          <div className={`inline-flex items-center gap-1.5 text-xs uppercase font-bold tracking-widest mb-1 ${
            isDark ? 'text-[#F87171]' : 'text-[#5D866C]'
          }`}>
            <Sparkles className="w-3.5 h-3.5" />
            <span>REALM VICTORY</span>
            <Sparkles className="w-3.5 h-3.5" />
          </div>

          <h2 className={`text-2xl sm:text-3xl font-extrabold font-rpg mb-2 ${
            isDark ? 'text-white' : 'text-[#1C1917]'
          }`}>
            ✨ QUEST COMPLETE ✨
          </h2>

          <p className={`text-xs font-medium line-clamp-1 mb-6 ${
            isDark ? 'text-zinc-400' : 'text-[#57534E]'
          }`}>
            "{activeQuestCompleteReward.questTitle}"
          </p>

          {/* Reward cards row with floating entrance */}
          <div className="grid grid-cols-3 gap-3 mb-6">
            {/* XP */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
              className={`p-3 rounded-2xl border flex flex-col items-center shadow-sm ${
                isDark
                  ? 'bg-[#1A1416] border-[#F87171]/30'
                  : 'bg-[#E6D8C3] border-[#C2A68C]'
              }`}
            >
              <div className={`w-8 h-8 rounded-lg border flex items-center justify-center mb-1.5 ${
                isDark
                  ? 'bg-[#251518] text-[#F87171] border-[#F87171]/40'
                  : 'bg-white text-[#5D866C] border-[#C2A68C]'
              }`}>
                <Sparkles className="w-4 h-4" />
              </div>
              <span className={`text-base font-extrabold font-mono ${
                isDark ? 'text-[#F87171]' : 'text-[#5D866C]'
              }`}>
                +{activeQuestCompleteReward.xpGained}
              </span>
              <span className={`text-[10px] uppercase font-bold tracking-wider ${
                isDark ? 'text-zinc-400' : 'text-[#78716C]'
              }`}>
                Experience
              </span>
            </motion.div>

            {/* Gold */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25 }}
              className={`p-3 rounded-2xl border flex flex-col items-center shadow-sm ${
                isDark
                  ? 'bg-[#1A1416] border-[#F87171]/30'
                  : 'bg-[#E6D8C3] border-[#C2A68C]'
              }`}
            >
              <div className={`w-8 h-8 rounded-lg border flex items-center justify-center mb-1.5 ${
                isDark
                  ? 'bg-[#251518] text-[#FBBF24] border-[#F87171]/40'
                  : 'bg-white text-[#B45309] border-[#C2A68C]'
              }`}>
                <Coins className="w-4 h-4" />
              </div>
              <span className={`text-base font-extrabold font-mono ${
                isDark ? 'text-[#FBBF24]' : 'text-[#B45309]'
              }`}>
                +{activeQuestCompleteReward.goldGained}
              </span>
              <span className={`text-[10px] uppercase font-bold tracking-wider ${
                isDark ? 'text-zinc-400' : 'text-[#78716C]'
              }`}>
                Gold
              </span>
            </motion.div>

            {/* Attribute Gain */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35 }}
              className={`p-3 rounded-2xl border flex flex-col items-center shadow-sm ${
                isDark
                  ? 'bg-[#1A1416] border-[#F87171]/30'
                  : 'bg-[#E6D8C3] border-[#C2A68C]'
              }`}
            >
              <div className={`w-8 h-8 rounded-lg border flex items-center justify-center mb-1.5 ${
                isDark
                  ? 'bg-[#251518] text-purple-400 border-[#F87171]/40'
                  : 'bg-white text-purple-700 border-[#C2A68C]'
              }`}>
                <TrendingUp className="w-4 h-4" />
              </div>
              <span className={`text-base font-extrabold font-mono capitalize truncate max-w-full px-1 ${
                isDark ? 'text-purple-400' : 'text-purple-700'
              }`}>
                +{activeQuestCompleteReward.attributeGained}
              </span>
              <span className={`text-[10px] uppercase font-bold tracking-wider truncate max-w-full px-1 ${
                isDark ? 'text-zinc-400' : 'text-[#78716C]'
              }`}>
                {activeQuestCompleteReward.attribute}
              </span>
            </motion.div>
          </div>

          {/* Action button */}
          <button
            type="button"
            id="btn-close-quest-reward"
            onClick={closeQuestCompleteReward}
            className={`w-full py-3.5 px-6 rounded-2xl font-black text-xs uppercase tracking-wider shadow-lg flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer ${
              isDark
                ? 'bg-[#F87171] hover:bg-[#EF4444] text-black shadow-[#F87171]/30'
                : 'bg-[#5D866C] hover:bg-[#4B6E57] text-white shadow-[#5D866C]/30'
            }`}
          >
            <span>CONTINUE QUESTING</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
