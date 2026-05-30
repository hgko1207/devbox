import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from 'react'

interface CommandPaletteCtx {
  open: boolean
  setOpen: (open: boolean) => void
  toggle: () => void
}

const Ctx = createContext<CommandPaletteCtx | null>(null)

/**
 * 명령 팔레트 열림/닫힘 상태를 관리하고 전역 키보드 단축키(⌘K · Ctrl+K)를 연결한다.
 */
export function CommandPaletteProvider({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false)
  const toggle = useCallback(() => setOpen((o) => !o), [])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      // ⌘K (Mac) / Ctrl+K (Windows·Linux)
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault()
        setOpen((o) => !o)
      } else if (e.key === 'Escape') {
        setOpen(false)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  return <Ctx.Provider value={{ open, setOpen, toggle }}>{children}</Ctx.Provider>
}

export function useCommandPalette(): CommandPaletteCtx {
  const ctx = useContext(Ctx)
  if (!ctx) throw new Error('useCommandPalette 는 CommandPaletteProvider 내부에서만 사용할 수 있습니다.')
  return ctx
}
