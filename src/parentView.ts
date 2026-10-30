import type { State } from './state.ts';
import { buildTime, t } from './text.ts';

export interface ParentContext {
  state: State;
  /** ISO time of the build. */
  build: string;
  /** How far the child has come, for the summary at the top. Names newest first. */
  progress: { won: number; toWin: number; hatched: number; babies: number; latest: string[] };
  /** The animals the child has open: only those can be printed, as on their own card. */
  printable: { id: string; name: string }[];
  print(ids: string[]): void;
  /** Each changes the state and saves it; the view then redraws itself. */
  toggleUnlock(): void;
  toggleMute(): void;
  toggleCute(): void;
  toggleLang(): void;
  reset(): void;
}

const HOLD_MS = 3000;

/** A press that lasts three seconds: long enough that a small child does not get in by accident. */
export function attachHold(button: HTMLElement, onHeld: () => void, onShort: () => void): void {
  let timer = 0;
  const stop = (): boolean => {
    const was = timer !== 0;
    clearTimeout(timer);
    timer = 0;
    button.classList.remove('holding');
    return was;
  };
  const start = (): void => {
    if (timer) return;
    button.classList.add('holding');
    timer = window.setTimeout(() => { stop(); onHeld(); }, HOLD_MS);
  };
  button.addEventListener('pointerdown', start);
  button.addEventListener('pointerup', () => { if (stop()) onShort(); });
  button.addEventListener('pointerleave', stop);
  button.addEventListener('pointercancel', stop);
  button.addEventListener('contextmenu', (e) => e.preventDefault()); // a long press on a phone opens a menu otherwise
  button.addEventListener('keydown', (e) => { if ((e.key === 'Enter' || e.key === ' ') && !e.repeat) start(); });
  button.addEventListener('keyup', () => { if (stop()) onShort(); });
}

const meter = (n: number, of: number): string =>
  `<span class="collect" aria-hidden="true"><i style="width:${of ? Math.round((100 * n) / of) : 0}%"></i></span>`;

/** What a parent wants to know at a glance: how many cards and babies, and which cards came last. */
function summaryHtml(ctx: ParentContext): string {
  const l = ctx.state.lang;
  const p = ctx.progress;
  return `
    <dl class="summary">
      <dt>${t(l, 'cardsWon')}</dt><dd>${meter(p.won, p.toWin)} ${p.won} / ${p.toWin}</dd>
      <dt>${t(l, 'babiesHatched')}</dt><dd>${meter(p.hatched, p.babies)} ${p.hatched} / ${p.babies}</dd>
      <dt>${t(l, 'favorites')}</dt><dd>${ctx.state.favorites.length}</dd>
      <dt>${t(l, 'latestWon')}</dt><dd lang="la">${p.latest.length ? p.latest.join(', ') : `<span lang="${l}">${t(l, 'noneYet')}</span>`}</dd>
    </dl>`;
}

/** Colouring pages for several animals at once. The child's favourites start ticked. */
function printPickHtml(ctx: ParentContext): string {
  const l = ctx.state.lang;
  const ticked = ctx.printable.filter((d) => ctx.state.favorites.includes(d.id)).length;
  return `
    <details class="print-pick">
      <summary class="row">${t(l, 'printMany')}</summary>
      <div class="pick-tools">
        <button type="button" class="chip" data-pick="all">${t(l, 'pickAll')}</button>
        <button type="button" class="chip" data-pick="none">${t(l, 'pickNone')}</button>
      </div>
      <ul class="pick-list">${ctx.printable
        .map((d) => `<li><label lang="la"><input type="checkbox" value="${d.id}"${ctx.state.favorites.includes(d.id) ? ' checked' : ''}>${d.name}</label></li>`)
        .join('')}</ul>
      <button type="button" class="big" data-act="print"${ticked ? '' : ' disabled'}>${t(l, 'printGo')} (${ticked})</button>
    </details>`;
}

export function renderParent(view: HTMLElement, ctx: ParentContext, note = ''): void {
  const { state } = ctx;
  const l = state.lang;
  view.innerHTML = `
    <section class="challenge parent">
      <h2>${t(l, 'parent')}</h2>
      ${summaryHtml(ctx)}
      <button type="button" class="row" data-act="unlock" role="switch" aria-checked="${state.unlockAll}">${t(l, 'unlockAll')} <span class="switch" aria-hidden="true"></span></button>
      <button type="button" class="row" data-act="mute" role="switch" aria-checked="${!state.muted}">${t(l, 'soundOn')} <span class="switch" aria-hidden="true"></span></button>
      <button type="button" class="row" data-act="cute" role="switch" aria-checked="${state.cute}">${t(l, 'cute')} <span class="switch" aria-hidden="true"></span></button>
      <button type="button" class="row" data-act="lang">${t(l, 'language')} <b>${t(l, 'thisLang')}</b></button>
      ${printPickHtml(ctx)}
      <a class="big" href="#/">${t(l, 'done')}</a>
      <button type="button" class="row danger" data-act="reset">${t(l, 'reset')}</button>
      <p class="hint" role="status">${note}</p>
      <p class="source">${t(l, 'roarCredit')}</p>
      <p class="source"><a href="integritet.html">${t(l, 'privacy')}</a> · <a href="licenser.txt">${t(l, 'licences')}</a> · ${t(l, 'version')} ${buildTime(l, ctx.build)}</p>
    </section>`;

  let armed = false;
  let resetTimer = 0;
  const boxes = [...view.querySelectorAll<HTMLInputElement>('.pick-list input')];
  const go = view.querySelector<HTMLButtonElement>('[data-act="print"]')!;
  const count = (): void => {
    const n = boxes.filter((b) => b.checked).length;
    go.textContent = `${t(l, 'printGo')} (${n})`;
    go.disabled = n === 0;
  };
  view.querySelector('.pick-list')!.addEventListener('change', count);
  // One listener on the section: it is replaced with the markup on every redraw, so nothing piles up.
  view.querySelector('.parent')!.addEventListener('click', (e) => {
    const pick = (e.target as Element).closest<HTMLElement>('[data-pick]');
    if (pick) {
      for (const b of boxes) b.checked = pick.dataset.pick === 'all';
      count();
      return;
    }
    const button = (e.target as Element).closest<HTMLElement>('[data-act]');
    if (!button) return;
    const act = button.dataset.act;
    // No redraw: the list stays open with the same ticks, to print again or pick others.
    if (act === 'print') {
      ctx.print(boxes.filter((b) => b.checked).map((b) => b.value));
      return;
    }
    if (act === 'reset' && !armed) {
      // Two taps: the only thing in here that cannot be undone.
      armed = true;
      button.textContent = t(l, 'resetSure');
      button.classList.add('confirm');
      resetTimer = window.setTimeout(() => { armed = false; button.textContent = t(l, 'reset'); button.classList.remove('confirm'); }, 4000);
      return;
    }
    if (act === 'unlock') ctx.toggleUnlock();
    if (act === 'mute') ctx.toggleMute();
    if (act === 'cute') ctx.toggleCute();
    if (act === 'lang') ctx.toggleLang();
    if (act === 'reset') { clearTimeout(resetTimer); ctx.reset(); }
    renderParent(view, ctx, act === 'reset' ? t(state.lang, 'resetDone') : '');
  });
}
