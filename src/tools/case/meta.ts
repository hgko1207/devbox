import { lazy } from 'react'
import type { ToolMeta } from '../types'
import { CaseIcon } from '@/components/icons'

export const caseTool: ToolMeta = {
  id: 'case',
  path: '/case',
  name: '케이스 변환',
  description: 'camelCase·snake·kebab·Pascal·Screaming 등 동시 변환',
  icon: CaseIcon,
  keywords: ['case', '케이스', 'camel', 'snake', 'kebab', 'pascal', 'naming', '식별자', 'convention'],
  category: '유틸리티',
  component: lazy(() => import('./CasePage')),
}
