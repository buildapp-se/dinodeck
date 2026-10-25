# Batch 3: ten new animals

Researched 2026-10-25. Ready-to-paste `Dino` objects for `src/dinos-won.ts` (they use its `WIKI` helper and `NHM` from `dinos.ts`), one art brief line per animal in the `img-src/BRIEF-art.md` format, and a colour tag per animal in the style of `docs/research/dinosaur-colour.md` sections 2 and 6.

**How it was checked.** Every NHM Dino Directory page below was downloaded and its `<title>` checked (the 200-for-missing trap from `HANDOFF.md`): the 8 used all show the animal's name. `quetzalcoatlus.html` and `ichthyosaurus.html` return the title "undefined", so those two pages do not exist and the cards use Wikipedia. Wikipedia was read as the full plain-text article via the MediaWiki API. Numbers below come from those pages. Where NHM and Wikipedia disagree it says so, and which one the card follows. `heightM` is my estimate from the stated measurements, explained per animal. Colour-paper search: Europe PMC, `<genus> AND (melanosome OR melanin OR coloration OR colour OR pigment)`, top 5 hits read by title. No colour study of any of the ten turned up.

**Spread.** Triassic 3 (Coelophysis, Herrerasaurus, Eoraptor), Jurassic 3 (Ceratosaurus, Kentrosaurus, Ichthyosaurus), Cretaceous 4 (Baryonyx, Styracosaurus, Edmontosaurus, Quetzalcoatlus). Diets: carnivore 4, herbivore 3, piscivore 2, omnivore 1. Groups: dinosaur 8, marine 1, pterosaur 1. Colour tags: guess 7, relatives 3.

**Considered and left out.** Utahraptor (its silhouette is too close to Deinonychus and Velociraptor), Camarasaurus (the deck already has four sauropods), Megalosaurus (yet another big theropod, known from scraps), Postosuchus (the `Group` type has no slot for it).

---

## 1. Coelophysis (Triassic)

```ts
  {
    id: 'coelophysis',
    name: 'Coelophysis',
    pronounce: { sv: 'se-lo-FY-sis', en: 'seel-OH-fie-sis' },
    meaning: { sv: 'Ihålig form', en: 'Hollow form' },
    group: 'dinosaur',
    period: 'triassic',
    fromMya: 215,
    toMya: 201,
    lengthM: 3,
    heightM: 0.9,
    weightKg: 25,
    sizeLike: { sv: 'Längre än en säng, men lätt som ett barn', en: 'Longer than a bed, but as light as a child' },
    diet: 'carnivore',
    found: { sv: 'USA', en: 'USA' },
    short: {
      sv: 'En smal och snabb köttätare från tiden när dinosaurierna var nya. Den var lång men vägde inte mer än ett barn.',
      en: 'A slim, fast meat-eater from the time when dinosaurs were new. It was long but weighed no more than a child.',
    },
    long: {
      sv: 'Coelophysis var en av de första rovdinosaurierna. Benen var ihåliga, och det är därför den heter ihålig form. Det gjorde kroppen lätt, så den kunde springa fort när den jagade insekter och små kräldjur. På den tiden var dinosaurierna inte de största djuren: stora krokodilliknande kräldjur bestämde. Man trodde länge att Coelophysis åt sina egna ungar, men benen i magen visade sig komma från en liten krokodilsläkting.',
      en: 'Coelophysis was one of the first meat-eating dinosaurs. Its bones were hollow, which is why it is called hollow form. That made its body light, so it could run fast when it hunted insects and small reptiles. At that time dinosaurs were not the biggest animals: large crocodile-like reptiles were in charge. People long thought Coelophysis ate its own babies, but the bones in its belly turned out to come from a small crocodile relative.',
    },
    facts: [
      { sv: 'Hundratals skelett har hittats tillsammans på ett och samma ställe i USA.', en: 'Hundreds of skeletons have been found together in one single place in the USA.' },
      { sv: 'Den hade stora ögon och såg troligen lika skarpt som en hök.', en: 'It had big eyes and probably saw as sharply as a hawk.' },
      { sv: 'En Coelophysis-skalle har åkt med en rymdfärja ut i rymden.', en: 'A Coelophysis skull has travelled into space on a space shuttle.' },
    ],
    sound: {
      sv: 'Ingen vet säkert. Forskare gissar på väsningar och korta, hesa läten.',
      en: 'Nobody knows for sure. Scientists guess at hisses and short, hoarse calls.',
    },
    starter: false,
    colour: 'guess',
    source: NHM('coelophysis'),
  },
```

**Height.** Wikipedia says "more than a meter tall at the hips". That looks too high for a slim 3 m animal, and no bone lengths were checked. I put the head of an S-necked, level-bodied animal at about 0.9 m. Treat this as an estimate.

**Numbers.** NHM: 2,0 m, 27 kg, 225 to 190 million years, South Africa, USA, Zimbabwe. Wikipedia: up to 3 m, 15 to 25 kg (Paul), 215 to 201,4 million years, southwestern USA only. The NHM dates and the African finds include *Megapnosaurus* (formerly *Coelophysis rhodesiensis*), which Wikipedia now treats as a separate genus. The card follows Wikipedia, which makes the 3 m length differ from the NHM page it links to.

**Art brief line**

- `coelophysis` | Coelophysis | Slim, lightweight theropod on two long legs, body level, long S-curved neck, long narrow pointed head with large eyes, short arms with three clawed fingers, very long thin tail straight out, scaly skin. | warm grey with a bold black stripe from the eye down the neck, rows of small white spots along the back, cream belly

**Colour:** `guess`. No pigment has been reported for Coelophysis or any coelophysoid. Source: none found (Europe PMC search above).

**Sources**
- https://www.nhm.ac.uk/discover/dino-directory/coelophysis.html (pronunciation, meaning, hollow bones, phytosaurs and rauisuchids dominant, "baby" in the ribcage actually a small crocodile)
- https://en.wikipedia.org/wiki/Coelophysis (length, weight, dates, hundreds of skeletons at Ghost Ranch, eyes like eagles and hawks per Rinehart et al. 2004, skull aboard Endeavour STS-89 in 1998)

