import './style.css';
import { attachDrag, flyOff, type DragHandlers } from './deck.ts';
import { onPicture } from './picture.ts';
import { icon } from './icons.ts';
import { CHILD_ASPECT, CHILD_M, pxPerMetre } from './scale.ts';
import { dinoSheet, printSheet, sceneSheet } from './print.ts';
import { play } from './sound.ts';
import { DINOS } from './catalog.ts';
import { shuffle } from './challenge.ts';
import { renderLevelPicker } from './challengeView.ts';
import { attachHold, renderParent } from './parentView.ts';
import { renderScene } from './sceneView.ts';
import { renderTimeline } from './timelineView.ts';
import type { Dino, Lang } from './dinos.ts';
import { advance, loadState, resetCollection, saveState, toggleFavorite } from './state.ts';
import { colourNote, dietName, groupNote, num, t, weight, when } from './text.ts';

const ids = DINOS.map((d) => d.id);
const byId = new Map(DINOS.map((d) => [d.id, d]));
const state = loadState(ids, navigator.language.startsWith('sv') ? 'sv' : 'en');
const markOnboarded = (): void => { if (!state.onboarded) { state.onboarded = true; saveState(state); } };
const lang = (): Lang => state.lang;

const isOpen = (d: Dino): boolean => d.starter || state.unlockAll || state.won.includes(d.id);
const locked = (): Dino[] => DINOS.filter((d) => !isOpen(d));

// Open cards first, so the deck does not start on a run of locked ones.
const freshQueue = (): string[] => [...shuffle(Math.random, DINOS.filter(isOpen)), ...shuffle(Math.random, locked())].map((d) => d.id);
let queue = freshQueue();

// A missing picture is normal until the art exists: drop the <img>, the placeholder behind it stays.
document.addEventListener('error', (e) => { if (e.target instanceof HTMLImageElement) e.target.remove(); }, true);

// Where "back" on a card leads: the list the child came from.
let backTo = '#/favoriter';

const view = document.querySelector<HTMLElement>('#view')!;
const nav = document.querySelector<HTMLElement>('#nav')!;
const parentBtn = document.querySelector<HTMLButtonElement>('#parent')!;
// Set by the three-second press, so typing the address is not a way in.
let parentOpen = false;

function artHtml(d: Dino): string {
  // The placeholder sits behind the image and stays if the image is missing.
  return `<div class="art"><span class="art-missing" aria-hidden="true">${icon('lock')}</span><img src="img/${d.id}.webp" alt="" decoding="async"></div>`;
}

function factsHtml(d: Dino, compact = false): string {
  const l = lang();
  const note = groupNote(l, d.group);
  const size = `${t(l, 'about')} ${num(l, d.lengthM)} m`;
  return `
    ${compact ? '' : `<p class="say">${d.pronounce[l]} <button type="button" class="say-btn" data-sound="${d.id}-say-${l}" aria-label="${t(l, 'sayName')}">${icon('sound')}</button></p>`}
    ${note ? `<p class="note">${note}</p>` : ''}
    ${compact ? '' : `<p class="lead">${d.short[l]}</p>`}
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
    <button type="button" class="chip listen" data-sound="${d.id}-call">${icon('sound')} ${t(l, 'listen')}</button>
    <p class="guess">${t(l, 'soundGuess')}</p>
    <h3>${t(l, 'colour')}</h3>
    <p class="colour-note">${colourNote(l, d)}</p>
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
        <h2 lang="la">${d.name}</h2>
        <a class="chip win" href="#/utmaning/${d.id}">${icon('lock')} ${t(l, 'winMe')}</a>
        <span class="cue cue-skip" aria-hidden="true">→</span>
      </div>`;
    return card;
  }
  card.innerHTML = `
    <div class="face front">
      ${artHtml(d)}
      <h2 lang="la">${d.name}</h2>
      <p class="tag">${when(l, d)}</p>
      <button type="button" class="snd" aria-label="${t(l, 'listen')}">${icon('sound')}</button>
      <span class="cue cue-save" aria-hidden="true">♥</span>
      <span class="cue cue-skip" aria-hidden="true">→</span>
    </div>
    <div class="face back">
      <div class="scroll"><h2 lang="la">${d.name}</h2>${factsHtml(d)}</div>
    </div>`;
  return card;
}

