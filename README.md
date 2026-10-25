# 50 فكرة في الفيزياء

موقع عربي تفاعلي يشرح الأفكار الخمسين في كتاب *50 Physics Ideas You Really Need to Know*.

الموقع: https://yalhojaily.github.io/physics_50_idea/

## البنية

```
src/
  data/topics.ts          ← المصدر الوحيد: المواضيع، الوحدات، المتطلبات، حالة النشر
  layouts/Base.astro      ← الهيكل العام (RTL، الخطوط، الوضع الداكن)
  layouts/Lesson.astro    ← قالب الدرس الثابت: الرأس، الروابط، زر الإنهاء
  components/
    ConceptMap.astro      ← خريطة المفاهيم (تُبنى من topics.ts)
    MachBucket.astro      ← محاكاة دلو نيوتن (الدرس 1)
    Quiz.astro / Symbols.astro / Callout.astro
  pages/
    index.astro           ← الصفحة الرئيسية والخريطة
    lessons/*.mdx         ← درس لكل موضوع
```

## إضافة درس جديد

1. أنشئ `src/pages/lessons/<slug>.mdx` بالـ `slug` الموجود في `topics.ts`، وفي رأسه `layout` و`id` و`idea`.
2. اتبع ترتيب الأقسام: الحدس ← التجربة التفاعلية ← المعادلة ← القصة ← أخطاء شائعة ← اختبر فهمك.
3. ضع `ready: true` للموضوع في `topics.ts`. الخريطة والروابط تتحدث تلقائيًا.

## التشغيل محليًا

```bash
npm install
npm run dev
```

النشر تلقائي عبر GitHub Actions عند كل دفع إلى `main`.
