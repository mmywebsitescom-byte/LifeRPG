import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  User, 
  Shield, 
  Sword, 
  Sparkles, 
  Award, 
  Flame, 
  TrendingUp,
  Brain,
  Dumbbell,
  Compass,
  Footprints,
  CircleDot,
  Cat,
  Camera,
  Edit3,
  Upload,
  Link as LinkIcon,
  Trash2,
  X,
  Check,
  Palette,
  BookOpen
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useGame } from '../context/GameContext';
import { useTheme } from '../context/ThemeContext';
import { LevelBadge } from '../components/common/LevelBadge';
import { Avatar } from '../components/common/Avatar';
import { XPBar } from '../components/common/XPBar';
import { GoldBalance } from '../components/common/GoldBalance';
import { CharacterSkeleton } from '../components/common/LoadingSkeleton';
import { getXpDetails } from '../utils/rpgEngine';
import { Character } from '../types';

interface AttributeMeta {
  key: 'strength' | 'intelligence' | 'wisdom' | 'discipline' | 'endurance' | 'creativity';
  name: string;
  icon: React.ElementType;
  color: string;
  barColor: string;
  darkBarColor: string;
  habits: string;
}

const ATTRIBUTE_METAS: AttributeMeta[] = [
  {
    key: 'strength',
    name: 'Strength',
    icon: Dumbbell,
    color: 'text-rose-500',
    barColor: 'bg-[#5D866C]',
    darkBarColor: 'bg-rose-500',
    habits: 'Gym workouts, weightlifting, resistance training, pushups',
  },
  {
    key: 'intelligence',
    name: 'Intelligence',
    icon: Brain,
    color: 'text-blue-500',
    barColor: 'bg-blue-600',
    darkBarColor: 'bg-blue-500',
    habits: 'Coding algorithms, system design, technical study, problem solving',
  },
  {
    key: 'wisdom',
    name: 'Wisdom',
    icon: Sparkles,
    color: 'text-purple-500',
    barColor: 'bg-purple-600',
    darkBarColor: 'bg-purple-500',
    habits: 'Deep reading, philosophy, journaling, mentorship reflection',
  },
  {
    key: 'discipline',
    name: 'Discipline',
    icon: Shield,
    color: 'text-amber-500',
    barColor: 'bg-[#D97706]',
    darkBarColor: 'bg-amber-500',
    habits: 'Waking up on time, daily habits, consistent study streaks, focus',
  },
  {
    key: 'endurance',
    name: 'Endurance',
    icon: Flame,
    color: 'text-emerald-500',
    barColor: 'bg-emerald-600',
    darkBarColor: 'bg-emerald-500',
    habits: 'Running, cycling, swimming, marathon deep work sessions',
  },
  {
    key: 'creativity',
    name: 'Creativity',
    icon: Compass,
    color: 'text-pink-500',
    barColor: 'bg-pink-600',
    darkBarColor: 'bg-pink-500',
    habits: 'UI/UX design, writing articles, creative thinking, art composition',
  },
];

const AVAILABLE_CLASSES: { id: Character['heroClass']; name: string; icon: React.ElementType }[] = [
  { id: 'Scholar', name: 'Scholar', icon: BookOpen },
  { id: 'Warrior', name: 'Warrior', icon: Sword },
  { id: 'Creator', name: 'Creator', icon: Palette },
  { id: 'Explorer', name: 'Explorer', icon: Compass },
];

