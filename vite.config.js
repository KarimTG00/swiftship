import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    // En développement, l'API est servie sous la même origine que le front.
    // Les cookies (session admin, identité anonyme) fonctionnent donc sans
    // aucune contrainte CORS. En production, front et API sont sur deux
    // sous-domaines du même domaine et c'est la config CORS de l'API qui joue.
    proxy: {
      "/api": { target: "http://localhost:4000", changeOrigin: true },
      "/socket.io": { target: "http://localhost:4000", ws: true },
    },
  },
});
