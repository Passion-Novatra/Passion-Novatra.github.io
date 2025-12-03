import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import tailwind from '@astrojs/tailwind';
import sitemap from '@astrojs/sitemap';
import rehypeSlug from 'rehype-slug';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';

export default defineConfig({
  site: 'https://novatra-ai.github.io', 
  base: '/',
  devToolbar: { enabled: false },
  
  integrations: [
    react(),
    tailwind({ applyBaseStyles: false }),
    sitemap(),
  ],

  markdown: {
    // 核心：配置 Markdown 渲染插件
    rehypePlugins: [
      rehypeSlug, // 自动生成 id
      [rehypeAutolinkHeadings, { behavior: 'wrap' }], // 自动添加锚点链接
    ],
    shikiConfig: {
      theme: 'one-dark-pro', // 代码高亮主题
      wrap: true,
    },
  },

  i18n: {
    defaultLocale: 'zh',
    locales: ['zh', 'en'],
    routing: { prefixDefaultLocale: false }
  }
});
