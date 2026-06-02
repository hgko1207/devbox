import { useEffect, useMemo } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import type { ToolMeta } from '@/tools/types'
import { tools } from '@/tools/registry'
import { useSidebar } from '@/lib/sidebar'
import { useFavorites } from '@/lib/useFavorites'
import { StarFilledIcon, XIcon } from './icons'

const CATEGORY_ORDER = ['데이터', '인코딩 · 디코딩', '생성 · 계산', '유틸리티']

function group(list: ToolMeta[]): [string, ToolMeta[]][] {
  const map = new Map<string, ToolMeta[]>()
  for (const t of list) {
    const cat = t.category ?? '기타'
    if (!map.has(cat)) map.set(cat, [])
    map.get(cat)!.push(t)
  }
  const ordered: [string, ToolMeta[]][] = []
  for (const cat of CATEGORY_ORDER) {
    const g = map.get(cat)
    if (g) {
      ordered.push([cat, g])
      map.delete(cat)
    }
  }
  for (const [cat, g] of map) ordered.push([cat, g])
  return ordered
}

export function Sidebar() {
  const { mobileOpen, setMobileOpen } = useSidebar()
  const { favorites } = useFavorites()
  const location = useLocation()

  // 라우트 변경 시 모바일 드로어 자동 닫힘
  useEffect(() => {
    setMobileOpen(false)
  }, [location.pathname, setMobileOpen])

  const groups = useMemo(() => group(tools), [])
  const favoriteTools = useMemo(
    () =>
      favorites
        .map((id) => tools.find((t) => t.id === id))
        .filter((t): t is ToolMeta => Boolean(t)),
    [favorites],
  )

  return (
    <>
      {/* 모바일 백드롭 */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-30 bg-zinc-900/50 md:hidden"
          onClick={() => setMobileOpen(false)}
          aria-hidden="true"
        />
      )}

      <aside
        aria-label="도구 목록"
        className={`
          fixed inset-y-0 left-0 z-40 flex w-56 flex-col border-r border-zinc-200 bg-zinc-50/95
          backdrop-blur transition-transform duration-200
          md:sticky md:top-14 md:inset-y-auto md:h-[calc(100vh-3.5rem)] md:translate-x-0
          ${mobileOpen ? 'translate-x-0' : '-translate-x-full'}
          dark:border-zinc-800 dark:bg-zinc-950/95
        `}
      >
        {/* 모바일 상단 닫기 바 */}
        <div className="flex h-12 items-center justify-end border-b border-zinc-200 px-2 md:hidden dark:border-zinc-800">
          <button
            type="button"
            onClick={() => setMobileOpen(false)}
            className="btn h-8 w-8 !px-0"
            aria-label="사이드바 닫기"
          >
            <XIcon className="h-4 w-4" />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto p-2">
          {favoriteTools.length > 0 && (
            <Section
              title="즐겨찾기"
              titleIcon={<StarFilledIcon className="h-3 w-3 text-amber-500" />}
            >
              {favoriteTools.map((t) => (
                <ToolRow key={`fav-${t.id}`} tool={t} />
              ))}
            </Section>
          )}

          {groups.map(([cat, list]) => (
            <Section key={cat} title={cat}>
              {list.map((t) => (
                <ToolRow key={t.id} tool={t} />
              ))}
            </Section>
          ))}
        </nav>
      </aside>
    </>
  )
}

function Section({
  title,
  titleIcon,
  children,
}: {
  title: string
  titleIcon?: React.ReactNode
  children: React.ReactNode
}) {
  return (
    <div className="mb-3">
      <div className="mb-1 flex items-center gap-1.5 px-2 text-[10px] font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
        {titleIcon}
        {title}
      </div>
      <div className="space-y-0.5">{children}</div>
    </div>
  )
}

function ToolRow({ tool }: { tool: ToolMeta }) {
  const Icon = tool.icon
  return (
    <NavLink
      to={tool.path}
      end
      className={({ isActive }) =>
        `flex items-center gap-2 rounded-md px-2 py-1.5 text-sm transition-colors ${
          isActive
            ? 'bg-brand-100 text-brand-700 dark:bg-brand-950/60 dark:text-brand-200'
            : 'text-zinc-700 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-800'
        }`
      }
    >
      <Icon className="h-4 w-4 shrink-0" />
      <span className="truncate">{tool.name}</span>
    </NavLink>
  )
}
