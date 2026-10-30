// أدوات صغيرة مشتركة بين المختبرات الجديدة.
import { isolate } from './bidi';

/** يضبط دقة اللوحة حسب كثافة الشاشة ويعيد سياق الرسم بأبعاد CSS */
export function fit(c: HTMLCanvasElement) {
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  const { width, height } = c.getBoundingClientRect();
  const W = Math.round(width * dpr), H = Math.round(height * dpr);
  if (c.width !== W || c.height !== H) { c.width = W; c.height = H; }
  const ctx = c.getContext('2d')!;
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  ctx.direction = 'ltr';
  return { ctx, w: width, h: height };
}

/** يكتب خانات القراءات فقط حين يتغير محتواها */
export function readoutWriter(el: HTMLElement) {
  let last = '';
  return (cells: [string, string, boolean?][]) => {
    const html = cells.map(([k, v, hl]) => `<div${hl ? ' class="hl"' : ''}><dt>${k}</dt><dd>${v}</dd></div>`).join('');
    if (html !== last) { el.innerHTML = html; last = html; }
  };
}

/** يكتب الشرح فقط حين يتغير، مع عزل الأرقام ووحداتها */
export function captionWriter(el: HTMLElement) {
  return (text: string) => {
    const t = isolate(text);
    if (el.textContent !== t) el.textContent = t;
  };
}

/** حلقة رسم لا تعمل إلا والمختبر ظاهر على الشاشة */
export function runLoop(root: HTMLElement, frame: (dt: number) => void) {
  let visible = true;
  new IntersectionObserver(([e]) => (visible = e.isIntersecting)).observe(root);
  let last = performance.now();
  const loop = (now: number) => {
    const dt = Math.max(0, Math.min(0.05, (now - last) / 1000));
    last = now;
    if (visible) frame(dt);
    requestAnimationFrame(loop);
  };
  requestAnimationFrame(loop);
}

export function gauss() {
  let u = 0, v = 0;
  while (u === 0) u = Math.random();
  while (v === 0) v = Math.random();
  return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v);
}

export const cssVar = (name: string) => getComputedStyle(document.documentElement).getPropertyValue(name);
