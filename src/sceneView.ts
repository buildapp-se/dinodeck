import type { Dino, Lang, Period } from './dinos.ts';
import { MAX_SCENE_ITEMS, MAX_SIZE, MIN_SIZE, type Scene, type SceneItem } from './state.ts';
import { periodName, t } from './text.ts';

export interface SceneContext {
  lang: Lang;
  /** Only open cards can be placed: winning a card is what brings the animal here. */
  open: readonly Dino[];
  scene: Scene;
  save(): void;
}

const PERIODS: readonly Period[] = ['triassic', 'jurassic', 'cretaceous'];
const clamp = (v: number, lo: number, hi: number): number => Math.min(hi, Math.max(lo, v));

/** Bigger animals start bigger, so a Diplodocus dwarfs a Velociraptor before anyone resizes anything. */
const startSize = (d: Dino): number => clamp(0.12 + (d.lengthM / 35) * 0.5, MIN_SIZE, MAX_SIZE);

export function renderScene(view: HTMLElement, ctx: SceneContext): void {
  const { lang: l, scene } = ctx;
  let selected: SceneItem | null = null;

  view.innerHTML = `
    <section class="scene">
      <div class="seg" role="group">
        ${PERIODS.map((p) => `<button type="button" data-bg="${p}">${periodName(l, p)}</button>`).join('')}
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

  // An animal without a picture cannot be placed, so its tray button goes too.
  // The button is looked up now: by the time this fires, the page-wide handler has already detached the <img>.
  view.querySelectorAll<HTMLImageElement>('.tray img').forEach((img) => {
    const button = img.parentElement;
    img.addEventListener('error', () => button?.remove());
  });

  const place = (el: HTMLElement, item: SceneItem): void => {
    el.style.left = `${item.x * 100}%`;
    el.style.top = `${item.y * 100}%`;
    el.style.width = `${item.size * 100}%`;
    el.style.zIndex = String(Math.round(item.y * 100)); // lower on the ground = closer = in front
    el.style.transform = `translate(-50%, -50%) scaleX(${item.flip ? -1 : 1})`;
    el.classList.toggle('selected', item === selected);
  };

  const draw = (): void => {
    stage.dataset.bg = scene.bg;
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
    el.addEventListener('pointerdown', (e) => {
      e.preventDefault();
      e.stopPropagation();
      down = true;
      selected = item;
      const r = stage.getBoundingClientRect();
      offX = e.clientX - (r.left + item.x * r.width);
      offY = e.clientY - (r.top + item.y * r.height);
      try { el.setPointerCapture(e.pointerId); } catch { /* capture is nice-to-have */ }
      stage.querySelectorAll('.item').forEach((i) => i.classList.toggle('selected', i === el));
      tools.classList.add('on');
    });
    el.addEventListener('pointermove', (e) => {
      if (!down) return;
      const r = stage.getBoundingClientRect();
      item.x = clamp((e.clientX - offX - r.left) / r.width, 0, 1);
      item.y = clamp((e.clientY - offY - r.top) / r.height, 0, 1);
      place(el, item);
    });
    const up = (): void => {
      if (!down) return;
      down = false;
      ctx.save();
    };
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
      // A little scatter so two taps do not stack exactly on top of each other.
      selected = { id: d.id, x: 0.3 + Math.random() * 0.4, y: 0.62 + Math.random() * 0.2, size: startSize(d), flip: false };
      scene.items.push(selected);
      ctx.save();
      draw();
    }),
  );

  tools.addEventListener('click', (e) => {
    const tool = (e.target as Element).closest<HTMLElement>('[data-tool]')?.dataset.tool;
    if (!tool || !selected) return;
    if (tool === 'bigger') selected.size = clamp(selected.size * 1.2, MIN_SIZE, MAX_SIZE);
    if (tool === 'smaller') selected.size = clamp(selected.size / 1.2, MIN_SIZE, MAX_SIZE);
    if (tool === 'flip') selected.flip = !selected.flip;
    if (tool === 'remove') {
      scene.items.splice(scene.items.indexOf(selected), 1);
      selected = null;
    }
    ctx.save();
    draw();
  });

  draw();
}
