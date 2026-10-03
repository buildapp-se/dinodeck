import type { Lang, Period } from './dinos.ts';

/** One animal placed in the scene. x and y are the centre, as fractions of the scene's width and height. */
export interface SceneItem {
  id: string;
  x: number;
  y: number;
  /** Width as a fraction of the scene's width. */
  size: number;
  flip: boolean;
}

export interface Scene {
  bg: Period;
  items: SceneItem[];
}

export const MAX_SCENE_ITEMS = 20;
export const MIN_SIZE = 0.12;
export const MAX_SIZE = 0.8;

const clamp = (v: unknown, lo: number, hi: number, fallback: number): number =>
  typeof v === 'number' && Number.isFinite(v) ? Math.min(hi, Math.max(lo, v)) : fallback;

function parseScene(raw: unknown, knownIds: readonly string[]): Scene {
  const s = (typeof raw === 'object' && raw !== null ? raw : {}) as Record<string, unknown>;
  const bg = s.bg === 'triassic' || s.bg === 'jurassic' || s.bg === 'cretaceous' ? s.bg : 'jurassic';
  const items = (Array.isArray(s.items) ? s.items : [])
    .filter((i): i is Record<string, unknown> => typeof i === 'object' && i !== null)
    .filter((i) => typeof i.id === 'string' && knownIds.includes(i.id))
    .slice(0, MAX_SCENE_ITEMS)
    .map((i) => ({
      id: i.id as string,
      x: clamp(i.x, 0, 1, 0.5),
      y: clamp(i.y, 0, 1, 0.7),
      size: clamp(i.size, MIN_SIZE, MAX_SIZE, 0.3),
      flip: i.flip === true,
    }));
  return { bg, items };
}

export interface State {
  v: 1;
  lang: Lang;
  favorites: string[];
  /** Ids won in challenges. Starters are open without being listed here. */
  won: string[];
  scene: Scene;
}

const KEY = 'dinodeck';

/** Parses whatever localStorage held. Anything unusable falls back to the default, never throws. */
export function parseState(raw: string | null, knownIds: readonly string[], fallbackLang: Lang): State {
  const fresh: State = { v: 1, lang: fallbackLang, favorites: [], won: [], scene: parseScene(null, knownIds) };
  if (!raw) return fresh;
  let data: unknown;
  try {
    data = JSON.parse(raw);
  } catch {
    return fresh;
  }
  if (typeof data !== 'object' || data === null) return fresh;
  const d = data as Record<string, unknown>;
  const idList = (v: unknown): string[] =>
    Array.isArray(v) ? [...new Set(v.filter((id): id is string => typeof id === 'string' && knownIds.includes(id)))] : [];
  return {
    v: 1,
    lang: d.lang === 'sv' || d.lang === 'en' ? d.lang : fallbackLang,
    favorites: idList(d.favorites),
    won: idList(d.won),
    scene: parseScene(d.scene, knownIds),
  };
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
