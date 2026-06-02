import { lazy } from 'react'
import type { ToolMeta } from '../types'
import { ShieldIcon } from '@/components/icons'

export const brnTool: ToolMeta = {
  id: 'brn',
  path: '/brn',
  name: '사업자등록번호',
  description: '국세청 체크섬 검증 + 사업자 종류 디코딩',
  icon: ShieldIcon,
  keywords: [
    'brn',
    '사업자',
    '등록번호',
    '사업자등록번호',
    'business',
    'tax',
    '국세청',
    '검증',
    'validate',
    '체크섬',
  ],
  category: '한국어',
  component: lazy(() => import('./BrnPage')),
}
