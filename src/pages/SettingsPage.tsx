import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Settings,
  User,
  Volume2,
  Eye,
  Lock,
  LogOut,
  Check,
  Camera,
  Upload,
  Link,
  X,
  LifeBuoy,
  ArrowRight,
} from 'lucide-react';
import { useGame } from '../context/GameContext';
import { useTheme } from '../context/ThemeContext';
import { Avatar } from '../components/common/Avatar';

export const SettingsPage: React.FC = () => {
  const navigate = useNavigate();
  const { user, character, soundEnabled, toggleSound, addToast, logout, updateAvatar, updateProfile } = useGame();
  const { isDark } = useTheme();

  const fileInputRef = useRef<HTMLInputElement>(null);

  const [username, setUsername] = useState(character?.name || 'Hero');
  const [title, setTitle] = useState(character?.title || 'Apprentice Seeker');

  // Avatar state
  const [avatarPreview, setAvatarPreview] = useState<string>(character?.avatarUrl || '');
  const [avatarUrlInput, setAvatarUrlInput] = useState('');
  const [showUrlInput, setShowUrlInput] = useState(false);
  const [avatarUploading, setAvatarUploading] = useState(false);
  const [avatarTab, setAvatarTab] = useState<'current' | 'upload' | 'url'>('current');

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');

  const [animationsEnabled, setAnimationsEnabled] = useState(true);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [highContrast, setHighContrast] = useState(false);
  const [saved, setSaved] = useState(false);

  // Get Google profile photo or email-derived avatar
  const googlePhotoUrl = (user as any)?.photoURL || null;
  const emailAvatarUrl = user?.email
    ? `https://www.gravatar.com/avatar/${btoa(user.email.trim().toLowerCase()).replace(/[^a-zA-Z0-9]/g, '').slice(0, 32)}?d=identicon&s=200`
    : null;

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      addToast({ type: 'error', title: 'Invalid file', message: 'Please select an image file.' });
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      addToast({ type: 'error', title: 'File too large', message: 'Image must be under 2MB.' });
      return;
    }
    const reader = new FileReader();
    reader.onload = (ev) => {
      const dataUrl = ev.target?.result as string;
      setAvatarPreview(dataUrl);
      setAvatarTab('upload');
    };
    reader.readAsDataURL(file);
  };

  const handleSaveAvatar = async () => {
    if (avatarPreview === (character?.avatarUrl || '')) return;
    setAvatarUploading(true);
    try {
      await updateAvatar(avatarPreview);
    } finally {
      setAvatarUploading(false);
    }
  };

  const handleApplyUrlAvatar = () => {
    if (!avatarUrlInput.trim()) return;
    setAvatarPreview(avatarUrlInput.trim());
    setShowUrlInput(false);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    try {
      await updateProfile({
        name: username.trim() || character?.name,
        title: title.trim() || character?.title,
      });
      addToast({
        type: 'success',
        title: 'Sanctuary Settings Saved',
        message: 'Your hero profile and preferences have been updated.',
      });
    } finally {
      setTimeout(() => setSaved(false), 2000);
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const tabClass = (active: boolean) =>
    `px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
      active
        ? isDark
          ? 'bg-[#F87171] text-black'
          : 'bg-[#5D866C] text-white'
        : isDark
        ? 'text-zinc-400 hover:text-white'
        : 'text-[#78716C] hover:text-[#1C1917]'
    }`;

  return (
    <div className="max-w-3xl mx-auto space-y-8 animate-fadeIn" id="settings-main-view">
      {/* Header */}
      <div
        className={`pb-4 border-b ${isDark ? 'border-[#F87171]/20' : 'border-[#C2A68C]'}`}
      >
        <div
          className={`inline-flex items-center gap-1.5 text-xs uppercase tracking-wider font-bold mb-1 ${
            isDark ? 'text-[#F87171]' : 'text-[#5D866C]'
          }`}
        >
          <Settings className="w-3.5 h-3.5" />
          <span>REALM CONFIGURATION</span>
        </div>
        <h2
          className={`text-2xl sm:text-3xl font-black font-rpg tracking-wide ${
            isDark ? 'text-white' : 'text-[#1C1917]'
          }`}
        >
          SANCTUARY SETTINGS
        </h2>
        <p className={`text-xs mt-0.5 ${isDark ? 'text-zinc-400' : 'text-[#78716C]'}`}>
          Fine-tune audio synthesis, avatar attributes, and display accessibility.
        </p>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* ─── Avatar Section ─── */}
        <div
          className={`rounded-3xl p-6 border shadow-sm space-y-5 transition-colors ${
            isDark ? 'bg-[#141414] border-[#F87171]/25' : 'bg-white border-[#C2A68C]'
          }`}
        >
          <div
            className={`flex items-center gap-2 text-sm font-bold font-rpg ${
              isDark ? 'text-white' : 'text-[#1C1917]'
            }`}
          >
            <Camera className={`w-4 h-4 ${isDark ? 'text-[#F87171]' : 'text-[#5D866C]'}`} />
            <span>Hero Portrait</span>
          </div>

          <div className="flex flex-col sm:flex-row gap-6 items-start">
            {/* Preview */}
            <div className="flex flex-col items-center gap-3 shrink-0">
              <div className="relative group">
                <Avatar
                  src={avatarPreview}
                  name={character?.name || user?.name || 'Hero'}
                  heroClass={character?.heroClass}
                  size="xl"
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className={`absolute inset-0 rounded-2xl flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer ${
                    isDark ? 'bg-black/60' : 'bg-white/70'
                  }`}
                >
                  <Camera className={`w-6 h-6 ${isDark ? 'text-white' : 'text-[#1C1917]'}`} />
                </button>
              </div>
              <span className={`text-[10px] ${isDark ? 'text-zinc-500' : 'text-[#78716C]'}`}>
                Hover to change
              </span>
            </div>

            {/* Avatar Options */}
            <div className="flex-1 space-y-4 w-full">
              {/* Tabs */}
              <div className={`flex gap-1 p-1 rounded-xl w-fit ${isDark ? 'bg-[#1E1E1E]' : 'bg-[#F5F5F0]'}`}>
                <button type="button" className={tabClass(avatarTab === 'current')} onClick={() => setAvatarTab('current')}>
                  Current
                </button>
                <button type="button" className={tabClass(avatarTab === 'upload')} onClick={() => setAvatarTab('upload')}>
                  Upload
                </button>
                <button type="button" className={tabClass(avatarTab === 'url')} onClick={() => setAvatarTab('url')}>
                  URL
                </button>
              </div>

              {/* Tab Content */}
              {avatarTab === 'current' && (
                <div className="space-y-3">
                  <p className={`text-xs ${isDark ? 'text-zinc-400' : 'text-[#78716C]'}`}>
                    Quick-select from your connected accounts:
                  </p>
                  <div className="flex flex-wrap gap-3">
                    {/* Google Photo */}
                    {googlePhotoUrl && (
                      <button
                        type="button"
                        onClick={() => setAvatarPreview(googlePhotoUrl)}
                        className={`flex items-center gap-2 px-3 py-2 rounded-xl border text-xs font-semibold transition-all cursor-pointer ${
                          avatarPreview === googlePhotoUrl
                            ? isDark
                              ? 'border-[#F87171] bg-[#F87171]/10 text-[#F87171]'
                              : 'border-[#5D866C] bg-[#5D866C]/10 text-[#5D866C]'
                            : isDark
                            ? 'border-zinc-700 text-zinc-300 hover:border-zinc-500'
                            : 'border-[#C2A68C] text-[#57534E] hover:border-[#5D866C]'
                        }`}
                      >
                        <img src={googlePhotoUrl} alt="Google" className="w-5 h-5 rounded-full object-cover" referrerPolicy="no-referrer" />
                        Google Photo
                        {avatarPreview === googlePhotoUrl && <Check className="w-3.5 h-3.5" />}
                      </button>
                    )}

                    {/* Email / Gravatar */}
                    {user?.email && (
                      <button
                        type="button"
                        onClick={() => {
                          const md5url = `https://www.gravatar.com/avatar/${
                            // Simple hash simulation — just use email-based Dicebear avatar
                            encodeURIComponent(user.email)
                          }?d=identicon&s=200`;
                          const dicebearUrl = `https://api.dicebear.com/7.x/adventurer/svg?seed=${encodeURIComponent(user.email)}&backgroundColor=b6e3f4,c0aede,d1d4f9`;
                          setAvatarPreview(dicebearUrl);
                        }}
                        className={`flex items-center gap-2 px-3 py-2 rounded-xl border text-xs font-semibold transition-all cursor-pointer ${
                          isDark
                            ? 'border-zinc-700 text-zinc-300 hover:border-zinc-500'
                            : 'border-[#C2A68C] text-[#57534E] hover:border-[#5D866C]'
                        }`}
                      >
                        <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-black ${
                          isDark ? 'bg-purple-800 text-purple-200' : 'bg-purple-100 text-purple-700'
                        }`}>
                          {user.email[0].toUpperCase()}
                        </span>
                        Email Avatar
                      </button>
                    )}

                    {/* Clear to blank avatar */}
                    <button
                      type="button"
                      onClick={() => setAvatarPreview('')}
                      className={`px-3 py-2 rounded-xl border text-xs font-semibold transition-all cursor-pointer ${
                        !avatarPreview
                          ? isDark
                            ? 'bg-[#F87171] text-black border-transparent font-bold'
                            : 'bg-[#5D866C] text-white border-transparent font-bold'
                          : isDark
                          ? 'border-zinc-700 text-zinc-400 hover:border-zinc-500 hover:text-white'
                          : 'border-[#C2A68C] text-[#78716C] hover:border-[#5D866C] hover:text-[#1C1917]'
                      }`}
                    >
                      Clear / Blank Avatar
                    </button>
                  </div>
                </div>
              )}

              {avatarTab === 'upload' && (
                <div className="space-y-3">
                  <p className={`text-xs ${isDark ? 'text-zinc-400' : 'text-[#78716C]'}`}>
                    Upload a photo from your device (max 2MB):
                  </p>
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl border-2 border-dashed w-full text-xs font-semibold transition-all cursor-pointer ${
                      isDark
                        ? 'border-[#F87171]/30 text-zinc-300 hover:border-[#F87171] hover:bg-[#F87171]/5'
                        : 'border-[#5D866C]/30 text-[#57534E] hover:border-[#5D866C] hover:bg-[#5D866C]/5'
                    }`}
                  >
                    <Upload className="w-4 h-4" />
                    <span>Click to choose image file…</span>
                  </button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleFileUpload}
                    id="avatar-file-input"
                  />
                  <p className={`text-[10px] ${isDark ? 'text-zinc-600' : 'text-[#A8A29E]'}`}>
                    Supported: JPG, PNG, WEBP, GIF. Image is stored securely in your profile.
                  </p>
                </div>
              )}

              {avatarTab === 'url' && (
                <div className="space-y-3">
                  <p className={`text-xs ${isDark ? 'text-zinc-400' : 'text-[#78716C]'}`}>
                    Paste a direct image URL:
                  </p>
                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <Link className={`w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none ${isDark ? 'text-zinc-500' : 'text-[#A8A29E]'}`} />
                      <input
                        type="url"
                        value={avatarUrlInput}
                        onChange={(e) => setAvatarUrlInput(e.target.value)}
                        placeholder="https://example.com/photo.jpg"
                        className={`w-full pl-9 pr-3 py-2 rounded-xl border text-xs focus:outline-none transition-all ${
                          isDark
                            ? 'bg-[#1E1214] border-[#F87171]/30 text-white focus:border-[#F87171] placeholder-zinc-600'
                            : 'bg-[#F5F5F0] border-[#C2A68C] text-[#1C1917] focus:border-[#5D866C] placeholder-[#A8A29E]'
                        }`}
                        onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleApplyUrlAvatar())}
                      />
                    </div>
                    <button
                      type="button"
                      onClick={handleApplyUrlAvatar}
                      disabled={!avatarUrlInput.trim()}
                      className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer disabled:opacity-40 ${
                        isDark
                          ? 'bg-[#F87171] text-black hover:bg-[#EF4444]'
                          : 'bg-[#5D866C] text-white hover:bg-[#4B6E57]'
                      }`}
                    >
                      Apply
                    </button>
                  </div>
                </div>
              )}

              {/* Save Avatar Button */}
              {avatarPreview !== (character?.avatarUrl || '') && (
                <button
                  type="button"
                  onClick={handleSaveAvatar}
                  disabled={avatarUploading}
                  className={`mt-2 flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer disabled:opacity-60 ${
                    isDark
                      ? 'bg-[#F87171] text-black hover:bg-[#EF4444] shadow-[#F87171]/25 shadow-md'
                      : 'bg-[#5D866C] text-white hover:bg-[#4B6E57] shadow-[#5D866C]/30 shadow-md'
                  }`}
                >
                  {avatarUploading ? (
                    <>
                      <span className="w-3.5 h-3.5 rounded-full border-2 border-current border-t-transparent animate-spin" />
                      Saving…
                    </>
                  ) : (
                    <>
                      <Check className="w-3.5 h-3.5" />
                      {avatarPreview ? 'Save Avatar' : 'Save Blank Avatar'}
                    </>
                  )}
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Profile Section */}
        <div
          className={`rounded-3xl p-6 border shadow-sm space-y-4 transition-colors ${
            isDark ? 'bg-[#141414] border-[#F87171]/25' : 'bg-white border-[#C2A68C]'
          }`}
        >
          <div
            className={`flex items-center gap-2 text-sm font-bold font-rpg ${
              isDark ? 'text-white' : 'text-[#1C1917]'
            }`}
          >
            <User className={`w-4 h-4 ${isDark ? 'text-[#F87171]' : 'text-[#5D866C]'}`} />
            <span>Hero Profile</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label
                className={`block text-xs font-semibold mb-1.5 ${
                  isDark ? 'text-zinc-300' : 'text-[#1C1917]'
                }`}
              >
                Hero Moniker
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className={`w-full py-2 px-3 rounded-xl border text-xs focus:outline-none transition-all ${
                  isDark
                    ? 'bg-[#1E1214] border-[#F87171]/30 text-white focus:border-[#F87171]'
                    : 'bg-[#F5F5F0] border-[#C2A68C] text-[#1C1917] focus:border-[#5D866C]'
                }`}
              />
            </div>

            <div>
              <label
                className={`block text-xs font-semibold mb-1.5 ${
                  isDark ? 'text-zinc-300' : 'text-[#1C1917]'
                }`}
              >
                Guild Honorific Title
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className={`w-full py-2 px-3 rounded-xl border text-xs focus:outline-none transition-all ${
                  isDark
                    ? 'bg-[#1E1214] border-[#F87171]/30 text-white focus:border-[#F87171]'
                    : 'bg-[#F5F5F0] border-[#C2A68C] text-[#1C1917] focus:border-[#5D866C]'
                }`}
              />
            </div>
          </div>
        </div>

        {/* Account Credentials */}
        <div
          className={`rounded-3xl p-6 border shadow-sm space-y-4 transition-colors ${
            isDark ? 'bg-[#141414] border-[#F87171]/25' : 'bg-white border-[#C2A68C]'
          }`}
        >
          <div
            className={`flex items-center gap-2 text-sm font-bold font-rpg ${
              isDark ? 'text-white' : 'text-[#1C1917]'
            }`}
          >
            <Lock className={`w-4 h-4 ${isDark ? 'text-[#FBBF24]' : 'text-[#B45309]'}`} />
            <span>Adventurer Credentials</span>
          </div>

          <div className="space-y-3">
            <div>
              <label
                className={`block text-xs font-semibold mb-1.5 ${
                  isDark ? 'text-zinc-300' : 'text-[#1C1917]'
                }`}
              >
                Email Address
              </label>
              <input
                type="email"
                value={user?.email || ''}
                readOnly
                className={`w-full py-2 px-3 rounded-xl border text-xs focus:outline-none opacity-70 cursor-not-allowed ${
                  isDark
                    ? 'bg-[#1A1A1A] border-[#F87171]/20 text-zinc-400'
                    : 'bg-[#F0F0EB] border-[#C2A68C] text-[#78716C]'
                }`}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label
                  className={`block text-xs font-semibold mb-1.5 ${
                    isDark ? 'text-zinc-300' : 'text-[#1C1917]'
                  }`}
                >
                  Current Passphrase
                </label>
                <input
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="••••••••"
                  className={`w-full py-2 px-3 rounded-xl border text-xs focus:outline-none transition-all ${
                    isDark
                      ? 'bg-[#1E1214] border-[#F87171]/30 text-white focus:border-[#F87171]'
                      : 'bg-[#F5F5F0] border-[#C2A68C] text-[#1C1917] focus:border-[#5D866C]'
                  }`}
                />
              </div>

              <div>
                <label
                  className={`block text-xs font-semibold mb-1.5 ${
                    isDark ? 'text-zinc-300' : 'text-[#1C1917]'
                  }`}
                >
                  New Passphrase
                </label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="••••••••"
                  className={`w-full py-2 px-3 rounded-xl border text-xs focus:outline-none transition-all ${
                    isDark
                      ? 'bg-[#1E1214] border-[#F87171]/30 text-white focus:border-[#F87171]'
                      : 'bg-[#F5F5F0] border-[#C2A68C] text-[#1C1917] focus:border-[#5D866C]'
                  }`}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Audio & Game Feel Preferences */}
        <div
          className={`rounded-3xl p-6 border shadow-sm space-y-4 transition-colors ${
            isDark ? 'bg-[#141414] border-[#F87171]/25' : 'bg-white border-[#C2A68C]'
          }`}
        >
          <div
            className={`flex items-center gap-2 text-sm font-bold font-rpg ${
              isDark ? 'text-white' : 'text-[#1C1917]'
            }`}
          >
            <Volume2 className={`w-4 h-4 ${isDark ? 'text-[#F87171]' : 'text-[#5D866C]'}`} />
            <span>Audio &amp; Feedback Preferences</span>
          </div>

          <div className="space-y-3">
            {/* Sound FX Toggle */}
            <div
              className={`flex items-center justify-between p-3.5 rounded-2xl border ${
                isDark ? 'bg-[#1A1416] border-[#F87171]/20' : 'bg-[#E6D8C3] border-[#C2A68C]'
              }`}
            >
              <div>
                <div className={`text-xs font-bold ${isDark ? 'text-white' : 'text-[#1C1917]'}`}>
                  Web Audio Synthesizer
                </div>
                <div className={`text-[11px] ${isDark ? 'text-zinc-400' : 'text-[#78716C]'}`}>
                  Play retro synthesized chimes upon quest completion, gold gains, and level ascensions.
                </div>
              </div>
              <button
                type="button"
                onClick={toggleSound}
                className={`w-12 h-6 rounded-full transition-colors relative cursor-pointer shrink-0 ${
                  soundEnabled
                    ? isDark
                      ? 'bg-[#F87171]'
                      : 'bg-[#5D866C]'
                    : isDark
                    ? 'bg-zinc-800'
                    : 'bg-[#C2A68C]'
                }`}
              >
                <div
                  className={`w-5 h-5 rounded-full bg-white transition-transform absolute top-0.5 ${
                    soundEnabled ? 'right-0.5' : 'left-0.5'
                  }`}
                />
              </button>
            </div>

            {/* Animations Toggle */}
            <div
              className={`flex items-center justify-between p-3.5 rounded-2xl border ${
                isDark ? 'bg-[#1A1416] border-[#F87171]/20' : 'bg-[#E6D8C3] border-[#C2A68C]'
              }`}
            >
              <div>
                <div className={`text-xs font-bold ${isDark ? 'text-white' : 'text-[#1C1917]'}`}>
                  Dynamic Confetti &amp; Level-Up Bursts
                </div>
                <div className={`text-[11px] ${isDark ? 'text-zinc-400' : 'text-[#78716C]'}`}>
                  Trigger particle blasts and card entrance transitions.
                </div>
              </div>
              <button
                type="button"
                onClick={() => setAnimationsEnabled(!animationsEnabled)}
                className={`w-12 h-6 rounded-full transition-colors relative cursor-pointer shrink-0 ${
                  animationsEnabled
                    ? isDark
                      ? 'bg-[#F87171]'
                      : 'bg-[#5D866C]'
                    : isDark
                    ? 'bg-zinc-800'
                    : 'bg-[#C2A68C]'
                }`}
              >
                <div
                  className={`w-5 h-5 rounded-full bg-white transition-transform absolute top-0.5 ${
                    animationsEnabled ? 'right-0.5' : 'left-0.5'
                  }`}
                />
              </button>
            </div>

            {/* Notifications Toggle */}
            <div
              className={`flex items-center justify-between p-3.5 rounded-2xl border ${
                isDark ? 'bg-[#1A1416] border-[#F87171]/20' : 'bg-[#E6D8C3] border-[#C2A68C]'
              }`}
            >
              <div>
                <div className={`text-xs font-bold ${isDark ? 'text-white' : 'text-[#1C1917]'}`}>
                  Daily Habit Reminders
                </div>
                <div className={`text-[11px] ${isDark ? 'text-zinc-400' : 'text-[#78716C]'}`}>
                  Deliver subtle toast notices when daily bounties are active.
                </div>
              </div>
              <button
                type="button"
                onClick={() => setNotificationsEnabled(!notificationsEnabled)}
                className={`w-12 h-6 rounded-full transition-colors relative cursor-pointer shrink-0 ${
                  notificationsEnabled
                    ? isDark
                      ? 'bg-[#F87171]'
                      : 'bg-[#5D866C]'
                    : isDark
                    ? 'bg-zinc-800'
                    : 'bg-[#C2A68C]'
                }`}
              >
                <div
                  className={`w-5 h-5 rounded-full bg-white transition-transform absolute top-0.5 ${
                    notificationsEnabled ? 'right-0.5' : 'left-0.5'
                  }`}
                />
              </button>
            </div>
          </div>
        </div>

        {/* Accessibility Section */}
        <div
          className={`rounded-3xl p-6 border shadow-sm space-y-4 transition-colors ${
            isDark ? 'bg-[#141414] border-[#F87171]/25' : 'bg-white border-[#C2A68C]'
          }`}
        >
          <div
            className={`flex items-center gap-2 text-sm font-bold font-rpg ${
              isDark ? 'text-white' : 'text-[#1C1917]'
            }`}
          >
            <Eye className="w-4 h-4 text-purple-400" />
            <span>Accessibility &amp; Display</span>
          </div>

          <div
            className={`flex items-center justify-between p-3.5 rounded-2xl border ${
              isDark ? 'bg-[#1A1416] border-[#F87171]/20' : 'bg-[#E6D8C3] border-[#C2A68C]'
            }`}
          >
            <div>
              <div className={`text-xs font-bold ${isDark ? 'text-white' : 'text-[#1C1917]'}`}>
                High Contrast Borders
              </div>
              <div className={`text-[11px] ${isDark ? 'text-zinc-400' : 'text-[#78716C]'}`}>
                Amplify border delineation across cards and progress indicators.
              </div>
            </div>
            <button
              type="button"
              onClick={() => setHighContrast(!highContrast)}
              className={`w-12 h-6 rounded-full transition-colors relative cursor-pointer shrink-0 ${
                highContrast
                  ? isDark
                    ? 'bg-[#F87171]'
                    : 'bg-[#5D866C]'
                  : isDark
                  ? 'bg-zinc-800'
                  : 'bg-[#C2A68C]'
              }`}
            >
              <div
                className={`w-5 h-5 rounded-full bg-white transition-transform absolute top-0.5 ${
                  highContrast ? 'right-0.5' : 'left-0.5'
                }`}
              />
            </button>
          </div>
        </div>

        {/* Technical Support & Anomaly Reporting Card */}
        <div className={`p-6 rounded-3xl border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 transition-all ${
          isDark 
            ? 'bg-gradient-to-r from-[#141414] to-[#1E1214] border-[#F87171]/25' 
            : 'bg-gradient-to-r from-white to-[#FAF7F2] border-[#C2A68C]'
        }`}>
          <div className="flex items-center gap-3.5">
            <div className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 ${
              isDark ? 'bg-[#F87171]/20 text-[#F87171]' : 'bg-[#5D866C]/20 text-[#5D866C]'
            }`}>
              <LifeBuoy className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold font-rpg">Technical Support & Anomaly Reporting</h3>
              <p className={`text-xs ${isDark ? 'text-zinc-400' : 'text-[#78716C]'}`}>
                Experiencing technical glitches, display bugs, or syncing errors? Contact our technical guild directly.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => navigate('/support')}
            className={`w-full sm:w-auto px-5 py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-2 border transition-all cursor-pointer shrink-0 ${
              isDark 
                ? 'bg-white/5 border-[#F87171]/40 text-[#F87171] hover:bg-[#F87171] hover:text-black' 
                : 'bg-[#F5F5F0] border-[#C2A68C] text-[#5D866C] hover:bg-[#5D866C] hover:text-white'
            }`}
          >
            <span>Open Support Sanctuary</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4">
          <button
            type="button"
            onClick={handleLogout}
            className={`w-full sm:w-auto px-6 py-3 rounded-xl border font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-colors cursor-pointer ${
              isDark
                ? 'bg-rose-950/40 hover:bg-rose-950/70 border-rose-500/40 text-rose-300'
                : 'bg-rose-50 hover:bg-rose-100 border-rose-200 text-rose-700'
            }`}
          >
            <LogOut className="w-4 h-4" />
            <span>LOG OUT OF REALM</span>
          </button>

          <button
            type="submit"
            id="btn-save-settings"
            className={`w-full sm:w-auto px-8 py-3 rounded-xl font-black text-xs uppercase tracking-wider shadow-md flex items-center justify-center gap-2 transition-all cursor-pointer ${
              isDark
                ? 'bg-[#F87171] hover:bg-[#EF4444] text-black shadow-[#F87171]/25'
                : 'bg-[#5D866C] hover:bg-[#4B6E57] text-white shadow-[#5D866C]/30'
            }`}
          >
            {saved ? (
              <>
                <Check className="w-4 h-4" />
                <span>SAVED!</span>
              </>
            ) : (
              <span>SAVE CHANGES</span>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};
