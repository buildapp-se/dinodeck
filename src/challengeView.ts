import { LEVELS, WINS_NEEDED, makeQuestion, type Level, type Option, type Question } from './challenge.ts';
import type { Dino, Lang } from './dinos.ts';
import { t } from './text.ts';
import { icon } from './icons.ts';

export interface ChallengeContext {
  lang: Lang;
  dinos: readonly Dino[];
  /** Animals that may appear in silhouette questions: open cards only, so locked ones stay a surprise. */
  matchPool: readonly Dino[];
  /** The card being played for. */
  target: Dino;
  wonCount: number;
  repeat?: boolean;
  artHtml(d: Dino): string;
  onWin(d: Dino): void;
  roar(d: Dino): void;
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

const AGES: Record<Level, string[]> = { small: ['3', '4', '5'], mid: ['6', '7'], big: ['8', '9', '10'] };
const stars = (count: number): string => `<div class="progress" aria-label="${count} av ${WINS_NEEDED}">${Array.from({ length: WINS_NEEDED }, (_, i) => `<span class="${i < count ? 'on' : ''}">${icon('challenge')}</span>`).join('')}</div>`;

export function renderLevelPicker(view: HTMLElement, ctx: ChallengeContext): void {
  const l = ctx.lang;
  view.innerHTML = `
    <section class="challenge">
      <div class="prize${ctx.repeat ? '' : ' locked'}">${ctx.artHtml(ctx.target)}</div>
      <h2>${ctx.repeat ? t(l, 'allWon') : `${t(l, 'winThis')} ${ctx.target.name}`}</h2>
      <p class="hint">${t(l, 'howOld')}</p>
      <div class="levels">
        ${LEVELS.map((lv) => `<button type="button" class="big" data-level="${lv}" aria-label="${AGES[lv][0]} ${l === 'sv' ? 'till' : 'to'} ${AGES[lv].at(-1)} ${t(l, 'years')}"><span class="ages">${AGES[lv].map((age) => `<span>${age}</span>`).join('')}</span><small>${t(l, 'years')}</small></button>`).join('')}
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
    if ('text' in o) return `<button type="button" class="big" data-i="${i}">${level === 'small' && /^\d+$/.test(o.text[l]) ? `<span class="answer-dots" aria-hidden="true">${'●'.repeat(Math.min(10, Number(o.text[l])))}</span>` : ''}${o.text[l]}</button>`;
    const d = byId.get(o.dino);
    return d ? `<button type="button" class="big pic" data-i="${i}" aria-label="${d.name}">${ctx.artHtml(d)}</button>` : '';
  };

  const showHtml = (q: Question): string => {
    if (!q.show) return '';
    if ('n' in q.show) return `<div class="count" aria-hidden="true">${Array.from({ length: q.show.n }, () => `<img src="img/tyrannosaurus-rex.webp" alt="">`).join('')}</div>`;
    const d = byId.get(q.show.silhouette);
    return d ? `<div class="shape locked">${ctx.artHtml(d)}</div>` : '';
  };

  const ask = (): void => {
    const q = makeQuestion(level, Math.random, ctx.target, ctx.dinos, withImage);
    view.innerHTML = `
      <section class="challenge">
        <p class="win-count">${ctx.wonCount} / 22</p>
        ${stars(right)}
        ${showHtml(q)}
        <h2${level === 'small' ? ' class="visually-hidden"' : ''}>${q.prompt[l]}</h2>
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
        btn.insertAdjacentHTML('afterbegin', icon('check'));
        if (right >= WINS_NEEDED) ctx.roar(ctx.target);
        view.querySelectorAll<HTMLButtonElement>('[data-i]').forEach((b) => (b.disabled = true));
        setTimeout(right >= WINS_NEEDED ? won : ask, 700);
      }),
    );
  };

  const won = (): void => {
    ctx.onWin(ctx.target);
    view.innerHTML = `
      <section class="challenge">
        ${stars(WINS_NEEDED)}
        <div class="prize reveal">${ctx.artHtml(ctx.target)}<div class="burst" aria-hidden="true">${Array.from({ length: 12 }, (_, i) => `<span style="--dx:${Math.round(Math.cos(i * Math.PI / 6) * 110)}px;--dy:${Math.round(Math.sin(i * Math.PI / 6) * 110)}px"></span>`).join('')}</div></div>
        <h2>${t(l, 'youWon')} ${ctx.target.name}!</h2>
        <div class="levels win-actions" hidden>
          <a class="big" href="#/">${l === 'sv' ? 'Till kortleken' : 'To the cards'}</a>
          <a class="big" href="#/scen/${ctx.target.id}">${l === 'sv' ? 'Ställ ut' : 'Display it'}</a>
        </div>
      </section>`;
    setTimeout(() => { const actions = view.querySelector<HTMLElement>('.win-actions'); if (actions) actions.hidden = false; }, matchMedia('(prefers-reduced-motion: reduce)').matches ? 300 : 1100);
  };

  ask();
}
