import type { Dino, Lang, Period } from './dinos.ts';
import { MAX_SCENE_ITEMS, MAX_SIZE, MIN_SIZE, type Scene, type SceneItem } from './state.ts';
import { icon } from './icons.ts';
import { periodName, t } from './text.ts';

export interface SceneContext {
  lang: Lang;
  /** Only open cards can be placed: winning a card is what brings the animal here. */
  open: readonly Dino[];
  scene: Scene;
  selectId?: string;
  /** Image path per animal: the cute style swaps some (src/cute.ts). */
  art(id: string): string;
  save(): void;
  /** The scene as a colouring page. */
  print(): void;
  /** Two quick taps on a placed animal. */
  roar(id: string, el: HTMLElement): void;
}

const PERIODS: readonly Period[] = ['triassic', 'jurassic', 'cretaceous'];
const clamp = (v: number, lo: number, hi: number): number => Math.min(hi, Math.max(lo, v));

export interface StageFrame {
  worldWidth: number;
  worldHeight: number;
  left: number;
  top: number;
}

/** How an item sits on the stage. The position goes in `translate`, never left/top: left/top would run layout on every pointermove while dragging. */
export const itemStyle = (f: StageFrame, item: SceneItem): { translate: string; width: string; transform: string } => ({
  translate: `${f.left + item.x * f.worldWidth}px ${f.top + item.y * f.worldHeight}px`,
  width: `${item.size * f.worldWidth}px`,
  transform: `translate(-50%, -50%) scaleX(${item.flip ? -1 : 1})`,
});

/** Bigger animals start bigger, so a Diplodocus dwarfs a Velociraptor before anyone resizes anything. */
const startSize = (d: Dino): number => clamp(0.12 + (d.lengthM / 35) * 0.5, MIN_SIZE, MAX_SIZE);