---

## 2. Herrerasaurus (Triassic)

```ts
  {
    id: 'herrerasaurus',
    name: 'Herrerasaurus',
    pronounce: { sv: 'her-re-ra-SAU-rus', en: 'herr-ray-rah-SORE-us' },
    meaning: { sv: 'Herreras ödla', en: 'Herrera\'s lizard' },
    group: 'dinosaur',
    period: 'triassic',
    fromMya: 231,
    toMya: 229,
    lengthM: 6,
    heightM: 1.5,
    weightKg: 350,
    sizeLike: { sv: 'Tung som fem vuxna människor', en: 'As heavy as five grown-ups' },
    diet: 'carnivore',
    found: { sv: 'Argentina', en: 'Argentina' },
    short: {
      sv: 'En av de allra första dinosaurierna. Den var en snabb jägare som sprang på två ben.',
      en: 'One of the very first dinosaurs. It was a fast hunter that ran on two legs.',
    },
    long: {
      sv: 'Herrerasaurus levde för över 230 miljoner år sedan, när dinosaurierna ännu var få. Den hade starka bakben, korta armar och stora händer med vassa klor. Underkäken hade en led i mitten som kunde glida, så den kunde hugga tag i bytet och hålla fast det. Forskare var länge osäkra på vad det var för djur, men i dag räknas den som en av de tidigaste dinosaurierna.',
      en: 'Herrerasaurus lived more than 230 million years ago, when dinosaurs were still few. It had strong back legs, short arms and big hands with sharp claws. Its lower jaw had a sliding joint in the middle, so it could grab its prey and hold on. Scientists were unsure for a long time what kind of animal it was, but today it is counted as one of the earliest dinosaurs.',
    },
    facts: [
      { sv: 'Den är uppkallad efter en getherde som hittade de första benen.', en: 'It is named after a goatherd who found the first bones.' },
      { sv: 'Den levde på samma plats och samtidigt som Eoraptor.', en: 'It lived in the same place and at the same time as Eoraptor.' },
      { sv: 'En skalle har bitmärken som troligen kom från en annan Herrerasaurus.', en: 'One skull has bite marks that probably came from another Herrerasaurus.' },
    ],
    sound: {
      sv: 'Ingen vet säkert. Forskare gissar på morranden och väsningar.',
      en: 'Nobody knows for sure. Scientists guess at growls and hisses.',
    },
    starter: false,
    colour: 'guess',
    source: WIKI('Herrerasaurus'),
  },
```

**Height.** For a 6 m biped with short thighs and long feet I estimate hip height at about 1,3 m, and the head on its slender neck reaches about 1,5 m. Estimate only: no hip height was found in any source.

**Numbers.** NHM gives only 3,0 m length and "228 million years ago". Wikipedia gives adults up to 6 m and 350 kg, smaller specimens 4,5 m and 200 kg, and Carnian rock about 231 to 229 million years old (it also mentions 231,4). The card follows Wikipedia and links to it, because the NHM page has no weight and a length half the adult size.

**Art brief line**

- `herrerasaurus` | Herrerasaurus | Early dinosaur on two strong legs, body level, tail straight out, long narrow head with many curved teeth, slender flexible neck, short arms ending in large hands with three clawed fingers, scaly skin. | dark brick red with black leopard-like rosette spots, pale buff belly

**Colour:** `guess`. No pigment reported for Herrerasaurus or any herrerasaurid. Source: none found.

**Sources**
- https://en.wikipedia.org/wiki/Herrerasaurus (size, dates, named after the goatherd Victorino Herrera, sliding jaw joint, bite wound probably from another Herrerasaurus, lived with Eoraptor, dinosaurs about 10 % of the formation's fossils)
- https://www.nhm.ac.uk/discover/dino-directory/herrerasaurus.html (pronunciation, meaning)

---

## 3. Eoraptor (Triassic)

```ts
  {
    id: 'eoraptor',
    name: 'Eoraptor',
    pronounce: { sv: 'e-o-RAP-tor', en: 'EE-oh-RAP-tor' },
    meaning: { sv: 'Gryningens rövare', en: 'Dawn plunderer' },
    group: 'dinosaur',
    period: 'triassic',
    fromMya: 231,
    toMya: 228,
    lengthM: 1.3,
    heightM: 0.5,
    weightKg: 10,
    sizeLike: { sv: 'Stor som en räv', en: 'The size of a fox' },
    diet: 'omnivore',
    found: { sv: 'Argentina', en: 'Argentina' },
    short: {
      sv: 'En av de äldsta dinosaurier man har hittat. Den var ungefär lika stor som en räv.',
      en: 'One of the oldest dinosaurs ever found. It was about the size of a fox.',
    },
    long: {
      sv: 'Eoraptor hittades i ett torrt och kargt område i Argentina som kallas Månens dal. Den sprang på två ben och hade fem fingrar på varje hand, där de tre längsta hade klor. Tänderna hade olika form: en del var böjda och sågtandade, andra var bladformade. Därför tror forskare att den åt både smådjur och växter. Forskarna är inte överens om den hör till långhalsarnas eller rovdinosauriernas släkt.',
      en: 'Eoraptor was found in a dry, barren area of Argentina called the Valley of the Moon. It ran on two legs and had five fingers on each hand, and the three longest had claws. Its teeth came in different shapes: some were curved and saw-edged, others were leaf-shaped. That is why scientists think it ate both small animals and plants. Scientists do not agree whether it belongs to the family of the long-necks or of the meat-eating dinosaurs.',
    },
    facts: [
      { sv: 'Den hade fem fingrar på varje hand.', en: 'It had five fingers on each hand.' },
      { sv: 'Det tog nästan ett år att gräva fram det första skelettet.', en: 'It took almost a year to dig out the first skeleton.' },
      { sv: 'Den levde samtidigt som Herrerasaurus, som var mycket större.', en: 'It lived at the same time as Herrerasaurus, which was much bigger.' },
    ],
    sound: {
      sv: 'Ingen vet säkert. Ett så litet djur gjorde kanske pipande eller kvittrande ljud.',
      en: 'Nobody knows for sure. An animal this small may have made squeaking or chirping sounds.',
    },
    starter: false,
    colour: 'guess',
    source: WIKI('Eoraptor'),
  },
```

