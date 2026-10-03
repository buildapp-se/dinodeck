export type Lang = 'sv' | 'en';
export type L = Record<Lang, string>;

export type Group = 'dinosaur' | 'pterosaur' | 'marine';
export type Period = 'triassic' | 'jurassic' | 'cretaceous';
export type Diet = 'carnivore' | 'herbivore' | 'piscivore';

export interface Dino {
  /** kebab-case, also the image file name: public/img/<id>.webp */
  id: string;
  name: string;
  pronounce: L;
  meaning: L;
  group: Group;
  period: Period;
  /** Million years ago, oldest first. */
  fromMya: number;
  toMya: number;
  /** Body length in metres, or wingspan when `wingspan` is set. */
  lengthM: number;
  wingspan?: true;
  weightKg: number;
  sizeLike: L;
  diet: Diet;
  found: L;
  /** One or two sentences a five-year-old follows when read aloud. */
  short: L;
  /** For the curious reader. */
  long: L;
  facts: L[];
  /** What researchers think it sounded like. Always phrased as uncertain. */
  sound: L;
  /** Open from the start; the rest are won in challenges. */
  starter: boolean;
  source: { label: string; url: string };
}

const NHM = (slug: string) => ({
  label: 'Natural History Museum, London',
  url: `https://www.nhm.ac.uk/discover/dino-directory/${slug}.html`,
});

