import { auth } from '../firebase';
import { AUTH_SESSION_KEY } from './store';

async function getAuthToken(): Promise<string | null> {
  try {
    if (!auth.currentUser && typeof (auth as any).authStateReady === 'function') {
      await (auth as any).authStateReady();
    }
    const user = auth.currentUser;
    if (user) return await user.getIdToken();
  } catch {}
  return null;
}

function getStoredUid(): string | null {
  try {
    const raw = localStorage.getItem(AUTH_SESSION_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      return parsed?.id || null;
    }
  } catch {}
  return null;
}

export async function fetchJson<T>(url: string, options?: RequestInit): Promise<T> {
  const token = await getAuthToken();
  const uid = getStoredUid();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(uid ? { 'x-user-uid': uid } : {}),
    ...((options?.headers as Record<string, string>) || {}),
  };

  const response = await fetch(url, {
    ...options,
    headers,
  });

  let body: any = null;
  const text = await response.text();
  try {
    body = JSON.parse(text);
  } catch {
    if (!response.ok) {
      throw new Error(`Server request failed (${response.status})`);
    }
  }

  if (!response.ok || (body && body.success === false)) {
    throw new Error(body?.error || `Server error (${response.status})`);
  }

  return body && body.data !== undefined ? body.data : body;
}
