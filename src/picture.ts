/**
 * True when a point lands on a picture drawn with `object-fit: contain`: the picture is scaled to fit
 * its box and centred, so the box has empty bands beside or above it. x and y count from the box's top left.
 */
export function onPicture(boxW: number, boxH: number, naturalW: number, naturalH: number, x: number, y: number): boolean {
  if (naturalW <= 0 || naturalH <= 0) return false; // not loaded: there is no picture to hit
  const scale = Math.min(boxW / naturalW, boxH / naturalH);
  const w = naturalW * scale;
  const h = naturalH * scale;
  const left = (boxW - w) / 2;
  const top = (boxH - h) / 2;
  return x >= left && x <= left + w && y >= top && y <= top + h;
}
