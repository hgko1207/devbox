import { useMemo, useState } from 'react'
import { ToolHeader } from '@/components/ToolHeader'
import { SwatchesIcon } from '@/components/icons'
import {
  CATEGORY_LABELS,
  CATEGORY_ORDER,
  palettes,
  type Palette,
  type PaletteCategory,
} from './data'

type Filter = 'all' | PaletteCategory

export default function PalettesPage() {
  const [filter, setFilter] = useState<Filter>('all')
  const [copied, setCopied] = useState<string | null>(null)

  const list = useMemo(
    () => (filter === 'all' ? palettes : palettes.filter((p) => p.category === filter)),
    [filter],
  )

  const grouped = useMemo(() => {
    const map = new Map<PaletteCategory, Palette[]>()
    for (const p of list) {
      if (!map.has(p.category)) map.set(p.category, [])
      map.get(p.category)!.push(p)
    }
    return CATEGORY_ORDER.filter((c) => map.has(c)).map((c) => [c, map.get(c)!] as const)
  }, [list])

  async function copy(hex: string) {
    try {
      await navigator.clipboard.writeText(hex)
      setCopied(hex)
      setTimeout(() => setCopied((current) => (current === hex ? null : current)), 1200)
    } catch {
      /* 클립보드 차단된 환경 — 무시 */
    }
  }

  return (
    <div className="space-y-6">
      <ToolHeader
        name="팔레트 영감"
        description="Pantone 올해의 색, 인기 개발 테마, 디자인 시스템, 한국 전통 — 손으로 큐레이션한 팔레트. 클릭으로 HEX 복사."
        icon={SwatchesIcon}
      />

      {/* 필터 */}
      <div className="flex flex-wrap gap-1.5" role="tablist" aria-label="카테고리 필터">
        <FilterChip
          label="전체"
          count={palettes.length}
          active={filter === 'all'}
          onClick={() => setFilter('all')}
        />
        {CATEGORY_ORDER.map((c) => (
          <FilterChip
            key={c}
            label={CATEGORY_LABELS[c]}
            count={palettes.filter((p) => p.category === c).length}
            active={filter === c}
            onClick={() => setFilter(c)}
          />
        ))}
      </div>

      {/* 그룹 */}
      <div className="space-y-10">
        {grouped.map(([cat, list]) => (
          <section key={cat}>
            <h2 className="mb-3 text-sm font-semibold text-zinc-700 dark:text-zinc-200">
              {CATEGORY_LABELS[cat]}
              <span className="ml-1.5 rounded-full bg-zinc-100 px-1.5 text-[11px] font-medium text-zinc-500 dark:bg-zinc-800 dark:text-zinc-400">
                {list.length}
              </span>
            </h2>
            <div className="grid gap-3 sm:grid-cols-2">
              {list.map((p) => (
                <PaletteCard key={p.id} palette={p} onCopy={copy} copiedHex={copied} />
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  )
}

function FilterChip({
  label,
  count,
  active,
  onClick,
}: {
  label: string
  count: number
  active: boolean
  onClick: () => void
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      role="tab"
      aria-selected={active}
      className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium transition-colors ${
        active
          ? 'border-brand-300 bg-brand-50 text-brand-700 dark:border-brand-700 dark:bg-brand-950 dark:text-brand-200'
          : 'border-zinc-200 bg-white text-zinc-600 hover:border-zinc-300 hover:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-400 dark:hover:border-zinc-700'
      }`}
    >
      {label}
      <span
        className={`text-[10px] font-normal ${
          active ? 'text-brand-500 dark:text-brand-400' : 'text-zinc-400 dark:text-zinc-500'
        }`}
      >
        {count}
      </span>
    </button>
  )
}

function PaletteCard({
  palette,
  onCopy,
  copiedHex,
}: {
  palette: Palette
  onCopy: (hex: string) => void
  copiedHex: string | null
}) {
  return (
    <article className="overflow-hidden rounded-lg border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900">
      {/* 상단 컬러 스트립 */}
      <div className="flex h-20" role="list" aria-label={`${palette.name} 컬러`}>
        {palette.colors.map((hex, i) => (
          <button
            key={`${palette.id}-${i}`}
            type="button"
            onClick={() => onCopy(hex)}
            role="listitem"
            aria-label={`${hex} 복사`}
            title={`${hex} ${copiedHex === hex ? '— 복사됨' : '— 클릭하여 복사'}`}
            className="group relative flex-1 transition-transform hover:scale-y-110 hover:z-10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-brand-500"
            style={{ backgroundColor: hex }}
          >
            <span className="pointer-events-none absolute inset-x-0 bottom-1.5 mx-auto block w-fit rounded bg-black/60 px-1.5 py-0.5 text-[10px] font-mono text-white opacity-0 transition-opacity group-hover:opacity-100">
              {copiedHex === hex ? '복사됨' : hex.toUpperCase()}
            </span>
          </button>
        ))}
      </div>

      {/* 본문 */}
      <div className="p-3">
        <div className="flex items-baseline justify-between gap-2">
          <h3 className="truncate text-sm font-semibold text-zinc-900 dark:text-zinc-100">
            {palette.name}
          </h3>
          {palette.source && (
            <span className="shrink-0 text-[11px] text-zinc-400 dark:text-zinc-500">
              {palette.source}
            </span>
          )}
        </div>
        {palette.note && (
          <p className="mt-1 text-xs leading-relaxed text-zinc-500 dark:text-zinc-400">
            {palette.note}
          </p>
        )}
      </div>
    </article>
  )
}
