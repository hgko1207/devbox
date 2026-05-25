import { lazy } from 'react'
import type { ToolMeta } from '../types'
import { BracesIcon } from '@/components/icons'

export const jsonTool: ToolMeta = {
  id: 'json',
  path: '/json',
  name: 'JSON 도구',
  description: 'JSON 포맷팅·압축·유효성 검사, 트리 뷰, 두 JSON 비교(diff)',
  icon: BracesIcon,
  keywords: ['json', 'format', 'minify', 'validate', 'diff', '비교', '포맷', '정렬', '압축', '검증'],
  // 코드 스플리팅: 홈에서는 메타만 사용하고 페이지는 진입 시 로드
  component: lazy(() => import('./JsonToolPage')),
}
