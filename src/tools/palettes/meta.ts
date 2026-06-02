import { lazy } from 'react'
import type { ToolMeta } from '../types'
import { SwatchesIcon } from '@/components/icons'

export const palettesTool: ToolMeta = {
  id: 'palettes',
  path: '/palettes',
  name: '팔레트 영감',
  description: 'Pantone·개발 테마·디자인 시스템·한국 전통 — 큐레이션 팔레트 카탈로그',
  icon: SwatchesIcon,
  keywords: [
    'palette',
    '팔레트',
    '영감',
    'inspiration',
    'pantone',
    'catppuccin',
    'tokyo night',
    'nord',
    'dracula',
    'tailwind',
    'material',
    'theme',
    '테마',
    '오방색',
    '단청',
    '한국',
    '전통',
    'trend',
    '트렌드',
  ],
  category: '유틸리티',
  component: lazy(() => import('./PalettesPage')),
}
