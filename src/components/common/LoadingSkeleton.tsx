import React from 'react';
import { useTheme } from '../../context/ThemeContext';

interface SkeletonProps {
  className?: string;
  count?: number;
}

export const LoadingSkeleton: React.FC<SkeletonProps> = ({ className = '', count = 1 }) => {
  return (
    <>
      {Array.from({ length: count }).map((_, idx) => (
        <div
          key={idx}
          className={`animate-pulse bg-[#C2A68C]/70 rounded-xl border border-[#C2A68C] ${className}`}
        />
      ))}
    </>
  );
};

export const DashboardSkeleton: React.FC = () => {
  return (
    <div className="space-y-8 animate-fadeIn" id="dashboard-skeleton">
      {/* Hero Character Card Skeleton */}
      <div className="rounded-3xl p-6 sm:p-8 bg-[#E6D8C3] border-2 border-[#C2A68C] shadow-sm">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="flex items-center gap-4 sm:gap-6">
            <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-[#C2A68C] animate-pulse shrink-0 border border-[#C2A68C]" />
            <div className="space-y-2.5">
              <div className="h-6 w-44 bg-[#C2A68C] rounded-lg animate-pulse" />
              <div className="h-4 w-32 bg-[#C2A68C]/60 rounded-md animate-pulse" />
              <div className="flex items-center gap-2">
                <div className="h-6 w-20 bg-[#C2A68C] rounded-full animate-pulse" />
                <div className="h-6 w-24 bg-[#C2A68C]/80 rounded-full animate-pulse" />
              </div>
            </div>
          </div>
          <div className="lg:w-72 space-y-2">
            <div className="flex justify-between">
              <div className="h-3 w-16 bg-[#C2A68C] rounded animate-pulse" />
              <div className="h-3 w-20 bg-[#C2A68C] rounded animate-pulse" />
            </div>
            <div className="h-3.5 w-full bg-[#C2A68C]/60 rounded-full animate-pulse" />
          </div>
        </div>

        {/* Quick Attribute Counters */}
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-2.5 mt-6 pt-6 border-t border-[#C2A68C]">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="p-2.5 rounded-xl bg-white/70 border border-[#C2A68C] space-y-1.5">
              <div className="h-3 w-12 bg-[#C2A68C] rounded animate-pulse" />
              <div className="h-5 w-8 bg-[#C2A68C]/80 rounded animate-pulse" />
            </div>
          ))}
        </div>
      </div>

      {/* 4 Stat Overview Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="p-4 rounded-2xl bg-white border border-[#C2A68C] space-y-2 shadow-sm">
            <div className="flex items-center justify-between">
              <div className="h-3 w-20 bg-[#C2A68C] rounded animate-pulse" />
              <div className="w-8 h-8 rounded-lg bg-[#C2A68C] animate-pulse" />
            </div>
            <div className="h-7 w-16 bg-[#C2A68C] rounded animate-pulse" />
          </div>
        ))}
      </div>

      {/* Main 2-Column Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Today's Quests */}
        <div className="lg:col-span-8 space-y-4">
          <div className="flex items-center justify-between">
            <div className="h-6 w-36 bg-[#C2A68C] rounded-lg animate-pulse" />
            <div className="h-4 w-24 bg-[#C2A68C]/60 rounded animate-pulse" />
          </div>

          <div className="space-y-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <div
                key={i}
                className="rounded-2xl p-5 bg-white border border-[#C2A68C] space-y-4 shadow-sm"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="h-5 w-20 bg-[#C2A68C] rounded-full animate-pulse" />
                    <div className="h-5 w-16 bg-[#C2A68C] rounded-md animate-pulse" />
                  </div>
                  <div className="w-6 h-6 bg-[#C2A68C] rounded-lg animate-pulse" />
                </div>
                <div className="h-5 w-3/4 bg-[#C2A68C] rounded animate-pulse" />
                <div className="h-3.5 w-1/2 bg-[#C2A68C]/60 rounded animate-pulse" />
                <div className="flex items-center justify-between pt-2 border-t border-[#C2A68C]/60">
                  <div className="flex items-center gap-3">
                    <div className="h-4 w-16 bg-[#C2A68C] rounded animate-pulse" />
                    <div className="h-4 w-20 bg-[#C2A68C] rounded animate-pulse" />
                  </div>
                  <div className="h-8 w-24 bg-[#C2A68C] rounded-xl animate-pulse" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Streak & Achievements */}
        <div className="lg:col-span-4 space-y-6">
          <div className="rounded-2xl p-6 bg-white border border-[#C2A68C] space-y-4 shadow-sm">
            <div className="h-5 w-28 bg-[#C2A68C] rounded animate-pulse" />
            <div className="h-12 w-20 bg-[#C2A68C] rounded-xl animate-pulse" />
            <div className="grid grid-cols-7 gap-1 pt-2">
              {Array.from({ length: 7 }).map((_, j) => (
                <div key={j} className="h-10 rounded-lg bg-[#C2A68C] animate-pulse" />
              ))}
            </div>
          </div>

          <div className="rounded-2xl p-6 bg-white border border-[#C2A68C] space-y-3 shadow-sm">
            <div className="h-5 w-36 bg-[#C2A68C] rounded animate-pulse" />
            {Array.from({ length: 3 }).map((_, k) => (
              <div key={k} className="flex items-center gap-3 p-2.5 rounded-xl bg-[#E6D8C3]/60 border border-[#C2A68C]">
                <div className="w-9 h-9 rounded-lg bg-[#C2A68C] animate-pulse shrink-0" />
                <div className="space-y-1.5 flex-1">
                  <div className="h-3.5 w-24 bg-[#C2A68C] rounded animate-pulse" />
                  <div className="h-2.5 w-32 bg-[#C2A68C]/60 rounded animate-pulse" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export const QuestSkeleton: React.FC = () => {
  return (
    <div className="space-y-6 animate-fadeIn" id="quest-skeleton">
      {/* Filter and Tab Bar Skeleton */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl bg-white border border-[#C2A68C] shadow-sm">
        <div className="flex items-center gap-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-8 w-20 rounded-lg bg-[#C2A68C] animate-pulse" />
          ))}
        </div>
        <div className="h-9 w-64 rounded-xl bg-[#C2A68C]/60 animate-pulse" />
      </div>

      {/* Grid of Quest Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {Array.from({ length: 6 }).map((_, idx) => (
          <div
            key={idx}
            className="rounded-2xl p-5 bg-white border border-[#C2A68C] space-y-4 shadow-sm"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="h-5 w-20 bg-[#C2A68C] rounded-full animate-pulse" />
                <div className="h-5 w-16 bg-[#C2A68C] rounded-md animate-pulse" />
              </div>
              <div className="w-6 h-6 bg-[#C2A68C] rounded-lg animate-pulse" />
            </div>
            <div className="h-5 w-4/5 bg-[#C2A68C] rounded animate-pulse" />
            <div className="h-3.5 w-full bg-[#C2A68C]/60 rounded animate-pulse" />
            <div className="flex items-center justify-between pt-3 border-t border-[#C2A68C]/60">
              <div className="h-4 w-20 bg-[#C2A68C] rounded animate-pulse" />
              <div className="h-8 w-24 bg-[#C2A68C] rounded-xl animate-pulse" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export const CharacterSkeleton: React.FC = () => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 animate-fadeIn" id="character-skeleton">
      {/* Left Column: Avatar & Class Card */}
      <div className="lg:col-span-5 space-y-6">
        <div className="rounded-3xl p-6 sm:p-8 bg-white border border-[#C2A68C] space-y-6 shadow-sm text-center">
          <div className="w-32 h-32 mx-auto rounded-3xl bg-[#C2A68C] animate-pulse border-2 border-[#C2A68C]" />
          <div className="space-y-2">
            <div className="h-6 w-36 mx-auto bg-[#C2A68C] rounded-lg animate-pulse" />
            <div className="h-4 w-24 mx-auto bg-[#C2A68C]/60 rounded animate-pulse" />
          </div>
          <div className="h-4 w-full bg-[#C2A68C]/70 rounded-full animate-pulse" />
          <div className="grid grid-cols-2 gap-3 pt-4 border-t border-[#C2A68C]">
            <div className="h-16 rounded-xl bg-[#E6D8C3] border border-[#C2A68C] animate-pulse" />
            <div className="h-16 rounded-xl bg-[#E6D8C3] border border-[#C2A68C] animate-pulse" />
          </div>
        </div>
      </div>

      {/* Right Column: 6 Attributes Sheet */}
      <div className="lg:col-span-7 space-y-4">
        <div className="h-6 w-44 bg-[#C2A68C] rounded-lg animate-pulse" />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {Array.from({ length: 6 }).map((_, idx) => (
            <div
              key={idx}
              className="p-5 rounded-2xl bg-white border border-[#C2A68C] space-y-3 shadow-sm"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-[#C2A68C] animate-pulse" />
                  <div className="h-4 w-24 bg-[#C2A68C] rounded animate-pulse" />
                </div>
                <div className="h-5 w-8 bg-[#C2A68C] rounded animate-pulse" />
              </div>
              <div className="h-2 w-full bg-[#C2A68C]/60 rounded-full animate-pulse" />
              <div className="h-3 w-3/4 bg-[#C2A68C]/40 rounded animate-pulse" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export const ShopSkeleton: React.FC = () => {
  return (
    <div className="space-y-8 animate-fadeIn" id="shop-skeleton">
      {/* Shop Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#C2A68C]">
        <div className="space-y-2">
          <div className="h-4 w-28 bg-[#C2A68C] rounded animate-pulse" />
          <div className="h-8 w-48 bg-[#C2A68C] rounded-lg animate-pulse" />
        </div>
        <div className="h-10 w-36 bg-[#C2A68C] rounded-xl animate-pulse" />
      </div>

      {/* Category Tabs */}
      <div className="flex items-center gap-2">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="h-9 w-20 rounded-xl bg-[#C2A68C] animate-pulse" />
        ))}
      </div>

      {/* Item Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
        {Array.from({ length: 8 }).map((_, idx) => (
          <div
            key={idx}
            className="rounded-2xl p-5 bg-white border border-[#C2A68C] space-y-3 shadow-sm"
          >
            <div className="w-full h-32 rounded-xl bg-[#E6D8C3] border border-[#C2A68C] animate-pulse" />
            <div className="h-4 w-3/4 bg-[#C2A68C] rounded animate-pulse" />
            <div className="h-3 w-1/2 bg-[#C2A68C]/60 rounded animate-pulse" />
            <div className="flex items-center justify-between pt-3 border-t border-[#C2A68C]/60">
              <div className="h-4 w-14 bg-[#C2A68C] rounded animate-pulse" />
              <div className="h-8 w-20 bg-[#C2A68C] rounded-xl animate-pulse" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export const RewardsSkeleton = ShopSkeleton;

export const ProgressSkeleton: React.FC = () => {
  return (
    <div className="space-y-8 animate-fadeIn" id="progress-skeleton">
      <div className="space-y-2">
        <div className="h-4 w-28 bg-[#C2A68C] rounded animate-pulse" />
        <div className="h-8 w-56 bg-[#C2A68C] rounded-lg animate-pulse" />
      </div>

      {/* XP Chart Skeleton */}
      <div className="rounded-3xl p-6 bg-white border border-[#C2A68C] space-y-4 shadow-sm">
        <div className="h-5 w-40 bg-[#C2A68C] rounded animate-pulse" />
        <div className="h-48 w-full bg-[#E6D8C3] rounded-2xl border border-[#C2A68C] animate-pulse" />
      </div>

      {/* Milestones Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="p-5 rounded-2xl bg-white border border-[#C2A68C] space-y-2.5 shadow-sm">
            <div className="h-4 w-20 bg-[#C2A68C] rounded animate-pulse" />
            <div className="h-5 w-32 bg-[#C2A68C] rounded animate-pulse" />
            <div className="h-3 w-full bg-[#C2A68C]/60 rounded animate-pulse" />
          </div>
        ))}
      </div>
    </div>
  );
};

export const AchievementsSkeleton: React.FC = () => {
  return (
    <div className="space-y-8 animate-fadeIn" id="achievements-skeleton">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#C2A68C]">
        <div className="space-y-2">
          <div className="h-4 w-28 bg-[#C2A68C] rounded animate-pulse" />
          <div className="h-8 w-44 bg-[#C2A68C] rounded-lg animate-pulse" />
        </div>
        <div className="h-14 w-56 bg-[#C2A68C] rounded-2xl animate-pulse" />
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="h-8 w-24 rounded-lg bg-[#C2A68C] animate-pulse" />
        ))}
      </div>

      {/* Achievements Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {Array.from({ length: 6 }).map((_, idx) => (
          <div
            key={idx}
            className="rounded-2xl p-5 bg-white border border-[#C2A68C] flex gap-4 shadow-sm"
          >
            <div className="w-12 h-12 rounded-xl bg-[#C2A68C] animate-pulse shrink-0" />
            <div className="space-y-2 flex-1">
              <div className="h-4 w-32 bg-[#C2A68C] rounded animate-pulse" />
              <div className="h-3 w-full bg-[#C2A68C]/60 rounded animate-pulse" />
              <div className="h-4 w-16 bg-[#C2A68C] rounded-full animate-pulse" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export const DiscoverSkeleton: React.FC = () => {
  return (
    <div className="space-y-8 animate-fadeIn" id="discover-skeleton">
      <div className="space-y-2">
        <div className="h-4 w-28 bg-[#C2A68C] rounded animate-pulse" />
        <div className="h-8 w-48 bg-[#C2A68C] rounded-lg animate-pulse" />
      </div>

      {/* Chips */}
      <div className="flex items-center gap-2 flex-wrap">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="h-8 w-24 rounded-xl bg-[#C2A68C] animate-pulse" />
        ))}
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {Array.from({ length: 6 }).map((_, idx) => (
          <div
            key={idx}
            className="rounded-2xl p-5 bg-white border border-[#C2A68C] space-y-4 shadow-sm"
          >
            <div className="flex items-center justify-between">
              <div className="h-5 w-20 bg-[#C2A68C] rounded-full animate-pulse" />
              <div className="h-5 w-16 bg-[#C2A68C] rounded-md animate-pulse" />
            </div>
            <div className="h-5 w-4/5 bg-[#C2A68C] rounded animate-pulse" />
            <div className="h-3.5 w-full bg-[#C2A68C]/60 rounded animate-pulse" />
            <div className="flex items-center justify-between pt-3 border-t border-[#C2A68C]/60">
              <div className="h-4 w-24 bg-[#C2A68C] rounded animate-pulse" />
              <div className="h-8 w-24 bg-[#C2A68C] rounded-xl animate-pulse" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export const LandingSkeleton: React.FC = () => {
  const { isDark } = useTheme();

  return (
    <div className={`min-h-screen transition-colors duration-300 flex flex-col ${
      isDark ? 'bg-[#0A0A0A] text-[#FAFAFA]' : 'bg-[#F5F5F0] text-[#1C1917]'
    }`} id="landing-skeleton">
      {/* Header bar skeleton */}
      <header className={`sticky top-0 z-40 w-full backdrop-blur-xl border-b px-4 sm:px-10 py-3.5 flex items-center justify-between gap-4 ${
        isDark ? 'bg-[#0A0A0A]/90 border-[#F87171]/20' : 'bg-[#F5F5F0]/90 border-[#C2A68C]'
      }`}>
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-xl animate-pulse ${isDark ? 'bg-[#1E1214] border border-[#F87171]/30' : 'bg-[#C2A68C]'}`} />
          <div className={`h-6 w-24 rounded-lg animate-pulse ${isDark ? 'bg-zinc-800' : 'bg-[#C2A68C]'}`} />
        </div>
        <div className="hidden md:flex items-center gap-4">
          <div className={`h-9 w-64 rounded-full animate-pulse ${isDark ? 'bg-zinc-800' : 'bg-[#E6D8C3]'}`} />
        </div>
        <div className="flex items-center gap-3">
          <div className={`w-9 h-9 rounded-xl animate-pulse ${isDark ? 'bg-zinc-800' : 'bg-[#C2A68C]'}`} />
          <div className={`h-9 w-28 rounded-full animate-pulse ${isDark ? 'bg-[#F87171]/40' : 'bg-[#5D866C]/40'}`} />
        </div>
      </header>

      {/* Hero Section Skeleton */}
      <section className="relative pt-16 sm:pt-24 pb-20 px-6 sm:px-12 max-w-7xl mx-auto w-full flex flex-col items-center text-center">
        {/* Hero badge pill */}
        <div className={`h-7 w-60 rounded-full animate-pulse mb-6 ${isDark ? 'bg-zinc-800' : 'bg-[#C2A68C]'}`} />

        {/* Hero title */}
        <div className="space-y-3 max-w-2xl w-full flex flex-col items-center mb-6">
          <div className={`h-12 sm:h-16 w-3/4 rounded-2xl animate-pulse ${isDark ? 'bg-zinc-800' : 'bg-[#C2A68C]'}`} />
          <div className={`h-12 sm:h-16 w-1/2 rounded-2xl animate-pulse ${isDark ? 'bg-zinc-800/80' : 'bg-[#C2A68C]/80'}`} />
        </div>

        {/* Subtitle */}
        <div className="space-y-2 max-w-xl w-full flex flex-col items-center mb-10">
          <div className={`h-4 w-4/5 rounded animate-pulse ${isDark ? 'bg-zinc-800' : 'bg-[#C2A68C]/60'}`} />
          <div className={`h-3.5 w-3/5 rounded animate-pulse ${isDark ? 'bg-zinc-800/60' : 'bg-[#C2A68C]/50'}`} />
        </div>

        {/* Hero CTA buttons */}
        <div className="flex flex-col sm:flex-row items-center gap-4 mb-16">
          <div className={`h-12 w-44 rounded-2xl animate-pulse ${isDark ? 'bg-[#F87171]/40' : 'bg-[#5D866C]/40'}`} />
          <div className={`h-12 w-36 rounded-2xl animate-pulse ${isDark ? 'bg-zinc-800' : 'bg-[#C2A68C]'}`} />
        </div>

        {/* Progression loop card */}
        <div className={`w-full max-w-4xl p-6 rounded-3xl border mb-16 shadow-lg ${
          isDark ? 'bg-[#141414] border-[#F87171]/20' : 'bg-white border-[#C2A68C]'
        }`}>
          <div className={`h-4 w-48 rounded animate-pulse mb-6 ${isDark ? 'bg-zinc-800' : 'bg-[#C2A68C]'}`} />
          <div className="grid grid-cols-1 sm:grid-cols-5 gap-3">
            {Array.from({ length: 5 }).map((_, idx) => (
              <div key={idx} className={`p-4 rounded-2xl border flex flex-col items-center space-y-2.5 ${
                isDark ? 'bg-[#1A1315] border-[#F87171]/25' : 'bg-[#F5F5F0] border-[#C2A68C]'
              }`}>
                <div className={`w-10 h-10 rounded-xl animate-pulse ${isDark ? 'bg-zinc-800' : 'bg-[#C2A68C]'}`} />
                <div className={`h-3 w-14 rounded animate-pulse ${isDark ? 'bg-zinc-800' : 'bg-[#C2A68C]'}`} />
                <div className={`h-2.5 w-20 rounded animate-pulse ${isDark ? 'bg-zinc-800/60' : 'bg-[#C2A68C]/60'}`} />
              </div>
            ))}
          </div>
        </div>

        {/* Feature cards grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
          {Array.from({ length: 6 }).map((_, idx) => (
            <div key={idx} className={`p-6 rounded-2xl border space-y-3 ${
              isDark ? 'bg-[#141414] border-[#F87171]/20' : 'bg-white border-[#C2A68C]'
            }`}>
              <div className={`w-8 h-8 rounded-lg animate-pulse ${isDark ? 'bg-zinc-800' : 'bg-[#C2A68C]'}`} />
              <div className={`h-4 w-2/3 rounded animate-pulse ${isDark ? 'bg-zinc-800' : 'bg-[#C2A68C]'}`} />
              <div className={`h-3 w-full rounded animate-pulse ${isDark ? 'bg-zinc-800/60' : 'bg-[#C2A68C]/60'}`} />
              <div className={`h-3 w-4/5 rounded animate-pulse ${isDark ? 'bg-zinc-800/60' : 'bg-[#C2A68C]/60'}`} />
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export const HomeSkeleton = LandingSkeleton;
