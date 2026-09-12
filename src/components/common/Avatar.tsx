import React, { useState } from 'react';
import { LevelBadge } from './LevelBadge';
import { User as UserIcon } from 'lucide-react';

interface AvatarProps {
  src?: string | null;
  name?: string;
  level?: number;
  heroClass?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  className?: string;
}

// Check if image URL is one of the old default stock photos
export const isLegacyStockPhoto = (url?: string | null): boolean => {
  if (!url) return false;
  return (
    url.includes('photo-1566492031773') ||
    url.includes('photo-1534528741775') ||
    url.includes('photo-1507003211169') ||
    url.includes('photo-1517841905240') ||
    url.includes('images.unsplash.com')
  );
};

export const Avatar: React.FC<AvatarProps> = ({
  src,
  name = 'Hero',
  level,
  heroClass,
  size = 'md',
  className = '',
}) => {
  const [imgError, setImgError] = useState(false);

  const sizeClasses = {
    xs: 'w-7 h-7',
    sm: 'w-9 h-9',
    md: 'w-12 h-12',
    lg: 'w-16 h-16',
    xl: 'w-24 h-24 sm:w-28 sm:h-28',
    '2xl': 'w-32 h-32 sm:w-36 sm:h-36',
  };

  const iconSizes = {
    xs: 'w-3.5 h-3.5',
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
    xl: 'w-12 h-12',
    '2xl': 'w-16 h-16',
  };

  const textSizeClasses = {
    xs: 'text-[10px]',
    sm: 'text-xs',
    md: 'text-base font-bold',
    lg: 'text-xl font-black',
    xl: 'text-3xl font-black',
    '2xl': 'text-4xl font-black',
  };

  const borderStyles: Record<string, string> = {
    Warrior: 'border-rose-500/50 shadow-rose-950/40',
    Scholar: 'border-purple-500/50 shadow-purple-950/40',
    Creator: 'border-cyan-500/50 shadow-cyan-950/40',
    Explorer: 'border-amber-500/50 shadow-amber-950/40',
  };

  const selectedBorder =
    heroClass && borderStyles[heroClass]
      ? borderStyles[heroClass]
      : 'border-[#C2A68C] dark:border-[#F87171]/40 shadow-sm';

  // Extract initials if available
  const initials = name
    ?.trim()
    ? name
        .trim()
        .split(' ')
        .filter(Boolean)
        .map((n) => n[0])
        .join('')
        .slice(0, 2)
        .toUpperCase()
    : '';

  // Clean empty or legacy stock photo
  const cleanSrc = src && !isLegacyStockPhoto(src) ? src : null;
  const showFallback = imgError || !cleanSrc;

  return (
    <div className={`relative inline-block select-none shrink-0 ${className}`}>
      {/* Outer RPG glowing frame */}
      <div
        className={`rounded-2xl sm:rounded-3xl overflow-hidden border-2 transition-all ${selectedBorder} ${sizeClasses[size]} flex items-center justify-center bg-[#E6D8C3] dark:bg-[#1A1A1A] text-[#1C1917] dark:text-zinc-200 shadow-inner`}
      >
        {showFallback ? (
          initials ? (
            <span
              className={`font-black tracking-wider uppercase bg-gradient-to-br from-[#5D866C] to-[#2D4638] dark:from-[#F87171] dark:to-[#EF4444] bg-clip-text text-transparent ${textSizeClasses[size]}`}
            >
              {initials}
            </span>
          ) : (
            <UserIcon className={`${iconSizes[size]} text-[#78716C] dark:text-zinc-500`} />
          )
        ) : (
          <img
            src={cleanSrc}
            alt={name}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover"
            onError={() => setImgError(true)}
          />
        )}
      </div>

      {/* Level overlay badge */}
      {level !== undefined && (
        <div className="absolute -bottom-1.5 -right-1.5 z-10">
          <LevelBadge level={level} size={size === 'xl' || size === '2xl' ? 'md' : 'sm'} />
        </div>
      )}
    </div>
  );
};
