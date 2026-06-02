import { useMemo, useState } from 'react'
import { ToolHeader } from '@/components/ToolHeader'
import { CopyButton } from '@/components/CopyButton'
import { ShieldIcon } from '@/components/icons'
import { formatBrn, generateBrn, validateBrn } from './brn'

export default function BrnPage() {
  const [input, setInput] = useState('')
  const [showSteps, setShowSteps] = useState(false)

  const result = useMemo(() => validateBrn(input), [input])
  const display = formatBrn(input)
  const empty = input.trim() === ''

  function handleChange(value: string) {
    setInput(formatBrn(value))
  }

  function loadSample() {
    setInput(formatBrn(generateBrn()))
  }

  return (
    <div className="space-y-6">
      <ToolHeader
        name="사업자등록번호"
        description="국세청 체크섬 알고리즘으로 검증합니다. 사업자 종류도 함께 표시. 모든 처리는 브라우저에서만."
        icon={ShieldIcon}
      />

      <section className="space-y-3">
        <div className="flex flex-wrap items-stretch gap-2">
          <input
            value={display}
            onChange={(e) => handleChange(e.target.value)}
            placeholder="123-45-67890"
            inputMode="numeric"
            spellCheck={false}
            aria-label="사업자등록번호 입력"
            className="field min-w-[200px] flex-1 font-mono text-lg tracking-wider"
          />
          <button type="button" onClick={loadSample} className="btn whitespace-nowrap">
            예제 생성
          </button>
          {!empty && (
            <button
              type="button"
              onClick={() => setInput('')}
              className="btn whitespace-nowrap"
              aria-label="입력 지우기"
            >
              지우기
            </button>
          )}
        </div>
        <p className="text-xs text-zinc-500 dark:text-zinc-400">
          하이픈은 자동으로 추가됩니다. 숫자 외 문자는 무시됩니다.
        </p>
      </section>

      {!empty && (
        <section>
          {result.ok ? (
            <ResultCard
              kind="ok"
              normalized={result.normalized!}
              businessType={result.businessType}
            />
          ) : (
            <ResultCard kind="bad" reason={result.reason!} />
          )}
        </section>
      )}

      {!empty && result.steps && (
        <section className="rounded-xl border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900">
          <button
            type="button"
            onClick={() => setShowSteps((v) => !v)}
            aria-expanded={showSteps}
            className="flex w-full items-center justify-between gap-2 p-4 text-left text-sm font-semibold text-zinc-700 dark:text-zinc-200"
          >
            <span>검증 과정 보기</span>
            <span aria-hidden="true" className="text-zinc-400">
              {showSteps ? '−' : '+'}
            </span>
          </button>
          {showSteps && (
            <div className="border-t border-zinc-200 p-4 dark:border-zinc-800">
              <p className="mb-3 text-xs text-zinc-500 dark:text-zinc-400">
                가중치 <code className="font-mono">[1,3,7,1,3,7,1,3,5]</code> 를 첫 9자리에 곱·합한
                뒤, 9번째 자리 × 5 의 10 나눈 몫을 더합니다. 그 합을 10으로 나눈 나머지를 10에서
                뺀 값(또는 0)이 검증 자리가 됩니다.
              </p>
              <div className="overflow-x-auto">
                <table className="min-w-full text-sm">
                  <thead>
                    <tr className="border-b border-zinc-200 text-left text-xs text-zinc-500 dark:border-zinc-800 dark:text-zinc-400">
                      <th className="py-2 pr-4 font-medium">자리</th>
                      <th className="py-2 pr-4 font-medium">숫자</th>
                      <th className="py-2 pr-4 font-medium">가중치</th>
                      <th className="py-2 pr-4 font-medium">곱</th>
                    </tr>
                  </thead>
                  <tbody className="font-mono">
                    {result.steps.map((s, i) => (
                      <tr
                        key={i}
                        className="border-b border-zinc-100 last:border-b-0 dark:border-zinc-800"
                      >
                        <td className="py-1.5 pr-4 text-zinc-500">{i + 1}</td>
                        <td className="py-1.5 pr-4">{s.digit}</td>
                        <td className="py-1.5 pr-4 text-zinc-500">×{s.weight}</td>
                        <td className="py-1.5 pr-4">{s.product}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <dl className="mt-4 space-y-1 text-sm">
                <SummaryRow label="가중치 곱 합" value={String(result.sum)} />
                <SummaryRow label="가산값 (9번째 × 5 ÷ 10)" value={String(result.extra)} />
                <SummaryRow label="총합" value={String((result.sum ?? 0) + (result.extra ?? 0))} />
                <SummaryRow
                  label="계산된 검증 자리"
                  value={String(result.computedCheck)}
                  emphasis
                />
                <SummaryRow label="입력된 검증 자리" value={String(result.actualCheck)} emphasis />
              </dl>
            </div>
          )}
        </section>
      )}
    </div>
  )
}

function ResultCard(
  props:
    | { kind: 'ok'; normalized: string; businessType?: string }
    | { kind: 'bad'; reason: string },
) {
  if (props.kind === 'ok') {
    return (
      <div className="rounded-xl border border-emerald-300 bg-emerald-50 p-4 dark:border-emerald-800 dark:bg-emerald-950/50">
        <div className="flex items-start justify-between gap-3">
          <div>
            <div className="flex items-center gap-2 text-emerald-700 dark:text-emerald-300">
              <span aria-hidden="true" className="text-lg">
                ✓
              </span>
              <span className="font-semibold">유효한 사업자등록번호</span>
            </div>
            {props.businessType && (
              <p className="mt-1 text-sm text-emerald-800 dark:text-emerald-200">
                사업자 종류: <strong>{props.businessType}</strong>
              </p>
            )}
            <code className="mt-2 block font-mono text-sm text-zinc-600 dark:text-zinc-400">
              {formatBrn(props.normalized)}
            </code>
          </div>
          <CopyButton text={formatBrn(props.normalized)} className="btn !px-2 !py-1 text-xs" />
        </div>
      </div>
    )
  }
  return (
    <div className="rounded-xl border border-red-300 bg-red-50 p-4 dark:border-red-800 dark:bg-red-950/50">
      <div className="flex items-center gap-2 text-red-700 dark:text-red-300">
        <span aria-hidden="true" className="text-lg">
          ✕
        </span>
        <span className="font-semibold">{props.reason}</span>
      </div>
    </div>
  )
}

function SummaryRow({
  label,
  value,
  emphasis,
}: {
  label: string
  value: string
  emphasis?: boolean
}) {
  return (
    <div className="flex items-baseline justify-between gap-3">
      <dt className="text-xs text-zinc-500 dark:text-zinc-400">{label}</dt>
      <dd
        className={`font-mono tabular-nums ${
          emphasis ? 'text-base font-bold' : 'text-sm text-zinc-700 dark:text-zinc-300'
        }`}
      >
        {value}
      </dd>
    </div>
  )
}
