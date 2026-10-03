import './style.css';
import { attachDrag, flyOff, type DragHandlers } from './deck.ts';
import { DINOS } from './catalog.ts';
import { shuffle } from './challenge.ts';
import { renderLevelPicker } from './challengeView.ts';
import { renderScene } from './sceneView.ts';
import { renderTimeline } from './timelineView.ts';
import type { Dino, Lang } from './dinos.ts';
import { advance, loadState, saveState, toggleFavorite } from './state.ts';
import { dietName, groupNote, num, t, weight, when } from './text.ts';

const ids = DINOS.map((d) => d.id);
const byId = new Map(DINOS.map((d) => [d.id, d]));
const state = loadState(ids, navigator.language.startsWith('sv') ? 'sv' : 'en');
const lang = (): Lang => state.lang;

const isOpen = (d: Dino): boolean => d.starter || state.won.includes(d.id);
const locked = (): Dino[] => DINOS.filter((d) => !isOpen(d));

// Open cards first, so the deck does not start on a run of locked ones.
let queue = [...shuffle(Math.random, DINOS.filter(isOpen)), ...shuffle(Math.random, locked())].map((d) => d.id);

// A missing picture is normal until the art exists: drop the <img>, the placeholder behind it stays.
document.addEventListener('error', (e) => { if (e.target instanceof HTMLImageElement) e.target.remove(); }, true);

// Where "back" on a card leads: the list the child came from.
let backTo = '#/favoriter';

const view = document.querySelector<HTMLElement>('#view')!;
const nav = document.querySelector<HTMLElement>('#nav')!;
const langBtn = document.querySelector<HTMLButtonElement>('#lang')!;

function artHtml(d: Dino): string {
  // The placeholder sits behind the image and stays if the image is missing.
  return `<div class="art"><span class="art-missing" aria-hidden="true">🦕</span><img src="img/${d.id}.webp" alt="" decoding="async"></div>`;
}

function factsHtml(d: Dino): string {
  const l = lang();
  const note = groupNote(l, d.group);
  const size = `${t(l, 'about')} ${num(l, d.lengthM)} m`;
  return `
    <p class="say">${d.pronounce[l]}</p>
    ${note ? `<p class="note">${note}</p>` : ''}
    <p class="lead">${d.short[l]}</p>
    <dl class="facts">
      <dt>${t(l, 'means')}</dt><dd>${d.meaning[l]}</dd>
      <dt>${t(l, 'lived')}</dt><dd>${when(l, d)}</dd>
      <dt>${t(l, d.wingspan ? 'wingspan' : 'length')}</dt><dd>${size}. ${d.sizeLike[l]}.</dd>
      <dt>${t(l, 'weight')}</dt><dd>${t(l, 'about')} ${weight(l, d.weightKg)}</dd>
      <dt>${t(l, 'ate')}</dt><dd>${dietName(l, d.diet)}</dd>
      <dt>${t(l, 'found')}</dt><dd>${d.found[l]}</dd>
    </dl>
    <h3>${t(l, 'didYouKnow')}</h3>
    <ul>${d.facts.map((f) => `<li>${f[l]}</li>`).join('')}</ul>
    <h3>${t(l, 'sound')}</h3>
    <p>${d.sound[l]}</p>
    <h3>${t(l, 'more')}</h3>
    <p>${d.long[l]}</p>
    <p class="source">${t(l, 'source')}: <a href="${d.source.url}" target="_blank" rel="noopener">${d.source.label}</a></p>`;
}

