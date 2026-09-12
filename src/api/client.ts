import { auth } from '../firebase';

async function getAuthToken(): Promise<string | null> {
  try {
    const user = auth.currentUser;
    if (user) return await user.getIdToken();
  } catch {}
  return null;
}

export async function fetchJson<T>(url: string, options?: RequestInit): Promise<T> {
  const token = await getAuthToken();
  const response = await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options?.headers || {}),
    },
    ...options,
  });

  const body = await response.json();
  if (!response.ok || body.success === false) {
    throw new Error(body.error || `HTTP error ${response.status}`);
  }

  return body.data !== undefined ? body.data : body;
}
