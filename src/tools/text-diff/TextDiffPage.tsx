import { useMemo, useState } from 'react'
import { ToolHeader } from '@/components/ToolHeader'
import { CodeArea } from '@/components/CodeArea'
import { DiffIcon, TrashIcon } from '@/components/icons'
import { lineDiff, statsOf } from './text-diff'

const LEFT_SAMPLE = `이름: 홍길동
나이: 25
역할: 개발자`

const RIGHT_SAMPLE = `이름: 홍길동
나이: 26
역할: 시니어 개발자
부서: 백엔드`

export default function TextDiffPage() {
  const [left, setLeft] = useState('')
  const [right, setRight] = useState('')

  const parts = useMemo(() => lineDiff(left, right), [left, right])
  const stats = useMemo(() => statsOf(parts), [parts])
  const hasInput = left !== '' || right !== ''

  return (
    <div className="space-y-5">
      <ToolHeader
        name="텍스트 Diff"
        description="두 텍스트의 줄 단위 차이를 비교합니다. 추가·삭제·유지를 색으로 표시. 모든 처리는 브라우저에서만."
        icon={DiffIcon}
      />

      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          className="btn"
          onClick={() => {
            setLeft(LEFT_SAMPLE)
            setRight(RIGHT_SAMPLE)
          }}
        >
          예제
        </button>
        <button
          type="button"
          className="btn"
          onClick={() => {
            const a = left
            setLeft(right)
            setRight(a)
          }}
          disabled={!hasInput}
        >
          좌↔우 교체
        </button>
        <button
          type="button"
          className="btn"
          onClick={() => {
            setLeft('')
            setRight('')
          }}
          disabled={!hasInput}
        >
          <TrashIcon className="h-4 w-4" />
          지우기
        </button>
      </div>

      <div className="grid gap-3 md:grid-cols-2">
        <div className="space-y-1">
          <span className="text-xs font-medium text-zinc-500 dark:text-zinc-400">
            왼쪽 (변경 전)
          </span>
          <div className="h-[32dvh] min-h-[180px]">
            <CodeArea
              value={left}
              onChange={setLeft}
              ariaLabel="왼쪽 텍스트"
              placeholder="변경 전 텍스트"
            />
          </div>
        </div>
        <div className="space-y-1">
          <span className="text-xs font-medium text-zinc-500 dark:text-zinc-400">
            오른쪽 (변경 후)
          </span>
          <div className="h-[32dvh] min-h-[180px]">
            <CodeArea
              value={right}
              onChange={setRight}
              ariaLabel="오른쪽 텍스트"
              placeholder="변경 후 텍스트"
            />
          </div>
        </div>
      </div>

      {hasInput && (
        <>
          <div className="flex flex-wrap gap-2 text-xs font-medium">
            <span className="rounded bg-emerald-100 px-2 py-1 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300">
              + 추가 {stats.added}
            </span>
            <span className="rounded bg-red-100 px-2 py-1 text-red-700 dark:bg-red-950 dark:text-red-300">
              − 삭제 {stats.removed}
            </span>
            <span className="rounded bg-zinc-100 px-2 py-1 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300">
              유지 {stats.unchanged}
            </span>
          </div>

          <pre className="overflow-x-auto rounded-lg border border-zinc-200 bg-white p-3 font-mono text-sm leading-relaxed shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
            {parts.map((p, i) => {
              const lines = p.value.split('\n')
              return lines.map((line, j) => {
                if (j === lines.length - 1 && line === '') return null
                const sign = p.added ? '+' : p.removed ? '−' : ' '
                const cls = p.added
                  ? 'bg-emerald-50 text-emerald-900 dark:bg-emerald-950/40 dark:text-emerald-200'
                  : p.removed
                    ? 'bg-red-50 text-red-900 dark:bg-red-950/40 dark:text-red-200'
                    : 'text-zinc-700 dark:text-zinc-300'
                return (
                  <div key={`${i}-${j}`} className={`flex ${cls}`}>
                    <span className="w-4 select-none text-zinc-400">{sign}</span>
                    <span className="whitespace-pre">{line || ' '}</span>
                  </div>
                )
              })
            })}
          </pre>
        </>
      )}
    </div>
  )
}
