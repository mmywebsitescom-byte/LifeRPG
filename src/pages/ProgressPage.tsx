import React, { useState } from 'react';
import { 
  TrendingUp, 
  Flame, 
  Trophy, 
  Coins, 
  Zap, 
  Calendar, 
  Clock, 
  Award, 
  CheckCircle2, 
  BarChart3, 
  Activity, 
  Sparkles,
  ShieldAlert
} from 'lucide-react';
import { useGame } from '../context/GameContext';
import { useTheme } from '../context/ThemeContext';
import { XPBar } from '../components/common/XPBar';
import { getXpDetails } from '../utils/rpgEngine';
import { initialProgressSummary } from '../api/mockData';

const attributeIcons: Record<string, string> = {
  strength: '⚔️',
  intelligence: '🔮',
  wisdom: '📜',
  discipline: '🛡️',
  endurance: '🏃',
  creativity: '🎨',
};

export const ProgressPage: React.FC = () => {
  const { character, progress, history } = useGame();
  const { isDark } = useTheme();

  const [historyFilter, setHistoryFilter] = useState<'all' | 'today' | 'week'>('all');

  const prog = progress || initialProgressSummary;
  const hero = character;
  const xpInfo = hero ? getXpDetails(hero.xp) : {
    level: 12,
    currentLevelXp: 450,
    requiredLevelXp: 900,
    progressPercentage: 50,
    nextLevel: 13,
  };

  const allHistory = history || [];
  const filteredHistory = allHistory.filter((item) => {
    if (historyFilter === 'all') return true;
    if (historyFilter === 'today') {
      return item.timestamp.toLowerCase().includes('today') || item.timestamp.toLowerCase().includes('just now');
    }
    return true;
  });

  const maxChartXp = Math.max(...prog.chartData.map((d) => d.xp), 300);

  return (
    <div className="space-y-8 animate-fadeIn" id="progress-page-container">
      {/* Header */}
      <div className={`flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b ${
        isDark ? 'border-[#F87171]/20' : 'border-[#C2A68C]'
      }`}>
        <div>
          <div className={`inline-flex items-center gap-1.5 text-xs uppercase tracking-wider font-bold mb-1 ${
            isDark ? 'text-[#F87171]' : 'text-[#5D866C]'
          }`}>
            <TrendingUp className="w-4 h-4" />
            <span>PROGRESSION MATRIX</span>
          </div>
          <h1 className={`text-2xl md:text-3xl font-black font-rpg tracking-wide ${
            isDark ? 'text-white' : 'text-[#1C1917]'
          }`}>
            Hero's Chronicle & Analytics
          </h1>
          <p className={`text-xs md:text-sm mt-1 ${isDark ? 'text-zinc-400' : 'text-[#78716C]'}`}>
            Analyze your discipline metrics, level velocity, attribute growth, and milestone achievements.
          </p>
        </div>

        {hero?.streakProtectionActive && (
          <div className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-xl border text-xs font-bold ${
            isDark 
              ? 'bg-[#1E1214] border-[#F87171]/40 text-[#F87171]' 
              : 'bg-emerald-50 border-emerald-200 text-emerald-800'
          }`}>
            <ShieldAlert className="w-4 h-4" />
            <span>Streak Shield Active</span>
          </div>
        )}
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <div className={`p-4 rounded-2xl border ${
          isDark ? 'bg-[#141414] border-[#F87171]/20' : 'bg-white border-[#C2A68C]'
        }`}>
          <span className={`block text-[10px] font-bold uppercase tracking-wider ${isDark ? 'text-zinc-400' : 'text-[#78716C]'}`}>
            Hero Level
          </span>
          <span className={`text-2xl font-black font-mono ${isDark ? 'text-[#F87171]' : 'text-[#5D866C]'}`}>
            {prog.currentLevel}
          </span>
          <span className="text-[10px] text-zinc-500 block mt-0.5">Top 8% of Realm</span>
        </div>

        <div className={`p-4 rounded-2xl border ${
          isDark ? 'bg-[#141414] border-[#F87171]/20' : 'bg-white border-[#C2A68C]'
        }`}>
          <span className={`block text-[10px] font-bold uppercase tracking-wider ${isDark ? 'text-zinc-400' : 'text-[#78716C]'}`}>
            Total XP
          </span>
          <span className="text-2xl font-black font-mono text-amber-500">
            {prog.totalXp.toLocaleString()}
          </span>
          <span className="text-[10px] text-zinc-500 block mt-0.5">Cumulative Earned</span>
        </div>

        <div className={`p-4 rounded-2xl border ${
          isDark ? 'bg-[#141414] border-[#F87171]/20' : 'bg-white border-[#C2A68C]'
        }`}>
          <span className={`block text-[10px] font-bold uppercase tracking-wider ${isDark ? 'text-zinc-400' : 'text-[#78716C]'}`}>
            Quests Cleared
          </span>
          <span className={`text-2xl font-black font-mono ${isDark ? 'text-white' : 'text-[#1C1917]'}`}>
            {prog.totalQuestsCompleted}
          </span>
          <span className="text-[10px] text-zinc-500 block mt-0.5">Real-life tasks</span>
        </div>

        <div className={`p-4 rounded-2xl border ${
          isDark ? 'bg-[#141414] border-[#F87171]/20' : 'bg-white border-[#C2A68C]'
        }`}>
          <span className={`block text-[10px] font-bold uppercase tracking-wider ${isDark ? 'text-zinc-400' : 'text-[#78716C]'}`}>
            Current Streak
          </span>
          <span className="text-2xl font-black font-mono text-amber-500 flex items-center gap-1">
            <Flame className="w-5 h-5 fill-amber-500" />
            <span>{prog.currentStreak}d</span>
          </span>
          <span className="text-[10px] text-zinc-500 block mt-0.5">Consecutive days</span>
        </div>

        <div className={`p-4 rounded-2xl border ${
          isDark ? 'bg-[#141414] border-[#F87171]/20' : 'bg-white border-[#C2A68C]'
        }`}>
          <span className={`block text-[10px] font-bold uppercase tracking-wider ${isDark ? 'text-zinc-400' : 'text-[#78716C]'}`}>
            Best Streak
          </span>
          <span className={`text-2xl font-black font-mono ${isDark ? 'text-white' : 'text-[#1C1917]'}`}>
            {prog.longestStreak}d
          </span>
          <span className="text-[10px] text-zinc-500 block mt-0.5">All-time record</span>
        </div>

        <div className={`p-4 rounded-2xl border ${
          isDark ? 'bg-[#141414] border-[#F87171]/20' : 'bg-white border-[#C2A68C]'
        }`}>
          <span className={`block text-[10px] font-bold uppercase tracking-wider ${isDark ? 'text-zinc-400' : 'text-[#78716C]'}`}>
            Total Gold
          </span>
          <span className="text-2xl font-black font-mono text-yellow-500 flex items-center gap-1">
            <Coins className="w-5 h-5" />
            <span>{prog.totalGoldEarned.toLocaleString()}</span>
          </span>
          <span className="text-[10px] text-zinc-500 block mt-0.5">Bounties harvested</span>
        </div>
      </div>

      {/* Main Charts & Progression Deck */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: 7-Day XP Velocity Bar Chart */}
        <div className={`lg:col-span-2 p-6 rounded-3xl border shadow-sm ${
          isDark ? 'bg-[#141414] border-[#F87171]/20' : 'bg-white border-[#C2A68C]'
        }`}>
          <div className="flex items-center justify-between mb-6">
            <div>
              <div className="flex items-center gap-2">
                <BarChart3 className={`w-4 h-4 ${isDark ? 'text-[#F87171]' : 'text-[#5D866C]'}`} />
                <h3 className={`text-base font-black font-rpg tracking-wide ${isDark ? 'text-white' : 'text-[#1C1917]'}`}>
                  XP Velocity & Daily Harvest
                </h3>
              </div>
              <p className={`text-xs mt-0.5 ${isDark ? 'text-zinc-400' : 'text-[#78716C]'}`}>
                Experience points accumulated over the last 7 recorded cycles.
              </p>
            </div>
            <span className={`text-xs font-mono font-bold px-2.5 py-1 rounded-lg border ${
              isDark ? 'border-[#F87171]/40 text-[#F87171]' : 'border-[#5D866C]/40 text-[#5D866C]'
            }`}>
              Avg: 220 XP/day
            </span>
          </div>

          {/* Bar Chart Visualization */}
          <div className="h-48 flex items-end justify-between gap-3 pt-6 border-b border-zinc-700/20 px-2">
            {prog.chartData.map((item, idx) => {
              const heightPercent = Math.min(100, Math.round((item.xp / maxChartXp) * 100));

              return (
                <div key={idx} className="flex-1 flex flex-col items-center gap-2 h-full justify-end group">
                  <span className={`text-[10px] font-mono opacity-0 group-hover:opacity-100 transition-opacity font-bold ${
                    isDark ? 'text-[#F87171]' : 'text-[#5D866C]'
                  }`}>
                    {item.xp} XP
                  </span>

                  <div className={`w-full max-w-[42px] rounded-t-xl transition-all duration-500 relative group-hover:brightness-110 ${
                    isDark
                      ? 'bg-gradient-to-t from-[#F87171]/50 to-[#F87171]'
                      : 'bg-gradient-to-t from-[#5D866C]/60 to-[#5D866C]'
                  }`}
                  style={{ height: `${Math.max(12, heightPercent)}%` }}
                  >
                    <div className="absolute top-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-white/60" />
                  </div>

                  <div className="text-center">
                    <span className={`block text-[11px] font-mono font-bold ${isDark ? 'text-zinc-300' : 'text-[#57534E]'}`}>
                      {item.date}
                    </span>
                    <span className="text-[9px] text-zinc-500 font-mono">
                      {item.quests} q
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Level Progress Slider */}
          <div className="mt-6 pt-4 border-t border-dashed border-zinc-700/20">
            <div className="flex items-center justify-between text-xs mb-2">
              <span className={`font-bold ${isDark ? 'text-white' : 'text-[#1C1917]'}`}>
                Ascension Progress: Level {xpInfo.level} &rarr; {xpInfo.nextLevel}
              </span>
              <span className={`font-mono font-bold ${isDark ? 'text-[#F87171]' : 'text-[#5D866C]'}`}>
                {xpInfo.currentLevelXp} / {xpInfo.requiredLevelXp} XP ({xpInfo.progressPercentage}%)
              </span>
            </div>
            <XPBar
              currentXp={xpInfo.currentLevelXp}
              requiredXp={xpInfo.requiredLevelXp}
              percentage={xpInfo.progressPercentage}
              size="md"
              showDetails={false}
            />
          </div>
        </div>

        {/* Right 1 Col: Attributes Radar & Recent Gains */}
        <div className={`p-6 rounded-3xl border shadow-sm flex flex-col justify-between ${
          isDark ? 'bg-[#141414] border-[#F87171]/20' : 'bg-white border-[#C2A68C]'
        }`}>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Activity className={`w-4 h-4 ${isDark ? 'text-[#F87171]' : 'text-[#5D866C]'}`} />
              <h3 className={`text-base font-black font-rpg tracking-wide ${isDark ? 'text-white' : 'text-[#1C1917]'}`}>
                Attribute Masteries
              </h3>
            </div>
            <p className={`text-xs mb-4 ${isDark ? 'text-zinc-400' : 'text-[#78716C]'}`}>
              Real-world disciplines leveled through quest completions.
            </p>

            <div className="space-y-3">
              {hero?.attributes && Object.entries(hero.attributes).map(([attr, score]) => {
                const gain = (hero.recentGains as any)?.[attr] || 0;
                const maxAttr = 100;
                const percent = Math.min(100, Math.round(((score as number) / maxAttr) * 100));

                return (
                  <div key={attr} className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className={`font-bold capitalize flex items-center gap-1.5 ${
                        isDark ? 'text-zinc-200' : 'text-[#1C1917]'
                      }`}>
                        <span>{attributeIcons[attr] || '⭐'}</span>
                        <span>{attr}</span>
                      </span>

                      <div className="flex items-center gap-2">
                        {gain > 0 && (
                          <span className="text-[10px] font-mono font-bold text-emerald-500">
                            +{gain}
                          </span>
                        )}
                        <span className="font-mono font-bold text-xs">{score}</span>
                      </div>
                    </div>

                    <div className="w-full h-2 rounded-full bg-zinc-700/20 overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${
                          isDark ? 'bg-[#F87171]' : 'bg-[#5D866C]'
                        }`}
                        style={{ width: `${percent}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className={`mt-6 p-3 rounded-xl text-center text-xs font-bold border ${
            isDark
              ? 'bg-[#1E1214] border-[#F87171]/30 text-[#F87171]'
              : 'bg-[#E6D8C3]/50 border-[#C2A68C] text-[#5D866C]'
          }`}>
            Dominant Focus: {hero?.heroClass || 'Scholar'}
          </div>
        </div>
      </div>

      {/* Level Milestones & Quest History Deck */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Milestones Timeline */}
        <div className={`p-6 rounded-3xl border shadow-sm ${
          isDark ? 'bg-[#141414] border-[#F87171]/20' : 'bg-white border-[#C2A68C]'
        }`}>
          <div className="flex items-center gap-2 mb-4">
            <Trophy className={`w-4 h-4 ${isDark ? 'text-[#F87171]' : 'text-[#5D866C]'}`} />
            <h3 className={`text-base font-black font-rpg tracking-wide ${isDark ? 'text-white' : 'text-[#1C1917]'}`}>
              Milestone Ascension Timeline
            </h3>
          </div>

          <div className="space-y-4">
            {prog.timeline.map((mile, i) => (
              <div key={i} className="flex items-start gap-3 relative">
                <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 text-xs font-mono font-bold border ${
                  isDark
                    ? 'bg-[#1E1214] border-[#F87171]/40 text-[#F87171]'
                    : 'bg-[#E6D8C3] border-[#C2A68C] text-[#5D866C]'
                }`}>
                  L{mile.level}
                </div>

                <div className="flex-1 min-w-0">
                  <div className={`text-xs font-bold truncate ${isDark ? 'text-white' : 'text-[#1C1917]'}`}>
                    {mile.unlockedTitle}
                  </div>
                  <div className="text-[10px] text-zinc-500 font-mono">
                    Unlocked on {mile.date}
                  </div>
                </div>

                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-1" />
              </div>
            ))}
          </div>
        </div>

        {/* Activity & Quest Completion Log */}
        <div className={`p-6 rounded-3xl border shadow-sm ${
          isDark ? 'bg-[#141414] border-[#F87171]/20' : 'bg-white border-[#C2A68C]'
        }`}>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Clock className={`w-4 h-4 ${isDark ? 'text-[#F87171]' : 'text-[#5D866C]'}`} />
              <h3 className={`text-base font-black font-rpg tracking-wide ${isDark ? 'text-white' : 'text-[#1C1917]'}`}>
                Activity Log
              </h3>
            </div>

            <div className="flex items-center gap-1 text-xs">
              {(['all', 'today'] as const).map((tab) => (
                <button
                  key={tab}
                  type="button"
                  onClick={() => setHistoryFilter(tab)}
                  className={`px-2.5 py-1 rounded-lg font-bold capitalize transition-all cursor-pointer ${
                    historyFilter === tab
                      ? isDark
                        ? 'bg-[#F87171] text-black font-black'
                        : 'bg-[#5D866C] text-white'
                      : isDark
                        ? 'text-zinc-400 hover:text-white'
                        : 'text-[#78716C] hover:text-[#1C1917]'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-3 max-h-80 overflow-y-auto pr-1">
            {filteredHistory.length > 0 ? (
              filteredHistory.map((item) => (
                <div
                  key={item.id}
                  className={`p-3 rounded-xl border flex items-center justify-between gap-3 ${
                    isDark ? 'bg-black/40 border-[#F87171]/20' : 'bg-white border-[#C2A68C]'
                  }`}
                >
                  <div className="min-w-0">
                    <div className={`text-xs font-bold truncate ${isDark ? 'text-white' : 'text-[#1C1917]'}`}>
                      {item.title}
                    </div>
                    <div className="flex items-center gap-2 text-[10px] text-zinc-500 font-mono mt-0.5">
                      <span>{item.category}</span>
                      <span>&bull;</span>
                      <span>{item.timestamp}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0 font-mono text-xs font-bold">
                    {item.xpGained > 0 && (
                      <span className="text-amber-500">+{item.xpGained} XP</span>
                    )}
                    {item.goldGained !== 0 && (
                      <span className={item.goldGained > 0 ? 'text-yellow-500' : 'text-rose-500'}>
                        {item.goldGained > 0 ? `+${item.goldGained}` : item.goldGained} G
                      </span>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-xs text-zinc-500">
                No activity records found for this period.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
