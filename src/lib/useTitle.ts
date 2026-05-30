import { useEffect } from 'react'

const DEFAULT_TITLE = 'devbox — 개발자 도구 모음'

/**
 * 라우트별 document.title 설정. suffix 가 있으면 "{suffix} · devbox", 없으면 기본 제목.
 * 언마운트 시 기본 제목으로 복원해 빠른 탭 이동 시 잘못된 제목이 남지 않게 한다.
 */
export function useTitle(suffix?: string) {
  useEffect(() => {
    document.title = suffix ? `${suffix} · devbox` : DEFAULT_TITLE
    return () => {
      document.title = DEFAULT_TITLE
    }
  }, [suffix])
}
