import { useMemo, useState } from 'react'
import { ToolHeader } from '@/components/ToolHeader'
import { CopyButton } from '@/components/CopyButton'
import { CaseIcon } from '@/components/icons'
import { CASE_LIST, convertCase } from './case'

export default function CasePage() {
  const [input, setInput] = useState('user name field')

  const results = useMemo(
    () => CASE_LIST.map((name) => ({ name, value: convertCase(input, name) })),
    [input],
  )

  return (
    <div className="space-y-5">
      <ToolHeader
        name="케이스 변환"
        description="식별자/문구를 모든 케이스로 한 번에. camelCase·snake·kebab·Pascal·Screaming 등 자동 토큰화."
        icon={CaseIcon}
      />

      <input
        className="field font-mono"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="예: hello world / helloWorld / hello-world / HELLO_WORLD"
        aria-label="입력"
      />

      <dl className="space-y-2">
        {results.map((r) => (
          <div
            key={r.name}
            className="flex flex-wrap items-center gap-2 rounded-lg border border-zinc-200 bg-white p-3 shadow-sm dark:border-zinc-800 dark:bg-zinc-900"
          >
            <dt className="w-44 shrink-0 font-mono text-xs font-semibold text-zinc-500 dark:text-zinc-400">
              {r.name}
            </dt>
            <dd className="flex-1 break-all font-mono text-sm">{r.value || '—'}</dd>
            <CopyButton text={r.value} className="btn !px-2 !py-1 text-xs" />
          </div>
        ))}
      </dl>
    </div>
  )
}
