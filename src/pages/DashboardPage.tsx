import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Sparkles, 
  Flame, 
  Coins, 
  PlusCircle, 
  ArrowRight, 
  Trophy, 
  Compass, 
  CheckCircle2, 
  Award,
  Clock,
  CheckCheck,
  ShieldAlert,
  Zap
} from 'lucide-react';
import { useGame } from '../context/GameContext';
import { useTheme } from '../context/ThemeContext';
import { LevelBadge } from '../components/common/LevelBadge';
import { XPBar } from '../components/common/XPBar';
import { StreakCard } from '../components/common/StreakCard';
import { AttributeCard } from '../components/common/AttributeCard';
import { QuestCard } from '../components/common/QuestCard';
import { DashboardSkeleton } from '../components/common/LoadingSkeleton';
import { getXpDetails } from '../utils/rpgEngine';
import { recommendedQuests } from '../api/mockData';
import { getQuestDeadline } from '../utils/timeUtils';
import { Avatar } from '../components/common/Avatar';

const defaultEmptyHero = {
  id: 'char_default',
  userId: '',
  name: 'Hero',
  heroClass: 'Scholar' as const,
  title: 'Apprentice Seeker',
  avatarUrl: '',
  level: 1,
  xp: 0,
  gold: 0,
  streak: 0,
  longestStreak: 0,
  streakProtectionActive: false,
  streakHistory: [],
  attributes: { strength: 0, intelligence: 0, wisdom: 0, discipline: 0, endurance: 0, creativity: 0 },
  equipment: {},
  recentGains: {},
};

