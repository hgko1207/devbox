import { lazy } from 'react'
import type { ToolMeta } from '../types'
import { ParagraphIcon } from '@/components/icons'

export const loremKoTool: ToolMeta = {
  id: 'lorem-ko',
  path: '/lorem-ko',
  name: 'Lorem 한국어',
  description: '자연스러운 한국어 더미 텍스트 — 단락/문장/어절 단위로 생성',
  icon: ParagraphIcon,
  keywords: [
    'lorem',
    'lorem ipsum',
    '한국어',
    'korean',
    '더미',
    'dummy',
    'placeholder',
    'text',
    '타이포',
    'typography',
    '글꼴',
    '미리보기',
  ],
  category: '한국어',
  component: lazy(() => import('./LoremPage')),
}
