import type { Diet, Dino, Group, Lang, Period } from './dinos.ts';

const UI = {
  deck: { sv: 'Kort', en: 'Cards' },
  favorites: { sv: 'Favoriter', en: 'Favourites' },
  noFavorites: {
    sv: 'Inga favoriter än. Svep ett kort åt höger eller tryck på hjärtat.',
    en: 'No favourites yet. Swipe a card right or tap the heart.',
  },
  next: { sv: 'Nästa', en: 'Next' },
  flip: { sv: 'Vänd kortet', en: 'Flip the card' },
  save: { sv: 'Spara som favorit', en: 'Save as favourite' },
  remove: { sv: 'Ta bort favorit', en: 'Remove favourite' },
  back: { sv: 'Tillbaka', en: 'Back' },
  means: { sv: 'Namnet betyder', en: 'The name means' },
  lived: { sv: 'Levde', en: 'Lived' },
  mya: { sv: 'miljoner år sedan', en: 'million years ago' },
  length: { sv: 'Längd', en: 'Length' },
  wingspan: { sv: 'Vingbredd', en: 'Wingspan' },
  weight: { sv: 'Vikt', en: 'Weight' },
  about: { sv: 'ungefär', en: 'about' },
  ate: { sv: 'Åt', en: 'Ate' },
  found: { sv: 'Hittad i', en: 'Found in' },
  sound: { sv: 'Hur lät den?', en: 'What did it sound like?' },
  didYouKnow: { sv: 'Visste du?', en: 'Did you know?' },
  more: { sv: 'Mer att läsa', en: 'Read more' },
  source: { sv: 'Källa', en: 'Source' },
  scene: { sv: 'Scen', en: 'Scene' },
  bigger: { sv: 'Större', en: 'Bigger' },
  smaller: { sv: 'Mindre', en: 'Smaller' },
  turn: { sv: 'Vänd åt andra hållet', en: 'Turn around' },
  takeAway: { sv: 'Ta bort', en: 'Remove' },
  challenge: { sv: 'Utmaning', en: 'Challenge' },
  winMe: { sv: 'Vinn mig', en: 'Win me' },
  winThis: { sv: 'Vinn', en: 'Win' },
  howOld: { sv: 'Hur gammal är du?', en: 'How old are you?' },
  years: { sv: 'år', en: 'years' },
  tryAgain: { sv: 'Försök igen!', en: 'Try again!' },
  youWon: { sv: 'Du vann', en: 'You won' },
  seeCard: { sv: 'Visa kortet', en: 'See the card' },
  oneMore: { sv: 'En till', en: 'One more' },
  timeline: { sv: 'Tidslinje', en: 'Timeline' },
  today: { sv: 'Idag', en: 'Today' },
  asteroid: { sv: 'Asteroiden slår ned', en: 'The asteroid hits' },
  myShort: { sv: 'milj. år', en: 'million yrs' },
  closer: {
    sv: 'T. rex levde närmare oss i tid än Stegosaurus.',
    en: 'T. rex lived closer in time to us than to Stegosaurus.',
  },
  parent: { sv: 'Föräldraläge', en: 'Parent mode' },
  holdHint: { sv: 'Håll in i 3 sekunder', en: 'Hold for 3 seconds' },
  unlockAll: { sv: 'Alla kort öppna', en: 'All cards open' },
  soundOn: { sv: 'Ljud', en: 'Sound' },
  language: { sv: 'Språk', en: 'Language' },
  thisLang: { sv: 'Svenska', en: 'English' },
  on: { sv: 'På', en: 'On' },
  off: { sv: 'Av', en: 'Off' },
  reset: { sv: 'Nollställ samlingen', en: 'Reset the collection' },
  resetSure: {
    sv: 'Tryck igen för att ta bort vunna kort, favoriter och scen',
    en: 'Tap again to remove won cards, favourites and scene',
  },
  resetDone: { sv: 'Samlingen är nollställd', en: 'The collection is reset' },
  done: { sv: 'Klar', en: 'Done' },
  allWon: { sv: 'Du har vunnit alla kort!', en: 'You have won every card!' },
} satisfies Record<string, Record<Lang, string>>;

export const t = (lang: Lang, key: keyof typeof UI): string => UI[key][lang];

const PERIOD: Record<Period, Record<Lang, string>> = {
  triassic: { sv: 'Trias', en: 'Triassic' },
  jurassic: { sv: 'Jura', en: 'Jurassic' },
  cretaceous: { sv: 'Krita', en: 'Cretaceous' },
};

const DIET: Record<Diet, Record<Lang, string>> = {
  carnivore: { sv: 'Kött', en: 'Meat' },
  herbivore: { sv: 'Växter', en: 'Plants' },
  piscivore: { sv: 'Fisk', en: 'Fish' },
  omnivore: { sv: 'Växter och smådjur', en: 'Plants and small animals' },
};

const GROUP: Record<Exclude<Group, 'dinosaur'>, Record<Lang, string>> = {
  pterosaur: { sv: 'Flygödla, inte en dinosaurie', en: 'Flying reptile, not a dinosaur' },
  marine: { sv: 'Havsreptil, inte en dinosaurie', en: 'Sea reptile, not a dinosaur' },
};

export const periodName = (lang: Lang, p: Period): string => PERIOD[p][lang];
export const dietName = (lang: Lang, d: Diet): string => DIET[d][lang];
/** Empty for real dinosaurs: only the look-alikes carry a label. */
export const groupNote = (lang: Lang, g: Group): string => (g === 'dinosaur' ? '' : GROUP[g][lang]);

const locale = (lang: Lang): string => (lang === 'sv' ? 'sv-SE' : 'en-GB');

/** Swedish gets decimal comma and space as thousands separator through the locale. */
export const num = (lang: Lang, n: number): string => new Intl.NumberFormat(locale(lang)).format(n);

export function weight(lang: Lang, kg: number): string {
  return kg >= 1000 ? `${num(lang, kg / 1000)} ${lang === 'sv' ? 'ton' : 'tonnes'}` : `${num(lang, kg)} kg`;
}

export function when(lang: Lang, d: Dino): string {
  return `${periodName(lang, d.period)}, ${d.fromMya} ${lang === 'sv' ? 'till' : 'to'} ${d.toMya} ${t(lang, 'mya')}`;
}
