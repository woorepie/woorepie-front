import { defineConfig } from "vite"
import react from "@vitejs/plugin-react"
import path from "path"

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(path.dirname(import.meta.url), "./src"),
    },
  },
  server: {
    host: '0.0.0.0', // 👈 모든 IP에서 접속 가능하게 설정
    port: 3000       // 포트도 원하면 변경 가능
  }
})
