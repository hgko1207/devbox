import { lazy } from 'react'
import type { ToolMeta } from '../types'
import { YamlIcon } from '@/components/icons'

export const yamlTool: ToolMeta = {
  id: 'yaml',
  path: '/yaml',
  name: 'JSON ↔ YAML',
  description: 'JSON ↔ YAML 변환 (k8s·GitHub Actions·docker-compose)',
  icon: YamlIcon,
  keywords: ['yaml', 'json', '변환', 'convert', 'config', 'k8s', 'kubernetes', 'compose', 'actions'],
  category: '데이터',
  component: lazy(() => import('./YamlPage')),
}
