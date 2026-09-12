import { RewardItem } from '../types';

export const DEFAULT_REWARDS: RewardItem[] = [
  { id:'rew_000_a', name:'Novice Adventurer Charm', description:'A lucky gilded medallion. +2 Wisdom.', price:20, category:'Badges', icon:'Sparkles', rarity:'Common', owned:false, statBonus:{attribute:'wisdom',amount:2} },
  { id:'rew_000_b', name:'Initiate Training Dagger', description:'Sharp balanced blade for beginner warriors. +3 Strength.', price:35, category:'Gear', icon:'Sword', rarity:'Common', owned:false, equipped:false, statBonus:{attribute:'strength',amount:3} },
  { id:'rew_000_c', name:'Focus Silk Bandana', description:'Keeps hair and distractions away. +3 Discipline.', price:50, category:'Gear', icon:'Zap', rarity:'Common', owned:false, equipped:false, statBonus:{attribute:'discipline',amount:3} },
  { id:'rew_000_d', name:'Pocket Ember Familiar', description:'A warm spectral wisp that keeps you company on quests.', price:75, category:'Pets', icon:'Cat', rarity:'Rare', owned:false, equipped:false },
  { id:'rew_001', name:'Shadow Blade of Focus', description:'Slices through procrastination. +5 Strength.', price:500, category:'Gear', icon:'Sword', rarity:'Epic', owned:false, equipped:false, statBonus:{attribute:'strength',amount:5} },
  { id:'rew_002', name:'Cyber Theme HUD', description:'Futuristic neon UI theme.', price:300, category:'Themes', icon:'Palette', rarity:'Rare', owned:false },
  { id:'rew_003', name:'Dragon Crest of Valor', description:'Legendary title crest.', price:750, category:'Badges', icon:'ShieldCheck', rarity:'Legendary', owned:false },
  { id:'rew_004', name:'Cyber Gryphon Companion', description:'Ethereal familiar companion.', price:1000, category:'Pets', icon:'Sparkles', rarity:'Legendary', owned:false },
  { id:'rew_005', name:'Boots of Prompt Execution', description:'+4 Discipline bonus.', price:450, category:'Gear', icon:'Zap', rarity:'Rare', owned:false, equipped:false, statBonus:{attribute:'discipline',amount:4} },
  { id:'rew_006', name:'Solar Flare Theme', description:'Warm gold solar theme.', price:350, category:'Themes', icon:'Sun', rarity:'Rare', owned:false },
  { id:'rew_007', name:'Ring of Deep Contemplation', description:'+6 Intelligence.', price:600, category:'Gear', icon:'Compass', rarity:'Epic', owned:false, equipped:false, statBonus:{attribute:'intelligence',amount:6} },
  { id:'rew_008', name:'Rune-Woven Scholar Cloak', description:'+8 Wisdom aesthetic.', price:850, category:'Gear', icon:'Shield', rarity:'Epic', owned:false, equipped:false },
  // ─── Purchasable Achievements ──────────────────────────────────────────────
  { id:'ach_rew_001', name:'Trailblazer Title', description:'Unlock the exclusive "TRAILBLAZER" hero title. Display it proudly on your character sheet.', price:150, category:'Achievements', icon:'Trophy', rarity:'Common', owned:false },
  { id:'ach_rew_002', name:'Arcane Scholar Badge', description:'A shimmering badge marking you as a keeper of arcane knowledge. +4 Intelligence.', price:300, category:'Achievements', icon:'Sparkles', rarity:'Rare', owned:false, statBonus:{attribute:'intelligence',amount:4} },
  { id:'ach_rew_003', name:'Streak Sentinel Medal', description:'Awarded to those who never break the chain. Grants the "SENTINEL" title + +3 Discipline.', price:500, category:'Achievements', icon:'Flame', rarity:'Rare', owned:false, statBonus:{attribute:'discipline',amount:3} },
  { id:'ach_rew_004', name:'Vanguard of Discipline', description:'A legendary commendation for heroes with unbreakable resolve. +5 Discipline.', price:750, category:'Achievements', icon:'Shield', rarity:'Epic', owned:false, statBonus:{attribute:'discipline',amount:5} },
  { id:'ach_rew_005', name:'GRANDMASTER Crest', description:'The highest honor in the realm. An ornate crest reserved for the most elite adventurers. +6 Wisdom + +6 Intelligence.', price:1500, category:'Achievements', icon:'Award', rarity:'Legendary', owned:false, statBonus:{attribute:'wisdom',amount:6} },
  { id:'ach_rew_006', name:'Endurance Champion Trophy', description:'Celebrate your physical and mental fortitude. A gleaming trophy with +5 Endurance bonus.', price:600, category:'Achievements', icon:'Zap', rarity:'Epic', owned:false, statBonus:{attribute:'endurance',amount:5} },
  { id:'ach_rew_007', name:'Creative Visionary Seal', description:'For those who forge new paths. A golden seal granting +4 Creativity.', price:400, category:'Achievements', icon:'Scroll', rarity:'Rare', owned:false, statBonus:{attribute:'creativity',amount:4} },
];
