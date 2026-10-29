// The cute style, switched on in parent mode: toy-figure art and squeaky roars for every card.
// cute.test.ts fails if an animal in the catalogue is missing either file.

/** The card image. The size comparison keeps the painting: it shows the real shape. */
export const artSrc = (id: string, cute: boolean): string => (cute ? `img/cute/${id}.webp` : `img/${id}.webp`);

/** The hatched baby beside the adult and in the hatching. The egg stays the same in both styles. */
export const babySrc = (id: string, cute: boolean): string => (cute ? `img/cute/baby/${id}.webp` : `img/baby/${id}.webp`);

export const roarSrc = (id: string, cute: boolean): string => (cute ? `audio/cute/${id}-roar.mp3` : `audio/${id}-roar.mp3`);
