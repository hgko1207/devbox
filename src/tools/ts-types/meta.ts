import { lazy } from 'react'
import type { ToolMeta } from '../types'
import { TypeIcon } from '@/components/icons'

export const tsTypesTool: ToolMeta = {
  id: 'ts-types',
  path: '/ts-types',
  name: 'JSON → TS 타입',
  description: 'JSON 샘플에서 TypeScript 인터페이스 생성',
  icon: TypeIcon,
  keywords: [
    'typescript',
    'ts',
    'type',
    '타입',
    'interface',
    '인터페이스',
    'json',
    'codegen',
  ],
  category: '데이터',
  component: lazy(() => import('./TsTypesPage')),
}
