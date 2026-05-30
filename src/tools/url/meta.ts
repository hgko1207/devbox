import { lazy } from 'react'
import type { ToolMeta } from '../types'
import { LinkIcon } from '@/components/icons'

export const urlTool: ToolMeta = {
  id: 'url',
  path: '/url',
  name: 'URL 인코드',
  description: 'URL 인코드·디코드 (encodeURIComponent)',
  icon: LinkIcon,
  keywords: ['url', 'encode', 'decode', '인코드', '디코드', '퍼센트', 'percent', 'uri'],
  category: '인코딩 · 디코딩',
  component: lazy(() => import('./UrlPage')),
}
