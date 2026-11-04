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

/** Win dates per card id: only known ids with a real YYYY-MM-DD date survive. */

function parseDates(raw: unknown, knownIds: readonly string[]): Record<string, string> {
  const out: Record<string, string> = {};
  if (typeof raw !== 'object' || raw === null || Array.isArray(raw)) return out;
  for (const [id, day] of Object.entries(raw)) if (knownIds.includes(id) && typeof day === 'string' && parseDay(day) !== null) out[id] = day;
  return out;
}

export interface State {
  v: 1;
  lang: Lang;
  favorites: string[];
  /** Ids won in challenges. Starters are open without being listed here. */
  won: string[];
  /** Local date (YYYY-MM-DD) each won card was won on, for "this week's cards" in parent mode. */
  wonAt: Record<string, string>;
  /** Won cards that have been turned over: the NY badge on the front is gone. */
  seen: string[];
  scene: Scene;
  /** Parent mode: every card open without touching what has been won. */
  unlockAll: boolean;
  muted: boolean;
  /** Parent mode: the cute art and roars where a card has them (src/cute.ts). */
  cute: boolean;
  onboarded: boolean;
  /** Babies hatched from the daily egg, in the order they came. */
  hatched: string[];
  /** The local date (YYYY-MM-DD) the last egg was opened: one egg a day. */
  eggDay: string;
}

export const KEY = 'dinodeck';

/** Parses whatever localStorage held. Anything unusable falls back to the default, never throws. */
export function parseState(raw: string | null, knownIds: readonly string[], fallbackLang: Lang): State {
  const fresh: State = { v: 1, lang: fallbackLang, favorites: [], won: [], wonAt: {}, seen: [], scene: parseScene(null, knownIds), unlockAll: false, muted: false, cute: false, onboarded: false, hatched: [], eggDay: '' };
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
    wonAt: parseDates(d.wonAt, knownIds),
    seen: idList(d.seen),
    scene: parseScene(d.scene, knownIds),
    unlockAll: d.unlockAll === true,
    muted: d.muted === true,
    cute: d.cute === true,
    onboarded: d.onboarded === true,
    hatched: idList(d.hatched),
    eggDay: typeof d.eggDay === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(d.eggDay) ? d.eggDay : '',
  };
}

/** Parent mode's reset: the collection starts over, the device's settings (language, sound, style) stay. */
export function resetCollection(state: State): State {
  return { v: 1, lang: state.lang, muted: state.muted, cute: state.cute, onboarded: state.onboarded, unlockAll: false, favorites: [], won: [], wonAt: {}, seen: [], scene: { bg: 'jurassic', items: [] }, hatched: [], eggDay: '' };
}

export function toggleFavorite(favorites: readonly string[], id: string): string[] {
  return favorites.includes(id) ? favorites.filter((x) => x !== id) : [...favorites, id];
}

/** A won card keeps its NY badge until it has been turned over once. */
export function markSeen(seen: readonly string[], id: string): string[] {
  return seen.includes(id) ? [...seen] : [...seen, id];
}

/** Whether a won card still carries its NY badge before its first turn. */
export function isNewCard(won: readonly string[], seen: readonly string[], id: string): boolean {
  return won.includes(id) && !seen.includes(id);
}

/** A won card also remembers the local date it was won on; winning it again keeps the first date. */
export function markWon(won: readonly string[], wonAt: Record<string, string>, id: string, day: string): { won: string[]; wonAt: Record<string, string> } {
  if (won.includes(id)) return { won: [...won], wonAt };
  return { won: [...won, id], wonAt: { ...wonAt, [id]: day } };
}

const pad2 = (n: number): string => String(n).padStart(2, '0');

/** The date a YYYY-MM-DD string names, or null when the shape is right but the calendar is not (2026-13-45). */
function parseDay(day: string): Date | null {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(day);
  if (!m) return null;
  const d = new Date(Number(m[1]), Number(m[2]) - 1, Number(m[3]));
  return d.getFullYear() === Number(m[1]) && d.getMonth() === Number(m[2]) - 1 && d.getDate() === Number(m[3]) ? d : null;
}

const dayStr = (d: Date): string => `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`;

/** `day` (YYYY-MM-DD) moved `n` days, as YYYY-MM-DD. */
function shiftDays(day: string, n: number): string {
  const d = parseDay(day);
  if (!d) return day;
  d.setDate(d.getDate() + n);
  return dayStr(d);
}

/** The Monday of the week `day` (YYYY-MM-DD) falls in, as YYYY-MM-DD. */
export function weekStart(day: string): string {
  const d = parseDay(day);
  if (!d) return day;
  d.setDate(d.getDate() - ((d.getDay() + 6) % 7)); // Monday is day 0
  return dayStr(d);
}

/** The won cards from the same week as `day` (Monday to Sunday), in the order they were won. A card won before dates were saved has none and is left out. */
export function wonThisWeek(won: readonly string[], wonAt: Record<string, string>, day: string): string[] {
  const monday = weekStart(day);
  const sunday = shiftDays(monday, 6); // the week runs Monday to Sunday, also past `day`
  return won.filter((id) => wonAt[id] !== undefined && wonAt[id] >= monday && wonAt[id] <= sunday);
}

/** The top card goes to the back: nothing is ever dismissed for good. */
export function advance(queue: readonly string[]): string[] {
  const [top, ...rest] = queue;
  return top === undefined ? [] : [...rest, top];
}

/**
 * The deck: the open cards with the next few to win mixed in, two to four open cards apart.
 * Only `shown` locked cards are dealt, so the deck never turns into a run of silhouettes.
 */
export function deckOrder(open: readonly string[], toWin: readonly string[], shown = 3): string[] {
  const dealt = toWin.slice(0, shown);
  const step = Math.min(4, Math.max(2, Math.floor(open.length / Math.max(1, dealt.length))));
  const out = [...open];
  dealt.forEach((id, i) => out.splice(Math.min(out.length, (i + 1) * step + i), 0, id));
  return out;
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
