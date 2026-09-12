import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Sparkles, 
  Compass, 
  PlusCircle, 
  Check, 
  Wand2, 
  ArrowRight, 
  Zap, 
  Shield, 
  Coins, 
  Clock, 
  Flame, 
  Lightbulb,
  CheckCircle2
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useGame } from '../context/GameContext';
import { useTheme } from '../context/ThemeContext';
import { recommendedQuests } from '../api/mockData';
import { QuestCategory, QuestDifficulty, AttributeType } from '../types';

interface GeneratedQuest {
  title: string;
  description: string;
  category: QuestCategory;
  difficulty: QuestDifficulty;
  estimatedTime: string;
  xpReward: number;
  goldReward: number;
  attribute: AttributeType;
  attributeReward: number;
}

const quickPromptSuggestions = [
  'Prepare for full-stack system architecture interview',
  '30-minute high-intensity cardio & core workout',
  'Deep study block on Distributed Databases & ACID',
  'Declutter digital workspace and inbox zero',
  'Practice algorithm patterns: Dynamic Programming',
  'Read 25 pages of high-signal non-fiction',
];

export const DiscoverPage: React.FC = () => {
  const navigate = useNavigate();
  const { addQuestFromDiscovery, addToast } = useGame();
  const { isDark } = useTheme();

  const [prompt, setPrompt] = useState('');
  const [category, setCategory] = useState<QuestCategory>('Knowledge');
  const [difficulty, setDifficulty] = useState<QuestDifficulty>('Medium');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedQuests, setGeneratedQuests] = useState<GeneratedQuest[]>([]);
  const [addedIds, setAddedIds] = useState<Set<string>>(new Set());

  const handleGenerate = async (queryText?: string) => {
    const textToUse = queryText !== undefined ? queryText : prompt;
    if (!textToUse.trim()) {
      addToast({
        type: 'info',
        title: 'Provide a Goal',
        message: 'Type an objective or select an idea below to forge quests.',
      });
      return;
    }

    setIsGenerating(true);
    try {
      // Call our backend AI endpoint
      const res = await fetch('/api/ai/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: textToUse,
          category,
          difficulty,
        }),
      });

      if (res.ok) {
        const json = await res.json();
        if (json.success && Array.isArray(json.data) && json.data.length > 0) {
          setGeneratedQuests(json.data);
          addToast({
            type: 'success',
            title: '✨ Quests Forged!',
            message: `The Oracle synthesized ${json.data.length} tailored quests for your goal.`,
          });
          return;
        }
      }

      // Fallback local generation if server offline
      const fallbackQuests: GeneratedQuest[] = [
        {
          title: `Mastery Sprint: ${textToUse.slice(0, 32)}`,
          description: `Commit to an undistracted block focusing on: "${textToUse}". Eliminate distractions and document key insights.`,
          category,
          difficulty,
          estimatedTime: '45m',
          xpReward: difficulty === 'Easy' ? 35 : difficulty === 'Medium' ? 55 : 85,
          goldReward: difficulty === 'Easy' ? 15 : difficulty === 'Medium' ? 25 : 40,
          attribute: category === 'Fitness' ? 'strength' : category === 'Health' ? 'endurance' : category === 'Creativity' ? 'creativity' : 'intelligence',
          attributeReward: difficulty === 'Easy' ? 3 : difficulty === 'Medium' ? 6 : 9,
        },
        {
          title: `Deep Deliberate Practice: ${category}`,
          description: `Isolate the most challenging component of your task and practice focused repetition for 30 minutes.`,
          category,
          difficulty: 'Medium',
          estimatedTime: '30m',
          xpReward: 50,
          goldReward: 20,
          attribute: 'discipline',
          attributeReward: 5,
        },
        {
          title: `Synthesis & Knowledge Capture`,
          description: `Summarize core findings into your second brain note system or commit your code repository changes.`,
          category: 'Knowledge',
          difficulty: 'Easy',
          estimatedTime: '15m',
          xpReward: 25,
          goldReward: 10,
          attribute: 'wisdom',
          attributeReward: 3,
        },
      ];
      setGeneratedQuests(fallbackQuests);
      addToast({
        type: 'success',
        title: '✨ Quests Generated!',
        message: 'Procedural Oracle synthesized quests for your adventure.',
      });
    } catch (err) {
      console.error('Failed to generate quests:', err);
      addToast({
        type: 'error',
        title: 'Oracle Busy',
        message: 'Could not connect to AI engine. Please try again.',
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleAddQuest = async (q: GeneratedQuest, indexKey: string) => {
    try {
      await addQuestFromDiscovery(q);
      setAddedIds((prev) => new Set(prev).add(indexKey));
      addToast({
        type: 'success',
        title: 'Quest Accepted!',
        message: `"${q.title}" added to your active quest log.`,
      });
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="space-y-8 animate-fadeIn" id="discover-page-container">
      {/* Header */}
      <div className={`flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b ${
        isDark ? 'border-[#F87171]/20' : 'border-[#C2A68C]'
      }`}>
        <div>
          <div className={`inline-flex items-center gap-1.5 text-xs uppercase tracking-wider font-bold mb-1 ${
            isDark ? 'text-[#F87171]' : 'text-[#5D866C]'
          }`}>
            <Compass className="w-4 h-4" />
            <span>ORACLE SANCTUM</span>
          </div>
          <h1 className={`text-2xl md:text-3xl font-black font-rpg tracking-wide ${
            isDark ? 'text-white' : 'text-[#1C1917]'
          }`}>
            AI Quest Forge & Discovery
          </h1>
          <p className={`text-xs md:text-sm mt-1 ${isDark ? 'text-zinc-400' : 'text-[#78716C]'}`}>
            Harness Gemini AI to transform your real-life ambitions, study curricula, or fitness milestones into gamified quests.
          </p>
        </div>

        <button
          type="button"
          onClick={() => navigate('/quests')}
          className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all border shrink-0 cursor-pointer ${
            isDark
              ? 'border-[#F87171]/40 text-[#F87171] bg-[#1E1214] hover:bg-[#F87171]/20'
              : 'border-[#5D866C]/40 text-[#5D866C] bg-white hover:bg-[#5D866C]/10'
          }`}
        >
          <span>View My Quests</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* AI Forge Command Deck */}
      <div className={`p-6 rounded-3xl border shadow-lg relative overflow-hidden ${
        isDark
          ? 'bg-gradient-to-br from-[#141414] to-[#1E1214] border-[#F87171]/30 shadow-[#F87171]/5'
          : 'bg-gradient-to-br from-white to-[#F9F7F4] border-[#C2A68C] shadow-stone-200/50'
      }`}>
        <div className="flex items-center gap-2 mb-3">
          <Wand2 className={`w-5 h-5 ${isDark ? 'text-[#F87171]' : 'text-[#5D866C]'}`} />
          <h2 className={`text-lg font-black font-rpg tracking-wide ${isDark ? 'text-white' : 'text-[#1C1917]'}`}>
            Synthesize Real-Life Goals
          </h2>
        </div>

        <div className="space-y-4">
          <div className="relative">
            <textarea
              rows={3}
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="What do you want to accomplish today? (e.g. Master React performance tuning, finish 10k steps and stretching, write thesis chapter 3...)"
              className={`w-full p-4 rounded-2xl text-xs sm:text-sm font-medium border focus:outline-none transition-all resize-none ${
                isDark
                  ? 'bg-black/60 border-[#F87171]/30 text-white placeholder-zinc-500 focus:border-[#F87171]'
                  : 'bg-white border-[#C2A68C] text-[#1C1917] placeholder-[#78716C] focus:border-[#5D866C]'
              }`}
            />
          </div>

          {/* Quick suggestions */}
          <div>
            <div className="flex items-center gap-1.5 mb-2">
              <Lightbulb className={`w-3.5 h-3.5 ${isDark ? 'text-amber-400' : 'text-amber-600'}`} />
              <span className={`text-[11px] font-bold uppercase tracking-wider ${isDark ? 'text-zinc-400' : 'text-[#78716C]'}`}>
                Suggested Ideas:
              </span>
            </div>
            <div className="flex flex-wrap gap-2">
              {quickPromptSuggestions.map((item, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => {
                    setPrompt(item);
                    handleGenerate(item);
                  }}
                  className={`text-[11px] font-medium px-3 py-1.5 rounded-xl border transition-all cursor-pointer ${
                    isDark
                      ? 'bg-white/5 border-[#F87171]/20 text-zinc-300 hover:border-[#F87171] hover:text-white'
                      : 'bg-[#E6D8C3]/40 border-[#C2A68C] text-[#57534E] hover:border-[#5D866C] hover:text-[#1C1917]'
                  }`}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>

          {/* Configuration controls & Action */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
            <div className="flex items-center gap-3">
              <div>
                <label className={`block text-[10px] font-bold uppercase tracking-wider mb-1 ${
                  isDark ? 'text-zinc-400' : 'text-[#78716C]'
                }`}>
                  Category
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as QuestCategory)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold border focus:outline-none cursor-pointer ${
                    isDark
                      ? 'bg-[#1E1214] border-[#F87171]/40 text-white'
                      : 'bg-white border-[#C2A68C] text-[#1C1917]'
                  }`}
                >
                  {['Knowledge', 'Coding', 'Fitness', 'Health', 'Creativity', 'Discipline', 'Personal'].map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className={`block text-[10px] font-bold uppercase tracking-wider mb-1 ${
                  isDark ? 'text-zinc-400' : 'text-[#78716C]'
                }`}>
                  Difficulty
                </label>
                <select
                  value={difficulty}
                  onChange={(e) => setDifficulty(e.target.value as QuestDifficulty)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold border focus:outline-none cursor-pointer ${
                    isDark
                      ? 'bg-[#1E1214] border-[#F87171]/40 text-white'
                      : 'bg-white border-[#C2A68C] text-[#1C1917]'
                  }`}
                >
                  {['Easy', 'Medium', 'Hard', 'Epic'].map((d) => (
                    <option key={d} value={d}>{d}</option>
                  ))}
                </select>
              </div>
            </div>

            <button
              type="button"
              disabled={isGenerating}
              onClick={() => handleGenerate()}
              className={`inline-flex items-center gap-2 px-6 py-3 rounded-2xl text-xs font-black uppercase tracking-wider transition-all shadow-md cursor-pointer ${
                isGenerating
                  ? 'opacity-60 cursor-not-allowed'
                  : isDark
                    ? 'bg-[#F87171] hover:bg-[#EF4444] text-black shadow-[#F87171]/25 hover:scale-105'
                    : 'bg-[#5D866C] hover:bg-[#4C715A] text-white shadow-[#5D866C]/25 hover:scale-105'
              }`}
            >
              <Sparkles className={`w-4 h-4 ${isGenerating ? 'animate-spin' : ''}`} />
              <span>{isGenerating ? 'Consulting Oracle...' : 'Forge Quests with AI'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Generated Results Section */}
      {generatedQuests.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Zap className={`w-4 h-4 ${isDark ? 'text-[#F87171]' : 'text-[#5D866C]'}`} />
              <h3 className={`text-base font-black font-rpg tracking-wide ${isDark ? 'text-white' : 'text-[#1C1917]'}`}>
                Synthesized Quest Manifest
              </h3>
            </div>
            <span className={`text-xs font-mono font-bold ${isDark ? 'text-zinc-400' : 'text-[#78716C]'}`}>
              {generatedQuests.length} Quests Ready
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {generatedQuests.map((quest, idx) => {
              const key = `gen_${idx}_${quest.title}`;
              const isAdded = addedIds.has(key);

              return (
                <div
                  key={key}
                  className={`p-5 rounded-2xl border flex flex-col justify-between transition-all ${
                    isDark
                      ? 'bg-[#141414] border-[#F87171]/20 hover:border-[#F87171]/50'
                      : 'bg-white border-[#C2A68C] hover:border-[#5D866C]/50 shadow-sm'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md border ${
                        isDark ? 'border-[#F87171]/40 text-[#F87171]' : 'border-[#5D866C]/40 text-[#5D866C]'
                      }`}>
                        {quest.category}
                      </span>
                      <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-md font-mono ${
                        quest.difficulty === 'Epic' ? 'bg-purple-100 text-purple-800' :
                        quest.difficulty === 'Hard' ? 'bg-amber-100 text-amber-800' :
                        quest.difficulty === 'Medium' ? 'bg-blue-100 text-blue-800' :
                        'bg-emerald-100 text-emerald-800'
                      }`}>
                        {quest.difficulty}
                      </span>
                    </div>

                    <h4 className={`text-sm font-bold mb-1.5 ${isDark ? 'text-white' : 'text-[#1C1917]'}`}>
                      {quest.title}
                    </h4>
                    <p className={`text-xs leading-relaxed mb-4 ${isDark ? 'text-zinc-400' : 'text-[#78716C]'}`}>
                      {quest.description}
                    </p>
                  </div>

                  <div>
                    {/* Rewards Info */}
                    <div className={`grid grid-cols-3 gap-2 p-2.5 rounded-xl text-center mb-3.5 ${
                      isDark ? 'bg-black/40' : 'bg-[#E6D8C3]/30'
                    }`}>
                      <div>
                        <span className={`block text-[9px] uppercase font-bold ${isDark ? 'text-zinc-400' : 'text-[#78716C]'}`}>XP</span>
                        <span className="text-xs font-mono font-bold text-amber-500">+{quest.xpReward}</span>
                      </div>
                      <div>
                        <span className={`block text-[9px] uppercase font-bold ${isDark ? 'text-zinc-400' : 'text-[#78716C]'}`}>Gold</span>
                        <span className="text-xs font-mono font-bold text-yellow-500">+{quest.goldReward}</span>
                      </div>
                      <div>
                        <span className={`block text-[9px] uppercase font-bold truncate ${isDark ? 'text-zinc-400' : 'text-[#78716C]'}`}>{quest.attribute}</span>
                        <span className={`text-xs font-mono font-bold ${isDark ? 'text-[#F87171]' : 'text-[#5D866C]'}`}>+{quest.attributeReward}</span>
                      </div>
                    </div>

                    <button
                      type="button"
                      disabled={isAdded}
                      onClick={() => handleAddQuest(quest, key)}
                      className={`w-full py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                        isAdded
                          ? 'bg-emerald-500/20 text-emerald-500 border border-emerald-500/30 cursor-default'
                          : isDark
                            ? 'bg-[#F87171] hover:bg-[#EF4444] text-black font-black'
                            : 'bg-[#5D866C] hover:bg-[#4C715A] text-white'
                      }`}
                    >
                      {isAdded ? (
                        <>
                          <Check className="w-3.5 h-3.5" />
                          <span>Accepted into Log</span>
                        </>
                      ) : (
                        <>
                          <PlusCircle className="w-3.5 h-3.5" />
                          <span>Accept Quest</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Curated Recommendations Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className={`text-base font-black font-rpg tracking-wide ${isDark ? 'text-white' : 'text-[#1C1917]'}`}>
              Curated Daily Hero Bounties
            </h3>
            <p className={`text-xs ${isDark ? 'text-zinc-400' : 'text-[#78716C]'}`}>
              Hand-picked high-leverage habits proven to boost discipline, stamina, and intellectual clarity.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {recommendedQuests.map((item, idx) => {
            const key = `rec_${idx}_${item.title}`;
            const isAdded = addedIds.has(key);

            return (
              <div
                key={key}
                className={`p-5 rounded-2xl border flex flex-col justify-between transition-all ${
                  isDark
                    ? 'bg-[#141414] border-[#F87171]/20 hover:border-[#F87171]/40'
                    : 'bg-white border-[#C2A68C] hover:border-[#5D866C]/40 shadow-sm'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md border ${
                      isDark ? 'border-[#F87171]/40 text-[#F87171]' : 'border-[#5D866C]/40 text-[#5D866C]'
                    }`}>
                      {item.category}
                    </span>
                    <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-md bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 font-mono">
                      {item.difficulty}
                    </span>
                  </div>

                  <h4 className={`text-sm font-bold mb-1.5 ${isDark ? 'text-white' : 'text-[#1C1917]'}`}>
                    {item.title}
                  </h4>
                  <p className={`text-xs leading-relaxed mb-4 ${isDark ? 'text-zinc-400' : 'text-[#78716C]'}`}>
                    {item.description}
                  </p>
                </div>

                <div>
                  <div className={`grid grid-cols-3 gap-2 p-2.5 rounded-xl text-center mb-3.5 ${
                    isDark ? 'bg-black/40' : 'bg-[#E6D8C3]/30'
                  }`}>
                    <div>
                      <span className={`block text-[9px] uppercase font-bold ${isDark ? 'text-zinc-400' : 'text-[#78716C]'}`}>XP</span>
                      <span className="text-xs font-mono font-bold text-amber-500">+{item.xpReward}</span>
                    </div>
                    <div>
                      <span className={`block text-[9px] uppercase font-bold ${isDark ? 'text-zinc-400' : 'text-[#78716C]'}`}>Gold</span>
                      <span className="text-xs font-mono font-bold text-yellow-500">+{item.goldReward}</span>
                    </div>
                    <div>
                      <span className={`block text-[9px] uppercase font-bold truncate ${isDark ? 'text-zinc-400' : 'text-[#78716C]'}`}>{item.attribute}</span>
                      <span className={`text-xs font-mono font-bold ${isDark ? 'text-[#F87171]' : 'text-[#5D866C]'}`}>+{item.attributeReward}</span>
                    </div>
                  </div>

                  <button
                    type="button"
                    disabled={isAdded}
                    onClick={() => handleAddQuest(item as GeneratedQuest, key)}
                    className={`w-full py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                      isAdded
                        ? 'bg-emerald-500/20 text-emerald-500 border border-emerald-500/30 cursor-default'
                        : isDark
                          ? 'border border-[#F87171]/40 text-[#F87171] hover:bg-[#F87171]/10'
                          : 'border border-[#5D866C]/40 text-[#5D866C] hover:bg-[#5D866C]/10'
                    }`}
                  >
                    {isAdded ? (
                      <>
                        <Check className="w-3.5 h-3.5" />
                        <span>In Quest Log</span>
                      </>
                    ) : (
                      <>
                        <PlusCircle className="w-3.5 h-3.5" />
                        <span>Accept Bounty</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
