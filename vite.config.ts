import path from "node:path";
import { fileURLToPath } from "node:url";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import { VitePWA } from "vite-plugin-pwa";

const dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      registerType: "autoUpdate",
      includeAssets: ["favicon.svg"],
      workbox: {
        // Precache only the built app-shell (JS/CSS/HTML/icons). Never add
        // runtimeCaching for /api/** here — this is a financial app and
        // ledger/transaction/report data must always come from the network,
        // never be served from a stale cache.
        globPatterns: ["**/*.{js,css,html,svg,png,ico}"],
        navigateFallbackDenylist: [/^\/api\//],
      },
      manifest: {
        name: "تیزبر صنعت",
        short_name: "تیزبر صنعت",
        description: "دستیار حسابداری کارگاه",
        lang: "fa",
        dir: "rtl",
        start_url: "/",
        scope: "/",
        display: "standalone",
        background_color: "#ffffff",
        theme_color: "#163f34",
        icons: [
          { src: "/icons/icon-192.png", sizes: "192x192", type: "image/png", purpose: "any" },
          { src: "/icons/icon-512.png", sizes: "512x512", type: "image/png", purpose: "any" },
          {
            src: "/icons/maskable-icon-512.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "maskable",
          },
        ],
      },
    }),
  ],
  resolve: {
    alias: {
      "@": path.resolve(dirname, "./src"),
    },
  },
  server: {
    port: 5173,
  },
});
