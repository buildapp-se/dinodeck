// The cute style, switched on in parent mode: toy-figure art and giggly roars.
// ponytail: five cards so far; the rest keep the painting until they get a cute image too.
export const CUTE: ReadonlySet<string> = new Set(['tyrannosaurus-rex', 'triceratops', 'stegosaurus', 'brachiosaurus', 'velociraptor']);

const has = (id: string, cute: boolean): boolean => cute && CUTE.has(id);

/** The card image. The size comparison keeps the painting: it shows the real shape. */
export const artSrc = (id: string, cute: boolean): string => (has(id, cute) ? `img/cute/${id}.webp` : `img/${id}.webp`);

export const roarSrc = (id: string, cute: boolean): string => (has(id, cute) ? `audio/cute/${id}-roar.mp3` : `audio/${id}-roar.mp3`);
