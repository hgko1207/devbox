import { useCallback, useMemo, useState } from 'react'
import { CodeArea } from './CodeArea'
import { CopyButton } from './CopyButton'
import { TrashIcon } from './icons'

type Mode = 'encode' | 'decode'

interface EncodeDecodeToolProps {
  toolName: string
  /** 입력과 모드를 받아 변환 결과를 반환. 오류는 throw (한국어 메시지 권장) */
  transform: (input: string, mode: Mode) => string
  encodeLabel?: string
  decodeLabel?: string
  inputPlaceholder?: string
  example?: string
  /** 툴바에 표시할 추가 옵션 (예: URL-safe 체크박스) */
  extraControls?: React.ReactNode
}

/** 양방향 텍스트 변환 도구(Base64·URL 등)를 위한 공유 셸. */
export function EncodeDecodeTool({
  toolName,
  transform,
  encodeLabel = '인코드',
  decodeLabel = '디코드',
  inputPlaceholder,
  example,
  extraControls,
}: EncodeDecodeToolProps) {
  const [mode, setMode] = useState<Mode>('encode')
  const [input, setInput] = useState('')

  const result = useMemo<{ ok: true; out: string } | { ok: false; err: string }>(() => {
    if (input === '') return { ok: true, out: '' }
    try {
      return { ok: true, out: transform(input, mode) }
    } catch (e) {
      return { ok: false, err: e instanceof Error ? e.message : '변환에 실패했습니다.' }
    }
  }, [input, mode, transform])

  const out = result.ok ? result.out : ''

  const onSwap = useCallback(() => {
    if (out === '') return
    setInput(out)
    setMode((m) => (m === 'encode' ? 'decode' : 'encode'))
  }, [out])

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center gap-2">
        <div className="inline-flex rounded-lg border border-zinc-200 bg-white p-1 dark:border-zinc-800 dark:bg-zinc-900">
          {([
            ['encode', encodeLabel],
            ['decode', decodeLabel],
          ] as const).map(([m, label]) => (
            <button
              key={m}
              type="button"
              onClick={() => setMode(m)}
              aria-pressed={mode === m}
              className={`rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
                mode === m
                  ? 'bg-brand-600 text-white'
                  : 'text-zinc-600 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-800'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
        {extraControls}
        <div className="flex-1" />
        <CopyButton text={out} />
        <button type="button" className="btn" onClick={onSwap} disabled={out === ''}>
          입력↔출력
        </button>
        <button type="button" className="btn" onClick={() => setInput('')} disabled={input === ''}>
          <TrashIcon className="h-4 w-4" />
          지우기
        </button>
        {example && (
          <button
            type="button"
            className="btn"
            onClick={() => {
              setMode('encode')
              setInput(example)
            }}
          >
            예제
          </button>
        )}
      </div>

      <div className="grid gap-3 md:grid-cols-2">
        <div className="space-y-1">
          <span className="text-xs font-medium text-zinc-500 dark:text-zinc-400">입력</span>
          <div className="h-[34dvh] min-h-[180px]">
            <CodeArea
              value={input}
              onChange={setInput}
              ariaLabel={`${toolName} 입력`}
              placeholder={inputPlaceholder}
            />
          </div>
        </div>
        <div className="space-y-1">
          <span className="text-xs font-medium text-zinc-500 dark:text-zinc-400">출력</span>
          <div className="h-[34dvh] min-h-[180px]">
            <CodeArea
              value={out}
              ariaLabel={`${toolName} 출력`}
              readOnly
              placeholder="결과가 여기에 표시됩니다"
            />
          </div>
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
    </div>
  )
}
