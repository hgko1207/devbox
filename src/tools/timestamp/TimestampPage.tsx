import { useMemo, useState } from 'react'
import { ToolHeader } from '@/components/ToolHeader'
import { CopyButton } from '@/components/CopyButton'
import { ClockIcon } from '@/components/icons'
import { fromDate, fromEpoch } from './timestamp'

const errMsg = (e: unknown) => (e instanceof Error ? e.message : '변환에 실패했습니다.')

export default function TimestampPage() {
  const [epoch, setEpoch] = useState('')
  const [dateStr, setDateStr] = useState('')

  const epochResult = useMemo(() => {
    if (epoch.trim() === '') return null
    try {
      return { ok: true as const, info: fromEpoch(epoch) }
    } catch (e) {
      return { ok: false as const, err: errMsg(e) }
    }
  }, [epoch])

  const dateResult = useMemo(() => {
    if (dateStr.trim() === '') return null
    try {
      return { ok: true as const, ...fromDate(dateStr) }
    } catch (e) {
      return { ok: false as const, err: errMsg(e) }
    }
  }, [dateStr])

  return (
    <div className="space-y-5">
      <ToolHeader
        name="타임스탬프 변환"
        description="Unix 타임스탬프 ↔ 날짜. 초·밀리초 자동 감지, 로컬·UTC·ISO 표시. 모든 처리는 브라우저에서만."
        icon={ClockIcon}
      />

      <section className="space-y-3 rounded-lg border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
        <h2 className="text-sm font-semibold">Unix → 날짜</h2>
        <div className="flex flex-wrap gap-2">
          <input
            className="field max-w-xs"
            inputMode="numeric"
            value={epoch}
            onChange={(e) => setEpoch(e.target.value)}
            aria-label="Unix 타임스탬프"
            placeholder="예: 1516239022 (초) / ...000 (밀리초)"
          />
          <button type="button" className="btn" onClick={() => setEpoch(String(Math.floor(Date.now() / 1000)))}>
            지금
          </button>
        </div>
        {epochResult?.ok === false && <ErrorLine msg={epochResult.err} />}
        {epochResult?.ok && (
          <dl className="grid gap-1.5">
            <Row label="ISO 8601" value={epochResult.info.iso} />
            <Row label="UTC" value={epochResult.info.utc} />
            <Row label="로컬" value={epochResult.info.local} />
            <Row label="초 (s)" value={String(epochResult.info.unixSec)} />
            <Row label="밀리초 (ms)" value={String(epochResult.info.unixMs)} />
          </dl>
        )}
      </section>

      <section className="space-y-3 rounded-lg border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
        <h2 className="text-sm font-semibold">날짜 → Unix</h2>
        <input
          type="datetime-local"
          step="1"
          className="field max-w-xs"
          value={dateStr}
          onChange={(e) => setDateStr(e.target.value)}
          aria-label="날짜 선택"
        />
        {dateResult?.ok === false && <ErrorLine msg={dateResult.err} />}
        {dateResult?.ok && (
          <dl className="grid gap-1.5">
            <Row label="초 (s)" value={String(dateResult.unixSec)} />
            <Row label="밀리초 (ms)" value={String(dateResult.unixMs)} />
          </dl>
        )}
      </section>
    </div>
  )
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-wrap items-center gap-2 text-sm">
      <dt className="w-24 shrink-0 text-zinc-500 dark:text-zinc-400">{label}</dt>
      <dd className="flex-1 break-all font-mono">{value}</dd>
      <CopyButton text={value} className="btn !px-2 !py-1 text-xs" />
    </div>
  )
}

function ErrorLine({ msg }: { msg: string }) {
  return (
    <p role="alert" className="text-sm text-red-600 dark:text-red-400">
      {msg}
    </p>
  )
}
