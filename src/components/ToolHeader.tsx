import type { ComponentType } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useTitle } from '@/lib/useTitle'
import { getToolByPath } from '@/tools/registry'
import { FavoriteButton } from './FavoriteButton'
import { ChevronRightIcon } from './icons'

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
      <nav
        aria-label="브레드크럼"
        className="mb-4 flex items-center gap-1.5 text-xs text-zinc-500 dark:text-zinc-400"
      >
        <Link
          to="/"
          className="rounded transition-colors hover:text-zinc-900 dark:hover:text-zinc-100"
        >
          홈
        </Link>
        <ChevronRightIcon className="h-3 w-3 text-zinc-400 dark:text-zinc-600" />
        <span className="text-zinc-700 dark:text-zinc-300">{name}</span>
      </nav>

      <div className="flex items-center gap-3">
        <h1 className="flex items-center gap-2.5 text-2xl font-bold tracking-tight">
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-600 text-white shadow-sm">
            <Icon className="h-5 w-5" />
          </span>
          {name}
        </h1>
        {tool && <FavoriteButton toolId={tool.id} stopPropagation={false} />}
      </div>
      <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">{description}</p>
    </header>
  )
}
