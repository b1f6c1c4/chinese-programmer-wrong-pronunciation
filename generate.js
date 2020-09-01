#!/usr/bin/env node

const jfk = require('ipa-jfk');
const JSON5 = require('json5');
const fs = require('fs');
const path = require('path');

const data = JSON5.parse(fs.readFileSync(path.join(__dirname, 'data.json5'), 'utf-8'));
let tbl = '';
for (let e of data) {
  try {
    let resW = e.word;
    if (e.pos) resW += ` _${e.pos}_`;
    const { aeHint, syllableHint } = e;
    let resP = e.ph && jfk.process(e.ph, e.word, true, { aeHint, syllableHint });
    resP = resP ? jfk.unicode(resP) : '';
    let resJ = e.ph && jfk.process(e.ph, e.word, false, { aeHint, syllableHint });
    resJ = resJ ? jfk.unicode(resJ) : '';
    tbl += `| ${resW} | ${resP} | ${resJ} |\n`
  } catch (err) {
    console.error(e, err);
  }
}

const readme = `# programming-pronunciations-en\\_US

程序员容易发音错误的单词，国际音标严式记音，正宗美国纽约口音

| 单词 | **美式英语音位** | **正宗纽约口音** |
| ---- | ---------------- | ---------------- |
${tbl}

## 看不懂，怎么办？

**就是菜**，请去学习 [IPA](https://en.wikipedia.org/wiki/International_Phonetic_Alphabet)

## 参考资料

1. John C. Wells. 朗文英语发音词典. 北京：商务印书馆 (2005)
1. Celce-Murcia, Marianne, Donna M. Brinton, and Janet M. Goodwin. _Teaching pronunciation hardback with audio CDs (2): A course book and reference guide._ Cambridge University Press, 2010.
1. Becker, Kara, and Amy Wing-mei Wong. "The short-a system of New York City English: an update." _University of Pennsylvania Working Papers in Linguistics_ 15.2 (2010): 3.
1. [International Phonetic Alphabet](https://en.wikipedia.org/wiki/International_Phonetic_Alphabet)
1. [English Phonology](https://en.wikipedia.org/wiki/English_Phonology)
1. [General American English](https://en.wikipedia.org/wiki/General_American_English)
1. [Regional accents of English](https://en.wikipedia.org/wiki/Regional_accents_of_English)
1. [New York City English](https://en.wikipedia.org/wiki/New_York_City_English)
1. [New York Accent](https://en.wikipedia.org/wiki/New_York_accent)
1. [T-glottalization](https://en.wikipedia.org/wiki/T-glottalization)
1. [Laminal consonant](https://en.wikipedia.org/wiki/Laminal_consonant)
1. [Dark L](https://en.wikipedia.org/wiki/Voiced_dental,_alveolar_and_postalveolar_lateral_approximants#Dark_L)
1. [No audible release](https://en.wikipedia.org/wiki/No_audible_release)
1. [Nasal release](https://en.wikipedia.org/wiki/Nasal_release)
1. [Flapping](https://en.wikipedia.org/wiki/Flapping)
1. [/æ/ raising](https://en.wikipedia.org/wiki//%C3%A6/_raising)
1. [Function word](https://en.wikipedia.org/wiki/Function_word)
1. [IPA-JFK](https://github.com/b1f6c1c4/IPA-JFK)
`;

fs.writeFileSync(path.join(__dirname, 'README.md'), readme, 'utf-8');
