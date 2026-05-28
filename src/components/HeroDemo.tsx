import { Link } from 'react-router-dom'
import { validateJson } from '@/tools/json/lib/parser'

// 흔한 실수(끝에 trailing comma)를 일부러 둔 샘플. 실제 파서가 줄·열을 짚어준다.
const SAMPLE = `{
  "name": "devbox",
  "tags": ["json", "format"],
  "tools": 6,
}`

export function HeroDemo() {
  const result = validateJson(SAMPLE)
  const error = result.status === 'invalid' ? result.error : null
  const lines = SAMPLE.split('\n')

  return (
    <div className="mx-auto mt-6 max-w-2xl overflow-hidden rounded-xl border border-zinc-200 bg-white text-left shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
      <div className="grid gap-0 md:grid-cols-[1fr_auto]">
        {/* 잘못된 JSON */}
        <pre
          aria-label="잘못된 JSON 예시"
          className="m-0 overflow-x-auto bg-zinc-50 p-3 font-mono text-[13px] leading-relaxed dark:bg-zinc-950"
        >
          {lines.map((ln, i) => {
            const lineNo = i + 1
            const isErr = lineNo === error?.line
            return (
              <div
                key={i}
                className={`flex gap-3 rounded ${
                  isErr ? 'bg-red-50 dark:bg-red-950/40' : ''
                }`}
              >
                <span className="w-6 select-none text-right text-zinc-400">{lineNo}</span>
                <span className="whitespace-pre">{ln || ' '}</span>
              </div>
            )
          })}
        </pre>

        {/* 한국어 에러 + CTA */}
        <div className="flex flex-col items-start justify-between gap-3 border-t border-zinc-200 p-4 md:max-w-[260px] md:border-l md:border-t-0 dark:border-zinc-800">
          {error && (
            <div className="space-y-1.5">
              <div className="inline-flex items-center gap-1.5 rounded-md bg-red-50 px-2 py-1 text-xs font-semibold text-red-700 dark:bg-red-950/50 dark:text-red-300">
                줄 {error.line}, 열 {error.column}
              </div>
              <p className="text-sm leading-snug text-zinc-700 dark:text-zinc-200">
                {error.message}
              </p>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">
                실제 파서가 짚어준 위치입니다.
              </p>
            </div>
          )}
          <Link to="/json" className="btn btn-primary text-sm">
            JSON 도구 열기
          </Link>
        </div>
      </div>
    </div>
  )
}