function buildCard(d: Dino, depth: number): HTMLElement {
  const l = lang();
  const card = document.createElement('article');
  card.className = 'card';
  card.dataset.id = d.id;
  card.dataset.depth = String(depth);
  card.tabIndex = depth === 0 ? 0 : -1;
  card.inert = depth !== 0;
  card.setAttribute('aria-label', d.name);
  if (!isOpen(d)) {
    // Locked: a dark shape and a way to win it. No back, so nothing to flip to.
    card.classList.add('locked');
    card.innerHTML = `
      <div class="face front">
        ${artHtml(d)}
        <h2>${d.name}</h2>
        <a class="chip win" href="#/utmaning/${d.id}">🔒 ${t(l, 'winMe')}</a>
        <span class="cue cue-skip" aria-hidden="true">→</span>
      </div>`;
    return card;
  }
  card.innerHTML = `
    <div class="face front">
      ${artHtml(d)}
      <h2>${d.name}</h2>
      <p class="tag">${when(l, d)}</p>
      <span class="cue cue-save" aria-hidden="true">♥</span>
      <span class="cue cue-skip" aria-hidden="true">→</span>
    </div>
    <div class="face back">
      <div class="scroll"><h2>${d.name}</h2>${factsHtml(d)}</div>
    </div>`;
  return card;
}

const handlers: DragHandlers = {
  tap() {
    const card = topCard();
    if (card && !card.classList.contains('locked')) card.classList.toggle('flipped');
  },
  swipe(dir) {
    const id = queue[0];
    const d = id ? byId.get(id) : undefined;
    if (dir > 0 && id && d && isOpen(d) && !state.favorites.includes(id)) {
      state.favorites = [...state.favorites, id];
      saveState(state);
      renderNav();
    }
    queue = advance(queue);
    fillDeck();
  },
};

const topCard = (): HTMLElement | null => view.querySelector<HTMLElement>('.card[data-depth="0"]:not([data-leaving])');

/** Rebuilds the stack under any card that is still flying away. Never touches a leaving card. */
function fillDeck(): void {
  const deck = view.querySelector<HTMLElement>('#deck');
  if (!deck) return;
  deck.querySelectorAll('.card:not([data-leaving])').forEach((c) => c.remove());
  // ponytail: the stack is rebuilt, not promoted in place, so the next card does not animate
  // from depth 1 to 0. Port Sipdeck's promoteDeck if that snap shows on a real device.
  queue.slice(0, 3).reverse().forEach((id, i, shown) => {
    const d = byId.get(id);
    if (d) deck.prepend(buildCard(d, shown.length - 1 - i));
  });
  const top = topCard();
  if (top) {
    deck.append(top); // the top card paints last, above the rest and above a leaving card's shadow
    attachDrag(top, handlers);
  }
}

function renderDeck(): void {
  const l = lang();
  view.innerHTML = `
    <div id="deck" class="deck"></div>
    <div class="controls">
      <button type="button" id="skip" class="round" aria-label="${t(l, 'next')}">→</button>
      <button type="button" id="flip" class="round small" aria-label="${t(l, 'flip')}">↻</button>
      <button type="button" id="save" class="round heart" aria-label="${t(l, 'save')}">♥</button>
    </div>`;
  fillDeck();
  const fly = (dir: 1 | -1) => { const c = topCard(); if (c) flyOff(c, dir, handlers); };
  view.querySelector('#skip')!.addEventListener('click', () => fly(-1));
  view.querySelector('#save')!.addEventListener('click', () => fly(1));
  view.querySelector('#flip')!.addEventListener('click', handlers.tap);
}

function renderFavorites(): void {
  const l = lang();
  const favs = state.favorites.map((id) => byId.get(id)).filter((d): d is Dino => d !== undefined);
  view.innerHTML = favs.length
    ? `<ul class="grid">${favs.map((d) => `<li><a class="tile" href="#/dino/${d.id}">${artHtml(d)}<span>${d.name}</span></a></li>`).join('')}</ul>`
    : `<p class="empty">${t(l, 'noFavorites')}</p>`;
}

