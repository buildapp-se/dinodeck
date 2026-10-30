import assert from 'node:assert/strict';
import { existsSync } from 'node:fs';
import { after, beforeEach, test } from 'node:test';
import { DINOS } from './catalog.ts';
import { dinoSheet, printSheet, sceneSheet } from './print.ts';

test('every animal and backdrop has a line drawing to print', () => {
  const names = [...DINOS.map((d) => d.id), 'bg-triassic', 'bg-jurassic', 'bg-cretaceous'];
  assert.deepEqual(names.filter((n) => !existsSync(`public/img/line/${n}.webp`)), []);
});

test('the colouring page uses the line drawing, never the painting', () => {
  const html = dinoSheet(DINOS[0]!);
  assert.match(html, /src="img\/line\/tyrannosaurus-rex\.webp"/);
  assert.match(html, />Tyrannosaurus rex</);
});

test('the printed scene keeps place, size, facing and stacking order', () => {
  const html = sceneSheet({
    bg: 'triassic',
    items: [
      { id: 'diplodocus', x: 0.25, y: 0.7, size: 0.5, flip: false },
      { id: 'velociraptor', x: 0.8, y: 0.333333, size: 0.12, flip: true },
    ],
  });
  assert.ok(html.startsWith('<div class="print-scene">'));
  assert.match(html, /img\/line\/bg-triassic\.webp/);
  assert.match(html, /diplodocus\.webp" alt="" style="left:25%;top:70%;width:50%;transform:translate\(-50%,-50%\) scaleX\(1\)"/);
  assert.match(html, /velociraptor\.webp" alt="" style="left:80%;top:33\.33%;width:12%;transform:translate\(-50%,-50%\) scaleX\(-1\)"/);
  assert.ok(html.indexOf('diplodocus') < html.indexOf('velociraptor'), 'later items are drawn on top');
  assert.doesNotMatch(html, /src="img\/(?!line\/)/);
  assert.ok(html.endsWith('</div>'));
});

// Mock DOM for printSheet tests
class MockClassList {
  private classes = new Set<string>();

  add(c: string) {
    if (!c) throw new DOMException('The token provided must not be empty.', 'SyntaxError');
    this.classes.add(c);
  }

  remove(c: string) {
    if (!c) throw new DOMException('The token provided must not be empty.', 'SyntaxError');
    this.classes.delete(c);
  }

  toggle(c: string, force?: boolean): boolean {
    if (!c) throw new DOMException('The token provided must not be empty.', 'SyntaxError');
    if (force !== undefined) {
      if (force) this.classes.add(c);
      else this.classes.delete(c);
      return force;
    }
    if (this.classes.has(c)) {
      this.classes.delete(c);
      return false;
    }
    this.classes.add(c);
    return true;
  }

  contains(c: string): boolean {
    return this.classes.has(c);
  }
}

class MockElement {
  tagName: string;
  id: string = '';
  src: string = '';
  classList = new MockClassList();
  parentElement: MockElement | null = null;
  children: MockElement[] = [];
  naturalWidth: number = 0;
  naturalHeight: number = 0;
  decodeCalled: boolean = false;
  decodeShouldFail: boolean = false;
  private _innerHTML: string = '';

  constructor(tagName: string) {
    if (!tagName) throw new DOMException('The tag name provided is not a valid name.', 'InvalidCharacterError');
    this.tagName = tagName.toUpperCase();
  }

  get innerHTML(): string {
    return this._innerHTML;
  }

  set innerHTML(val: string) {
    this._innerHTML = val;
    this.children = [];
    parseHTMLInto(val, this);
  }

  append(...nodes: (MockElement | string)[]) {
    for (const node of nodes) {
      if (typeof node !== 'string') {
        node.parentElement = this;
        this.children.push(node);
      }
    }
  }

  remove() {
    if (this.parentElement) {
      const idx = this.parentElement.children.indexOf(this);
      if (idx !== -1) {
        this.parentElement.children.splice(idx, 1);
      }
      this.parentElement = null;
    }
  }

  contains(node: MockElement): boolean {
    let curr: MockElement | null = node;
    while (curr) {
      if (curr === this) return true;
      curr = curr.parentElement;
    }
    return false;
  }

  async decode(): Promise<void> {
    this.decodeCalled = true;
    if (this.decodeShouldFail) {
      throw new Error('Image failed to decode');
    }
  }

  querySelector<T = MockElement>(selector: string): T | null {
    if (!selector) throw new DOMException('The provided selector is empty.', 'SyntaxError');
    const all = this.querySelectorAll<T>(selector);
    return all[0] ?? null;
  }

  querySelectorAll<T = MockElement>(selector: string): T[] {
    if (!selector) throw new DOMException('The provided selector is empty.', 'SyntaxError');
    const result: MockElement[] = [];
    const walk = (el: MockElement) => {
      for (const child of el.children) {
        if (matches(child, selector)) {
          result.push(child);
        }
        walk(child);
      }
    };
    walk(this);
    return result as T[];
  }
}

function matches(el: MockElement, selector: string): boolean {
  if (selector.startsWith('#')) {
    return el.id === selector.slice(1);
  }
  if (selector.startsWith('.')) {
    return el.classList.contains(selector.slice(1));
  }
  return el.tagName.toLowerCase() === selector.toLowerCase();
}

const defaultDims: Record<string, { width: number; height: number }> = {
  'img/line/brachiosaurus.webp': { width: 100, height: 200 },
  'img/line/tyrannosaurus-rex.webp': { width: 200, height: 100 },
};

function parseHTMLInto(html: string, root: MockElement) {
  const tagRegex = /<\/?([a-zA-Z0-9]+)([^>]*)>/g;
  let current: MockElement = root;
  const stack: MockElement[] = [root];
  let match: RegExpExecArray | null;

  while ((match = tagRegex.exec(html)) !== null) {
    const fullTag = match[0];
    const tagName = match[1]!;
    const attrs = match[2] ?? '';

    if (fullTag.startsWith('</')) {
      if (stack.length > 1 && stack[stack.length - 1]!.tagName === tagName.toUpperCase()) {
        stack.pop();
        current = stack[stack.length - 1]!;
      }
    } else {
      const el = new MockElement(tagName);
      const idMatch = attrs.match(/\bid=["']([^"']+)["']/i);
      if (idMatch?.[1]) el.id = idMatch[1];

      const classMatch = attrs.match(/\bclass=["']([^"']+)["']/i);
      if (classMatch?.[1]) {
        for (const c of classMatch[1].split(/\s+/)) {
          if (c) el.classList.add(c);
        }
      }

      const srcMatch = attrs.match(/\bsrc=["']([^"']+)["']/i);
      if (srcMatch?.[1]) {
        el.src = srcMatch[1];
        const dims = defaultDims[srcMatch[1]];
        if (dims) {
          el.naturalWidth = dims.width;
          el.naturalHeight = dims.height;
        }
      }

      const widthMatch = attrs.match(/\b(?:natural-)?width=["']?(\d+)["']?/i);
      if (widthMatch?.[1]) el.naturalWidth = Number(widthMatch[1]);

      const heightMatch = attrs.match(/\b(?:natural-)?height=["']?(\d+)["']?/i);
      if (heightMatch?.[1]) el.naturalHeight = Number(heightMatch[1]);

      if (/\bdata-fail\b/i.test(attrs)) el.decodeShouldFail = true;

      current.append(el);

      const isVoid = ['IMG', 'BR', 'HR', 'INPUT', 'META', 'LINK'].includes(el.tagName);
      const isSelfClosing = fullTag.endsWith('/>') || isVoid;
      if (!isSelfClosing) {
        stack.push(el);
        current = el;
      }
    }
  }
}

class MockDocument {
  documentElement = new MockElement('html');
  body = new MockElement('body');

  constructor() {
    this.documentElement.append(this.body);
  }

  createElement(tagName: string): MockElement {
    if (!tagName) throw new DOMException('The tag name provided is not a valid name.', 'InvalidCharacterError');
    return new MockElement(tagName);
  }

  querySelector<T = MockElement>(selector: string): T | null {
    if (!selector) throw new DOMException('The provided selector is empty.', 'SyntaxError');
    return this.documentElement.querySelector<T>(selector);
  }

  querySelectorAll<T = MockElement>(selector: string): T[] {
    if (!selector) throw new DOMException('The provided selector is empty.', 'SyntaxError');
    return this.documentElement.querySelectorAll<T>(selector);
  }
}

class MockWindow {
  listeners: Record<string, Array<() => void>> = {};
  printCallCount = 0;

  addEventListener(type: string, listener: () => void) {
    if (!type) throw new DOMException('Event type must not be empty.', 'SyntaxError');
    if (!this.listeners[type]) {
      this.listeners[type] = [];
    }
    this.listeners[type].push(listener);
  }

  dispatchEvent(type: string) {
    for (const fn of this.listeners[type] ?? []) {
      fn();
    }
  }

  print() {
    this.printCallCount++;
  }
}

let mockDoc: MockDocument;
let mockWin: MockWindow;

beforeEach(() => {
  mockDoc = new MockDocument();
  mockWin = new MockWindow();
  (globalThis as unknown as { document: unknown }).document = mockDoc;
  (globalThis as unknown as { window: unknown }).window = mockWin;
});

after(() => {
  delete (globalThis as unknown as Record<string, unknown>).document;
  delete (globalThis as unknown as Record<string, unknown>).window;
});

test('printSheet creates sheet in body, adds colouring class, prints, and cleans up on afterprint', async () => {
  await printSheet('<p>colouring page</p>');
  const sheet = mockDoc.querySelector<MockElement>('#print');
  assert.ok(sheet !== null, 'sheet should exist');
  assert.equal(sheet.tagName.toLowerCase(), 'div', 'sheet should be a div');
  assert.equal(sheet.id, 'print', 'sheet should have id print');
  assert.equal(sheet.parentElement, mockDoc.body, 'sheet should be appended to body');
  assert.equal(mockDoc.body.contains(sheet), true, 'body should contain sheet');
  assert.equal(sheet.innerHTML, '<div class="print-sheet"><p>colouring page</p></div>');
  assert.equal(mockDoc.documentElement.classList.contains('colouring'), true, 'colouring class added to root');
  assert.equal(mockWin.printCallCount, 1, 'window.print called');

  mockWin.dispatchEvent('afterprint');
  assert.equal(mockDoc.documentElement.classList.contains('colouring'), false, 'colouring removed on afterprint');
});

test('printSheet reuses existing sheet and avoids duplicate afterprint listeners', async () => {
  await printSheet('<p>first</p>');
  const firstSheet = mockDoc.querySelector<MockElement>('#print');
  assert.ok(firstSheet !== null);

  await printSheet('<p>second</p>');
  const secondSheet = mockDoc.querySelector<MockElement>('#print');
  assert.equal(secondSheet, firstSheet, 'should reuse the same sheet element');
  assert.equal(mockDoc.querySelectorAll('#print').length, 1, 'only one print sheet in document');
  assert.equal(mockDoc.body.children.length, 1, 'body only contains one child');
  assert.equal(secondSheet.innerHTML, '<div class="print-sheet"><p>second</p></div>', 'content updated');
  assert.equal(mockWin.listeners['afterprint']?.length, 1, 'listener not added twice');
});

test('printSheet decodes all images and removes any that fail to load', async () => {
  await printSheet(
    '<img class="good" width="50" height="50" src="good.webp"><img class="bad" data-fail width="50" height="50" src="bad.webp">',
  );
  const sheet = mockDoc.querySelector<MockElement>('#print')!;
  assert.ok(sheet);

  const goodImg = sheet.querySelector<MockElement>('.good');
  assert.ok(goodImg !== null, 'good image remains');
  assert.equal(goodImg.decodeCalled, true, 'decode was called on good image');

  const badImg = sheet.querySelector<MockElement>('.bad');
  assert.equal(badImg, null, 'failed image was removed');
  assert.equal(sheet.querySelectorAll('img').length, 1, 'only 1 image remains');
  assert.equal(mockDoc.documentElement.classList.contains('colouring'), true, 'still marks colouring');
  assert.equal(mockWin.printCallCount, 1, 'still triggers print');
});

test('printSheet toggles tall class for portrait dinosaur and omits it for wide dinosaur or scene', async () => {
  const brachiosaurus = DINOS.find((d) => d.id === 'brachiosaurus')!;
  const trex = DINOS.find((d) => d.id === 'tyrannosaurus-rex')!;

  // Tall dino (e.g. Brachiosaurus with height > width fitting portrait better): tall class set
  await printSheet(dinoSheet(brachiosaurus));
  const page = (): MockElement => mockDoc.querySelector<MockElement>('.print-sheet')!;
  assert.equal(page().classList.contains('tall'), true, 'tall dino gets tall class');

  // Wide dino (e.g. T. rex fitting landscape better): tall class not set
  await printSheet(dinoSheet(trex));
  assert.equal(page().classList.contains('tall'), false, 'wide dino does not get tall class');

  // Also test with explicit dimensions (W=100, H=200 vs W=200, H=100)
  await printSheet('<img class="print-dino" width="100" height="200" src="custom-tall.webp">');
  assert.equal(page().classList.contains('tall'), true, 'custom tall image gets tall class');

  await printSheet('<img class="print-dino" width="200" height="100" src="custom-wide.webp">');
  assert.equal(page().classList.contains('tall'), false, 'custom wide image does not get tall class');

  // Scene sheet (no .print-dino element): tall class not set
  await printSheet(sceneSheet({ bg: 'triassic', items: [] }));
  assert.equal(page().classList.contains('tall'), false, 'scene sheet does not get tall class');
});

test('several animals print as one sheet each, in order, and each chooses its own way round', async () => {
  const pick = (id: string) => DINOS.find((d) => d.id === id)!;
  await printSheet(dinoSheet(pick('tyrannosaurus-rex')), dinoSheet(pick('brachiosaurus')), dinoSheet(pick('tyrannosaurus-rex')));
  const pages = mockDoc.querySelectorAll<MockElement>('.print-sheet');
  assert.deepEqual(pages.map((p) => p.classList.contains('tall')), [false, true, false]);
  assert.deepEqual(pages.map((p) => p.querySelector<MockElement>('img')!.src), ['img/line/tyrannosaurus-rex.webp', 'img/line/brachiosaurus.webp', 'img/line/tyrannosaurus-rex.webp']);
  assert.equal(mockWin.printCallCount, 1, 'one print dialog for the whole batch');
});