export function renderScene(view: HTMLElement, ctx: SceneContext): void {
  const { lang: l, scene } = ctx;
  let selected: SceneItem | null = null;
  // Set when an animal is placed right now: it drops in with a bounce instead of just appearing.
  let fresh: SceneItem | null = null;
  const fromPrize = ctx.open.find((animal) => animal.id === ctx.selectId);
  if (fromPrize && scene.items.length < MAX_SCENE_ITEMS) {
    selected = { id: fromPrize.id, x: 0.5, y: 0.7, size: startSize(fromPrize), flip: false };
    fresh = selected;
    scene.items.push(selected);
    ctx.save();
  }
  // Forget the id once it is placed, or Back, reload or a relaunch on this address adds another copy.
  if (ctx.selectId) history.replaceState(null, '', '#/scen');

  view.innerHTML = `
    <section class="scene">
      <div class="seg" role="group">
        ${PERIODS.map((p) => `<button type="button" data-bg="${p}"><img src="img/bg-${p}.webp" alt="">${periodName(l, p)}</button>`).join('')}
        <button type="button" class="print-btn" data-print aria-label="${t(l, 'printColour')}">${icon('print')}</button>
      </div>
      <div class="stage"></div>
      <div class="tools">
        <button type="button" data-tool="smaller" aria-label="${t(l, 'smaller')}">${icon('minus')}</button>
        <button type="button" data-tool="bigger" aria-label="${t(l, 'bigger')}">${icon('plus')}</button>
        <button type="button" data-tool="flip" aria-label="${t(l, 'turn')}">${icon('mirror')}</button>
        <button type="button" data-tool="remove" aria-label="${t(l, 'takeAway')}">${icon('close')}</button>
      </div>
      <div class="tray">
        ${ctx.open.map((d) => `<button type="button" data-add="${d.id}" aria-label="${d.name}"><img src="${ctx.art(d.id)}" alt=""></button>`).join('')}
      </div>
    </section>`;

  const stage = view.querySelector<HTMLElement>('.stage')!;
  const tools = view.querySelector<HTMLElement>('.tools')!;
  const frame = (): StageFrame => {
    const { width, height } = stage.getBoundingClientRect();
    const worldHeight = Math.max(height, width / 1.5);
    const worldWidth = worldHeight * 1.5;
    return { worldWidth, worldHeight, left: (width - worldWidth) / 2, top: (height - worldHeight) / 2 };
  };

  // An animal without a picture cannot be placed, so its tray button goes too.
  // The button is looked up now: by the time this fires, the page-wide handler has already detached the <img>.
  view.querySelectorAll<HTMLImageElement>('.tray img').forEach((img) => {
    const button = img.parentElement;
    img.addEventListener('error', () => button?.remove());
  });

  const place = (el: HTMLElement, item: SceneItem): void => {
    const s = itemStyle(frame(), item);
    el.style.translate = s.translate;
    el.style.width = s.width;
    el.style.transform = s.transform;
    el.classList.toggle('selected', item === selected);
  };

  const draw = (): void => {
    stage.dataset.bg = scene.bg;
    stage.classList.toggle('empty-stage', scene.items.length === 0);
    stage.innerHTML = `<img class="bg" src="img/bg-${scene.bg}.webp" alt="">`;
    for (const item of scene.items) {
      const el = document.createElement('img');
      el.className = 'item';
      el.src = ctx.art(item.id);
      el.alt = '';
      el.draggable = false;
      place(el, item);
      drag(el, item);
      stage.append(el);
    }
    tools.classList.toggle('on', selected !== null);
    view.querySelectorAll<HTMLButtonElement>('[data-bg]').forEach((b) =>
      b.setAttribute('aria-pressed', String(b.dataset.bg === scene.bg)),
    );
  };

  /** A new animal falls in from above and lands with a bounce. The last keyframe is place()'s own transform. */
  const dropIn = (item: SceneItem): void => {
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const el = stage.querySelectorAll<HTMLElement>('.item')[scene.items.indexOf(item)];
    if (!el) return;
    const s = item.flip ? -1 : 1;
    el.animate([
      { transform: `translate(-50%, -50%) translateY(-140%) scaleX(${s})`, easing: 'ease-in' },
      { transform: `translate(-50%, -50%) translateY(5%) scaleX(${s})`, offset: 0.65, easing: 'ease-out' },
      { transform: `translate(-50%, -50%) translateY(-2.5%) scaleX(${s})`, offset: 0.82 },
      { transform: `translate(-50%, -50%) scaleX(${s})` },
    ], 600);
  };

  const drag = (el: HTMLElement, item: SceneItem): void => {
    let offX = 0;
    let offY = 0;
    let down = false;
    let moved = false;
    let lastTap = 0;
    el.addEventListener('pointerdown', (e) => {
      e.preventDefault();
      e.stopPropagation();
      down = true;
      moved = false;
      selected = item;
      const r = stage.getBoundingClientRect();
      const f = frame();
      offX = e.clientX - (r.left + f.left + item.x * f.worldWidth);
      offY = e.clientY - (r.top + f.top + item.y * f.worldHeight);
      try { el.setPointerCapture(e.pointerId); } catch { /* capture is nice-to-have */ }
      stage.querySelectorAll('.item').forEach((i) => i.classList.toggle('selected', i === el));
      tools.classList.add('on');
    });
    el.addEventListener('pointermove', (e) => {
      if (!down) return;
      moved = true;
      const r = stage.getBoundingClientRect();
      const f = frame();
      item.x = clamp((e.clientX - offX - r.left - f.left) / f.worldWidth, 0, 1);
      item.y = clamp((e.clientY - offY - r.top - f.top) / f.worldHeight, 0, 1);
      place(el, item);
    });
    const up = (): void => {
      if (!down) return;
      down = false;
      ctx.save();
    };
    // Counted by hand: the browser's own dblclick does not fire reliably for a finger on an element that is also dragged.
    el.addEventListener('pointerup', (e) => {
      if (!down || moved) return;
      if (e.timeStamp - lastTap < 400) {
        lastTap = 0;
        ctx.roar(item.id, el);
      } else lastTap = e.timeStamp;
    });
    el.addEventListener('pointerup', up);
    el.addEventListener('pointercancel', up);
  };

  stage.addEventListener('pointerdown', () => {
    selected = null;
    draw();
  });

  view.querySelectorAll<HTMLButtonElement>('[data-bg]').forEach((b) =>
    b.addEventListener('click', () => {
      scene.bg = b.dataset.bg as Period;
      ctx.save();
      draw();
    }),
  );

  view.querySelectorAll<HTMLButtonElement>('[data-add]').forEach((b) =>
    b.addEventListener('click', () => {
      const d = ctx.open.find((x) => x.id === b.dataset.add);
      if (!d || scene.items.length >= MAX_SCENE_ITEMS) return;
      selected = { id: d.id, x: 0.5 + [0, -0.1, 0.1, -0.2, 0.2][scene.items.length % 5]!, y: 0.7, size: startSize(d), flip: false };
      scene.items.push(selected);
      ctx.save();
      draw();
      dropIn(selected);
    }),
  );

  view.querySelector('[data-print]')!.addEventListener('click', () => ctx.print());

  tools.addEventListener('click', (e) => {
    const tool = (e.target as Element).closest<HTMLElement>('[data-tool]')?.dataset.tool;
    if (!tool || !selected) return;
    if (tool === 'bigger' || tool === 'smaller') {
      selected.size = clamp(selected.size * (tool === 'bigger' ? 1.2 : 1 / 1.2), MIN_SIZE, MAX_SIZE);
      const index = scene.items.indexOf(selected);
      if (index !== -1) {
        scene.items.splice(index, 1);
        if (tool === 'bigger') scene.items.push(selected);
        else scene.items.unshift(selected);
      }
    }
    if (tool === 'flip') selected.flip = !selected.flip;
    if (tool === 'remove') {
      scene.items.splice(scene.items.indexOf(selected), 1);
      selected = null;
    }
    ctx.save();
    draw();
  });

  // Delete (Backspace on a Mac keyboard) does what the take-away button does.
  const onKey = (e: KeyboardEvent): void => {
    if (!stage.isConnected) return document.removeEventListener('keydown', onKey);
    if ((e.key === 'Delete' || e.key === 'Backspace') && selected) {
      e.preventDefault();
      tools.querySelector<HTMLElement>('[data-tool="remove"]')!.click();
    }
  };
  document.addEventListener('keydown', onKey);

  draw();
  if (fresh) dropIn(fresh);
  // Redraw rather than re-place by index: a picture that failed to load is removed, which would shift the indexes.
  // The first notification only repeats the size draw() already drew with, and would replace a dropping animal mid-bounce.
  let size = stage.getBoundingClientRect();
  const watch = new ResizeObserver(() => {
    if (!stage.isConnected) return watch.disconnect();
    const r = stage.getBoundingClientRect();
    if (r.width === size.width && r.height === size.height) return;
    size = r;
    draw();
  });
  watch.observe(stage);
}
