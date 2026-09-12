import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import confetti from 'canvas-confetti';
import { 
  User, 
  Character, 
  Quest, 
  Achievement, 
  RewardItem, 
  HistoryRecord, 
  ProgressSummary,
  ToastNotification,
  CompletionAnimationPayload,
  QuestCategory,
  QuestDifficulty,
  QuestRepeat,
  AttributeType
} from '../types';
import { authApi } from '../api/authApi';
import { characterApi } from '../api/characterApi';
import { questApi } from '../api/questApi';
import { rewardApi } from '../api/rewardApi';
import { achievementApi } from '../api/achievementApi';
import { progressApi } from '../api/progressApi';
import { soundEngine } from '../utils/rpgEngine';
import { isLegacyStockPhoto } from '../components/common/Avatar';
import { AUTH_SESSION_KEY, dbStore } from '../api/store';

interface GameContextType {
  user: User | null;
  character: Character | null;
  quests: Quest[];
  achievements: Achievement[];
  rewards: RewardItem[];
  history: HistoryRecord[];
  progress: ProgressSummary | null;
  loading: boolean;
  toasts: ToastNotification[];
  
  // Modals & Celebrations
  activeLevelUpModal: { oldLevel: number; newLevel: number; unlockedReward?: string } | null;
  closeLevelUpModal: () => void;
  activeQuestCompleteReward: CompletionAnimationPayload | null;
  closeQuestCompleteReward: () => void;
  deleteConfirmation: { questId: string; questTitle: string } | null;
  setDeleteConfirmation: (item: { questId: string; questTitle: string } | null) => void;
  purchaseConfirmation: { reward: RewardItem } | null;
  setPurchaseConfirmation: (item: { reward: RewardItem } | null) => void;
  
  // Actions
  addToast: (toast: Omit<ToastNotification, 'id'>) => void;
  removeToast: (id: string) => void;
  completeQuest: (id: string) => Promise<void>;
  createQuest: (data: {
    title: string;
    description: string;
    category: QuestCategory;
    difficulty: QuestDifficulty;
    estimatedTime: string;
    xpReward: number;
    goldReward: number;
    attribute: AttributeType;
    attributeReward: number;
    dueDate: string;
    dueTime?: string;
    repeat: QuestRepeat;
  }) => Promise<void>;
  updateQuest: (id: string, updates: Partial<Quest>) => Promise<void>;
  deleteQuest: (id: string) => Promise<void>;
  purchaseReward: (id: string) => Promise<void>;
  toggleEquipReward: (id: string) => Promise<void>;
  addQuestFromDiscovery: (recommendation: {
    title: string;
    description: string;
    category: QuestCategory;
    difficulty: QuestDifficulty;
    estimatedTime: string;
    xpReward: number;
    goldReward: number;
    attribute: AttributeType;
    attributeReward: number;
  }) => Promise<void>;
  updatePreferences: (prefs: Partial<User['preferences']>) => Promise<void>;
  setupHeroClass: (heroClass: Character['heroClass'], name: string, avatarUrl: string) => Promise<void>;
  updateAvatar: (avatarUrl: string) => Promise<void>;
  updateProfile: (updates: Partial<Pick<Character, 'name' | 'title' | 'heroClass' | 'avatarUrl'>>) => Promise<void>;
  soundEnabled: boolean;
  toggleSound: () => void;
  refreshData: () => Promise<void>;
  login: (email: string, password?: string) => Promise<User>;
  signup: (name: string, email: string, password?: string) => Promise<User>;
  logout: () => Promise<void>;
}

const GameContext = createContext<GameContextType | undefined>(undefined);

