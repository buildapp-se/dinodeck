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
