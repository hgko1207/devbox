import { useCallback, useState } from 'react'

/**
 * 클립보드 복사 훅. 비보안 컨텍스트(http)나 권한 거부 시 failed 로 폴백한다.
 * (성공: copied 가 잠시 true · 실패: failed 가 잠시 true)
 */
export function useCopy(resetMs = 1500) {
  const [copied, setCopied] = useState(false)
  const [failed, setFailed] = useState(false)

  const copy = useCallback(
    async (text: string) => {
      if (!text) return
      try {
        if (!navigator.clipboard) throw new Error('clipboard unavailable')
        await navigator.clipboard.writeText(text)
        setFailed(false)
        setCopied(true)
        setTimeout(() => setCopied(false), resetMs)
      } catch {
        setCopied(false)
        setFailed(true)
        setTimeout(() => setFailed(false), 4000)
      }
    },
    [resetMs],
  )

  return { copied, failed, copy }
}
