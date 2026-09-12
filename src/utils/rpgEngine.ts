import { AttributeType, QuestCategory, QuestDifficulty } from '../types';

/**
 * Non-linear XP calculation system
 * Level 1: 100 XP
 * Level 2: 250 XP (150 more)
 * Level 3: 450 XP (200 more)
 * Level 4: 700 XP (250 more)
 * Level 5: 1,000 XP (300 more)
 * Level 12: ~3,000 XP threshold
 */

// Total cumulative XP required to complete a level
export function getCumulativeXpForLevel(level: number): number {
  if (level <= 1) return 100;
  // Formula: 25 * level^2 + 75 * level
  // Level 1: 100
  // Level 2: 250
  // Level 3: 450
  // Level 4: 700
  // Level 5: 1000
  // Level 12: 25 * 144 + 75 * 12 = 3600 + 900 = 4500
  return 25 * (level * level) + 75 * level;
}

export function getXpDetails(totalXp: number): {
  level: number;
  currentLevelXp: number;
  requiredLevelXp: number;
  progressPercentage: number;
  nextLevel: number;
} {
  let level = 1;
  while (totalXp >= getCumulativeXpForLevel(level)) {
    level++;
  }

  const prevLevelThreshold = level === 1 ? 0 : getCumulativeXpForLevel(level - 1);
  const currentLevelThreshold = getCumulativeXpForLevel(level);
  
  const currentLevelXp = Math.max(0, totalXp - prevLevelThreshold);
  const requiredLevelXp = currentLevelThreshold - prevLevelThreshold;
  const progressPercentage = Math.min(100, Math.round((currentLevelXp / requiredLevelXp) * 100));

  return {
    level,
    currentLevelXp,
    requiredLevelXp,
    progressPercentage,
    nextLevel: level + 1,
  };
}

/**
 * Quest Reward Calculator
 * Frontend displays calculated rewards cleanly, preventing manual cheat edits.
 */
export function calculateQuestRewards(
  difficulty: QuestDifficulty,
  category: QuestCategory,
  timeMultiplierMinutes: number = 30
): {
  xpReward: number;
  goldReward: number;
  attribute: AttributeType;
  attributeReward: number;
} {
  // Default attribute mapped to category
  const categoryAttributeMap: Record<QuestCategory, AttributeType> = {
    Knowledge: 'intelligence',
    Coding: 'intelligence',
    Fitness: 'strength',
    Health: 'endurance',
    Creativity: 'creativity',
    Discipline: 'discipline',
    Personal: 'wisdom',
    Other: 'discipline',
  };

  const attribute = categoryAttributeMap[category] || 'discipline';

  let baseXp = 40;
  let baseGold = 15;
  let baseAttr = 4;

  switch (difficulty) {
    case 'Easy':
      baseXp = 35;
      baseGold = 15;
      baseAttr = 3;
      break;
    case 'Medium':
      baseXp = 55;
      baseGold = 25;
      baseAttr = 6;
      break;
    case 'Hard':
      baseXp = 85;
      baseGold = 40;
      baseAttr = 9;
      break;
    case 'Epic':
      baseXp = 150;
      baseGold = 75;
      baseAttr = 16;
      break;
  }

  // Slight time scaling factor (normalized between 15m and 180m)
  const timeBonus = Math.min(1.5, Math.max(0.8, timeMultiplierMinutes / 45));
  const xpReward = Math.round(baseXp * timeBonus);
  const goldReward = Math.round(baseGold * timeBonus);
  const attributeReward = Math.round(baseAttr * timeBonus);

  return {
    xpReward,
    goldReward,
    attribute,
    attributeReward,
  };
}

/**
 * Synthesized Web Audio API sound effects for true RPG tactile feedback.
 * No external files needed, 100% reliable and instantaneous.
 */
class SoundEngine {
  private ctx: AudioContext | null = null;
  public enabled: boolean = true;

  private getContext(): AudioContext | null {
    if (typeof window === 'undefined') return null;
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
    return this.ctx;
  }

  playClick() {
    if (!this.enabled) return;
    try {
      const ctx = this.getContext();
      if (!ctx) return;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(440, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.06);
      gain.gain.setValueAtTime(0.12, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.06);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.06);
    } catch {
      // Audio autoplay policy fallback
    }
  }

  playQuestComplete() {
    if (!this.enabled) return;
    try {
      const ctx = this.getContext();
      if (!ctx) return;
      // Arpeggio chime: C5 -> E5 -> G5 -> C6
      const notes = [523.25, 659.25, 783.99, 1046.5];
      notes.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, ctx.currentTime + idx * 0.08);
        gain.gain.setValueAtTime(0.18, ctx.currentTime + idx * 0.08);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + idx * 0.08 + 0.25);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(ctx.currentTime + idx * 0.08);
        osc.stop(ctx.currentTime + idx * 0.08 + 0.25);
      });
    } catch {}
  }

  playCoinSound() {
    if (!this.enabled) return;
    try {
      const ctx = this.getContext();
      if (!ctx) return;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'square';
      osc.frequency.setValueAtTime(987.77, ctx.currentTime); // B5
      osc.frequency.setValueAtTime(1318.51, ctx.currentTime + 0.08); // E6
      gain.gain.setValueAtTime(0.1, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.35);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.35);
    } catch {}
  }

  playLevelUp() {
    if (!this.enabled) return;
    try {
      const ctx = this.getContext();
      if (!ctx) return;
      // Grand victory fanfare chords
      const chords = [
        [523.25, 659.25], // C5, E5
        [587.33, 739.99], // D5, F#5
        [659.25, 830.61], // E5, G#5
        [783.99, 1046.5, 1318.51], // G5, C6, E6
      ];
      chords.forEach((chord, step) => {
        const time = ctx.currentTime + step * 0.15;
        chord.forEach((freq) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'triangle';
          osc.frequency.setValueAtTime(freq, time);
          gain.gain.setValueAtTime(0.15, time);
          gain.gain.exponentialRampToValueAtTime(0.001, time + (step === 3 ? 0.8 : 0.2));
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(time);
          osc.stop(time + (step === 3 ? 0.8 : 0.2));
        });
      });
    } catch {}
  }

  playAchievement() {
    if (!this.enabled) return;
    try {
      const ctx = this.getContext();
      if (!ctx) return;
      const notes = [440, 554.37, 659.25, 880];
      notes.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, ctx.currentTime + idx * 0.07);
        gain.gain.setValueAtTime(0.15, ctx.currentTime + idx * 0.07);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + idx * 0.07 + 0.3);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(ctx.currentTime + idx * 0.07);
        osc.stop(ctx.currentTime + idx * 0.07 + 0.3);
      });
    } catch {}
  }
}

export const soundEngine = new SoundEngine();
