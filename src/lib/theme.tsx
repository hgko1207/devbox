import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from 'react'

export type Theme = 'light' | 'dark' | 'system'
type Resolved = 'light' | 'dark'

interface ThemeContextValue {
  theme: Theme
  resolved: Resolved
  setTheme: (theme: Theme) => void
  /** system → light → dark → system 순으로 순환 */
  cycle: () => void
}

const ThemeContext = createContext<ThemeContextValue | null>(null)
const STORAGE_KEY = 'devbox-theme'

function readStored(): Theme {
  try {
    const value = localStorage.getItem(STORAGE_KEY)
    if (value === 'light' || value === 'dark' || value === 'system') return value
  } catch {
    /* localStorage 접근 불가 시 무시 */
  }
  return 'system'
}

function prefersDark(): boolean {
  return typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: dark)').matches
}

function resolve(theme: Theme): Resolved {
  if (theme === 'system') return prefersDark() ? 'dark' : 'light'
  return theme
}

function applyResolved(resolved: Resolved) {
  document.documentElement.classList.toggle('dark', resolved === 'dark')
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<Theme>(readStored)
  const [resolved, setResolved] = useState<Resolved>(() => resolve(theme))

  // theme 변경 시: 해석 → DOM 클래스 적용 → 저장
  useEffect(() => {
    const next = resolve(theme)
    setResolved(next)
    applyResolved(next)
    try {
      localStorage.setItem(STORAGE_KEY, theme)
    } catch {
      /* 무시 */
    }
  }, [theme])

  // system 모드일 때 OS 테마 변경을 추적
  useEffect(() => {
    if (theme !== 'system') return
    const mq = window.matchMedia('(prefers-color-scheme: dark)')
    const onChange = () => {
      const next: Resolved = mq.matches ? 'dark' : 'light'
      setResolved(next)
      applyResolved(next)
    }
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [theme])

  const setTheme = useCallback((next: Theme) => setThemeState(next), [])
  const cycle = useCallback(() => {
    setThemeState((prev) => (prev === 'system' ? 'light' : prev === 'light' ? 'dark' : 'system'))
  }, [])

  return (
    <ThemeContext.Provider value={{ theme, resolved, setTheme, cycle }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme(): ThemeContextValue {
  const ctx = useContext(ThemeContext)
  if (!ctx) throw new Error('useTheme 은 ThemeProvider 내부에서만 사용할 수 있습니다.')
  return ctx
}