**Height.** Wikipedia gives the holotype's femur as 152 mm and tibia as 157 mm. With a foot of about 90 mm (my estimate) that puts the hip near 0,4 m, and the raised head near 0,5 m.

**Numbers.** NHM: 1,7 m, 10 kg, carnivorous, "small theropod", 228 million years ago. Wikipedia: known specimens 1,2 to 1,3 m, about or under 10 kg, an omnivore, recovered as an early sauropodomorph in most analyses since 2011 (2013 redescription, 2018, 2025), 231 to 228 million years ago. The NHM page is out of date on diet and group, so the card follows Wikipedia and links to it.

**Art brief line**

- `eoraptor` | Eoraptor | Small, light early dinosaur on two long legs, body level, long tail straight out, small pointed head with big eyes, short arms with five fingers of which the three longest carry claws, scaly skin. | soft dove grey with a rusty orange face and throat, faint pale spots on the back

**Colour:** `guess`. No pigment reported. Source: none found.

**Sources**
- https://en.wikipedia.org/wiki/Eoraptor (size, femur and tibia, five fingers with three clawed, mixed teeth and omnivory, Valle de la Luna, almost 12 months to collect the holotype, classification debate, lived with Herrerasaurus)
- https://www.nhm.ac.uk/discover/dino-directory/eoraptor.html (pronunciation; its meaning "early plunderer" was replaced by Wikipedia's "dawn plunderer", the same Greek *eos*)

---

## 4. Ceratosaurus (Jurassic)

```ts
  {
    id: 'ceratosaurus',
    name: 'Ceratosaurus',
    pronounce: { sv: 'se-ra-to-SAU-rus', en: 'ser-AT-oh-SORE-us' },
    meaning: { sv: 'Hornödla', en: 'Horned lizard' },
    group: 'dinosaur',
    period: 'jurassic',
    fromMya: 152,
    toMya: 145,
    lengthM: 6.5,
    heightM: 2.2,
    weightKg: 1000,
    sizeLike: { sv: 'Nästan lika lång som två bilar', en: 'Almost as long as two cars' },
    diet: 'carnivore',
    found: { sv: 'USA och Portugal', en: 'USA and Portugal' },
    short: {
      sv: 'En köttätare med ett horn på nosen och en rad små benknölar längs ryggen.',
      en: 'A meat-eater with a horn on its nose and a row of small bony bumps along its back.',
    },
    long: {
      sv: 'Ceratosaurus levde på samma platser som Allosaurus, men den var mindre och mycket ovanligare. Hornet på nosen var för tunt för att slåss med, så forskare tror att det användes för att visa upp sig. Ovanför ögonen satt två små knölar. Tänderna i överkäken var mycket långa, nästan som knivblad. Ben från Allosaurus med tandmärken från Ceratosaurus visar att den troligen också åt av döda djur.',
      en: 'Ceratosaurus lived in the same places as Allosaurus, but it was smaller and much rarer. The horn on its nose was too thin to fight with, so scientists think it was used for showing off. Above its eyes sat two small bumps. The teeth in its upper jaw were very long, almost like knife blades. Allosaurus bones with Ceratosaurus tooth marks show that it probably also fed on dead animals.',
    },
    facts: [
      { sv: 'Det första skelettet hittades av en bonde i USA år 1883.', en: 'The first skeleton was found by a farmer in the USA in 1883.' },
      { sv: 'Den hade fyra fingrar på varje hand, men bara tre av dem hade klor.', en: 'It had four fingers on each hand, but only three of them had claws.' },
      { sv: 'Svansen var ungefär hälften så lång som hela djuret.', en: 'Its tail was about half as long as the whole animal.' },
    ],
    sound: {
      sv: 'Ingen vet säkert. Forskare gissar på djupa ljud med stängd mun.',
      en: 'Nobody knows for sure. Scientists guess at deep sounds made with its mouth closed.',
    },
    starter: false,
    colour: 'guess',
    source: NHM('ceratosaurus'),
  },
```

**Height.** Scaled from the Allosaurus card (9 m long, 3 m tall, same body plan): 6,5 / 9 × 3 = 2,2 m. Estimate.

**Numbers.** NHM: 7,0 m, 980 kg, 152 to 145 million years ago, Portugal and USA, "about six to seven metres". Wikipedia: holotype 5,3 or 5,69 m, the larger specimens about 7 m, mass estimates between 418 and 1 240 kg. The card says 6,5 m (the middle of NHM's own range) and 1 000 kg (NHM's 980, rounded).

**Art brief line**

- `ceratosaurus` | Ceratosaurus | Medium-large theropod on two legs, body level, tail straight out and deep from top to bottom. One thin blade-like horn on top of the nose, a small rounded ridge above each eye, deep jaws with long blade-like teeth, short arms with four fingers, a single row of small bony knobs along the middle of the neck, back and tail. Mouth closed or slightly open. | near-black with bold mustard-yellow crossbands over back and tail, nose horn and eye ridges orange-red, pale yellow belly

**Colour:** `guess`. Only bone is known (the osteoderm row is texture, not colour). No pigment reported. Source: none found.

**Sources**
- https://www.nhm.ac.uk/discover/dino-directory/ceratosaurus.html (size, dates, countries, horn probably for display, osteoderm row, rarer than Allosaurus, Felch 1883, probable tooth marks on Allosaurus bones)
- https://en.wikipedia.org/wiki/Ceratosaurus (four fingers with claws on the first three, upper teeth up to 9,3 cm, tail about half the total length, size range)

---

## 5. Kentrosaurus (Jurassic)