/** The film roar, and a small jump so the tap is seen as well as heard. */
function roar(id: string, picture: HTMLElement): void {
  play(`audio/${id}-roar.mp3`);
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  picture.animate([{ transform: 'none' }, { transform: 'scale(1.07) rotate(-2deg)' }, { transform: 'none' }], 350);
}

const handlers: DragHandlers = {
  tap(at) {
    const card = topCard();
    if (!card || card.classList.contains('locked')) return;
    // A tap on the animal itself roars. Anywhere else on the card, the flip button or the keyboard turns it over.
    const img = at?.target;
    if (!state.muted && img instanceof HTMLImageElement && img.closest('.front .art') && card.dataset.id) {
      const box = img.getBoundingClientRect();
      if (onPicture(box.width, box.height, img.naturalWidth, img.naturalHeight, at!.x - box.left, at!.y - box.top)) {
        roar(card.dataset.id, img);
        return;
      }
    }
    card.classList.toggle('flipped');
    markOnboarded();
  },
  swipe(dir) {
    markOnboarded();
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
    if (!state.onboarded) top.classList.add('invite');
    top.querySelector<HTMLButtonElement>('.snd')?.addEventListener('click', (e) => {
      e.stopPropagation();
      const picture = top.querySelector<HTMLElement>('.front .art img');
      if (picture && top.dataset.id && !state.muted) roar(top.dataset.id, picture);
    });
  }
}

function renderDeck(): void {
  const l = lang();
  view.innerHTML = `
    <div id="deck" class="deck"></div>
    <div class="controls">
      <button type="button" id="skip" class="round" aria-label="${t(l, 'next')}">${icon('next')}</button>
      <button type="button" id="flip" class="round small" aria-label="${t(l, 'flip')}">${icon('flip')}</button>
      <button type="button" id="save" class="round heart" aria-label="${t(l, 'save')}">${icon('heart')}</button>
    </div>`;
  fillDeck();
  const fly = (dir: 1 | -1) => { const c = topCard(); if (c) flyOff(c, dir, handlers); };
  view.querySelector('#skip')!.addEventListener('click', () => fly(-1));
  view.querySelector('#save')!.addEventListener('click', () => fly(1));
  view.querySelector('#flip')!.addEventListener('click', () => handlers.tap());
}

function renderFavorites(): void {
  const l = lang();
  const favs = state.favorites.map((id) => byId.get(id)).filter((d): d is Dino => d !== undefined);
  view.innerHTML = favs.length
    ? `<ul class="grid">${favs.map((d) => `<li><a class="tile" href="#/dino/${d.id}">${artHtml(d)}<span>${d.name}</span></a></li>`).join('')}</ul>`
    : `<div class="empty-favorites"><div class="empty-tile">${icon('heart')}</div><p>${t(l, 'noFavorites')}</p><a class="chip" href="#/">${t(l, 'deck')}</a></div>`;
}

/** The line under the size comparison. Height is only stated for animals that stand on the ground. */
function sizeNote(d: Dino): string {
  const l = lang();
  const about = t(l, 'about');
  const size = d.wingspan
    ? `${about} ${num(l, d.lengthM)} m ${t(l, 'wingTips')}`
    : d.group === 'dinosaur'
      ? `${about} ${num(l, d.heightM)} m ${t(l, 'tall')} ${t(l, 'and')} ${num(l, d.lengthM)} m ${t(l, 'long')}`
      : `${about} ${num(l, d.lengthM)} m ${t(l, 'long')}`;
  return `${t(l, 'child')}: ${num(l, CHILD_M)} m. ${d.name}: ${size}.`;
}

