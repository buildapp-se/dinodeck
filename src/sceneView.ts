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
  save(): void;
  /** The scene as a colouring page. */
  print(): void;
  /** Two quick taps on a placed animal. */
  roar(id: string, el: HTMLElement): void;
}

const PERIODS: readonly Period[] = ['triassic', 'jurassic', 'cretaceous'];
const clamp = (v: number, lo: number, hi: number): number => Math.min(hi, Math.max(lo, v));

/** Bigger animals start bigger, so a Diplodocus dwarfs a Velociraptor before anyone resizes anything. */
const startSize = (d: Dino): number => clamp(0.12 + (d.lengthM / 35) * 0.5, MIN_SIZE, MAX_SIZE);

export function renderScene(view: HTMLElement, ctx: SceneContext): void {
  const { lang: l, scene } = ctx;
  let selected: SceneItem | null = null;
  const fromPrize = ctx.open.find((animal) => animal.id === ctx.selectId);
  if (fromPrize && scene.items.length < MAX_SCENE_ITEMS) {
    selected = { id: fromPrize.id, x: 0.5, y: 0.7, size: startSize(fromPrize), flip: false };
    scene.items.push(selected);
    ctx.save();
  }

  view.innerHTML = `
    <section class="scene">
      <div class="seg" role="group">
        ${PERIODS.map((p) => `<button type="button" data-bg="${p}"><img src="img/bg-${p}.webp" alt="">${periodName(l, p)}</button>`).join('')}
        <button type="button" class="print-btn" data-print aria-label="${t(l, 'printColour')}">${icon('print')}</button>
      </div>
      <div class="stage"></div>
      <div class="tools">
        <button type="button" data-tool="smaller" aria-label="${t(l, 'smaller')}">−</button>
        <button type="button" data-tool="bigger" aria-label="${t(l, 'bigger')}">+</button>
        <button type="button" data-tool="flip" aria-label="${t(l, 'turn')}">⇄</button>
        <button type="button" data-tool="remove" aria-label="${t(l, 'takeAway')}">✕</button>
      </div>
      <div class="tray">
        ${ctx.open.map((d) => `<button type="button" data-add="${d.id}" aria-label="${d.name}"><img src="img/${d.id}.webp" alt=""></button>`).join('')}
      </div>
    </section>`;

  const stage = view.querySelector<HTMLElement>('.stage')!;
  const tools = view.querySelector<HTMLElement>('.tools')!;
  const frame = () => {
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
    const f = frame();
    el.style.left = `${f.left + item.x * f.worldWidth}px`;
    el.style.top = `${f.top + item.y * f.worldHeight}px`;
    el.style.width = `${item.size * f.worldWidth}px`;
    el.style.transform = `translate(-50%, -50%) scaleX(${item.flip ? -1 : 1})`;
    el.classList.toggle('selected', item === selected);
  };

  const draw = (): void => {
    stage.dataset.bg = scene.bg;
    stage.classList.toggle('empty-stage', scene.items.length === 0);
    stage.innerHTML = `<img class="bg" src="img/bg-${scene.bg}.webp" alt="">`;
    for (const item of scene.items) {
      const el = document.createElement('img');
      el.className = 'item';
      el.src = `img/${item.id}.webp`;
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
      selected = { id: d.id, x: 0.5, y: 0.7, size: startSize(d), flip: false };
      scene.items.push(selected);
      ctx.save();
      draw();
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

  draw();
  new ResizeObserver(() => stage.querySelectorAll<HTMLElement>('.item').forEach((el, index) => {
    const item = scene.items[index];
    if (item) place(el, item);
  })).observe(stage);
}
