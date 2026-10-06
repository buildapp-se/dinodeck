import type { Scene } from './state.ts';

// Colouring pages. The line drawings in img/line/ are made from the paintings by tools/make-outlines.py.
// Printing is the browser's own: the sheet is put in #print and the print style sheet hides everything else.

/** One animal, as large as the paper allows, with its name to write or colour. */
export const dinoSheet = (d: { id: string; name: string }): string =>
  `<h1 lang="la">${d.name}</h1><img class="print-dino" src="img/line/${d.id}.webp" alt="">`;

const pct = (n: number): string => `${Math.round(n * 10000) / 100}%`;

/** The child's own scene: backdrop and animals where they stand, in the order they are stacked. */
export const sceneSheet = (scene: Scene): string =>
  `<div class="print-scene"><img class="print-bg" src="img/line/bg-${scene.bg}.webp" alt="">${scene.items
    .map(
      (i) =>
        `<img src="img/line/${i.id}.webp" alt="" style="left:${pct(i.x)};top:${pct(i.y)};width:${pct(i.size)};transform:translate(-50%,-50%) scaleX(${i.flip ? -1 : 1})">`,
    )
    .join('')}</div>`;

/** Opens the print dialog with only `html` on the paper. Waits for the drawings, or the page would print empty. */
export async function printSheet(html: string): Promise<void> {
  let sheet = document.querySelector<HTMLElement>('#print');
  if (!sheet) {
    sheet = document.createElement('div');
    sheet.id = 'print';
    document.body.append(sheet);
    // Without this a later Ctrl+P from the browser menu would print the old colouring page.
    window.addEventListener('afterprint', () => document.documentElement.classList.remove('colouring'));
  }
  sheet.innerHTML = html;
  // A drawing that fails to load is left out: the rest still prints.
  await Promise.all([...sheet.querySelectorAll('img')].map((img) => img.decode().catch(() => img.remove())));
  document.documentElement.classList.add('colouring');
  window.print();
}
