import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig(() => ({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
    // react-globe.gl pulls in its own copy of three.js transitively; without
    // deduping, two separate THREE realms coexist and cross-realm instances
    // (e.g. a custom Material built from our own "three" import) silently
    // fail Three.js's internal instanceof checks, breaking the globe render.
    dedupe: ["three"],
  },
}));
