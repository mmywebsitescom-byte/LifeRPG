import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, Crown, ArrowRight, Award } from 'lucide-react';
import { useGame } from '../../context/GameContext';
import { useTheme } from '../../context/ThemeContext';

export const LevelUpModal: React.FC = () => {
  const { activeLevelUpModal, closeLevelUpModal } = useGame();
  const { isDark } = useTheme();

  if (!activeLevelUpModal) return null;

  return (
    <AnimatePresence>
      <div
        id="level-up-modal-backdrop"
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.7, y: 30 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8, y: 20 }}
          transition={{ type: 'spring', damping: 20, stiffness: 300 }}
          className={`relative max-w-md w-full rounded-3xl p-8 text-center border-2 shadow-2xl overflow-hidden transition-colors ${
            isDark
              ? 'bg-[#141414] border-[#F87171]/40 shadow-black'
              : 'bg-white border-[#C2A68C]'
          }`}
        >
          {/* Ambient warm aura background */}
          <div className={`absolute -top-24 left-1/2 -translate-x-1/2 w-64 h-64 rounded-full blur-3xl pointer-events-none ${
            isDark ? 'bg-[#F87171]/15' : 'bg-[#C2A68C]/60'
          }`} />

          {/* Crown badge */}
          <motion.div
            initial={{ rotate: -20, scale: 0 }}
            animate={{ rotate: 0, scale: 1 }}
            transition={{ delay: 0.15, type: 'spring' }}
            className={`w-20 h-20 mx-auto rounded-3xl flex items-center justify-center shadow-lg border-2 mb-5 ${
              isDark
                ? 'bg-[#F87171] text-black border-[#F87171] shadow-[#F87171]/30'
                : 'bg-[#5D866C] text-white border-[#C2A68C] shadow-[#5D866C]/30'
            }`}
          >
            <Crown className="w-10 h-10 fill-current" />
          </motion.div>

          {/* Subtitle & Title */}
          <div className={`inline-flex items-center gap-1 text-xs uppercase font-bold tracking-widest mb-1 ${
            isDark ? 'text-[#F87171]' : 'text-[#5D866C]'
          }`}>
            <Sparkles className="w-3.5 h-3.5" />
            <span>Ascension Reached</span>
            <Sparkles className="w-3.5 h-3.5" />
          </div>

          <h2 className={`text-3xl sm:text-4xl font-extrabold font-rpg mb-6 ${
            isDark ? 'text-white' : 'text-[#1C1917]'
          }`}>
            LEVEL UP!
          </h2>

          {/* Level Transition Pill */}
          <div className={`flex items-center justify-center gap-4 py-3 px-6 rounded-2xl border max-w-xs mx-auto mb-6 shadow-inner ${
            isDark
              ? 'bg-[#1A1416] border-[#F87171]/30'
              : 'bg-[#E6D8C3] border-[#C2A68C]'
          }`}>
            <div className={`font-mono text-xl font-bold ${isDark ? 'text-zinc-400' : 'text-[#78716C]'}`}>
              LVL {activeLevelUpModal.oldLevel}
            </div>
            <ArrowRight className={`w-5 h-5 ${isDark ? 'text-[#F87171]' : 'text-[#5D866C]'}`} />
            <div className={`font-mono text-2xl font-black animate-pulse ${
              isDark ? 'text-[#F87171]' : 'text-[#5D866C]'
            }`}>
              LVL {activeLevelUpModal.newLevel}
            </div>
          </div>

          {/* Unlocked Reward Box */}
          <div className={`rounded-2xl p-4 border text-left mb-6 flex items-center gap-3.5 ${
            isDark
              ? 'bg-[#1E1214] border-[#F87171]/30'
              : 'bg-[#E6D8C3] border-[#C2A68C]'
          }`}>
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border ${
              isDark
                ? 'bg-[#2A1518] text-[#F87171] border-[#F87171]/40'
                : 'bg-white text-[#5D866C] border-[#C2A68C]'
            }`}>
              <Award className="w-5 h-5" />
            </div>
            <div>
              <div className={`text-[10px] uppercase font-bold tracking-wider ${
                isDark ? 'text-zinc-400' : 'text-[#78716C]'
              }`}>
                Stat Cap Raised
              </div>
              <div className={`text-xs font-bold ${isDark ? 'text-white' : 'text-[#1C1917]'}`}>
                {activeLevelUpModal.unlockedReward || 'Attribute Masteries Enhanced'}
              </div>
            </div>
          </div>

          {/* Claim Button */}
          <button
            type="button"
            id="btn-claim-levelup"
            onClick={closeLevelUpModal}
            className={`w-full py-3.5 px-6 rounded-2xl font-black text-xs uppercase tracking-wider shadow-lg transition-all hover:scale-105 cursor-pointer ${
              isDark
                ? 'bg-[#F87171] hover:bg-[#EF4444] text-black shadow-[#F87171]/30'
                : 'bg-[#5D866C] hover:bg-[#4B6E57] text-white shadow-[#5D866C]/30'
            }`}
          >
            CLAIM ASCENSION
          </button>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
