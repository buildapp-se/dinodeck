# Batch 5b: ten new Cretaceous animals

Researched 2026-10-28, with the system date checked before writing. Ready-to-paste `Dino` objects using the existing `NHM` and `WIKI` helpers, bilingual children's text, one art brief line and colour tag per animal, and baby-source rows in the format of `babies.md`. Only this file is a repository deliverable.

**How it was checked.** Web search was followed by downloading and reading the complete English Wikipedia article bodies and infoboxes for the ten selections. Article HTML was used because the MediaWiki API refused access. Every selected NHM Dino Directory URL was downloaded and its actual HTML `<title>` inspected. Four titles name the animal: Pachyrhinosaurus, Einiosaurus, Caudipteryx and Mononykus. Archelon, Kosmoceratops, Pterodaustro, Nyctosaurus, Hesperornis and Jakapil return `undefined | Natural History Museum` despite HTTP success; none is cited as a valid directory source. Numbers below come from those read directory pages or full Wikipedia articles, with conversions and rounding identified. Supplementary papers support anatomy, diet and pigment claims, not substitute unsourced numerical card values.

**Colour checking.** The batch-3 Europe PMC query, `<genus> AND (melanosome OR melanin OR coloration OR colour OR pigment)`, was attempted for every selection with the first five results requested. All ten requests returned HTTP 503, so no result titles could be checked that way. Targeted web searches and the primary-paper passages or abstracts identified below were used instead. `guess` means no usable direct or sufficiently close pigment result was verified in this review, not proof that none exists. `relatives` never establishes the depicted animal's exact hue or pattern. Caudipteryx has direct evidence, with the specimen and sampling limits explained below.

**Spread.** Cretaceous 10. Diets: herbivore 4, carnivore 3, piscivore 2, omnivore 1. Here `carnivore` includes Mononykus's inferred insects and Pterodaustro's inferred small aquatic invertebrates. `piscivore` is a useful diet label for Hesperornis and Nyctosaurus, not a claim that either ate fish exclusively. Groups: dinosaur 7, pterosaur 2, marine 1. Hesperornis is a bird, therefore a dinosaur; Archelon is a marine turtle, not a dinosaur. Colour tags: known 1, relatives 6, guess 3.

**Selection.** All fifty existing ids in `src/dinos.ts` and `src/dinos-won.ts`, including batch 4's ten, were checked. None of these selections repeats them. Familiar Pachyrhinosaurus and Archelon lead; the remaining hooks are a bent nose horn, a frill of forward curls, a sieve jaw, an antler-like crest, a short feather-fan tail, tiny one-clawed arms, a wingless diving bird and a small armoured biped. Three ceratopsids are retained because their adult heads change the outline in different ways, rather than merely changing horn length. The specified views are essential. These are anatomical design checks, not a claim that finished silhouette art has been tested.

**Considered and left out.** Batch 4's Cretaceous exclusions stay excluded: Utahraptor, Tarbosaurus and Albertosaurus resemble existing hunters; Lambeosaurus overlaps Corythosaurus; Nigersaurus's muzzle is easily lost in side view; Concavenator's hump overlaps the existing unusual-backed theropods. Elasmosaurus would add an extreme neck, but its full Wikipedia article supplies no living body mass; the 360 kg mentioned there is collected fossil material, not the animal. Tupandactylus and Tapejara have excellent crests but no usable body mass in their full articles. Dsungaripterus has an upturned beak but likewise lacks a usable mass in its article. Tsintaosaurus has a striking crest, but overlaps the existing hadrosaurs and has disputed crest reconstructions. Gastonia and Sauropelta were considered on outline alone and left out because Borealopelta already supplies large shoulder spikes; no numerical research is claimed for those two. No batch-4 exclusion was reinstated.

**Editorial conventions.** All Swedish pronunciation guides are approximate reading aids. English guides are adapted from NHM where available; Pterodaustro follows AMNH, Mononykus uses the NHM-style alternative, and the others are editorial guides, not independently verified dictionary pronunciations. Code numbers use decimal points; Swedish prose uses decimal commas and spaces in thousands. Everyday size comparisons are loose comparisons. Every `heightM` is an editorial estimate of the full vertical extent of the proposed pose, including crests or lowered feet/flippers, not a measured fossil height. Uncertain sounds are left unknown rather than supplied with an invented call.

