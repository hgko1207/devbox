import { useCallback, useState } from 'react'
import { ToolHeader } from '@/components/ToolHeader'
import { CodeArea } from '@/components/CodeArea'
import { CopyButton } from '@/components/CopyButton'
import { HashIcon } from '@/components/icons'

function genUuids(count: number, uppercase: boolean): string[] {
  const out: string[] = []
  for (let i = 0; i < count; i++) {
    const id = crypto.randomUUID()
    out.push(uppercase ? id.toUpperCase() : id)
  }
  return out
}

export default function UuidPage() {
  const [count, setCount] = useState(5)
  const [uppercase, setUppercase] = useState(false)
  const [uuids, setUuids] = useState<string[]>(() => genUuids(5, false))

  const generate = useCallback(() => {
    const n = Math.min(100, Math.max(1, Math.floor(count) || 1))
    setUuids(genUuids(n, uppercase))
  }, [count, uppercase])

  const text = uuids.join('\n')

  return (
    <div className="space-y-5">
      <ToolHeader
        name="UUID 생성"
        description="UUID v4 를 생성합니다(crypto 기반 난수). 모든 처리는 브라우저에서만 이루어집니다."
        icon={HashIcon}
      />

      <div className="flex flex-wrap items-center gap-3">
        <label className="flex items-center gap-1.5 text-sm text-zinc-600 dark:text-zinc-400">
          개수
          <input
            type="number"
            min={1}
            max={100}
            value={count}
            onChange={(e) => setCount(Number(e.target.value))}
            className="field w-20"
            aria-label="생성 개수"
          />
        </label>
        <label className="flex items-center gap-1.5 text-sm text-zinc-600 dark:text-zinc-400">
          <input
            type="checkbox"
            checked={uppercase}
            onChange={(e) => setUppercase(e.target.checked)}
            className="h-4 w-4 rounded border-zinc-300 text-brand-600 focus-visible:ring-brand-500 dark:border-zinc-600"
          />
          대문자
        </label>
        <button type="button" className="btn btn-primary" onClick={generate}>
          생성
        </button>
        <CopyButton text={text} label="전체 복사" />
      </div>

      <div className="h-[40dvh] min-h-[200px]">
        <CodeArea value={text} ariaLabel="생성된 UUID 목록" readOnly />
      </div>
    </div>
  )
}
