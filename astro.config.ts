import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  site: 'https://sh4dow-clg.github.io',
  // GitHub Pages publikuje repozytorium w /Portfolio/; lokalnie zachowujemy /.
  base: process.env.GITHUB_ACTIONS === 'true' ? '/Portfolio' : '/',
  output: 'static',
  vite: {
    plugins: [tailwindcss()],
  },
});
