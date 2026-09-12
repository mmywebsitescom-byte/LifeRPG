import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  ShoppingBag, 
  Coins, 
  Sword, 
  Sparkles, 
  Palette, 
  Award, 
  Cat,
  ShieldCheck,
  Zap,
  Check
} from 'lucide-react';
import { useGame } from '../context/GameContext';
import { useTheme } from '../context/ThemeContext';
import { GoldBalance } from '../components/common/GoldBalance';
import { ShopSkeleton } from '../components/common/LoadingSkeleton';
import { RewardItem } from '../types';

export const RewardsPage: React.FC = () => {
  const { 
    rewards, 
    character, 
    setPurchaseConfirmation, 
    toggleEquipReward,
    loading
  } = useGame();
  const { isDark } = useTheme();

  const [activeTab, setActiveTab] = useState<'All' | 'Gear' | 'Themes' | 'Badges' | 'Pets'>('All');

  if (loading) {
    return <ShopSkeleton />;
  }

  const filteredRewards = rewards.filter((item) => {
    if (activeTab === 'All') return true;
    return item.category === activeTab;
  });

  const getCategoryIcon = (category: RewardItem['category']) => {
    switch (category) {
      case 'Gear':
        return <Sword className="w-4 h-4 text-rose-500" />;
      case 'Themes':
        return <Palette className="w-4 h-4 text-blue-500" />;
      case 'Badges':
        return <Award className="w-4 h-4 text-purple-500" />;
      case 'Pets':
        return <Cat className="w-4 h-4 text-emerald-500" />;
      default:
        return <Sparkles className="w-4 h-4 text-amber-500" />;
    }
  };

  const getItemIcon = (iconName: string, category: RewardItem['category']) => {
    switch (iconName) {
      case 'Sword':
        return <Sword className="w-10 h-10 text-rose-500" />;
      case 'Palette':
        return <Palette className="w-10 h-10 text-blue-500" />;
      case 'ShieldCheck':
        return <ShieldCheck className="w-10 h-10 text-amber-500" />;
      case 'Cat':
        return <Cat className="w-10 h-10 text-emerald-500" />;
      case 'Zap':
        return <Zap className="w-10 h-10 text-amber-400" />;
      default:
        return getCategoryIcon(category);
    }
  };

  return (
    <div className="space-y-8 animate-fadeIn" id="rewards-shop-view">
      {/* Header with Top Gold Balance */}
      <div className={`flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b ${
        isDark ? 'border-[#F87171]/20' : 'border-[#C2A68C]'
      }`}>
        <div>
          <div className={`inline-flex items-center gap-1.5 text-xs uppercase tracking-wider font-bold mb-1 ${
            isDark ? 'text-[#F87171]' : 'text-[#5D866C]'
          }`}>
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>MYSTIC BAZAAR</span>
          </div>
          <h2 className={`text-2xl sm:text-3xl font-black font-rpg ${
            isDark ? 'text-white' : 'text-[#1C1917]'
          }`}>
            REWARDS SHOP
          </h2>
          <p className={`text-xs mt-0.5 ${
            isDark ? 'text-zinc-400' : 'text-[#78716C]'
          }`}>
            Trade your hard-earned gold for legendary vanity gear, titles, and companion familiars.
          </p>
        </div>

        {/* Top Gold Balance Indicator */}
        {character && (
          <div className="self-start sm:self-auto">
            <GoldBalance amount={character.gold} size="lg" />
          </div>
        )}
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {(['All', 'Gear', 'Themes', 'Badges', 'Pets'] as const).map((tab) => (
          <button
            key={tab}
            type="button"
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
              activeTab === tab
                ? isDark
                  ? 'bg-[#F87171] text-black font-black shadow-md shadow-[#F87171]/30'
                  : 'bg-[#5D866C] text-white font-black shadow-md shadow-[#5D866C]/30'
                : isDark
                  ? 'bg-[#141414] border border-[#F87171]/30 text-zinc-400 hover:text-white'
                  : 'bg-white border border-[#C2A68C] text-[#78716C] hover:text-[#1C1917]'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Rewards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredRewards.map((item) => {
          const canAfford = (character?.gold ?? 0) >= item.price;
          const isOwned = item.owned;
          const isEquipped = item.equipped;

          return (
            <motion.div
              key={item.id}
              whileHover={{ scale: 1.01 }}
              className={`rounded-3xl p-5 border transition-all flex flex-col justify-between overflow-hidden relative shadow-sm ${
                isOwned
                  ? isDark
                    ? 'bg-[#1A1214] border-[#F87171]/40'
                    : 'bg-[#E6D8C3]/60 border-[#5D866C]/40'
                  : isDark
                    ? 'bg-[#141414] border-[#F87171]/20 hover:border-[#F87171]/60'
                    : 'bg-white border-[#C2A68C] hover:border-[#5D866C]/50 hover:shadow-md'
              }`}
            >
              {/* Image Preview / Icon Showcase */}
              <div className={`relative h-44 rounded-2xl overflow-hidden mb-4 border flex items-center justify-center ${
                isDark
                  ? 'bg-black/40 border-[#F87171]/30'
                  : 'bg-[#E6D8C3] border-[#C2A68C]'
              }`}>
                <div className={`w-20 h-20 rounded-3xl flex items-center justify-center border shadow-inner ${
                  isDark
                    ? 'bg-[#1E1214] border-[#F87171]/30'
                    : 'bg-white border-[#C2A68C]'
                }`}>
                  {getItemIcon(item.icon, item.category)}
                </div>

                {/* Category Pill Tag */}
                <div className={`absolute top-2.5 left-2.5 px-2.5 py-1 rounded-lg backdrop-blur-md border text-[10px] font-bold flex items-center gap-1.5 shadow-sm ${
                  isDark
                    ? 'bg-black/70 border-[#F87171]/30 text-zinc-200'
                    : 'bg-white/90 border-[#C2A68C] text-[#1C1917]'
                }`}>
                  {getCategoryIcon(item.category)}
                  <span>{item.category}</span>
                </div>

                {/* Rarity Tag */}
                <div className={`absolute bottom-2.5 right-2.5 px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase tracking-wider ${
                  item.rarity === 'Legendary'
                    ? 'bg-amber-500/20 text-amber-500 border border-amber-500/30'
                    : item.rarity === 'Epic'
                    ? 'bg-purple-500/20 text-purple-400 border border-purple-500/30'
                    : item.rarity === 'Rare'
                    ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                    : 'bg-zinc-500/20 text-zinc-400 border border-zinc-500/30'
                }`}>
                  {item.rarity}
                </div>

                {isEquipped && (
                  <div className={`absolute top-2.5 right-2.5 px-2.5 py-1 rounded-lg text-white text-[10px] font-black uppercase tracking-wider shadow-md flex items-center gap-1 ${
                    isDark ? 'bg-[#F87171] text-black' : 'bg-[#5D866C]'
                  }`}>
                    <Check className="w-3 h-3" />
                    <span>EQUIPPED</span>
                  </div>
                )}
              </div>

              {/* Item Info */}
              <div>
                <h3 className={`text-base font-bold font-rpg mb-1 ${
                  isDark ? 'text-white' : 'text-[#1C1917]'
                }`}>
                  {item.name}
                </h3>
                <p className={`text-xs leading-relaxed line-clamp-2 mb-4 ${
                  isDark ? 'text-zinc-400' : 'text-[#57534E]'
                }`}>
                  {item.description}
                </p>

                {item.statBonus && (
                  <div className={`mb-3 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[10px] font-bold ${
                    isDark
                      ? 'bg-emerald-950/40 text-emerald-400 border border-emerald-800/40'
                      : 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                  }`}>
                    <Sparkles className="w-3 h-3" />
                    <span>+{item.statBonus.amount} {item.statBonus.attribute.toUpperCase()}</span>
                  </div>
                )}
              </div>

              {/* Purchase / Equip Action Footer */}
              <div className={`pt-3 border-t flex items-center justify-between ${
                isDark ? 'border-[#F87171]/20' : 'border-[#C2A68C]'
              }`}>
                <div className="flex items-center gap-1.5 font-mono">
                  <Coins className="w-4 h-4 text-[#D97706] fill-[#D97706]/30" />
                  <span className={`font-black text-sm ${
                    isDark ? 'text-[#FBBF24]' : 'text-[#B45309]'
                  }`}>
                    {item.price} Gold
                  </span>
                </div>

                {isOwned ? (
                  <button
                    type="button"
                    onClick={() => toggleEquipReward(item.id)}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      isEquipped
                        ? isDark
                          ? 'bg-[#1E1214] border border-[#F87171]/30 text-zinc-400 hover:text-white'
                          : 'bg-[#E6D8C3] border border-[#C2A68C] text-[#78716C] hover:text-[#1C1917]'
                        : isDark
                          ? 'bg-[#F87171] hover:bg-[#EF4444] text-black font-black shadow-md shadow-[#F87171]/30'
                          : 'bg-[#5D866C] hover:bg-[#4B6E57] text-white shadow-md shadow-[#5D866C]/30'
                    }`}
                  >
                    {isEquipped ? 'UNEQUIP' : 'EQUIP'}
                  </button>
                ) : (
                  <button
                    type="button"
                    id={`btn-buy-reward-${item.id}`}
                    onClick={() => setPurchaseConfirmation({ reward: item })}
                    className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer ${
                      canAfford
                        ? isDark
                          ? 'bg-[#F87171] hover:bg-[#EF4444] text-black shadow-md shadow-[#F87171]/30 hover:scale-105'
                          : 'bg-[#5D866C] hover:bg-[#4B6E57] text-white shadow-md shadow-[#5D866C]/30 hover:scale-105'
                        : isDark
                          ? 'bg-[#1A1214] text-zinc-500 border border-[#F87171]/20 cursor-not-allowed opacity-60'
                          : 'bg-[#E6D8C3] text-[#78716C] border border-[#C2A68C] cursor-not-allowed opacity-60'
                    }`}
                  >
                    BUY ITEM
                  </button>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};
