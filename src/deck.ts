// Swipe and tap handling for the top card. Ported from Sipdeck's attachDrag/flyOff,
// which is proven on real phones: Pointer Events, transform only, 35 % or a flick commits.

export interface TapPoint {
  /** The element under the finger when it went down. */
  target: Element;
  x: number;
  y: number;
}

export interface DragHandlers {
  /** A press that never moved. `at` is where it landed; without it the tap came from the keyboard or a button. */
  tap(at?: TapPoint): void;
  /** Called the moment the card is committed, before it has finished flying. 1 = right. */
  swipe(dir: 1 | -1): void;
}

const FLICK = 0.6; // px per ms

export function flyOff(card: HTMLElement, dir: 1 | -1, on: DragHandlers, dy = 0, dx = 0, vx = 0): void {
  if (card.dataset.leaving) return;
  card.dataset.leaving = 'true';
  card.inert = true;
  const x = (window.innerWidth + card.offsetWidth) * dir;
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  // A drag keeps the finger's speed; buttons and keys get a fixed 320 ms.
  const ms = reduced ? 0 : vx ? Math.max(180, Math.min(360, Math.abs(x - dx) / Math.max(Math.abs(vx), 0.8))) : 320;
  card.style.transition = `transform ${Math.round(ms)}ms ease-in`;
  card.style.transform = `translate(${x}px, ${dy * 0.4}px) rotate(${dir * 18}deg)`;
  on.swipe(dir);
  // transitionend never fires at 0 ms or in a hidden tab, so a timer is the backstop.
  const finish = () => card.remove();
  card.addEventListener('transitionend', (e) => e.target === card && finish(), { once: true });
  setTimeout(finish, ms + 80);
}

export function attachDrag(card: HTMLElement, on: DragHandlers): void {
  const cue = (name: string) => card.querySelector<HTMLElement>(name);
  const save = cue('.cue-save');
  const skip = cue('.cue-skip');
  const showCues = (a: number, b: number) => {
    if (save) save.style.opacity = String(a);
    if (skip) skip.style.opacity = String(b);
  };
  const threshold = () => card.offsetWidth * 0.35;
  let dragging = false;
  let moved = false;
  // Kept from pointerdown: once the card has captured the pointer, later events all name the card as target.
  let downTarget: Element = card;
  let startX = 0, startY = 0, dx = 0, dy = 0, lastX = 0, lastT = 0, vx = 0;

  card.addEventListener('keydown', (e) => {
    if (e.target !== card) return;
    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); on.tap(); }
    if (e.key === 'ArrowRight') flyOff(card, 1, on);
    if (e.key === 'ArrowLeft') flyOff(card, -1, on);
  });

  card.addEventListener('pointerdown', (e) => {
    const target = e.target as Element;
    if (target.closest('a, button')) return; // controls on the card are dead zones
    if (!target.closest('.scroll')) e.preventDefault(); // let the back of the card scroll
    dragging = true;
    moved = false;
    downTarget = target;
    startX = lastX = e.clientX;
    startY = e.clientY;
    dx = dy = vx = 0;
    lastT = e.timeStamp;
    try { card.setPointerCapture(e.pointerId); } catch { /* capture is nice-to-have */ }
    card.style.transition = 'none';
  });

  card.addEventListener('pointermove', (e) => {
    if (!dragging) return;
    dx = e.clientX - startX;
    dy = e.clientY - startY;
    if (Math.abs(dx) > 10 || Math.abs(dy) > 10) moved = true;
    const dt = e.timeStamp - lastT;
    if (dt > 0) { vx = (e.clientX - lastX) / dt; lastX = e.clientX; lastT = e.timeStamp; }
    card.style.transform = `translate(${dx}px, ${dy * 0.4}px) rotate(${dx * 0.04}deg)`;
    const p = dx / threshold();
    const a = Math.abs(p) < 0.3 ? 0 : Math.min(1, (Math.abs(p) - 0.3) / 0.7);
    showCues(p > 0 ? a : 0, p < 0 ? a : 0);
  });

  card.addEventListener('pointerup', (e) => {
    if (!dragging) return;
    dragging = false;
    const flick = Math.abs(vx) > FLICK && vx * dx > 0;
    if (Math.abs(dx) > threshold() || flick) {
      flyOff(card, dx > 0 ? 1 : -1, on, dy, dx, vx);
      return;
    }
    showCues(0, 0);
    card.style.transition = '';
    card.style.transform = '';
    if (!moved && !(e.target as Element).closest('a, button')) on.tap({ target: downTarget, x: e.clientX, y: e.clientY });
  });

  card.addEventListener('pointercancel', () => {
    dragging = false;
    card.style.transition = '';
    card.style.transform = '';
    showCues(0, 0);
  });
  card.addEventListener('dragstart', (e) => e.preventDefault());
}
