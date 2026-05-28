import { useEffect, useState } from 'react'
import { ToolHeader } from '@/components/ToolHeader'
import { CodeArea } from '@/components/CodeArea'
import { CopyButton } from '@/components/CopyButton'
import { FingerprintIcon } from '@/components/icons'
import { useDebounced } from '@/lib/useDebounced'
import { HASH_ALGOS, hashAll, type HashAlgo } from './hash'

export default function HashPage() {
  const [text, setText] = useState('')
  const debounced = useDebounced(text, 200)
  const [hashes, setHashes] = useState<Partial<Record<HashAlgo, string>>>({})
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false
    if (debounced === '') {
      setHashes({})
      setError(null)
      return
    }
    setError(null)
    hashAll(debounced)
      .then((all) => {
        if (!cancelled) setHashes(all)
      })
      .catch((e) => {
        if (!cancelled) setError(e instanceof Error ? e.message : '해시 계산에 실패했습니다.')
      })
    return () => {
      cancelled = true
    }
  }, [debounced])

  return (
    <div className="space-y-5">
      <ToolHeader
        name="해시 생성"
        description="텍스트의 SHA-1·SHA-256·SHA-384·SHA-512 해시를 계산합니다. Web Crypto 기반, 모든 처리는 브라우저에서만."
        icon={FingerprintIcon}
      />

      <div className="h-[30dvh] min-h-[160px]">
        <CodeArea
          value={text}
          onChange={setText}
          ariaLabel="해시 입력"
          placeholder="해시할 텍스트를 입력하세요"
        />
      </div>

      {error && (
        <p role="alert" className="text-sm text-red-600 dark:text-red-400">
          {error}
        </p>
      )}

      <dl className="space-y-2">
        {HASH_ALGOS.map((a) => (
          <Row key={a} label={a} value={hashes[a] ?? ''} />
        ))}
      </dl>
    </div>
  )
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-zinc-200 bg-white p-3 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
      <div className="flex items-center justify-between gap-2">
        <span className="text-xs font-semibold text-zinc-500 dark:text-zinc-400">{label}</span>
        <CopyButton text={value} className="btn !px-2 !py-1 text-xs" />
      </div>
      <code className="mt-1 block break-all font-mono text-xs text-zinc-700 dark:text-zinc-200">
        {value || '—'}
      </code>
    </div>
  )
}
