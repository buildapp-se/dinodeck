import type { Dino, Period } from './dinos.ts';

/** Period boundaries in million years ago, oldest first (International Chronostratigraphic Chart, rounded). */
export const BOUNDS: Record<Period, readonly [number, number]> = {
  triassic: [252, 201],
  jurassic: [201, 145],
  cretaceous: [145, 66],
};
export const START_MYA = 252;

/** One point per animal: the middle of the time it lived. */
export const midMya = (d: Dino): number => (d.fromMya + d.toMya) / 2;

/** Distance from the left edge. The scale is linear on purpose: the long empty stretch before "today" is the lesson. */
export const xOf = (mya: number, pxPerMya: number): number => (START_MYA - mya) * pxPerMya;

export interface Placed {
  id: string;
  /** Centre of the item, in px from the start of the strip. */
  x: number;
  lane: number;
}

/** Oldest first, each animal in the first lane where it does not overlap the one before it. */
export function layoutTimeline(dinos: readonly Dino[], pxPerMya: number, itemW: number): { items: Placed[]; lanes: number } {
  const laneEnds: number[] = [];
  const items = [...dinos]
    .sort((a, b) => midMya(b) - midMya(a))
    .map((d) => {
      const x = xOf(midMya(d), pxPerMya);
      let lane = laneEnds.findIndex((end) => end <= x - itemW / 2);
      if (lane < 0) lane = laneEnds.length;
      laneEnds[lane] = x + itemW / 2;
      return { id: d.id, x, lane };
    });
  return { items, lanes: laneEnds.length };
}