---

## 1. Pachyrhinosaurus (Cretaceous)

```ts
  {
    id: 'pachyrhinosaurus',
    name: 'Pachyrhinosaurus',
    pronounce: { sv: 'pa-ky-ri-no-SAU-rus', en: 'pack-ee-RINE-oh-SORE-us' },
    meaning: { sv: 'Tjocknosödla', en: 'Thick-nosed lizard' },
    group: 'dinosaur',
    period: 'cretaceous',
    fromMya: 73.5,
    toMya: 71,
    lengthM: 8,
    heightM: 2.6, // Estimate; see Height below.
    weightKg: 4000,
    sizeLike: { sv: 'Lång som två bilar efter varandra', en: 'As long as two cars parked end to end' },
    diet: 'herbivore',
    found: { sv: 'Kanada och USA', en: 'Canada and USA' },
    short: {
      sv: 'En släkting till Triceratops med en stor, platt benknöl på nosen i stället för ett noshorn.',
      en: 'A relative of Triceratops with a big, flat bony lump on its nose instead of a nose horn.',
    },
    long: {
      sv: 'Pachyrhinosaurus hade ett stort huvud med benkrage, näbb och starka tänder för växter. På nosen och ovanför ögonen satt breda benknölar. Från kragen stack horn upp, men ansiktet saknade Triceratops långa horn. I Kanada har forskare hittat många skelett tillsammans, både unga och vuxna. Därför tror de att djuren levde i flock. En art levde så långt norrut som i Alaska, där vintern hade långa perioder av mörker.',
      en: 'Pachyrhinosaurus had a big head with a bony frill, a beak and strong teeth for plants. Broad bony lumps sat on its nose and above its eyes. Horns rose from the frill, but its face lacked the long horns of Triceratops. In Canada, scientists have found many skeletons together, both young and adult. That is why they think the animals lived in herds. One species lived as far north as Alaska, where winter brought long periods of darkness.',
    },
    facts: [
      { sv: 'Namnet betyder tjocknosödla.', en: 'Its name means thick-nosed lizard.' },
      { sv: 'En stor samling fossil hittades av en lärare i Kanada.', en: 'A large collection of fossils was found by a teacher in Canada.' },
      { sv: 'Ungarnas nosar såg annorlunda ut än de vuxnas.', en: 'The young had different-looking noses from the adults.' },
    ],
    sound: {
      sv: 'Ingen vet säkert hur Pachyrhinosaurus lät. Benknölarna avslöjar inte vilket läte den hade.',
      en: 'Nobody knows for sure what Pachyrhinosaurus sounded like. Its bony lumps do not reveal its call.',
    },
    starter: false,
    colour: 'relatives',
    source: WIKI('Pachyrhinosaurus'),
  },
```

**Height.** My estimate is 2,6 m: for the stated 8 m quadruped I place the back near 2 m (25% of length), then allow 0,6 m more for the raised frill and its horns.

**Numbers.** NHM: 8 m, 4 000 kg, 74 to 68 million years ago, Canada and USA. Wikipedia: *P. canadensis* 6 to 8 m and 3 to 4 tonnes; the smaller *P. lakustai* and *P. perotorum* about 5 m and 2 tonnes. The card uses the upper *P. canadensis* estimates, which agree with NHM, and Wikipedia's genus interval of 73,5 to 71 million years. Wikipedia gives *P. lakustai* 73,5 to 72,5, *P. canadensis* about 73 to 71, and *P. perotorum* about 73. The card is genus-wide in date and distribution but depicts the large Canadian species, not an 8 m Alaskan individual. NHM's younger endpoint is not adopted.

**Art brief line**

- `pachyrhinosaurus` | Pachyrhinosaurus | Large four-legged ceratopsid, specifically the adult P. canadensis body and head. Heavy body, short tail, parrot-like beak, broad low flattened nasal boss and smaller brow bosses instead of long facial horns. Bony frill with a prominent pair of upward horns; use the P. canadensis frill, without P. lakustai's extra central comb. Reconstruct the boss covering conservatively as a thick pad, not a giant speculative rhinoceros horn. | Pose: standing in slight front three-quarter view facing left, broad nasal boss and both frill horns visible in the outer outline. | warm charcoal-brown upper body, cream underside, dark brown facial bosses, pale buff frill with a broad muted copper rim

