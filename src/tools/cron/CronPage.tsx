import { useMemo, useState } from 'react'
import { ToolHeader } from '@/components/ToolHeader'
import { CopyButton } from '@/components/CopyButton'
import { RepeatIcon } from '@/components/icons'
import { describeCron, nextRuns, parseCron } from './cron'

const EXAMPLES: { expr: string; label: string }[] = [
  { expr: '* * * * *', label: '매분' },
  { expr: '0 * * * *', label: '매시 정각' },
  { expr: '0 */2 * * *', label: '2시간마다' },
  { expr: '0 9 * * 1-5', label: '평일 9시' },
  { expr: '30 2 1 * *', label: '매월 1일 02:30' },
  { expr: '0 0 * * 0', label: '매주 일요일 0시' },
]

export default function CronPage() {
  const [expr, setExpr] = useState('0 */2 * * *')

  const result = useMemo(() => {
    try {
      const parts = parseCron(expr)
      return {
        ok: true as const,
        desc: describeCron(parts),
        next: nextRuns(parts, new Date(), 5),
      }
    } catch (e) {
      return { ok: false as const, err: e instanceof Error ? e.message : '오류' }
    }
  }, [expr])

  return (
    <div className="space-y-5">
      <ToolHeader
        name="Cron 표현식"
        description="cron 식을 한국어로 풀이하고 다음 실행 5건을 미리 봅니다. 5필드(분 시 일 월 요일)."
        icon={RepeatIcon}
      />

      <input
        className="field font-mono text-lg"
        value={expr}
        onChange={(e) => setExpr(e.target.value)}
        placeholder="예: 0 */2 * * *"
        aria-label="cron 표현식"
      />

      <div className="flex flex-wrap gap-1.5">
        {EXAMPLES.map((ex) => (
          <button
            key={ex.expr}
            type="button"
            onClick={() => setExpr(ex.expr)}
            className="rounded-full border border-zinc-300 px-2.5 py-1 text-xs text-zinc-700 transition-colors hover:bg-zinc-100 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800"
          >
            <span className="font-mono">{ex.expr}</span> · {ex.label}
          </button>
        ))}
      </div>

      {!result.ok && (
        <div
          role="alert"
          className="rounded-md border border-red-200 bg-red-50 p-2.5 text-sm text-red-700 dark:border-red-900 dark:bg-red-950/40 dark:text-red-300"
        >
          {result.err}
        </div>
      )}

      {result.ok && (
        <>
          <div className="rounded-lg border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
            <div className="text-xs font-semibold text-zinc-500 dark:text-zinc-400">한국어 풀이</div>
            <div className="mt-1 flex items-start gap-2">
              <p className="flex-1 text-sm">{result.desc}</p>
              <CopyButton text={result.desc} className="btn !px-2 !py-1 text-xs" />
            </div>
          </div>

          <div className="rounded-lg border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
            <div className="mb-2 text-xs font-semibold text-zinc-500 dark:text-zinc-400">
              다음 실행 5건 (현지 시각)
            </div>
            {result.next.length === 0 ? (
              <p className="text-sm text-zinc-500 dark:text-zinc-400">
                향후 2년 안에 실행 시점이 없습니다.
              </p>
            ) : (
              <ol className="space-y-1 font-mono text-sm">
                {result.next.map((d, i) => (
                  <li key={i} className="flex flex-wrap items-center gap-2">
                    <span className="w-6 text-xs text-zinc-400">#{i + 1}</span>
                    <span className="tabular-nums text-zinc-700 dark:text-zinc-200">
                      {d.toLocaleString('ko-KR')}
                    </span>
                    <span className="text-xs text-zinc-400">
                      ({['일', '월', '화', '수', '목', '금', '토'][d.getDay()]})
                    </span>
                  </li>
                ))}
              </ol>
            )}
          </div>
        </>
      )}
    </div>
  )
}
