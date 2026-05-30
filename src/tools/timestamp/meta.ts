import { lazy } from 'react'
import type { ToolMeta } from '../types'
import { ClockIcon } from '@/components/icons'

export const timestampTool: ToolMeta = {
  id: 'timestamp',
  path: '/timestamp',
  name: '타임스탬프 변환',
  description: 'Unix 타임스탬프 ↔ 날짜 (초·밀리초, 로컬·UTC·ISO)',
  icon: ClockIcon,
  keywords: ['timestamp', 'unix', 'epoch', '타임스탬프', '시간', '날짜', 'date', 'time'],
  category: '생성 · 계산',
  component: lazy(() => import('./TimestampPage')),
}
