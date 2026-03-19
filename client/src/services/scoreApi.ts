import { ScoreEntry } from '../types';

const API_BASE = import.meta.env.VITE_API_URL ?? 'http://localhost:3001/api';

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });

  if (!res.ok) {
    const body = await res.json().catch(() => ({ error: 'Request failed' }));
    throw new Error((body as { error: string }).error);
  }

  if (res.status === 204) return undefined as T;
  return res.json() as Promise<T>;
}

export const scoreApi = {
  submitScore(data: {
    playerName: string;
    score: number;
    level: number;
    linesCleared: number;
  }): Promise<ScoreEntry> {
    return request<ScoreEntry>('/scores', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  getLeaderboard(): Promise<ScoreEntry[]> {
    return request<ScoreEntry[]>('/scores/leaderboard');
  },
};
