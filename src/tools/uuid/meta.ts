import { lazy } from 'react'
import type { ToolMeta } from '../types'
import { HashIcon } from '@/components/icons'

export const uuidTool: ToolMeta = {
  id: 'uuid',
  path: '/uuid',
  name: 'UUID 생성',
  description: 'UUID v4 생성 (개수 지정·대문자·전체 복사)',
  icon: HashIcon,
  keywords: ['uuid', 'guid', 'random', '난수', '식별자', 'v4'],
  component: lazy(() => import('./UuidPage')),
}
