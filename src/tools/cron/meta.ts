import { lazy } from 'react'
import type { ToolMeta } from '../types'
import { RepeatIcon } from '@/components/icons'

export const cronTool: ToolMeta = {
  id: 'cron',
  path: '/cron',
  name: 'Cron 표현식',
  description: 'cron 식 한국어 풀이 + 다음 실행 미리보기',
  icon: RepeatIcon,
  keywords: ['cron', '크론', '스케줄', 'schedule', '주기', '반복', 'crontab'],
  category: '생성 · 계산',
  component: lazy(() => import('./CronPage')),
}
