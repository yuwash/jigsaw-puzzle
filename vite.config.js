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
        includeAssets: ['./src/blur.jpg'],
        icons: [
          {
            src: 'favicon.png',
            sizes: '64x64',
            type: 'image/png'
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
