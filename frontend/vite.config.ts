import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [
    react({
      // Fast Refresh configuration
      fastRefresh: true,
      // Exclude main.tsx from Fast Refresh (it's an entry point)
      exclude: /node_modules/,
    })
  ],
  server: {
    port: 5173,
    host: true
  }
});
