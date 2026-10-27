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
  /** Set by "One more": play straight away at the level just played. */
  level?: Level;
  artHtml(d: Dino): string;
  oneMore(level: Level): void;
  onWin(d: Dino): void;
  roar(d: Dino): void;
  /** Right, wrong and win sounds; quiet when sound is off. */
  chime(kind: 'right' | 'wrong' | 'win', step?: number): void;
  /** Reads a question aloud (public/audio/prompt-<key>-<lang>.mp3); quiet when sound is off. */
  say(key: string): void;
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
const sayBtn = (key: string, l: Lang): string => `<button type="button" class="say-btn" data-sound="prompt-${key}-${l}" aria-label="${t(l, 'listen')}">${icon('sound')}</button>`;
const stars = (count: number, l: Lang): string => `<div class="progress" aria-label="${count} ${l === 'sv' ? 'av' : 'of'} ${WINS_NEEDED}">${Array.from({ length: WINS_NEEDED }, (_, i) => `<span class="${i < count ? 'on' : ''}">${icon('challenge')}</span>`).join('')}</div>`;

// Short buzzes where the device has them (Android); iPhones ignore this.
const buzz = (pattern: number | number[]): void => { try { navigator.vibrate?.(pattern); } catch { /* not allowed here */ } };

/** 24 dots flying out from the centre: the win here and the hatched egg. */
export const burstHtml = (): string => `<div class="burst" aria-hidden="true">${Array.from({ length: 24 }, (_, i) => { const r = i % 2 ? 80 : 140; return `<span style="--dx:${Math.round(Math.cos(i * Math.PI / 12) * r)}px;--dy:${Math.round(Math.sin(i * Math.PI / 12) * r)}px"></span>`; }).join('')}</div>`;

export function renderLevelPicker(view: HTMLElement, ctx: ChallengeContext): void {
  if (ctx.level) return void play(view, ctx, ctx.level);
  const l = ctx.lang;
  view.innerHTML = `
    <section class="challenge">
      <div class="prize${ctx.repeat ? '' : ' locked'}">${ctx.artHtml(ctx.target)}</div>
      <h2>${ctx.repeat ? t(l, 'allWon') : `${t(l, 'winThis')} ${ctx.target.name}`}</h2>
      <p class="hint">${t(l, 'howOld')} ${sayBtn('how-old', l)}</p>
      <div class="levels">
        ${LEVELS.map((lv) => `<button type="button" class="big" data-level="${lv}" aria-label="${AGES[lv][0]} ${l === 'sv' ? 'till' : 'to'} ${AGES[lv].at(-1)} ${t(l, 'years')}"><span class="ages">${AGES[lv].map((age) => `<span>${age}</span>`).join('')}</span><small>${t(l, 'years')}</small></button>`).join('')}
      </div>
    </section>`;
  ctx.say('how-old');
  view.querySelectorAll<HTMLButtonElement>('[data-level]').forEach((btn) =>
    btn.addEventListener('click', () => void play(view, ctx, btn.dataset.level as Level)),
  );
}

async function play(view: HTMLElement, ctx: ChallengeContext, level: Level): Promise<void> {
  // The child can leave mid-game: the image probe and the 700 ms pauses must not draw over the next view.
  const here = location.hash;
  const gone = (): boolean => location.hash !== here;
  const withImage = await findImages(ctx.matchPool);
  if (gone()) return;
  const toWin = ctx.dinos.filter((d) => !d.starter).length;
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
    if (gone()) return;
    const q = makeQuestion(level, Math.random, ctx.target, ctx.dinos, withImage);
    view.innerHTML = `
      <section class="challenge">
        <p class="win-count" aria-label="${ctx.wonCount} ${l === 'sv' ? 'av' : 'of'} ${toWin}"><span class="collect"><i style="width:${Math.round((100 * ctx.wonCount) / toWin)}%"></i></span>${ctx.wonCount} / ${toWin}</p>
        ${stars(right, l)}
        ${showHtml(q)}
        <h2${level === 'small' ? ' class="visually-hidden"' : ''}>${q.prompt[l]}</h2>
        ${q.say ? `<p class="say-again">${sayBtn(q.say, l)}</p>` : ''}
        <p class="hint" id="msg" aria-live="polite">&nbsp;</p>
        <div class="options">${q.options.map(optionHtml).join('')}</div>
      </section>`;
    // Read aloud for the two younger levels, a moment after the question appears.
    const say = q.say;
    if (say && level !== 'big') setTimeout(() => { if (!gone()) ctx.say(say); }, 300);
    view.querySelectorAll<HTMLButtonElement>('[data-i]').forEach((btn) =>
      btn.addEventListener('click', () => {
        if (Number(btn.dataset.i) !== q.answer) {
          btn.disabled = true;
          btn.classList.add('wrong');
          buzz([10, 40, 10]);
          ctx.chime('wrong');
          if (level !== 'big') ctx.say('try-again');
          view.querySelector('#msg')!.textContent = t(l, 'tryAgain');
          return;
        }
        right++;
        btn.classList.add('right');
        btn.insertAdjacentHTML('afterbegin', icon('check'));
        buzz(15);
        ctx.chime('right', right - 1);
        view.querySelectorAll<HTMLButtonElement>('[data-i]').forEach((b) => (b.disabled = true));
        setTimeout(right >= WINS_NEEDED ? won : ask, 700);
      }),
    );
  };

  const won = (): void => {
    ctx.onWin(ctx.target); // earned even if the child already left
    if (gone()) return;
    // The roar comes with the colour, not before the card is shown.
    ctx.chime('win');
    setTimeout(() => { if (!gone()) { ctx.roar(ctx.target); buzz([30, 50, 60]); } }, matchMedia('(prefers-reduced-motion: reduce)').matches ? 0 : 600);
    view.innerHTML = `
      <section class="challenge">
        ${stars(WINS_NEEDED, l)}
        <div class="prize reveal">${ctx.artHtml(ctx.target)}${burstHtml()}</div>
        <h2>${t(l, 'youWon')} ${ctx.target.name}!</h2>
        <div class="levels win-actions" hidden>
          <a class="big primary" href="#/scen/${ctx.target.id}">${l === 'sv' ? 'Ställ ut' : 'Display it'}</a>
          <button type="button" class="big again">${t(l, 'oneMore')}</button>
          <a class="big secondary" href="#/">${l === 'sv' ? 'Till kortleken' : 'To the cards'}</a>
        </div>
      </section>`;
    view.querySelector('.again')!.addEventListener('click', () => ctx.oneMore(level));
    setTimeout(() => { const actions = view.querySelector<HTMLElement>('.win-actions'); if (actions) actions.hidden = false; }, matchMedia('(prefers-reduced-motion: reduce)').matches ? 300 : 1100);
  };

  ask();
}
