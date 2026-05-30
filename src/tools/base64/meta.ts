import { lazy } from 'react'
import type { ToolMeta } from '../types'
import { CodeIcon } from '@/components/icons'

export const base64Tool: ToolMeta = {
  id: 'base64',
  path: '/base64',
  name: 'Base64',
  description: '텍스트 ↔ Base64 인코드·디코드 (UTF-8·URL-safe)',
  icon: CodeIcon,
  keywords: ['base64', 'encode', 'decode', '인코드', '디코드', '인코딩', '디코딩'],
  category: '인코딩 · 디코딩',
  component: lazy(() => import('./Base64Page')),
}
