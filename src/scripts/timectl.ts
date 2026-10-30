// يربط أزرار TimeControls داخل مختبر، ويعيد حالة يقرؤها المختبر في كل إطار.

export interface TimeState {
  paused: boolean;
  speed: number;
  /** يُستدعى عند الضغط على «خطوة» (بعد الإيقاف تلقائيًا) */
  onStep?: () => void;
  /** يحدّث نص زر الإيقاف بعد تغيير paused من خارج الأزرار */
  sync: () => void;
}

export function bindTimeControls(root: HTMLElement): TimeState {
  const pauseBtn = root.querySelector<HTMLButtonElement>('.tc-pause')!;
  const stepBtn = root.querySelector<HTMLButtonElement>('.tc-step')!;
  const speedBtns = [...root.querySelectorAll<HTMLButtonElement>('.tctl [data-speed]')];
  const initial = speedBtns.find((b) => b.getAttribute('aria-pressed') === 'true');
  const state: TimeState = {
    paused: false,
    speed: initial ? Number(initial.dataset.speed) : 1,
    sync: () => (pauseBtn.textContent = state.paused ? '▶ تابع' : '⏸ إيقاف مؤقت'),
  };
  pauseBtn.addEventListener('click', () => { state.paused = !state.paused; state.sync(); });
  stepBtn.addEventListener('click', () => { state.paused = true; state.sync(); state.onStep?.(); });
  speedBtns.forEach((b) =>
    b.addEventListener('click', () => {
      state.speed = Number(b.dataset.speed);
      speedBtns.forEach((x) => x.setAttribute('aria-pressed', String(x === b)));
    }),
  );
  return state;
}
