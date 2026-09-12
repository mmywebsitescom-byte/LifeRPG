import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Scroll, 
  User, 
  ShoppingBag, 
  MoreHorizontal,
  PlusCircle,
  Compass,
  TrendingUp,
  Trophy,
  Settings,
  X
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useTheme } from '../../context/ThemeContext';

export const MobileNavigation: React.FC = () => {
  const [showMoreDrawer, setShowMoreDrawer] = useState(false);
  const { isDark } = useTheme();
  const navigate = useNavigate();

  const mainTabs = [
    { to: '/dashboard', label: 'Home', icon: LayoutDashboard },
    { to: '/quests', label: 'Quests', icon: Scroll },
    { to: '/character', label: 'Hero', icon: User },
    { to: '/rewards', label: 'Shop', icon: ShoppingBag },
  ];

  const moreLinks = [
    { to: '/quests/create', label: 'Create Quest', icon: PlusCircle, color: isDark ? 'text-[#F87171]' : 'text-[#5D866C]' },
    { to: '/discover', label: 'Discover Quests', icon: Compass, color: 'text-[#D97706]' },
    { to: '/progress', label: 'Progress & History', icon: TrendingUp, color: 'text-[#16A34A]' },
    { to: '/achievements', label: 'Achievements', icon: Trophy, color: 'text-[#9333EA]' },
    { to: '/settings', label: 'Settings', icon: Settings, color: isDark ? 'text-zinc-400' : 'text-[#57534E]' },
  ];

  return (
    <>
      {/* Fixed Bottom Bar */}
      <nav
        id="mobile-bottom-nav"
        className={`md:hidden fixed bottom-0 left-0 right-0 h-16 backdrop-blur-xl border-t z-40 px-2 flex items-center justify-around shadow-lg transition-colors ${
          isDark
            ? 'bg-[#0F0F0F]/95 border-[#F87171]/20'
            : 'bg-[#E6D8C3]/95 border-[#C2A68C]'
        }`}
        aria-label="Mobile Bottom Navigation"
      >
        {mainTabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <NavLink
              key={tab.to}
              to={tab.to}
              id={`mobile-nav-${tab.label.toLowerCase()}`}
              className={({ isActive }) =>
                `flex flex-col items-center justify-center flex-1 py-1 transition-all ${
                  isActive
                    ? isDark ? 'text-[#F87171] font-bold' : 'text-[#5D866C] font-bold'
                    : isDark ? 'text-zinc-500 hover:text-white' : 'text-[#78716C] hover:text-[#1C1917]'
                }`
              }
            >
              <Icon className="w-5 h-5 mb-0.5" />
              <span className="text-[10px] tracking-tight">{tab.label}</span>
            </NavLink>
          );
        })}

        {/* More button */}
        <button
          type="button"
          id="mobile-nav-more"
          onClick={() => setShowMoreDrawer(true)}
          className={`flex flex-col items-center justify-center flex-1 py-1 transition-all ${
            showMoreDrawer 
              ? isDark ? 'text-[#F87171]' : 'text-[#5D866C]'
              : isDark ? 'text-zinc-500 hover:text-white' : 'text-[#78716C] hover:text-[#1C1917]'
          }`}
        >
          <MoreHorizontal className="w-5 h-5 mb-0.5" />
          <span className="text-[10px] tracking-tight">More</span>
        </button>
      </nav>

      {/* More Drawer Modal */}
      <AnimatePresence>
        {showMoreDrawer && (
          <div className="md:hidden fixed inset-0 z-50 flex flex-col justify-end bg-black/60 backdrop-blur-sm">
            <div
              className="fixed inset-0"
              onClick={() => setShowMoreDrawer(false)}
            />
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className={`relative border-t rounded-t-3xl p-6 shadow-2xl z-10 ${
                isDark
                  ? 'bg-[#141414] border-[#F87171]/30 text-white'
                  : 'bg-[#E6D8C3] border-[#C2A68C] text-[#1C1917]'
              }`}
            >
              <div className={`flex items-center justify-between pb-4 border-b mb-4 ${
                isDark ? 'border-[#F87171]/20' : 'border-[#C2A68C]'
              }`}>
                <span className="text-sm font-bold font-rpg">
                  REALM NAVIGATION
                </span>
                <button
                  type="button"
                  onClick={() => setShowMoreDrawer(false)}
                  className={`p-1 rounded-lg ${isDark ? 'text-zinc-400 hover:text-white' : 'text-[#78716C] hover:text-[#1C1917]'}`}
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="grid grid-cols-2 gap-3 mb-6">
                {moreLinks.map((item) => {
                  const Icon = item.icon;
                  return (
                    <button
                      key={item.to}
                      type="button"
                      onClick={() => {
                        setShowMoreDrawer(false);
                        navigate(item.to);
                      }}
                      className={`flex items-center gap-3 p-3 rounded-2xl border text-left transition-colors shadow-sm ${
                        isDark
                          ? 'bg-[#1E1214] border-[#F87171]/30 hover:border-[#F87171]'
                          : 'bg-white border-[#C2A68C] hover:border-[#5D866C]'
                      }`}
                    >
                      <div className={`p-2 rounded-xl border ${
                        isDark
                          ? 'bg-[#2A181C] border-[#F87171]/30'
                          : 'bg-[#E6D8C3] border-[#C2A68C]'
                      } ${item.color}`}>
                        <Icon className="w-4 h-4" />
                      </div>
                      <span className={`text-xs font-semibold ${isDark ? 'text-white' : 'text-[#1C1917]'}`}>
                        {item.label}
                      </span>
                    </button>
                  );
                })}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};
