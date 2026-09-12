import { useState, useEffect } from 'react';

export interface CountdownState {
  totalMs: number;
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  isUrgent: boolean; // True if due within the next 4 hours
  isOverdue: boolean; // True if past due
  formatted: string;
}

/**
 * Calculates a reliable Date object for a quest deadline.
 */
export function getQuestDeadline(quest: { dueDate: string; dueTime?: string }): Date {
  if (!quest.dueDate) {
    const fallback = new Date();
    fallback.setHours(fallback.getHours() + 4);
    return fallback;
  }

  // If already an ISO string with time
  if (quest.dueDate.includes('T')) {
    const parsed = new Date(quest.dueDate);
    if (!isNaN(parsed.getTime())) {
      return parsed;
    }
  }

  // If dueTime is provided (e.g. "14:30")
  if (quest.dueTime && quest.dueTime.includes(':')) {
    const combined = `${quest.dueDate}T${quest.dueTime}:00`;
    const parsed = new Date(combined);
    if (!isNaN(parsed.getTime())) {
      return parsed;
    }
  }

  // Default: End of the given day (23:59:59)
  const [year, month, day] = quest.dueDate.split('-').map(Number);
  if (year && month && day) {
    return new Date(year, month - 1, day, 23, 59, 59);
  }

  return new Date(quest.dueDate);
}

/**
 * Calculates remaining time metrics from a deadline date.
 */
export function calculateRemainingTime(deadline: Date): CountdownState {
  const now = new Date().getTime();
  const totalMs = deadline.getTime() - now;
  const isOverdue = totalMs <= 0;

  // Under 4 hours (4 * 60 * 60 * 1000 ms) and not yet overdue
  const FOUR_HOURS_MS = 4 * 60 * 60 * 1000;
  const isUrgent = totalMs > 0 && totalMs <= FOUR_HOURS_MS;

  if (isOverdue) {
    const overdueMs = Math.abs(totalMs);
    const overdueHours = Math.floor(overdueMs / (1000 * 60 * 60));
    const overdueMins = Math.floor((overdueMs % (1000 * 60 * 60)) / (1000 * 60));
    return {
      totalMs,
      days: 0,
      hours: 0,
      minutes: 0,
      seconds: 0,
      isUrgent: false,
      isOverdue: true,
      formatted: overdueHours > 0 ? `Overdue by ${overdueHours}h ${overdueMins}m` : 'Overdue',
    };
  }

  const seconds = Math.floor((totalMs / 1000) % 60);
  const minutes = Math.floor((totalMs / 1000 / 60) % 60);
  const hours = Math.floor((totalMs / (1000 * 60 * 60)) % 24);
  const days = Math.floor(totalMs / (1000 * 60 * 60 * 24));

  let formatted = '';
  if (days > 0) {
    formatted = `${days}d ${hours}h ${minutes}m`;
  } else if (hours > 0) {
    const hh = String(hours).padStart(2, '0');
    const mm = String(minutes).padStart(2, '0');
    const ss = String(seconds).padStart(2, '0');
    formatted = `${hh}h ${mm}m ${ss}s`;
  } else {
    const mm = String(minutes).padStart(2, '0');
    const ss = String(seconds).padStart(2, '0');
    formatted = `${mm}m ${ss}s`;
  }

  return {
    totalMs,
    days,
    hours,
    minutes,
    seconds,
    isUrgent,
    isOverdue: false,
    formatted,
  };
}

/**
 * React hook that yields live ticking countdown state.
 */
export function useQuestCountdown(quest: { dueDate: string; dueTime?: string }): CountdownState {
  const [deadline] = useState(() => getQuestDeadline(quest));
  const [countdown, setCountdown] = useState<CountdownState>(() => calculateRemainingTime(deadline));

  useEffect(() => {
    const target = getQuestDeadline(quest);
    setCountdown(calculateRemainingTime(target));

    const interval = setInterval(() => {
      setCountdown(calculateRemainingTime(target));
    }, 1000);

    return () => clearInterval(interval);
  }, [quest.dueDate, quest.dueTime]);

  return countdown;
}