export const GameProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    try {
      const raw = localStorage.getItem(AUTH_SESSION_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed && typeof parsed === 'object' && parsed.email) {
          return parsed as User;
        }
      }
    } catch {}
    return null;
  });
  const [character, setCharacterState] = useState<Character | null>(() => {
    try {
      const raw = localStorage.getItem('liferpg_cached_character');
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed && typeof parsed === 'object') return parsed;
      }
    } catch {}
    return null;
  });

  const setCharacter = useCallback((char: Character | null | ((prev: Character | null) => Character | null)) => {
    setCharacterState((prev) => {
      const next = typeof char === 'function' ? char(prev) : char;
      try {
        if (next) {
          localStorage.setItem('liferpg_cached_character', JSON.stringify(next));
        } else {
          localStorage.removeItem('liferpg_cached_character');
        }
      } catch {}
      return next;
    });
  }, []);

  // Initialize quests purely from live database; purge any stale legacy localStorage cache
  const [quests, setQuestsState] = useState<Quest[]>(() => {
    try {
      localStorage.removeItem('liferpg_cached_quests');
    } catch {}
    return [];
  });

  const setQuests = useCallback((qsts: Quest[] | ((prev: Quest[]) => Quest[])) => {
    setQuestsState((prev) => {
      return typeof qsts === 'function' ? qsts(prev) : qsts;
    });
  }, []);
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [rewards, setRewards] = useState<RewardItem[]>([]);
  const [history, setHistory] = useState<HistoryRecord[]>([]);
  const [progress, setProgress] = useState<ProgressSummary | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [toasts, setToasts] = useState<ToastNotification[]>([]);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);

  // Modals
  const [activeLevelUpModal, setActiveLevelUpModal] = useState<{
    oldLevel: number;
    newLevel: number;
    unlockedReward?: string;
  } | null>(null);
  const [activeQuestCompleteReward, setActiveQuestCompleteReward] = useState<CompletionAnimationPayload | null>(null);
  const [deleteConfirmation, setDeleteConfirmation] = useState<{ questId: string; questTitle: string } | null>(null);
  const [purchaseConfirmation, setPurchaseConfirmation] = useState<{ reward: RewardItem } | null>(null);

  const addToast = useCallback((toast: Omit<ToastNotification, 'id'>) => {
    const id = `toast_${Date.now()}_${Math.random()}`;
    const newToast: ToastNotification = { ...toast, id };
    setToasts((prev) => [...prev, newToast]);

    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, toast.duration || 3500);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const toggleSound = useCallback(() => {
    setSoundEnabled((prev) => {
      const next = !prev;
      soundEngine.enabled = next;
      return next;
    });
  }, []);

  // Fetch all initial data
  const refreshData = useCallback(async () => {
    // Only load data if a Firebase user is signed in
    const { auth } = await import('../firebase');
    if (!auth.currentUser) {
      setLoading(false);
      return;
    }
    try {
      setLoading(true);
      const [usr, char, qsts, achs, rews, his, prog] = await Promise.all([
        authApi.getCurrentUser(),
        characterApi.getCharacter(),
        questApi.getQuests(),
        achievementApi.getAchievements(),
        rewardApi.getRewards(),
        progressApi.getHistory('all'),
        progressApi.getProgressSummary(),
      ]);

      if (usr) setUser(usr);
      setCharacter(char || null);
      setQuests(qsts || []);
      setAchievements(achs || []);
      setRewards(rews || []);
      setHistory(his || []);
      setProgress(prog || null);
      if (usr?.preferences?.soundEnabled !== undefined) {
        setSoundEnabled(usr.preferences.soundEnabled);
        soundEngine.enabled = usr.preferences.soundEnabled;
      }
    } catch (err) {
      console.error('Failed to load initial RPG data', err);
    } finally {
      setLoading(false);
    }
  }, []);

  // On mount: listen to Firebase Auth state changes — load data only when logged in
  useEffect(() => {
    let unsubscribe: (() => void) | undefined;
    import('../firebase').then(({ auth, onAuthStateChanged }) => {
      unsubscribe = onAuthStateChanged(auth, async (fbUser) => {
        if (fbUser) {
          // User just signed in — load their data from Firestore
          setLoading(true);
          try {
            const [usr, char, qsts, achs, rews, his, prog] = await Promise.all([
              authApi.getCurrentUser(),
              characterApi.getCharacter(),
              questApi.getQuests(),
              achievementApi.getAchievements(),
              rewardApi.getRewards(),
              progressApi.getHistory('all'),
              progressApi.getProgressSummary(),
            ]);
            if (usr) setUser(usr);
            const sanitizedChar = char
              ? (isLegacyStockPhoto(char.avatarUrl) ? { ...char, avatarUrl: '' } : char)
              : null;
            setCharacter(sanitizedChar);
            setQuests(qsts || []);
            setAchievements(achs || []);
            setRewards(rews || []);
            setHistory(his || []);
            setProgress(prog || null);
          } catch (err) {
            console.error('Error loading user data:', err);
          } finally {
            setLoading(false);
          }
        } else {
          // User signed out — clear everything
          dbStore.reset();
          setUser(null);
          setCharacter(null);
          setQuests([]);
          setAchievements([]);
          setRewards([]);
          setHistory([]);
          setProgress(null);
          setLoading(false);
        }
      });
    });
    return () => { if (unsubscribe) unsubscribe(); };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Complete Quest Handler with Full RPG Animation & Sound
  const completeQuest = useCallback(
    async (id: string) => {
      try {
        const result = await questApi.completeQuest(id);

        // Optimistically update local state immediately for snappy UI
        if (character) {
          const optimisticChar: Character = {
            ...character,
            level: result.levelUp ? result.levelUp.newLevel : character.level,
            xp: character.xp + result.xpGained,
            gold: character.gold + result.goldGained,
            attributes: {
              ...character.attributes,
              [result.attribute]: (character.attributes[result.attribute] || 0) + result.attributeGained,
            },
            recentGains: {
              ...character.recentGains,
              [result.attribute]: (character.recentGains[result.attribute] || 0) + result.attributeGained,
            },
          };
          setCharacter(optimisticChar);
        }

        // Mark the quest completed in the list
        setQuests((prev) => prev.map((q) => (q.id === id ? result.quest : q)));

        // Sound & Tactile feedback
        soundEngine.playQuestComplete();
        soundEngine.playCoinSound();

        // Confetti burst
        confetti({
          particleCount: 60,
          spread: 70,
          origin: { y: 0.7 },
          colors: ['#f59e0b', '#a855f7', '#06b6d4', '#e2e8f0'],
        });

        // Trigger the Quest Complete Experience Modal/Banner
        setActiveQuestCompleteReward({
          questTitle: result.quest.title,
          xpGained: result.xpGained,
          goldGained: result.goldGained,
          attribute: result.attribute,
          attributeGained: result.attributeGained,
          levelUp: result.levelUp,
        });

        addToast({
          type: 'success',
          title: '✨ Quest Completed!',
          message: `Earned +${result.xpGained} XP, +${result.goldGained} Gold!`,
        });

        // Level Up Trigger if occurred
        if (result.levelUp) {
          setTimeout(() => {
            soundEngine.playLevelUp();
            confetti({
              particleCount: 120,
              spread: 100,
              origin: { y: 0.5 },
              colors: ['#f59e0b', '#fbbf24', '#ffffff', '#818cf8'],
            });
            setActiveLevelUpModal(result.levelUp!);
          }, 700);
        }

        // Re-sync character from Firestore to ensure gold/XP persists correctly
        // Also re-fetch quests so any newly spawned repeat quest appears
        characterApi.getCharacter().then((freshChar) => {
          if (freshChar) setCharacter(freshChar);
        }).catch(() => {});
        questApi.getQuests().then(setQuests).catch(() => {});

        // Refresh achievements, progress, history in background
        achievementApi.getAchievements().then(setAchievements).catch(() => {});
        progressApi.getProgressSummary().then(setProgress).catch(() => {});
        progressApi.getHistory('all').then(setHistory).catch(() => {});
      } catch (err: unknown) {
        const errorMsg = err instanceof Error ? err.message : 'Could not complete quest';
        addToast({
          type: 'error',
          title: 'Quest action failed',
          message: errorMsg,
        });
      }
    },
    [character, addToast]
  );

  const createQuest = useCallback(
    async (data: {
      title: string;
      description: string;
      category: QuestCategory;
      difficulty: QuestDifficulty;
      estimatedTime: string;
      xpReward: number;
      goldReward: number;
      attribute: AttributeType;
      attributeReward: number;
      dueDate: string;
      dueTime?: string;
      repeat: QuestRepeat;
    }) => {
      try {
        const newQuest = await questApi.createQuest(data);
        setQuests((prev) => [newQuest, ...prev]);
        soundEngine.playClick();
        addToast({
          type: 'success',
          title: '✓ Quest Inscribed',
          message: `"${newQuest.title}" added to your quest log!`,
        });
      } catch (err: unknown) {
        const errorMsg = err instanceof Error ? err.message : 'Failed to create quest';
        addToast({
          type: 'error',
          title: 'Failed to create quest',
          message: errorMsg,
        });
        throw err;
      }
    },
    [addToast]
  );

  const updateQuest = useCallback(
    async (id: string, updates: Partial<Quest>) => {
      try {
        const updated = await questApi.updateQuest(id, updates);
        setQuests((prev) => prev.map((q) => (q.id === id ? updated : q)));
        addToast({
          type: 'info',
          title: '✓ Quest Updated',
          message: `"${updated.title}" changes saved.`,
        });
      } catch (err: unknown) {
        const errorMsg = err instanceof Error ? err.message : 'Failed to update quest';
        addToast({
          type: 'error',
          title: 'Failed to update quest',
          message: errorMsg,
        });
      }
    },
    [addToast]
  );

  const deleteQuest = useCallback(
    async (id: string) => {
      try {
        await questApi.deleteQuest(id);
        setQuests((prev) => prev.filter((q) => q.id !== id));
        setDeleteConfirmation(null);
        soundEngine.playClick();
        addToast({
          type: 'info',
          title: '✓ Quest Abandoned',
          message: 'The quest has been removed from your log.',
        });
      } catch (err: unknown) {
        const errorMsg = err instanceof Error ? err.message : 'Failed to delete quest';
        addToast({
          type: 'error',
          title: 'Failed to delete quest',
          message: errorMsg,
        });
      }
    },
    [addToast]
  );

  const purchaseReward = useCallback(
    async (id: string) => {
      try {
        const res = await rewardApi.purchaseReward(id);
        setRewards((prev) => prev.map((r) => (r.id === id ? res.reward : r)));
        // Immediately update gold display in UI
        if (character) {
          setCharacter({
            ...character,
            gold: res.remainingGold,
            attributes: res.reward.statBonus
              ? {
                  ...character.attributes,
                  [res.reward.statBonus.attribute]:
                    character.attributes[res.reward.statBonus.attribute] + res.reward.statBonus.amount,
                }
              : character.attributes,
          });
        }
        setPurchaseConfirmation(null);
        soundEngine.playCoinSound();

        confetti({
          particleCount: 50,
          spread: 60,
          origin: { y: 0.6 },
          colors: ['#fbbf24', '#f59e0b', '#38bdf8'],
        });

        addToast({
          type: 'gold',
          title: '✨ Item Acquired!',
          message: `You purchased ${res.reward.name}! Gold deducted: ${res.reward.price}`,
        });

        // Re-sync character from Firestore so gold balance persists on refresh
        characterApi.getCharacter().then((freshChar) => {
          if (freshChar) setCharacter(freshChar);
        }).catch(() => {});
        // Refresh rewards list to reflect ownership
        rewardApi.getRewards().then(setRewards).catch(() => {});
        progressApi.getHistory('all').then(setHistory).catch(() => {});
      } catch (err: unknown) {
        const errorMsg = err instanceof Error ? err.message : 'Could not purchase item';
        addToast({
          type: 'error',
          title: 'Transaction Failed',
          message: errorMsg,
        });
      }
    },
    [character, addToast]
  );

  const toggleEquipReward = useCallback(
    async (id: string) => {
      try {
        const updated = await rewardApi.toggleEquip(id);
        setRewards((prev) => prev.map((r) => (r.id === id ? updated : r)));
        // Refresh character equipment
        const char = await characterApi.getCharacter();
        setCharacter(char);
        soundEngine.playClick();
        addToast({
          type: 'info',
          title: updated.equipped ? '⚔ Item Equipped' : 'Item Unequipped',
          message: `${updated.name} ${updated.equipped ? 'is now equipped' : 'stored in inventory'}.`,
        });
      } catch (err: unknown) {
        const errorMsg = err instanceof Error ? err.message : 'Could not change equipment';
        addToast({
          type: 'error',
          title: 'Equip error',
          message: errorMsg,
        });
      }
    },
    [addToast]
  );

  const addQuestFromDiscovery = useCallback(
    async (rec: {
      title: string;
      description: string;
      category: QuestCategory;
      difficulty: QuestDifficulty;
      estimatedTime: string;
      xpReward: number;
      goldReward: number;
      attribute: AttributeType;
      attributeReward: number;
    }) => {
      await createQuest({
        ...rec,
        dueDate: new Date().toISOString().split('T')[0],
        repeat: 'None',
      });
    },
    [createQuest]
  );

  const updatePreferences = useCallback(
    async (prefs: Partial<User['preferences']>) => {
      try {
        const updated = await authApi.updatePreferences(prefs);
        setUser(updated);
        if (prefs.soundEnabled !== undefined) {
          setSoundEnabled(prefs.soundEnabled);
          soundEngine.enabled = prefs.soundEnabled;
        }
        addToast({
          type: 'success',
          title: '✓ Preferences Saved',
          message: 'Your adventurer settings have been updated.',
        });
      } catch {
        addToast({
          type: 'error',
          title: 'Failed to update preferences',
        });
      }
    },
    [addToast]
  );

  const setupHeroClass = useCallback(
    async (heroClass: Character['heroClass'], name: string, avatarUrl: string) => {
      try {
        const cleanAvatar = isLegacyStockPhoto(avatarUrl) ? '' : avatarUrl;
        const char = await characterApi.setupInitialHero(heroClass, name, cleanAvatar);
        const sanitized = isLegacyStockPhoto(char.avatarUrl) ? { ...char, avatarUrl: '' } : char;
        setCharacter(sanitized);
        soundEngine.playLevelUp();
        addToast({
          type: 'success',
          title: `Welcome, ${heroClass}!`,
          message: `Your journey as the ${char.title} begins now.`,
        });
      } catch {
        addToast({
          type: 'error',
          title: 'Failed to setup hero',
        });
      }
    },
    [addToast]
  );

  const updateAvatar = useCallback(async (avatarUrl: string) => {
    try {
      const cleanUrl = isLegacyStockPhoto(avatarUrl) ? '' : avatarUrl;
      const updated = await characterApi.updateCharacter({ avatarUrl: cleanUrl });
      const sanitized = isLegacyStockPhoto(updated.avatarUrl) ? { ...updated, avatarUrl: '' } : updated;
      setCharacter(sanitized);
      addToast({
        type: 'success',
        title: cleanUrl ? '✓ Avatar Updated' : '✓ Avatar Cleared',
        message: cleanUrl ? 'Your hero portrait has been changed.' : 'Your hero portrait is now blank.',
      });
    } catch {
      addToast({
        type: 'error',
        title: 'Failed to update avatar',
      });
    }
  }, [addToast]);

  const updateProfile = useCallback(async (updates: Partial<Pick<Character, 'name' | 'title' | 'heroClass' | 'avatarUrl'>>) => {
    try {
      const cleanUpdates = { ...updates };
      if (cleanUpdates.avatarUrl !== undefined && isLegacyStockPhoto(cleanUpdates.avatarUrl)) {
        cleanUpdates.avatarUrl = '';
      }
      const updated = await characterApi.updateCharacter(cleanUpdates);
      const sanitized = isLegacyStockPhoto(updated.avatarUrl) ? { ...updated, avatarUrl: '' } : updated;
      setCharacter(sanitized);
      if (updates.name && user) {
        setUser((prev) => prev ? { ...prev, name: updates.name! } : null);
      }
      addToast({
        type: 'success',
        title: '✓ Profile Updated',
        message: 'Your hero identity has been updated successfully.',
      });
    } catch {
      addToast({
        type: 'error',
        title: 'Failed to update profile',
      });
    }
  }, [user, addToast]);

  const closeLevelUpModal = () => setActiveLevelUpModal(null);
  const closeQuestCompleteReward = () => setActiveQuestCompleteReward(null);

  const login = useCallback(async (email: string, password: string = 'questmaster123') => {
    setLoading(true);
    try {
      const loggedUser = await authApi.login(email, password);
      setUser(loggedUser);
      const [char, qsts, achs, rews, his, prog] = await Promise.all([
        characterApi.getCharacter(),
        questApi.getQuests(),
        achievementApi.getAchievements(),
        rewardApi.getRewards(),
        progressApi.getHistory('all'),
        progressApi.getProgressSummary(),
      ]);
      setCharacter(char || null);
      setQuests(qsts || []);
      setAchievements(achs || []);
      setRewards(rews || []);
      setHistory(his || []);
      setProgress(prog || null);
      return loggedUser;
    } finally {
      setLoading(false);
    }
  }, []);

  const signup = useCallback(async (name: string, email: string, password: string = 'questmaster123') => {
    setLoading(true);
    try {
      const newUser = await authApi.signup(name, email, password);
      setUser(newUser);
      const [char, qsts, achs, rews, his, prog] = await Promise.all([
        characterApi.getCharacter(),
        questApi.getQuests(),
        achievementApi.getAchievements(),
        rewardApi.getRewards(),
        progressApi.getHistory('all'),
        progressApi.getProgressSummary(),
      ]);
      setCharacter(char || null);
      setQuests(qsts || []);
      setAchievements(achs || []);
      setRewards(rews || []);
      setHistory(his || []);
      setProgress(prog || null);
      return newUser;
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      await authApi.logout();
      // authApi.logout() calls Firebase signOut which triggers onAuthStateChanged
      // which will reset all state — but also clear immediately for responsiveness
      dbStore.reset();
      setUser(null);
      setCharacter(null);
      setQuests([]);
      setAchievements([]);
      setRewards([]);
      setHistory([]);
      setProgress(null);
      addToast({
        type: 'info',
        title: 'Logged Out',
        message: 'You have safely departed the realm.',
      });
    } catch (err) {
      console.error('Logout error', err);
    }
  }, [addToast]);

  return (
    <GameContext.Provider
      value={{
        user,
        character,
        quests,
        achievements,
        rewards,
        history,
        progress,
        loading,
        toasts,
        activeLevelUpModal,
        closeLevelUpModal,
        activeQuestCompleteReward,
        closeQuestCompleteReward,
        deleteConfirmation,
        setDeleteConfirmation,
        purchaseConfirmation,
        setPurchaseConfirmation,
        addToast,
        removeToast,
        completeQuest,
        createQuest,
        updateQuest,
        deleteQuest,
        purchaseReward,
        toggleEquipReward,
        addQuestFromDiscovery,
        updatePreferences,
        setupHeroClass,
        updateAvatar,
        updateProfile,
        soundEnabled,
        toggleSound,
        refreshData,
        login,
        signup,
        logout,
      }}
    >
      {children}
    </GameContext.Provider>
  );
};

export const useGame = () => {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
};
