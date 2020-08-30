#!/usr/bin/env node

const jfk = require('ipa-jfk');
const JSON5 = require('json5');
const fs = require('fs');
const path = require('path');

const data = JSON5.parse(fs.readFileSync(path.join(__dirname, 'data.json5'), 'utf-8'));
let tbl = '';
for (let e of data) {
  let resW = e.word;
  if (e.pos) resW += ` _${e.pos}_`;
  let resJ = e.ph && jfk.process(e.ph, e.word, e.aeHint);
  resJ = resJ ? `✅ ${jfk.unicode(resJ)}` : '';
  let resP = e.pek;
  resP = resP ? `❌ /${resP}/` : '';
  tbl += `| ${resW} | ${resJ} | ${resP} |\n`
}

const readme = `# chinese-programmer-wrong-pronunciation-en\\_US

中国程序员容易发音错误的单词

| 单词 | **正宗纽约口音** | **土味北京口音** |
| ---- | ------- | ------- |
${tbl}

# 看不懂，怎么办？

**就是菜**，请去学习 [IPA](https://en.wikipedia.org/wiki/International_Phonetic_Alphabet)

> 参考资料
>
> 1. 朗文英语发音词典
> 1. [New York Accent](https://en.wikipedia.org/wiki/New_York_accent)
> 1. [/æ/ raising](https://en.wikipedia.org/wiki//%C3%A6/_raising)
> 1. Becker, Kara, and Amy Wing-mei Wong. "The short-a system of New York City English: an update." _University of Pennsylvania Working Papers in Linguistics_ 15.2 (2010): 3.
`;

fs.writeFileSync(path.join(__dirname, 'README.md'), readme, 'utf-8');
