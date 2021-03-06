#!/usr/bin/env node

const jfk = require('ipa-jfk');
const JSON5 = require('json5');
const fs = require('fs');
const path = require('path');
const readline = require('readline');

const data = JSON5.parse(fs.readFileSync(path.join(__dirname, 'data.json5'), 'utf-8'));

const exists = {};
data.forEach(({ word }) => { exists[word.toUpperCase()] = true; });

const rl = readline.createInterface({
  input: process.stdin,
});

rl.on('line', (word) => {
  if (exists[word.toUpperCase()]) return;
  const phss = jfk.queryDatabase(word);
  const disp = (ph) => {
    console.log(ph);
    let res = ph;
    res += '  ';
    res += jfk.unicode(jfk.process(ph, word, true));
    res += '  ';
    res += jfk.unicode(jfk.process(ph, word, false));
    return res;
  };
  const o = { word };
  if (!phss || !phss.length) {
    console.error(`Warning: No pronunciation found for ${word}`);
  } else if (phss.length === 1) {
    o.ph = phss[0];
    console.error(`Info: New word: ${word}: ${disp(o.ph)}`);
  } else {
    phss.forEach((ph) => {
      console.error(`Warning: Multiple pronunciations for ${word}: ${disp(ph)}`);
    });
    o.ph = phss[0];
  }
  if (/\bAE[0-2]\b/.test(o.ph)) {
    console.error(`Warning: Check /ae/-tensing`);
  }
  data.push(o);
});

rl.on('close', () => {
  data.sort(({ word: l }, { word: r }) => l.localeCompare(r, undefined, { sensitivity: 'base' }));
  fs.writeFileSync(path.join(__dirname, 'data.json5'), JSON5.stringify(data, null, 4) + '\n', 'utf-8');
});
