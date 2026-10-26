import type { L } from './dinos.ts';

/** The babies today's egg can hold: none once today's egg is opened, else every open card's baby not yet hatched. */
export const eggChoices = (today: string, eggDay: string, open: readonly string[], hatched: readonly string[]): string[] =>
  eggDay === today ? [] : open.filter((id) => id in BABIES && !hatched.includes(id));

// The babies that hatch from the daily egg: public/img/baby/<id>.webp, one fact each.
// Checked against the sources in docs/research/babies.md (2026-10-26). Starters first, then the best known.
export const BABIES: Record<string, L> = {
  'tyrannosaurus-rex': {
    sv: 'En nykläckt tyrannosaurie var ungefär 1 meter lång, med svansen. Forskare tror att ungarna var smala och snabbare än de vuxna.',
    en: 'A newly hatched tyrannosaur was about 1 metre long, tail included. Researchers think the young were slim and faster than the adults.',
  },
  triceratops: {
    sv: 'Hos unga Triceratops böjde sig hornen bakåt. När de blev vuxna vände hornen framåt.',
    en: 'In young Triceratops the horns curved backward. As they grew up, the horns turned forward.',
  },
  stegosaurus: {
    sv: 'Unga Stegosaurus hade små plattor på ryggen. Plattorna växte sig stora när djuret blev äldre.',
    en: 'Young Stegosaurus had small plates on its back. The plates grew big as the animal got older.',
  },
  brachiosaurus: {
    sv: 'Inga ägg från Brachiosaurus har hittats. Släktingar med lång hals lade ägg ungefär stora som en melon, så ungarna var små och växte väldigt mycket.',
    en: 'No Brachiosaurus eggs have been found. Long-necked relatives laid eggs about the size of a melon, so the babies were small and grew enormously.',
  },
  velociraptor: {
    sv: 'Inga ägg från Velociraptor har hittats än. Släktingen Deinonychus lade ägg som forskare tror var blåaktiga, och ungarna hade nog fjädrar.',
    en: 'No Velociraptor eggs have been found yet. Its relative Deinonychus laid eggs researchers think were bluish, and the babies probably had feathers.',
  },
  diplodocus: {
    sv: 'En ung Diplodocus hade en spetsig nos, men de vuxna hade en fyrkantig nos. Forskare tror att ungarna valde ut mjuka blad, medan de vuxna åt det mesta.',
    en: 'A young Diplodocus had a pointed snout, but adults had a square one. Researchers think the young picked soft leaves, while adults ate almost anything.',
  },
  ankylosaurus: {
    sv: 'Inga ungar av Ankylosaurus har hittats. Hos släktingen Pinacosaurus har man hittat många ungar tillsammans, så forskare tror att ungarna levde i grupp.',
    en: 'No baby Ankylosaurus has been found. Many young of its relative Pinacosaurus were found together, so researchers think the young lived in groups.',
  },
  pteranodon: {
    sv: 'Inga ungar av Pteranodon har hittats. Släktingen Hamipterus lade mjuka, böjliga ägg, och forskare tror att flygödleungar kunde flyga nästan direkt.',
    en: 'No baby Pteranodon has been found. Its relative Hamipterus laid soft, bendy eggs, and researchers think baby pterosaurs could fly almost right away.',
  },
  maiasaura: {
    sv: 'Namnet betyder "god moderödla". Man har hittat bon med ungar, och forskare tror att föräldrarna tog med mat till dem.',
    en: 'The name means "good mother lizard". Nests with babies have been found, and researchers think the parents brought them food.',
  },
  protoceratops: {
    sv: 'Protoceratops lade ägg med mjukt skal. Man har hittat ett bo med 15 ungar.',
    en: 'Protoceratops laid soft-shelled eggs. A nest with 15 babies has been found.',
  },
  parasaurolophus: {
    sv: 'En ung Parasaurolophus som kallas Joe hade bara en liten bula på huvudet. Den långa kammen växte fram senare.',
    en: 'A young Parasaurolophus called Joe had only a small bump on its head. The long crest grew later.',
  },
  oviraptor: {
    sv: 'Namnet betyder "äggtjuv", men den låg på ägg av sin egen sort. Forskare tror att den ruvade, och en unge som kallas Baby Yingliang låg hoprullad i ägget som en fågelunge.',
    en: 'The name means "egg thief", but it was lying on eggs of its own kind. Researchers think it was keeping them warm, and a baby called Baby Yingliang lay curled up in its egg like a bird chick.',
  },
};
