import type { State } from './state.ts';
import { buildTime, t } from './text.ts';

export interface ParentContext {
  state: State;
  /** ISO time of the build. */
  build: string;
  /** Each changes the state and saves it; the view then redraws itself. */
  toggleUnlock(): void;
  toggleMute(): void;
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

export function renderParent(view: HTMLElement, ctx: ParentContext, note = ''): void {
  const { state } = ctx;
  const l = state.lang;
  const onOff = (v: boolean): string => t(l, v ? 'on' : 'off');
  view.innerHTML = `
    <section class="challenge parent">
      <h2>${t(l, 'parent')}</h2>
      <button type="button" class="row" data-act="unlock" aria-pressed="${state.unlockAll}">${t(l, 'unlockAll')} <b>${onOff(state.unlockAll)}</b></button>
      <button type="button" class="row" data-act="mute" aria-pressed="${!state.muted}">${t(l, 'soundOn')} <b>${onOff(!state.muted)}</b></button>
      <button type="button" class="row" data-act="lang">${t(l, 'language')} <b>${t(l, 'thisLang')}</b></button>
      <button type="button" class="row danger" data-act="reset">${t(l, 'reset')}</button>
      <p class="hint" role="status">${note}</p>
      <a class="big" href="#/">${t(l, 'done')}</a>
      <p class="source">${t(l, 'version')} ${buildTime(l, ctx.build)}</p>
    </section>`;

  let armed = false;
  // One listener on the section: it is replaced with the markup on every redraw, so nothing piles up.
  view.querySelector('.parent')!.addEventListener('click', (e) => {
    const button = (e.target as Element).closest<HTMLElement>('[data-act]');
    if (!button) return;
    const act = button.dataset.act;
    if (act === 'reset' && !armed) {
      // Two taps: the only thing in here that cannot be undone.
      armed = true;
      button.textContent = t(l, 'resetSure');
      return;
    }
    if (act === 'unlock') ctx.toggleUnlock();
    if (act === 'mute') ctx.toggleMute();
    if (act === 'lang') ctx.toggleLang();
    if (act === 'reset') ctx.reset();
    renderParent(view, ctx, act === 'reset' ? t(state.lang, 'resetDone') : '');
  });
}
