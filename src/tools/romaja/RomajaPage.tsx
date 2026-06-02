import { useMemo, useState } from 'react'
import { ToolHeader } from '@/components/ToolHeader'
import { CopyButton } from '@/components/CopyButton'
import { TypeIcon } from '@/components/icons'
import { romanize, romanizeName, type NameOptions } from './romaja'

type Mode = 'standard' | 'literal' | 'name'

export default function RomajaPage() {
  const [mode, setMode] = useState<Mode>('standard')
  const [input, setInput] = useState('')
  const [nameOpts, setNameOpts] = useState<NameOptions>({
    surname: 'custom',
    given: 'joined',
  })

  const output = useMemo(() => {
    if (input.trim() === '') return ''
    if (mode === 'standard') return romanize(input, { assimilate: true })
    if (mode === 'literal') return romanize(input, { assimilate: false })
    return romanizeName(input, nameOpts)
  }, [input, mode, nameOpts])

  return (
    <div className="space-y-5">
      <ToolHeader
        name="로마자 변환"
        description="국립국어원 로마자 표기법(2000) 기반 + 인명용 관용 표기 (Lee·Park·Kim). 모든 처리는 브라우저에서만."
        icon={TypeIcon}
      />

      {/* 모드 탭 */}
      <div className="inline-flex rounded-lg border border-zinc-200 bg-zinc-50 p-1 dark:border-zinc-800 dark:bg-zinc-900">
        <ModeTab active={mode === 'standard'} onClick={() => setMode('standard')}>
          일반
        </ModeTab>
        <ModeTab active={mode === 'literal'} onClick={() => setMode('literal')}>
          단순 표기
        </ModeTab>
        <ModeTab active={mode === 'name'} onClick={() => setMode('name')}>
          인명
        </ModeTab>
      </div>

      {/* 인명 모드 옵션 */}
      {mode === 'name' && (
        <div className="flex flex-wrap gap-4 rounded-lg border border-zinc-200 bg-white p-3 text-sm dark:border-zinc-800 dark:bg-zinc-900">
          <fieldset className="flex items-center gap-3">
            <legend className="text-xs font-semibold text-zinc-500 dark:text-zinc-400">
              성씨
            </legend>
            <RadioBtn
              label="관용 (Lee·Park·Kim)"
              checked={nameOpts.surname === 'custom'}
              onChange={() => setNameOpts((o) => ({ ...o, surname: 'custom' }))}
            />
            <RadioBtn
              label="표준 (Yi·Bak·Gim)"
              checked={nameOpts.surname === 'standard'}
              onChange={() => setNameOpts((o) => ({ ...o, surname: 'standard' }))}
            />
          </fieldset>
          <fieldset className="flex items-center gap-3">
            <legend className="text-xs font-semibold text-zinc-500 dark:text-zinc-400">
              이름
            </legend>
            <RadioBtn
              label="붙여쓰기 (Gildong)"
              checked={nameOpts.given === 'joined'}
              onChange={() => setNameOpts((o) => ({ ...o, given: 'joined' }))}
            />
            <RadioBtn
              label="하이픈 (Gil-Dong)"
              checked={nameOpts.given === 'hyphen'}
              onChange={() => setNameOpts((o) => ({ ...o, given: 'hyphen' }))}
            />
          </fieldset>
        </div>
      )}

      {/* 입출력 */}
      <div className="grid gap-3 md:grid-cols-2">
        <div>
          <label
            htmlFor="ko-input"
            className="mb-1.5 block text-xs font-semibold text-zinc-500 dark:text-zinc-400"
          >
            한글 입력
          </label>
          <textarea
            id="ko-input"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={
              mode === 'name' ? '홍길동' : '안녕하세요 — 한국어를 로마자로 변환합니다.'
            }
            rows={6}
            spellCheck={false}
            className="field w-full resize-y font-mono"
          />
        </div>
        <div>
          <div className="mb-1.5 flex items-center justify-between">
            <span className="text-xs font-semibold text-zinc-500 dark:text-zinc-400">
              로마자 결과
            </span>
            {output && <CopyButton text={output} className="btn !px-2 !py-1 text-xs" />}
          </div>
          <textarea
            value={output}
            readOnly
            rows={6}
            placeholder="결과가 여기에 표시됩니다."
            className="field w-full resize-y bg-zinc-50 font-mono dark:bg-zinc-950"
          />
        </div>
      </div>

      <p className="text-xs text-zinc-500 dark:text-zinc-400">
        주의: 일부 음운 변화 (ㅎ 격음화, 구개음화, 경음화 등)는 적용되지 않습니다. 정확한 공식
        표기는 국립국어원 가이드를 참고하세요.
      </p>
    </div>
  )
}

function ModeTab({
  active,
  onClick,
  children,
}: {
  active: boolean
  onClick: () => void
  children: React.ReactNode
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
        active
          ? 'bg-brand-600 text-white shadow-sm'
          : 'text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100'
      }`}
    >
      {children}
    </button>
  )
}

function RadioBtn({
  label,
  checked,
  onChange,
}: {
  label: string
  checked: boolean
  onChange: () => void
}) {
  return (
    <label className="flex cursor-pointer items-center gap-1.5 text-xs">
      <input
        type="radio"
        checked={checked}
        onChange={onChange}
        className="h-3.5 w-3.5 accent-brand-600"
      />
      <span className={checked ? 'font-medium text-zinc-900 dark:text-zinc-100' : ''}>
        {label}
      </span>
    </label>
  )
}
