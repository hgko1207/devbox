import { summarize, type DiffEntry, type DiffType } from '../lib/diff'

// 한 번에 표시할 최대 변경 수 (대용량 diff 렌더링 폭주 방지)
const MAX_ROWS = 500

const typeMeta: Record<DiffType, { label: string; badge: string; bar: string }> = {
  added: {
    label: '추가',
    badge:
      'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300',
    bar: 'border-l-emerald-400',
  },
  removed: {
    label: '삭제',
    badge: 'bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300',
    bar: 'border-l-red-400',
  },
  changed: {
    label: '변경',
    badge: 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300',
    bar: 'border-l-amber-400',
  },
}

function preview(value: unknown): string {
  let s: string
  try {
    s = JSON.stringify(value)
  } catch {
    s = String(value)
  }
  if (s === undefined) s = 'undefined'
  return s.length > 200 ? s.slice(0, 200) + '…' : s
}

function Value({ value, tone }: { value: unknown; tone: 'old' | 'new' }) {
  return (
    <code
      className={`break-all rounded px-1 py-0.5 text-xs ${
        tone === 'old'
          ? 'bg-red-50 text-red-700 line-through decoration-red-300 dark:bg-red-950/50 dark:text-red-300'
          : 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300'
      }`}
    >
      {preview(value)}
    </code>
  )
}

export function DiffView({ entries }: { entries: DiffEntry[] }) {
  if (entries.length === 0) {
    return (
      <div className="rounded-md border border-emerald-200 bg-emerald-50 p-4 text-center text-sm font-medium text-emerald-700 dark:border-emerald-900 dark:bg-emerald-950/40 dark:text-emerald-300">
        두 JSON 이 완전히 동일합니다.
      </div>
    )
  }

  const summary = summarize(entries)
  const shown = entries.slice(0, MAX_ROWS)

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-2 text-xs font-medium">
        <span className={`rounded px-2 py-1 ${typeMeta.added.badge}`}>추가 {summary.added}</span>
        <span className={`rounded px-2 py-1 ${typeMeta.removed.badge}`}>삭제 {summary.removed}</span>
        <span className={`rounded px-2 py-1 ${typeMeta.changed.badge}`}>변경 {summary.changed}</span>
      </div>

      <ul className="space-y-1.5">
        {shown.map((entry, i) => {
          const meta = typeMeta[entry.type]
          return (
            <li
              key={`${entry.path}-${i}`}
              className={`rounded-md border border-zinc-200 border-l-4 bg-white p-2.5 dark:border-zinc-800 dark:bg-zinc-900 ${meta.bar}`}
            >
              <div className="flex flex-wrap items-center gap-2">
                <span className={`rounded px-1.5 py-0.5 text-xs font-semibold ${meta.badge}`}>
                  {meta.label}
                </span>
                <code className="break-all font-mono text-sm text-zinc-800 dark:text-zinc-200">
                  {entry.path}
                </code>
              </div>
              <div className="mt-1.5 flex flex-wrap items-center gap-2 pl-1">
                {entry.type === 'changed' && (
                  <>
                    <Value value={entry.left} tone="old" />
                    <span className="text-zinc-400">→</span>
                    <Value value={entry.right} tone="new" />
                  </>
                )}
                {entry.type === 'added' && <Value value={entry.right} tone="new" />}
                {entry.type === 'removed' && <Value value={entry.left} tone="old" />}
              </div>
            </li>
          )
        })}
      </ul>

      {entries.length > MAX_ROWS && (
        <p className="text-center text-xs text-zinc-500 dark:text-zinc-400">
          변경 사항이 많아 처음 {MAX_ROWS.toLocaleString()}개만 표시했습니다. (총{' '}
          {entries.length.toLocaleString()}개)
        </p>
      )}
    </div>
  )
}
