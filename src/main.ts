import './style.css';
import { attachDrag, flyOff, type DragHandlers } from './deck.ts';
import { onPicture } from './picture.ts';
import { icon } from './icons.ts';
import { CHILD_ASPECT, CHILD_M, pxPerMetre } from './scale.ts';
import { dinoSheet, printSheet, sceneSheet } from './print.ts';
import { chime, peep, play } from './sound.ts';
import { DINOS } from './catalog.ts';
import READ_SV from './read-sv.json';
import { BABIES, eggChoices } from './babies.ts';
import { shuffle } from './challenge.ts';
import { burstHtml, renderLevelPicker } from './challengeView.ts';
import type { Level } from './challenge.ts';
import { attachHold, renderParent } from './parentView.ts';
import { renderScene } from './sceneView.ts';
import { renderTimeline } from './timelineView.ts';
import type { Dino, Lang } from './dinos.ts';
import { KEY, advance, deckOrder, loadState, resetCollection, saveState, toggleFavorite } from './state.ts';
import { artSrc, babySrc, roarSrc } from './cute.ts';
import { colourNote, dietName, groupNote, num, t, weight, when } from './text.ts';

const ids = DINOS.map((d) => d.id);
const byId = new Map(DINOS.map((d) => [d.id, d]));
const state = loadState(ids, navigator.language.startsWith('sv') ? 'sv' : 'en');
const markOnboarded = (): void => { if (!state.onboarded) { state.onboarded = true; saveState(state); } };
const lang = (): Lang => state.lang;

const isOpen = (d: Dino): boolean => d.starter || state.unlockAll || state.won.includes(d.id);
const notWon = (d: Dino): boolean => !d.starter && !state.won.includes(d.id);
/** The cards still to win, the next one first: most children go for whichever card comes next. Cards with a baby to hatch come first. */
const toWin = (): Dino[] => [...DINOS.filter((d) => notWon(d) && d.id in BABIES), ...DINOS.filter((d) => notWon(d) && !(d.id in BABIES))];
const today = (): string => new Date().toLocaleDateString('sv-SE'); // YYYY-MM-DD in local time

const freshQueue = (): string[] =>
  deckOrder(shuffle(Math.random, DINOS.filter(isOpen)).map((d) => d.id), toWin().filter((d) => !isOpen(d)).map((d) => d.id));
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

/** `withBaby`: the hatched baby stands beside the adult (open cards and the detail view only, never a silhouette). */
function artHtml(d: Dino, withBaby = false): string {
  const baby = withBaby && state.hatched.includes(d.id) ? `<img class="baby" src="${babySrc(d.id, state.cute)}" alt="${t(lang(), 'baby')}">` : '';
  // The placeholder sits behind the image and stays if the image is missing.
  return `<div class="art"><span class="art-missing" aria-hidden="true">${icon('lock')}</span><img src="${artSrc(d.id, state.cute)}" alt="" decoding="async">${baby}</div>`;
}

/** Animal as a dark shape beside a child, same scale. Sized by fitScale once it is in the page. */
function scaleHtml(d: Dino): string {
  const l = lang();
  return `
    <h3>${t(l, 'howBig')}</h3>
    <div class="scale" aria-hidden="true">
      <img class="scale-dino" src="img/${d.id}.webp" alt="">
      <svg class="scale-child" viewBox="0 0 30 100"><circle cx="15" cy="11" r="10"/><path d="M8 24h14l6 30-5 2-3-14v20l3 36h-7l-1-30-1 30H7l3-36V42L7 56l-5-2z"/></svg>
    </div>
    <p class="scale-note">${sizeNote(d)}</p>`;
}

/** The picture's height stands for the animal's height, and the child is drawn at the same scale. */
function fitScale(root: ParentNode, d: Dino): void {
  const box = root.querySelector<HTMLElement>('.scale');
  if (!box) return;
  const shape = box.querySelector<HTMLImageElement>('.scale-dino')!;
  const child = box.querySelector<SVGElement>('.scale-child')!;
  const fit = (): void => {
    if (!shape.naturalHeight || !box.clientWidth) return;
    const widthM = (d.heightM * shape.naturalWidth) / shape.naturalHeight;
    const u = pxPerMetre(box.clientWidth, box.clientHeight, widthM, d.heightM, 10);
    shape.style.height = `${u * d.heightM}px`;
    child.style.height = `${u * CHILD_M}px`;
    child.style.width = `${u * CHILD_M * CHILD_ASPECT}px`;
  };
  // A card is built before it is in the page, so the box has no size yet: fit when it gets one.
  // Disconnected once the card is gone (a removed box reports one last size change).
  const watch = new ResizeObserver(() => (box.isConnected ? fit() : watch.disconnect()));
  watch.observe(box);
  shape.addEventListener('load', fit);
}

