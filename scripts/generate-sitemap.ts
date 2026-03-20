import { writeFileSync } from 'fs';

const BASE = 'https://eatslowcarb.com';
const today = new Date().toISOString().split('T')[0];

// Inline slugs to avoid importing from src/ (uses @/ path alias)
const publicRecipeSlugs = [
  'chili-con-carne', 'shakshuka', 'linzensoep', 'burrito-bowl', 'roerbak-kip',
  'frittata', 'huttenkase-power-bowl', 'ferriss-klassieker', 'mexicaanse-bonenschotel',
  'tonijn-bonen-salade', 'spinazie-ei-bowl', 'kip-kokos-curry', 'eiwitrijke-omelet',
  'mediterrane-kip-salade', 'groentecreme-soep',
];

const articles = [
  { loc: '/gids/slow-carb-dieet', lastmod: '2026-03-17' },
  { loc: '/gids/slow-carb-vs-keto', lastmod: '2026-03-17' },
];

interface SitemapEntry {
  loc: string;
  priority: string;
  changefreq: string;
  lastmod?: string;
}

const allPages: SitemapEntry[] = [
  { loc: '/', priority: '1.0', changefreq: 'weekly' },
  { loc: '/gids', priority: '0.85', changefreq: 'weekly' },
  { loc: '/recepten', priority: '0.8', changefreq: 'weekly' },
  ...articles.map(a => ({
    loc: a.loc,
    priority: '0.9',
    changefreq: 'monthly',
    lastmod: a.lastmod,
  })),
  ...publicRecipeSlugs.map(slug => ({
    loc: `/recepten/${slug}`,
    priority: '0.7',
    changefreq: 'monthly',
  })),
];

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${allPages.map(p => `  <url>
    <loc>${BASE}${p.loc}</loc>
    <lastmod>${p.lastmod || today}</lastmod>
    <changefreq>${p.changefreq}</changefreq>
    <priority>${p.priority}</priority>
  </url>`).join('\n')}
</urlset>`;

writeFileSync('dist/sitemap.xml', xml);
console.log(`Sitemap generated with ${allPages.length} URLs`);
