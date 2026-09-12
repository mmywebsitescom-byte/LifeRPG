import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Sword, 
  BookOpen, 
  Palette, 
  Compass, 
  Sparkles, 
  Check, 
  ArrowRight 
} from 'lucide-react';
import { motion } from 'motion/react';
import { useGame } from '../context/GameContext';
import { useTheme } from '../context/ThemeContext';
import { Character } from '../types';
import { Avatar } from '../components/common/Avatar';

interface ClassOption {
  id: Character['heroClass'];
  name: string;
  tagline: string;
  description: string;
  icon: React.ElementType;
  primaryStat: string;
  avatarUrl: string;
  startingAttributes: {
    strength: number;
    intelligence: number;
    wisdom: number;
    discipline: number;
    endurance: number;
    creativity: number;
  };
}

const HERO_CLASSES: ClassOption[] = [
  {
    id: 'Warrior',
    name: 'The Warrior',
    tagline: 'Vanguard of Physical Resilience & Grit',
    description: 'Forges mental toughness through rigorous physical training, calisthenics, and relentless work ethic.',
    icon: Sword,
    primaryStat: 'Strength & Endurance',
    avatarUrl: '',
    startingAttributes: { strength: 0, intelligence: 0, wisdom: 0, discipline: 0, endurance: 0, creativity: 0 },
  },
  {
    id: 'Scholar',
    name: 'The Scholar',
    tagline: 'Seeker of Prismatic Logic & Lore',
    description: 'Master of algorithms, systems architecture, and deep reading. Synthesizes complexity into elegant order.',
    icon: BookOpen,
    primaryStat: 'Intelligence & Wisdom',
    avatarUrl: '',
    startingAttributes: { strength: 0, intelligence: 0, wisdom: 0, discipline: 0, endurance: 0, creativity: 0 },
  },
  {
    id: 'Creator',
    name: 'The Creator',
    tagline: 'Architect of New Realities & Design',
    description: 'Breathes life into ideas through UI craftsmanship, creative composition, and lateral thinking breakthroughs.',
    icon: Palette,
    primaryStat: 'Creativity & Intelligence',
    avatarUrl: '',
    startingAttributes: { strength: 0, intelligence: 0, wisdom: 0, discipline: 0, endurance: 0, creativity: 0 },
  },
  {
    id: 'Explorer',
    name: 'The Explorer',
    tagline: 'Pioneer of Habits & Life Frontiers',
    description: 'Blazes trails across diverse interests, travel, mindfulness, and multidisciplinary personal mastery.',
    icon: Compass,
    primaryStat: 'Wisdom & Discipline',
    avatarUrl: '',
    startingAttributes: { strength: 0, intelligence: 0, wisdom: 0, discipline: 0, endurance: 0, creativity: 0 },
  },
];

