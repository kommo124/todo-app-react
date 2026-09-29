import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

const API_PROXY_TARGET = process.env.VITE_API_TARGET ?? "http://127.0.0.1:8000";

export default defineConfig({
  plugins: [react()],
  server: {
    host: "127.0.0.1",
    proxy: {
      "/api": API_PROXY_TARGET,
    },
  },
});
