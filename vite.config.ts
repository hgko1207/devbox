import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { fileURLToPath, URL } from 'node:url'

// 배포 base 경로. GitHub Actions 워크플로에서 VITE_BASE 를 저장소명(/repo/)으로 설정한다.
// 로컬 개발/빌드에서는 루트('/')를 사용한다.
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
})
