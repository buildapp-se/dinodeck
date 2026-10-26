// Web Audio instead of an <audio> element: Safari asks for a media file in byte ranges, and a file saved
// by the service worker does not answer those. A file that is fetched whole and decoded has no such problem.
let ctx: AudioContext | undefined;
let playing: AudioBufferSourceNode | undefined;
const decoded = new Map<string, Promise<AudioBuffer>>();
// Decoded sound is raw samples, about 20 times the mp3: keep only the most recent ones.
const KEEP = 24;
let taps = 0;

/** Plays one sound, cutting off the one before it. Has to be called from a tap: browsers allow no sound before one. */
export function play(url: string): void {
  ctx ??= new AudioContext();
  const audio = ctx;
  void audio.resume();
  // The last tap wins: stop now, and a slower sound that finishes loading later stays quiet.
  const tap = ++taps;
  playing?.stop();
  playing = undefined;
  let buffer = decoded.get(url);
  if (buffer) decoded.delete(url); // re-inserted below, so the Map stays in order of use
  else {
    buffer = fetch(url)
      .then((r) => {
        if (!r.ok) throw new Error(`${url}: ${r.status}`);
        return r.arrayBuffer();
      })
      .then((bytes) => audio.decodeAudioData(bytes));
  }
  decoded.set(url, buffer);
  if (decoded.size > KEEP) decoded.delete(decoded.keys().next().value!);
  buffer
    .then((b) => {
      if (tap !== taps) return;
      playing = audio.createBufferSource();
      playing.buffer = b;
      playing.connect(audio.destination);
      playing.start();
    })
    // No sound this time (offline before the files were saved, say). The card works without it, so nothing is shown.
    .catch(() => decoded.delete(url));
}

// Five notes of a major scale: each star in the challenge rings one step higher.
const STEPS = [523.25, 659.25, 783.99, 1046.5, 1318.5];

/** Short game sounds made on the spot, no files: a rising "pling" for a right answer, a soft low "boop" for a wrong one, a fanfare for a win. They play over a roar instead of cutting it off. */
export function chime(kind: 'right' | 'wrong' | 'win' | 'crack', step = 0): void {
  ctx ??= new AudioContext();
  const audio = ctx;
  void audio.resume();
  const note = (freq: number, at: number, length: number, type: OscillatorType, glideTo?: number): void => {
    const t0 = audio.currentTime + at;
    const osc = audio.createOscillator();
    const gain = audio.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, t0);
    if (glideTo) osc.frequency.exponentialRampToValueAtTime(glideTo, t0 + length);
    // A fast attack and an exponential fade: a struck sound, not a beep that is switched on and off.
    gain.gain.setValueAtTime(0.0001, t0);
    gain.gain.exponentialRampToValueAtTime(0.25, t0 + 0.01);
    gain.gain.exponentialRampToValueAtTime(0.0001, t0 + length);
    osc.connect(gain).connect(audio.destination);
    osc.start(t0);
    osc.stop(t0 + length + 0.05);
  };
  if (kind === 'right') {
    const f = STEPS[Math.min(step, STEPS.length - 1)]!;
    note(f, 0, 0.25, 'sine');
    note(f * 2, 0, 0.12, 'sine'); // an overtone makes it a bell
  } else if (kind === 'wrong') note(220, 0, 0.22, 'triangle', 150);
  else if (kind === 'crack') {
    // A shell cracking: a short burst of noise that fades fast, louder for each tap.
    const length = 0.08;
    const noise = audio.createBuffer(1, Math.round(audio.sampleRate * length), audio.sampleRate);
    const data = noise.getChannelData(0);
    for (let i = 0; i < data.length; i++) data[i] = (Math.random() * 2 - 1) * (1 - i / data.length) ** 3;
    const src = audio.createBufferSource();
    const gain = audio.createGain();
    gain.gain.value = 0.3 + 0.2 * step;
    src.buffer = noise;
    src.connect(gain).connect(audio.destination);
    src.start();
  }
  else STEPS.slice(0, 4).forEach((f, i) => note(f, i * 0.11, i === 3 ? 0.6 : 0.18, 'triangle'));
}

/** The pitch of a baby's peep: the bigger the grown-up animal, the lower. Even a sauropod baby was small, so all of them stay chick-like. */
export const peepPitch = (adultKg: number): number => Math.min(3600, Math.max(1600, 3800 - 450 * Math.log10(adultKg)));

/**
 * A baby's peep, made on the spot like the chimes: two to four quick chirps that rise and drop, as a chick's do.
 * `id` picks the pattern, so each kind of baby always sounds the same and different from the others.
 */
export function peep(id: string, adultKg: number): void {
  ctx ??= new AudioContext();
  const audio = ctx;
  void audio.resume();
  let hash = 0;
  for (const c of id) hash = (hash * 31 + c.charCodeAt(0)) >>> 0;
  const base = peepPitch(adultKg);
  const chirps = 2 + (hash % 3);
  const gap = 0.11 + ((hash >> 3) % 4) * 0.02;
  for (let i = 0; i < chirps; i++) {
    const t0 = audio.currentTime + i * gap;
    const f = base * (1 + (((hash >> (i + 5)) % 5) - 2) * 0.06); // each chirp a little higher or lower
    const length = 0.07 + ((hash >> (i + 2)) % 3) * 0.02;
    const osc = audio.createOscillator();
    const gain = audio.createGain();
    osc.type = 'sine';
    // Up quickly, then a longer slide down: "piip".
    osc.frequency.setValueAtTime(f * 0.8, t0);
    osc.frequency.exponentialRampToValueAtTime(f * 1.25, t0 + length * 0.3);
    osc.frequency.exponentialRampToValueAtTime(f * 0.85, t0 + length);
    gain.gain.setValueAtTime(0.0001, t0);
    gain.gain.exponentialRampToValueAtTime(0.22, t0 + 0.012);
    gain.gain.exponentialRampToValueAtTime(0.0001, t0 + length);
    osc.connect(gain).connect(audio.destination);
    osc.start(t0);
    osc.stop(t0 + length + 0.03);
  }
}
