import { svelte } from '@sveltejs/vite-plugin-svelte'
import { defineConfig } from 'vite'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    svelte(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.jpg'],
      manifest: {
        name: 'Jigsaw Puzzle',
        short_name: 'Puzzle',
        description: 'Simple jigsaw puzzle game.',
        theme_color: 'brisque',
        icons: [
          {
            src: 'favicon.jpg',
            sizes: '64x64',
            type: 'image/jpg'
          }
        ]
      }
    })
  ],
  base: '/jigsaw-puzzle/'
})
