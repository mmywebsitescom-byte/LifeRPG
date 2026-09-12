import { QuestCategory, QuestDifficulty, AttributeType } from './types';

export interface GeneratedQuestSuggestion {
  title: string;
  description: string;
  category: QuestCategory;
  difficulty: QuestDifficulty;
  estimatedTime: string;
  xpReward: number;
  goldReward: number;
  attribute: AttributeType;
  attributeReward: number;
}

const categoryAttrMap: Record<QuestCategory, AttributeType> = {
  Knowledge: 'intelligence',
  Coding: 'intelligence',
  Fitness: 'strength',
  Health: 'endurance',
  Creativity: 'creativity',
  Discipline: 'discipline',
  Personal: 'wisdom',
  Other: 'discipline',
};

const rewardTable: Record<QuestDifficulty, { xp: number; gold: number; attr: number }> = {
  Easy: { xp: 30, gold: 12, attr: 3 },
  Medium: { xp: 55, gold: 22, attr: 6 },
  Hard: { xp: 85, gold: 38, attr: 9 },
  Epic: { xp: 130, gold: 60, attr: 14 },
};

export async function generateQuestsWithGemini(prompt: string, category?: QuestCategory, difficulty?: QuestDifficulty): Promise<GeneratedQuestSuggestion[]> {
  const apiKey = process.env.GEMINI_API_KEY;

  if (apiKey && apiKey !== 'MY_GEMINI_API_KEY' && apiKey.trim().length > 10) {
    try {
      // Dynamic import to support various environments
      const { GoogleGenAI } = await import('@google/genai');
      const ai = new GoogleGenAI({ apiKey });

      const systemPrompt = `You are the Grand Oracle for LIFE RPG, a real-life gamification platform that turns real-life tasks, study sessions, workouts, coding projects, and habits into heroic quests.
Given the user's focus or goal, generate 3 to 4 balanced, engaging RPG quests.
Respond with ONLY a valid JSON array of objects with the following schema for each quest:
[
  {
    "title": "Short punchy RPG quest name (e.g. Master the Binary Citadel)",
    "description": "Clear actionable description of the real-world task with RPG flavor",
    "category": "Knowledge" | "Coding" | "Fitness" | "Health" | "Creativity" | "Discipline" | "Personal" | "Other",
    "difficulty": "Easy" | "Medium" | "Hard" | "Epic",
    "estimatedTime": "e.g. 25m, 45m, 1h, 2h",
    "xpReward": number (between 25 and 150),
    "goldReward": number (between 10 and 60),
    "attribute": "strength" | "intelligence" | "wisdom" | "discipline" | "endurance" | "creativity",
    "attributeReward": number (between 2 and 15)
  }
]
Do not wrap in markdown or backticks, just raw JSON.`;

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: `${systemPrompt}\n\nUser Request: ${prompt} ${category ? `Preferred category: ${category}.` : ''} ${difficulty ? `Preferred difficulty: ${difficulty}.` : ''}`,
      });

      const text = response.text || '';
      const cleanJson = text.replace(/```json/g, '').replace(/```/g, '').trim();
      const parsed = JSON.parse(cleanJson);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed.map((item) => ({
          title: item.title || 'Heroic Endeavor',
          description: item.description || 'Step forward and prove your fortitude.',
          category: (item.category || category || 'Knowledge') as QuestCategory,
          difficulty: (item.difficulty || difficulty || 'Medium') as QuestDifficulty,
          estimatedTime: item.estimatedTime || '45m',
          xpReward: Number(item.xpReward) || 50,
          goldReward: Number(item.goldReward) || 20,
          attribute: (item.attribute || categoryAttrMap[item.category as QuestCategory] || 'discipline') as AttributeType,
          attributeReward: Number(item.attributeReward) || 5,
        }));
      }
    } catch (err) {
      console.warn('Gemini API call failed or timed out, falling back to procedural generator:', err);
    }
  }

  // Smart Procedural Quest Generator Fallback
  return generateProceduralQuests(prompt, category, difficulty);
}

export function generateProceduralQuests(query: string, preferredCat?: QuestCategory, preferredDiff?: QuestDifficulty): GeneratedQuestSuggestion[] {
  const cat: QuestCategory = preferredCat || (
    query.toLowerCase().includes('run') || query.toLowerCase().includes('gym') || query.toLowerCase().includes('workout') ? 'Fitness' :
    query.toLowerCase().includes('code') || query.toLowerCase().includes('bug') || query.toLowerCase().includes('react') || query.toLowerCase().includes('api') ? 'Coding' :
    query.toLowerCase().includes('read') || query.toLowerCase().includes('study') || query.toLowerCase().includes('book') ? 'Knowledge' :
    query.toLowerCase().includes('water') || query.toLowerCase().includes('sleep') || query.toLowerCase().includes('meditat') ? 'Health' :
    query.toLowerCase().includes('art') || query.toLowerCase().includes('draw') || query.toLowerCase().includes('design') ? 'Creativity' :
    'Discipline'
  );

  const diff: QuestDifficulty = preferredDiff || 'Medium';
  const rewards = rewardTable[diff];
  const attr = categoryAttrMap[cat];

  const suggestions: GeneratedQuestSuggestion[] = [
    {
      title: query.trim() ? `Forge Ahead: ${query.trim()}` : `Master the Craft of ${cat}`,
      description: query.trim() 
        ? `Dedicate an uninterrupted block to conquer: "${query.trim()}". Eliminate notifications and log your victory.`
        : `Engage in a deliberate practice sprint to elevate your ${attr} mastery.`,
      category: cat,
      difficulty: diff,
      estimatedTime: diff === 'Easy' ? '20m' : diff === 'Medium' ? '45m' : diff === 'Hard' ? '1h 30m' : '2h 30m',
      xpReward: rewards.xp,
      goldReward: rewards.gold,
      attribute: attr,
      attributeReward: rewards.attr,
    },
    {
      title: `${cat} Citadel Trial: Focused Execution`,
      description: `Complete a 35-minute Pomodoro protocol targeting high-impact deliverables without cognitive drift.`,
      category: cat,
      difficulty: 'Medium',
      estimatedTime: '35m',
      xpReward: 50,
      goldReward: 20,
      attribute: attr,
      attributeReward: 5,
    },
    {
      title: `Heroic Habit: Daily Ritual of ${cat}`,
      description: `Review your core daily discipline, eliminate friction points, and solidify your streak progression.`,
      category: 'Discipline',
      difficulty: 'Easy',
      estimatedTime: '15m',
      xpReward: 30,
      goldReward: 12,
      attribute: 'discipline',
      attributeReward: 3,
    },
  ];

  return suggestions;
}
