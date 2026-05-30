import { lazy } from 'react'
import type { ToolMeta } from '../types'
import { RegexIcon } from '@/components/icons'

export const regexTool: ToolMeta = {
  id: 'regex',
  path: '/regex',
  name: '정규식 테스터',
  description: '정규식 패턴/플래그 테스트 + 매치 하이라이트',
  icon: RegexIcon,
  keywords: ['regex', 'regexp', '정규식', 'pattern', '패턴', 'match', '매치'],
  category: '유틸리티',
  component: lazy(() => import('./RegexPage')),
}
