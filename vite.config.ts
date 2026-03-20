import path from "path"
import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"
import { inspectAttr } from 'kimi-plugin-inspect-react'
import prerender from '@prerenderer/rollup-plugin'
import PuppeteerRenderer from '@prerenderer/renderer-puppeteer'

// Pre-rendering: routes are inlined to avoid importing from src/ (which uses @/ path alias)
const publicRecipeSlugs = [
  'chili-con-carne', 'shakshuka', 'linzensoep', 'burrito-bowl', 'roerbak-kip',
  'frittata', 'huttenkase-power-bowl', 'ferriss-klassieker', 'mexicaanse-bonenschotel',
  'tonijn-bonen-salade', 'spinazie-ei-bowl', 'kip-kokos-curry', 'eiwitrijke-omelet',
  'mediterrane-kip-salade', 'groentecreme-soep',
];

const publicRoutes = [
  '/',
  '/gids',
  '/gids/slow-carb-dieet',
  '/gids/slow-carb-vs-keto',
  '/recepten',
  ...publicRecipeSlugs.map(slug => `/recepten/${slug}`),
];

// https://vite.dev/config/
export default defineConfig(({ mode }) => ({
  base: '/',
  plugins: [
    ...(mode !== 'production' ? [inspectAttr()] : []),
    react(),
    ...(mode === 'production' ? [
      prerender({
        routes: publicRoutes,
        renderer: new PuppeteerRenderer({
          renderAfterTime: 3000,
        }),
      }),
    ] : []),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));
