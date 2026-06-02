import { lazy } from 'react'
import type { ToolMeta } from '../types'
import { TypeIcon } from '@/components/icons'

export const romajaTool: ToolMeta = {
  id: 'romaja',
  path: '/romaja',
  name: '로마자 변환',
  description: '한글 → 로마자 (국립국어원 표기법 + 인명용 관용 표기)',
  icon: TypeIcon,
  keywords: [
    'romaja',
    '로마자',
    '한글',
    'romanization',
    '국립국어원',
    'name',
    '이름',
    '여권',
    'passport',
    '인명',
    '지명',
  ],
  category: '한국어',
  component: lazy(() => import('./RomajaPage')),
}
