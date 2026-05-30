import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import type { ToolMeta } from '@/tools/types'
import { tools } from '@/tools/registry'
import { ChevronRightIcon, ShieldIcon } from '@/components/icons'
import { HeroDemo } from '@/components/HeroDemo'
import { useTitle } from '@/lib/useTitle'

// 표시 순서. 미지정 카테고리는 뒤에 자동으로 붙는다.
const CATEGORY_ORDER = ['데이터', '인코딩 · 디코딩', '생성 · 계산', '유틸리티']

export default function Home() {
  useTitle()

  const groups = useMemo<[string, ToolMeta[]][]>(() => {
    const map = new Map<string, ToolMeta[]>()
    for (const t of tools) {
      const cat = t.category ?? '기타'
      if (!map.has(cat)) map.set(cat, [])
      map.get(cat)!.push(t)
    }
    const ordered: [string, ToolMeta[]][] = []
    for (const cat of CATEGORY_ORDER) {
      const list = map.get(cat)
      if (list) {
        ordered.push([cat, list])
        map.delete(cat)
      }
    }
    for (const [cat, list] of map) ordered.push([cat, list])
    return ordered
  }, [])

  return (
    <div className="space-y-10">
      {/* 히어로 */}
      <section className="pt-6 text-center sm:pt-10">
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
          개발자 도구, 한국어로 정확하게
        </h1>
        <p className="mx-auto mt-3 max-w-xl text-sm text-zinc-600 sm:text-base dark:text-zinc-400">
          자주 쓰는 개발자 도구를 한곳에서. 한국어 UI에 정확한 동작 — 모든 처리는 브라우저
          안에서만 이루어지고, 데이터는 서버로 전송되지 않습니다.
        </p>
        <div className="mt-4 inline-flex items-center gap-1.5 rounded-full border border-emerald-300 bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700 dark:border-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
          <ShieldIcon className="h-3.5 w-3.5" />
          100% 로컬 처리 · 추적·광고·회원가입 없음
        </div>
        <HeroDemo />
      </section>

      {/* 도구 — 카테고리별 그룹 */}
      <section className="space-y-8">
        {groups.map(([cat, list]) => (
          <div key={cat}>
            <h2 className="mb-3 text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
              {cat} <span className="text-zinc-400">· {list.length}</span>
            </h2>
            <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {list.map((tool) => {
                const Icon = tool.icon
                return (
                  <li key={tool.id}>
                    <Link
                      to={tool.path}
                      className="group flex h-full flex-col rounded-xl border border-zinc-200 bg-white p-5 transition-all hover:-translate-y-0.5 hover:border-brand-300 hover:shadow-md dark:border-zinc-800 dark:bg-zinc-900 dark:hover:border-brand-700"
                    >
                      <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-brand-50 text-brand-600 dark:bg-brand-950 dark:text-brand-400">
                        <Icon className="h-5 w-5" />
                      </div>
                      <h3 className="flex items-center gap-1 font-semibold">
                        {tool.name}
                        <ChevronRightIcon className="h-4 w-4 text-zinc-400 transition-transform group-hover:translate-x-0.5" />
                      </h3>
                      <p className="mt-1 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
                        {tool.description}
                      </p>
                    </Link>
                  </li>
                )
              })}
            </ul>
          </div>
        ))}
      </section>
    </div>
  )
}
