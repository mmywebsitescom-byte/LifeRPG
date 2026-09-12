import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { 
  Bell, 
  Search, 
  Volume2, 
  VolumeX, 
  Sparkles, 
  Flame,
  CheckCircle2,
  X,
  RotateCw
} from 'lucide-react';
import { useGame } from '../../context/GameContext';
import { useTheme } from '../../context/ThemeContext';
import { GoldBalance } from './GoldBalance';
import { Avatar } from './Avatar';
import PillNav, { PillNavItem } from './PillNav';
import { ThemeToggle } from './ThemeToggle';

interface TopBarProps {
  onSearchChange?: (val: string) => void;
  searchValue?: string;
  showSearch?: boolean;
}

export const TopBar: React.FC<TopBarProps> = ({
  onSearchChange,
  searchValue = '',
  showSearch = false,
}) => {
  const { character, soundEnabled, toggleSound, refreshData, loading } = useGame();
  const { isDark } = useTheme();
  const location = useLocation();
  const navigate = useNavigate();
  const [showNotifications, setShowNotifications] = useState(false);

  // Dynamic page title based on route
  const getPageTitle = () => {
    switch (location.pathname) {
      case '/dashboard':
        return 'Hero Command Deck';
      case '/quests':
        return 'Quest Log & Bounties';
      case '/quests/create':
        return 'Forge New Quest';
      case '/discover':
        return 'Quest Vault & Templates';
      case '/character':
        return 'Character Sheet';
      case '/progress':
        return 'Attributes & Analytics';
      case '/achievements':
        return 'Feats of Glory';
      case '/rewards':
        return 'The Mystic Armory';
      case '/settings':
        return 'Heroic Settings';
      default:
        return 'Life RPG';
    }
  };

  const topNavItems: PillNavItem[] = [
    { label: 'Home', href: '/' },
    { label: 'Dashboard', href: '/dashboard' },
    { label: 'Quests', href: '/quests' },
    { label: 'Character', href: '/character' },
    { label: 'Armory', href: '/rewards' },
  ];

  return (
    <header
      id="top-navigation-bar"
      className={`sticky top-0 z-30 w-full h-16 sm:h-20 backdrop-blur-xl border-b px-4 sm:px-8 flex items-center justify-between gap-4 transition-colors duration-300 ${
        isDark 
          ? 'bg-[#0A0A0A]/90 border-[#F87171]/20 text-white' 
          : 'bg-[#F5F5F0]/90 border-[#C2A68C] text-[#1C1917]'
      }`}
    >
      {/* Left: Page Title & Optional Search */}
      <div className="flex items-center gap-4 min-w-0">
        <h1 className={`text-base sm:text-xl font-bold font-rpg truncate ${isDark ? 'text-white' : 'text-[#1C1917]'}`}>
          {getPageTitle()}
        </h1>

        {showSearch && onSearchChange && (
          <div className="hidden xl:flex items-center relative max-w-xs w-56">
            <Search className={`w-4 h-4 absolute left-3 pointer-events-none ${isDark ? 'text-zinc-400' : 'text-[#78716C]'}`} />
            <input
              type="text"
              id="topbar-search-input"
              value={searchValue}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Filter quests..."
              className={`w-full pl-9 pr-3 py-1.5 text-xs rounded-xl focus:outline-none transition-colors ${
                isDark 
                  ? 'bg-[#141414] border border-[#F87171]/30 text-white placeholder-zinc-500 focus:border-[#F87171]' 
                  : 'bg-white border border-[#C2A68C] text-[#1C1917] placeholder-[#78716C] focus:border-[#5D866C]'
              }`}
            />
            {searchValue && (
              <button
                type="button"
                onClick={() => onSearchChange('')}
                className={`absolute right-2.5 ${isDark ? 'text-zinc-400 hover:text-white' : 'text-[#78716C] hover:text-[#1C1917]'}`}
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        )}
      </div>

      {/* Center: PillNav Header Bar Buttons */}
      <div className="hidden md:flex flex-1 justify-center max-w-xl">
        <PillNav
          items={topNavItems}
          activeHref={location.pathname}
          baseColor={isDark ? '#141414' : '#FFFFFF'}
          pillColor={isDark ? '#F87171' : '#5D866C'}
          pillTextColor={isDark ? '#FAFAFA' : '#1C1917'}
          hoveredPillTextColor={isDark ? '#000000' : '#FFFFFF'}
          ease="power3.out"
          initialLoadAnimation={false}
        />
      </div>

      {/* Right Controls: Gold, Refresh, Audio, Theme Toggle, Notifications, Avatar */}
      <div className="flex items-center gap-2 sm:gap-3 shrink-0">
        {character && (
          <div
            onClick={() => navigate('/rewards')}
            className="cursor-pointer transition-transform hover:scale-105 active:scale-95"
            title="Mystic Armory & Rewards Shop: Exchange your coins for gear and rewards!"
          >
            <GoldBalance
              amount={character.gold}
              gold={character.gold}
              variant="pill"
              size="sm"
              showLabel={false}
            />
          </div>
        )}

        {/* Manual Refresh Data Button */}
        <button
          type="button"
          id="btn-manual-sync"
          onClick={() => refreshData()}
          disabled={loading}
          className={`p-2 rounded-xl border transition-colors cursor-pointer ${
            isDark 
              ? 'bg-[#18181B] border-[#F87171]/30 text-zinc-300 hover:text-[#F87171] hover:border-[#F87171]' 
              : 'bg-[#E6D8C3] border-[#C2A68C] text-[#57534E] hover:text-[#5D866C] hover:border-[#5D866C]/50'
          }`}
          title="Synchronize Quest State & Progression"
        >
          <RotateCw className={`w-4 h-4 ${loading ? 'animate-spin text-[#F87171]' : ''}`} />
        </button>

        {/* Audio Toggle button */}
        <button
          type="button"
          id="btn-toggle-sound"
          onClick={toggleSound}
          className={`p-2 rounded-xl border transition-colors cursor-pointer ${
            isDark 
              ? 'bg-[#18181B] border-[#F87171]/30 text-zinc-300 hover:text-[#F87171] hover:border-[#F87171]' 
              : 'bg-[#E6D8C3] border-[#C2A68C] text-[#57534E] hover:text-[#5D866C] hover:border-[#5D866C]/50'
          }`}
          title={soundEnabled ? 'Disable RPG Sound Effects' : 'Enable RPG Sound Effects'}
        >
          {soundEnabled ? (
            <Volume2 className={`w-4 h-4 ${isDark ? 'text-[#F87171]' : 'text-[#5D866C]'}`} />
          ) : (
            <VolumeX className="w-4 h-4 text-zinc-500" />
          )}
        </button>

        {/* Theme Toggle (Dark: Black & Light Red / Light: Parchment & Sage) */}
        <ThemeToggle />

        {/* Notification Bell */}
        <div className="relative">
          <button
            type="button"
            id="btn-notifications"
            onClick={() => setShowNotifications((prev) => !prev)}
            className={`relative p-2 rounded-xl border transition-colors cursor-pointer ${
              isDark 
                ? 'bg-[#18181B] border-[#F87171]/30 text-zinc-300 hover:text-[#F87171] hover:border-[#F87171]' 
                : 'bg-[#E6D8C3] border-[#C2A68C] text-[#57534E] hover:text-[#5D866C] hover:border-[#5D866C]/50'
            }`}
          >
            <Bell className="w-4 h-4" />
            <span className={`absolute top-1 right-1 w-2 h-2 rounded-full animate-pulse ${
              isDark ? 'bg-[#F87171]' : 'bg-[#5D866C]'
            }`} />
          </button>

          {showNotifications && (
            <>
              <div
                className="fixed inset-0 z-30"
                onClick={() => setShowNotifications(false)}
              />
              <div className={`absolute right-0 mt-2 w-72 sm:w-80 rounded-2xl p-4 border shadow-2xl z-40 text-left ${
                isDark 
                  ? 'bg-[#141414] border-[#F87171]/40 shadow-black text-white' 
                  : 'bg-white border-[#C2A68C] text-[#1C1917]'
              }`}>
                <div className={`flex items-center justify-between pb-2 border-b mb-3 ${
                  isDark ? 'border-zinc-800' : 'border-[#C2A68C]'
                }`}>
                  <span className="text-xs font-bold font-rpg">
                    REALM NOTICES
                  </span>
                  <span className={`text-[10px] font-mono font-bold ${isDark ? 'text-[#F87171]' : 'text-[#5D866C]'}`}>
                    Real-time
                  </span>
                </div>
                <div className="space-y-2.5 max-h-60 overflow-y-auto pr-1">
                  <div className={`p-2.5 rounded-xl border text-xs ${
                    isDark 
                      ? 'bg-[#1E1719] border-[#F87171]/30 text-zinc-200' 
                      : 'bg-[#E6D8C3]/70 border-[#C2A68C] text-[#57534E]'
                  }`}>
                    <div className={`flex items-center gap-1.5 font-bold mb-0.5 ${isDark ? 'text-[#F87171]' : 'text-[#5D866C]'}`}>
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Daily Quest Reset</span>
                    </div>
                    <p className="text-[11px]">
                      Bounties for today are primed! Complete all 3 core quests for streak boost.
                    </p>
                  </div>
                  <div className={`p-2.5 rounded-xl border text-xs ${
                    isDark 
                      ? 'bg-[#1E1719] border-[#F87171]/30 text-zinc-200' 
                      : 'bg-[#E6D8C3]/70 border-[#C2A68C] text-[#57534E]'
                  }`}>
                    <div className={`flex items-center gap-1.5 font-bold mb-0.5 ${isDark ? 'text-white' : 'text-[#1C1917]'}`}>
                      <CheckCircle2 className={`w-3.5 h-3.5 ${isDark ? 'text-[#F87171]' : 'text-[#5D866C]'}`} />
                      <span>Streak Shield Intact</span>
                    </div>
                    <p className="text-[11px]">
                      You are protected from 1 accidental missed day.
                    </p>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>

        {/* User Avatar + Level Badge */}
        {character && (
          <div
            onClick={() => navigate('/character')}
            className="flex items-center gap-2.5 pl-2 cursor-pointer group"
          >
            <Avatar
              src={character.avatarUrl}
              name={character.name}
              level={character.level}
              heroClass={character.heroClass}
              size="sm"
            />
            <div className="hidden lg:block text-left">
              <div className={`text-xs font-bold transition-colors ${
                isDark ? 'text-white group-hover:text-[#F87171]' : 'text-[#1C1917] group-hover:text-[#5D866C]'
              }`}>
                {character.name}
              </div>
              <div className={`text-[10px] font-medium ${isDark ? 'text-zinc-400' : 'text-[#78716C]'}`}>
                {character.title}
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};
