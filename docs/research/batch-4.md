# Batch 4: ten new animals

Researched 2026-10-28. Bilingual card text, object drafts using the existing `NHM` and `WIKI` helpers, an art brief line and a colour tag for each animal, plus baby-source rows in the format of `babies.md`. Only this file was written.

**Height estimates.** Every `heightM` is my editorial estimate from the stated measurements and proportions, following batch 3, with a one-line explanation per animal below. These values describe the full vertical extent of the illustrated pose, including crests, spines or lowered flippers as applicable; they are not verified fossil measurements.

**How it was checked.** Web search was followed by reading each selected animal's complete English Wikipedia article, downloaded as plain text through the MediaWiki API. Anurognathus's article HTML was also read for its numerical infobox range. Every selected NHM URL was downloaded and its actual HTML `<title>` checked. Six titles name the animal: Cryolophosaurus, Amargasaurus, Ouranosaurus, Deinocheirus, Psittacosaurus and Corythosaurus. Shonisaurus, Anurognathus, Liopleurodon and Borealopelta return `undefined | Natural History Museum`, despite HTTP success, and are not used as sources. Numbers, source disagreements and the choice made are recorded below. Code uses JavaScript decimal points; Swedish text uses decimal commas and spaces in thousands.

The batch-3 Europe PMC search, `<genus> AND (melanosome OR melanin OR coloration OR colour OR pigment)`, was attempted for every selected genus, requesting the first five results. All requests returned HTTP 503, so no Europe PMC result titles were checked. Targeted web searches and the papers cited below were used instead. A `guess` tag means no usable pigment result was verified in this review, not proof that no such publication exists. Paper access is identified below as full text or abstract. Swedish pronunciations are editorial reading aids. English guides follow NHM where available; the other guides are editorial approximations, not verified dictionary pronunciations.

**Spread.** Triassic 1 (Shonisaurus), Jurassic 3 (Cryolophosaurus, Anurognathus, Liopleurodon), Cretaceous 6 (Amargasaurus, Ouranosaurus, Deinocheirus, Psittacosaurus, Borealopelta, Corythosaurus). Diets: carnivore 4, herbivore 5, omnivore 1. `carnivore` includes Anurognathus's insects and the marine hunters' mixed animal prey; neither marine hunter is presented as eating fish exclusively. Groups: dinosaur 7, marine 2, pterosaur 1. Colour tags: known 2, relatives 3, guess 5.

**Selection and silhouettes.** The existing forty ids were checked in `src/dinos.ts` and `src/dinos-won.ts`; none of these ten is already present. Familiar animals with a strong visual hook come first: the helmet of Corythosaurus, the neck spines of Amargasaurus, the sail-backed plant-eater Ouranosaurus and the short-necked sea hunter Liopleurodon. The less familiar choices add an Antarctic fan crest, a tiny frog-faced flier, a brush-tailed parrot face, huge shoulder spines, an enormous duck bill with a hump, and unusually long, narrow swimming paddles. The art lines specify the view needed to keep these features visible. These are design reasons, not a claim that a silhouette recognition test has already passed.

**Considered and left out.** Brontosaurus (too close to Apatosaurus); Utahraptor (too close to Deinonychus and Velociraptor); Tarbosaurus and Albertosaurus (too close to T. rex); Camarasaurus and Mamenchisaurus (another plain long-necked outline); Lambeosaurus (Corythosaurus supplies the new upright crest); Nigersaurus (its broad muzzle is striking from the front but easily lost in a side silhouette); Concavenator (a good hump, but Deinocheirus gives a stronger bill, arms and body combination); Dimetrodon (Permian, outside the `Period` union, and not a dinosaur); Postosuchus (neither dinosaur, pterosaur nor marine reptile); Nothosaurus (good outline, but no usable mass verified in the permitted sources); Eudimorphodon (its full Wikipedia article offers only a very loose mass ceiling, unsuitable as an ordinary adult weight); Rhamphorhynchus (excellent tail vane, but no mass in its full English Wikipedia article); Dimorphodon (excellent head, but no usable permitted-source mass verified in the description checked). Eudimorphodon and Rhamphorhynchus were read as complete articles; the Dimorphodon and Nothosaurus checks were more limited. Search snippets from other sites were not treated as permitted mass sources.

---

## 1. Shonisaurus (Triassic, sea reptile)

```ts
  {
    id: 'shonisaurus',
    name: 'Shonisaurus',
    pronounce: { sv: 'sjo-ni-SAU-rus', en: 'show-nih-SORE-us' },
    meaning: { sv: 'Ödlan från Shoshonebergen', en: 'Lizard from the Shoshone Mountains' },
    group: 'marine',
    period: 'triassic',
    fromMya: 227,
    toMya: 227,
    lengthM: 15,
    heightM: 4, // Estimate; see Height below.
    weightKg: 29700,
    sizeLike: { sv: 'Längre än en buss', en: 'Longer than a bus' },
    diet: 'carnivore',
    found: { sv: 'USA', en: 'USA' },
    short: {
      sv: 'En jättestor fisködla med lång nos och långa, smala simfenor. Den levde i havet och var ingen dinosaurie.',
      en: 'A giant ichthyosaur with a long snout and long, narrow flippers. It lived in the sea and was not a dinosaur.',
    },
    long: {
      sv: 'Shonisaurus var en havsreptil som levde redan under trias. Namnet kommer från Shoshonebergen i Nevada, där många skelett har hittats. Simfenorna var ovanligt långa och smala för en fisködla. Förr ritades kroppen ofta som en stor tunna, men forskare tror nu att den var smalare än så. Tänder och rester av mat visar att den var ett rovdjur. I Nevada har forskare också hittat mycket små ben från ungar.',
      en: 'Shonisaurus was a sea reptile that lived as far back as the Triassic. Its name comes from the Shoshone Mountains in Nevada, where many skeletons have been found. Its flippers were unusually long and narrow for an ichthyosaur. It used to be drawn with a big barrel-shaped body, but scientists now think it was slimmer than that. Teeth and food remains show that it was a hunter. Scientists have also found very small baby bones in Nevada.',
    },
    facts: [
      { sv: 'Minst 37 ofullständiga fossil har hittats i Nevada.', en: 'At least 37 incomplete fossils have been found in Nevada.' },
      { sv: 'Skallen kunde vara ungefär 2,75 meter lång.', en: 'Its skull could be about 2.75 metres long.' },
      { sv: 'Shonisaurus är delstaten Nevadas fossil.', en: 'Shonisaurus is the state fossil of Nevada.' },
    ],
    sound: {
      sv: 'Ingen vet säkert hur Shonisaurus lät. Forskare vet inte vilka ljud den kunde göra under vattnet.',
      en: 'Nobody knows for sure what Shonisaurus sounded like. Scientists do not know what sounds it could make under water.',
    },
    starter: false,
    colour: 'relatives',
    source: WIKI('Shonisaurus'),
  },
```

**Height.** My estimate is 4 m: for the stated 15 m slender, deep-chested body I allow about 2,7 m of torso depth (18% of length) plus 1,3 m of downward flipper projection in the swimming pose; both proportions are editorial assumptions.

**Numbers.** The card specifically depicts *S. popularis*: Wikipedia gives 13,5 to 15 m and 21,6 to 29,7 tonnes; the card uses the published upper estimates, 15 m and 29 700 kg, without averaging unrelated estimates. Its Nevada formation is dated to about 227 million years ago, so both date fields use that point date, not an invented lifespan. The 37 specimens, 2,75 m skull and Nevada state-fossil status are also in the article. The much larger Canadian *S. sikanniensis*, whose placement in Shonisaurus or Shastasaurus is disputed, is excluded from the measurements and `found`. NHM has no valid directory page, so there is no NHM numerical comparison.

