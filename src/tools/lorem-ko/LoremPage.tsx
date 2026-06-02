import { useCallback, useEffect, useState } from 'react'
import { ToolHeader } from '@/components/ToolHeader'
import { CopyButton } from '@/components/CopyButton'
import { ParagraphIcon, RepeatIcon } from '@/components/icons'
import { generate, type Unit } from './lorem'

const UNIT_LABELS: Record<Unit, string> = {
  paragraph: '단락',
  sentence: '문장',
  word: '단어',
}

export default function LoremPage() {
  const [unit, setUnit] = useState<Unit>('paragraph')
  const [count, setCount] = useState(3)
  const [output, setOutput] = useState('')

  const regenerate = useCallback(() => {
    setOutput(generate({ unit, count }))
  }, [unit, count])

  // 옵션 변경 시 자동 재생성
  useEffect(() => {
    regenerate()
  }, [regenerate])

  const stats = stat(output)

  return (
    <div className="space-y-5">
      <ToolHeader
        name="Lorem 한국어"
        description="자연스러운 한국어 더미 텍스트. 한국어 환경의 줄바꿈·자간·가독성 미리보기에 사용하세요."
        icon={ParagraphIcon}
      />

      {/* 옵션 */}
      <div className="flex flex-wrap items-center gap-3 rounded-lg border border-zinc-200 bg-white p-3 dark:border-zinc-800 dark:bg-zinc-900">
        <div className="inline-flex rounded-md border border-zinc-200 bg-zinc-50 p-0.5 dark:border-zinc-700 dark:bg-zinc-950">
          {(['paragraph', 'sentence', 'word'] as Unit[]).map((u) => (
            <button
              key={u}
              type="button"
              onClick={() => setUnit(u)}
              aria-pressed={unit === u}
              className={`rounded px-3 py-1 text-sm transition-colors ${
                unit === u
                  ? 'bg-white font-semibold text-zinc-900 shadow-sm dark:bg-zinc-800 dark:text-zinc-100'
                  : 'text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100'
              }`}
            >
              {UNIT_LABELS[u]}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2 text-sm">
          <label htmlFor="lorem-count" className="text-zinc-600 dark:text-zinc-400">
            개수
          </label>
          <input
            id="lorem-count"
            type="number"
            min={1}
            max={100}
            value={count}
            onChange={(e) => setCount(Math.max(1, Math.min(100, Number(e.target.value) || 1)))}
            className="field h-9 w-20 text-center tabular-nums"
          />
        </div>

        <button
          type="button"
          onClick={regenerate}
          className="btn ml-auto inline-flex items-center gap-1.5"
          title="새 텍스트 생성"
        >
          <RepeatIcon className="h-4 w-4" />
          다시 생성
        </button>
        {output && <CopyButton text={output} className="btn !px-2 !py-1 text-xs" />}
      </div>

      {/* 출력 */}
      <textarea
        value={output}
        readOnly
        rows={14}
        spellCheck={false}
        aria-label="생성된 한국어 더미 텍스트"
        className="field w-full resize-y leading-relaxed"
      />

      {/* 통계 */}
      <div className="flex flex-wrap gap-4 text-xs text-zinc-500 dark:text-zinc-400">
        <Stat label="문자" value={stats.chars} />
        <Stat label="문자 (공백 제외)" value={stats.charsNoSpace} />
        <Stat label="어절" value={stats.words} />
        <Stat label="문장" value={stats.sentences} />
      </div>
    </div>
  )
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <span>
      <strong className="font-mono tabular-nums text-zinc-700 dark:text-zinc-200">
        {value.toLocaleString()}
      </strong>{' '}
      {label}
    </span>
  )
}

function stat(text: string) {
  const chars = text.length
  const charsNoSpace = text.replace(/\s/g, '').length
  const words = text.split(/\s+/).filter(Boolean).length
  const sentences = (text.match(/[.!?]/g) ?? []).length
  return { chars, charsNoSpace, words, sentences }
}
