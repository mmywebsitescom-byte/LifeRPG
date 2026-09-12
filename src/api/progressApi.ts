import { HistoryRecord, ProgressSummary } from '../types';
import { dbStore } from './store';
import { fetchJson } from './client';

export const progressApi = {
  async getProgressSummary(): Promise<ProgressSummary> {
    try {
      const data = await fetchJson<ProgressSummary>('/api/progress/summary');
      dbStore.progress = data;
      return data;
    } catch {
      await dbStore.delay(100);
      return {
        currentLevel: dbStore.character.level,
        totalXp: dbStore.character.xp,
        totalQuestsCompleted: dbStore.progress.totalQuestsCompleted,
        currentStreak: dbStore.character.streak,
        longestStreak: dbStore.character.longestStreak,
        totalGoldEarned: dbStore.progress.totalGoldEarned,
        chartData: [...dbStore.progress.chartData],
        timeline: [...dbStore.progress.timeline],
      };
    }
  },

  async getHistory(filter?: 'today' | 'week' | 'month' | 'all'): Promise<HistoryRecord[]> {
    try {
      const url = filter ? `/api/history?filter=${filter}` : '/api/history';
      const data = await fetchJson<HistoryRecord[]>(url);
      dbStore.history = data;
      return data;
    } catch {
      await dbStore.delay(100);
      const records = [...dbStore.history];
      if (!filter || filter === 'all') return records;
      if (filter === 'today') {
        return records.filter((r) => r.timestamp.toLowerCase().includes('today') || r.timestamp.toLowerCase().includes('just now'));
      }
      if (filter === 'week') {
        return records.slice(0, 15);
      }
      return records;
    }
  },
};
