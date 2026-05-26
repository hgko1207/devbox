/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        // 브랜드 액센트 토큰 (기본 indigo 슬롭에서 벗어난 바이올렛 램프).
        // 색을 바꾸려면 이 한 곳만 수정하면 된다.
        brand: {
          50: '#f5f3ff',
          100: '#ede9fe',
          200: '#ddd6fe',
          300: '#c4b5fd',
          400: '#a78bfa',
          500: '#8b5cf6',
          600: '#7c3aed',
          700: '#6d28d9',
          800: '#5b21b6',
          900: '#4c1d95',
          950: '#2e1065',
        },
      },
      fontFamily: {
        sans: [
          '-apple-system',
          'BlinkMacSystemFont',
          'Segoe UI',
          'Apple SD Gothic Neo',
          'Pretendard',
          'Malgun Gothic',
          'Noto Sans KR',
          'Roboto',
          'sans-serif',
        ],
        mono: [
          'ui-monospace',
          'SFMono-Regular',
          'Menlo',
          'Consolas',
          'D2Coding',
          'monospace',
        ],
      },
    },
  },
  plugins: [],
}
