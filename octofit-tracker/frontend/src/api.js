/* global __CODESPACE_NAME__ */
const codespaceName = __CODESPACE_NAME__;

export const API_BASE_URL = codespaceName
  ? `https://${codespaceName}-8000.app.github.dev/api`
  : 'http://localhost:8000/api';

export async function api(path, options = {}) {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
    body: options.body ? JSON.stringify(options.body) : undefined,
  });
  if (response.status === 204) return null;
  const data = await response.json().catch(() => null);
  if (!response.ok) {
    throw new Error(data?.error ?? `Request failed (${response.status})`);
  }
  return data;
}

export const ACTIVITY_LABELS = {
  running: 'Corsa',
  walking: 'Camminata',
  cycling: 'Ciclismo',
  swimming: 'Nuoto',
  strength: 'Forza',
  yoga: 'Yoga',
  'team-sport': 'Sport di squadra',
  other: 'Altro',
};

export const LEVEL_LABELS = {
  beginner: 'Principiante',
  intermediate: 'Intermedio',
  advanced: 'Avanzato',
};
