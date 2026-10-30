// الأرقام مع وحداتها اللاتينية داخل نص عربي تنقلب عند العرض («C° 100» بدل «100 °C»).
// هذه الأدوات تعزل كل «رقم + وحدة» في اتجاه من اليسار لليمين.

import { UNIT_SOURCE } from './units.mjs';

export const UNIT_RE = new RegExp(UNIT_SOURCE, 'g');

const LRI = '\u2066', PDI = '\u2069';

/** لنص يُعرض عبر textContent: يحيط كل تطابق بعلامتي عزل يونيكود */
export const isolate = (text: string) => text.replace(UNIT_RE, (m) => LRI + m + PDI);

const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

/** لنص يُعرض HTML: يهرّب النص ثم يلف كل تطابق في span باتجاه ltr */
export const bidiHtml = (text: string) => {
  let out = '', last = 0;
  for (const m of text.matchAll(UNIT_RE)) {
    out += esc(text.slice(last, m.index)) + `<span class="ltr">${esc(m[0])}</span>`;
    last = m.index! + m[0].length;
  }
  return out + esc(text.slice(last));
};
