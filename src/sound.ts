// Web Audio instead of an <audio> element: Safari asks for a media file in byte ranges, and a file saved
// by the service worker does not answer those. A file that is fetched whole and decoded has no such problem.
let ctx: AudioContext | undefined;
let playing: AudioBufferSourceNode | undefined;
const decoded = new Map<string, Promise<AudioBuffer>>();

/** Plays one sound, cutting off the one before it. Has to be called from a tap: browsers allow no sound before one. */
export function play(url: string): void {
  ctx ??= new AudioContext();
  const audio = ctx;
  void audio.resume();
  let buffer = decoded.get(url);
  if (!buffer) {
    buffer = fetch(url)
      .then((r) => {
        if (!r.ok) throw new Error(`${url}: ${r.status}`);
        return r.arrayBuffer();
      })
      .then((bytes) => audio.decodeAudioData(bytes));
    decoded.set(url, buffer);
  }
  buffer
    .then((b) => {
      playing?.stop();
      playing = audio.createBufferSource();
      playing.buffer = b;
      playing.connect(audio.destination);
      playing.start();
    })
    // No sound this time (offline before the files were saved, say). The card works without it, so nothing is shown.
    .catch(() => decoded.delete(url));
}