export const CharacterCreationPage: React.FC = () => {
  const navigate = useNavigate();
  const { user, setupHeroClass } = useGame();
  const { isDark } = useTheme();

  const [selectedClass, setSelectedClass] = useState<ClassOption>(HERO_CLASSES[1]); // Default Scholar
  const [heroName, setHeroName] = useState(user?.name || 'Hero');
  const [loading, setLoading] = useState(false);

  const handleBeginJourney = async () => {
    setLoading(true);
    try {
      await setupHeroClass(selectedClass.id, heroName, selectedClass.avatarUrl);
      navigate('/dashboard');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`min-h-screen flex flex-col p-4 sm:p-8 max-w-6xl mx-auto w-full transition-colors duration-300 ${
      isDark 
        ? 'bg-[#0A0A0A] text-[#FAFAFA] selection:bg-[#F87171] selection:text-black' 
        : 'bg-[#F5F5F0] text-[#1C1917] selection:bg-[#C2A68C] selection:text-[#5D866C]'
    }`}>
      {/* Header */}
      <div className="text-center my-6">
        <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold mb-2 border ${
          isDark 
            ? 'bg-[#1E1214] border-[#F87171]/40 text-[#F87171]' 
            : 'bg-[#E6D8C3] border-[#C2A68C] text-[#5D866C]'
        }`}>
          <Sparkles className="w-3.5 h-3.5" />
          <span>PROLOGUE: SANCTUARY OF ORIGIN</span>
        </div>
        <h1 className={`text-3xl sm:text-5xl font-extrabold font-rpg tracking-wide ${
          isDark ? 'text-white' : 'text-[#1C1917]'
        }`}>
          CHOOSE YOUR HERO
        </h1>
        <p className={`text-xs sm:text-sm max-w-xl mx-auto mt-2 ${
          isDark ? 'text-zinc-400' : 'text-[#78716C]'
        }`}>
          Select your starting archetype to align your journey with your real-world lifestyle goals.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 my-auto">
        {/* Left: 4 Class Selection Cards */}
        <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4">
          {HERO_CLASSES.map((cls) => {
            const Icon = cls.icon;
            const isSelected = selectedClass.id === cls.id;
            return (
              <motion.div
                key={cls.id}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setSelectedClass(cls)}
                className={`p-5 rounded-3xl cursor-pointer border-2 transition-all relative overflow-hidden flex flex-col justify-between ${
                  isSelected
                    ? isDark
                      ? 'border-[#F87171] bg-[#1E1214] shadow-lg shadow-[#F87171]/20'
                      : 'border-[#5D866C] bg-[#E6D8C3] shadow-lg shadow-[#5D866C]/10'
                    : isDark
                      ? 'border-[#F87171]/20 bg-[#141414] hover:border-[#F87171]/50'
                      : 'border-[#C2A68C] bg-white hover:border-[#5D866C]/40'
                }`}
              >
                {isSelected && (
                  <div className={`absolute top-3 right-3 w-6 h-6 rounded-full flex items-center justify-center font-bold ${
                    isDark ? 'bg-[#F87171] text-black' : 'bg-[#5D866C] text-white'
                  }`}>
                    <Check className="w-3.5 h-3.5 stroke-[3]" />
                  </div>
                )}

                <div>
                  <div className={`w-10 h-10 rounded-2xl border flex items-center justify-center mb-3 ${
                    isDark
                      ? 'bg-[#1E1214] border-[#F87171]/40 text-[#F87171]'
                      : 'bg-white border-[#C2A68C] text-[#5D866C]'
                  }`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className={`text-base font-bold font-rpg mb-0.5 ${
                    isDark ? 'text-white' : 'text-[#1C1917]'
                  }`}>
                    {cls.name}
                  </h3>
                  <div className={`text-[11px] font-semibold mb-2 ${
                    isDark ? 'text-[#F87171]' : 'text-[#5D866C]'
                  }`}>
                    {cls.primaryStat}
                  </div>
                  <p className={`text-xs leading-relaxed line-clamp-3 ${
                    isDark ? 'text-zinc-400' : 'text-[#78716C]'
                  }`}>
                    {cls.description}
                  </p>
                </div>

                <div className={`mt-4 pt-3 border-t flex items-center justify-between text-[11px] font-mono ${
                  isDark ? 'border-[#F87171]/20 text-zinc-400' : 'border-[#C2A68C] text-[#78716C]'
                }`}>
                  <span>Base Focus</span>
                  <span className={`font-bold ${isDark ? 'text-white' : 'text-[#1C1917]'}`}>
                    {cls.tagline.split('&')[0]}
                  </span>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Right: Live Character Preview Sheet */}
        <div className="lg:col-span-5">
          <motion.div
            key={selectedClass.id}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
            className={`rounded-3xl p-6 sm:p-7 border-2 shadow-xl flex flex-col ${
              isDark 
                ? 'bg-[#141414] border-[#F87171]/30 shadow-black' 
                : 'bg-white border-[#C2A68C]'
            }`}
          >
            <div className={`flex items-center justify-between text-xs font-bold uppercase tracking-wider mb-4 ${
              isDark ? 'text-zinc-400' : 'text-[#78716C]'
            }`}>
              <span>Live Avatar Preview</span>
              <span className={`font-mono ${isDark ? 'text-[#FBBF24]' : 'text-[#B45309]'}`}>LEVEL 1 INITIATE</span>
            </div>

            {/* Avatar Preview */}
            <div className="flex flex-col items-center mb-5">
              <Avatar
                src=""
                name={heroName}
                heroClass={selectedClass.id}
                size="2xl"
              />
              <span className={`text-[11px] mt-2 font-medium ${isDark ? 'text-zinc-500' : 'text-[#78716C]'}`}>
                Blank Portrait (Custom upload available after creation)
              </span>
            </div>

            {/* Name Input */}
            <div className="mb-5">
              <label className={`block text-xs font-semibold mb-1 text-center ${
                isDark ? 'text-zinc-300' : 'text-[#1C1917]'
              }`}>
                Adventurer Moniker
              </label>
              <input
                type="text"
                id="char-create-name-input"
                value={heroName}
                onChange={(e) => setHeroName(e.target.value)}
                className={`w-full text-center py-2 px-3 rounded-xl border font-rpg font-bold text-sm focus:outline-none transition-all ${
                  isDark
                    ? 'bg-[#1E1214] border-[#F87171]/30 text-white focus:border-[#F87171]'
                    : 'bg-[#F5F5F0] border-[#C2A68C] text-[#1C1917] focus:border-[#5D866C]'
                }`}
              />
            </div>

            {/* Starting Attribute Breakdown */}
            <div className="space-y-2 mb-6">
              <div className={`text-[11px] font-bold uppercase tracking-wider mb-1 ${
                isDark ? 'text-zinc-400' : 'text-[#78716C]'
              }`}>
                Starting Baseline Radar
              </div>
              {Object.entries(selectedClass.startingAttributes).map(([stat, val]) => (
                <div key={stat} className="flex items-center justify-between text-xs">
                  <span className={`capitalize ${isDark ? 'text-zinc-400' : 'text-[#78716C]'}`}>{stat}</span>
                  <div className="flex items-center gap-2">
                    <div className={`w-24 sm:w-32 h-2 rounded-full overflow-hidden border ${
                      isDark ? 'bg-zinc-800 border-zinc-700' : 'bg-[#E6D8C3] border-[#C2A68C]'
                    }`}>
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${
                          isDark ? 'bg-[#F87171]' : 'bg-[#5D866C]'
                        }`}
                        style={{ width: `${Math.max(4, (Number(val) / 100) * 100)}%` }}
                      />
                    </div>
                    <span className={`font-mono font-bold w-6 text-right ${
                      isDark ? 'text-white' : 'text-[#1C1917]'
                    }`}>
                      {val}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Begin Journey CTA */}
            <button
              type="button"
              id="btn-begin-journey"
              onClick={handleBeginJourney}
              disabled={loading}
              className={`w-full py-3.5 px-6 rounded-2xl font-black text-xs uppercase tracking-wider shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer ${
                isDark
                  ? 'bg-[#F87171] hover:bg-[#EF4444] text-black shadow-[#F87171]/25'
                  : 'bg-[#5D866C] hover:bg-[#4B6E57] text-white shadow-[#5D866C]/30'
              }`}
            >
              {loading ? (
                <>
                  <Sparkles className="w-4 h-4 animate-spin" />
                  Binding Archetype...
                </>
              ) : (
                <>
                  <span>BEGIN JOURNEY</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </motion.div>
        </div>
      </div>
    </div>
  );
};
