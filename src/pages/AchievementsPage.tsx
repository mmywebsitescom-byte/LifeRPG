import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  Trophy, 
  Award, 
  Lock,
  Sparkles,
  Flame,
  Scroll,
  Zap,
  Shield
} from 'lucide-react';
import { useGame } from '../context/GameContext';
import { useTheme } from '../context/ThemeContext';
import { AchievementsSkeleton } from '../components/common/LoadingSkeleton';

export const AchievementsPage: React.FC = () => {
  const { achievements, loading } = useGame();
  const { isDark } = useTheme();
  const [filter, setFilter] = useState<'All' | 'Unlocked' | 'Locked'>('All');

  if (loading) {
    return <AchievementsSkeleton />;
  }

  const allAchievements = achievements || [];
  const unlockedCount = allAchievements.filter((a) => a.unlocked).length;
  const totalCount = allAchievements.length;
  const completionPercentage = totalCount > 0 ? Math.round((unlockedCount / totalCount) * 100) : 0;

  const filteredAchievements = allAchievements.filter((a) => {
    if (filter === 'Unlocked') return a.unlocked;
    if (filter === 'Locked') return !a.unlocked;
    return true;
  });

  const getAchievementIcon = (iconName: string, isUnlocked: boolean) => {
    if (!isUnlocked) return <Lock className="w-5 h-5" />;
    switch (iconName) {
      case 'Flame': return <Flame className="w-6 h-6" />;
      case 'Sparkles': return <Sparkles className="w-6 h-6" />;
      case 'Scroll': return <Scroll className="w-6 h-6" />;
      case 'Zap': return <Zap className="w-6 h-6" />;
      case 'Shield': return <Shield className="w-6 h-6" />;
      case 'Trophy': return <Trophy className="w-6 h-6" />;
      default: return <Award className="w-6 h-6" />;
    }
  };

  return (
    <div className="space-y-8 animate-fadeIn" id="achievements-main-view">
      {/* Header */}
      <div className={`flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b ${
        isDark ? 'border-[#F87171]/20' : 'border-[#C2A68C]'
      }`}>
        <div>
          <div className={`inline-flex items-center gap-1.5 text-xs uppercase tracking-wider font-bold mb-1 ${
            isDark ? 'text-[#F87171]' : 'text-[#5D866C]'
          }`}>
            <Trophy className="w-3.5 h-3.5" />
            <span>HALL OF GLORY</span>
          </div>
          <h2 className={`text-2xl sm:text-3xl font-black font-rpg tracking-wide ${
            isDark ? 'text-white' : 'text-[#1C1917]'
          }`}>
            ACHIEVEMENTS
          </h2>
          <p className={`text-xs mt-0.5 ${isDark ? 'text-zinc-400' : 'text-[#78716C]'}`}>
            Legendary feats unlocked through discipline, coding, and continuous pursuit.
          </p>
        </div>

        {/* Global Trophy Progress Card */}
        <div className={`flex items-center gap-4 p-3 rounded-2xl border shadow-sm self-start sm:self-auto min-w-[220px] transition-colors ${
          isDark
            ? 'bg-[#141414] border-[#F87171]/30 text-white'
            : 'bg-white border-[#C2A68C]'
        }`}>
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border ${
            isDark
              ? 'bg-[#1E1214] text-[#F87171] border-[#F87171]/40'
              : 'bg-[#E6D8C3] text-[#5D866C] border-[#C2A68C]'
          }`}>
            <Trophy className="w-5 h-5" />
          </div>
          <div className="flex-1">
            <div className="flex items-center justify-between text-xs font-bold font-mono mb-1">
              <span className={isDark ? 'text-white' : 'text-[#1C1917]'}>{unlockedCount} / {totalCount}</span>
              <span className={isDark ? 'text-[#F87171]' : 'text-[#5D866C]'}>{completionPercentage}%</span>
            </div>
            <div className={`h-2 rounded-full overflow-hidden border ${
              isDark ? 'bg-zinc-800 border-zinc-700' : 'bg-[#C2A68C]/60 border-[#C2A68C]'
            }`}>
              <div
                className={`h-full rounded-full transition-all duration-700 ${
                  isDark ? 'bg-[#F87171]' : 'bg-[#5D866C]'
                }`}
                style={{ width: `${completionPercentage}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2">
        {(['All', 'Unlocked', 'Locked'] as const).map((tab) => (
          <button
            key={tab}
            type="button"
            onClick={() => setFilter(tab)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer border ${
              filter === tab
                ? isDark
                  ? 'bg-[#F87171] text-black border-[#F87171] font-black shadow-md shadow-[#F87171]/20'
                  : 'bg-[#5D866C] text-white border-[#5D866C] shadow-md shadow-[#5D866C]/30'
                : isDark
                  ? 'bg-[#141414] border-[#F87171]/20 text-zinc-400 hover:text-white hover:border-[#F87171]/40'
                  : 'bg-white border-[#C2A68C] text-[#78716C] hover:text-[#1C1917]'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Achievement Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredAchievements.map((ach) => {
          const isUnlocked = ach.unlocked;
          const progressPercent = Math.min(100, Math.round((ach.progress / (ach.maxProgress || 1)) * 100));

          return (
            <motion.div
              key={ach.id}
              whileHover={{ scale: 1.01 }}
              className={`p-5 rounded-2xl border transition-all flex flex-col justify-between shadow-sm ${
                isDark
                  ? isUnlocked
                    ? 'bg-[#141414] border-[#F87171]/35 hover:border-[#F87171] shadow-black hover:shadow-[0_0_15px_rgba(248,113,113,0.15)]'
                    : 'bg-[#121011] border-zinc-800/80 hover:border-zinc-700 opacity-85'
                  : isUnlocked
                    ? 'bg-white border-[#C2A68C] hover:border-[#5D866C]/50 hover:shadow-md'
                    : 'bg-[#E6D8C3]/50 border-[#C2A68C] opacity-75'
              }`}
            >
              <div>
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div
                    className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 border ${
                      isDark
                        ? isUnlocked
                          ? 'bg-[#201214] border-[#F87171]/40 text-[#F87171]'
                          : 'bg-zinc-900 border-zinc-800 text-zinc-500'
                        : isUnlocked
                          ? 'bg-[#E6D8C3] border-[#C2A68C] text-[#5D866C]'
                          : 'bg-[#F5F5F0] border-[#C2A68C] text-[#78716C]'
                    }`}
                  >
                    {getAchievementIcon(ach.iconName, isUnlocked)}
                  </div>

                  <span
                    className={`text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-md border ${
                      isDark
                        ? isUnlocked
                          ? 'bg-emerald-950/70 border-emerald-500/40 text-emerald-400'
                          : 'bg-zinc-900 border-zinc-800 text-zinc-500'
                        : isUnlocked
                          ? 'bg-emerald-50 border-emerald-200 text-emerald-700'
                          : 'bg-[#E6D8C3] border-[#C2A68C] text-[#78716C]'
                    }`}
                  >
                    {isUnlocked ? 'UNLOCKED' : 'LOCKED'}
                  </span>
                </div>

                <h3 className={`text-base font-bold font-rpg mb-1 ${
                  isDark ? 'text-white' : 'text-[#1C1917]'
                }`}>
                  {ach.name}
                </h3>
                <p className={`text-xs leading-relaxed mb-4 ${
                  isDark ? 'text-zinc-400' : 'text-[#57534E]'
                }`}>
                  {ach.description}
                </p>
              </div>

              <div>
                {/* Progress Bar with Crisp Lines */}
                <div className="space-y-1 mb-3">
                  <div className={`flex items-center justify-between text-[11px] font-mono ${
                    isDark ? 'text-zinc-400' : 'text-[#78716C]'
                  }`}>
                    <span>Progress</span>
                    <span className={`font-bold ${isDark ? 'text-white' : 'text-[#1C1917]'}`}>
                      {ach.progress} / {ach.maxProgress}
                    </span>
                  </div>
                  <div className={`h-2 rounded-full overflow-hidden border ${
                    isDark ? 'bg-zinc-800/90 border-zinc-700' : 'bg-[#C2A68C]/60 border-[#C2A68C]'
                  }`}>
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        isDark
                          ? isUnlocked ? 'bg-emerald-500' : 'bg-[#F87171]'
                          : isUnlocked ? 'bg-emerald-500' : 'bg-[#5D866C]'
                      }`}
                      style={{ width: `${progressPercent}%` }}
                    />
                  </div>
                </div>

                {/* Reward Spoils Footer */}
                <div className={`flex items-center justify-between text-xs pt-2.5 border-t font-mono ${
                  isDark ? 'border-[#F87171]/20' : 'border-[#C2A68C]'
                }`}>
                  <span className={`flex items-center gap-1 font-bold ${
                    isDark ? 'text-[#F87171]' : 'text-[#5D866C]'
                  }`}>
                    +{ach.rewardXp} XP
                  </span>
                  <span className={`flex items-center gap-1 font-bold ${
                    isDark ? 'text-[#FBBF24]' : 'text-[#B45309]'
                  }`}>
                    +{ach.rewardGold} Gold
                  </span>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};
