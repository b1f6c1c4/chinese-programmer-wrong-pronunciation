#!/usr/bin/env node

const jfk = require('ipa-jfk');
const JSON5 = require('json5');
const fs = require('fs');
const path = require('path');

jfk.cacheDatabase();

const data = JSON5.parse(fs.readFileSync(path.join(__dirname, 'raw.json5'), 'utf-8'));
for (let e of data) {
  const phss = jfk.queryDatabase(e.word);
  if (phss && phss.length === 1) {
    e.ph = phss[0];
  } else {
    e.ph = phss;
  }
}

fs.writeFileSync(path.join(__dirname, 'data.json5'), JSON5.stringify(data, null, 4), 'utf-8');
