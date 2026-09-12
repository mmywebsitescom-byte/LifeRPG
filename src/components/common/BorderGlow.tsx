import React, { useRef, useCallback, useEffect, useState, type ReactNode } from 'react';
import { useTheme } from '../../context/ThemeContext';
import './BorderGlow.css';

export interface BorderGlowProps {
  children?: ReactNode;
  className?: string;
  edgeSensitivity?: number;
  glowColor?: string; // HSL string, e.g. "0 85 65" for light red, "138 25 45" for sage
  backgroundColor?: string;
  borderRadius?: number;
  glowRadius?: number;
  glowIntensity?: number;
  coneSpread?: number;
  animated?: boolean;
  colors?: string[];
  fillOpacity?: number;
  alwaysGlow?: boolean;
}

function parseHSL(hslStr: string): { h: number; s: number; l: number } {
  const match = hslStr.match(/([\d.]+)\s*([\d.]+)%?\s*([\d.]+)%?/);
  if (!match) return { h: 0, s: 85, l: 65 };
  return { h: parseFloat(match[1]), s: parseFloat(match[2]), l: parseFloat(match[3]) };
}

function buildGlowVars(glowColor: string, intensity: number): Record<string, string> {
  const { h, s, l } = parseHSL(glowColor);
  const base = `${h}deg ${s}% ${l}%`;
  const opacities = [100, 80, 60, 50, 40, 30, 20, 10];
  const keys = ['', '-80', '-60', '-50', '-40', '-30', '-20', '-10'];
  const vars: Record<string, string> = {};
  for (let i = 0; i < opacities.length; i++) {
    vars[`--glow-color${keys[i]}`] = `hsl(${base} / ${Math.min(opacities[i] * intensity, 100)}%)`;
  }
  return vars;
}

const BorderGlow: React.FC<BorderGlowProps> = ({
  children,
  className = '',
  edgeSensitivity = 30,
  glowColor,
  backgroundColor,
  borderRadius = 24,
  glowRadius = 180,
  glowIntensity = 1.3,
  coneSpread = 35,
  animated = false,
  colors,
  fillOpacity = 1.0,
}) => {
  const { isDark } = useTheme();
  const cardRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  // Dynamic theme colors: Dark mode = Black & Light Red (#F87171), Light mode = Warm & Sage (#5D866C)
  const activeGlowColor = glowColor ?? (isDark ? '0 88 66' : '138 25 45');
  const activeBgColor = backgroundColor ?? (isDark ? '#141414' : '#FFFFFF');
  const activeBorderBase = isDark ? 'rgba(248, 113, 113, 0.15)' : 'rgba(194, 166, 140, 0.45)';

  const getCenterOfElement = useCallback((el: HTMLElement) => {
    const { width, height } = el.getBoundingClientRect();
    return [width / 2, height / 2];
  }, []);

  const getEdgeProximity = useCallback((el: HTMLElement, x: number, y: number) => {
    const [cx, cy] = getCenterOfElement(el);
    const dx = x - cx;
    const dy = y - cy;
    let kx = Infinity;
    let ky = Infinity;
    if (dx !== 0) kx = cx / Math.abs(dx);
    if (dy !== 0) ky = cy / Math.abs(dy);
    const raw = Math.min(Math.max(1 / Math.min(kx, ky), 0), 1);
    // Smooth curve so edge illuminates with high clarity as cursor approaches or traverses
    return Math.max(0.4, Math.pow(raw, 0.6));
  }, [getCenterOfElement]);

  const getCursorAngle = useCallback((el: HTMLElement, x: number, y: number) => {
    const [cx, cy] = getCenterOfElement(el);
    const dx = x - cx;
    const dy = y - cy;
    if (dx === 0 && dy === 0) return 0;
    const radians = Math.atan2(dy, dx);
    let degrees = radians * (180 / Math.PI) + 90;
    if (degrees < 0) degrees += 360;
    return degrees;
  }, [getCenterOfElement]);

  const handlePointerMove = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    const card = cardRef.current;
    if (!card) return;

    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const edge = getEdgeProximity(card, x, y);
    const angle = getCursorAngle(card, x, y);

    card.style.setProperty('--mouse-x', `${x.toFixed(1)}px`);
    card.style.setProperty('--mouse-y', `${y.toFixed(1)}px`);
    card.style.setProperty('--edge-proximity', `${(edge * 100).toFixed(1)}`);
    card.style.setProperty('--cursor-angle', `${angle.toFixed(1)}deg`);
  }, [getEdgeProximity, getCursorAngle]);

  const handlePointerEnter = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    setIsHovered(true);
    handlePointerMove(e);
  }, [handlePointerMove]);

  const handlePointerLeave = useCallback(() => {
    setIsHovered(false);
    const card = cardRef.current;
    if (!card) return;
    card.style.setProperty('--edge-proximity', '0');
  }, []);

  const glowVars = buildGlowVars(activeGlowColor, glowIntensity);

  return (
    <div
      ref={cardRef}
      onPointerEnter={handlePointerEnter}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      className={`border-glow-card ${isDark ? 'border-glow-card--dark' : 'border-glow-card--light'} ${isHovered ? 'is-hovered' : ''} ${className}`}
      style={{
        '--card-bg': activeBgColor,
        '--border-base': activeBorderBase,
        '--edge-sensitivity': edgeSensitivity,
        '--border-radius': `${borderRadius}px`,
        '--glow-radius': `${glowRadius}px`,
        '--cone-spread': coneSpread,
        '--fill-opacity': fillOpacity,
        ...glowVars,
      } as React.CSSProperties}
    >
      {/* Outer ambient glow bloom */}
      <span className="edge-bloom" aria-hidden="true" />
      
      {/* Inner card container holding content */}
      <div className="border-glow-inner">
        {children}
      </div>

      {/* Prominently visible highlighted edge light running along the border */}
      <span className="edge-light" aria-hidden="true" />
    </div>
  );
};

export default BorderGlow;
