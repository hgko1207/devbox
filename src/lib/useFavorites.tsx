import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'

const KEY = 'devbox-favorites'

interface FavoritesCtx {
  favorites: string[]
  toggle: (id: string) => void
  isFavorite: (id: string) => boolean
}

const Ctx = createContext<FavoritesCtx | null>(null)

function readStored(): string[] {
  if (typeof window === 'undefined') return []
  try {
    const raw = window.localStorage.getItem(KEY)
    if (raw === null) return []
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? (parsed as string[]) : []
  } catch {
    return []
  }
}

/**
 * 전역 즐겨찾기 컨텍스트.
 * 카드의 ★ 버튼, 사이드바 즐겨찾기 섹션, 도구 헤더가 같은 상태를 공유한다.
 * (이전엔 useState 가 컴포넌트별로 따로 떠서 사이드바가 새로고침 전엔 갱신되지 않았다.)
 */
export function FavoritesProvider({ children }: { children: ReactNode }) {
  const [favorites, setFavorites] = useState<string[]>(readStored)

  useEffect(() => {
    try {
      window.localStorage.setItem(KEY, JSON.stringify(favorites))
    } catch {
      /* 비공개 모드 등 */
    }
  }, [favorites])

  // 다른 탭에서 변경한 경우에도 동기화
  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key !== KEY) return
      setFavorites(readStored())
    }
    window.addEventListener('storage', onStorage)
    return () => window.removeEventListener('storage', onStorage)
  }, [])

  const toggle = useCallback((id: string) => {
    setFavorites((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]))
  }, [])

  const isFavorite = useCallback((id: string) => favorites.includes(id), [favorites])

  const value = useMemo<FavoritesCtx>(
    () => ({ favorites, toggle, isFavorite }),
    [favorites, toggle, isFavorite],
  )

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>
}

export function useFavorites(): FavoritesCtx {
  const ctx = useContext(Ctx)
  if (!ctx) throw new Error('useFavorites 는 FavoritesProvider 내부에서만 사용할 수 있습니다.')
  return ctx
}
