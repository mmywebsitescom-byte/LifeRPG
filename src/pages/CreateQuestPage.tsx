import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Sparkles, 
  Coins, 
  TrendingUp, 
  Clock, 
  Calendar, 
  Repeat, 
  AlertCircle, 
  ArrowLeft 
} from 'lucide-react';
import { useGame } from '../context/GameContext';
import { useTheme } from '../context/ThemeContext';
import { QuestCategory, QuestDifficulty, AttributeType } from '../types';
import { calculateQuestRewards } from '../utils/rpgEngine';

export const CreateQuestPage: React.FC = () => {
  const navigate = useNavigate();
  const { createQuest } = useGame();
  const { isDark } = useTheme();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<QuestCategory>('Coding');
  const [difficulty, setDifficulty] = useState<QuestDifficulty>('Medium');
  const [estimatedTime, setEstimatedTime] = useState('1 hour');
  const [dueDate, setDueDate] = useState(new Date().toISOString().split('T')[0]);
  const [dueTime, setDueTime] = useState('');
  const [repeat, setRepeat] = useState<'None' | 'Daily' | 'Weekly'>('None');

  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // Dynamic Calculated Rewards Preview
  const previewRewards = useMemo(() => {
    return calculateQuestRewards(difficulty, category);
  }, [category, difficulty]);

  const categories: QuestCategory[] = [
    'Knowledge',
    'Coding',
    'Fitness',
    'Health',
    'Creativity',
    'Discipline',
    'Personal',
    'Other',
  ];

  const difficulties: QuestDifficulty[] = ['Easy', 'Medium', 'Hard', 'Epic'];
  const times = ['15 mins', '30 mins', '45 mins', '1 hour', '1.5 hours', '2 hours', '3+ hours'];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!title.trim()) {
      setError('Please provide a title for your quest.');
      return;
    }

    setSubmitting(true);
    try {
      await createQuest({
        title,
        description,
        category,
        difficulty,
        estimatedTime,
        dueDate,
        dueTime: dueTime || undefined,
        repeat,
        xpReward: previewRewards.xpReward,
        goldReward: previewRewards.goldReward,
        attribute: previewRewards.attribute as AttributeType,
        attributeReward: previewRewards.attributeReward,
      });

      navigate('/quests');
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to create quest';
      setError(msg);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-fadeIn" id="create-quest-view">
      {/* Header */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className={`p-2 rounded-xl border transition-colors shadow-sm cursor-pointer ${
            isDark
              ? 'bg-[#141414] border-[#F87171]/30 text-zinc-300 hover:text-white hover:border-[#F87171]'
              : 'bg-white border-[#C2A68C] text-[#78716C] hover:text-[#1C1917]'
          }`}
          aria-label="Go back"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>
        <div>
          <h2 className={`text-2xl font-black font-rpg tracking-wide ${
            isDark ? 'text-white' : 'text-[#1C1917]'
          }`}>
            INSCRIBE NEW QUEST
          </h2>
          <p className={`text-xs ${isDark ? 'text-zinc-400' : 'text-[#78716C]'}`}>
            Define a real-world goal. Complete it to power up your hero stats.
          </p>
        </div>
      </div>

      {error && (
        <div className={`p-3 rounded-xl border text-xs flex items-center gap-2 ${
          isDark
            ? 'bg-rose-950/70 border-rose-600/50 text-rose-300'
            : 'bg-rose-50 border-rose-200 text-rose-700'
        }`}>
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Main Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className={`rounded-3xl p-6 sm:p-8 border shadow-sm space-y-5 transition-colors ${
          isDark
            ? 'bg-[#141414] border-[#F87171]/25'
            : 'bg-white border-[#C2A68C]'
        }`}>
          {/* Quest Name */}
          <div>
            <label className={`block text-xs font-semibold mb-1.5 ${
              isDark ? 'text-zinc-200' : 'text-[#1C1917]'
            }`}>
              Quest Title <span className={isDark ? 'text-[#F87171]' : 'text-[#5D866C]'}>*</span>
            </label>
            <input
              type="text"
              id="quest-input-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Build React Router layout & animations"
              required
              className={`w-full py-2.5 px-3.5 rounded-xl border text-xs focus:outline-none transition-all ${
                isDark
                  ? 'bg-[#1E1214] border-[#F87171]/30 text-white placeholder:text-zinc-600 focus:border-[#F87171]'
                  : 'bg-[#F5F5F0] border-[#C2A68C] text-[#1C1917] focus:border-[#5D866C]'
              }`}
            />
          </div>

          {/* Description */}
          <div>
            <label className={`block text-xs font-semibold mb-1.5 ${
              isDark ? 'text-zinc-200' : 'text-[#1C1917]'
            }`}>
              Description & Objectives
            </label>
            <textarea
              id="quest-input-desc"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              placeholder="Outline specific milestones or acceptance criteria for this real-world task..."
              className={`w-full py-2.5 px-3.5 rounded-xl border text-xs focus:outline-none transition-all ${
                isDark
                  ? 'bg-[#1E1214] border-[#F87171]/30 text-white placeholder:text-zinc-600 focus:border-[#F87171]'
                  : 'bg-[#F5F5F0] border-[#C2A68C] text-[#1C1917] focus:border-[#5D866C]'
              }`}
            />
          </div>

          {/* Category & Difficulty Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className={`block text-xs font-semibold mb-1.5 ${
                isDark ? 'text-zinc-200' : 'text-[#1C1917]'
              }`}>
                Category
              </label>
              <select
                id="quest-select-category"
                value={category}
                onChange={(e) => setCategory(e.target.value as QuestCategory)}
                className={`w-full py-2 px-3 rounded-xl border text-xs focus:outline-none transition-all ${
                  isDark
                    ? 'bg-[#1E1214] border-[#F87171]/30 text-white focus:border-[#F87171]'
                    : 'bg-[#F5F5F0] border-[#C2A68C] text-[#1C1917] focus:border-[#5D866C]'
                }`}
              >
                {categories.map((c) => (
                  <option key={c} value={c} className={isDark ? 'bg-zinc-900 text-white' : ''}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className={`block text-xs font-semibold mb-1.5 ${
                isDark ? 'text-zinc-200' : 'text-[#1C1917]'
              }`}>
                Difficulty Tier
              </label>
              <div className="grid grid-cols-4 gap-1.5">
                {difficulties.map((d) => (
                  <button
                    key={d}
                    type="button"
                    onClick={() => setDifficulty(d)}
                    className={`py-2 text-[11px] font-bold rounded-lg transition-all cursor-pointer ${
                      difficulty === d
                        ? d === 'Easy'
                          ? 'bg-emerald-600 text-white shadow-sm shadow-emerald-600/30'
                          : d === 'Medium'
                          ? 'bg-blue-600 text-white shadow-sm shadow-blue-600/30'
                          : d === 'Hard'
                          ? 'bg-amber-600 text-white shadow-sm shadow-amber-600/30'
                          : isDark
                            ? 'bg-[#F87171] text-black font-black shadow-sm shadow-[#F87171]/30'
                            : 'bg-[#5D866C] text-white shadow-sm shadow-[#5D866C]/30'
                        : isDark
                          ? 'bg-[#1E1214] border border-[#F87171]/20 text-zinc-400 hover:text-white hover:border-[#F87171]/40'
                          : 'bg-[#E6D8C3] border border-[#C2A68C] text-[#78716C] hover:text-[#1C1917]'
                    }`}
                  >
                    {d}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Estimated Time, Due Date, Due Time, Repeat */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className={`block text-xs font-semibold mb-1.5 flex items-center gap-1 ${
                isDark ? 'text-zinc-200' : 'text-[#1C1917]'
              }`}>
                <Clock className={`w-3.5 h-3.5 ${isDark ? 'text-zinc-400' : 'text-[#78716C]'}`} />
                <span>Estimated Time</span>
              </label>
              <select
                id="quest-select-time"
                value={estimatedTime}
                onChange={(e) => setEstimatedTime(e.target.value)}
                className={`w-full py-2 px-3 rounded-xl border text-xs focus:outline-none transition-all ${
                  isDark
                    ? 'bg-[#1E1214] border-[#F87171]/30 text-white focus:border-[#F87171]'
                    : 'bg-[#F5F5F0] border-[#C2A68C] text-[#1C1917] focus:border-[#5D866C]'
                }`}
              >
                {times.map((t) => (
                  <option key={t} value={t} className={isDark ? 'bg-zinc-900 text-white' : ''}>
                    {t}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className={`block text-xs font-semibold mb-1.5 flex items-center gap-1 ${
                isDark ? 'text-zinc-200' : 'text-[#1C1917]'
              }`}>
                <Calendar className={`w-3.5 h-3.5 ${isDark ? 'text-zinc-400' : 'text-[#78716C]'}`} />
                <span>Target Due Date</span>
              </label>
              <input
                type="date"
                id="quest-input-duedate"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className={`w-full py-2 px-3 rounded-xl border text-xs focus:outline-none transition-all ${
                  isDark
                    ? 'bg-[#1E1214] border-[#F87171]/30 text-white focus:border-[#F87171]'
                    : 'bg-[#F5F5F0] border-[#C2A68C] text-[#1C1917] focus:border-[#5D866C]'
                }`}
              />
            </div>

            <div>
              <label className={`block text-xs font-semibold mb-1.5 flex items-center gap-1 ${
                isDark ? 'text-zinc-200' : 'text-[#1C1917]'
              }`}>
                <Clock className={`w-3.5 h-3.5 ${isDark ? 'text-zinc-400' : 'text-[#78716C]'}`} />
                <span>Due Time (Optional)</span>
              </label>
              <input
                type="time"
                id="quest-input-duetime"
                value={dueTime}
                onChange={(e) => setDueTime(e.target.value)}
                className={`w-full py-2 px-3 rounded-xl border text-xs focus:outline-none transition-all ${
                  isDark
                    ? 'bg-[#1E1214] border-[#F87171]/30 text-white focus:border-[#F87171]'
                    : 'bg-[#F5F5F0] border-[#C2A68C] text-[#1C1917] focus:border-[#5D866C]'
                }`}
              />
            </div>

            <div>
              <label className={`block text-xs font-semibold mb-1.5 flex items-center gap-1 ${
                isDark ? 'text-zinc-200' : 'text-[#1C1917]'
              }`}>
                <Repeat className={`w-3.5 h-3.5 ${isDark ? 'text-zinc-400' : 'text-[#78716C]'}`} />
                <span>Cadence (Repeat)</span>
              </label>
              <select
                id="quest-select-repeat"
                value={repeat}
                onChange={(e) => setRepeat(e.target.value as 'None' | 'Daily' | 'Weekly')}
                className={`w-full py-2 px-3 rounded-xl border text-xs focus:outline-none transition-all ${
                  isDark
                    ? 'bg-[#1E1214] border-[#F87171]/30 text-white focus:border-[#F87171]'
                    : 'bg-[#F5F5F0] border-[#C2A68C] text-[#1C1917] focus:border-[#5D866C]'
                }`}
              >
                <option value="None" className={isDark ? 'bg-zinc-900 text-white' : ''}>None (One-shot)</option>
                <option value="Daily" className={isDark ? 'bg-zinc-900 text-white' : ''}>Daily Habit</option>
                <option value="Weekly" className={isDark ? 'bg-zinc-900 text-white' : ''}>Weekly Milestone</option>
              </select>
            </div>
          </div>
        </div>

        {/* Dynamic Reward Preview Box */}
        <div className={`rounded-3xl p-6 border-2 shadow-sm transition-colors ${
          isDark
            ? 'bg-[#161113] border-[#F87171]/35 shadow-black'
            : 'bg-[#E6D8C3] border-[#C2A68C]'
        }`}>
          <div className="flex items-center justify-between mb-4">
            <span className={`text-xs font-bold uppercase tracking-wider font-rpg ${
              isDark ? 'text-[#F87171]' : 'text-[#5D866C]'
            }`}>
              ★ CALCULATED REWARD SPOILS
            </span>
            <span className={`text-[11px] font-mono ${isDark ? 'text-zinc-400' : 'text-[#78716C]'}`}>
              Auto-balanced by Guild Rules
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className={`p-3.5 rounded-2xl border flex items-center gap-3 shadow-sm ${
              isDark
                ? 'bg-[#141414] border-[#F87171]/25'
                : 'bg-white border-[#C2A68C]'
            }`}>
              <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 border ${
                isDark
                  ? 'bg-[#1E1214] text-[#F87171] border-[#F87171]/40'
                  : 'bg-[#E6D8C3] text-[#5D866C] border-[#C2A68C]'
              }`}>
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <div className={`text-[10px] uppercase font-bold ${isDark ? 'text-zinc-400' : 'text-[#78716C]'}`}>Experience</div>
                <div className={`text-base font-black font-mono ${isDark ? 'text-[#F87171]' : 'text-[#5D866C]'}`}>
                  +{previewRewards.xpReward} XP
                </div>
              </div>
            </div>

            <div className={`p-3.5 rounded-2xl border flex items-center gap-3 shadow-sm ${
              isDark
                ? 'bg-[#141414] border-[#F87171]/25'
                : 'bg-white border-[#C2A68C]'
            }`}>
              <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 border ${
                isDark
                  ? 'bg-[#1E1214] text-[#FBBF24] border-[#F87171]/40'
                  : 'bg-[#E6D8C3] text-[#B45309] border-[#C2A68C]'
              }`}>
                <Coins className="w-5 h-5" />
              </div>
              <div>
                <div className={`text-[10px] uppercase font-bold ${isDark ? 'text-zinc-400' : 'text-[#78716C]'}`}>Virtual Gold</div>
                <div className={`text-base font-black font-mono ${isDark ? 'text-[#FBBF24]' : 'text-[#B45309]'}`}>
                  +{previewRewards.goldReward} Gold
                </div>
              </div>
            </div>

            <div className={`p-3.5 rounded-2xl border flex items-center gap-3 shadow-sm ${
              isDark
                ? 'bg-[#141414] border-[#F87171]/25'
                : 'bg-white border-[#C2A68C]'
            }`}>
              <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 border ${
                isDark
                  ? 'bg-[#1E1214] text-purple-400 border-[#F87171]/40'
                  : 'bg-[#E6D8C3] text-purple-600 border-[#C2A68C]'
              }`}>
                <TrendingUp className="w-5 h-5" />
              </div>
              <div>
                <div className={`text-[10px] uppercase font-bold truncate ${isDark ? 'text-zinc-400' : 'text-[#78716C]'}`}>
                  {previewRewards.attribute}
                </div>
                <div className={`text-base font-black font-mono ${isDark ? 'text-purple-400' : 'text-purple-700'}`}>
                  +{previewRewards.attributeReward} Stat
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={() => navigate('/quests')}
            className={`py-3 px-6 rounded-xl border text-xs font-bold transition-colors cursor-pointer ${
              isDark
                ? 'bg-[#141414] border-[#F87171]/30 text-zinc-300 hover:text-white hover:border-[#F87171]'
                : 'bg-[#E6D8C3] border-[#C2A68C] hover:bg-[#C2A68C] text-[#78716C]'
            }`}
          >
            CANCEL
          </button>
          <button
            type="submit"
            id="btn-submit-create-quest"
            disabled={submitting}
            className={`py-3 px-8 rounded-xl font-black text-xs uppercase tracking-wider shadow-md transition-all cursor-pointer ${
              isDark
                ? 'bg-[#F87171] hover:bg-[#EF4444] text-black shadow-[#F87171]/25'
                : 'bg-[#5D866C] hover:bg-[#4B6E57] text-white shadow-[#5D866C]/30'
            }`}
          >
            {submitting ? 'INSCRIBING...' : 'CREATE QUEST'}
          </button>
        </div>
      </form>
    </div>
  );
};
