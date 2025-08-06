import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { VitePWA } from 'vite-plugin-pwa';

// https://vite.dev/config/
export default defineConfig({
    base: "/gym/",
    plugins: [
        react(),
        tailwindcss(),
        VitePWA({
            registerType: 'autoUpdate',
            workbox: {
                navigateFallback: '/gym/index.html',
                globPatterns: ['**/*.{js,css,html,ico,png,svg}'],
            },
            manifest: {
                name: 'My React PWA',
                short_name: 'ReactPWA',
                description: 'My awesome React PWA built with Vite',
                theme_color: '#ffffff',
                icons: [
                    {
                        src: 'pwa-192x192.png',
                        sizes: '192x192',
                        type: 'image/png',
                    },
                    {
                        src: 'pwa-512x512.png',
                        sizes: '512x512',
                        type: 'image/png',
                    },
                ],
                start_url: '.',
                display: 'standalone',
                background_color: '#ffffff',
            },
        }),
    ],
    server: {
        fs: {
            strict: true,
        },
    },
});
