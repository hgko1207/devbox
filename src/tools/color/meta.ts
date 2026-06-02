import { lazy } from 'react'
import type { ToolMeta } from '../types'
import { PaletteIcon } from '@/components/icons'

export const colorTool: ToolMeta = {
  id: 'color',
  path: '/color',
  name: '색상',
  description: 'HEX·RGB·HSL·OKLCH 변환, 자동 배색, 명도 단계, WCAG 대비',
  icon: PaletteIcon,
  keywords: [
    'color',
    '색상',
    '색',
    'hex',
    'rgb',
    'hsl',
    'oklch',
    '변환',
    'convert',
    '배색',
    'scheme',
    '팔레트',
    'palette',
    'wcag',
    '대비',
    'contrast',
  ],
  category: '유틸리티',
  component: lazy(() => import('./ColorPage')),
}