function renderDetail(d: Dino): void {
  const l = lang();
  const isFav = state.favorites.includes(d.id);
  view.innerHTML = `
    <article class="detail">
      <div class="detail-top"><a class="chip" href="${backTo}">${icon('next')} ${t(l, 'back')}</a><button type="button" id="fav" class="round heart" aria-label="${isFav ? t(l, 'remove') : t(l, 'save')}">${icon('heart')}</button></div>
      ${artHtml(d)}
      <h2 lang="la">${d.name}</h2>
      <p class="say">${d.pronounce[l]} <button type="button" class="say-btn" data-sound="${d.id}-say-${l}" aria-label="${t(l, 'sayName')}">${icon('sound')}</button></p>
      <p class="lead">${d.short[l]}</p>
      <button type="button" id="print-dino" class="chip print-btn">${icon('print')} ${t(l, 'printColour')}</button>
      <h3>${t(l, 'howBig')}</h3>
      <div class="scale" aria-hidden="true">
        <img class="scale-dino" src="img/${d.id}.webp" alt="">
        <svg class="scale-child" viewBox="0 0 30 100"><circle cx="15" cy="11" r="10"/><path d="M8 24h14l6 30-5 2-3-14v20l3 36h-7l-1-30-1 30H7l3-36V42L7 56l-5-2z"/></svg>
      </div>
      <p class="scale-note">${sizeNote(d)}</p>
      ${factsHtml(d, true)}
    </article>`;
  // Size comparison: the picture's height stands for the animal's height, and the child is drawn at the same scale.
  const box = view.querySelector<HTMLElement>('.scale')!;
  const shape = box.querySelector<HTMLImageElement>('.scale-dino')!;
  const child = box.querySelector<SVGElement>('.scale-child')!;
  const fit = (): void => {
    if (!shape.naturalHeight) return;
    const widthM = (d.heightM * shape.naturalWidth) / shape.naturalHeight;
    const u = pxPerMetre(box.clientWidth, box.clientHeight, widthM, d.heightM, 10);
    shape.style.height = `${u * d.heightM}px`;
    child.style.height = `${u * CHILD_M}px`;
    child.style.width = `${u * CHILD_M * CHILD_ASPECT}px`;
  };
  if (shape.complete) fit();
  else shape.addEventListener('load', fit);
  const picture = view.querySelector<HTMLElement>('.detail .art img');
  picture?.addEventListener('click', () => { if (!state.muted) roar(d.id, picture); });
  view.querySelector('#print-dino')!.addEventListener('click', () => void printSheet(dinoSheet(d)));
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
  const repeat = !target;
  const prize = target ?? DINOS[0]!;
  renderLevelPicker(view, {
    lang: l,
    dinos: DINOS,
    matchPool: DINOS.filter(isOpen),
    target: prize,
    wonCount: state.won.length,
    repeat,
    artHtml,
    onWin(d) {
      if (!repeat && !state.won.includes(d.id)) state.won = [...state.won, d.id];
      saveState(state);
      queue = [d.id, ...queue.filter((x) => x !== d.id)]; // the new card is on top of the deck
      renderNav();
    },
    roar(d) { if (!state.muted) play(`audio/${d.id}-roar.mp3`); },
  });
}