```ts
  {
    id: 'kentrosaurus',
    name: 'Kentrosaurus',
    pronounce: { sv: 'ken-tro-SAU-rus', en: 'KEN-troh-SORE-us' },
    meaning: { sv: 'Piggödla', en: 'Spiky lizard' },
    group: 'dinosaur',
    period: 'jurassic',
    fromMya: 155,
    toMya: 150,
    lengthM: 4.5,
    heightM: 2,
    weightKg: 1000,
    sizeLike: { sv: 'Tung som en bil', en: 'As heavy as a car' },
    diet: 'herbivore',
    found: { sv: 'Tanzania', en: 'Tanzania' },
    short: {
      sv: 'En släkting till Stegosaurus med smala plattor fram och långa, vassa taggar bak.',
      en: 'A relative of Stegosaurus with narrow plates at the front and long, sharp spikes at the back.',
    },
    long: {
      sv: 'Kentrosaurus var mindre än Stegosaurus och levde i det som i dag är Tanzania i Afrika. Längs ryggen satt två rader med plattor som längre bak blev till långa taggar, och troligen satt det en lång tagg på varje axel också. Svansen var mycket rörlig. Forskare har räknat ut att den kunde svepa i en halvcirkel, och att spetsen kanske rörde sig lika fort som en bil kör i stan.',
      en: 'Kentrosaurus was smaller than Stegosaurus and lived in what is now Tanzania in Africa. Along its back ran two rows of plates that turned into long spikes further back, and there was probably one more long spike on each shoulder. Its tail was very flexible. Scientists have worked out that it could sweep in a half circle, and that the tip may have moved as fast as a car drives in town.',
    },
    facts: [
      { sv: 'Forskare har hittat över 1 200 ben från ungefär 50 djur.', en: 'Scientists have found more than 1,200 bones from about 50 animals.' },
      { sv: 'Många ben förstördes i ett krig, men en del som man trodde var borta hittades senare i en låda.', en: 'Many bones were destroyed in a war, but some that were thought lost were later found in a drawer.' },
      { sv: 'Den kunde troligen snurra runt snabbt så att svansen pekade mot fienden.', en: 'It could probably spin round quickly so that its tail pointed at an attacker.' },
    ],
    sound: {
      sv: 'Ingen vet säkert. Det som hördes mest var kanske svansen som svischade genom luften.',
      en: 'Nobody knows for sure. The loudest sound may have been its tail swishing through the air.',
    },
    starter: false,
    colour: 'guess',
    source: NHM('kentrosaurus'),
  },
```

**Height.** For a 4,5 m stegosaur, with the back highest over the hips, I put hip height at about 1,4 m, and the hip spikes add about 0,5 m. Scaling the Stegosaurus card (9 m, 4 m) by the length ratio also gives 2 m. Estimate.

**Numbers.** NHM: 5,0 m, no weight, 155 to 150 million years ago, Tanzania. Wikipedia: 4 to 5 m (4 to 4,5 m "generally"), 700 to 1 600 kg, Tendaguru about 152 million years ago, upper Kimmeridgian to Tithonian. The card uses 4,5 m and 1 000 kg (inside both ranges) and NHM's dates.

**Art brief line**

- `kentrosaurus` | Kentrosaurus | Small stegosaur on four legs, front legs shorter than back legs, small narrow head held low. Two rows of narrow plates on the neck and front of the back that turn into long, thin, paired spikes over the hips and along the tail, one long spike pointing backward from each shoulder, tail held off the ground. | warm pinkish grey with darker grey dappling, plates and spikes bone white with black tips

**Colour:** `guess`. Same position as Stegosaurus: nothing on colour in any stegosaur. Source: none found.

**Sources**
- https://www.nhm.ac.uk/discover/dino-directory/kentrosaurus.html (pronunciation, meaning, length, dates, country)
- https://en.wikipedia.org/wiki/Kentrosaurus (weight, two rows of plates into spikes, shoulder spike, tail swing of 180 degrees at up to 50 km/h, quick rotation round the hips, over 1 200 bones from about 50 individuals, wartime losses, cranial material found in a basement drawer)

---

## 6. Ichthyosaurus (Jurassic, sea reptile)

```ts
  {
    id: 'ichthyosaurus',
    name: 'Ichthyosaurus',
    pronounce: { sv: 'ik-ty-o-SAU-rus', en: 'IK-thee-oh-SORE-us' },
    meaning: { sv: 'Fisködla', en: 'Fish lizard' },
    group: 'marine',
    period: 'jurassic',
    fromMya: 201,
    toMya: 184,
    lengthM: 2,
    heightM: 0.8,
    weightKg: 90,
    sizeLike: { sv: 'Lång som en dörr är hög', en: 'As long as a door is tall' },
    diet: 'piscivore',
    found: { sv: 'England, Tyskland, Belgien och Portugal', en: 'England, Germany, Belgium and Portugal' },
    short: {
      sv: 'Ett havsdjur som såg ut som en delfin. Det var ingen dinosaurie, men levde samtidigt som dem.',
      en: 'A sea animal that looked like a dolphin. It was not a dinosaur, but it lived alongside them.',
    },
    long: {
      sv: 'Ichthyosaurus hör till fisködlorna, kräldjur som levde hela livet i havet och aldrig gick upp på land. Den hade stora ögon, en lång nos med vassa tänder, en fena på ryggen och en stor stjärtfena. Den simmade snabbt och åt fisk och bläckfiskliknande djur. Den lade inga ägg: man har hittat fossil av mammor med ungar i magen, så ungarna föddes levande i vattnet.',
      en: 'Ichthyosaurus belongs to the ichthyosaurs, reptiles that spent their whole lives in the sea and never came onto land. It had big eyes, a long snout with sharp teeth, a fin on its back and a large tail fin. It swam fast and ate fish and squid-like animals. It did not lay eggs: fossils of mothers with babies inside have been found, so the young were born alive in the water.',
    },
    facts: [
      { sv: 'Mary Anning och hennes bror hittade Ichthyosaurus-fossil i England för över 200 år sedan.', en: 'Mary Anning and her brother found Ichthyosaurus fossils in England more than 200 years ago.' },
      { sv: 'Ett äkta fossil låg länge på ett museum och troddes vara en kopia i gips.', en: 'A real fossil sat in a museum for years because people thought it was a plaster copy.' },
      { sv: 'Man har hittat rester av fisk och bläckfiskliknande djur i magen.', en: 'Remains of fish and squid-like animals have been found in its stomach.' },
    ],
    sound: {
      sv: 'Ingen vet säkert. Forskare vet inte ens om den gjorde några ljud alls under vattnet.',
      en: 'Nobody knows for sure. Scientists do not even know whether it made any sounds at all under water.',
    },
    starter: false,
    colour: 'relatives',
    colourDisputed: true,
    source: WIKI('Ichthyosaurus'),
  },
```

