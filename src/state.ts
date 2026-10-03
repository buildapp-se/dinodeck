import type { Lang } from './dinos.ts';

export interface State {
  v: 1;
  lang: Lang;
  favorites: string[];
}

const KEY = 'dinodeck';

/** Parses whatever localStorage held. Anything unusable falls back to the default, never throws. */
export function parseState(raw: string | null, knownIds: readonly string[], fallbackLang: Lang): State {
  const fresh: State = { v: 1, lang: fallbackLang, favorites: [] };
  if (!raw) return fresh;
  let data: unknown;
  try {
    data = JSON.parse(raw);
  } catch {
    return fresh;
  }
  if (typeof data !== 'object' || data === null) return fresh;
  const d = data as Record<string, unknown>;
  const favorites = Array.isArray(d.favorites)
    ? [...new Set(d.favorites.filter((id): id is string => typeof id === 'string' && knownIds.includes(id)))]
    : [];
  return { v: 1, lang: d.lang === 'sv' || d.lang === 'en' ? d.lang : fallbackLang, favorites };
}

export function toggleFavorite(favorites: readonly string[], id: string): string[] {
  return favorites.includes(id) ? favorites.filter((x) => x !== id) : [...favorites, id];
}

/** The top card goes to the back: nothing is ever dismissed for good. */
export function advance(queue: readonly string[]): string[] {
  const [top, ...rest] = queue;
  return top === undefined ? [] : [...rest, top];
}

export function loadState(knownIds: readonly string[], fallbackLang: Lang): State {
  let raw: string | null = null;
  try {
    raw = localStorage.getItem(KEY);
  } catch {
    // Private mode or blocked storage: run with defaults.
  }
  return parseState(raw, knownIds, fallbackLang);
}

export function saveState(state: State): void {
  try {
    localStorage.setItem(KEY, JSON.stringify(state));
  } catch {
    // Storage full or blocked: the session still works, it just is not remembered.
  }
}