export const DashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const { 
    character, 
    user, 
    quests, 
    achievements, 
    loading, 
    addQuestFromDiscovery 
  } = useGame();
  const { isDark } = useTheme();

  const [questFilter, setQuestFilter] = useState<'Active' | 'Urgent' | 'Completed'>('Active');

  // If initial load with no character data at all, show skeleton briefly
  if (loading && !character) {
    return <DashboardSkeleton />;
  }

  // Reliable hero reference with fallback so dashboard never fails to render
  const hero = character || defaultEmptyHero;
  const xpInfo = getXpDetails(hero.xp ?? 0);

  // Safe attributes & recent gains with zero points default
  const attributes = hero.attributes || {
    strength: 0,
    intelligence: 0,
    wisdom: 0,
    discipline: 0,
    endurance: 0,
    creativity: 0,
  };
  const recentGains = (hero.recentGains || {}) as Record<string, number>;

  // Filter quests
  const allQuests = quests || [];
  const activeQuests = allQuests.filter((q) => q.status === 'Active');
  const completedQuests = allQuests.filter((q) => q.status === 'Completed');

  // Active quests due within the next 4 hours
  const urgentQuests = activeQuests.filter((q) => {
    const deadline = getQuestDeadline(q);
    const diff = deadline.getTime() - Date.now();
    return diff > 0 && diff <= 4 * 60 * 60 * 1000;
  });

  // Displayed quests according to tab
  const displayedQuests = questFilter === 'Active'
    ? activeQuests.slice(0, 5)
    : questFilter === 'Urgent'
    ? urgentQuests
    : completedQuests.slice(0, 5);

  // Recent achievements
  const unlockedAchievements = (achievements && achievements.length > 0)
    ? achievements.filter((a) => a.unlocked).slice(0, 3)
    : [];

  return (
    <div className="space-y-8 animate-fadeIn" id="dashboard-main-view">
      {/* Top Greeting & Command Deck Bar */}
      <div className={`flex flex-col md:flex-row md:items-center justify-between gap-4 pb-3 border-b ${
        isDark ? 'border-[#F87171]/20' : 'border-[#C2A68C]'
      }`}>
        <div>
          <div className={`inline-flex items-center gap-1.5 text-xs uppercase tracking-wider font-bold mb-1 ${
            isDark ? 'text-[#F87171]' : 'text-[#5D866C]'
          }`}>
            <Sparkles className="w-3.5 h-3.5" />
            <span>COMMAND DECK</span>
          </div>
          <h2 className={`text-2xl sm:text-3xl font-black font-rpg tracking-wide ${
            isDark ? 'text-white' : 'text-[#1C1917]'
          }`}>
            Welcome back, {user?.name || hero.name}
          </h2>
          <p className={`text-xs mt-0.5 ${
            isDark ? 'text-zinc-400' : 'text-[#78716C]'
          }`}>
            The realm awaits your deeds. {activeQuests.length} daily bounties are active today.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            id="dash-btn-discover"
            onClick={() => navigate('/discover')}
            className={`px-4 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider border flex items-center gap-2 transition-all cursor-pointer ${
              isDark
                ? 'bg-[#141414] hover:bg-[#1E1214] text-zinc-300 hover:text-white border-[#F87171]/30'
                : 'bg-white hover:bg-[#E6D8C3] text-[#1C1917] border-[#C2A68C]'
            }`}
          >
            <Compass className="w-4 h-4" />
            <span>DISCOVER</span>
          </button>

          <button
            type="button"
            id="dash-btn-create-quest"
            onClick={() => navigate('/quests/create')}
            className={`px-5 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider shadow-md flex items-center gap-2 transition-all hover:scale-105 cursor-pointer ${
              isDark
                ? 'bg-[#F87171] hover:bg-[#EF4444] text-black font-black shadow-[#F87171]/25'
                : 'bg-[#5D866C] hover:bg-[#4B6E57] text-white shadow-[#5D866C]/30'
            }`}
          >
            <PlusCircle className="w-4 h-4" />
            <span>INSCRIBE QUEST</span>
          </button>
        </div>
      </div>

      {/* 4 Hero Stats Bar with Edge Highlight Glow */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {/* Level */}
        <div className={`p-4 rounded-2xl border flex items-center gap-3 transition-all ${
          isDark
            ? 'bg-[#141414] border-[#F87171]/25 hover:border-[#F87171] shadow-sm shadow-[#F87171]/5 hover:shadow-[0_0_15px_rgba(248,113,113,0.15)]'
            : 'bg-white border-[#C2A68C] hover:border-[#5D866C]/60 shadow-sm'
        }`}>
          <div className={`w-11 h-11 rounded-xl border flex items-center justify-center shrink-0 ${
            isDark
              ? 'bg-[#1E1214] border-[#F87171]/30'
              : 'bg-[#E6D8C3] border-[#C2A68C]'
          }`}>
            <LevelBadge level={hero.level ?? 1} size="md" />
          </div>
          <div>
            <div className={`text-[10px] uppercase font-bold tracking-wider ${
              isDark ? 'text-zinc-400' : 'text-[#78716C]'
            }`}>
              HERO RANK
            </div>
            <div className={`text-lg font-black font-mono ${
              isDark ? 'text-white' : 'text-[#1C1917]'
            }`}>
              LEVEL {hero.level ?? 1}
            </div>
          </div>
        </div>

        {/* XP */}
        <div className={`p-4 rounded-2xl border flex items-center gap-3 transition-all ${
          isDark
            ? 'bg-[#141414] border-[#F87171]/25 hover:border-[#F87171] shadow-sm shadow-[#F87171]/5 hover:shadow-[0_0_15px_rgba(248,113,113,0.15)]'
            : 'bg-white border-[#C2A68C] hover:border-[#5D866C]/60 shadow-sm'
        }`}>
          <div className={`w-11 h-11 rounded-xl border flex items-center justify-center shrink-0 ${
            isDark
              ? 'bg-[#1E1214] border-[#F87171]/30 text-[#F87171]'
              : 'bg-[#E6D8C3] border-[#C2A68C] text-[#5D866C]'
          }`}>
            <Sparkles className="w-5 h-5" />
          </div>
          <div className="min-w-0">
            <div className={`text-[10px] uppercase font-bold tracking-wider ${
              isDark ? 'text-zinc-400' : 'text-[#78716C]'
            }`}>
              EXPERIENCE
            </div>
            <div className={`text-sm sm:text-base font-black font-mono truncate ${
              isDark ? 'text-[#F87171]' : 'text-[#5D866C]'
            }`}>
              {(xpInfo.currentLevelXp ?? 0).toLocaleString()} / {(xpInfo.requiredLevelXp ?? 100).toLocaleString()} XP
            </div>
          </div>
        </div>

        {/* Streak */}
        <div className={`p-4 rounded-2xl border flex items-center gap-3 transition-all ${
          isDark
            ? 'bg-[#141414] border-[#F87171]/25 hover:border-[#F87171] shadow-sm shadow-[#F87171]/5 hover:shadow-[0_0_15px_rgba(248,113,113,0.15)]'
            : 'bg-white border-[#C2A68C] hover:border-[#5D866C]/60 shadow-sm'
        }`}>
          <div className={`w-11 h-11 rounded-xl border flex items-center justify-center shrink-0 ${
            isDark
              ? 'bg-[#1E1214] border-[#F87171]/30 text-[#F87171]'
              : 'bg-[#E6D8C3] border-[#C2A68C] text-[#5D866C]'
          }`}>
            <Flame className={`w-5 h-5 ${isDark ? 'fill-[#F87171]/30 text-[#F87171]' : 'fill-[#5D866C]/30 text-[#5D866C]'}`} />
          </div>
          <div>
            <div className={`text-[10px] uppercase font-bold tracking-wider ${
              isDark ? 'text-zinc-400' : 'text-[#78716C]'
            }`}>
              CONTINUOUS
            </div>
            <div className={`text-lg font-black font-mono ${
              isDark ? 'text-[#F87171]' : 'text-[#5D866C]'
            }`}>
              🔥 {hero.streak ?? 0} DAY STREAK
            </div>
          </div>
        </div>

        {/* Gold — clickable to shop */}
        <div
          onClick={() => navigate('/rewards')}
          className={`p-4 rounded-2xl border flex items-center gap-3 transition-all cursor-pointer group ${
          isDark
            ? 'bg-[#141414] border-[#F87171]/25 hover:border-amber-500/60 shadow-sm shadow-[#F87171]/5 hover:shadow-[0_0_15px_rgba(245,158,11,0.2)]'
            : 'bg-white border-[#C2A68C] hover:border-amber-600/60 shadow-sm hover:shadow-md'
        }`}
          title="Click to visit Rewards Shop"
        >
          <div className={`w-11 h-11 rounded-xl border flex items-center justify-center shrink-0 ${
            isDark
              ? 'bg-[#1E1214] border-[#F87171]/30 text-amber-400'
              : 'bg-[#E6D8C3] border-[#C2A68C] text-[#B45309]'
          }`}>
            <Coins className="w-5 h-5 fill-amber-500/30 text-amber-500" />
          </div>
          <div>
            <div className={`text-[10px] uppercase font-bold tracking-wider ${
              isDark ? 'text-zinc-400' : 'text-[#78716C]'
            }`}>
              TREASURY <span className="opacity-0 group-hover:opacity-100 transition-opacity text-amber-500">→ SHOP</span>
            </div>
            <div className="text-lg font-black font-mono text-amber-500">
              🪙 {(hero.gold ?? 0).toLocaleString()} GOLD
            </div>
          </div>
        </div>
      </div>

      {/* Main Character Hero Card with Edge Highlight Glow */}
      <div className={`rounded-3xl p-6 sm:p-8 border-2 shadow-sm relative overflow-hidden transition-all ${
        isDark
          ? 'bg-[#141414] border-[#F87171]/40 shadow-[0_0_20px_rgba(248,113,113,0.08)]'
          : 'bg-[#E6D8C3] border-[#C2A68C]'
      }`}>
        {/* Ambient glow */}
        <div className={`absolute top-0 right-0 w-80 h-80 rounded-full blur-3xl pointer-events-none ${
          isDark ? 'bg-[#F87171]/10' : 'bg-[#C2A68C]/40'
        }`} />

        <div className="flex flex-col lg:flex-row items-start lg:items-center gap-6 mb-8 relative z-10">
          {/* Large Avatar with link to edit profile on character page */}
          <div
            onClick={() => navigate('/character')}
            className="cursor-pointer group relative shrink-0 transition-transform hover:scale-105"
            title="Click to edit character sheet and portrait"
          >
            <Avatar
              src={hero.avatarUrl}
              name={hero.name}
              level={hero.level}
              heroClass={hero.heroClass}
              size="xl"
            />
          </div>

          {/* Hero Meta & Animated XP Bar */}
          <div className="flex-1 w-full">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
              <div>
                <h3 className={`text-2xl font-black font-rpg flex items-center gap-2.5 ${
                  isDark ? 'text-white' : 'text-[#1C1917]'
                }`}>
                  <span>{hero.name}</span>
                  <span className={`text-xs font-mono font-bold px-2.5 py-0.5 rounded-full border ${
                    isDark
                      ? 'text-[#F87171] bg-[#1E1214] border-[#F87171]/40'
                      : 'text-[#5D866C] bg-white border-[#C2A68C]'
                  }`}>
                    {hero.heroClass}
                  </span>
                </h3>
                <p className={`text-xs font-medium ${
                  isDark ? 'text-zinc-400' : 'text-[#78716C]'
                }`}>
                  {hero.title}
                </p>
              </div>

              <span className={`text-xs font-mono font-bold px-3 py-1 rounded-xl self-start sm:self-auto shadow-sm border ${
                isDark
                  ? 'text-amber-400 bg-[#1A1612] border-amber-500/30'
                  : 'text-[#B45309] bg-white border-[#C2A68C]'
              }`}>
                🪙 {(hero.gold ?? 0).toLocaleString()} Gold Balance
              </span>
            </div>

            {/* Animated XP Progress Bar */}
            <div className="mt-4">
              <XPBar
                currentXp={xpInfo.currentLevelXp}
                requiredXp={xpInfo.requiredLevelXp}
                level={hero.level}
                percentage={xpInfo.progressPercentage}
                size="md"
              />
            </div>
          </div>
        </div>

        {/* 6 Attributes Grid with Progress Bars */}
        <div className={`pt-6 border-t relative z-10 ${
          isDark ? 'border-[#F87171]/20' : 'border-[#C2A68C]'
        }`}>
          <div className="flex items-center justify-between mb-3 text-xs font-bold uppercase tracking-wider">
            <span className={isDark ? 'text-zinc-400' : 'text-[#78716C]'}>Character Attributes</span>
            <span className={`text-[11px] font-mono font-bold ${
              isDark ? 'text-[#F87171]' : 'text-[#5D866C]'
            }`}>
              Attribute Mastery
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            <AttributeCard type="strength" value={attributes.strength ?? 0} recentGain={recentGains.strength ?? 0} />
            <AttributeCard type="intelligence" value={attributes.intelligence ?? 0} recentGain={recentGains.intelligence ?? 0} />
            <AttributeCard type="wisdom" value={attributes.wisdom ?? 0} recentGain={recentGains.wisdom ?? 0} />
            <AttributeCard type="discipline" value={attributes.discipline ?? 0} recentGain={recentGains.discipline ?? 0} />
            <AttributeCard type="endurance" value={attributes.endurance ?? 0} recentGain={recentGains.endurance ?? 0} />
            <AttributeCard type="creativity" value={attributes.creativity ?? 0} recentGain={recentGains.creativity ?? 0} />
          </div>
        </div>
      </div>

      {/* Main 2-Column Section: Quests Interactive Console + Streak Aegis */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Quests Column (8 Columns) */}
        <div className="lg:col-span-8 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <h3 className={`text-lg font-bold font-rpg ${
                isDark ? 'text-white' : 'text-[#1C1917]'
              }`}>
                Quest Log
              </h3>

              {/* Tabs for Active / Urgent / Completed */}
              <div className="flex items-center gap-1.5 ml-2">
                <button
                  type="button"
                  onClick={() => setQuestFilter('Active')}
                  className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    questFilter === 'Active'
                      ? isDark
                        ? 'bg-[#F87171] text-black font-black shadow-sm'
                        : 'bg-[#5D866C] text-white shadow-sm'
                      : isDark
                        ? 'bg-[#1A1A1A] text-zinc-400 hover:text-white border border-[#F87171]/20'
                        : 'bg-white text-[#78716C] hover:text-[#1C1917] border border-[#C2A68C]'
                  }`}
                >
                  Active ({activeQuests.length})
                </button>

                <button
                  type="button"
                  onClick={() => setQuestFilter('Urgent')}
                  className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1 ${
                    questFilter === 'Urgent'
                      ? isDark
                        ? 'bg-rose-500 text-white font-black shadow-sm'
                        : 'bg-rose-600 text-white shadow-sm'
                      : isDark
                        ? 'bg-[#1A1A1A] text-zinc-400 hover:text-white border border-[#F87171]/20'
                        : 'bg-white text-[#78716C] hover:text-[#1C1917] border border-[#C2A68C]'
                  }`}
                >
                  <Clock className="w-3 h-3" />
                  <span>Due Soon ({urgentQuests.length})</span>
                </button>

                <button
                  type="button"
                  onClick={() => setQuestFilter('Completed')}
                  className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1 ${
                    questFilter === 'Completed'
                      ? isDark
                        ? 'bg-emerald-600 text-white font-black shadow-sm'
                        : 'bg-emerald-700 text-white shadow-sm'
                      : isDark
                        ? 'bg-[#1A1A1A] text-zinc-400 hover:text-white border border-[#F87171]/20'
                        : 'bg-white text-[#78716C] hover:text-[#1C1917] border border-[#C2A68C]'
                  }`}
                >
                  <CheckCheck className="w-3 h-3" />
                  <span>Done ({completedQuests.length})</span>
                </button>
              </div>
            </div>

            <button
              type="button"
              onClick={() => navigate('/quests')}
              className={`text-xs font-bold flex items-center gap-1 transition-colors cursor-pointer self-start sm:self-auto ${
                isDark ? 'text-[#F87171] hover:text-[#EF4444]' : 'text-[#5D866C] hover:text-[#4B6E57]'
              }`}
            >
              <span>Manage Quests</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Urgent Bounties Due Within 4 Hours Alert */}
          {urgentQuests.length > 0 && questFilter !== 'Completed' && (
            <div className={`p-4 rounded-2xl border-2 shadow-md flex flex-col sm:flex-row sm:items-center justify-between gap-3 animate-fadeIn ${
              isDark
                ? 'bg-[#1C1214] border-[#F87171] shadow-[#F87171]/20'
                : 'bg-[#E6D8C3] border-[#5D866C]'
            }`}>
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold shrink-0 shadow-md ${
                  isDark ? 'bg-[#F87171] text-black shadow-[#F87171]/30' : 'bg-[#5D866C] text-white shadow-[#5D866C]/30'
                }`}>
                  <Flame className="w-5 h-5 fill-current animate-bounce" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className={`text-xs font-black uppercase tracking-wider font-rpg ${
                      isDark ? 'text-[#F87171]' : 'text-[#5D866C]'
                    }`}>
                      Bounty Deadline Alert
                    </span>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${
                      isDark ? 'bg-[#F87171] text-black' : 'bg-[#5D866C] text-white'
                    }`}>
                      {urgentQuests.length} DUE SOON
                    </span>
                  </div>
                  <p className={`text-[11px] mt-0.5 ${
                    isDark ? 'text-zinc-300' : 'text-[#57534E]'
                  }`}>
                    Quests highlighted with crimson borders are expiring soon. Complete them to safeguard your streak!
                  </p>
                </div>
              </div>
            </div>
          )}

          {displayedQuests.length > 0 ? (
            <div className="space-y-3">
              {displayedQuests.map((quest) => (
                <QuestCard key={quest.id} quest={quest} />
              ))}
            </div>
          ) : (
            <div className={`p-8 rounded-2xl border text-center shadow-sm ${
              isDark
                ? 'bg-[#141414] border-[#F87171]/20 text-zinc-400'
                : 'bg-white border-[#C2A68C] text-[#78716C]'
            }`}>
              <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto mb-2" />
              <div className={`text-sm font-bold ${isDark ? 'text-white' : 'text-[#1C1917]'}`}>
                {questFilter === 'Active' && 'All daily quests cleared!'}
                {questFilter === 'Urgent' && 'No urgent quests right now.'}
                {questFilter === 'Completed' && 'No quests completed yet today.'}
              </div>
              <p className="text-xs mt-1">
                {questFilter === 'Active' 
                  ? "You've conquered your list. Inscribe a new quest or claim recommendations below."
                  : 'Maintain steady progress across your daily goals to level up faster!'}
              </p>
              {questFilter === 'Active' && (
                <button
                  type="button"
                  onClick={() => navigate('/quests/create')}
                  className={`mt-4 px-4 py-2 rounded-xl text-xs font-bold inline-flex items-center gap-1.5 cursor-pointer ${
                    isDark
                      ? 'bg-[#F87171] text-black font-black'
                      : 'bg-[#5D866C] text-white'
                  }`}
                >
                  <PlusCircle className="w-3.5 h-3.5" />
                  <span>Inscribe New Bounty</span>
                </button>
              )}
            </div>
          )}
        </div>

        {/* Right Sidebar: Streak Card & Recent Achievements (4 Columns) */}
        <div className="lg:col-span-4 space-y-6">
          {/* Streak System Component */}
          <StreakCard
            currentStreak={hero.streak ?? 0}
            longestStreak={hero.longestStreak ?? 0}
            protectionActive={hero.streakProtectionActive ?? true}
            history={hero.streakHistory}
          />

          {/* Recent Achievements */}
          <div className={`rounded-2xl p-5 border shadow-sm ${
            isDark
              ? 'bg-[#141414] border-[#F87171]/25 hover:border-[#F87171]/50'
              : 'bg-white border-[#C2A68C]'
          }`}>
            <div className="flex items-center justify-between mb-4">
              <div className={`flex items-center gap-2 text-xs font-bold uppercase tracking-wider font-rpg ${
                isDark ? 'text-white' : 'text-[#1C1917]'
              }`}>
                <Trophy className={`w-4 h-4 ${isDark ? 'text-[#F87171]' : 'text-[#5D866C]'}`} />
                <span>Feats of Valour</span>
              </div>
              <button
                type="button"
                onClick={() => navigate('/achievements')}
                className={`text-[11px] font-semibold cursor-pointer ${
                  isDark ? 'text-[#F87171] hover:text-[#EF4444]' : 'text-[#5D866C] hover:text-[#4B6E57]'
                }`}
              >
                All Feats
              </button>
            </div>

            {unlockedAchievements.length > 0 ? (
              <div className="space-y-2.5">
                {unlockedAchievements.map((ach) => (
                  <div
                    key={ach.id}
                    className={`p-3 rounded-xl border flex items-center justify-between gap-3 ${
                      isDark
                        ? 'bg-[#191516] border-[#F87171]/20'
                        : 'bg-[#E6D8C3]/60 border-[#C2A68C]'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                        isDark
                          ? 'bg-[#2A181C] text-[#F87171]'
                          : 'bg-[#C2A68C] text-[#5D866C]'
                      }`}>
                        <Award className="w-4 h-4" />
                      </div>
                      <div className="min-w-0">
                        <div className={`text-xs font-bold truncate ${isDark ? 'text-white' : 'text-[#1C1917]'}`}>
                          {ach.name}
                        </div>
                        <div className={`text-[10px] truncate ${isDark ? 'text-zinc-400' : 'text-[#78716C]'}`}>
                          {ach.description}
                        </div>
                      </div>
                    </div>
                    <span className={`text-[10px] font-mono font-bold shrink-0 ${
                      isDark ? 'text-[#F87171]' : 'text-[#5D866C]'
                    }`}>
                      +{ach.rewardXp} XP
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-4">
                <p className={`text-xs ${isDark ? 'text-zinc-400' : 'text-[#78716C]'}`}>
                  Complete daily quests to unlock heroic achievements!
                </p>
              </div>
            )}
          </div>

          {/* Quick Guild Overview */}
          <div className={`rounded-2xl p-4 border flex items-center justify-between ${
            isDark
              ? 'bg-[#141414] border-[#F87171]/20'
              : 'bg-white border-[#C2A68C]'
          }`}>
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                isDark ? 'bg-[#1E1214] text-[#F87171]' : 'bg-[#E6D8C3] text-[#5D866C]'
              }`}>
                <Zap className="w-5 h-5" />
              </div>
              <div>
                <div className={`text-xs font-bold ${isDark ? 'text-white' : 'text-[#1C1917]'}`}>
                  Shop Bazaar
                </div>
                <div className={`text-[10px] ${isDark ? 'text-zinc-400' : 'text-[#78716C]'}`}>
                  Gear, titles & badges available
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={() => navigate('/rewards')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-colors cursor-pointer ${
                isDark
                  ? 'bg-[#1E1214] hover:bg-[#F87171] text-[#F87171] hover:text-black border-[#F87171]/40'
                  : 'bg-[#E6D8C3] hover:bg-[#5D866C] hover:text-white text-[#1C1917] border-[#C2A68C]'
              }`}
            >
              Enter Shop
            </button>
          </div>
        </div>
      </div>

      {/* Recommended Quests Section */}
      <div className="pt-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Compass className={`w-5 h-5 ${isDark ? 'text-[#F87171]' : 'text-[#5D866C]'}`} />
            <h3 className={`text-lg font-bold font-rpg ${
              isDark ? 'text-white' : 'text-[#1C1917]'
            }`}>
              Recommended Daily Bounties
            </h3>
          </div>
          <button
            type="button"
            onClick={() => navigate('/discover')}
            className={`text-xs font-bold flex items-center gap-1 transition-colors cursor-pointer ${
              isDark ? 'text-[#F87171] hover:text-[#EF4444]' : 'text-[#5D866C] hover:text-[#4B6E57]'
            }`}
          >
            <span>Discover More</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {recommendedQuests.slice(0, 3).map((rec, i) => (
            <div
              key={i}
              className={`p-4 rounded-2xl border shadow-sm transition-all flex flex-col justify-between ${
                isDark
                  ? 'bg-[#141414] border-[#F87171]/25 hover:border-[#F87171] shadow-sm shadow-[#F87171]/5 hover:shadow-[0_0_15px_rgba(248,113,113,0.15)]'
                  : 'bg-white border-[#C2A68C] hover:border-[#5D866C]/50'
              }`}
            >
              <div>
                <div className="flex items-center justify-between text-[11px] font-bold mb-2">
                  <span className={isDark ? 'text-[#F87171]' : 'text-[#5D866C]'}>{rec.category}</span>
                  <span className={`font-mono ${isDark ? 'text-zinc-400' : 'text-[#78716C]'}`}>{rec.estimatedTime}</span>
                </div>
                <h4 className={`text-sm font-bold mb-1 ${isDark ? 'text-white' : 'text-[#1C1917]'}`}>
                  {rec.title}
                </h4>
                <p className={`text-xs line-clamp-2 mb-3 ${isDark ? 'text-zinc-400' : 'text-[#57534E]'}`}>
                  {rec.description}
                </p>
              </div>

              <div className={`flex items-center justify-between pt-3 border-t text-xs ${
                isDark ? 'border-[#F87171]/20' : 'border-[#C2A68C]'
              }`}>
                <div className={`font-mono font-bold ${isDark ? 'text-[#F87171]' : 'text-[#5D866C]'}`}>
                  +{rec.xpReward} XP • +{rec.goldReward} Gold
                </div>
                <button
                  type="button"
                  onClick={() => addQuestFromDiscovery(rec)}
                  className={`px-3 py-1.5 rounded-lg font-bold text-[11px] border transition-colors cursor-pointer ${
                    isDark
                      ? 'bg-[#1E1214] hover:bg-[#F87171] text-[#F87171] hover:text-black border-[#F87171]/40'
                      : 'bg-[#E6D8C3] hover:bg-[#5D866C] hover:text-white text-[#1C1917] border-[#C2A68C]'
                  }`}
                >
                  + ADD
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