**Height.** For a swimming pose, top of the back fin to the bottom of the lower tail lobe or flipper on a 2 m body, I estimate 0,8 m. (Plesiosaurus is 3,5 m long and 1,5 m tall in the same kind of pose.)

**Numbers.** Length: Wikipedia gives *I. communis* (type species) up to 2 m, *I. somersetensis* up to 3 to 3,3 m, the others 1,5 to 2,5 m. Dates: Wikipedia gives only the stages, Hettangian to Pliensbachian. Their Wikipedia pages put that at 201,3 to 184,2 million years ago. **Weight is not in any source I read.** The 90 kg is my scaling from Motani's estimate of 163 to 168 kg for a 2,4 m *Stenopterygius* (Wikipedia, Ichthyosauria): (2 / 2,4)³ × 165 ≈ 95 kg, rounded down because *Ichthyosaurus* is slimmer. Treat it as an estimate. NHM has no Dino Directory page (title "undefined").

**Art brief line**

- `ichthyosaurus` | Ichthyosaurus | Sea reptile, not a dinosaur. Dolphin-shaped body, long narrow toothed snout, very large eye, triangular fleshy fin on the back, four paddle flippers with the front pair larger, tall crescent-shaped tail fin with two near-equal lobes. | Pose: swimming. | deep navy above, sharp change to silvery white below, a thin pale line along the flank

**Colour:** `relatives`, `colourDisputed`. Ichthyosaur skin holds chemically confirmed eumelanin. Lindgren et al. 2014 read "at least some ichthyosaurs" as uniformly dark, while Lindgren et al. 2018 found pigment cells on the flank and not the belly of *Stenopterygius*, which suggests countershading. Wikipedia (Ichthyosauria) also cites a 2015 study doubting that basal melanosomes mean dark skin. Both papers are already in the colour doc's sources: https://europepmc.org/article/MED/24402224 and https://europepmc.org/article/MED/30518862. Which genus the 2014 specimen (YORYM 1993.338) belongs to was not checked. The palette follows 2018 (countershaded), which the evidence allows but does not prove.

**Sources**
- https://en.wikipedia.org/wiki/Ichthyosaurus (genus range, countries, sizes, live birth, Anning finds around 1811 to 1814, *I. anningae* mistaken for a plaster cast at Doncaster, belemnite and fish stomach contents, back fin and tail fin)
- https://en.wikipedia.org/wiki/Ichthyosauria (big eyes, Motani mass estimates, the colour dispute)
- https://en.wikipedia.org/wiki/Hettangian and https://en.wikipedia.org/wiki/Pliensbachian (stage dates)

---

## 7. Baryonyx (Cretaceous)

```ts
  {
    id: 'baryonyx',
    name: 'Baryonyx',
    pronounce: { sv: 'ba-ry-O-nyx', en: 'bah-ree-ON-icks' },
    meaning: { sv: 'Tung klo', en: 'Heavy claw' },
    group: 'dinosaur',
    period: 'cretaceous',
    fromMya: 130,
    toMya: 125,
    lengthM: 9,
    heightM: 3,
    weightKg: 2000,
    sizeLike: { sv: 'Tung som två bilar', en: 'As heavy as two cars' },
    diet: 'piscivore',
    found: { sv: 'England och Spanien', en: 'England and Spain' },
    short: {
      sv: 'En fiskätande dinosaurie med lång nos som en krokodil och en jättestor klo på tummen.',
      en: 'A fish-eating dinosaur with a long snout like a crocodile and a huge claw on its thumb.',
    },
    long: {
      sv: 'Baryonyx var släkt med Spinosaurus och hade samma långa, smala nos med många spetsiga tänder. Den kan ha stått vid flodkanter eller vadat i grunt vatten och fångat fisk med klorna. I magen på det första skelettet hittade forskarna fiskfjäll och ben från en ung släkting till Iguanodon. Det var första gången man kunde visa att en rovdinosaurie åt fisk.',
      en: 'Baryonyx was related to Spinosaurus and had the same long, narrow snout with many pointed teeth. It may have stood on river banks or waded in shallow water and caught fish with its claws. In the stomach of the first skeleton scientists found fish scales and bones from a young relative of Iguanodon. It was the first time anyone could show that a meat-eating dinosaur ate fish.',
    },
    facts: [
      { sv: 'Kloen på tummen var ungefär 31 centimeter lång, längre än en linjal.', en: 'The claw on its thumb was about 31 centimetres long, longer than a ruler.' },
      { sv: 'Det första skelettet hittades av en rörmokare som letade fossil i en lergrop i England.', en: 'The first skeleton was found by a plumber looking for fossils in a clay pit in England.' },
      { sv: 'Skelettet finns i dag på Natural History Museum i London.', en: 'The skeleton is now at the Natural History Museum in London.' },
    ],
    sound: {
      sv: 'Ingen vet säkert. Forskare gissar på låga, väsande ljud.',
      en: 'Nobody knows for sure. Scientists guess at low, hissing sounds.',
    },
    starter: false,
    colour: 'guess',
    source: NHM('baryonyx'),
  },
```

**Height.** Wikipedia gives hip height as 2,5 m, and the S-curved neck carries the head a little higher, so about 3 m.

**Numbers.** NHM: 10,0 m, 2 000 kg, 125 million years ago, England, Spain. Wikipedia: 7,5 to 10 m, 1,2 to 2 t, Barremian "about 130 to 125 million years ago". The card uses 9 m and NHM's 2 000 kg, the top of Wikipedia's range. **Date caveat:** Wikipedia's own Barremian page now dates the stage to 125,77 to 121,4 million years ago and calls 129,4 to 125 the historical placement, so 130 to 125 may be too old. A Portuguese specimen (ML1190) and Isle of Wight material are attributed in Wikipedia but left out of `found` to match NHM.

**Art brief line**

