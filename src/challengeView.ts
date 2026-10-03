import { LEVELS, WINS_NEEDED, makeQuestion, type Level, type Option, type Question } from './challenge.ts';
import type { Dino, Lang } from './dinos.ts';
import { t } from './text.ts';

export interface ChallengeContext {
  lang: Lang;
  dinos: readonly Dino[];
  /** Animals that may appear in silhouette questions: open cards only, so locked ones stay a surprise. */
  matchPool: readonly Dino[];
  /** The card being played for. */
  target: Dino;
  artHtml(d: Dino): string;
  onWin(d: Dino): void;
}

/** Resolves to the ids whose picture actually loads. Missing art is normal until the images are made. */
function findImages(dinos: readonly Dino[]): Promise<string[]> {
  const probe = (d: Dino) =>
    new Promise<string | null>((resolve) => {
      const img = new Image();
      img.onload = () => resolve(d.id);
      img.onerror = () => resolve(null);
      img.src = `img/${d.id}.webp`;
    });
  return Promise.all(dinos.map(probe)).then((ids) => ids.filter((id): id is string => id !== null));
}

const AGES: Record<Level, string> = { small: '3–5', mid: '6–7', big: '8–10' };

export function renderLevelPicker(view: HTMLElement, ctx: ChallengeContext): void {
  const l = ctx.lang;
  view.innerHTML = `
    <section class="challenge">
      <div class="prize locked">${ctx.artHtml(ctx.target)}</div>
      <h2>${t(l, 'winThis')} ${ctx.target.name}</h2>
      <p class="hint">${t(l, 'howOld')}</p>
      <div class="levels">
        ${LEVELS.map((lv) => `<button type="button" class="big" data-level="${lv}">${AGES[lv]}<small>${t(l, 'years')}</small></button>`).join('')}
      </div>
    </section>`;
  view.querySelectorAll<HTMLButtonElement>('[data-level]').forEach((btn) =>
    btn.addEventListener('click', () => void play(view, ctx, btn.dataset.level as Level)),
  );
}

async function play(view: HTMLElement, ctx: ChallengeContext, level: Level): Promise<void> {
  const withImage = await findImages(ctx.matchPool);
  const byId = new Map(ctx.dinos.map((d) => [d.id, d]));
  const l = ctx.lang;
  let right = 0;

  const optionHtml = (o: Option, i: number): string => {
    if ('text' in o) return `<button type="button" class="big" data-i="${i}">${o.text[l]}</button>`;
    const d = byId.get(o.dino);
    return d ? `<button type="button" class="big pic" data-i="${i}" aria-label="${d.name}">${ctx.artHtml(d)}</button>` : '';
  };

  const showHtml = (q: Question): string => {
    if (!q.show) return '';
    if ('n' in q.show) return `<p class="count" aria-hidden="true">${q.show.emoji.repeat(q.show.n)}</p>`;
    const d = byId.get(q.show.silhouette);
    return d ? `<div class="shape locked">${ctx.artHtml(d)}</div>` : '';
  };

  const ask = (): void => {
    const q = makeQuestion(level, Math.random, ctx.target, ctx.dinos, withImage);
    view.innerHTML = `
      <section class="challenge">
        <p class="progress" aria-label="${right} / ${WINS_NEEDED}">${'⭐'.repeat(right)}${'☆'.repeat(WINS_NEEDED - right)}</p>
        ${showHtml(q)}
        <h2>${q.prompt[l]}</h2>
        <p class="hint" id="msg" aria-live="polite">&nbsp;</p>
        <div class="options">${q.options.map(optionHtml).join('')}</div>
      </section>`;
    view.querySelectorAll<HTMLButtonElement>('[data-i]').forEach((btn) =>
      btn.addEventListener('click', () => {
        if (Number(btn.dataset.i) !== q.answer) {
          btn.disabled = true;
          view.querySelector('#msg')!.textContent = t(l, 'tryAgain');
          return;
        }
        right++;
        btn.classList.add('right');
        view.querySelectorAll<HTMLButtonElement>('[data-i]').forEach((b) => (b.disabled = true));
        setTimeout(right >= WINS_NEEDED ? won : ask, 700);
      }),
    );
  };

  const won = (): void => {
    ctx.onWin(ctx.target);
    view.innerHTML = `
      <section class="challenge">
        <p class="progress">${'⭐'.repeat(WINS_NEEDED)}</p>
        <div class="prize">${ctx.artHtml(ctx.target)}</div>
        <h2>${t(l, 'youWon')} ${ctx.target.name}!</h2>
        <div class="levels">
          <a class="big" href="#/dino/${ctx.target.id}">${t(l, 'seeCard')}</a>
          <a class="big" href="#/utmaning">${t(l, 'oneMore')}</a>
        </div>
      </section>`;
  };

  ask();
}
