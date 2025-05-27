// vite.config.ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
export default defineConfig(({ command }) => {
  const isBuild = command === "build";
  return {
    base: "/frontend/",
    plugins: [react()],
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
    server: {
      host: "0.0.0.0",
      port: 3000,
    },
    // 의존성 프리번들링을 매번 강제로 다시 수행
    optimizeDeps: {
      force: true,
    },
    build: {
      // 출력 폴더를 비운 뒤 강제 빌드
      outDir: "dist",
      emptyOutDir: true,
      // sourcemap 필요 없으면 삭제
      sourcemap: isBuild,
      // 번들링 최소화 설정 (esbuild, terser 중 선택)
      minify: "esbuild",
      // 브로틀리 리포트 생략
      brotliSize: false,
      // 추가 Rollup 옵션
      rollupOptions: {
        output: {
          chunkFileNames: "assets/js/[name]-[hash].js",
          entryFileNames: "assets/js/[name]-[hash].js",
          assetFileNames: ({ name }) => {
            if (/\.(gif|jpe?g|png|svg)$/.test(name || "")) {
              return "assets/images/[name]-[hash][extname]";
            }
            if (/\.css$/.test(name || "")) {
              return "assets/css/[name]-[hash][extname]";
            }
            return "assets/[name]-[hash][extname]";
          },
        },
      },
    },
    // 터미널 screen clear 방지 (원하면 제거)
    clearScreen: false,
  };
});