- `baryonyx` | Baryonyx | Large theropod on two legs, body level, tail straight out. Long, low, narrow crocodile-like snout with a rosette-shaped tip and a small crest on top, S-curved neck, strong arms with three fingers and a huge curved claw on the thumb, no sail. | light grey-green with dark olive saddle blotches along back and tail, dark eye stripe, white underside

**Colour:** `guess`. No pigment in any spinosaurid (Spinosaurus is also `guess`). Source: none found.

**Sources**
- https://www.nhm.ac.uk/discover/dino-directory/baryonyx.html (pronunciation, meaning, size, claw about 31 cm probably on the thumb, wading and hooking fish, scavenger)
- https://en.wikipedia.org/wiki/Baryonyx (size range, hip height, William Walker and the Smokejack Clay Pit in 1983, holotype NHM R9951, *Scheenstia* (*Lepidotes*) scales and young iguanodontid bones, first theropod shown to eat fish, gharial-like snout, rosette, nasal crest)
- https://en.wikipedia.org/wiki/Barremian (stage dates)

---

## 8. Styracosaurus (Cretaceous)

```ts
  {
    id: 'styracosaurus',
    name: 'Styracosaurus',
    pronounce: { sv: 'sty-ra-ko-SAU-rus', en: 'sty-RAK-oh-SORE-us' },
    meaning: { sv: 'Spjutödla', en: 'Spiked lizard' },
    group: 'dinosaur',
    period: 'cretaceous',
    fromMya: 76,
    toMya: 75,
    lengthM: 5.5,
    heightM: 2.2,
    weightKg: 2700,
    sizeLike: { sv: 'Tung som en noshörning', en: 'As heavy as a rhino' },
    diet: 'herbivore',
    found: { sv: 'Kanada och USA', en: 'Canada and USA' },
    short: {
      sv: 'En växtätare med ett långt horn på nosen och en krage full av långa taggar.',
      en: 'A plant-eater with a long horn on its nose and a frill full of long spikes.',
    },
    long: {
      sv: 'Styracosaurus var släkt med Triceratops men såg annorlunda ut: den hade ett enda stort horn på nosen och inga stora horn över ögonen. Från kragen stack långa taggar ut, och hur många de var skilde sig från djur till djur. Den gick långsamt på fyra ben och åt låga växter med sin papegojliknande näbb. Många skelett har hittats tillsammans, så forskare tror att den levde i flock.',
      en: 'Styracosaurus was related to Triceratops but looked different: it had one big horn on its nose and no big horns over its eyes. Long spikes stuck out from its frill, and how many there were differed from animal to animal. It walked slowly on four legs and ate low plants with its parrot-like beak. Many skeletons have been found together, so scientists think it lived in herds.',
    },
    facts: [
      { sv: 'Hornet på nosen kan ha blivit 60 centimeter långt.', en: 'The horn on its nose may have grown 60 centimetres long.' },
      { sv: 'De första fossilen hittades i Kanada år 1913.', en: 'The first fossils were found in Canada in 1913.' },
      { sv: 'Den levde samtidigt som Daspletosaurus, en släkting till Tyrannosaurus.', en: 'It lived at the same time as Daspletosaurus, a relative of Tyrannosaurus.' },
    ],
    sound: {
      sv: 'Ingen vet säkert. Forskare gissar på låga brummanden och fnysningar.',
      en: 'Nobody knows for sure. Scientists guess at low grunts and snorts.',
    },
    starter: false,
    colour: 'relatives',
    source: NHM('styracosaurus'),
  },
```

**Height.** Wikipedia says it "stood about 1,8 meters tall". The frill spikes point up and back above that, so the highest point in a standing three-quarter view is about 2,2 m. Estimate.

**Numbers.** NHM: 5,5 m, 2 700 kg, 76 to 75 million years ago, Canada and USA. Wikipedia: 5 to 5,5 m, 1,8 to 2,7 t. The card follows NHM. **Spike count conflict:** Wikipedia says four to six long frill spikes, NHM says some skulls show six and others eight. The card avoids a number ("differed from animal to animal", which NHM states directly). The art brief says six. **Meaning:** *styrax* is the spike at the butt end of a spear shaft (Wikipedia), so "Spjutödla" is a loose rendering. A closer one would be "Spjutspetsödla" or "Taggödla", but Spinosaurus already has "Taggödla".

**Art brief line**

- `styracosaurus` | Styracosaurus | Four short legs, bulky body, short tail. Parrot-like beak, one tall straight horn on the nose, no brow horns, short frill crowned with six long spikes radiating backward and smaller knobs along its edge. | dusky mauve-grey body, pale belly; frill with a band of deep orange at its base, spikes cream with dark brown tips