/** Card text a beginning reader can hear: each word in a span, lit up while the voice says it (tools/make-read-sv.py).
 *  Swedish only so far; a text changed since its clip was made stays plain until the clip is made again. */
function clipFor(l: Lang, d: Dino, key: string, text: string): number[][] | null {
  const clip = (READ_SV as Record<string, Record<string, { text: string; words: number[][] }>>)[d.id]?.[key];
  return l === 'sv' && clip?.text === text ? clip.words : null;
}
const spans = (clip: string, text: string, times: number[][]): string =>
  text.split(' ').map((w, i) => `<span class="w" data-clip="${clip}" data-at="${times[i]![0]}" data-to="${times[i]![1]}">${w}</span>`).join(' ');
const readBtn = (l: Lang, clip: string): string => ` <button type="button" class="say-btn" data-read="${clip}" aria-label="${t(l, 'listen')}">${icon('sound')}</button>`;

function readable(l: Lang, d: Dino, key: string, text: string): string {
  const times = clipFor(l, d, key, text);
  return times ? spans(`${d.id}-${key}`, text, times) + readBtn(l, `${d.id}-${key}`) : text;
}

/** "Did you know?": one clip reads every point, with a pause between them; one button by the heading. */
function didYouKnow(l: Lang, d: Dino): string {
  const facts = d.facts.map((f) => f[l]);
  const times = clipFor(l, d, 'facts', facts.join(' '));
  let at = 0;
  const items = facts.map((f) => `<li>${times ? spans(`${d.id}-facts`, f, times.slice(at, (at += f.split(' ').length))) : f}</li>`);
  return `<h3>${t(l, 'didYouKnow')}${times ? readBtn(l, `${d.id}-facts`) : ''}</h3><ul>${items.join('')}</ul>`;
}

