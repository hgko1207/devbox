import { lazy } from 'react'
import type { ToolMeta } from '../types'
import { FingerprintIcon } from '@/components/icons'

export const hashTool: ToolMeta = {
  id: 'hash',
  path: '/hash',
  name: '해시 생성',
  description: 'SHA-1·SHA-256·SHA-384·SHA-512 해시 (Web Crypto)',
  icon: FingerprintIcon,
  keywords: ['hash', 'sha', 'sha256', 'sha-256', '해시', '체크섬', 'checksum', 'digest'],
  component: lazy(() => import('./HashPage')),
}