**Colour:** `relatives`. Like Triceratops and Protoceratops, it rests on *Psittacosaurus* (Vinther et al. 2016, https://europepmc.org/article/MED/27641767): brown, countershaded, dark face. The pale belly follows that. The frill colours are a guess. Confidence is low (very distant in size).

**Sources**
- https://www.nhm.ac.uk/discover/dino-directory/styracosaurus.html (size, dates, countries, herd from a bone bed, slow, low vegetation, 1913 Alberta find and Dinosaur Provincial Park, spike count varies, Daspletosaurus)
- https://en.wikipedia.org/wiki/Styracosaurus (nose horn up to 60 cm, height 1,8 m, weight range, meaning of *styrax*)

---

## 9. Edmontosaurus (Cretaceous)

```ts
  {
    id: 'edmontosaurus',
    name: 'Edmontosaurus',
    pronounce: { sv: 'ed-mon-to-SAU-rus', en: 'ed-MON-toe-SORE-us' },
    meaning: { sv: 'Ödlan från Edmonton', en: 'Edmonton lizard' },
    group: 'dinosaur',
    period: 'cretaceous',
    fromMya: 73,
    toMya: 66,
    lengthM: 12,
    heightM: 3.5,
    weightKg: 5000,
    sizeLike: { sv: 'Lång som en buss', en: 'As long as a bus' },
    diet: 'herbivore',
    found: { sv: 'USA och Kanada', en: 'USA and Canada' },
    short: {
      sv: 'En stor anknäbbad dinosaurie och en av de allra sista dinosaurierna. Den levde samtidigt som Tyrannosaurus rex.',
      en: 'A big duck-billed dinosaur and one of the very last dinosaurs. It lived at the same time as Tyrannosaurus rex.',
    },
    long: {
      sv: 'Edmontosaurus hade en bred, platt näbb, och längre in satt hundratals tänder tätt packade som malde maten. I magen på fossil har man hittat barr, kvistar och frön. Den kunde gå både på två och på fyra ben och levde troligen i flock. En del fossil kallas mumier eftersom de har avtryck av huden. Därför vet forskare att den var fjällig, men inte vilken färg den hade.',
      en: 'Edmontosaurus had a broad, flat beak, and further in sat hundreds of tightly packed teeth that ground up its food. Conifer needles, twigs and seeds have been found in the stomachs of fossils. It could walk on two legs or on four and probably lived in herds. Some fossils are called mummies because they have prints of the skin. That is how scientists know it was scaly, but not what colour it was.',
    },
    facts: [
      { sv: 'En Edmontosaurus har ett läkt bett i svansen som troligen kom från en Tyrannosaurus rex.', en: 'One Edmontosaurus has a healed bite in its tail that probably came from a Tyrannosaurus rex.' },
      { sv: 'Fossil har hittats hela vägen från Colorado upp till Alaska.', en: 'Fossils have been found all the way from Colorado up to Alaska.' },
      { sv: 'Tänderna byttes ut hela tiden, så nya växte ständigt fram.', en: 'Its teeth were replaced all the time, so new ones kept growing in.' },
    ],
    sound: {
      sv: 'Ingen vet säkert. Forskare gissar på djupa brölanden.',
      en: 'Nobody knows for sure. Scientists guess at deep bellows.',
    },
    starter: false,
    colour: 'guess',
    source: NHM('edmontosaurus'),
  },
```

**Height.** Wikipedia: the top of the bitten tail was "at least 2,9 metres high". The neck is flexed upward from the shoulders, so in a four-legged standing pose the head and hips reach about 3,5 m. Estimate. (The Parasaurolophus card is 9,5 m long and 4 m tall, crest included.)

**Numbers.** NHM: 13,0 m, 3 400 kg, 76 to 66 million years ago, Canada. Wikipedia: *E. annectens* up to 11 to 12 m and 5,6 t average asymptotic mass, exceptional specimens near 15 m, older estimates "on the order of 4 metric tons", *E. regalis* 73 million years ago, *E. annectens* 66, range Colorado to Alaska. The card uses 12 m, 5 000 kg (between NHM's 3 400 and Wikipedia's 5 600), Wikipedia's dates and USA and Canada.

**Art brief line**

- `edmontosaurus` | Edmontosaurus | Large duck-billed dinosaur on four legs with shorter front legs, long low head with a broad flat duck-like beak, no crest, neck curving upward from the shoulders, thick tail straight out. | light greenish grey with a network of large dark slate patches like a giraffe's, cream belly

**Colour:** `guess`. The mummies are a clay film formed after all organic matter was lost, so they can hold no pigment (Sereno et al. 2025, https://europepmc.org/article/MED/41129614, already in the colour doc). NHM states it directly: "we know its texture (but not the colour)". Same position as Parasaurolophus and Maiasaura.

**Sources**
- https://www.nhm.ac.uk/discover/dino-directory/edmontosaurus.html (pronunciation, meaning, 1 000 grinding cheek teeth, conifer needles, twigs and seeds in the stomach, skin texture known but not colour, two or four legs)
- https://en.wikipedia.org/wiki/Edmontosaurus (size, dates, Colorado to Alaska, lived with T. rex and Triceratops, healed tail bite at the Denver Museum attributed to T. rex, continual tooth replacement, herds)

---

## 10. Quetzalcoatlus (Cretaceous, flying reptile)

```ts
  {
    id: 'quetzalcoatlus',
    name: 'Quetzalcoatlus',
    pronounce: { sv: 'ket-sal-ko-AT-lus', en: 'KWET-sal-koh-AT-lus' },
    meaning: { sv: 'Uppkallad efter aztekernas ormgud Quetzalcoatl', en: 'Named after the Aztec serpent god Quetzalcoatl' },
    group: 'pterosaur',
    period: 'cretaceous',
    fromMya: 67,
    toMya: 66,
    lengthM: 10,
    heightM: 4.5,
    wingspan: true,
    weightKg: 250,
    sizeLike: { sv: 'Hög som en giraff när den stod på marken', en: 'As tall as a giraffe when it stood on the ground' },
    diet: 'carnivore',
    found: { sv: 'USA', en: 'USA' },
    short: {
      sv: 'Ett av de största flygande djuren som någonsin funnits. Det var ingen dinosaurie, men levde samtidigt som dem.',
      en: 'One of the largest flying animals that ever lived. It was not a dinosaur, but it lived alongside them.',
    },
    long: {
      sv: 'Quetzalcoatlus hör till flygödlorna. Vingarna var gjorda av hud och nästan lika breda som en buss är lång. På marken gick den på alla fyra, och med halsen rakt upp var den lika hög som en giraff. Forskare tror att den vandrade omkring och fångade små djur med sin långa näbb utan tänder, ungefär som en stork. För att lyfta tog den troligen sats med armarna och hoppade upp i luften.',
      en: 'Quetzalcoatlus belongs to the pterosaurs. Its wings were made of skin and almost as wide as a bus is long. On the ground it walked on all fours, and with its neck held up it was as tall as a giraffe. Scientists think it walked about catching small animals with its long, toothless beak, a bit like a stork. To take off it probably pushed hard with its arms and vaulted into the air.',
    },
    facts: [
      { sv: 'Den är uppkallad efter en gud hos aztekerna, ett folk som levde i Mexiko.', en: 'It is named after a god of the Aztecs, a people who lived in Mexico.' },
      { sv: 'Kroppen var täckt av ett tunt lager hårliknande fjun.', en: 'Its body was covered in a thin coat of hair-like fuzz.' },
      { sv: 'Det första fossilet var ett vingben som en student hittade i Texas år 1971.', en: 'The first fossil was a wing bone that a student found in Texas in 1971.' },
    ],
    sound: {
      sv: 'Ingen vet säkert. Kanske väste den eller klapprade med näbben, som storkar gör.',
      en: 'Nobody knows for sure. Maybe it hissed or clattered its beak, the way storks do.',
    },
    starter: false,
    colour: 'relatives',
    source: WIKI('Quetzalcoatlus'),
  },
```

**Pose and height.** Pteranodon is drawn in flight. Drawing this one standing on all fours keeps the two silhouettes apart and shows off its most child-friendly fact. Wikipedia: shoulder height about 2 to 3 m, and "the head may have been held at a height of more than 4 m, similar to that of an extant giraffe". With the crest and an upright neck that gives 4,5 m. `lengthM` is the wingspan, as for Pteranodon.

**Numbers.** Wikipedia: wingspan estimates have ranged from 5,2 to 25,8 m, and recent ones "hover around 10 to 11 m". Most mass estimates since the 2000s are 200 to 250 kg (outliers 150 and 544). The rock is latest Maastrichtian, about 67 to 66 million years old, in Big Bend National Park, Texas. NHM has no Dino Directory page (title "undefined"). "Toothless beak" is stated for *Q. lawsoni* and "like other azhdarchids", and the *Q. northropi* holotype is wing bones only. The anatomy is reconstructed from relatives and the second species.

**Art brief line**

- `quetzalcoatlus` | Quetzalcoatlus | Giant flying reptile, not a dinosaur. Very long stiff neck, enormous long pointed toothless beak, low crest on top of the head, wings folded up and used as front legs, short body, tiny tail, thin coat of hair-like fuzz, no feathers. | Pose: standing on all four limbs like a giraffe, neck raised high. | warm cinnamon-buff fuzz, folded wings deep brown, pale bone-coloured beak, small crest bright red with a black edge

**Colour:** `relatives`. *Tupandactylus* had crest skin and fibres with differently shaped melanosomes, so pterosaurs could vary colour between body parts (Cincotta et al. 2022, https://europepmc.org/article/MED/35444275). Tapejarids and azhdarchids are both azhdarchoids, so the relative is closer here than it is for Pteranodon. That grouping is from my own knowledge and was not checked in a source. No hue is known, so the crest colour is a guess.

**Sources**
- https://en.wikipedia.org/wiki/Quetzalcoatlus (naming after Quetzalcōātl, the 1971 find by graduate student Douglas Lawson, wingspan and mass ranges, giraffe-height head, terrestrial stalking like storks and ground hornbills, quadrupedal launch per Witton and Habib 2010, pycnofibres, toothless beak, 67 to 66 million years ago)

---

## Palette check against the existing 30

The new palettes are deliberately unlike section 6 of `dinosaur-colour.md`. New in the set: black-and-yellow banding (Ceratosaurus), leopard rosettes (Herrerasaurus), a giraffe-like network (Edmontosaurus), pinkish rhino grey (Kentrosaurus), mauve-grey (Styracosaurus), dove grey with an orange face (Eoraptor), cinnamon-buff (Quetzalcoatlus). The nearest overlaps are Ichthyosaurus with Mosasaurus and Plesiosaurus (all three are dark-backed sea reptiles; Ichthyosaurus is navy with a sharp silver belly and a flank line) and Baryonyx with Iguanodon (grey-green with saddles versus moss green-brown with bands).

## Open doubts

1. **Three small Triassic bipeds.** Coelophysis, Herrerasaurus and Eoraptor share a body plan, and Eoraptor is close to Compsognathus in size and shape. In a silhouette question they could be hard to tell apart. Swap if that matters: a Triassic pterosaur (*Eudimorphodon*) or a Triassic sea reptile (*Nothosaurus*, *Shonisaurus*). Neither was researched.
2. **NHM versus the card's numbers.** Herrerasaurus and Eoraptor link to Wikipedia because the NHM pages are out of date (Herrerasaurus 3 m; Eoraptor called a carnivorous theropod). Coelophysis, Kentrosaurus, Edmontosaurus and Ceratosaurus link to NHM but show some Wikipedia-based numbers that differ from the linked page (each is listed in its section).
3. **Estimated rather than sourced.** Every `heightM` (method given per animal), the Ichthyosaurus weight (scaled from *Stenopterygius*), the Coelophysis hip-height claim (Wikipedia's ">1 m" looks too high and was not used), and all Swedish pronunciations. The English pronunciations for Ichthyosaurus and Quetzalcoatlus are not from a fetched source. Kentrosaurus English follows Wikipedia's KEN-troh-SOR-əs, not NHM's ken-TROH-sore-us.
4. **Baryonyx dates.** 130 to 125 million years (Wikipedia, Baryonyx) may be the old Barremian dating. The current stage is 125,77 to 121,4 (Wikipedia, Barremian). Worth a check against a stratigraphy source before it goes on the timeline.
5. **Styracosaurus spike count** (Wikipedia 4 to 6, NHM 6 or 8) and the loose meaning "Spjutödla".
6. **Ichthyosaurus `colourDisputed: true`** is my call: the two pigment studies disagree (uniform dark versus countershaded) and a 2015 study doubts the reading. If the flag is meant only for disputes about the animal's own fossil, drop it and keep `relatives`.
7. **Herrerasaurus discoverer.** The Wikipedia lead says "rancher, 1958", the Discovery section says "Andean goatherd, 1959". The card follows the section (getherde) and gives no year.
8. **Kentrosaurus shoulder spike.** Wikipedia's lead states it as fact, but its description says the placement is debated (hip in classic mounts, shoulder in recent ones). The card says "troligen", and the art brief puts it on the shoulder.
9. **Code consequences (not done, out of scope):** `src/text.test.ts` pins the exact colour lists (`relatives` 12 ids, `guess` 16, `colourDisputed` two ids), so it needs the new ids. Pronunciation clips need new phonetic entries in `tools/make-names.py`. Sounds need CC0 sources in `audio-src/sources.json`. `CONTEXT.md` says "30 kända djur" and "8 + 22", and section 6 of `dinosaur-colour.md` needs rows 31 to 40.