function factsHtml(d: Dino, compact = false): string {
  const l = lang();
  const note = groupNote(l, d.group);
  const size = `${t(l, 'about')} ${num(l, d.lengthM)} m`;
  return `
    ${compact ? '' : `<p class="say">${d.pronounce[l]} <button type="button" class="say-btn" data-sound="${d.id}-say-${l}" aria-label="${t(l, 'sayName')}">${icon('sound')}</button></p>`}
    ${note ? `<p class="note">${note}</p>` : ''}
    ${compact ? '' : `<p class="lead">${readable(l, d, 'short', d.short[l])}</p>${scaleHtml(d)}`}
    <dl class="facts">
      <dt>${t(l, 'means')}</dt><dd>${d.meaning[l]}</dd>
      <dt>${t(l, 'lived')}</dt><dd>${when(l, d)}</dd>
      <dt>${t(l, d.wingspan ? 'wingspan' : 'length')}</dt><dd>${size}. ${d.sizeLike[l]}.</dd>
      <dt>${t(l, 'weight')}</dt><dd>${t(l, 'about')} ${weight(l, d.weightKg)}</dd>
      <dt>${t(l, 'ate')}</dt><dd>${dietName(l, d.diet)}</dd>
      <dt>${t(l, 'found')}</dt><dd>${d.found[l]}</dd>
    </dl>
    ${didYouKnow(l, d)}
    ${state.hatched.includes(d.id) && BABIES[d.id] ? `<h3>${t(l, 'theBaby')}</h3><p>${readable(l, d, 'baby', BABIES[d.id]![l])}</p>` : ''}
    <h3>${t(l, 'sound')}</h3>
    <p>${d.sound[l]}</p>
    <button type="button" class="chip listen" data-sound="${d.id}-call">${icon('sound')} ${t(l, 'listen')}</button>
    <p class="guess">${t(l, 'soundGuess')}</p>
    <h3>${t(l, 'colour')}</h3>
    <p class="colour-note">${readable(l, d, 'colour', colourNote(l, d))}</p>
    <h3>${t(l, 'more')}</h3>
    <p>${readable(l, d, 'long', d.long[l])}</p>
    <p class="source">${t(l, 'source')}: <button type="button" class="link" data-gate="${d.source.url}">${d.source.label}</button></p>`;
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
      ${artHtml(d, true)}
      <h2 lang="la">${d.name}</h2>
      <p class="tag">${when(l, d)}</p>
      <button type="button" class="snd" aria-label="${t(l, 'listen')}">${icon('sound')}</button>
      <span class="cue cue-save" aria-hidden="true">♥</span>
      <span class="cue cue-skip" aria-hidden="true">→</span>
    </div>
    <div class="face back">
      <div class="scroll"><h2 lang="la">${d.name}</h2>${factsHtml(d)}</div>
    </div>`;
  fitScale(card, d);
  return card;
}

/** The film roar, and a small jump so the tap is seen as well as heard. */
function roar(id: string, picture: HTMLElement): void {
  play(roarSrc(id, state.cute));
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  picture.animate([{ transform: 'none' }, { transform: 'scale(1.07) rotate(-2deg)' }, { transform: 'none' }], 350);
}

/** A baby's hello: its own peep and a hop that crouches, jumps and lands with a squash. */
function hop(id: string, baby: HTMLElement): void {
  const d = byId.get(id);
  if (!state.muted && d) peep(id, d.weightKg);
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  baby.animate([
    { transform: 'none' },
    { transform: 'scale(1.12, .86)', offset: 0.15, easing: 'ease-out' }, // crouch, then up and slowing
    { transform: 'translateY(-40%) scale(.92, 1.1) rotate(-5deg)', offset: 0.5, easing: 'ease-in' }, // then falling faster
    { transform: 'scale(1.15, .84)', offset: 0.8 }, // land
    { transform: 'none' },
  ], 600);
}

const handlers: DragHandlers = {
  tap(at) {
    const card = topCard();
    if (!card || card.classList.contains('locked')) return;
    // A tap on the animal itself roars. Anywhere else on the card, the flip button or the keyboard turns it over.
    const img = at?.target;
    if (img instanceof HTMLImageElement && img.classList.contains('baby')) {
      if (card.dataset.id) hop(card.dataset.id, img);
      return;
    }
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
// Set while a keyboard user is on the deck, so focus moves to the next card instead of falling to the page.
let keyboardOnDeck = false;
view.addEventListener('focusin', (e) => { keyboardOnDeck = (e.target as Element).classList.contains('card') && (e.target as Element).matches(':focus-visible'); });
view.addEventListener('pointerdown', () => { keyboardOnDeck = false; });

function fillDeck(): void {
  const deck = view.querySelector<HTMLElement>('#deck');
  if (!deck) return;
  deck.querySelectorAll('.card:not([data-leaving])').forEach((c) => c.remove());
  queue.slice(0, 3).reverse().forEach((id, i, shown) => {
    const d = byId.get(id);
    if (d) deck.prepend(buildCard(d, shown.length - 1 - i));
  });
  // The stack is rebuilt, so each card slides up from the place one step further back instead of snapping.
  if (!matchMedia('(prefers-reduced-motion: reduce)').matches) {
    deck.querySelectorAll<HTMLElement>('.card:not([data-leaving])').forEach((c) => {
      const back = Number(c.dataset.depth) + 1;
      c.animate([{ transform: `translateY(${back * 12}px) scale(${1 - back * 0.05})`, opacity: back > 2 ? 0 : 1 }, {}], { duration: 280, easing: 'cubic-bezier(.2,.9,.3,1)' });
    });
  }
  const top = topCard();
  // The heart under the deck shows whether the top card is already a favourite.
  const saved = !!top?.dataset.id && state.favorites.includes(top.dataset.id);
  const save = view.querySelector('#save');
  save?.classList.toggle('on', saved);
  save?.setAttribute('aria-pressed', String(saved));
  if (top) {
    deck.append(top); // the top card paints last, above the rest and above a leaving card's shadow
    if (keyboardOnDeck) top.focus({ preventScroll: true }); // the card that had focus just flew off
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
  const egg = eggChoices(today(), state.eggDay, DINOS.filter(isOpen).map((d) => d.id), state.hatched).length > 0;
  view.innerHTML = `
    <div id="deck" class="deck">${egg ? `<button type="button" id="egg" class="egg-btn" aria-label="${t(l, 'eggToday')}"><img src="img/baby/egg.webp" alt=""></button>` : ''}</div>
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
  view.querySelector('#egg')?.addEventListener('click', hatch);
}

// The crack, in % of the egg: two lines out from the middle, then two side branches.
// The shell halves in style.css are clipped along the same points.
const CRACK = [
  '50,47 44,54 38,46 31,52 25,45 18,51 11,46 5,52 0,49',
  '50,47 56,53 62,45 69,52 75,46 82,53 89,47 95,52 100,50',
  '38,46 36,41 32,38',
  '69,52 71,57 75,60',
];