**Colour:** `relatives`. Vinther et al. 2016, abstract read in the [author repository](https://research-information.bris.ac.uk/en/publications/3d-camouflage-in-an-ornithischian-dinosaur/), documents countershading and dark facial pigment in Psittacosaurus. Transfer to a much larger, later ceratopsian is weak. The pale belly and dark face are informed choices; copper frill and exact body shade are guesses. NHM says no Pachyrhinosaurus skin fossil is known, so neither scales nor feathers are a direct observation for this genus.

**Sources**

- [Wikipedia: Pachyrhinosaurus](https://en.wikipedia.org/wiki/Pachyrhinosaurus), complete article and infobox: species sizes, genus dates, boss and frill differences, Al Lakusta's discovery, mixed-age bonebeds and growth.
- [NHM: Pachyrhinosaurus](https://www.nhm.ac.uk/discover/dino-directory/pachyrhinosaurus.html), valid title: pronunciation, meaning, size, older dates, Alaska's dark winters and skin-evidence limits.
- [Hieronymus et al. 2009](https://doi.org/10.1002/ar.20985), abstract read: bony bosses and their inferred facial coverings. Exact soft-tissue outline remains reconstructed.

---

## 2. Archelon (Cretaceous, marine turtle)

```ts
  {
    id: 'archelon',
    name: 'Archelon',
    pronounce: { sv: 'AR-ke-lon', en: 'AR-keh-lon' },
    meaning: { sv: 'Tidig sköldpadda', en: 'Early turtle' },
    group: 'marine',
    period: 'cretaceous',
    fromMya: 80.2,
    toMya: 74.2,
    lengthM: 4.6,
    heightM: 1.4, // Estimate; see Height below.
    weightKg: 2200,
    sizeLike: { sv: 'En sköldpadda lika lång som en bil', en: 'A turtle as long as a car' },
    diet: 'carnivore',
    found: { sv: 'USA', en: 'USA' },
    short: {
      sv: 'En jättestor havssköldpadda med bred kropp och långa simfenor. Den var ingen dinosaurie.',
      en: 'A giant sea turtle with a broad body and long flippers. It was not a dinosaur.',
    },
    long: {
      sv: 'Archelon simmade i ett hav som en gång delade Nordamerika. Ovanpå kroppen fanns ett glest skelett av ben under en seg, läderlik täckning. Det var inte samma hårda skal som hos många sköldpaddor i dag. Framtill satt en kraftig, krokig näbb. Forskare tror att den åt havsdjur, men är inte säkra på vilka som var viktigast. De stora främre simfenorna gav kroppen fart genom vattnet. En av de största sköldpaddor som hittats hör till Archelon.',
      en: 'Archelon swam in a sea that once divided North America. On top of its body was an open framework of bones beneath a tough, leathery covering. It was not the same hard shell found in many turtles today. At the front was a strong, hooked beak. Scientists think it ate sea animals, but are unsure which were most important. Its large front flippers drove its body through the water. One of the biggest turtles ever found belongs to Archelon.',
    },
    facts: [
      { sv: 'Det största kända skelettet kallas Brigitta.', en: 'The largest known skeleton is nicknamed Brigitta.' },
      { sv: 'Näbben var krokig, lite som hos en rovfågel.', en: 'Its beak was hooked, a little like a bird of prey\'s.' },
      { sv: 'Fossil har hittats i både South Dakota och North Dakota.', en: 'Fossils have been found in both South Dakota and North Dakota.' },
    ],
    sound: {
      sv: 'Ingen vet säkert hur Archelon lät. Forskarna har inte kunnat återskapa dess ljud.',
      en: 'Nobody knows for sure what Archelon sounded like. Scientists have not reconstructed its sounds.',
    },
    starter: false,
    colour: 'relatives',
    source: WIKI('Archelon'),
  },
```

**Height.** My estimate is 1,4 m: for the stated 4,6 m shallow-bodied turtle I allow 0,6 m of shell/body depth plus 0,8 m of downward front-flipper projection in the proposed swimming pose.

**Numbers.** Wikipedia gives the largest specimen 4,6 m from head to tail and 2,2 to 3,2 tonnes; the card uses 4,6 m and the lower published mass, 2 200 kg, not a newly calculated average. Its numerical infobox interval is 80,21 to 74,21 million years, rounded to 80,2 to 74,2. These are approximate occurrence bounds, not precise extinction dates; the article discusses possible younger survival. NHM's directory URL has the undefined title, so there is no valid directory comparison. The separate NHM turtle feature supports the general anatomy but is not used to bypass the permitted-number rule.

**Source disagreement worth preserving.** Wikipedia says Brigitta was discovered in 1992, but the specimen's [Vienna museum account](https://artsandculture.google.com/asset/giant-marine-turtle/7wHSsObK2gtSww) describes collection in the 1970s and acquisition in 1976; the [Black Hills Institute specimen account](https://www.bhigr.com/archelon-sea-turtle/) also says the 1970s. The card gives no discovery year. Wikipedia's leathery shell is an anatomical reconstruction, not preserved coloured leather.

**Art brief line**

- `archelon` | Archelon | Giant marine turtle, not a dinosaur. Broad shallow oval body with a leathery carapace over an open bony framework, not exposed ribs and not a high tortoise dome. Elongated head with a strong hooked beak, large powerful front flippers, smaller hind flippers and a visible tapering tail. Modest shell ridges are reconstructed; no decorative polygonal scutes asserted as known. | Pose: swimming in a slight upper-front three-quarter view facing left, wide turtle outline and both front flippers clearly separated from the body. | deep warm brown-grey upper shell, muted grey-brown head and flippers, pale sandy cream underside, subdued lighter flecks along the shell margin

**Colour:** `relatives`, very weak. Lindgren et al. 2014, [abstract and extended-data captions](https://www.nature.com/articles/nature12899) read, identifies eumelanin in the fossil turtle Eosphargis breineri. This is broad fossil marine-turtle evidence, not an Archelon result, and Archelon is not a leatherback ancestor. Dark pigment is plausible; the brown tone, flecks and pale belly are guesses, and countershading is not demonstrated for Archelon.

**Sources**

- [Wikipedia: Archelon](https://en.wikipedia.org/wiki/Archelon), complete article and infobox: size, mass, dates, naming, framework shell, beak, flippers, uncertain prey, Brigitta and Dakota localities.
- [NHM: Archelon, the biggest turtle to ever live](https://www.nhm.ac.uk/discover/giant-prehistoric-turtles.html), feature text read through web search: separate protostegid lineage and shell framework.
- [Lindgren et al. 2014](https://doi.org/10.1038/nature12899), abstract and relevant extended-data captions: fossil turtle pigment.

---

## 3. Einiosaurus (Cretaceous)

```ts
  {
    id: 'einiosaurus',
    name: 'Einiosaurus',
    pronounce: { sv: 'ej-ni-o-SAU-rus', en: 'eye-nee-oh-SORE-us' },
    meaning: { sv: 'Bisonödla', en: 'Bison lizard' },
    group: 'dinosaur',
    period: 'cretaceous',
    fromMya: 74.5,
    toMya: 74,
    lengthM: 4.5,
    heightM: 1.8, // Estimate; see Height below.
    weightKg: 1300,
    sizeLike: { sv: 'Lång som en bil', en: 'As long as a car' },
    diet: 'herbivore',
    found: { sv: 'USA', en: 'USA' },
    short: {
      sv: 'En växtätare med ett noshorn som hos vissa vuxna böjde sig framåt och nedåt som en krok.',
      en: 'A plant-eater whose nose horn curved forwards and downwards like a hook in some adults.',
    },
    long: {
      sv: 'Einiosaurus var släkt med Styracosaurus men hade ett annorlunda huvud. Hos vissa vuxna böjde sig noshornet nedåt, medan andra hade ett rakare horn. Från benkragen stack ett par långa taggar bakåt. Den gick på fyra starka ben och bet av växter med näbben. Längre in i munnen satt täta rader av tänder. Många ben har hittats tillsammans i Montana, så forskare tror att djuren levde i flock.',
      en: 'Einiosaurus was related to Styracosaurus but had a different head. In some adults the nose horn curved downwards, while others had a straighter horn. A pair of long spikes pointed backwards from the bony frill. It walked on four strong legs and cropped plants with its beak. Further inside its mouth were tightly packed rows of teeth. Many bones have been found together in Montana, so scientists think the animals lived in herds.',
    },
    facts: [
      { sv: 'Ordet för bison i namnet kommer från svartfotsfolkets språk.', en: 'The word for bison in its name comes from the Blackfeet language.' },
      { sv: 'Den hade inga långa horn ovanför ögonen som Triceratops.', en: 'It did not have long horns above its eyes like Triceratops.' },
      { sv: 'Forskare har hittat ben från både unga och vuxna djur.', en: 'Scientists have found bones from both young and adult animals.' },
    ],
    sound: {
      sv: 'Ingen vet säkert hur Einiosaurus lät. Ett krokigt horn berättar inte vilket ljud den gjorde.',
      en: 'Nobody knows for sure what Einiosaurus sounded like. A hooked horn does not tell us what sound it made.',
    },
    starter: false,
    colour: 'relatives',
    source: WIKI('Einiosaurus'),
  },
```

**Height.** My estimate is 1,8 m: for the stated 4,5 m compact quadruped I estimate the back at 1,2 m and add 0,6 m for the frill/spike tops; the nose hook points down and adds no height.

**Numbers.** NHM: 6 m, no mass, 74 million years ago, USA. Wikipedia: Paul's paired estimate of 4,5 m and 1,3 tonnes, and an infobox range of 74,5 to 74 million years. The card follows Wikipedia's paired size and dates, converting the mass to 1 300 kg. The hook is not universal: the article describes both erect and strongly curved adult horn cores, so both card and art identify the curved adult morph rather than every individual. The genus meaning is the sourced Blackfeet/Greek combination, not a claim that it is related to modern bison.

**Art brief line**

- `einiosaurus` | Einiosaurus | Compact heavy ceratopsid on four legs, short tail, narrow pointed snout ending in a beak. Depict the adult morph with one strongly forward-and-downward curving nasal horn, clearly hooked over the snout. No long brow horns. Relatively small frill with one main pair of long backward-projecting spikes and smaller marginal ornaments, not Styracosaurus's many radiating long spikes. | Pose: walking in slight side three-quarter view facing left, nose hook and both main frill spikes clear of the body outline. | dusty plum-brown body, cream belly, pale horn-coloured nose hook and frill spikes, muted cream frill with narrow dark plum edging

**Colour:** `relatives`. Same weak Psittacosaurus evidence as Pachyrhinosaurus, [Vinther et al. 2016 abstract](https://research-information.bris.ac.uk/en/publications/3d-camouflage-in-an-ornithischian-dinosaur/). Countershading and facial darkening are permitted illustration choices, not verified Einiosaurus features. Plum body and frill pattern are guesses.

**Sources**

- [Wikipedia: Einiosaurus](https://en.wikipedia.org/wiki/Einiosaurus), complete article and infobox: paired length/mass, dates, variable nasal horns, frill spikes, dental batteries, mixed-age bonebeds and name.
- [NHM: Einiosaurus](https://www.nhm.ac.uk/discover/dino-directory/einiosaurus.html), valid title: pronunciation, meaning, 6 m alternative and downward-curving nasal horn.

---

## 4. Kosmoceratops (Cretaceous)

```ts
  {
    id: 'kosmoceratops',
    name: 'Kosmoceratops',
    pronounce: { sv: 'kos-mo-SE-ra-tops', en: 'koz-mo-SER-uh-tops' },
    meaning: { sv: 'Prytt hornansikte', en: 'Ornate horned face' },
    group: 'dinosaur',
    period: 'cretaceous',
    fromMya: 76,
    toMya: 75.9,
    lengthM: 4.5,
    heightM: 1.8, // Estimate; see Height below.
    weightKg: 1200,
    sizeLike: { sv: 'Ungefär lika lång som en bil', en: 'About as long as a car' },
    diet: 'herbivore',
    found: { sv: 'USA', en: 'USA' },
    short: {
      sv: 'En växtätare med horn som böjde sig åt sidorna och en bred krage med framåtböjda krokar.',
      en: 'A plant-eater with horns that curved out to the sides and a wide frill with forward-curving hooks.',
    },
    long: {
      sv: 'Kosmoceratops hade ett huvud fullt av märkliga former. Hornen ovanför ögonen pekade utåt och böjde sig sedan nedåt. Benkragen var kort men mycket bred, med en rad hornliknande krokar längs kanten. De flesta böjde sig framåt över kragen. Forskare tror att utsmyckningen användes för att visa upp sig för andra djur av samma sort. Munnen hade en näbb framtill och många tätt packade tänder längre bak som kunde klippa sönder växter.',
      en: 'Kosmoceratops had a head full of strange shapes. The horns above its eyes pointed outwards and then curved down. Its bony frill was short but very wide, with a row of horn-like hooks along the edge. Most curved forwards over the frill. Scientists think the ornaments were used for display to other animals of the same kind. Its mouth had a beak at the front and many tightly packed teeth further back that could slice plants.',
    },
    facts: [
      { sv: 'Huvudet hade sammanlagt 15 stora horn och hornliknande utskott.', en: 'Its head had 15 large horns and horn-like projections altogether.' },
      { sv: 'Fossilen hittades i Utah i USA.', en: 'Its fossils were found in Utah in the USA.' },
      { sv: 'Artnamnet hedrar Scott Richardson, som hittade fossilen.', en: 'Its species name honours Scott Richardson, who found the fossils.' },
    ],
    sound: {
      sv: 'Ingen vet säkert hur Kosmoceratops lät. Huvudets utsmyckning bevarar inte djurets röst.',
      en: 'Nobody knows for sure what Kosmoceratops sounded like. Its head ornaments do not preserve its voice.',
    },
    starter: false,
    colour: 'relatives',
    source: WIKI('Kosmoceratops'),
  },
```

**Height.** My estimate is 1,8 m: for the stated 4,5 m quadruped I estimate the back near 1,2 m and allow 0,6 m above that for the raised frill, with its hooks curved forward rather than towering vertically.

**Numbers.** Wikipedia pairs 4,5 m with 1,2 tonnes, used together here as 4,5 m and 1 200 kg. Its lead/infobox and final biogeographic discussion give 76 to 75,9 million years, used in the object. The paleoenvironment section also discusses formation sediments spanning 76,4 to 75,5; that is not substituted for the narrower taxon interval. The 15 counts both horns and horn-like ornaments, not 15 identical facial horns. The article describes ten large frill-edge ornaments, eight curved forward and two to the sides. NHM's directory title is undefined. A Utah museum release offers larger estimates, but the permitted numerical source here is Wikipedia. Canadian skull CMN 8801 has a disputed referral and is left out of `found`.

**Art brief line**

- `kosmoceratops` | Kosmoceratops | Four-legged heavy ceratopsid with a short tail and triangular plant-cropping beak. Short very broad frill with ten main hooked ornaments along its rear margin, eight curled forward over the frill and the outer pair to the sides. Brow horns extend outward, curve down and end in pointed tips; small blade-like nasal horn and prominent cheek horns. Keep the low curled fringe distinct from Styracosaurus's long straight radial spikes. | Pose: standing in front three-quarter view facing left, both sideways brow horns and the curled upper frill edge readable in silhouette. | sandy grey-brown body with a dark brown face, cream underside, pale frill bearing two large muted olive patches, dark brown hook tips

**Colour:** `relatives`. [Vinther et al. 2016 abstract](https://research-information.bris.ac.uk/en/publications/3d-camouflage-in-an-ornithischian-dinosaur/) supports shading and dark facial pigment only in Psittacosaurus. This is weak transfer across very different ceratopsians. The olive frill patches, horn tips and exact pattern are guesses.

**Sources**

- [Wikipedia: Kosmoceratops](https://en.wikipedia.org/wiki/Kosmoceratops), complete article and infobox: all object measurements, dates, ornament counts/orientations, teeth, discovery, naming, subadults and Canadian-referral dispute.
- [Sampson et al. 2010 research announcement, Natural History Museum of Utah](https://nhmu.utah.edu/press/amazing-horned-dinosaurs-unearthed-lost-continent), read through web search: skull ornamentation and herbivory; its alternative mass is not used.

