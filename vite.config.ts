/// <reference types="vitest/config" />
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { fileURLToPath, URL } from 'node:url'

// 배포 base 경로. devbox.hgko.dev 루트에서 서빙하므로 기본값 '/'.
// 하위 경로에 올릴 때만 VITE_BASE 로 덮어쓴다(예: /devbox/).
const base = process.env.VITE_BASE || '/'

export default defineConfig({
  base,
  plugins: [react()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  build: {
    target: 'es2020',
  },
  test: {
    // parser/diff 는 순수 로직이라 DOM 불필요 → node 환경에서 빠르게 실행
    environment: 'node',
    include: ['src/**/*.test.ts'],
  },
})