/** Today's egg: three taps crack it, and a baby of one of the open cards comes out and moves onto that card. */
function hatch(): void {
  const l = lang();
  const choices = eggChoices(today(), state.eggDay, DINOS.filter(isOpen).map((d) => d.id), state.hatched);
  const id = choices[Math.floor(Math.random() * choices.length)];
  const d = id ? byId.get(id) : undefined;
  if (!id || !d) return;
  const dialog = document.createElement('dialog');
  dialog.className = 'hatch';
  dialog.innerHTML = `
    <p class="hint">${t(l, 'tapEgg')}</p>
    <button type="button" class="egg" aria-label="${t(l, 'tapEgg')}">
      <img class="baby-big" src="${babySrc(id, state.cute)}" alt="">
      <img class="half upper" src="img/baby/egg.webp" alt="">
      <img class="half lower" src="img/baby/egg.webp" alt="">
      <svg class="crack" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">${CRACK.map((p, i) => `<polyline class="${i < 2 ? 'main' : 'branch'}" pathLength="100" points="${p}"/>`).join('')}</svg>
      ${burstHtml()}
    </button>
    <div class="hatched" hidden>
      <h2>${t(l, 'babyOf')} <span lang="la">${d.name}</span>!</h2>
      <p>${BABIES[id]![l]}</p>
      <button type="button" class="big primary see">${t(l, 'seeCard')}</button>
    </div>`;
  document.body.append(dialog);
  const egg = dialog.querySelector<HTMLButtonElement>('.egg')!;
  const baby = dialog.querySelector<HTMLElement>('.baby-big')!;
  let taps = 0;
  egg.addEventListener('click', () => {
    if (taps >= 3) { hop(id, baby); return; }
    taps++;
    if (!state.muted) chime('crack', taps);
    navigator.vibrate?.(taps < 3 ? 15 : [20, 40, 40]);
    // Restart the wobble on every tap.
    egg.classList.remove('wobble');
    void egg.offsetWidth;
    egg.classList.add('wobble', `crack-${taps}`);
    if (taps < 3) return;
    // Only now is the egg used up: a child who closes it halfway still has it.
    state.hatched = [...state.hatched, id];
    state.eggDay = today();
    saveState(state);
    egg.classList.add('open');
    egg.setAttribute('aria-label', d.name);
    // Faded shells and confetti still count as overflow and would give the dialog a scrollbar.
    setTimeout(() => dialog.querySelectorAll('.half, .burst').forEach((el) => el.remove()), 1300);
    setTimeout(() => {
      if (!state.muted) chime('win');
      setTimeout(() => hop(id, baby), 650); // the baby says hello after the fanfare
      dialog.querySelector('.hint')!.textContent = '';
      dialog.querySelector<HTMLElement>('.hatched')!.hidden = false;
      dialog.querySelector<HTMLElement>('.see')!.focus();
    }, matchMedia('(prefers-reduced-motion: reduce)').matches ? 0 : 500);
  });
  dialog.querySelector('.see')!.addEventListener('click', () => {
    queue = [id, ...queue.filter((x) => x !== id)]; // the card with its new baby on top
    dialog.close();
  });
  // Escape or "see the card": either way the deck is drawn again, without the egg once it is used.
  dialog.addEventListener('close', () => { dialog.remove(); if (location.hash === '' || location.hash === '#/') render(); });
  dialog.showModal();
}

