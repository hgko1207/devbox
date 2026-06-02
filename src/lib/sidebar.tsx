import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'

interface SidebarCtx {
  /** 모바일 드로어 오픈 상태 (세션 한정). 데스크톱은 항상 펼침이라 접힘 상태가 없다. */
  mobileOpen: boolean
  setMobileOpen: (v: boolean) => void
}

const Ctx = createContext<SidebarCtx | null>(null)

export function SidebarProvider({ children }: { children: ReactNode }) {
  const [mobileOpen, setMobileOpen] = useState(false)

  // Esc 로 모바일 드로어 닫기
  useEffect(() => {
    if (!mobileOpen) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMobileOpen(false)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [mobileOpen])

  return <Ctx.Provider value={{ mobileOpen, setMobileOpen }}>{children}</Ctx.Provider>
}

export function useSidebar(): SidebarCtx {
  const ctx = useContext(Ctx)
  if (!ctx) throw new Error('useSidebar 는 SidebarProvider 내부에서만 사용할 수 있습니다.')
  return ctx
}
