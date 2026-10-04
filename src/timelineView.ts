import type { Dino, Lang, Period } from './dinos.ts';
import { periodName, t } from './text.ts';
import { BOUNDS, START_MYA, layoutTimelineCompact, xOf } from './timeline.ts';

export interface TimelineContext {
  lang: Lang;
  dinos: readonly Dino[];
  isOpen(d: Dino): boolean;
}

const PAD = 70; // empty room before the strip starts
const END = 150; // room for the "today" label after its line
const PERIODS: readonly Period[] = ['triassic', 'jurassic', 'cretaceous'];

// Kept between visits, so coming back from a card lands where the child was.
let keptScroll = -1;

export function renderTimeline(view: HTMLElement, ctx: TimelineContext): void {
  const l = ctx.lang;
  const tablet = window.innerWidth >= 900;
  const ITEM_W = tablet ? 112 : 104;
  const lanes = tablet && window.innerHeight < 840 ? 4 : 5;
  let PX_PER_MYA = tablet ? 14 : 18;
  let items: ReturnType<typeof layoutTimelineCompact>['items'] = [];
  // Dense catalogues may need a slightly longer strip to retain five readable rows.
  for (; PX_PER_MYA <= 50; PX_PER_MYA += 2) {
    try { items = layoutTimelineCompact(ctx.dinos, PX_PER_MYA, ITEM_W, lanes).items; break; }
    catch { /* try the next scale */ }
  }
  if (!items.length) throw new Error('Timeline layout could not fit the catalogue');
  const byId = new Map(ctx.dinos.map((d) => [d.id, d]));
  const x = (mya: number): number => PAD + xOf(mya, PX_PER_MYA);
  const width = x(0) + END;
  const pct = (mya: number): number => ((START_MYA - mya) / START_MYA) * 100;

  // The point of the whole view, in numbers taken from the catalogue.
  const rex = byId.get('tyrannosaurus-rex');
  const stego = byId.get('stegosaurus');
  const gaps = rex && stego
    ? `<div class="mini-gaps">
        <span style="left:${pct(stego.toMya)}%;width:${pct(rex.fromMya) - pct(stego.toMya)}%">${stego.toMya - rex.fromMya} ${t(l, 'myShort')}</span>
        <span style="left:${pct(rex.toMya)}%;width:${100 - pct(rex.toMya)}%">${rex.toMya} ${t(l, 'myShort')}</span>
      </div>
      <p class="mini-note">${t(l, 'closer')}</p>`
    : '';
  const miniIcon = (d: Dino | undefined, mya: number): string =>
    d ? `<img src="img/${d.id}.webp" alt="" style="left:${pct(mya)}%">` : '';

  view.innerHTML = `
    <section class="timeline">
      <div class="mini">
        <div class="mini-bands">
          ${PERIODS.map((p) => `<i data-bg="${p}" style="flex:${BOUNDS[p][0] - BOUNDS[p][1]}"></i>`).join('')}
          <i style="flex:${BOUNDS.cretaceous[1]}"></i>
          ${miniIcon(stego, stego?.toMya ?? 0)}${miniIcon(rex, rex?.toMya ?? 0)}
          <span class="mini-view"></span>
        </div>
        ${gaps}
      </div>
      <div class="strip">
        <div class="track" style="width:${width}px;--lanes:${lanes}">
          ${PERIODS.map((p) => `<div class="band" data-bg="${p}" style="left:${x(BOUNDS[p][0])}px;width:${x(BOUNDS[p][1]) - x(BOUNDS[p][0])}px"><b>${periodName(l, p)}</b></div>`).join('')}
          ${[250, 200, 150, 100, 50].map((m) => `<span class="tick" style="left:${x(m)}px">${m} ${t(l, 'mya')}</span>`).join('')}
          ${items.map((i) => {
            const d = byId.get(i.id)!;
            return `<a class="tl-item${ctx.isOpen(d) ? '' : ' locked'}" href="#/dino/${d.id}" draggable="false" style="left:${PAD + i.x}px;--lane:${i.lane}"><img src="img/${d.id}.webp" alt="" draggable="false"><span lang="la">${d.name}</span></a>`;
          }).join('')}
          <span class="mark" style="left:${x(BOUNDS.cretaceous[1])}px"><span aria-hidden="true">☄️</span>${t(l, 'asteroid')}</span>
          <span class="mark" style="left:${x(0)}px"><span aria-hidden="true">🏠</span>${t(l, 'today')}</span>
        </div>
      </div>
    </section>`;

  const strip = view.querySelector<HTMLElement>('.strip')!;
  const box = view.querySelector<HTMLElement>('.mini-view')!;
  const showWhere = (): void => {
    box.style.left = `${(strip.scrollLeft / width) * 100}%`;
    box.style.width = `${Math.min(100, (strip.clientWidth / width) * 100)}%`;
  };
  // First visit opens on the oldest animal, not on the empty start of the Triassic.
  strip.scrollLeft = keptScroll >= 0 ? keptScroll : PAD + (items[0]?.x ?? 0) - ITEM_W;
  strip.addEventListener('scroll', () => { keptScroll = strip.scrollLeft; showWhere(); }, { passive: true });
  showWhere();

  // The overview is a handle too: a press or a drag on it moves the strip so that point is in the middle.
  const bands = view.querySelector<HTMLElement>('.mini-bands')!;
  let steering = false;
  const steer = (e: PointerEvent): void => {
    const r = bands.getBoundingClientRect();
    strip.scrollLeft = ((e.clientX - r.left) / r.width) * width - strip.clientWidth / 2;
  };
  bands.addEventListener('pointerdown', (e) => {
    steering = true;
    try { bands.setPointerCapture(e.pointerId); } catch { /* capture is nice-to-have */ }
    steer(e);
  });
  bands.addEventListener('pointermove', (e) => { if (steering) steer(e); });
  const release = (): void => { steering = false; };
  bands.addEventListener('pointerup', release);
  bands.addEventListener('pointercancel', release);

  // Touch scrolls the strip natively. A mouse has to drag it, and a drag must not count as a click on an animal.
  let from: { x: number; left: number } | null = null;
  let dragged = false;
  strip.addEventListener('pointerdown', (e) => {
    if (e.pointerType !== 'mouse') return;
    from = { x: e.clientX, left: strip.scrollLeft };
    dragged = false;
  });
  strip.addEventListener('pointermove', (e) => {
    if (!from) return;
    if (Math.abs(e.clientX - from.x) > 5) dragged = true;
    if (dragged) strip.scrollLeft = from.left - (e.clientX - from.x);
  });
  const stop = (): void => { from = null; };
  strip.addEventListener('pointerup', stop);
  strip.addEventListener('pointerleave', stop);
  strip.addEventListener('click', (e) => { if (dragged) e.preventDefault(); }, true);
}
