import {
  User,
  Character,
  Quest,
  Achievement,
  RewardItem,
  HistoryRecord,
  ProgressSummary
} from '../types';

export const AUTH_SESSION_KEY = 'liferpg_user_session';

function loadStoredUser(): User | null {
  try {
    const raw = localStorage.getItem(AUTH_SESSION_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (parsed && typeof parsed === 'object' && parsed.email) {
      return parsed as User;
    }
    return null;
  } catch {
    return null;
  }
}

class InMemoryStore {
  public user: User | null = loadStoredUser();
  public character: Character | null = null;
  public quests: Quest[] = [];
  public achievements: Achievement[] = [];
  public rewards: RewardItem[] = [];
  public history: HistoryRecord[] = [];
  public progress: ProgressSummary | null = null;

  reset(): void {
    this.user = null;
    this.character = null;
    this.quests = [];
    this.achievements = [];
    this.rewards = [];
    this.history = [];
    this.progress = null;
    try {
      localStorage.removeItem(AUTH_SESSION_KEY);
      localStorage.removeItem('liferpg_cached_character');
      localStorage.removeItem('liferpg_cached_quests');
    } catch {}
  }

  async delay(ms: number = 200): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}

export const dbStore = new InMemoryStore();
