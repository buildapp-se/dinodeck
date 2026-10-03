// Not used by any view yet: see BACKLOG, "Storleksjämförelse". The arithmetic is right, but the pictures are painted
// at an angle, so a picture's width is not the animal's length and the comparison came out up to 2.5 times too big.

/** A child of about seven. The one looking at the card is the yardstick. */
export const CHILD_M = 1.2;
/** How wide the child figure is drawn, as a share of its height. */
export const CHILD_ASPECT = 0.3;

/**
 * Pixels per metre for the size comparison: the largest scale at which the animal and the child,
 * side by side with a gap, fit the box in both directions. `aspect` is the picture's height / width.
 */
export function pxPerMetre(boxW: number, boxH: number, lengthM: number, aspect: number, gapPx: number): number {
  const acrossM = lengthM + CHILD_M * CHILD_ASPECT;
  const tallestM = Math.max(CHILD_M, lengthM * aspect);
  return Math.max(0, Math.min((boxW - gapPx) / acrossM, boxH / tallestM));
}
