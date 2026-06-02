import { useMemo, useState } from 'react'
import { ToolHeader } from '@/components/ToolHeader'
import { CodeArea } from '@/components/CodeArea'
import { CopyButton } from '@/components/CopyButton'
import { TrashIcon, TypeIcon } from '@/components/icons'
import { jsonToTsTypes } from './ts-types'

const SAMPLE = `{
  "user": {
    "id": 1,
    "name": "홍길동",
    "tags": ["dev", "ko"],
    "address": null
  },
  "active": true,
  "score": 98.5
}`

export default function TsTypesPage() {
  const [input, setInput] = useState('')
  const [rootName, setRootName] = useState('Root')

  const result = useMemo(() => {
    if (input.trim() === '') return null
    try {
      return { ok: true as const, code: jsonToTsTypes(input, { rootName }) }
    } catch (e) {
      return { ok: false as const, err: e instanceof Error ? e.message : '변환에 실패했습니다.' }
    }
  }, [input, rootName])

  return (
    <div className="space-y-5">
      <ToolHeader
        name="JSON → TS 타입"
        description="샘플 JSON 을 붙여넣으면 TypeScript 인터페이스를 즉시 생성합니다. 중첩 객체는 별도 인터페이스로, 혼합 배열은 union 으로."
        icon={TypeIcon}
      />

      <div className="flex flex-wrap items-end gap-3">
        <label className="text-sm">
          <div className="mb-1 text-xs text-zinc-500 dark:text-zinc-400">루트 이름</div>
          <input
            className="field max-w-[180px] font-mono"
            value={rootName}
            onChange={(e) => setRootName(e.target.value)}
            placeholder="Root"
            aria-label="루트 인터페이스 이름"
          />
        </label>
        <button type="button" className="btn" onClick={() => setInput(SAMPLE)}>
          예제
        </button>
        <button
          type="button"
          className="btn"
          onClick={() => setInput('')}
          disabled={input === ''}
        >
          <TrashIcon className="h-4 w-4" />
          지우기
        </button>
        <div className="flex-1" />
        <CopyButton text={result?.ok ? result.code : ''} label="TS 복사" />
      </div>

      <div className="grid gap-3 md:grid-cols-2">
        <div className="space-y-1">
          <span className="text-xs font-medium text-zinc-500 dark:text-zinc-400">JSON 입력</span>
          <div className="h-[50dvh] min-h-[260px]">
            <CodeArea
              value={input}
              onChange={setInput}
              ariaLabel="JSON 입력"
              placeholder="여기에 JSON 샘플을 붙여넣으세요"
            />
          </div>
        </div>
        <div className="space-y-1">
          <span className="text-xs font-medium text-zinc-500 dark:text-zinc-400">
            TypeScript 출력
          </span>
          <div className="h-[50dvh] min-h-[260px]">
            <CodeArea
              value={result?.ok ? result.code : ''}
              ariaLabel="TypeScript 출력"
              readOnly
              placeholder="// 결과가 여기에 표시됩니다"
            />
          </div>
        </div>
      </div>

      {result?.ok === false && (
        <div
          role="alert"
          className="rounded-md border border-red-200 bg-red-50 p-2.5 text-sm text-red-700 dark:border-red-900 dark:bg-red-950/40 dark:text-red-300"
        >
          {result.err}
        </div>
      )}
    </div>
  )
}
