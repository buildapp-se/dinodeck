/** A child of about seven. The one looking at the card is the yardstick. */
export const CHILD_M = 1.2;
/** How wide the child figure is drawn, as a share of its height. */
export const CHILD_ASPECT = 0.3;

/**
 * Pixels per metre for the size comparison: the largest scale at which the animal and the child,
 * side by side with a gap, fit the box in both directions.
 *
 * The animal's size comes from its height, not its length: the pictures are painted at an angle, so a
 * picture's width is much less than the body length, and scaling by length drew Triceratops 6.8 m tall.
 */
export function pxPerMetre(boxW: number, boxH: number, animalWidthM: number, animalHeightM: number, gapPx: number): number {
  const acrossM = animalWidthM + CHILD_M * CHILD_ASPECT;
  const tallestM = Math.max(CHILD_M, animalHeightM);
  return Math.max(0, Math.min((boxW - gapPx) / acrossM, boxH / tallestM));
}