function renderNav(): void {
  const l = lang();
  const h = location.hash;
  const here = parentOpen ? '' : h.startsWith('#/utmaning') ? 'play' : h.startsWith('#/scen') ? 'scene' : h.startsWith('#/tidslinje') ? 'time' : h.startsWith('#/dino/') ? (backTo === '#/tidslinje' ? 'time' : 'fav') : h.startsWith('#/favoriter') ? 'fav' : 'deck';
  const toWin = DINOS.filter((d) => !d.starter).length;
  const cur = (k: string) => (k === here ? ' aria-current="page"' : '');
  nav.innerHTML = `
    <a href="#/"${cur('deck')}><span class="ico">${icon('deck')}</span><span>${t(l, 'deck')}</span></a>
    <a href="#/utmaning"${cur('play')} aria-label="${t(l, 'challenge')}, ${state.won.length} ${l === 'sv' ? 'av' : 'of'} ${toWin}"><span class="ico">${icon('challenge')}</span><span>${t(l, 'challenge')}</span></a>
    <a href="#/scen"${cur('scene')}><span class="ico">${icon('scene')}</span><span>${t(l, 'scene')}</span></a>
    <a href="#/tidslinje"${cur('time')}><span class="ico">${icon('timeline')}</span><span>${t(l, 'timeline')}</span></a>
    <a href="#/favoriter"${cur('fav')} aria-label="${t(l, 'favorites')}, ${state.favorites.length}"><span class="ico">${icon('heart')}${state.favorites.length ? `<b class="badge">${state.favorites.length}</b>` : ''}</span><span>${t(l, 'favorites')}</span></a>`;
}

/** What the whole page shows of the settings: its language, and no sound buttons when sound is off. */
function applySettings(): void {
  document.documentElement.lang = lang();
  document.documentElement.classList.toggle('muted', state.muted);
}

function render(): void {
  applySettings();
  parentBtn.setAttribute('aria-label', `${t(lang(), 'parent')}: ${t(lang(), 'holdHint')}`);
  const hash = location.hash;
  if (hash === '#/tidslinje' || hash === '#/favoriter') backTo = hash;
  if (hash !== '#/foralder') parentOpen = false;
  const dino = hash.startsWith('#/dino/') ? byId.get(hash.slice('#/dino/'.length)) : undefined;
  if (parentOpen) {
    // Any of the four can change which cards are open or what the page says: rebuild the deck order and the navigation.
    const saved = (change: () => void) => () => {
      change();
      saveState(state);
      queue = freshQueue();
      applySettings();
      renderNav();
    };
    renderParent(view, {
      state,
      build: __BUILD__,
      toggleUnlock: saved(() => { state.unlockAll = !state.unlockAll; }),
      toggleMute: saved(() => { state.muted = !state.muted; }),
      toggleLang: saved(() => { state.lang = state.lang === 'sv' ? 'en' : 'sv'; }),
      reset: saved(() => { Object.assign(state, resetCollection(state)); }),
    });
  } else if (dino && isOpen(dino)) renderDetail(dino);
  else if (dino) renderChallenge(dino.id);
  else if (hash.startsWith('#/utmaning')) renderChallenge(hash.slice('#/utmaning/'.length));
  else if (hash.startsWith('#/scen')) renderScene(view, { lang: lang(), open: DINOS.filter(isOpen), scene: state.scene, selectId: hash.split('/')[2], save: () => saveState(state), print: () => void printSheet(sceneSheet(state.scene)), roar: (id, el) => { if (!state.muted) roar(id, el); } });
  else if (hash.startsWith('#/tidslinje')) renderTimeline(view, { lang: lang(), dinos: DINOS, isOpen });
  else if (hash.startsWith('#/favoriter')) renderFavorites();
  else renderDeck();
  renderNav();
}

attachHold(
  parentBtn,
  () => {
    parentOpen = true;
    if (location.hash === '#/foralder') render();
    else location.hash = '#/foralder';
  },
  () => {
    // A short tap only says how it opens.
    parentBtn.dataset.hint = t(lang(), 'holdHint');
    setTimeout(() => delete parentBtn.dataset.hint, 2500);
  },
);
// Offline: the service worker saves the whole app. Not in dev, where it would serve yesterday's code.
if (import.meta.env.PROD && 'serviceWorker' in navigator) {
  navigator.serviceWorker.register('./sw.js').catch(() => { /* no offline this time, the app still works */ });
}

// Every "listen" button on the page, wherever it was drawn.
document.addEventListener('click', (e) => {
  const sound = (e.target as Element).closest<HTMLElement>('[data-sound]')?.dataset.sound;
  if (sound && !state.muted) play(`audio/${sound}.mp3`);
});

window.addEventListener('hashchange', render);
render();
