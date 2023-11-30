import { svelte } from '@sveltejs/vite-plugin-svelte'
import { defineConfig } from 'vite'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    svelte(),
    VitePWA({
      registerType: 'autoUpdate',
      manifest: {
        name: 'Jigsaw Puzzle',
        short_name: 'Puzzle',
        description: 'Simple jigsaw puzzle game.',
        theme_color: '#ffe4c4', // 'brisque'
        icons: [
          {
            src: 'favicon.jpg',
            sizes: '64x64',
            type: 'image/jpg'
          },
          {
            src: 'favicon.svg',
            sizes: 'any',
            type: 'image/svg+xml'
          }
        ]
      }
    })
  ],
  base: '/jigsaw-puzzle/'
})
