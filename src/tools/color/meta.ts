import { lazy } from 'react'
import type { ToolMeta } from '../types'
import { PaletteIcon } from '@/components/icons'

export const colorTool: ToolMeta = {
  id: 'color',
  path: '/color',
  name: '색상 변환',
  description: 'HEX ↔ RGB ↔ HSL 자동 변환 + 미리보기',
  icon: PaletteIcon,
  keywords: ['color', '색상', '색', 'hex', 'rgb', 'hsl', '변환', 'convert'],
  category: '유틸리티',
  component: lazy(() => import('./ColorPage')),
}
