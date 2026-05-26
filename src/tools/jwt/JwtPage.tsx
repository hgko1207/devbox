import { useMemo, useState } from 'react'
import { ToolHeader } from '@/components/ToolHeader'
import { CodeArea } from '@/components/CodeArea'
import { CopyButton } from '@/components/CopyButton'
import { KeyIcon, TrashIcon } from '@/components/icons'
import { decodeJwt, extractTimeClaims } from './jwt'

const SAMPLE =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c'

export default function JwtPage() {
  const [token, setToken] = useState('')

  const result = useMemo(() => {
    if (token.trim() === '') return null
    try {
      const d = decodeJwt(token)
      return {
        ok: true as const,
        header: JSON.stringify(d.header, null, 2),
        payload: JSON.stringify(d.payload, null, 2),
        claims: extractTimeClaims(d.payload),
      }
    } catch (e) {
      return { ok: false as const, err: e instanceof Error ? e.message : '디코딩에 실패했습니다.' }
    }
  }, [token])

  return (
    <div className="space-y-5">
      <ToolHeader
        name="JWT 디코더"
        description="JWT 의 헤더·페이로드를 확인합니다. 서명은 검증하지 않습니다(내용 확인용). 모든 처리는 브라우저에서만."
        icon={KeyIcon}
      />

      <div className="flex flex-wrap items-center gap-2">
        <button type="button" className="btn" onClick={() => setToken(SAMPLE)}>
          예제
        </button>
        <button type="button" className="btn" onClick={() => setToken('')} disabled={token === ''}>
          <TrashIcon className="h-4 w-4" />
          지우기
        </button>
      </div>

      <div className="h-[20dvh] min-h-[110px]">
        <CodeArea
          value={token}
          onChange={setToken}
          ariaLabel="JWT 토큰 입력"
          placeholder="eyJhbGciOi... 형식의 토큰을 붙여넣으세요 (header.payload.signature)"
        />
      </div>

      <div
        className="rounded-md border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-700 dark:border-amber-900 dark:bg-amber-950/40 dark:text-amber-300"
        role="note"
      >
        ⚠️ 서명(signature)은 검증하지 않습니다. 토큰 내용을 읽기 위한 도구입니다.
      </div>

      {result?.ok === false && (
        <div
          role="alert"
          className="rounded-md border border-red-200 bg-red-50 p-2.5 text-sm text-red-700 dark:border-red-900 dark:bg-red-950/40 dark:text-red-300"
        >
          {result.err}
        </div>
      )}

      {result?.ok && (
        <>
          <div className="grid gap-3 md:grid-cols-2">
            <DecodedBlock title="헤더 (Header)" json={result.header} />
            <DecodedBlock title="페이로드 (Payload)" json={result.payload} />
          </div>

          {result.claims.length > 0 && (
            <div className="rounded-lg border border-zinc-200 bg-white p-3 text-sm shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
              <h2 className="mb-2 text-xs font-semibold text-zinc-500 dark:text-zinc-400">시간 클레임</h2>
              <ul className="space-y-1">
                {result.claims.map((c) => (
                  <li key={c.key} className="flex flex-wrap items-center gap-x-2">
                    <span className="font-medium">{c.key}</span>
                    <span className="text-zinc-500 dark:text-zinc-400">{c.date}</span>
                    <span className="text-xs text-zinc-400">({c.epoch})</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </>
      )}
    </div>
  )
}

function DecodedBlock({ title, json }: { title: string; json: string }) {
  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium text-zinc-500 dark:text-zinc-400">{title}</span>
        <CopyButton text={json} className="btn !px-2 !py-1 text-xs" />
      </div>
      <div className="h-[26dvh] min-h-[140px]">
        <CodeArea value={json} ariaLabel={title} readOnly />
      </div>
    </div>
  )
}
