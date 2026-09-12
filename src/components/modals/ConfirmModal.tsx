import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Trash2, ShoppingBag, AlertTriangle } from 'lucide-react';
import { useGame } from '../../context/GameContext';
import { useTheme } from '../../context/ThemeContext';

export const ConfirmModal: React.FC = () => {
  const { 
    deleteConfirmation, 
    setDeleteConfirmation, 
    deleteQuest,
    purchaseConfirmation,
    setPurchaseConfirmation,
    purchaseReward,
    character 
  } = useGame();
  const { isDark } = useTheme();

  // Delete Quest Modal
  if (deleteConfirmation) {
    return (
      <AnimatePresence>
        <div
          id="delete-confirmation-backdrop"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className={`relative max-w-sm w-full rounded-3xl p-6 border-2 shadow-2xl transition-colors ${
              isDark
                ? 'bg-[#141414] border-[#F87171]/40 shadow-black'
                : 'bg-white border-[#C2A68C]'
            }`}
          >
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-4 border ${
              isDark
                ? 'bg-rose-950/60 border-rose-500/40 text-rose-400'
                : 'bg-rose-50 border-rose-200 text-rose-600'
            }`}>
              <Trash2 className="w-6 h-6" />
            </div>

            <h3 className={`text-base font-bold font-rpg mb-1.5 ${
              isDark ? 'text-white' : 'text-[#1C1917]'
            }`}>
              Abandon Quest?
            </h3>
            <p className={`text-xs mb-6 leading-relaxed ${
              isDark ? 'text-zinc-400' : 'text-[#78716C]'
            }`}>
              Are you sure you want to abandon <span className={`font-bold ${isDark ? 'text-[#F87171]' : 'text-[#5D866C]'}`}>"{deleteConfirmation.questTitle}"</span>? All potential XP and Gold rewards for this quest will be forfeit.
            </p>

            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setDeleteConfirmation(null)}
                className={`py-2.5 px-4 rounded-xl border text-xs font-bold transition-colors cursor-pointer ${
                  isDark
                    ? 'bg-[#1E1214] border-[#F87171]/30 text-zinc-300 hover:text-white hover:border-[#F87171]'
                    : 'bg-[#E6D8C3] border-[#C2A68C] text-[#78716C] hover:text-[#1C1917]'
                }`}
              >
                CANCEL
              </button>
              <button
                type="button"
                id="btn-confirm-delete-quest"
                onClick={() => deleteQuest(deleteConfirmation.questId)}
                className={`py-2.5 px-4 rounded-xl text-xs font-bold transition-colors cursor-pointer shadow-md ${
                  isDark
                    ? 'bg-rose-600 hover:bg-rose-500 text-white shadow-rose-600/30'
                    : 'bg-[#5D866C] hover:bg-[#4B6E57] text-white shadow-[#5D866C]/30'
                }`}
              >
                ABANDON
              </button>
            </div>
          </motion.div>
        </div>
      </AnimatePresence>
    );
  }

  // Purchase Confirmation Modal
  if (purchaseConfirmation) {
    const item = purchaseConfirmation.reward;
    const canAfford = (character?.gold || 0) >= item.price;

    return (
      <AnimatePresence>
        <div
          id="purchase-confirmation-backdrop"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className={`relative max-w-sm w-full rounded-3xl p-6 border-2 shadow-2xl transition-colors ${
              isDark
                ? 'bg-[#141414] border-[#F87171]/40 shadow-black'
                : 'bg-white border-[#C2A68C]'
            }`}
          >
            <div className={`w-12 h-12 rounded-2xl border flex items-center justify-center mb-4 ${
              isDark
                ? 'bg-[#1E1214] border-[#F87171]/40 text-[#FBBF24]'
                : 'bg-[#E6D8C3] border-[#C2A68C] text-[#B45309]'
            }`}>
              <ShoppingBag className="w-6 h-6" />
            </div>

            <h3 className={`text-base font-bold font-rpg mb-1 ${
              isDark ? 'text-white' : 'text-[#1C1917]'
            }`}>
              Acquire {item.name}?
            </h3>
            <p className={`text-xs mb-4 leading-relaxed ${
              isDark ? 'text-zinc-400' : 'text-[#57534E]'
            }`}>
              {item.description}
            </p>

            <div className={`flex items-center justify-between p-3 rounded-2xl border mb-6 text-xs font-mono ${
              isDark
                ? 'bg-[#1A1416] border-[#F87171]/25'
                : 'bg-[#E6D8C3] border-[#C2A68C]'
            }`}>
              <span className={isDark ? 'text-zinc-400' : 'text-[#78716C]'}>Price:</span>
              <span className={`font-black text-sm ${isDark ? 'text-[#FBBF24]' : 'text-[#B45309]'}`}>
                {item.price} Gold
              </span>
            </div>

            {!canAfford && (
              <div className={`p-2.5 rounded-xl border text-[11px] mb-4 flex items-center gap-2 ${
                isDark
                  ? 'bg-rose-950/70 border-rose-500/40 text-rose-300'
                  : 'bg-rose-50 border-rose-200 text-rose-700'
              }`}>
                <AlertTriangle className="w-4 h-4 shrink-0" />
                <span>You need {item.price - (character?.gold || 0)} more gold.</span>
              </div>
            )}

            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setPurchaseConfirmation(null)}
                className={`py-2.5 px-4 rounded-xl border text-xs font-bold transition-colors cursor-pointer ${
                  isDark
                    ? 'bg-[#1E1214] border-[#F87171]/30 text-zinc-300 hover:text-white hover:border-[#F87171]'
                    : 'bg-[#E6D8C3] border-[#C2A68C] text-[#78716C] hover:text-[#1C1917]'
                }`}
              >
                CANCEL
              </button>
              <button
                type="button"
                disabled={!canAfford}
                id="btn-confirm-purchase-item"
                onClick={() => purchaseReward(item.id)}
                className={`py-2.5 px-4 rounded-xl text-xs font-black shadow-md transition-colors disabled:opacity-40 cursor-pointer ${
                  isDark
                    ? 'bg-[#F87171] hover:bg-[#EF4444] text-black shadow-[#F87171]/25'
                    : 'bg-[#5D866C] hover:bg-[#4B6E57] text-white shadow-[#5D866C]/30'
                }`}
              >
                BUY ITEM
              </button>
            </div>
          </motion.div>
        </div>
      </AnimatePresence>
    );
  }

  return null;
};
