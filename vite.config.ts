import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import { VitePWA } from "vite-plugin-pwa";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      workbox: {
        globPatterns: ["**/*"],
      },
      includeAssets: ["**/*"],
      manifest: {
        theme_color: "transparent",
        background_color: "#18181b",
        display: "standalone",
        scope: "/",
        start_url: "/",
        short_name: "FlixFinder",
        description:
          "FlixFinder helps you discover the best movies with personalized recommendations based on TMDB. Search for your favorite movies, find similar suggestions, and share your discoveries with your friends. Stop asking yourself “What are we watching?” » – let CinéQuest do the work!",
        name: "Flix Finder",
        icons: [
          {
            src: "logo/logo.png",
            sizes: "192x192",
            type: "image/png",
          },
          {
            src: "logo/logo.png",
            sizes: "256x256",
            type: "image/png",
          },
          {
            src: "logo/logo.png",
            sizes: "384x384",
            type: "image/png",
          },
          {
            src: "logo/logo.png",
            sizes: "512x512",
            type: "image/png",
          },
        ],
      },
    }),
  ],
});
