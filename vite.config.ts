import { readdirSync, readFileSync, statSync, writeFileSync } from 'node:fs';
import { defineConfig, type Plugin } from 'vite';

// One stamp per build: shown in parent mode and used as the service worker's cache version.
const BUILD = new Date().toISOString();

/** Writes dist/sw.js: src/sw.js with the build stamp and the list of every built file put on top. */
function serviceWorker(): Plugin {
  return {
    name: 'dinodeck-sw',
    apply: 'build',
    closeBundle() {
      const files = (readdirSync('dist', { recursive: true }) as string[])
        .filter((f) => statSync(`dist/${f}`).isFile())
        .map((f) => f.replaceAll('\\', '/'))
        .filter((f) => f !== 'sw.js')
        .sort();
      const head = `const VERSION = ${JSON.stringify(BUILD)};\nconst FILES = ${JSON.stringify(files)};\n`;
      writeFileSync('dist/sw.js', head + readFileSync('src/sw.js', 'utf8'));
    },
  };
}

// Relative base: the site lives on a subpath (buildapp.se/dinodeck/).
export default defineConfig({ base: './', define: { __BUILD__: JSON.stringify(BUILD) }, plugins: [serviceWorker()] });