function renderDetail(d: Dino): void {
  const l = lang();
  const isFav = state.favorites.includes(d.id);
  view.innerHTML = `
    <article class="detail">
      <a class="chip" href="${backTo}">← ${t(l, 'back')}</a>
      ${artHtml(d)}
      <h2>${d.name}</h2>
      ${factsHtml(d)}
      <button type="button" id="fav" class="chip">${isFav ? '♥ ' + t(l, 'remove') : '♡ ' + t(l, 'save')}</button>
    </article>`;
  view.querySelector('#fav')!.addEventListener('click', () => {
    state.favorites = toggleFavorite(state.favorites, d.id);
    saveState(state);
    render();
  });
}

/** `id` is the card asked for with "Vinn mig"; without it a random locked card is the prize. */
function renderChallenge(id: string): void {
  const l = lang();
  const left = locked();
  const asked = byId.get(id);
  const target = asked && !isOpen(asked) ? asked : left[Math.floor(Math.random() * left.length)];
  if (!target) {
    view.innerHTML = `<p class="empty">${t(l, 'allWon')}</p>`;
    return;
  }
  renderLevelPicker(view, {
    lang: l,
    dinos: DINOS,
    matchPool: DINOS.filter(isOpen),
    target,
    artHtml,
    onWin(d) {
      if (!state.won.includes(d.id)) state.won = [...state.won, d.id];
      saveState(state);
      queue = [d.id, ...queue.filter((x) => x !== d.id)]; // the new card is on top of the deck
      renderNav();
    },
  });
}

function renderNav(): void {
  const l = lang();
  const h = location.hash;
  const here = h.startsWith('#/utmaning') ? 'play' : h.startsWith('#/scen') ? 'scene' : h.startsWith('#/tidslinje') ? 'time' : h.startsWith('#/dino/') ? (backTo === '#/tidslinje' ? 'time' : 'fav') : h.startsWith('#/favoriter') ? 'fav' : 'deck';
  const toWin = DINOS.filter((d) => !d.starter).length;
  const cur = (k: string) => (k === here ? ' aria-current="page"' : '');
  nav.innerHTML = `
    <a href="#/"${cur('deck')}><span aria-hidden="true">🦖</span><span>${t(l, 'deck')}</span></a>
    <a href="#/utmaning"${cur('play')}><span aria-hidden="true">⭐</span><span>${t(l, 'challenge')} <b>${state.won.length}/${toWin}</b></span></a>
    <a href="#/scen"${cur('scene')}><span aria-hidden="true">🌋</span><span>${t(l, 'scene')}</span></a>
    <a href="#/tidslinje"${cur('time')}><span aria-hidden="true">⏳</span><span>${t(l, 'timeline')}</span></a>
    <a href="#/favoriter"${cur('fav')}><span aria-hidden="true">♥</span><span>${t(l, 'favorites')} <b>${state.favorites.length}</b></span></a>`;
}

function render(): void {
  document.documentElement.lang = lang();
  langBtn.textContent = t(lang(), 'otherLang');
  const hash = location.hash;
  if (hash === '#/tidslinje' || hash === '#/favoriter') backTo = hash;
  const dino = hash.startsWith('#/dino/') ? byId.get(hash.slice('#/dino/'.length)) : undefined;
  if (dino && isOpen(dino)) renderDetail(dino);
  else if (dino) renderChallenge(dino.id);
  else if (hash.startsWith('#/utmaning')) renderChallenge(hash.slice('#/utmaning/'.length));
  else if (hash.startsWith('#/scen')) renderScene(view, { lang: lang(), open: DINOS.filter(isOpen), scene: state.scene, save: () => saveState(state) });
  else if (hash.startsWith('#/tidslinje')) renderTimeline(view, { lang: lang(), dinos: DINOS, isOpen });
  else if (hash.startsWith('#/favoriter')) renderFavorites();
  else renderDeck();
  renderNav();
}

langBtn.addEventListener('click', () => {
  state.lang = state.lang === 'sv' ? 'en' : 'sv';
  saveState(state);
  render();
});
window.addEventListener('hashchange', render);
render();
