#!/usr/bin/env pnpm exec tsx

import ghPages from 'gh-pages';
import { resolve } from 'node:path';

const distPath = resolve(import.meta.dirname, '../dist');

await ghPages.publish(distPath, {
  dotfiles: false,
  push: false,
  history: false,
});

console.log('Artifacts committed to gh-pages branch');
