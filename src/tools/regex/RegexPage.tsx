import { useMemo, useState } from 'react'
import { ToolHeader } from '@/components/ToolHeader'
import { CodeArea } from '@/components/CodeArea'
import { RegexIcon } from '@/components/icons'
import { findMatches } from './regex'

const FLAG_LIST = ['g', 'i', 'm', 's', 'u'] as const
type Flag = (typeof FLAG_LIST)[number]

const FLAG_DESC: Record<Flag, string> = {
  g: '전역 (모든 매치)',
  i: '대소문자 무시',
  m: '여러 줄 (^/$를 줄 기준)',
  s: '닷-올 (. 이 줄바꿈 포함)',
  u: '유니코드',
}

export default function RegexPage() {
  const [pattern, setPattern] = useState('\\b\\w+@\\w+\\.\\w+\\b')
  const [flags, setFlags] = useState<Record<Flag, boolean>>({
    g: true,
    i: false,
    m: false,
    s: false,
    u: false,
  })
  const [text, setText] = useState('연락은 hello@devbox.io 또는 hi@example.com 으로.')

  const flagStr = FLAG_LIST.filter((f) => flags[f]).join('')

  const result = useMemo(() => {
    if (pattern === '') return { ok: true as const, matches: [] }
    try {
      return { ok: true as const, matches: findMatches(pattern, flagStr, text) }
    } catch (e) {
      return { ok: false as const, err: e instanceof Error ? e.message : '오류' }
    }
  }, [pattern, flagStr, text])

  const segments = useMemo(() => {
    if (!result.ok || result.matches.length === 0) return null
    const parts: { type: 'text' | 'match'; s: string }[] = []
    let cursor = 0
    for (const m of result.matches) {
      if (m.index > cursor) parts.push({ type: 'text', s: text.slice(cursor, m.index) })
      parts.push({ type: 'match', s: m.match })
      cursor = m.index + m.match.length
    }
    if (cursor < text.length) parts.push({ type: 'text', s: text.slice(cursor) })
    return parts
  }, [result, text])

  return (
    <div className="space-y-5">
      <ToolHeader
        name="정규식 테스터"
        description="자바스크립트 정규식을 테스트하고 매치를 한눈에 봅니다. 모든 처리는 브라우저에서만."
        icon={RegexIcon}
      />

      <div className="grid gap-3 md:grid-cols-[1fr_auto]">
        <div className="space-y-1">
          <label className="text-xs font-medium text-zinc-500 dark:text-zinc-400">패턴</label>
          <input
            className="field font-mono"
            value={pattern}
            onChange={(e) => setPattern(e.target.value)}
            placeholder="예: \\d+"
            aria-label="정규식 패턴"
          />
        </div>
        <div className="space-y-1">
          <span className="text-xs font-medium text-zinc-500 dark:text-zinc-400">플래그</span>
          <div className="flex flex-wrap items-center gap-1.5 pt-1">
            {FLAG_LIST.map((f) => (
              <label
                key={f}
                title={FLAG_DESC[f]}
                className={`flex cursor-pointer items-center gap-1 rounded border px-2 py-1 font-mono text-xs ${
                  flags[f]
                    ? 'border-brand-400 bg-brand-50 text-brand-700 dark:border-brand-600 dark:bg-brand-950/50 dark:text-brand-300'
                    : 'border-zinc-300 text-zinc-600 dark:border-zinc-700 dark:text-zinc-400'
                }`}
              >
                <input
                  type="checkbox"
                  checked={flags[f]}
                  onChange={(e) => setFlags((s) => ({ ...s, [f]: e.target.checked }))}
                  className="h-3.5 w-3.5"
                />
                {f}
              </label>
            ))}
          </div>
        </div>
      </div>

      <div className="space-y-1">
        <label className="text-xs font-medium text-zinc-500 dark:text-zinc-400">테스트 문자열</label>
        <div className="h-[28dvh] min-h-[140px]">
          <CodeArea value={text} onChange={setText} ariaLabel="테스트 문자열" />
        </div>
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
          <div className="rounded-lg border border-zinc-200 bg-white p-3 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
            <div className="mb-2 text-xs font-semibold text-zinc-500 dark:text-zinc-400">
              매치 {result.matches.length}개
            </div>
            {segments ? (
              <pre className="whitespace-pre-wrap break-all font-mono text-sm leading-relaxed">
                {segments.map((p, i) =>
                  p.type === 'match' ? (
                    <mark
                      key={i}
                      className="rounded bg-brand-200 px-0.5 text-zinc-900 dark:bg-brand-700 dark:text-white"
                    >
                      {p.s}
                    </mark>
                  ) : (
                    <span key={i}>{p.s}</span>
                  ),
                )}
              </pre>
            ) : (
              <p className="text-sm text-zinc-500 dark:text-zinc-400">매치가 없습니다.</p>
            )}
          </div>

          {result.matches.length > 0 && (
            <ul className="space-y-1.5">
              {result.matches.slice(0, 50).map((m, i) => (
                <li
                  key={i}
                  className="rounded border border-zinc-200 bg-white p-2 text-sm dark:border-zinc-800 dark:bg-zinc-900"
                >
                  <span className="mr-2 text-xs text-zinc-400">#{i + 1} @ {m.index}</span>
                  <code className="font-mono">{m.match}</code>
                  {m.groups.length > 0 && (
                    <span className="ml-2 text-xs text-zinc-500 dark:text-zinc-400">
                      그룹: [{m.groups.join(', ')}]
                    </span>
                  )}
                </li>
              ))}
              {result.matches.length > 50 && (
                <li className="text-xs text-zinc-500">처음 50개만 표시했습니다.</li>
              )}
            </ul>
          )}
        </>
      )}
    </div>
  )
}
