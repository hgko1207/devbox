import { lazy } from 'react'
import type { ToolMeta } from '../types'
import { DiffIcon } from '@/components/icons'

export const textDiffTool: ToolMeta = {
  id: 'text-diff',
  path: '/text-diff',
  name: '텍스트 Diff',
  description: '두 텍스트의 줄 단위 차이 비교',
  icon: DiffIcon,
  keywords: ['diff', '차이', '비교', 'compare', 'text', '텍스트'],
  category: '유틸리티',
  component: lazy(() => import('./TextDiffPage')),
}