function renderFavorites(): void {
  const l = lang();
  const favs = state.favorites.map((id) => byId.get(id)).filter((d): d is Dino => d !== undefined);
  view.innerHTML = favs.length
    ? `<ul class="grid">${favs.map((d) => `<li><a class="tile${isOpen(d) ? '' : ' locked'}" href="#/dino/${d.id}">${artHtml(d)}<span>${d.name}</span></a></li>`).join('')}</ul>
      <button type="button" id="clear-favs" class="row danger clear-favs">${t(l, 'clearFavs')}</button>`
    : `<div class="empty-favorites"><div class="empty-tile">${icon('heart')}</div><p>${t(l, 'noFavorites')}</p><a class="chip" href="#/">${t(l, 'deck')}</a></div>`;
  const clear = view.querySelector<HTMLButtonElement>('#clear-favs');
  let armed = 0;
  let armedAt = 0;
  // Two taps, like the reset in parent mode: a child taps things to see what happens.
  clear?.addEventListener('click', () => {
    if (armed && performance.now() - armedAt < 600) return; // a double tap is one tap
    if (!armed) {
      armedAt = performance.now();
      clear.textContent = t(l, 'clearFavsSure');
      clear.classList.add('confirm');
      armed = window.setTimeout(() => { armed = 0; clear.textContent = t(l, 'clearFavs'); clear.classList.remove('confirm'); }, 4000);
      return;
    }
    clearTimeout(armed);
    state.favorites = [];
    saveState(state);
    render();
  });
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
      <div class="detail-top"><a class="chip" href="${backTo}">${icon('next')} ${t(l, 'back')}</a><button type="button" id="fav" class="round heart${isFav ? ' on' : ''}" aria-pressed="${isFav}" aria-label="${t(l, 'favourite')}">${icon('heart')}</button></div>
      ${artHtml(d, true)}
      <h2 lang="la">${d.name}</h2>
      <p class="say">${d.pronounce[l]} <button type="button" class="say-btn" data-sound="${d.id}-say-${l}" aria-label="${t(l, 'sayName')}">${icon('sound')}</button></p>
      <p class="lead">${readable(l, d, 'short', d.short[l])}</p>
      <button type="button" id="print-dino" class="chip print-btn">${icon('print')} ${t(l, 'printColour')}</button>
      ${scaleHtml(d)}
      ${factsHtml(d, true)}
    </article>`;
  fitScale(view, d);
  const picture = view.querySelector<HTMLElement>('.detail .art img');
  picture?.addEventListener('click', () => { if (!state.muted) roar(d.id, picture); });
  const baby = view.querySelector<HTMLElement>('.detail .art img.baby');
  baby?.addEventListener('click', () => hop(d.id, baby));
  view.querySelector('#print-dino')!.addEventListener('click', () => void printSheet(dinoSheet(d)));
  view.querySelector('#fav')!.addEventListener('click', () => {
    state.favorites = toggleFavorite(state.favorites, d.id);
    saveState(state);
    render();
    view.querySelector<HTMLElement>('#fav')?.focus(); // the page is rebuilt: keep keyboard and screen reader on the heart
  });
}

/** `id` is the card asked for with "Vinn mig"; without it a random locked card is the prize. */
function renderChallenge(id: string, level?: Level): void {
  const l = lang();
  const asked = byId.get(id);
  const target = asked && notWon(asked) ? asked : toWin()[0];
  const repeat = !target;
  const open = DINOS.filter(isOpen);
  const prize = target ?? open[Math.floor(Math.random() * open.length)]!;
  renderLevelPicker(view, {
    lang: l,
    dinos: DINOS,
    matchPool: DINOS.filter(isOpen),
    target: prize,
    wonCount: state.won.length,
    repeat,
    level,
    artHtml,
    oneMore(lv) {
      history.replaceState(null, '', '#/utmaning');
      renderChallenge('', lv);
    },
    onWin(d) {
      if (!repeat && !state.won.includes(d.id)) state.won = [...state.won, d.id];
      saveState(state);
      queue = [d.id, ...freshQueue().filter((x) => x !== d.id)]; // the new card on top, and the next to win dealt in
      renderNav();
    },
    roar(d) { if (!state.muted) play(roarSrc(d.id, state.cute)); },
    chime(kind, step) { if (!state.muted) chime(kind, step); },
    say(key) { if (!state.muted) play(`audio/prompt-${key}-${l}.mp3`); },
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
  document.title = t(lang(), 'title');
  document.documentElement.classList.toggle('muted', state.muted);
}

function render(): void {
  applySettings();
  parentBtn.setAttribute('aria-label', `${t(lang(), 'parent')}: ${t(lang(), 'holdHint')}`);
  const hash = location.hash;
  if (hash === '#/tidslinje' || hash === '#/favoriter') backTo = hash;
  if (hash !== '#/foralder') parentOpen = false;
  view.scrollTop = 0; // a long favourites list scrolled down would open the next view halfway down
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
      // A getter: the summary is drawn again after every switch, and a reset empties it.
      get progress() {
        return {
          won: state.won.length,
          toWin: DINOS.filter((d) => !d.starter).length,
          hatched: state.hatched.length,
          babies: Object.keys(BABIES).length,
          latest: state.won.slice(-3).reverse().map((id) => byId.get(id)?.name ?? id),
        };
      },
      // A getter as well: unlocking every card changes who can be printed.
      get printable() {
        return DINOS.filter(isOpen);
      },
      print: (ids) => void printSheet(...ids.flatMap((id) => { const d = byId.get(id); return d ? [dinoSheet(d)] : []; })),
      toggleUnlock: saved(() => { state.unlockAll = !state.unlockAll; }),
      toggleMute: saved(() => { state.muted = !state.muted; }),
      toggleCute: saved(() => { state.cute = !state.cute; }),
      toggleLang: saved(() => { state.lang = state.lang === 'sv' ? 'en' : 'sv'; }),
      reset: saved(() => { Object.assign(state, resetCollection(state)); }),
    });
  } else if (dino && isOpen(dino)) renderDetail(dino);
  else if (dino) renderChallenge(dino.id);
  else if (hash.startsWith('#/utmaning')) renderChallenge(hash.slice('#/utmaning/'.length));
  else if (hash.startsWith('#/scen')) renderScene(view, { lang: lang(), open: DINOS.filter(isOpen), scene: state.scene, selectId: hash.split('/')[2], art: (id) => artSrc(id, state.cute), save: () => saveState(state), print: () => void printSheet(sceneSheet(state.scene)), roar: (id, el) => { if (!state.muted) roar(id, el); } });
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
  const read = (e.target as Element).closest<HTMLElement>('[data-read]');
  if (!read || state.muted) return;
  const words = [...document.querySelectorAll<HTMLElement>(`.w[data-clip="${read.dataset.read}"]`)];
  play(`audio/read/${read.dataset.read}.mp3`, (elapsed) => {
    const tick = (): void => {
      const s = elapsed();
      for (const w of words) w.classList.toggle('now', s !== null && s >= +w.dataset.at! && s < +w.dataset.to!);
      if (s !== null) requestAnimationFrame(tick);
    };
    tick();
  });
});

window.addEventListener('hashchange', () => (document.startViewTransition ? void document.startViewTransition(render) : render()));
// The app open twice (a browser tab and the installed app): take the other copy's saves instead of overwriting them.
window.addEventListener('storage', (e) => {
  if (e.key !== KEY) return;
  Object.assign(state, loadState(ids, state.lang));
  applySettings();
  render();
});
// Links out of the app go through an adult question (app stores' rule for children's apps).
document.addEventListener('click', (e) => {
  const link = (e.target as Element).closest<HTMLElement>('[data-gate]');
  if (link) parentGate(link.dataset.gate!);
});

function parentGate(url: string): void {
  const l = lang();
  const a = 6 + Math.floor(Math.random() * 4);
  const b = 6 + Math.floor(Math.random() * 4);
  const dialog = document.createElement('dialog');
  dialog.className = 'gate';
  dialog.innerHTML = `
    <form method="dialog">
      <p>${t(l, 'gateAsk')}</p>
      <label>${a} × ${b} = <input name="answer" inputmode="numeric" autocomplete="off" size="3" required></label>
      <p class="hint" aria-live="polite"></p>
      <div class="gate-actions">
        <button type="button" class="chip" value="cancel">${t(l, 'cancel')}</button>
        <button class="chip" value="ok">${t(l, 'open')}</button>
      </div>
    </form>`;
  document.body.append(dialog);
  const form = dialog.querySelector('form')!;
  dialog.querySelector<HTMLButtonElement>('[value=cancel]')!.addEventListener('click', () => dialog.close());
  form.addEventListener('submit', (e) => {
    if (Number(form.answer.value) === a * b) { window.open(url, '_blank', 'noopener'); return; }
    e.preventDefault();
    form.answer.value = '';
    dialog.querySelector('.hint')!.textContent = t(l, 'tryAgain');
  });
  dialog.addEventListener('close', () => dialog.remove());
  dialog.showModal();
}

// The navigation and the name in the header: a press on the page already open starts it over (no hashchange fires).
for (const el of [nav, document.querySelector('.top')!]) el.addEventListener('click', (e) => {
  const link = (e.target as Element).closest('a');
  if (link && link.getAttribute('href') === location.hash) render();
});
render();
// The timeline picks phone or tablet sizes and its row count once per render: redo it when a tablet is turned.
// Width only: a phone's address bar showing and hiding changes the height while scrolling.
let width = innerWidth;
let turning = 0;
window.addEventListener('resize', () => {
  clearTimeout(turning);
  turning = window.setTimeout(() => {
    if (innerWidth !== width && location.hash.startsWith('#/tidslinje')) render();
    width = innerWidth;
  }, 200);
});
