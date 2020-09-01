#!/usr/bin/env node

const jfk = require('ipa-jfk');
const JSON5 = require('json5');
const fs = require('fs');
const path = require('path');
const readline = require('readline');

const data = JSON5.parse(fs.readFileSync(path.join(__dirname, 'data.json5'), 'utf-8'));

const exists = {};
data.forEach(({ word }) => { exists[word] = true; });

const rl = readline.createInterface({
  input: process.stdin,
});

rl.on('line', (word) => {
  if (exists[word]) return;
  const phss = jfk.queryDatabase(word);
  const o = { word };
  if (!phss) {
    console.error(`Warning: No pronunciation found for ${word}`);
  } else if (phss.length === 1) {
    o.ph = phss[0];
  } else {
    phss.forEach((ph) => {
      console.error(`Warning: Multiple pronunciations for ${word}: ${ph}`);
    });
    o.ph = phss[0];
  }
  if (/\bAE[0-2]\b/.test(o.ph)) {
    console.error(`Warning: Check /ae/ for ${word}: ${o.ph}`);
  }
  data.push(o);
  exists[word] = true;
});

rl.on('close', () => {
  data.sort(({ word: l }, { word: r }) => l.localeCompare(r, undefined, { sensitivity: 'base' }));
  fs.writeFileSync(path.join(__dirname, 'data.json5'), JSON5.stringify(data, null, 4) + '\n', 'utf-8');
});
