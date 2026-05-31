import type { ComponentType } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useTitle } from '@/lib/useTitle'
import { getToolByPath } from '@/tools/registry'
import { FavoriteButton } from './FavoriteButton'

interface ToolHeaderProps {
  name: string
  description: string
  icon: ComponentType<{ className?: string }>
}

/** 모든 도구 페이지 공통 헤더 (브레드크럼 + 브랜드 아이콘 + 제목 + 즐겨찾기 + 설명). */
export function ToolHeader({ name, description, icon: Icon }: ToolHeaderProps) {
  useTitle(name)
  const location = useLocation()
  const tool = getToolByPath(location.pathname)

  return (
    <header>
      <div className="mb-1 text-xs text-zinc-500 dark:text-zinc-400">
        <Link to="/" className="hover:underline">
          홈
        </Link>{' '}
        / {name}
      </div>
      <div className="flex items-start justify-between gap-2">
        <h1 className="flex items-center gap-2 text-2xl font-bold tracking-tight">
          <span className="flex h-7 w-7 items-center justify-center rounded-md bg-brand-600 text-white">
            <Icon className="h-4 w-4" />
          </span>
          {name}
        </h1>
        {tool && <FavoriteButton toolId={tool.id} stopPropagation={false} className="mt-1" />}
      </div>
      <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">{description}</p>
    </header>
  )
}