export const CharacterPage: React.FC = () => {
  const navigate = useNavigate();
  const { character, loading, updateProfile, addToast } = useGame();
  const { isDark } = useTheme();

  // Edit Profile Modal State
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editName, setEditName] = useState('');
  const [editTitle, setEditTitle] = useState('');
  const [editHeroClass, setEditHeroClass] = useState<Character['heroClass']>('Scholar');
  const [editAvatar, setEditAvatar] = useState('');
  const [showUrlInput, setShowUrlInput] = useState(false);
  const [urlInput, setUrlInput] = useState('');
  const [saving, setSaving] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  if (loading || !character) {
    return <CharacterSkeleton />;
  }

  const xpInfo = getXpDetails(character.xp);

  const equipmentSlots = [
    { slot: 'Weapon', item: character.equipment?.weapon || 'Unarmed', icon: Sword, color: 'text-rose-500' },
    { slot: 'Armor', item: character.equipment?.armor || 'Initiate Tunic', icon: Shield, color: 'text-blue-500' },
    { slot: 'Boots', item: character.equipment?.boots || 'Trail Boots', icon: Footprints, color: 'text-amber-500' },
    { slot: 'Ring', item: character.equipment?.ring || 'Ring of Focus (+5% XP)', icon: CircleDot, color: 'text-purple-500' },
    { slot: 'Pet', item: character.equipment?.pet || 'Parchment Hound', icon: Cat, color: 'text-emerald-500' },
  ];

  const handleOpenEditModal = () => {
    setEditName(character.name || '');
    setEditTitle(character.title || '');
    setEditHeroClass(character.heroClass || 'Scholar');
    setEditAvatar(character.avatarUrl || '');
    setShowUrlInput(false);
    setUrlInput('');
    setIsEditModalOpen(true);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      addToast({ type: 'error', title: 'Invalid File', message: 'Please select an image file (PNG, JPG, WebP).' });
      return;
    }
    if (file.size > 3 * 1024 * 1024) {
      addToast({ type: 'error', title: 'File Too Large', message: 'Image must be under 3MB.' });
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      if (dataUrl) {
        setEditAvatar(dataUrl);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleApplyUrl = () => {
    if (!urlInput.trim()) return;
    setEditAvatar(urlInput.trim());
    setShowUrlInput(false);
    setUrlInput('');
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editName.trim()) {
      addToast({ type: 'error', title: 'Name Required', message: 'Hero moniker cannot be empty.' });
      return;
    }

    setSaving(true);
    try {
      await updateProfile({
        name: editName.trim(),
        title: editTitle.trim() || 'Hero of the Realm',
        heroClass: editHeroClass,
        avatarUrl: editAvatar,
      });
      setIsEditModalOpen(false);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-8 animate-fadeIn" id="character-main-view">
      {/* Header */}
      <div className={`flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b ${
        isDark ? 'border-[#F87171]/20' : 'border-[#C2A68C]'
      }`}>
        <div>
          <div className={`inline-flex items-center gap-1.5 text-xs uppercase tracking-wider font-bold mb-1 ${
            isDark ? 'text-[#F87171]' : 'text-[#5D866C]'
          }`}>
            <User className="w-3.5 h-3.5" />
            <span>HERO ROSTER</span>
          </div>
          <h2 className={`text-2xl sm:text-3xl font-black font-rpg tracking-wide ${
            isDark ? 'text-white' : 'text-[#1C1917]'
          }`}>
            CHARACTER SHEET
          </h2>
          <p className={`text-xs mt-0.5 ${isDark ? 'text-zinc-400' : 'text-[#78716C]'}`}>
            Holistic breakdown of your physical, mental, and creative RPG attributes.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Edit Profile Button */}
          <button
            type="button"
            id="btn-char-sheet-edit-profile"
            onClick={handleOpenEditModal}
            className={`px-4 py-2.5 rounded-xl border text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition-all cursor-pointer shadow-sm ${
              isDark
                ? 'bg-[#F87171] hover:bg-[#EF4444] text-black border-transparent font-black shadow-[#F87171]/20'
                : 'bg-[#5D866C] hover:bg-[#4B6E57] text-white border-transparent shadow-[#5D866C]/25'
            }`}
          >
            <Edit3 className="w-4 h-4" />
            <span>EDIT PROFILE</span>
          </button>

          <button
            type="button"
            id="btn-char-sheet-achievements"
            onClick={() => navigate('/achievements')}
            className={`px-4 py-2.5 rounded-xl border text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition-all cursor-pointer shadow-sm ${
              isDark
                ? 'bg-[#1E1214] border-[#F87171]/30 text-zinc-200 hover:border-[#F87171] hover:text-white'
                : 'bg-[#E6D8C3] border-[#C2A68C] text-[#1C1917] hover:border-[#5D866C]'
            }`}
          >
            <Award className={`w-4 h-4 ${isDark ? 'text-[#F87171]' : 'text-[#5D866C]'}`} />
            <span>VIEW ACHIEVEMENTS</span>
          </button>
        </div>
      </div>

      {/* Hero Overview Box */}
      <div className={`rounded-3xl p-6 sm:p-8 border-2 shadow-sm flex flex-col md:flex-row items-center gap-6 sm:gap-8 transition-colors ${
        isDark
          ? 'bg-[#141414] border-[#F87171]/30 shadow-black'
          : 'bg-[#E6D8C3] border-[#C2A68C]'
      }`}>
        {/* Large Avatar with Click-to-Edit Photo Overlay */}
        <div 
          onClick={handleOpenEditModal}
          className="relative group cursor-pointer shrink-0"
          title="Click to change profile portrait"
        >
          <Avatar
            src={character.avatarUrl}
            name={character.name}
            level={character.level}
            heroClass={character.heroClass}
            size="2xl"
          />
          {/* Hover overlay with Camera icon */}
          <div className="absolute inset-0 rounded-2xl sm:rounded-3xl bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-white gap-1 backdrop-blur-xs">
            <Camera className="w-6 h-6 text-white" />
            <span className="text-[10px] font-bold uppercase tracking-wider">Change</span>
          </div>
        </div>

        {/* Bio Details */}
        <div className="flex-1 w-full text-center md:text-left">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
            <div>
              <div className="flex items-center justify-center md:justify-start gap-2.5">
                <h3 className={`text-2xl font-black font-rpg ${
                  isDark ? 'text-white' : 'text-[#1C1917]'
                }`}>
                  {character.name}
                </h3>
                <span className={`text-xs font-mono font-bold px-2.5 py-0.5 rounded-full border ${
                  isDark
                    ? 'bg-[#1E1214] border-[#F87171]/40 text-[#F87171]'
                    : 'bg-white border-[#C2A68C] text-[#5D866C]'
                }`}>
                  {character.heroClass}
                </span>
                <button
                  type="button"
                  onClick={handleOpenEditModal}
                  className={`p-1.5 rounded-lg border transition-all ${
                    isDark ? 'border-zinc-700 text-zinc-400 hover:text-white hover:border-[#F87171]' : 'border-[#C2A68C] text-[#78716C] hover:text-[#1C1917]'
                  }`}
                  title="Edit name, class or title"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                </button>
              </div>
              <p className={`text-xs font-medium mt-0.5 ${isDark ? 'text-zinc-400' : 'text-[#78716C]'}`}>
                {character.title}
              </p>
            </div>

            <div className="flex items-center justify-center md:justify-end gap-2">
              <GoldBalance amount={character.gold} size="md" />
            </div>
          </div>

          <div className="mt-4 max-w-xl">
            <XPBar
              currentXp={xpInfo.currentLevelXp}
              requiredXp={xpInfo.requiredLevelXp}
              level={character.level}
              percentage={xpInfo.progressPercentage}
              size="md"
            />
          </div>
        </div>
      </div>

      {/* 2-Column: Attributes Breakdown + Equipment Slots */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left: Detailed Attributes Breakdown (8 Columns) */}
        <div className="lg:col-span-8 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className={`text-lg font-bold font-rpg flex items-center gap-2 ${
              isDark ? 'text-white' : 'text-[#1C1917]'
            }`}>
              <TrendingUp className={`w-5 h-5 ${isDark ? 'text-[#F87171]' : 'text-[#5D866C]'}`} />
              <span>Attributes & Real-World Habits</span>
            </h3>
            <span className={`text-xs font-mono ${isDark ? 'text-zinc-500' : 'text-[#78716C]'}`}>
              Cap: 100
            </span>
          </div>

          <div className="space-y-3">
            {ATTRIBUTE_METAS.map((stat) => {
              const Icon = stat.icon;
              const val = character.attributes?.[stat.key] ?? 0;
              const recent = character.recentGains?.[stat.key] ?? 0;

              return (
                <div
                  key={stat.key}
                  className={`p-4 rounded-2xl border shadow-sm transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                    isDark
                      ? 'bg-[#141414] border-[#F87171]/20 hover:border-[#F87171]/50 shadow-black'
                      : 'bg-white border-[#C2A68C] hover:border-[#5D866C]/50'
                  }`}
                >
                  <div className="flex items-start gap-3.5 min-w-0">
                    <div className={`w-10 h-10 rounded-xl border flex items-center justify-center shrink-0 ${
                      isDark
                        ? 'bg-[#1E1214] border-[#F87171]/30'
                        : 'bg-[#E6D8C3] border-[#C2A68C]'
                    } ${stat.color}`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className={`text-sm font-bold font-rpg ${
                          isDark ? 'text-white' : 'text-[#1C1917]'
                        }`}>
                          {stat.name}
                        </span>
                        {recent > 0 && (
                          <span className="text-[10px] font-bold text-emerald-500 font-mono">
                            +{recent} today
                          </span>
                        )}
                      </div>
                      <p className={`text-[11px] truncate max-w-sm sm:max-w-md ${
                        isDark ? 'text-zinc-400' : 'text-[#78716C]'
                      }`}>
                        {stat.habits}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 shrink-0 self-end sm:self-center">
                    <div className="w-28 sm:w-36 h-2 rounded-full overflow-hidden bg-zinc-200 dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700">
                      <div
                        className={`h-full transition-all duration-700 ${
                          isDark ? stat.darkBarColor : stat.barColor
                        }`}
                        style={{ width: `${Math.min(100, val)}%` }}
                      />
                    </div>
                    <span className={`text-xs font-mono font-bold w-7 text-right ${
                      isDark ? 'text-zinc-200' : 'text-[#1C1917]'
                    }`}>
                      {val}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Equipment Armory Slots (4 Columns) */}
        <div className="lg:col-span-4 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className={`text-lg font-bold font-rpg flex items-center gap-2 ${
              isDark ? 'text-white' : 'text-[#1C1917]'
            }`}>
              <Shield className={`w-5 h-5 ${isDark ? 'text-[#F87171]' : 'text-[#5D866C]'}`} />
              <span>Armory Loadout</span>
            </h3>
            <button
              onClick={() => navigate('/rewards')}
              className={`text-xs font-bold hover:underline ${
                isDark ? 'text-[#F87171]' : 'text-[#5D866C]'
              }`}
            >
              Shop Gear →
            </button>
          </div>

          <div className="space-y-3">
            {equipmentSlots.map((eq) => {
              const Icon = eq.icon;
              return (
                <div
                  key={eq.slot}
                  className={`p-3.5 rounded-2xl border shadow-sm flex items-center justify-between gap-3 transition-all ${
                    isDark
                      ? 'bg-[#141414] border-[#F87171]/20 shadow-black'
                      : 'bg-white border-[#C2A68C]'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-9 h-9 rounded-xl border flex items-center justify-center shrink-0 ${
                      isDark
                        ? 'bg-[#1E1214] border-[#F87171]/30'
                        : 'bg-[#E6D8C3] border-[#C2A68C]'
                    } ${eq.color}`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <div>
                      <div className={`text-[10px] uppercase font-bold tracking-wider ${
                        isDark ? 'text-zinc-500' : 'text-[#78716C]'
                      }`}>
                        {eq.slot}
                      </div>
                      <div className={`text-xs font-bold ${
                        isDark ? 'text-white' : 'text-[#1C1917]'
                      }`}>
                        {eq.item}
                      </div>
                    </div>
                  </div>

                  <span className={`text-[10px] font-mono px-2 py-0.5 rounded-lg border ${
                    isDark
                      ? 'bg-zinc-900 border-zinc-800 text-zinc-400'
                      : 'bg-stone-100 border-stone-200 text-stone-600'
                  }`}>
                    EQUIPPED
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Edit Profile Modal */}
      <AnimatePresence>
        {isEditModalOpen && (
          <div
            id="edit-profile-backdrop"
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm overflow-y-auto"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className={`relative max-w-lg w-full rounded-3xl p-6 sm:p-7 border-2 shadow-2xl transition-colors my-8 ${
                isDark
                  ? 'bg-[#141414] border-[#F87171]/40 shadow-black'
                  : 'bg-white border-[#C2A68C]'
              }`}
            >
              {/* Close Button */}
              <button
                type="button"
                onClick={() => setIsEditModalOpen(false)}
                className={`absolute top-5 right-5 p-1.5 rounded-xl border transition-all ${
                  isDark ? 'border-zinc-800 text-zinc-400 hover:text-white' : 'border-stone-200 text-stone-500 hover:text-black'
                }`}
              >
                <X className="w-4 h-4" />
              </button>

              <div className="flex items-center gap-3 mb-5">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center border ${
                  isDark
                    ? 'bg-[#1E1214] border-[#F87171]/30 text-[#F87171]'
                    : 'bg-[#E6D8C3] border-[#C2A68C] text-[#5D866C]'
                }`}>
                  <Edit3 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className={`text-lg font-black font-rpg ${isDark ? 'text-white' : 'text-[#1C1917]'}`}>
                    Edit Hero Profile
                  </h3>
                  <p className={`text-xs ${isDark ? 'text-zinc-400' : 'text-[#78716C]'}`}>
                    Upload a custom profile photo and update your moniker.
                  </p>
                </div>
              </div>

              <form onSubmit={handleSaveProfile} className="space-y-5">
                {/* Avatar Section */}
                <div className={`p-4 rounded-2xl border ${
                  isDark ? 'bg-[#1A1A1A] border-zinc-800' : 'bg-[#F9F8F6] border-stone-200'
                }`}>
                  <label className={`block text-xs font-bold uppercase tracking-wider mb-3 ${
                    isDark ? 'text-zinc-300' : 'text-[#1C1917]'
                  }`}>
                    Hero Portrait
                  </label>

                  <div className="flex flex-col sm:flex-row items-center gap-4">
                    {/* Live Preview */}
                    <div className="shrink-0 text-center">
                      <Avatar
                        src={editAvatar}
                        name={editName || character.name}
                        heroClass={editHeroClass}
                        size="xl"
                      />
                      <div className={`text-[10px] mt-1 font-mono ${
                        editAvatar ? 'text-emerald-500 font-bold' : (isDark ? 'text-zinc-500' : 'text-stone-400')
                      }`}>
                        {editAvatar ? 'Custom Image' : 'Blank (Initials)'}
                      </div>
                    </div>

                    {/* Upload / Action Buttons */}
                    <div className="flex-1 w-full space-y-2">
                      <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleFileUpload}
                        accept="image/*"
                        className="hidden"
                      />

                      <div className="flex flex-wrap gap-2">
                        {/* File Upload Button */}
                        <button
                          type="button"
                          onClick={() => fileInputRef.current?.click()}
                          className={`flex-1 min-w-[120px] py-2 px-3 rounded-xl border text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                            isDark
                              ? 'bg-[#1E1214] border-[#F87171]/40 text-white hover:bg-[#F87171] hover:text-black'
                              : 'bg-white border-[#C2A68C] text-[#1C1917] hover:bg-[#5D866C] hover:text-white'
                          }`}
                        >
                          <Upload className="w-3.5 h-3.5" />
                          <span>Upload Image</span>
                        </button>

                        {/* Paste URL Button */}
                        <button
                          type="button"
                          onClick={() => setShowUrlInput(!showUrlInput)}
                          className={`py-2 px-3 rounded-xl border text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                            isDark
                              ? 'border-zinc-700 text-zinc-300 hover:text-white'
                              : 'border-[#C2A68C] text-[#1C1917] hover:border-[#5D866C]'
                          }`}
                        >
                          <LinkIcon className="w-3.5 h-3.5" />
                          <span>Image URL</span>
                        </button>

                        {/* Remove Image (Blank) Button */}
                        {editAvatar && (
                          <button
                            type="button"
                            onClick={() => setEditAvatar('')}
                            className={`py-2 px-3 rounded-xl border text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer text-rose-500 hover:bg-rose-500/10 border-rose-500/30`}
                            title="Remove picture and show blank/initials"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            <span>Clear</span>
                          </button>
                        )}
                      </div>

                      {/* Optional URL Input */}
                      {showUrlInput && (
                        <div className="flex gap-2 pt-1">
                          <input
                            type="url"
                            placeholder="https://..."
                            value={urlInput}
                            onChange={(e) => setUrlInput(e.target.value)}
                            className={`flex-1 px-3 py-1.5 rounded-xl border text-xs focus:outline-none ${
                              isDark
                                ? 'bg-black border-zinc-700 text-white focus:border-[#F87171]'
                                : 'bg-white border-stone-300 text-black focus:border-[#5D866C]'
                            }`}
                          />
                          <button
                            type="button"
                            onClick={handleApplyUrl}
                            className={`px-3 py-1.5 rounded-xl text-xs font-bold ${
                              isDark ? 'bg-[#F87171] text-black' : 'bg-[#5D866C] text-white'
                            }`}
                          >
                            Apply
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Moniker Input */}
                <div>
                  <label className={`block text-xs font-bold uppercase tracking-wider mb-1.5 ${
                    isDark ? 'text-zinc-300' : 'text-[#1C1917]'
                  }`}>
                    Adventurer Moniker (Name)
                  </label>
                  <input
                    type="text"
                    required
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    placeholder="Hero Name"
                    className={`w-full px-4 py-2.5 rounded-xl border font-rpg font-bold text-sm focus:outline-none transition-all ${
                      isDark
                        ? 'bg-[#1A1A1A] border-zinc-800 text-white focus:border-[#F87171]'
                        : 'bg-white border-stone-300 text-[#1C1917] focus:border-[#5D866C]'
                    }`}
                  />
                </div>

                {/* Hero Title */}
                <div>
                  <label className={`block text-xs font-bold uppercase tracking-wider mb-1.5 ${
                    isDark ? 'text-zinc-300' : 'text-[#1C1917]'
                  }`}>
                    Title
                  </label>
                  <input
                    type="text"
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                    placeholder="e.g. Apprentice Seeker, Archmage"
                    className={`w-full px-4 py-2.5 rounded-xl border text-xs focus:outline-none transition-all ${
                      isDark
                        ? 'bg-[#1A1A1A] border-zinc-800 text-white focus:border-[#F87171]'
                        : 'bg-white border-stone-300 text-[#1C1917] focus:border-[#5D866C]'
                    }`}
                  />
                </div>

                {/* Hero Class Selector */}
                <div>
                  <label className={`block text-xs font-bold uppercase tracking-wider mb-2 ${
                    isDark ? 'text-zinc-300' : 'text-[#1C1917]'
                  }`}>
                    Hero Class
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {AVAILABLE_CLASSES.map((cls) => {
                      const Icon = cls.icon;
                      const isSelected = editHeroClass === cls.id;
                      return (
                        <button
                          key={cls.id}
                          type="button"
                          onClick={() => setEditHeroClass(cls.id)}
                          className={`p-2.5 rounded-xl border flex flex-col items-center gap-1 transition-all cursor-pointer ${
                            isSelected
                              ? isDark
                                ? 'bg-[#F87171] text-black border-transparent font-black shadow-md shadow-[#F87171]/20'
                                : 'bg-[#5D866C] text-white border-transparent font-bold shadow-md shadow-[#5D866C]/20'
                              : isDark
                                ? 'bg-[#1A1A1A] border-zinc-800 text-zinc-400 hover:border-zinc-700'
                                : 'bg-stone-50 border-stone-200 text-stone-600 hover:border-stone-300'
                          }`}
                        >
                          <Icon className="w-4 h-4" />
                          <span className="text-xs font-bold">{cls.name}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center justify-end gap-3 pt-3 border-t border-zinc-800/40">
                  <button
                    type="button"
                    onClick={() => setIsEditModalOpen(false)}
                    className={`px-4 py-2.5 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                      isDark ? 'border-zinc-800 text-zinc-400 hover:text-white' : 'border-stone-200 text-stone-600 hover:text-black'
                    }`}
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    disabled={saving}
                    className={`px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition-all cursor-pointer shadow-md ${
                      isDark
                        ? 'bg-[#F87171] hover:bg-[#EF4444] text-black font-black'
                        : 'bg-[#5D866C] hover:bg-[#4B6E57] text-white'
                    }`}
                  >
                    <Check className="w-4 h-4" />
                    <span>{saving ? 'Saving...' : 'Save Profile'}</span>
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