**Art brief line**

- `shonisaurus` | Shonisaurus | Sea reptile, not a dinosaur, specifically Shonisaurus popularis. Long streamlined but deep-chested body, long narrow snout, four exceptionally long and narrow paddle flippers clearly separated from the body, front pair prominent, long tapering tail. Use the modern slender reconstruction rather than an inflated barrel body. Soft-tissue fin outlines are reconstructed, not directly known; avoid an exaggerated dolphin dorsal fin or a huge decorative tail crescent. | Pose: swimming in a slight three-quarter side view, front flippers spread down and outward to show their unusual length. | warm charcoal above fading into soft pearl grey below, subdued brown-grey flippers, no bright blue flank stripe

**Colour:** `relatives`. Lindgren et al. 2018 found eumelanin and evidence of countershading in the later ichthyosaur *Stenopterygius* (abstract read: https://www.nature.com/articles/s41586-018-0775-x). This supports pigmented skin in a relative, not Shonisaurus's actual hue or pattern. The transfer is weak because of the evolutionary distance. The pale underside is an illustration choice, not a demonstrated Shonisaurus feature; the uniformly dark versus countershaded alternatives discussed for ichthyosaurs in the colour document are not resolved for this genus.

**Sources**

- https://en.wikipedia.org/wiki/Shonisaurus (full article: size, mass, date, naming, long narrow flippers, changing body reconstruction, teeth, Nevada fossils and state fossil)
- https://www.si.edu/newsdesk/releases/fossil-csi-analysis-giant-extinct-marine-reptile-graveyard-suggests-mysterious (Smithsonian research release: embryonic and newborn Shonisaurus remains, possible repeated use as a birthing ground; release text available in search, direct web open failed)
- https://www.nature.com/articles/s41586-018-0775-x (Lindgren et al. 2018, abstract: relative's skin pigment)

---

## 2. Cryolophosaurus (Jurassic)

```ts
  {
    id: 'cryolophosaurus',
    name: 'Cryolophosaurus',
    pronounce: { sv: 'kry-o-lo-fo-SAU-rus', en: 'cry-o-loaf-oh-SORE-us' },
    meaning: { sv: 'Frusen kamödla', en: 'Frozen crested lizard' },
    group: 'dinosaur',
    period: 'jurassic',
    fromMya: 196,
    toMya: 188,
    lengthM: 8,
    heightM: 2.7, // Estimate; see Height below.
    weightKg: 500,
    sizeLike: { sv: 'Längre än en bil och tung som en häst', en: 'Longer than a car and as heavy as a horse' },
    diet: 'carnivore',
    found: { sv: 'Antarktis', en: 'Antarctica' },
    short: {
      sv: 'En köttätare från Antarktis med en kam tvärs över huvudet, som en liten solfjäder.',
      en: 'A meat-eater from Antarctica with a crest across its head, like a little fan.',
    },
    long: {
      sv: 'Cryolophosaurus hittades högt uppe på ett berg i Antarktis. Men när den levde fanns där skogar, inte dagens stora istäcke. Kammen satt tvärs över huvudet ovanför ögonen. Det skiljer den från Dilophosaurus, som hade kammar längs huvudet. Kammen var tunn och olämplig som vapen. Forskare tror att den användes för att visa upp sig. Den ser lite ut som en uppkammad frisyr, och därför fick djuret smeknamnet Elvisaurus.',
      en: 'Cryolophosaurus was found high on a mountain in Antarctica. But when it lived, there were forests there instead of the great ice sheet of today. Its crest ran across its head above the eyes. That sets it apart from Dilophosaurus, whose crests ran along its head. The crest was thin and poorly suited to being a weapon. Scientists think it was used for display. It looks a little like a swept-up hairstyle, which earned the animal the nickname Elvisaurus.',
    },
    facts: [
      { sv: 'Den var den första köttätande dinosaurien som hittades i Antarktis.', en: 'It was the first meat-eating dinosaur found in Antarctica.' },
      { sv: 'Den fick sitt vetenskapliga namn år 1994.', en: 'It received its scientific name in 1994.' },
      { sv: 'Namnet syftar på kylan och kammen på huvudet.', en: 'Its name refers to the cold and the crest on its head.' },
    ],
    sound: {
      sv: 'Ingen vet säkert hur Cryolophosaurus lät. Kammen visar inte vilket läte den hade.',
      en: 'Nobody knows for sure what Cryolophosaurus sounded like. Its crest does not tell us what call it made.',
    },
    starter: false,
    colour: 'guess',
    source: WIKI('Cryolophosaurus'),
  },
```

**Height.** My estimate is 2,7 m: for the stated 8 m level-bodied theropod I estimate hips at 2 m (25% of length), with the raised neck, head and fan crest reaching about 0,7 m higher.

**Numbers.** NHM: 8,0 m, 500 kg, 170 million years ago. Wikipedia: the described, probably not fully grown individual was 6 to 7 m and 350 to 465 kg; larger adults are estimated at 8 m. Its fossil sediments are described as about 196 to 188 million years old. The card uses NHM's adult-scale length and mass, and Wikipedia's dates. NHM's 170-million-year date conflicts with Wikipedia and even sits outside the Early Jurassic label on the NHM page. Wikipedia also calls the rocks Pliensbachian; that stage label and its broad numerical range are not reconciled here, so the range is not presented as precise radiometric dating. The naming year 1994 is in both sources.

**Art brief line**

- `cryolophosaurus` | Cryolophosaurus | Large two-legged theropod, body level, long balancing tail, short arms with clawed hands. A single thin fan-shaped bony crest runs transversely across the head above the eyes, rising up and spreading sideways, not two lengthwise snout crests. Reconstruct the incomplete snout conservatively; no frill, venom or ice-breath effects. | Pose: walking in a slight front three-quarter view facing left, so the transverse fan is visible in the outer silhouette. | muted blue-grey body with fine charcoal mottling, cream underside, copper-orange fan crest with a dark rim

**Colour:** `guess`. No usable pigment evidence verified for this genus. The orange crest is a design choice, not a discovery. No feather claim is included; the body covering in the illustration remains a reconstruction.

**Sources**

- https://www.nhm.ac.uk/discover/dino-directory/cryolophosaurus.html (valid HTML title; pronunciation, meaning, adult-scale length and mass, Antarctica)
- https://en.wikipedia.org/wiki/Cryolophosaurus (full article: size alternatives, dates, fan crest and display hypotheses, Elvisaurus nickname, discovery and naming, forested environment; the old story that it choked on another dinosaur's ribs is rejected in the article and omitted here)

---

## 3. Anurognathus (Jurassic, flying reptile)

```ts
  {
    id: 'anurognathus',
    name: 'Anurognathus',
    pronounce: { sv: 'a-nu-rog-NA-tus', en: 'an-oor-og-NATH-us' },
    meaning: { sv: 'Grodkäke', en: 'Frog jaw' },
    group: 'pterosaur',
    period: 'jurassic',
    fromMya: 150.8,
    toMya: 148.5,
    lengthM: 0.35,
    heightM: 0.1, // Estimate; see Height below.
    wingspan: true,
    weightKg: 0.04,
    sizeLike: { sv: 'Lättare än en liten chokladkaka', en: 'Lighter than a small bar of chocolate' },
    diet: 'carnivore',
    found: { sv: 'Tyskland', en: 'Germany' },
    short: {
      sv: 'En pytteliten flygödla med brett huvud, stora ögon och kort svans. Den åt insekter och var ingen dinosaurie.',
      en: 'A tiny pterosaur with a wide head, big eyes and a short tail. It ate insects and was not a dinosaur.',
    },
    long: {
      sv: 'Anurognathus hade ett kort, brett huvud med en stor mun och små, spetsiga tänder. De passade för att fånga insekter. Vingarna var korta och breda, och svansen var mycket liten. Forskare tror att den kunde svänga lätt i luften när den jagade. De stora ögonen kan ha hjälpt den att se i skymningen. Fina fossil från Tyskland visar delar av vinghuden, så forskarna har mer att undersöka än bara ben.',
      en: 'Anurognathus had a short, wide head with a big mouth and small, pointed teeth. They were suited to catching insects. Its wings were short and broad, and its tail was very small. Scientists think it could turn easily in the air while hunting. Its big eyes may have helped it see at dusk. Fine fossils from Germany show parts of the wing membrane, giving scientists more than just bones to study.',
    },
    facts: [
      { sv: 'Vingbredden i den här uppskattningen är bara 35 centimeter.', en: 'The wingspan in this estimate is only 35 centimetres.' },
      { sv: 'Huvudet var bredare än det var långt.', en: 'Its head was wider than it was long.' },
      { sv: 'Ett litet fossil visar både skelett och delar av vinghuden.', en: 'One small fossil shows both the skeleton and parts of the wing membrane.' },
    ],
    sound: {
      sv: 'Ingen vet säkert hur Anurognathus lät. Ett fågelliknande läte skulle vara en gissning.',
      en: 'Nobody knows for sure what Anurognathus sounded like. A bird-like call would be a guess.',
    },
    starter: false,
    colour: 'relatives',
    source: WIKI('Anurognathus'),
  },
```

**Height.** My estimate is 0,1 m: with the stated 0,35 m wingspan, broad wings spread roughly level and a short neck and tail, I allow about 30% of span for the full vertical outline in the three-quarter flight pose.

**Numbers.** Wikipedia explicitly pairs a 35 cm wingspan with Witton's 40 g mass estimate, giving 0,35 m and 0,04 kg in the object. This keeps the mass and span tied to the same reconstruction rather than mixing size estimates. The numerical infobox range is 150,8 to 148,5 million years ago. No valid NHM directory page exists. The size comparison is a loose everyday comparison, not a measured property of all chocolate bars.

**Meaning.** The full article gives “frog jaw”; this is retained as a literal reading aid. Competing etymological interpretations exist, so this is not presented as an independently settled linguistic finding.

**Art brief line**

- `anurognathus` | Anurognathus | Tiny pterosaur, not a dinosaur. Very short, broad, blunt frog-like head wider than long, very large eyes, wide mouth with tiny pointed teeth, short neck, short broad skin wings and a very short tail. Scientists infer a coat of fine fuzz from related pterosaurs; no long bird flight feathers or long pointed beak. | Pose: flying in a slight front three-quarter view facing left, broad wings spread and rounded head clearly outlined. | soft chestnut-brown fuzz, copper-buff wing membranes with charcoal outer margins, pale cream throat and belly

**Colour:** `relatives`. Cincotta et al. 2022 (full-text excerpts on integument and melanosomes read, https://www.nature.com/articles/s41586-022-04622-3) documents different melanosome populations in *Tupandactylus* skin and filamentous structures, and discusses anurognathid filaments. It does not establish Anurognathus's brown colour, wing margins or exact fuzz coverage. Those are reconstruction choices. This is weak, broad pterosaur evidence, not a species-specific colour finding.

**Sources**

- https://en.wikipedia.org/wiki/Anurognathus (complete plain-text article plus numerical HTML infobox: span and mass, dates, Germany, skull, eyes, short tail, wing impressions, insect-catching and manoeuvrability hypotheses)
- https://www.nature.com/articles/s41586-022-04622-3 (Cincotta et al. 2022, relevant full-text excerpts: relative's integument and pigment; no exact Anurognathus hue)

---

## 4. Liopleurodon (Jurassic, sea reptile)

```ts
  {
    id: 'liopleurodon',
    name: 'Liopleurodon',
    pronounce: { sv: 'li-o-PLEU-ro-don', en: 'ly-oh-PLOOR-oh-don' },
    meaning: { sv: 'Tand med släta sidor', en: 'Smooth-sided tooth' },
    group: 'marine',
    period: 'jurassic',
    fromMya: 166,
    toMya: 155,
    lengthM: 5.8,
    heightM: 1.8, // Estimate; see Height below.
    weightKg: 1800,
    sizeLike: { sv: 'Längre än en bil', en: 'Longer than a car' },
    diet: 'carnivore',
    found: { sv: 'England, Frankrike och Tyskland', en: 'England, France and Germany' },
    short: {
      sv: 'En havsjägare med stort huvud, kort hals och fyra kraftiga simfenor. Den var ingen dinosaurie.',
      en: 'A sea hunter with a big head, a short neck and four strong flippers. It was not a dinosaur.',
    },
    long: {
      sv: 'Liopleurodon hörde till svanödlorna, men hade en helt annan form än Plesiosaurus: stort huvud och kort hals. Den hade också en kort svans och fyra stora simfenor. Forskare tror att den kunde göra snabba utfall för att fånga byten. I fossil som har förts till Liopleurodon finns rester av fisk och bläckfiskliknande djur. I en berömd tv-serie gjordes den mycket större än vad de säkra fossilen visar.',
      en: 'Liopleurodon belonged to the plesiosaurs, but had a very different shape from Plesiosaurus: a big head and a short neck. It also had a short tail and four large flippers. Scientists think it could make quick bursts to catch prey. Fossils assigned to Liopleurodon contain remains of fish and squid-like animals. A famous television series made it much bigger than the securely identified fossils show.',
    },
    facts: [
      { sv: 'Namnet valdes efter tändernas släta sidor.', en: 'Its name was chosen for the smooth sides of its teeth.' },
      { sv: 'Huvudet upptog nästan en fjärdedel av hela längden.', en: 'Its head took up almost a quarter of its whole length.' },
      { sv: 'Den hade fyra simfenor, inte ben att gå på land med.', en: 'It had four flippers, rather than legs for walking on land.' },
    ],
    sound: {
      sv: 'Ingen vet säkert hur Liopleurodon lät. Forskare vet inte vilka ljud den kunde göra under vattnet.',
      en: 'Nobody knows for sure what Liopleurodon sounded like. Scientists do not know what sounds it could make under water.',
    },
    starter: false,
    colour: 'relatives',
    source: WIKI('Liopleurodon'),
  },
```

**Height.** My estimate is 1,8 m: for the stated 5,8 m short-necked swimmer I estimate torso depth near 1 m (17% of length) and allow another 0,8 m for the lowered paddles in the three-quarter swimming pose.

**Numbers.** Wikipedia's 2026 discussion pairs a 5,8 m *L. ferox* reconstruction with an estimated 1,8 tonnes, used together here. The article gives a genus range of approximately 166 to 155 million years ago; its European-occurrence section gives a narrower 164,5 to 161,5 million years. The object follows the broader genus range, not the range of one regional sample. Its newer total-size estimates span 2,46 to 8,09 m, with the extremes based on teeth. The card does not adopt the television animal's 25 m or the older composite skeleton's measurements. `found` is a conservative subset of the European records; Russia and a tentative Mexican occurrence are discussed in the article but not needed for the card. NHM's URL has the undefined title.

**Art brief line**

- `liopleurodon` | Liopleurodon | Sea reptile, not a dinosaur. Huge elongated head occupying nearly a quarter of total body length, deep jaws with prominent conical teeth, very short neck, broad powerful torso, four long paddle-shaped flippers, and a short tapering tail. Clearly distinguish the enormous head and short neck from Plesiosaurus and the short tail from Mosasaurus. No oversized movie-monster proportions. | Pose: swimming in a slight three-quarter side view, all four flippers readable and mouth only slightly open. | warm stone-grey above with broad dark brown-grey patches, ivory underside, softly mottled flippers

**Colour:** `relatives`. Marx et al. 2025 (abstract read, https://doi.org/10.1016/j.cub.2025.01.001) reports melanosomes in another Jurassic plesiosaur's tail skin and scale-like structures on its flipper. It reconstructs no exact hue for Liopleurodon. Pigmented skin is informed by that relative; grey, mottling and the pale underside are guesses. No pigment result for Liopleurodon itself was verified.

**Sources**

- https://en.wikipedia.org/wiki/Liopleurodon (full article: paired length and mass, date alternatives, head proportion, teeth and naming, four flippers, short tail, stomach contents with attribution caveats, ambush interpretation and exaggerated television size)
- https://doi.org/10.1016/j.cub.2025.01.001 (Marx et al. 2025, abstract also read at https://portal.research.lu.se/sv/publications/skin-scales-and-cells-in-a-jurassic-plesiosaur/)

---

## 5. Amargasaurus (Cretaceous)

```ts
  {
    id: 'amargasaurus',
    name: 'Amargasaurus',
    pronounce: { sv: 'a-mar-ga-SAU-rus', en: 'ah-MARG-oh-SORE-us' },
    meaning: { sv: 'Ödlan från La Amarga', en: 'La Amarga lizard' },
    group: 'dinosaur',
    period: 'cretaceous',
    fromMya: 130,
    toMya: 120,
    lengthM: 12,
    heightM: 3, // Estimate; see Height below.
    weightKg: 4000,
    sizeLike: { sv: 'Lång som en buss', en: 'As long as a bus' },
    diet: 'herbivore',
    found: { sv: 'Argentina', en: 'Argentina' },
    short: {
      sv: 'En långhals med två rader höga bentaggar på halsen. Den åt växter och gick på fyra ben.',
      en: 'A long-necked dinosaur with two rows of tall bony spines on its neck. It ate plants and walked on four legs.',
    },
    long: {
      sv: 'Amargasaurus var mindre än många andra långhalsar, men halsen gjorde den lätt att känna igen. Där stack långa bentaggar upp i två rader. Forskarna är inte överens om hur de såg ut utanpå. En del tror att taggarna hade ett hårt hölje, andra att hud band ihop dem till ett segel. De kan ha använts för att visa upp sig. Halsen var ganska kort för en långhals, och huvudet hölls ofta nära marken.',
      en: 'Amargasaurus was smaller than many other long-necked dinosaurs, but its neck made it easy to recognise. Long bony spines rose from it in two rows. Scientists do not agree on how they looked on the outside. Some think the spines had hard coverings, while others think skin joined them into a sail. They may have been used for display. Its neck was fairly short for a long-neck, and its head was often held near the ground.',
    },
    facts: [
      { sv: 'De längsta bevarade halstaggarna var ungefär 60 centimeter långa.', en: 'The longest preserved neck spines were about 60 centimetres long.' },
      { sv: 'Skelettet hittades i Argentina år 1984.', en: 'Its skeleton was found in Argentina in 1984.' },
      { sv: 'Namnet kommer från platsen där fossilet hittades.', en: 'Its name comes from the place where the fossil was found.' },
    ],
    sound: {
      sv: 'Ingen vet säkert hur Amargasaurus lät. Ett särskilt läte från halstaggarna har inte kunnat bekräftas.',
      en: 'Nobody knows for sure what Amargasaurus sounded like. A special sound made with its neck spines has not been confirmed.',
    },
    starter: false,
    colour: 'guess',
    source: WIKI('Amargasaurus'),
  },
```

**Height.** My estimate is 3 m: for the stated 12 m short-necked sauropod I put the highest neck/back spine bases near 2,4 m (20% of length) and add roughly 0,6 m for the stated neck spines in the gently lowered-neck pose; the 2,7 m maximum feeding position is not used.

**Numbers.** NHM: 12,0 m, 9 000 kg, 132 to 127 million years ago. Wikipedia: 9 to 13 m, about 2,5 to 4 tonnes, and 130 to 120 million years ago. The card uses NHM's 12 m length, within Wikipedia's interval, but Wikipedia's 4 000 kg upper mass estimate and its dates. The 60 cm neck spine and 1984 discovery are in Wikipedia. Its numerical dates and its changing Barremian/Aptian stage terminology are broader geological estimates, not a precisely dated species duration.

**Art brief line**

- `amargasaurus` | Amargasaurus | Four-legged sauropod with a barrel-shaped torso, relatively short neck for a sauropod, small low head, front legs somewhat shorter than hind legs, long tapering tail off the ground. Two parallel rows of extremely tall backward-curving bony spines rise along the neck and become lower along the back. Scientists disagree about their covering: use a modest skin web connecting successive neck spines as a stated reconstruction, keeping the paired spiny upper outline visible, not separate towering fantasy horns. | Pose: walking in a slight three-quarter side view, neck gently sloping down. | muted wine-brown body with a cream belly, dark maroon neck webs edged in warm buff, faint pale flecks on the flanks

**Colour:** `guess`. No usable pigment evidence verified for Amargasaurus. The contested diplodocid pigment work in the existing colour document is not treated as a reliable hue or pattern prediction for this different sauropod family. All palette details are editorial choices. Skin webbing is an anatomical hypothesis, independent of the colour tag.

**Sources**

- https://www.nhm.ac.uk/discover/dino-directory/amargasaurus.html (valid HTML title: pronunciation, meaning, size and older date estimates, possible sail)
- https://en.wikipedia.org/wiki/Amargasaurus (full article: size and mass ranges, dates, discovery, spine length, neck posture; 2022 bone-structure study favouring ligaments and a possible sail, opposed to earlier horn-sheath reconstructions)

---

## 6. Ouranosaurus (Cretaceous)

```ts
  {
    id: 'ouranosaurus',
    name: 'Ouranosaurus',
    pronounce: { sv: 'u-ra-no-SAU-rus', en: 'oo-RAH-noh-SORE-us' },
    meaning: { sv: 'Modig ödla', en: 'Brave lizard' },
    group: 'dinosaur',
    period: 'cretaceous',
    fromMya: 121.4,
    toMya: 113.2,
    lengthM: 7,
    heightM: 2.5, // Estimate; see Height below.
    weightKg: 2200,
    sizeLike: { sv: 'Längre än en bil', en: 'Longer than a car' },
    diet: 'herbivore',
    found: { sv: 'Niger', en: 'Niger' },
    short: {
      sv: 'En växtätare med höga benutskott på ryggen. Forskare tror att de bar upp ett segel eller en puckel.',
      en: 'A plant-eater with tall bony spines along its back. Scientists think they supported a sail or a hump.',
    },
    long: {
      sv: 'Ouranosaurus hade en bred näbb och tänder längre bak i munnen för att bearbeta växter. Den levde vid floder i det som i dag är Niger i Afrika. Långa utskott från ryggkotorna gav ryggen en ovanligt hög form. Forskare vet inte om huden bildade ett tunt segel eller om där fanns en tjockare puckel. Den kunde stödja sig på händerna och hade en liten tagg på varje tumme, ungefär som Iguanodon.',
      en: 'Ouranosaurus had a broad beak and teeth further back in its mouth for processing plants. It lived near rivers in what is now Niger in Africa. Long projections from its back bones gave its back an unusually tall outline. Scientists do not know whether the skin formed a thin sail or whether it had a thicker hump. It could support itself on its hands and had a small spike on each thumb, a little like Iguanodon.',
    },
    facts: [
      { sv: 'Tumtaggarna var mindre än hos Iguanodon.', en: 'Its thumb spikes were smaller than those of Iguanodon.' },
      { sv: 'De längsta utskotten på ryggkotorna var ungefär 63 centimeter långa.', en: 'The longest projections on its back bones were about 63 centimetres long.' },
      { sv: 'Ett skelett finns på museum i Niger och ett annat i Venedig.', en: 'One skeleton is in a museum in Niger and another is in Venice.' },
    ],
    sound: {
      sv: 'Ingen vet säkert hur Ouranosaurus lät. Forskare kan inte avgöra dess läte från seglet eller puckeln.',
      en: 'Nobody knows for sure what Ouranosaurus sounded like. Scientists cannot tell its call from the sail or hump.',
    },
    starter: false,
    colour: 'guess',
    source: WIKI('Ouranosaurus'),
  },
```

**Height.** My estimate is 2,5 m: for the stated 7 m four-legged ornithopod I estimate the back-spine bases at about 1,9 m (27% of length), then add the stated 0,63 m spines and round the sail-top height.

**Numbers.** NHM: 7,0 m, no mass, 115 to 100 million years ago, Niger. Wikipedia: 7 to 8,3 m, 2,2 tonnes, Aptian, Niger and an indeterminate referred Cameroon specimen. The card uses 7 m, 2 200 kg and the conservative Niger record. The date fields use the current approximate boundaries of the Aptian, 121,4 to 113,2 million years, read in the full Wikipedia Aptian article. **These delimit its stated stage, not a demonstrated continuous species lifespan.** This choice avoids copying NHM's younger interval into a card whose main source places it in the Aptian. The 63 cm spine measurement and both skeleton locations are in Wikipedia.

**Meaning.** “Modig ödla” is a child-friendly shortening. NHM says “brave monitor lizard”; Wikipedia explains the Arabic/Tuareg wordplay involving bravery and the desert monitor.

**Art brief line**

- `ouranosaurus` | Ouranosaurus | Heavy plant-eating ornithopod walking on four limbs, shorter front limbs with weight-bearing hoof-like fingers and small thumb spikes, long low head with a broad plant-cropping beak, thick tail held clear of the ground. Very tall flattened neural spines support a high rounded dorsal outline continuing onto the tail base. Scientists disagree between sail and hump: choose a thin sail for this illustration and label that choice as reconstruction. No crocodile snout, big carnivore teeth or paddle tail. | sandy cream body with irregular dark chocolate flank blotches, muted slate-blue sail crossed by narrow cream bands, pale underside

**Colour:** `guess`. No usable pigment result verified. The blue sail and its stripes are design choices. Neither the colour nor the thinness of the sail is a fossil observation.

**Sources**

- https://www.nhm.ac.uk/discover/dino-directory/ouranosaurus.html (valid HTML title: pronunciation, name, length, older date range and Niger)
- https://en.wikipedia.org/wiki/Ouranosaurus (full article: mass, Aptian assignment, sail/hump alternatives, beak, thumb spikes, back spines, rivers, specimen locations and Cameroon caveat)
- https://en.wikipedia.org/wiki/Aptian (full article: present approximate stage boundaries)

---

## 7. Deinocheirus (Cretaceous)

```ts
  {
    id: 'deinocheirus',
    name: 'Deinocheirus',
    pronounce: { sv: 'dej-no-KEJ-rus', en: 'DINE-oh-KIRE-us' },
    meaning: { sv: 'Fruktansvärd hand', en: 'Terrible hand' },
    group: 'dinosaur',
    period: 'cretaceous',
    fromMya: 70,
    toMya: 66,
    lengthM: 11,
    heightM: 4.5, // Estimate; see Height below.
    weightKg: 6500,
    sizeLike: { sv: 'Ungefär lika tung som en stor elefant', en: 'About as heavy as a large elephant' },
    diet: 'omnivore',
    found: { sv: 'Mongoliet', en: 'Mongolia' },
    short: {
      sv: 'En jättestor dinosaurie med anklik näbb, långa armar och en hög puckel på ryggen.',
      en: 'A giant dinosaur with a duck-like bill, long arms and a high hump on its back.',
    },
    long: {
      sv: 'Länge kände forskarna nästan bara till Deinocheirus stora armar. När mer av skelettet hittades kom en överraskning: den hade bred näbb, djup underkäke och höga ryggkotor. Den var släkt med den strutslika Gallimimus men var mycket tyngre och byggd för ett långsammare liv. Forskare tror att den åt både växter och smådjur. Fiskben och fiskfjäll låg bland stenar i magen. Stenarna kan ha hjälpt till att mala maten.',
      en: 'For a long time, scientists knew Deinocheirus mainly from its huge arms. More of the skeleton brought a surprise: it had a broad bill, a deep lower jaw and tall back bones. It was related to the ostrich-like Gallimimus, but was much heavier and built for a slower life. Scientists think it ate both plants and small animals. Fish bones and scales lay among stones in its belly. The stones may have helped grind its food.',
    },
    facts: [
      { sv: 'Armarna var ungefär 2,4 meter långa.', en: 'Its arms were about 2.4 metres long.' },
      { sv: 'Varje hand hade tre fingrar med stora klor.', en: 'Each hand had three fingers with large claws.' },
      { sv: 'Näbben saknade tänder.', en: 'Its bill had no teeth.' },
    ],
    sound: {
      sv: 'Ingen vet säkert hur Deinocheirus lät. En anklik näbb betyder inte att den kvackade som en anka.',
      en: 'Nobody knows for sure what Deinocheirus sounded like. A duck-like bill does not mean it quacked like a duck.',
    },
    starter: false,
    colour: 'guess',
    source: WIKI('Deinocheirus'),
  },
```

**Height.** My estimate is 4,5 m: using the older 3,3 to 3,6 m hip estimate only as a rough scale for the stated 11 m biped, I take about 3,5 m at the hips and allow 1 m more for the highest head/hump outline with its raised S-curved neck.

**Numbers.** NHM: 10,0 m, no mass, 70 to 66 million years ago. Wikipedia: about 11 m and 6,36 tonnes for the largest described specimen; later mass estimates include 6,5 and 7,3 tonnes, with other authors giving 11,5 m and 5 tonnes. The card follows Wikipedia's 11 m length and cited 6,5-tonne estimate, and NHM's date interval; Wikipedia itself says about 70 million years ago. The 2,4 m arms and three fingers are explicitly described. The linked source therefore supports the anatomy and body size; the broader date endpoint comes from the NHM comparison.

**Art brief line**

- `deinocheirus` | Deinocheirus | Massive pot-bellied biped with relatively short stout hind legs, long arms ending in three large blunt claws, long S-curved neck, long low head with a broad flattened toothless duck-like bill and a conspicuously deep lower jaw. High rounded ridge or hump over the lower back and hips, thick tail held out. Scientists infer body feathers and a small tail fan from relatives and tail bones; use a modest shaggy coat and fan, not a large ostrich plume. Distinguish its broad duck bill and hump from Therizinosaurus's tiny head and enormous scythe claws. | olive-brown shaggy body, cream throat and underside, dark brown hump and small tail fan, ivory-grey bill

**Colour:** `guess`. Feather inference is not pigment evidence. No usable Deinocheirus pigment result was verified. The coat, fan, hues and dark hump are reconstructed; the child-facing text makes no claim that its feather coverage is known.

**Sources**

- https://www.nhm.ac.uk/discover/dino-directory/deinocheirus.html (valid HTML title: pronunciation, meaning, date interval, duck-like head and hump)
- https://en.wikipedia.org/wiki/Deinocheirus (full article: size alternatives, arms, hand anatomy, toothless bill, hump, inferred tail fan, slow build, fish remains and gastroliths, relationship to Gallimimus)

---

## 8. Psittacosaurus (Cretaceous)

```ts
  {
    id: 'psittacosaurus',
    name: 'Psittacosaurus',
    pronounce: { sv: 'sitt-a-ko-SAU-rus', en: 'SIT-ak-oh-SORE-us' },
    meaning: { sv: 'Papegojödla', en: 'Parrot lizard' },
    group: 'dinosaur',
    period: 'cretaceous',
    fromMya: 125,
    toMya: 105,
    lengthM: 2,
    heightM: 1, // Estimate; see Height below.
    weightKg: 50,
    sizeLike: { sv: 'Lång som en säng', en: 'As long as a bed' },
    diet: 'herbivore',
    found: { sv: 'Kina, Mongoliet och Ryssland', en: 'China, Mongolia and Russia' },
    short: {
      sv: 'En liten växtätare med papegojliknande näbb. Ett fint fossil har långa borst på svansen.',
      en: 'A small plant-eater with a parrot-like beak. One fine fossil has long bristles on its tail.',
    },
    long: {
      sv: 'Psittacosaurus var släkt med Triceratops men saknade dess stora horn och krage. Som vuxen gick den på bakbenen. Den korta, starka näbben kunde klippa växter, och stenar i magen hjälpte till att bearbeta maten. Ett ovanligt fint fossil visar både fjäll och långa borst på svansen. Det har också bevarat spår av färgämnen. Forskare tror att det djuret var mörkare på ryggen och ljusare på magen, så att det syntes sämre i skuggan.',
      en: 'Psittacosaurus was related to Triceratops but lacked its big horns and frill. As an adult it walked on its hind legs. Its short, strong beak could crop plants, and stones in its belly helped process the food. One unusually fine fossil shows both scales and long tail bristles. It also preserves traces of pigment. Scientists think that animal was darker on its back and lighter on its belly, helping it hide in the shade.',
    },
    facts: [
      { sv: 'Namnet betyder papegojödla.', en: 'Its name means parrot lizard.' },
      { sv: 'Svansborsten i ett fossil är ungefär 16 centimeter långa.', en: 'The tail bristles in one fossil are about 16 centimetres long.' },
      { sv: 'Man har hittat fossil från små ungar till vuxna djur.', en: 'Fossils have been found from tiny babies to grown-ups.' },
    ],
    sound: {
      sv: 'Ingen vet säkert hur Psittacosaurus lät. Papegojliknande näbb betyder inte papegojskrik.',
      en: 'Nobody knows for sure what Psittacosaurus sounded like. A parrot-like beak does not mean parrot-like squawks.',
    },
    starter: false,
    colour: 'known',
    source: WIKI('Psittacosaurus'),
  },
```

**Height.** My estimate is 1 m: for the stated 2 m adult standing on two hind legs I estimate hips at 0,7 m (35% of length) and add 0,3 m for the short neck and high rounded head.

**Numbers.** NHM: 2,0 m, 50 kg, 120 to 100 million years ago, China, Mongolia and Russia; movement on two or four legs. Wikipedia: the familiar *P. mongoliensis* reaches 2 m, adult mass likely exceeds 20 kg, genus dates about 125 to 105 million years ago, adults bipedal. The object uses NHM's 2 m and 50 kg, Wikipedia's genus dates and adult posture, and the common three-country record. **Mass caveat:** Wikipedia does not independently establish 50 kg; it is the NHM estimate, not an average of the two sources. The 16 cm bristles come from Wikipedia's description of specimen SMF R 4970.

**Species caveat.** The bristled, coloured fossil is not securely assigned to a species and is explicitly not *P. mongoliensis* in the colour study's interpretation. This is a genus card, combining a familiar adult size with features genuinely known somewhere in the genus, not a claim that every species had the same bristles, colours or size.

**Art brief line**

- `psittacosaurus` | Psittacosaurus | Small adult ceratopsian standing on two hind legs, short forearms, compact torso, high rounded parrot-like head and short strong beak, flared cheeks but no large facial horns and no Triceratops-like frill. Long tapering tail with a clearly visible single dorsal fringe of long unbranched bristles, based on the exceptional bristled specimen rather than asserted for every species. Mostly scaly body, not an all-over bird feather coat. | brown upper body with darker facial pigment and shoulders, gradual low transition to pale cream belly, darker mottling and bars on limbs, dark brown tail bristles

**Colour:** `known`, with a specimen-specific limit. Vinther et al. 2016 (paper's reconstruction/methods excerpt and author repository read, https://doi.org/10.1016/j.cub.2016.06.065; repository https://research-information.bris.ac.uk/en/publications/3d-camouflage-in-an-ornithischian-dinosaur/) reconstructed the pigment distribution of SMF R 4970: dark face and upper body, pale underside and patterned limbs. The tag refers to direct pigment evidence and reconstructed shading, not photographic certainty about exact brown shades, every body patch or every species. The art follows that reconstruction and adds no bright decorative hue.

**Sources**

- https://www.nhm.ac.uk/discover/dino-directory/psittacosaurus.html (valid HTML title: pronunciation, meaning, length, 50 kg estimate, countries and older date interval)
- https://en.wikipedia.org/wiki/Psittacosaurus (full article: date range, species limits, adult posture, beak, gastroliths, bristle length, colour-study specimen, growth and juveniles)
- https://doi.org/10.1016/j.cub.2016.06.065 (Vinther et al. 2016, reconstruction/methods excerpt read from the PDF at https://dinodata.de/bibliothek/pdf_0-9/001_3D_camouflage_vinther_dd.pdf; complete paper not read)

---

## 9. Borealopelta (Cretaceous)

```ts
  {
    id: 'borealopelta',
    name: 'Borealopelta',
    pronounce: { sv: 'bo-re-a-lo-PEL-ta', en: 'bor-ee-al-oh-PEL-tah' },
    meaning: { sv: 'Nordlig sköld', en: 'Northern shield' },
    group: 'dinosaur',
    period: 'cretaceous',
    fromMya: 112,
    toMya: 110,
    lengthM: 5.5,
    heightM: 1.5, // Estimate; see Height below.
    weightKg: 1300,
    sizeLike: { sv: 'Tung som en bil', en: 'As heavy as a car' },
    diet: 'herbivore',
    found: { sv: 'Kanada', en: 'Canada' },
    short: {
      sv: 'En växtätare med pansar och långa taggar vid axlarna. Ett fossil visar till och med rester av den sista maten.',
      en: 'A plant-eater with armour and long shoulder spikes. One fossil even shows remains of its last meal.',
    },
    long: {
      sv: 'Borealopelta hittades i en gruva i Kanada. Fossilet är ovanligt fint: pansarplattorna sitter kvar där de satt på kroppen, med rester av huden och de hårda höljena utanpå. Från axlarna stack stora taggar ut. Den hade ingen svansklubba som Ankylosaurus. I magen finns rester av ormbunkar. Spår av färgämnen får forskare att tro att ryggen var rödbrun och undersidan ljusare. Även ett pansrat djur kan behöva gömma sig.',
      en: 'Borealopelta was found in a mine in Canada. The fossil is unusually fine: its armour plates are still in their original positions, with traces of skin and the hard coverings over them. Large spikes stuck out from its shoulders. It had no tail club like Ankylosaurus. Its belly contains fern remains. Traces of pigment lead scientists to think its back was reddish brown and its underside paler. Even an armoured animal may need to hide.',
    },
    facts: [
      { sv: 'Fossilet hittades av en gruvarbetare år 2011.', en: 'The fossil was found by a miner in 2011.' },
      { sv: 'Mark Mitchell arbetade i sex år med att få fram fossilet ur stenen.', en: 'Mark Mitchell spent six years freeing the fossil from the rock.' },
      { sv: 'Djurets artnamn hedrar Mark Mitchells arbete.', en: 'The animal\'s species name honours Mark Mitchell\'s work.' },
    ],
    sound: {
      sv: 'Ingen vet säkert hur Borealopelta lät. Det fina fossilet visar huden men avslöjar inte lätet.',
      en: 'Nobody knows for sure what Borealopelta sounded like. The fine fossil shows its skin but does not reveal its call.',
    },
    starter: false,
    colour: 'known',
    source: WIKI('Borealopelta'),
  },
```

**Height.** My estimate is 1,5 m: for the stated 5,5 m low, broad nodosaur I allow 0,7 m of short-legged ground clearance plus 0,8 m of torso and dorsal armour (about 27% of length overall), with the shoulder spines projecting mainly sideways.

**Numbers.** Wikipedia: 5,5 m, 1,3 tonnes and about 112 to 110 million years ago. The card uses those values directly, converting tonnes to 1 300 kg. The 2011 discovery, six-year preparation and naming after Mitchell are all in the article. NHM has no valid directory page. The original paper describes the individual as probably adult or nearly adult, with developmental state not securely determined.

**Art brief line**

- `borealopelta` | Borealopelta | Low broad four-legged nodosaur with short sturdy legs, small armoured head, close transverse rows of keeled armour over the neck, back and flanks. One very large backward-and-sideward projecting curved shoulder spine on each side, both clearly readable. Long tapering tail without a club; reconstruct the missing rear body conservatively from nodosaur relatives. No Stegosaurus plates or giant horned frill. | Pose: walking in a slight front three-quarter view facing left to expose the shoulder spines. | reddish-brown upper body, lighter cream underside, shoulder-spine coverings paler than the body, subdued dark reddish-brown armour ridges

**Colour:** `known`. Brown et al. 2017 (full-text sections on pigment distribution, sampling and anatomy read, https://doi.org/10.1016/j.cub.2017.06.071) finds chemical evidence consistent with pheomelanin, reconstructs reddish-brown upper surfaces and countershading, and infers paler shoulder-spine coverings. **Do not repeat the Wikipedia lead's claim of preserved melanosomes as the basis:** the paper's colour inference is chemical, not a successful identification of intact melanosome bodies. Exact shades and the unpreserved rear-body pattern remain reconstructed.

**Sources**

- https://en.wikipedia.org/wiki/Borealopelta (full article: size, mass, dates, mine discovery, preparation, name, armour, shoulder spines, no club, stomach contents; colour wording checked against the original paper)
- https://doi.org/10.1016/j.cub.2017.06.071 (Brown et al. 2017, relevant full-text sections: anatomy, preservation, developmental caution, pigment chemistry, countershading and lighter shoulder spines; complete paper not read)

---

## 10. Corythosaurus (Cretaceous)

```ts
  {
    id: 'corythosaurus',
    name: 'Corythosaurus',
    pronounce: { sv: 'ko-ry-to-SAU-rus', en: 'koh-rith-OH-SORE-us' },
    meaning: { sv: 'Hjälmödla', en: 'Helmeted lizard' },
    group: 'dinosaur',
    period: 'cretaceous',
    fromMya: 77,
    toMya: 75.7,
    lengthM: 8,
    heightM: 3.1, // Estimate; see Height below.
    weightKg: 2800,
    sizeLike: { sv: 'Lång som en liten lastbil', en: 'As long as a small lorry' },
    diet: 'herbivore',
    found: { sv: 'Kanada', en: 'Canada' },
    short: {
      sv: 'En anknäbbad växtätare med en hög kam som en hjälm. Forskare tror att kammen hjälpte den att ropa.',
      en: 'A duck-billed plant-eater with a tall helmet-like crest. Scientists think the crest helped it call.',
    },
    long: {
      sv: 'Corythosaurus hade en hög, rundad kam ovanpå huvudet. Inuti gick luftgångar som hörde ihop med näsan. Forskare tror att de kunde förstärka djurets läten, ungefär som ett blåsinstrument. Det betyder inte att vi vet exakt hur den lät. Den hade en näbb framtill och tänder längre bak för växtmaten. Vissa fossil har bevarat avtryck av fjällen. Små ungar hade inte den vuxnas stora hjälm; kammen växte när djuret blev större.',
      en: 'Corythosaurus had a tall, rounded crest on top of its head. Inside were air passages connected to its nose. Scientists think they could amplify its calls, a little like a wind instrument. That does not mean we know exactly what it sounded like. It had a beak at the front and teeth further back for plant food. Some fossils preserve impressions of its scales. Small young did not have the adult\'s big helmet; the crest grew as the animal got bigger.',
    },
    facts: [
      { sv: 'Namnet syftar på en hjälm som bars i det antika Grekland.', en: 'Its name refers to a helmet worn in ancient Greece.' },
      { sv: 'Forskarna har hittat över 20 skallar.', en: 'Scientists have found more than 20 skulls.' },
      { sv: 'Hudavtryck visar att kroppen hade fjäll.', en: 'Skin impressions show that its body had scales.' },
    ],
    sound: {
      sv: 'Forskare tror att luftgångarna i kammen förstärkte låga läten, kanske som i ett blåsinstrument. Det exakta ljudet är okänt.',
      en: 'Scientists think the crest\'s air passages amplified low calls, perhaps like a wind instrument. The exact sound is unknown.',
    },
    starter: false,
    colour: 'guess',
    source: WIKI('Corythosaurus'),
  },
```

**Height.** My estimate is 3,1 m: for the stated 8 m four-legged hadrosaur I place the skull base near 2,4 m (30% of length) with the neck raised, then add the stated 0,708 m skull-and-crest height and round to the helmet top.

**Numbers.** NHM: 10,0 m, no mass, 76 to 74 million years ago, Canada and USA. Wikipedia: 7,7 to 9 m depending on specimen/species; Paul's *C. casuarius* estimate is explicitly 8 m and 2,8 tonnes, used together in the card. The genus range is about 77 to 75,7 million years ago, also used here. Wikipedia notes that secure records are concentrated in southern Alberta; `found` therefore says Canada. More than 20 skulls is in the description. The article contains competing species-count statements, so the card gives none.

**Art brief line**

- `corythosaurus` | Corythosaurus | Large adult duck-billed dinosaur on four limbs, front limbs shorter than hind limbs, long thick tail held straight out, plant-cropping beak, scaly body. Tall rounded laterally flattened helmet crest rises directly above the eyes, with a smoothly curved upper outline; no long rearward tube as in Parasaurolophus and no small Maiasaura-like bump. Keep the helmet profile unmistakable in the silhouette. | dusty olive-grey body with dark olive thigh bands, cream underside and throat, muted turquoise helmet crest with a narrow dark rim

**Colour:** `guess`. Skin impressions establish texture, not the depicted olive body or turquoise crest. No usable pigment result was verified for Corythosaurus. The crest hue is a design choice and is not claimed as a scientific inference.

**Sources**

- https://www.nhm.ac.uk/discover/dino-directory/corythosaurus.html (valid HTML title: pronunciation, meaning, size and older dates/country list)
- https://en.wikipedia.org/wiki/Corythosaurus (full article: paired species-level size and mass, genus dates, helmet, air passages, sound hypothesis, skin, more than 20 skulls, growth and geographic caveat)

---

## Baby-source entries

The format in `babies.md` is a two-column source table, not a `Baby` object schema. These rows use that same format and remain here because the brief permits no other file to be changed. Unverified hatchling sizes, shell colours and parental behaviour are omitted. “Not verified” describes this review's result, not a claim that no relevant fossil exists anywhere.

| Djur | Källa |
|---|---|
| Shonisaurus | Nyfödda djur och embryon identifieras i Smithsonian-institutionens forskningsreferat om möjliga födelseplatser, https://www.si.edu/newsdesk/releases/fossil-csi-analysis-giant-extinct-marine-reptile-graveyard-suggests-mysterious . Referatets text fanns i sökresultatet men direktöppningen misslyckades. Inget äggkort: havsreptil med evidens för levande födsel. Ingen säker ungstorlek verifierad. |
| Cryolophosaurus | https://en.wikipedia.org/wiki/Cryolophosaurus , hela artikeln: huvudskelettet kan vara ett inte fullvuxet djur; lösa tänder har förts till unga individer. Nykläckta ungar, artbestämda ägg och föräldravård verifierades inte. Ingen påhittad babytext. |
| Anurognathus | Bennett 2007, Paläontologische Zeitschrift, https://doi.org/10.1007/BF02990250 , återgivet i hela artikeln https://en.wikipedia.org/wiki/Anurognathus : det mindre exemplaret beskrivs som troligen inte fullvuxet. Inga säkert artbestämda ägg eller kläckningsmått verifierade. Flygförmåga direkt efter kläckning får inte överföras som ett säkert faktum från andra flygödlor. |
| Liopleurodon | Martill 1992, återgivet i hela artikeln https://en.wikipedia.org/wiki/Liopleurodon : ett ungt, försiktigt bestämt exemplar har födorester. Inget äggkort; levande födsel hos svanödlor stöds av släktingen Polycotylus, O'Keefe & Chiappe 2011, som redan anges i babies.md. Ingen Liopleurodon-specifik födelsestorlek verifierad. |
| Amargasaurus | Windholz & Cerda 2021, återgivet i hela artikeln https://en.wikipedia.org/wiki/Amargasaurus : skelettets tillväxtlinjer tyder på minst tio års ålder; full vuxenstorlek är osäker. Artbestämda ägg och nykläckta ungar verifierades inte. Titanosauriebon får inte presenteras som Amargasaurus-bon. |
| Ouranosaurus | Bertozzo m.fl. 2017, återgivet i hela artikeln https://en.wikipedia.org/wiki/Ouranosaurus : de två välkända skeletten kan vara nästan vuxna men ännu växande djur. Artbestämda ägg, nykläckta ungar och föräldravård verifierades inte. |
| Deinocheirus | Lee m.fl. 2014, återgivet i hela artikeln https://en.wikipedia.org/wiki/Deinocheirus : ett av de nya skeletten är ett inte fullvuxet djur. Artbestämda ägg och nykläckta ungar verifierades inte. Ingen säker uppgift om ungarnas fjäderdräkt eller skötsel. |
| Psittacosaurus | Hela artikeln https://en.wikipedia.org/wiki/Psittacosaurus , avsnitten Growth rate och Limb function: mycket små ungar är kända och ungar kan ha gått på fyra ben innan de blev tvåbenta. Zhao m.fl. 2013 behandlar benens tillväxt. Ingen säker äggfärg verifierad. Gruppen med en pålimmad äldre skalle är inte säkert belägg för en mamma som vaktar ungar. |
| Borealopelta | Brown m.fl. 2017, relevanta avsnitt i fulltext https://doi.org/10.1016/j.cub.2017.06.071 : utvecklingsstadiet är osäkert, troligen vuxet eller nästan vuxet. Artbestämda ägg, nykläckta ungar och föräldravård verifierades inte. Pinacosaurus-ungar är inte Borealopelta-ungar. |
| Corythosaurus | Dodson 1975, återgivet i hela artikeln https://en.wikipedia.org/wiki/Corythosaurus , avsnittet Growth: unga djur är kända; kammen är mindre och utvecklas senare. Artbestämda ägg och matning i boet verifierades inte. Maiasauras föräldravård får inte överföras som ett bevisat Corythosaurus-faktum. |

## Palette and silhouette check against the existing forty

The two direct-evidence brown palettes are intentionally constrained: Psittacosaurus has a bristled tail, bipedal parrot head and low countershading transition; Borealopelta has a broad armoured body and enormous lateral shoulder spines. Their overlap with brown animals already in the deck is not removed by inventing bright fossil colours.

Among the guesses, Cryolophosaurus adds blue-grey with a transverse copper fan, Amargasaurus wine-brown neck webs, Ouranosaurus a pale blotched body and blue dorsal sail, Deinocheirus a shaggy olive-brown hump and wide ivory bill, and Corythosaurus a turquoise upright helmet. Shonisaurus has softer charcoal-to-grey shading than the navy-and-silver Ichthyosaurus, while Liopleurodon has a warm stone-grey mottled body and a much larger head relative to its neck. Anurognathus is a round-headed, short-tailed flier, unlike both Pteranodon and the upright Quetzalcoatlus.

Closest outline risks are Cryolophosaurus versus Dilophosaurus (the transverse crest needs the specified three-quarter view), Shonisaurus versus Ichthyosaurus (the long narrow flippers must remain visible; size alone does not distinguish silhouettes), and Borealopelta versus Ankylosaurus (shoulder spines and the absence of a tail club must be obvious). Art has not been generated or tested here. Those checks must happen on the finished illustrations.

## Open doubts and integration limits

1. **Estimated heights:** all ten `heightM` fields are now filled with explicitly labelled editorial estimates, explained per animal. They describe the proposed illustration poses and must not be presented as verified measurements.
2. **Colour search:** Europe PMC returned HTTP 503 for every attempted selected-genus query. The targeted searches and papers above support the positive findings; they cannot prove the absence of other pigment work.
3. **Anurognathus meaning and pronunciations:** the article's “frog jaw” is used, but the etymology was not independently resolved. Swedish guides and the three non-NHM English guides are editorial approximations.
4. **Geological ranges:** Shonisaurus uses a single sourced date. Ouranosaurus uses the Aptian's approximate boundaries, not proof of occupation throughout that stage. Cryolophosaurus and Amargasaurus retain the explicitly published broad numerical ranges, whose accompanying stage labels are not perfectly consistent with modern boundaries. Liopleurodon's broader genus and narrower European dates differ as explained above.
5. **Unpreserved anatomy:** Shonisaurus soft-tissue fin shape, Amargasaurus spine covering, Ouranosaurus sail versus hump, Deinocheirus feather coverage and tail fan, and Borealopelta's missing rear anatomy all require reconstruction. The art briefs state these limits rather than making the selected treatment a fossil fact.
6. **Baby claims:** most rows supply a limit on what can be said, not evidence for a new hatchling story. No specific egg colour or parental-care story was verified for this batch. Shonisaurus has a promising direct newborn report, but the museum release's direct page could not be opened with the web tool.
7. **No integration work:** only this research file was created in the repository. No app code, images, sound assets, existing research documents, git index or git history were changed by this task. The colour-list tests, pronunciation tooling, baby data, art schedule and deck count will need a separate implementation task after the card data is complete and reviewed.
