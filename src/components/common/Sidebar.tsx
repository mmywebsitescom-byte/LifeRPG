import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { 
  Home,
  LayoutDashboard, 
  Scroll, 
  PlusCircle, 
  Compass, 
  User, 
  TrendingUp, 
  Trophy, 
  ShoppingBag, 
  Settings,
} from 'lucide-react';
import { useGame } from '../../context/GameContext';
import { useTheme } from '../../context/ThemeContext';
import { XPBar } from './XPBar';
import { Avatar } from './Avatar';
import { getXpDetails } from '../../utils/rpgEngine';

export const Sidebar: React.FC = () => {
  const { character } = useGame();
  const { isDark } = useTheme();
  const navigate = useNavigate();

  const xpInfo = character ? getXpDetails(character.xp) : null;

  const navLinks = [
    { to: '/', label: 'Home Page', icon: Home },
    { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/quests', label: 'My Quests', icon: Scroll },
    { to: '/quests/create', label: 'Create Quest', icon: PlusCircle },
    { to: '/discover', label: 'Discover Quests', icon: Compass },
    { to: '/character', label: 'Character Sheet', icon: User },
    { to: '/progress', label: 'Progress & History', icon: TrendingUp },
    { to: '/achievements', label: 'Achievements', icon: Trophy },
    { to: '/rewards', label: 'Rewards Shop', icon: ShoppingBag },
    { to: '/settings', label: 'Settings', icon: Settings },
  ];

  return (
    <aside
      id="desktop-sidebar"
      className={`hidden md:flex flex-col w-64 lg:w-72 h-screen sticky top-0 border-r shrink-0 z-40 transition-colors ${
        isDark 
          ? 'bg-[#0F0F0F] border-[#F87171]/20' 
          : 'bg-[#E6D8C3] border-[#C2A68C]'
      }`}
    >
      {/* Brand Header */}
      <div className={`p-6 border-b ${isDark ? 'border-[#F87171]/20' : 'border-[#C2A68C]'}`}>
        <div
          onClick={() => navigate('/dashboard')}
          className="flex items-center gap-3 cursor-pointer group"
        >
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-white shadow-md group-hover:scale-105 transition-transform ${
            isDark
              ? 'bg-[#F87171] text-black shadow-[#F87171]/25'
              : 'bg-[#5D866C] shadow-[#5D866C]/30'
          }`}>
            <span className="text-xl">⚔</span>
          </div>
          <div>
            <span className={`text-lg font-black font-rpg tracking-wider ${isDark ? 'text-white' : 'text-[#1C1917]'}`}>
              LIFE RPG
            </span>
            <p className={`text-[10px] font-bold uppercase tracking-widest ${isDark ? 'text-zinc-400' : 'text-[#78716C]'}`}>
              Level Up Your Life
            </p>
          </div>
        </div>
      </div>

      {/* Main Navigation Links */}
      <nav className="flex-1 overflow-y-auto px-4 py-6 space-y-1.5" aria-label="Main Navigation">
        {navLinks.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              id={`nav-link-${item.label.toLowerCase().replace(/\s+/g, '-')}`}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold tracking-wide transition-all ${
                  isActive
                    ? isDark
                      ? 'bg-[#F87171] text-black font-black shadow-md shadow-[#F87171]/25'
                      : 'bg-[#5D866C] text-white font-bold shadow-md shadow-[#5D866C]/25'
                    : isDark
                      ? 'text-zinc-400 hover:text-white hover:bg-white/5'
                      : 'text-[#57534E] hover:text-[#1C1917] hover:bg-[#C2A68C]/60'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <Icon className={`w-4 h-4 shrink-0 ${
                    isActive 
                      ? isDark ? 'text-black' : 'text-white'
                      : isDark ? 'text-[#F87171]' : 'text-[#5D866C]'
                  }`} />
                  <span>{item.label}</span>
                </>
              )}
            </NavLink>
          );
        })}
      </nav>

      {/* Character Mini Card at Bottom */}
      {character && xpInfo && (
        <div className={`p-4 border-t ${
          isDark 
            ? 'border-[#F87171]/20 bg-[#0F0F0F]' 
            : 'border-[#C2A68C] bg-[#E6D8C3]'
        }`}>
          <div
            onClick={() => navigate('/character')}
            className={`p-3 rounded-2xl border transition-all cursor-pointer group shadow-sm ${
              isDark
                ? 'bg-[#141414] border-[#F87171]/30 hover:border-[#F87171]'
                : 'bg-white border-[#C2A68C] hover:border-[#5D866C]/50'
            }`}
          >
            <div className="flex items-center justify-between gap-2 mb-2">
              <div className="flex items-center gap-2 min-w-0">
                <Avatar
                  src={character.avatarUrl}
                  name={character.name}
                  heroClass={character.heroClass}
                  size="xs"
                />
                <div className="min-w-0">
                  <div className={`text-xs font-bold truncate transition-colors ${
                    isDark ? 'text-white group-hover:text-[#F87171]' : 'text-[#1C1917] group-hover:text-[#5D866C]'
                  }`}>
                    {character.name}
                  </div>
                  <div className={`text-[10px] truncate ${isDark ? 'text-zinc-400' : 'text-[#78716C]'}`}>
                    {character.heroClass}
                  </div>
                </div>
              </div>

              <span className={`text-[11px] font-mono font-bold px-2 py-0.5 rounded-md border ${
                isDark 
                  ? 'text-[#F87171] bg-[#1E1214] border-[#F87171]/40' 
                  : 'text-[#5D866C] bg-[#E6D8C3] border-[#C2A68C]'
              }`}>
                Lvl {character.level}
              </span>
            </div>

            <XPBar
              currentXp={xpInfo.currentLevelXp}
              requiredXp={xpInfo.requiredLevelXp}
              percentage={xpInfo.progressPercentage}
              size="sm"
              showDetails={false}
            />
            <div className={`flex items-center justify-between text-[10px] font-mono mt-1.5 ${
              isDark ? 'text-zinc-400' : 'text-[#78716C]'
            }`}>
              <span>{xpInfo.currentLevelXp} / {xpInfo.requiredLevelXp} XP</span>
              <span className={`font-bold ${isDark ? 'text-[#F87171]' : 'text-[#5D866C]'}`}>
                {xpInfo.progressPercentage}%
              </span>
            </div>
          </div>
        </div>
      )}
    </aside>
  );
};
