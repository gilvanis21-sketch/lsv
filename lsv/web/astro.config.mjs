// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// URL publique du site : à définir au déploiement (SITE_URL=https://www.domaine-lsv.fr npm run build)
const site = process.env.SITE_URL || 'https://www.lsv.example';

export default defineConfig({
  site,
  trailingSlash: 'always',
  build: {
    format: 'directory',
    // Aucun CSS en ligne : compatible avec une CSP sans 'unsafe-inline'
    inlineStylesheets: 'never',
  },
  vite: {
    // Aucun script en ligne non plus
    build: { assetsInlineLimit: 0 },
  },
  integrations: [
    sitemap({
      filter: (page) => !page.includes('/gabarits/') && !page.includes('/404'),
    }),
  ],
});
