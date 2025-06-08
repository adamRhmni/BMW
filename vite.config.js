import { defineConfig } from 'vite';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  plugins: [
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: [
        'icon.png',
        'astronaut.glb',
        'blackhole.glb',
        'bmw_glb.glb'
      ],
      manifest: {
        name: 'BMW | Cinematic 3D Web Experience by Adam Rhmni',
        short_name: 'BMW 2',
        start_url: '.',
        display: 'standalone',
        background_color: '#000000',
        theme_color: '#000000',
        icons: [
          {
            src: 'icon.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: 'icon.png',
            sizes: '512x512',
            type: 'image/png'
          }
        ]
      },
      workbox: {
        maximumFileSizeToCacheInBytes: 60 * 1024 * 1024 
      }
    })
  ]
});