// Sizes and dates are rounded mid-range estimates: adult size varies between finds and
// between studies, so the cards say "about" in the UI.
export const DINOS: Dino[] = [
  {
    id: 'tyrannosaurus-rex',
    name: 'Tyrannosaurus rex',
    pronounce: { sv: 'ty-rann-o-SAU-rus rex', en: 'tie-RAN-oh-SORE-us rex' },
    meaning: { sv: 'Tyrannödlornas kung', en: 'King of the tyrant lizards' },
    group: 'dinosaur',
    period: 'cretaceous',
    fromMya: 68,
    toMya: 66,
    lengthM: 12,
    weightKg: 8000,
    sizeLike: { sv: 'Lång som en buss', en: 'As long as a bus' },
    diet: 'carnivore',
    found: { sv: 'USA och Kanada', en: 'USA and Canada' },
    short: {
      sv: 'En av de största köttätarna som gått på land. Bettet var starkt nog att krossa ben.',
      en: 'One of the biggest meat-eaters ever to walk on land. Its bite was strong enough to crush bone.',
    },
    long: {
      sv: 'Tyrannosaurus rex levde alldeles i slutet av dinosauriernas tid. Den gick på två kraftiga bakben med kroppen vågrätt och svansen rakt ut som motvikt. Armarna var korta men starka och hade två fingrar var. Den hade mycket bra luktsinne och ögon som såg rakt fram.',
      en: 'Tyrannosaurus rex lived at the very end of the age of dinosaurs. It walked on two strong back legs with its body level and its tail held straight out for balance. Its arms were short but strong, with two fingers each. It had an excellent sense of smell and eyes that faced forward.',
    },
    facts: [
      { sv: 'Tänderna kunde bli lika långa som en banan.', en: 'Its teeth could be as long as a banana.' },
      {
        sv: 'Den levde närmare oss i tid än Stegosaurus levde den.',
        en: 'It lived closer in time to us than to Stegosaurus.',
      },
      { sv: 'Den hade bara två fingrar på varje hand.', en: 'It had only two fingers on each hand.' },
    ],
    sound: {
      sv: 'Forskare tror inte att den röt som på film. Kanske gjorde den djupa, mullrande ljud med stängd mun, ungefär som en krokodil eller en struts.',
      en: 'Scientists do not think it roared like in the movies. It may have made deep, rumbling sounds with its mouth closed, a bit like a crocodile or an ostrich.',
    },
    starter: true,
    source: NHM('tyrannosaurus'),
  },
  {
    id: 'triceratops',
    name: 'Triceratops',
    pronounce: { sv: 'tri-SE-ra-tops', en: 'try-SERRA-tops' },
    meaning: { sv: 'Ansikte med tre horn', en: 'Three-horned face' },
    group: 'dinosaur',
    period: 'cretaceous',
    fromMya: 68,
    toMya: 66,
    lengthM: 9,
    weightKg: 6000,
    sizeLike: { sv: 'Tung som en elefant', en: 'As heavy as an elephant' },
    diet: 'herbivore',
    found: { sv: 'USA och Kanada', en: 'USA and Canada' },
    short: {
      sv: 'En växtätare med tre horn och en stor benkrage. Den levde samtidigt som Tyrannosaurus rex.',
      en: 'A plant-eater with three horns and a big bony frill. It lived at the same time as Tyrannosaurus rex.',
    },
    long: {
      sv: 'Triceratops hade ett av de största huvudena hos något landdjur. Munnen slutade i en näbb som klippte av sega växter, och längre in satt hundratals tänder som malde maten. Hornen och kragen användes troligen både till försvar och för att visa upp sig för andra Triceratops.',
      en: 'Triceratops had one of the largest heads of any land animal. Its mouth ended in a beak that snipped off tough plants, and further in sat hundreds of teeth that ground up the food. The horns and frill were probably used both for defence and for showing off to other Triceratops.',
    },
    facts: [
      { sv: 'Huvudet kunde bli över två meter långt.', en: 'Its head could be over two metres long.' },
      {
        sv: 'Forskare har hittat bitmärken från Tyrannosaurus på Triceratops-ben.',
        en: 'Scientists have found Tyrannosaurus bite marks on Triceratops bones.',
      },
      { sv: 'Den hade en näbb, ungefär som en papegoja.', en: 'It had a beak, a bit like a parrot.' },
    ],
    sound: {
      sv: 'Ingen vet säkert. Forskare gissar på låga brummanden och fnysningar, som hos stora djur i dag.',
      en: 'Nobody knows for sure. Scientists guess at low grunts and snorts, like big animals today.',
    },
    starter: true,
    source: NHM('triceratops'),
  },
  {
    id: 'stegosaurus',
    name: 'Stegosaurus',
    pronounce: { sv: 'ste-go-SAU-rus', en: 'STEG-oh-SORE-us' },
    meaning: { sv: 'Taködla', en: 'Roof lizard' },
    group: 'dinosaur',
    period: 'jurassic',
    fromMya: 155,
    toMya: 145,
    lengthM: 9,
    weightKg: 5000,
    sizeLike: { sv: 'Lång som en buss', en: 'As long as a bus' },
    diet: 'herbivore',
    found: { sv: 'USA och Portugal', en: 'USA and Portugal' },
    short: {
      sv: 'En växtätare med stora plattor längs ryggen och fyra vassa taggar på svansen.',
      en: 'A plant-eater with big plates along its back and four sharp spikes on its tail.',
    },
    long: {
      sv: 'Stegosaurus gick på fyra ben och bar huvudet lågt, nära marken där den betade. Plattorna på ryggen satt i två rader. Forskare tror att de användes för att visa upp sig och kanske för att hålla lagom kroppsvärme. Svanstaggarna var ett vapen: man har hittat ben från rovdinosaurier med hål som passar taggarna.',
      en: 'Stegosaurus walked on four legs and carried its head low, close to the ground where it fed. The plates on its back sat in two rows. Scientists think they were used for display and maybe to help control body heat. The tail spikes were a weapon: bones from meat-eating dinosaurs have been found with holes that match the spikes.',
    },
    facts: [
      { sv: 'Hjärnan var ungefär lika stor som en lime.', en: 'Its brain was about the size of a lime.' },
      {
        sv: 'Den var redan ett fossil när Tyrannosaurus rex levde.',
        en: 'It was already a fossil when Tyrannosaurus rex was alive.',
      },
      { sv: 'De största plattorna var över en halv meter höga.', en: 'The biggest plates were over half a metre tall.' },
    ],
    sound: {
      sv: 'Ingen vet säkert. Forskare gissar på låga, dova ljud.',
      en: 'Nobody knows for sure. Scientists guess at low, muffled sounds.',
    },
    starter: true,
    source: NHM('stegosaurus'),
  },
  {
    id: 'brachiosaurus',
    name: 'Brachiosaurus',
    pronounce: { sv: 'bra-ki-o-SAU-rus', en: 'BRAK-ee-oh-SORE-us' },
    meaning: { sv: 'Armödla', en: 'Arm lizard' },
    group: 'dinosaur',
    period: 'jurassic',
    fromMya: 154,
    toMya: 150,
    lengthM: 22,
    weightKg: 40000,
    sizeLike: { sv: 'Hög som ett fyravåningshus', en: 'As tall as a four-storey building' },
    diet: 'herbivore',
    found: { sv: 'USA', en: 'USA' },
    short: {
      sv: 'En jättelik växtätare med lång hals som nådde upp till trädtopparna.',
      en: 'A giant plant-eater with a long neck that reached up to the treetops.',
    },
    long: {
      sv: 'Brachiosaurus hade längre framben än bakben, så ryggen lutade nedåt som på en giraff. Det är därför den heter armödla. Med halsen rakt upp kunde den äta blad som inga andra djur nådde. Den behövde äta enorma mängder växter varje dag.',
      en: 'Brachiosaurus had longer front legs than back legs, so its back sloped down like a giraffe. That is why it is called arm lizard. With its neck held up it could eat leaves no other animal could reach. It needed to eat huge amounts of plants every day.',
    },
    facts: [
      { sv: 'Den vägde ungefär lika mycket som sex elefanter.', en: 'It weighed about as much as six elephants.' },
      { sv: 'Näsborrarna satt högt uppe på huvudet.', en: 'Its nostrils sat high up on its head.' },
      { sv: 'Den svalde bladen hela, utan att tugga.', en: 'It swallowed leaves whole, without chewing.' },
    ],
    sound: {
      sv: 'Ingen vet säkert. Så stora djur gör ofta mycket djupa ljud, en del så djupa att människor knappt hör dem.',
      en: 'Nobody knows for sure. Animals this big often make very deep sounds, some so deep that people can barely hear them.',
    },
    starter: true,
    source: NHM('brachiosaurus'),
  },
  {
    id: 'velociraptor',
    name: 'Velociraptor',
    pronounce: { sv: 've-lo-si-RAP-tor', en: 'vel-OSS-ee-rap-tor' },
    meaning: { sv: 'Snabb rövare', en: 'Swift thief' },
    group: 'dinosaur',
    period: 'cretaceous',
    fromMya: 75,
    toMya: 71,
    lengthM: 2,
    weightKg: 15,
    sizeLike: { sv: 'Stor som en kalkon', en: 'The size of a turkey' },
    diet: 'carnivore',
    found: { sv: 'Mongoliet och Kina', en: 'Mongolia and China' },
    short: {
      sv: 'En liten, snabb köttätare med fjädrar. Den var inte större än en kalkon.',
      en: 'A small, fast meat-eater with feathers. It was no bigger than a turkey.',
    },
    long: {
      sv: 'Velociraptor var mycket mindre än i filmerna och hade fjädrar över hela kroppen. Det vet forskare eftersom man hittat fästen för fjädrar på armbenen. På varje fot satt en stor, böjd klo som hölls uppe från marken. Den kunde inte flyga, men den är nära släkt med fåglarna.',
      en: 'Velociraptor was much smaller than in the movies and had feathers all over its body. Scientists know this because they found the marks where feathers attached on its arm bones. Each foot had a large, curved claw held up off the ground. It could not fly, but it is a close relative of birds.',
    },
    facts: [
      {
        sv: 'Ett berömt fossil visar en Velociraptor mitt i en strid med en Protoceratops.',
        en: 'One famous fossil shows a Velociraptor in the middle of a fight with a Protoceratops.',
      },
      { sv: 'Den hade fjädrar men kunde inte flyga.', en: 'It had feathers but could not fly.' },
      { sv: 'Fåglar är dinosauriernas nu levande släktingar.', en: 'Birds are the living relatives of dinosaurs.' },
    ],
    sound: {
      sv: 'Ingen vet säkert. Eftersom den var nära släkt med fåglar gissar forskare på väsningar och kuttrande ljud.',
      en: 'Nobody knows for sure. Because it was closely related to birds, scientists guess at hisses and cooing sounds.',
    },
    starter: true,
    source: NHM('velociraptor'),
  },
  {
    id: 'diplodocus',
    name: 'Diplodocus',
    pronounce: { sv: 'di-PLO-do-kus', en: 'dip-LOD-oh-kus' },
    meaning: { sv: 'Dubbel balk', en: 'Double beam' },
    group: 'dinosaur',
    period: 'jurassic',
    fromMya: 154,
    toMya: 152,
    lengthM: 26,
    weightKg: 15000,
    sizeLike: { sv: 'Lång som två bussar', en: 'As long as two buses' },
    diet: 'herbivore',
    found: { sv: 'USA', en: 'USA' },
    short: {
      sv: 'En av de längsta dinosaurierna, med jättelång hals och en svans som en piska.',
      en: 'One of the longest dinosaurs, with a very long neck and a tail like a whip.',
    },
    long: {
      sv: 'Diplodocus var lång men ganska smal för sin storlek. Svansen var längre än halsen och blev tunn som en piska längst ut. Tänderna satt bara längst fram i munnen och såg ut som pennor. Med dem repade den blad från grenar.',
      en: 'Diplodocus was long but quite slim for its size. Its tail was longer than its neck and thinned out like a whip at the end. Its teeth sat only at the front of its mouth and looked like pencils. It used them to strip leaves from branches.',
    },
    facts: [
      { sv: 'Svansen hade omkring 80 ben.', en: 'Its tail had around 80 bones.' },
      {
        sv: 'Forskare tror att svansen kunde smälla som en piska.',
        en: 'Scientists think its tail could crack like a whip.',
      },
      { sv: 'Den bytte ut sina tänder ungefär en gång i månaden.', en: 'It replaced its teeth about once a month.' },
    ],
    sound: {
      sv: 'Ingen vet säkert. Kanske djupa ljud, och kanske en smäll från svansen.',
      en: 'Nobody knows for sure. Maybe deep sounds, and maybe a crack from its tail.',
    },
    starter: true,
    source: NHM('diplodocus'),
  },
  {
    id: 'ankylosaurus',
    name: 'Ankylosaurus',
    pronounce: { sv: 'an-ky-lo-SAU-rus', en: 'an-KIE-loh-SORE-us' },
    meaning: { sv: 'Sammanvuxen ödla', en: 'Fused lizard' },
    group: 'dinosaur',
    period: 'cretaceous',
    fromMya: 68,
    toMya: 66,
    lengthM: 7,
    weightKg: 6000,
    sizeLike: { sv: 'Bred och låg som en stridsvagn', en: 'Wide and low like a tank' },
    diet: 'herbivore',
    found: { sv: 'USA och Kanada', en: 'USA and Canada' },
    short: {
      sv: 'En växtätare med pansar över hela ryggen och en tung klubba på svansen.',
      en: 'A plant-eater with armour all over its back and a heavy club on its tail.',
    },
    long: {
      sv: 'Ankylosaurus var täckt av benplattor som satt i huden, till och med på ögonlocken. Svansklubban var gjord av ben som vuxit ihop. Ett slag från den kunde troligen knäcka benen på en angripare. Den gick lågt på fyra korta ben och åt växter nära marken.',
      en: 'Ankylosaurus was covered in bony plates set in its skin, even on its eyelids. The tail club was made of bones that had grown together. A swing from it could probably break an attacker\'s legs. It walked low on four short legs and ate plants near the ground.',
    },
    facts: [
      { sv: 'Den hade pansar även på ögonlocken.', en: 'It had armour even on its eyelids.' },
      { sv: 'Svansklubban kunde väga lika mycket som ett barn.', en: 'Its tail club could weigh as much as a child.' },
      { sv: 'Den levde samtidigt som Tyrannosaurus rex.', en: 'It lived at the same time as Tyrannosaurus rex.' },
    ],
    sound: {
      sv: 'Ingen vet säkert. Den hade långa, krokiga gångar i nosen som kan ha gjort ljuden djupare.',
      en: 'Nobody knows for sure. It had long, twisting passages in its nose that may have made its sounds deeper.',
    },
    starter: true,
    source: NHM('ankylosaurus'),
  },
  {
    id: 'pteranodon',
    name: 'Pteranodon',
    pronounce: { sv: 'te-RA-no-don', en: 'teh-RAN-oh-don' },
    meaning: { sv: 'Vinge utan tänder', en: 'Wing without teeth' },
    group: 'pterosaur',
    period: 'cretaceous',
    fromMya: 86,
    toMya: 84,
    lengthM: 6,
    wingspan: true,
    weightKg: 25,
    sizeLike: { sv: 'Vingar breda som en liten bil är lång', en: 'Wings as wide as a small car is long' },
    diet: 'piscivore',
    found: { sv: 'USA', en: 'USA' },
    short: {
      sv: 'En flygödla som fångade fisk över havet. Den var ingen dinosaurie, men levde samtidigt som dem.',
      en: 'A flying reptile that caught fish over the sea. It was not a dinosaur, but it lived alongside them.',
    },
    long: {
      sv: 'Pteranodon hör till flygödlorna, en egen grupp som var släkt med dinosaurierna. Vingarna var gjorda av hud som spändes ut av ett enda mycket långt finger. Näbben saknade tänder, och på huvudet satt en lång kam. Hanarna var större och hade längre kam än honorna.',
      en: 'Pteranodon belongs to the pterosaurs, a separate group related to dinosaurs. Its wings were made of skin stretched out by one very long finger. Its beak had no teeth, and its head carried a long crest. Males were bigger and had a longer crest than females.',
    },
    facts: [
      { sv: 'Varje vinge hölls uppe av ett enda långt finger.', en: 'Each wing was held up by one long finger.' },
      { sv: 'Den hade inga tänder alls.', en: 'It had no teeth at all.' },
      {
        sv: 'Fossilen hittas mitt i USA, där det en gång låg ett hav.',
        en: 'Its fossils are found in the middle of the USA, where there was once a sea.',
      },
    ],
    sound: {
      sv: 'Ingen vet säkert. Forskare gissar på skrin och klapprande med näbben, ungefär som stora sjöfåglar.',
      en: 'Nobody knows for sure. Scientists guess at squawks and beak clacking, a bit like big seabirds.',
    },
    starter: true,
    source: { label: 'Wikipedia', url: 'https://en.wikipedia.org/wiki/Pteranodon' },
  },
];
