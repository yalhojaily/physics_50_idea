// محرك غاز ثنائي الأبعاد: أقراص صلبة تتصادم تصادمات مرنة داخل صندوق جداره الأيمن مكبس متحرك.
// يُستعمل في دروس الغاز المثالي والقانون الثاني والصفر المطلق.

/** ثابت بولتزمان في وحدات المحاكاة: kT = m⟨v²⟩/2 في بعدين، والكتلة m = 1 */
export const K_SIM = 0.125 / 300;

export class Gas {
  readonly H: number;
  readonly W: number;
  /** موضع المكبس (الجدار الأيمن) */
  xw: number;
  /** سرعة المكبس */
  u = 0;
  /** حاجز رأسي يمنع العبور (للدرس 9)، أو null */
  barrier: number | null = null;
  r: number;
  n = 0;
  x = new Float64Array(0);
  y = new Float64Array(0);
  vx = new Float64Array(0);
  vy = new Float64Array(0);
  /** مجموع الدفع على الجدران منذ آخر قراءة، والزمن المقابل */
  impulse = 0;
  impulseT = 0;
  /** منظّم حرارة: يقرّب درجة الحرارة من thermostat إن لم يكن null */
  thermostat: number | null = null;

  constructor(opts: { W?: number; H?: number; r?: number } = {}) {
    this.W = opts.W ?? 1;
    this.H = opts.H ?? 0.7;
    this.xw = this.W;
    this.r = opts.r ?? 0.005;
  }

  /** يملأ المنطقة [x0, x1] بعدد n من الجزيئات بسرعات من توزيع ماكسويل عند درجة الحرارة T */
  fill(n: number, T: number, x0 = 0, x1 = this.xw) {
    this.n = n;
    this.x = new Float64Array(n);
    this.y = new Float64Array(n);
    this.vx = new Float64Array(n);
    this.vy = new Float64Array(n);
    const r = this.r;
    for (let i = 0; i < n; i++) {
      this.x[i] = x0 + r + Math.random() * (x1 - x0 - 2 * r);
      this.y[i] = r + Math.random() * (this.H - 2 * r);
      // كل مركّبة سرعة توزيعها طبيعي تباينه kT/m
      const s = Math.sqrt(K_SIM * T);
      this.vx[i] = s * gauss();
      this.vy[i] = s * gauss();
    }
    this.setTemp(T); // يصحح التذبذب العشوائي ليطابق T بالضبط
    this.impulse = 0;
    this.impulseT = 0;
  }

  /** درجة الحرارة من متوسط الطاقة الحركية: ⟨KE⟩ = kT في بعدين */
  temp() {
    if (!this.n) return 0;
    let e = 0;
    for (let i = 0; i < this.n; i++) e += this.vx[i] ** 2 + this.vy[i] ** 2;
    return e / 2 / this.n / K_SIM;
  }

  setTemp(T: number) {
    const now = this.temp();
    if (now <= 0) return;
    const f = Math.sqrt(T / now);
    for (let i = 0; i < this.n; i++) { this.vx[i] *= f; this.vy[i] *= f; }
  }

  area() { return this.xw * this.H; }
  perimeter() { return 2 * (this.xw + this.H); }

  /** الضغط النظري لغاز مثالي ثنائي الأبعاد: P·A = N k T */
  idealPressure(T = this.temp()) { return (this.n * K_SIM * T) / this.area(); }

  /** يحرّك المكبس إلى موضع جديد بسرعة محدودة (ضغط أو تمدد بطيء) */
  movePistonTo(target: number, dt: number, maxSpeed = 0.25) {
    const d = target - this.xw;
    const step = Math.max(-maxSpeed * dt, Math.min(maxSpeed * dt, d));
    this.u = dt > 0 ? step / dt : 0;
    this.xw += step;
    // لا يُسمح للمكبس أن يسحق الجزيئات: ندفع من تخطّاه
    for (let i = 0; i < this.n; i++) if (this.x[i] > this.xw - this.r) this.x[i] = this.xw - this.r;
  }

