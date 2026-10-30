// المصدر الوحيد لبيانات المواضيع: الخريطة والروابط والتنقل تُبنى كلها من هنا.

export interface Unit {
  id: number;
  title: string;
  color: string; // لون الوحدة في الخريطة والصفحات
}

export interface Topic {
  id: number;
  title: string;
  en: string;
  unit: number;
  slug: string;
  prereqs: number[]; // مواضيع يُستحسن فهمها قبل هذا الموضوع
  ready?: boolean; // هل الدرس منشور؟
}

export const units: Unit[] = [
  { id: 1, title: 'الميكانيكا', color: '#f0a43a' },
  { id: 2, title: 'الحرارة والموائع', color: '#ef6a4c' },
  { id: 3, title: 'الضوء والموجات', color: '#e9c46a' },
  { id: 4, title: 'الكهرومغناطيسية', color: '#4cc9f0' },
  { id: 5, title: 'عالم الكم', color: '#9b8cff' },
  { id: 6, title: 'النواة والجسيمات', color: '#5ad19a' },
  { id: 7, title: 'النسبية والكون', color: '#f27fb8' },
];

export const topics: Topic[] = [
  { id: 1, unit: 1, slug: 'mach-principle', title: 'مبدأ ماخ', en: "Mach's principle", prereqs: [], ready: true },
  { id: 2, unit: 1, slug: 'newtons-laws-of-motion', title: 'قوانين نيوتن للحركة', en: "Newton's laws of motion", prereqs: [1], ready: true },
  { id: 3, unit: 1, slug: 'keplers-laws', title: 'قوانين كبلر', en: "Kepler's laws", prereqs: [], ready: true },
  { id: 4, unit: 1, slug: 'newtons-gravitation', title: 'قانون الجاذبية لنيوتن', en: "Newton's law of gravitation", prereqs: [2, 3], ready: true },
  { id: 5, unit: 1, slug: 'conservation-of-energy', title: 'حفظ الطاقة', en: 'Conservation of energy', prereqs: [2], ready: true },
  { id: 6, unit: 1, slug: 'simple-harmonic-motion', title: 'الحركة التوافقية البسيطة', en: 'Simple harmonic motion', prereqs: [7], ready: true },
  { id: 7, unit: 1, slug: 'hookes-law', title: 'قانون هوك', en: "Hooke's law", prereqs: [2], ready: true },

  { id: 8, unit: 2, slug: 'ideal-gas-law', title: 'قانون الغاز المثالي', en: 'Ideal gas law', prereqs: [5] },
  { id: 9, unit: 2, slug: 'second-law-of-thermodynamics', title: 'القانون الثاني للحرارة', en: 'Second law of thermodynamics', prereqs: [5, 8] },
  { id: 10, unit: 2, slug: 'absolute-zero', title: 'الصفر المطلق', en: 'Absolute zero', prereqs: [8, 9] },
  { id: 11, unit: 2, slug: 'brownian-motion', title: 'الحركة البراونية', en: 'Brownian motion', prereqs: [8] },
  { id: 12, unit: 2, slug: 'chaos-theory', title: 'نظرية الفوضى', en: 'Chaos theory', prereqs: [2] },
  { id: 13, unit: 2, slug: 'bernoulli-equation', title: 'معادلة برنولي', en: 'Bernoulli equation', prereqs: [5] },

  { id: 14, unit: 3, slug: 'newtons-theory-of-colour', title: 'نظرية نيوتن في الألوان', en: "Newton's theory of colour", prereqs: [] },
  { id: 15, unit: 3, slug: 'huygens-principle', title: 'مبدأ هويغنز', en: "Huygens' principle", prereqs: [] },
  { id: 16, unit: 3, slug: 'snells-law', title: 'قانون سنل', en: "Snell's law", prereqs: [15] },
  { id: 17, unit: 3, slug: 'braggs-law', title: 'قانون براغ', en: "Bragg's law", prereqs: [15] },
  { id: 18, unit: 3, slug: 'fraunhofer-diffraction', title: 'حيود فراونهوفر', en: 'Fraunhofer diffraction', prereqs: [15] },
  { id: 19, unit: 3, slug: 'doppler-effect', title: 'تأثير دوبلر', en: 'Doppler effect', prereqs: [15] },

  { id: 20, unit: 4, slug: 'ohms-law', title: 'قانون أوم', en: "Ohm's law", prereqs: [] },
  { id: 21, unit: 4, slug: 'flemings-right-hand-rule', title: 'قاعدة فلمنغ لليد اليمنى', en: "Fleming's right hand rule", prereqs: [20] },
  { id: 22, unit: 4, slug: 'maxwells-equations', title: 'معادلات ماكسويل', en: "Maxwell's equations", prereqs: [20, 21] },

  { id: 23, unit: 5, slug: 'plancks-law', title: 'قانون بلانك', en: "Planck's law", prereqs: [9, 22] },
  { id: 24, unit: 5, slug: 'photoelectric-effect', title: 'التأثير الكهروضوئي', en: 'Photoelectric effect', prereqs: [23] },
  { id: 25, unit: 5, slug: 'schrodinger-equation', title: 'معادلة شرودنغر', en: "Schrödinger's wave equation", prereqs: [23, 24] },
  { id: 26, unit: 5, slug: 'uncertainty-principle', title: 'مبدأ عدم اليقين', en: "Heisenberg's uncertainty principle", prereqs: [25] },
  { id: 27, unit: 5, slug: 'copenhagen-interpretation', title: 'تفسير كوبنهاغن', en: 'Copenhagen interpretation', prereqs: [25, 26] },
  { id: 28, unit: 5, slug: 'schrodingers-cat', title: 'قطة شرودنغر', en: "Schrödinger's cat", prereqs: [27] },
  { id: 29, unit: 5, slug: 'epr-paradox', title: 'مفارقة EPR', en: 'The EPR paradox', prereqs: [27] },
  { id: 30, unit: 5, slug: 'pauli-exclusion', title: 'مبدأ الاستبعاد لباولي', en: "Pauli's exclusion principle", prereqs: [25] },
  { id: 31, unit: 5, slug: 'superconductivity', title: 'الموصلية الفائقة', en: 'Superconductivity', prereqs: [20, 30] },
  { id: 32, unit: 5, slug: 'rutherfords-atom', title: 'ذرة رذرفورد', en: "Rutherford's atom", prereqs: [17] },

  { id: 33, unit: 6, slug: 'antimatter', title: 'المادة المضادة', en: 'Antimatter', prereqs: [25, 40] },
  { id: 34, unit: 6, slug: 'nuclear-fission', title: 'الانشطار النووي', en: 'Nuclear fission', prereqs: [32] },
  { id: 35, unit: 6, slug: 'nuclear-fusion', title: 'الاندماج النووي', en: 'Nuclear fusion', prereqs: [34] },
  { id: 36, unit: 6, slug: 'standard-model', title: 'النموذج القياسي', en: 'Standard model', prereqs: [30, 33] },
  { id: 37, unit: 6, slug: 'feynman-diagrams', title: 'مخططات فاينمان', en: 'Feynman diagrams', prereqs: [36] },
  { id: 38, unit: 6, slug: 'higgs-boson', title: '«جسيم الإله»', en: 'The God particle', prereqs: [36] },
  { id: 39, unit: 6, slug: 'string-theory', title: 'نظرية الأوتار', en: 'String theory', prereqs: [36, 41] },

  { id: 40, unit: 7, slug: 'special-relativity', title: 'النسبية الخاصة', en: 'Special relativity', prereqs: [22] },
  { id: 41, unit: 7, slug: 'general-relativity', title: 'النسبية العامة', en: 'General relativity', prereqs: [1, 4, 40] },
  { id: 42, unit: 7, slug: 'black-holes', title: 'الثقوب السوداء', en: 'Black holes', prereqs: [41] },
  { id: 43, unit: 7, slug: 'olbers-paradox', title: 'مفارقة أولبرز', en: "Olbers' paradox", prereqs: [] },
  { id: 44, unit: 7, slug: 'hubbles-law', title: 'قانون هابل', en: "Hubble's law", prereqs: [19] },
  { id: 45, unit: 7, slug: 'big-bang', title: 'الانفجار العظيم', en: 'The Big Bang', prereqs: [43, 44] },
  { id: 46, unit: 7, slug: 'cosmic-inflation', title: 'التضخم الكوني', en: 'Cosmic inflation', prereqs: [45] },
  { id: 47, unit: 7, slug: 'dark-matter', title: 'المادة المظلمة', en: 'Dark matter', prereqs: [4] },
  { id: 48, unit: 7, slug: 'cosmological-constant', title: 'الثابت الكوني', en: 'Cosmological constant', prereqs: [41, 45] },
  { id: 49, unit: 7, slug: 'fermi-paradox', title: 'مفارقة فيرمي', en: 'Fermi paradox', prereqs: [] },
  { id: 50, unit: 7, slug: 'anthropic-principle', title: 'المبدأ الإنساني', en: 'Anthropic principle', prereqs: [48] },
];

export const topicById = (id: number) => topics.find((t) => t.id === id)!;
export const unitById = (id: number) => units.find((u) => u.id === id)!;
export const nextOf = (id: number) => topics.filter((t) => t.prereqs.includes(id));

/** يضمن أن الرابط يحترم مسار GitHub Pages الفرعي */
export const withBase = (path = '') =>
  import.meta.env.BASE_URL.replace(/\/?$/, '/') + path.replace(/^\//, '');

export const lessonUrl = (t: Topic) => withBase(`lessons/${t.slug}/`);
