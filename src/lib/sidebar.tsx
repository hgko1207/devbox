import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from 'react'
import { useLocalStorage } from './useLocalStorage'

interface SidebarCtx {
  /** 데스크톱에서 사이드바가 아이콘 레일로 접힌 상태인지 (localStorage 기억) */
  collapsed: boolean
  setCollapsed: (v: boolean) => void
  toggleCollapsed: () => void
  /** 모바일 드로어 오픈 상태 (세션 한정) */
  mobileOpen: boolean
  setMobileOpen: (v: boolean) => void
}

const Ctx = createContext<SidebarCtx | null>(null)

export function SidebarProvider({ children }: { children: ReactNode }) {
  const [collapsed, setCollapsedStored] = useLocalStorage<boolean>('devbox-sidebar-collapsed', false)
  const [mobileOpen, setMobileOpen] = useState(false)

  const setCollapsed = useCallback((v: boolean) => setCollapsedStored(v), [setCollapsedStored])
  const toggleCollapsed = useCallback(() => setCollapsedStored((p) => !p), [setCollapsedStored])

  // Esc 로 모바일 드로어 닫기
  useEffect(() => {
    if (!mobileOpen) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMobileOpen(false)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [mobileOpen])

  return (
    <Ctx.Provider value={{ collapsed, setCollapsed, toggleCollapsed, mobileOpen, setMobileOpen }}>
      {children}
    </Ctx.Provider>
  )
}

export function useSidebar(): SidebarCtx {
  const ctx = useContext(Ctx)
  if (!ctx) throw new Error('useSidebar 는 SidebarProvider 내부에서만 사용할 수 있습니다.')
  return ctx
}
