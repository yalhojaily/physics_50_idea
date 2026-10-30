// إضافة rehype: تلف كل «رقم + وحدة» في نص الدروس داخل <span class="ltr"> حتى لا ينقلب في السياق العربي.
import { UNIT_SOURCE } from './units.mjs';

const SKIP_TAGS = new Set(['code', 'pre', 'script', 'style', 'svg']);

function skip(node) {
  if (node.type !== 'element') return false;
  if (SKIP_TAGS.has(node.tagName)) return true;
  const cls = node.properties?.className;
  const list = Array.isArray(cls) ? cls : typeof cls === 'string' ? cls.split(' ') : [];
  return list.some((c) => c === 'ltr' || String(c).startsWith('katex'));
}

function split(value) {
  const re = new RegExp(UNIT_SOURCE, 'g');
  const out = [];
  let last = 0;
  for (const m of value.matchAll(re)) {
    if (m.index > last) out.push({ type: 'text', value: value.slice(last, m.index) });
    out.push({ type: 'element', tagName: 'span', properties: { className: ['ltr'] }, children: [{ type: 'text', value: m[0] }] });
    last = m.index + m[0].length;
  }
  if (!out.length) return null;
  if (last < value.length) out.push({ type: 'text', value: value.slice(last) });
  return out;
}

function walk(node) {
  if (!node.children || skip(node)) return;
  const next = [];
  for (const child of node.children) {
    if (child.type === 'text') {
      const parts = split(child.value);
      if (parts) next.push(...parts); else next.push(child);
    } else {
      walk(child);
      next.push(child);
    }
  }
  node.children = next;
}

export default function rehypeBidi() {
  return (tree) => walk(tree);
}
