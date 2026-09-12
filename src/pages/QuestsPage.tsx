import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Scroll, 
  PlusCircle, 
  Search, 
  Flame, 
  Compass, 
  Filter, 
  Sparkles,
  CheckCircle2,
  Clock,
  Zap,
  Target
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useGame } from '../context/GameContext';
import { useTheme } from '../context/ThemeContext';
import { QuestCard } from '../components/common/QuestCard';
import { EmptyState } from '../components/common/EmptyState';
import { QuestCategory, QuestDifficulty } from '../types';
import { getQuestDeadline } from '../utils/timeUtils';

const categories: (QuestCategory | 'All')[] = [
  'All',
  'Knowledge',
  'Coding',
  'Fitness',
  'Health',
  'Creativity',
  'Discipline',
  'Personal',
];

const difficulties: (QuestDifficulty | 'All')[] = ['All', 'Easy', 'Medium', 'Hard', 'Epic'];

export const QuestsPage: React.FC = () => {
  const navigate = useNavigate();
  const { quests, loading } = useGame();
  const { isDark } = useTheme();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<QuestCategory | 'All'>('All');
  const [selectedDifficulty, setSelectedDifficulty] = useState<QuestDifficulty | 'All'>('All');
  const [statusTab, setStatusTab] = useState<'Active' | 'Urgent' | 'Completed' | 'All'>('Active');

  const allQuests = quests || [];

  // Urgent quests (< 4 hours)
  const urgentQuests = useMemo(() => {
    return allQuests.filter((q) => {
      if (q.status !== 'Active') return false;
      const deadline = getQuestDeadline(q);
      const diff = deadline.getTime() - Date.now();
      return diff > 0 && diff <= 4 * 60 * 60 * 1000;
    });
  }, [allQuests]);

  const filteredQuests = useMemo(() => {
    return allQuests.filter((quest) => {
      // Status filter
      if (statusTab === 'Active' && quest.status !== 'Active') return false;
      if (statusTab === 'Completed' && quest.status !== 'Completed') return false;
      if (statusTab === 'Urgent') {
        const deadline = getQuestDeadline(quest);
        const diff = deadline.getTime() - Date.now();
        if (quest.status !== 'Active' || diff <= 0 || diff > 4 * 60 * 60 * 1000) return false;
      }

      // Category filter
      if (selectedCategory !== 'All' && quest.category !== selectedCategory) return false;

      // Difficulty filter
      if (selectedDifficulty !== 'All' && quest.difficulty !== selectedDifficulty) return false;

      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesTitle = quest.title.toLowerCase().includes(q);
        const matchesDesc = quest.description.toLowerCase().includes(q);
        const matchesCat = quest.category.toLowerCase().includes(q);
        if (!matchesTitle && !matchesDesc && !matchesCat) return false;
      }

      return true;
    });
  }, [allQuests, statusTab, selectedCategory, selectedDifficulty, searchQuery]);

  const activeCount = allQuests.filter((q) => q.status === 'Active').length;
  const completedCount = allQuests.filter((q) => q.status === 'Completed').length;

  return (
    <div className="space-y-8 animate-fadeIn" id="quests-page-container">
      {/* Header Deck */}
      <div className={`flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b ${
        isDark ? 'border-[#F87171]/20' : 'border-[#C2A68C]'
      }`}>
        <div>
          <div className={`inline-flex items-center gap-1.5 text-xs uppercase tracking-wider font-bold mb-1 ${
            isDark ? 'text-[#F87171]' : 'text-[#5D866C]'
          }`}>
            <Scroll className="w-4 h-4" />
            <span>COMMAND REGISTRY</span>
          </div>
          <h1 className={`text-2xl md:text-3xl font-black font-rpg tracking-wide ${
            isDark ? 'text-white' : 'text-[#1C1917]'
          }`}>
            Hero's Quest Log
          </h1>
          <p className={`text-xs md:text-sm mt-1 ${isDark ? 'text-zinc-400' : 'text-[#78716C]'}`}>
            Execute your real-world tasks, reap bountiful XP and gold rewards, and power your character's ascension.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2.5 shrink-0">
          <button
            type="button"
            onClick={() => navigate('/discover')}
            className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all border cursor-pointer ${
              isDark
                ? 'border-[#F87171]/40 text-[#F87171] bg-[#1E1214] hover:bg-[#F87171]/20'
                : 'border-[#5D866C]/40 text-[#5D866C] bg-white hover:bg-[#5D866C]/10'
            }`}
          >
            <Sparkles className="w-4 h-4" />
            <span>AI Discover</span>
          </button>

          <button
            type="button"
            onClick={() => navigate('/quests/create')}
            className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all shadow-md cursor-pointer ${
              isDark
                ? 'bg-[#F87171] hover:bg-[#EF4444] text-black font-black shadow-[#F87171]/20'
                : 'bg-[#5D866C] hover:bg-[#4C715A] text-white shadow-[#5D866C]/25'
            }`}
          >
            <PlusCircle className="w-4 h-4" />
            <span>Create Quest</span>
          </button>
        </div>
      </div>

      {/* Overview Stat Counters */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 md:gap-4">
        <div
          onClick={() => setStatusTab('Active')}
          className={`p-4 rounded-2xl border cursor-pointer transition-all ${
            statusTab === 'Active'
              ? isDark ? 'border-[#F87171] bg-[#1E1214]' : 'border-[#5D866C] bg-white shadow-md'
              : isDark ? 'border-[#F87171]/20 bg-[#141414]' : 'border-[#C2A68C] bg-white/60'
          }`}
        >
          <div className="flex items-center justify-between mb-1">
            <span className={`text-[11px] font-bold uppercase tracking-wider ${isDark ? 'text-zinc-400' : 'text-[#78716C]'}`}>
              Active Quests
            </span>
            <Target className={`w-4 h-4 ${isDark ? 'text-[#F87171]' : 'text-[#5D866C]'}`} />
          </div>
          <div className={`text-2xl font-black font-mono ${isDark ? 'text-white' : 'text-[#1C1917]'}`}>
            {activeCount}
          </div>
        </div>

        <div
          onClick={() => setStatusTab('Urgent')}
          className={`p-4 rounded-2xl border cursor-pointer transition-all ${
            statusTab === 'Urgent'
              ? isDark ? 'border-[#F87171] bg-[#1E1214]' : 'border-[#5D866C] bg-white shadow-md'
              : isDark ? 'border-[#F87171]/20 bg-[#141414]' : 'border-[#C2A68C] bg-white/60'
          }`}
        >
          <div className="flex items-center justify-between mb-1">
            <span className={`text-[11px] font-bold uppercase tracking-wider ${isDark ? 'text-amber-400' : 'text-amber-700'}`}>
              Urgent (&lt;4h)
            </span>
            <Flame className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-2xl font-black font-mono text-amber-500">
            {urgentQuests.length}
          </div>
        </div>

        <div
          onClick={() => setStatusTab('Completed')}
          className={`p-4 rounded-2xl border cursor-pointer transition-all ${
            statusTab === 'Completed'
              ? isDark ? 'border-[#F87171] bg-[#1E1214]' : 'border-[#5D866C] bg-white shadow-md'
              : isDark ? 'border-[#F87171]/20 bg-[#141414]' : 'border-[#C2A68C] bg-white/60'
          }`}
        >
          <div className="flex items-center justify-between mb-1">
            <span className={`text-[11px] font-bold uppercase tracking-wider ${isDark ? 'text-emerald-400' : 'text-emerald-700'}`}>
              Completed
            </span>
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-2xl font-black font-mono text-emerald-500">
            {completedCount}
          </div>
        </div>

        <div
          onClick={() => setStatusTab('All')}
          className={`p-4 rounded-2xl border cursor-pointer transition-all ${
            statusTab === 'All'
              ? isDark ? 'border-[#F87171] bg-[#1E1214]' : 'border-[#5D866C] bg-white shadow-md'
              : isDark ? 'border-[#F87171]/20 bg-[#141414]' : 'border-[#C2A68C] bg-white/60'
          }`}
        >
          <div className="flex items-center justify-between mb-1">
            <span className={`text-[11px] font-bold uppercase tracking-wider ${isDark ? 'text-zinc-400' : 'text-[#78716C]'}`}>
              Total Logged
            </span>
            <Zap className={`w-4 h-4 ${isDark ? 'text-[#F87171]' : 'text-[#5D866C]'}`} />
          </div>
          <div className={`text-2xl font-black font-mono ${isDark ? 'text-white' : 'text-[#1C1917]'}`}>
            {allQuests.length}
          </div>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className={`p-4 rounded-2xl border space-y-3.5 ${
        isDark ? 'bg-[#141414] border-[#F87171]/20' : 'bg-white border-[#C2A68C]'
      }`}>
        <div className="flex flex-col md:flex-row md:items-center gap-3">
          {/* Search Box */}
          <div className="relative flex-1">
            <Search className={`absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 ${
              isDark ? 'text-zinc-500' : 'text-[#78716C]'
            }`} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search quests by title, description or tag..."
              className={`w-full pl-10 pr-4 py-2.5 rounded-xl text-xs font-medium border focus:outline-none transition-colors ${
                isDark
                  ? 'bg-black/50 border-[#F87171]/30 text-white placeholder-zinc-500 focus:border-[#F87171]'
                  : 'bg-[#F9F7F4] border-[#C2A68C] text-[#1C1917] placeholder-[#78716C] focus:border-[#5D866C]'
              }`}
            />
          </div>

          {/* Status Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0">
            {(['Active', 'Urgent', 'Completed', 'All'] as const).map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => setStatusTab(tab)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer ${
                  statusTab === tab
                    ? isDark
                      ? 'bg-[#F87171] text-black shadow-sm shadow-[#F87171]/20'
                      : 'bg-[#5D866C] text-white shadow-sm shadow-[#5D866C]/25'
                    : isDark
                      ? 'text-zinc-400 hover:text-white bg-white/5'
                      : 'text-[#57534E] hover:text-[#1C1917] bg-[#E6D8C3]/50'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* Category Pills & Difficulty Dropdown */}
        <div className="flex flex-wrap items-center justify-between gap-2.5 pt-2 border-t border-dashed border-zinc-700/20">
          <div className="flex items-center gap-1.5 overflow-x-auto py-1 max-w-full">
            <span className={`text-[11px] font-bold uppercase tracking-wider shrink-0 mr-1 ${
              isDark ? 'text-zinc-400' : 'text-[#78716C]'
            }`}>
              Category:
            </span>
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all shrink-0 cursor-pointer ${
                  selectedCategory === cat
                    ? isDark
                      ? 'bg-[#F87171]/20 text-[#F87171] border border-[#F87171]'
                      : 'bg-[#5D866C]/20 text-[#5D866C] border border-[#5D866C]'
                    : isDark
                      ? 'text-zinc-400 hover:text-white bg-white/5 border border-transparent'
                      : 'text-[#78716C] hover:text-[#1C1917] bg-white border border-[#C2A68C]'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <span className={`text-[11px] font-bold uppercase tracking-wider ${
              isDark ? 'text-zinc-400' : 'text-[#78716C]'
            }`}>
              Difficulty:
            </span>
            <select
              value={selectedDifficulty}
              onChange={(e) => setSelectedDifficulty(e.target.value as any)}
              className={`px-2.5 py-1 rounded-lg text-xs font-bold border focus:outline-none cursor-pointer ${
                isDark
                  ? 'bg-[#1E1214] border-[#F87171]/40 text-white'
                  : 'bg-white border-[#C2A68C] text-[#1C1917]'
              }`}
            >
              {difficulties.map((diff) => (
                <option key={diff} value={diff}>
                  {diff}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Quest Cards Grid */}
      {filteredQuests.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <AnimatePresence mode="popLayout">
            {filteredQuests.map((quest) => (
              <QuestCard
                key={quest.id}
                quest={quest}
                onEdit={() => navigate('/quests/create')}
              />
            ))}
          </AnimatePresence>
        </div>
      ) : (
        <EmptyState
          icon={Scroll}
          title="No Quests Match Your Filter"
          description={
            searchQuery
              ? `No quests matching "${searchQuery}". Clear your search or create a new quest.`
              : `Your ${statusTab.toLowerCase()} quest log is currently clear. Forge a new task to continue leveling up!`
          }
          actionText="Create New Quest"
          onAction={() => navigate('/quests/create')}
        />
      )}
    </div>
  );
};
