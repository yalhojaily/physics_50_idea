import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import { unified } from '@astrojs/markdown-remark';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import rehypeBidi from './src/scripts/rehype-bidi.mjs';

export default defineConfig({
  site: 'https://yalhojaily.github.io',
  base: '/physics_50_idea',
  trailingSlash: 'ignore',
  markdown: {
    // المعادلات تُحوَّل إلى HTML وقت البناء عبر KaTeX
    processor: unified({ remarkPlugins: [remarkMath], rehypePlugins: [rehypeKatex, rehypeBidi] }),
  },
  integrations: [mdx()],
});
