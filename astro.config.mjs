import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import node from '@astrojs/node';

export default defineConfig({
  integrations: [tailwind()],
  output: 'static',  
  site: 'https://thomas.github.io',  
  base: '/lhn-standings',  
  adapter: node({
    mode: 'standalone',
    ssr: true
  })
});
