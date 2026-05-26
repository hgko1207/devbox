import { lazy } from 'react'
import type { ToolMeta } from '../types'
import { KeyIcon } from '@/components/icons'

export const jwtTool: ToolMeta = {
  id: 'jwt',
  path: '/jwt',
  name: 'JWT 디코더',
  description: 'JWT 헤더·페이로드 디코드 (서명 검증 없음)',
  icon: KeyIcon,
  keywords: ['jwt', 'token', '토큰', 'decode', '디코드', 'jws', 'bearer'],
  component: lazy(() => import('./JwtPage')),
}