  step(dt: number) {
    if (!(dt > 0)) return;
    const { r, H } = this;
    const n = this.n;
    const X = this.x, Y = this.y, VX = this.vx, VY = this.vy;
    let imp = 0;
    for (let i = 0; i < n; i++) {
      const xOld = X[i];
      X[i] += VX[i] * dt;
      Y[i] += VY[i] * dt;
      if (X[i] < r) { X[i] = 2 * r - X[i]; imp += 2 * Math.abs(VX[i]); VX[i] = Math.abs(VX[i]); }
      if (Y[i] < r) { Y[i] = 2 * r - Y[i]; imp += 2 * Math.abs(VY[i]); VY[i] = Math.abs(VY[i]); }
      if (Y[i] > H - r) { Y[i] = 2 * (H - r) - Y[i]; imp += 2 * Math.abs(VY[i]); VY[i] = -Math.abs(VY[i]); }
      const right = this.xw - r;
      if (X[i] > right && VX[i] > this.u) {
        // ارتداد عن جدار يتحرك بسرعة u: v' = 2u − v
        const v0 = VX[i];
        VX[i] = 2 * this.u - v0;
        imp += Math.abs(v0 - VX[i]);
        X[i] = right - (X[i] - right);
      }
      if (this.barrier !== null) {
        // الحاجز يرتد عنه الجزيء من الجهتين (لا نحسب دفعه ضمن الضغط)
        const b = this.barrier;
        if ((xOld < b) !== (X[i] < b)) { X[i] = 2 * b - X[i]; VX[i] = -VX[i]; }
      }
    }
    // تصادمات بين الجزيئات عبر شبكة خلايا
    const cell = Math.max(2 * r, 0.02);
    const cols = Math.ceil(this.W / cell) + 1, rows = Math.ceil(H / cell) + 1;
    const head = new Int32Array(cols * rows).fill(-1);
    const next = new Int32Array(n);
    for (let i = 0; i < n; i++) {
      const c = Math.min(cols - 1, Math.max(0, (X[i] / cell) | 0)) + cols * Math.min(rows - 1, Math.max(0, (Y[i] / cell) | 0));
      next[i] = head[c];
      head[c] = i;
    }
    const d2 = 4 * r * r;
    for (let i = 0; i < n; i++) {
      const cx = Math.min(cols - 1, Math.max(0, (X[i] / cell) | 0));
      const cy = Math.min(rows - 1, Math.max(0, (Y[i] / cell) | 0));
      for (let oy = -1; oy <= 1; oy++) for (let ox = -1; ox <= 1; ox++) {
        const qx = cx + ox, qy = cy + oy;
        if (qx < 0 || qy < 0 || qx >= cols || qy >= rows) continue;
        for (let j = head[qx + cols * qy]; j !== -1; j = next[j]) {
          if (j <= i) continue;
          const dx = X[j] - X[i], dy = Y[j] - Y[i];
          const dd = dx * dx + dy * dy;
          if (dd >= d2 || dd === 0) continue;
          const dvx = VX[j] - VX[i], dvy = VY[j] - VY[i];
          const dot = dvx * dx + dvy * dy;
          if (dot >= 0) continue; // يتباعدان أصلًا
          // كتل متساوية: تتبادل الجزيئات مركّبة السرعة على خط المركزين
          const k = dot / dd;
          VX[i] += k * dx; VY[i] += k * dy;
          VX[j] -= k * dx; VY[j] -= k * dy;
        }
      }
    }
    if (this.thermostat !== null) {
      const T = this.temp();
      if (T > 0) {
        const lam = Math.sqrt(1 + (this.thermostat / T - 1) * Math.min(1, dt / 0.25));
        for (let i = 0; i < n; i++) { VX[i] *= lam; VY[i] *= lam; }
      }
    }
    this.impulse += imp;
    this.impulseT += dt;
  }

  /** يقرأ الضغط المقيس من الدفع على الجدران منذ آخر قراءة، ثم يصفّر العدّاد */
  readPressure() {
    if (this.impulseT <= 0) return 0;
    const p = this.impulse / this.impulseT / this.perimeter();
    this.impulse = 0;
    this.impulseT = 0;
    return p;
  }

  countLeftOf(b: number) {
    let c = 0;
    for (let i = 0; i < this.n; i++) if (this.x[i] < b) c++;
    return c;
  }
}

function gauss() {
  let u = 0, v = 0;
  while (u === 0) u = Math.random();
  while (v === 0) v = Math.random();
  return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v);
}

/** يلوّن الجزيء حسب سرعته: أزرق للبطيء، أحمر للسريع */
export function speedColor(v2: number, kT: number) {
  const t = Math.min(1, v2 / (4 * kT));
  const r = Math.round(76 + (239 - 76) * t);
  const g = Math.round(201 + (106 - 201) * t);
  const b = Math.round(240 + (76 - 240) * t);
  return `rgb(${r},${g},${b})`;
}

/**
 * مقياس ضغط: بعد كل تغيير ينتظر ثانية حتى يستقر الغاز، ثم يأخذ متوسطًا تراكميًا لكل الضربات منذ ذلك الحين.
 * أثناء الانتظار يعرض متوسطًا متحركًا سريعًا.
 */
export class PressureMeter {
  private sumImp = 0;
  private sumT = 0;
  private quick = 0;
  /** زمن منذ آخر تغيير */
  since = 0;
  constructor(private warmup = 1) {}

  reset() { this.sumImp = 0; this.sumT = 0; this.since = 0; }

  update(gas: Gas, dt: number) {
    if (!(dt > 0)) return;
    const per = gas.perimeter();
    const imp = gas.impulse / per, t = gas.impulseT;
    gas.impulse = 0;
    gas.impulseT = 0;
    if (t <= 0) return;
    this.quick += (imp / t - this.quick) * (1 - Math.exp(-t / 0.4));
    this.since += t;
    if (this.since > this.warmup) { this.sumImp += imp; this.sumT += t; }
  }

  /** الضغط المقيس (وحدات المحاكاة) */
  value() { return this.sumT > 0.5 ? this.sumImp / this.sumT : this.quick; }
  /** زمن القياس المتراكم */
  measured() { return this.sumT; }
  seed(p: number) { this.quick = p; }
}
