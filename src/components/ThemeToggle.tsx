import { useTheme } from '@/lib/theme'
import { MonitorIcon, MoonIcon, SunIcon } from './icons'

const labels: Record<string, string> = {
  system: '시스템 설정',
  light: '라이트 모드',
  dark: '다크 모드',
}

export function ThemeToggle() {
  const { theme, cycle } = useTheme()

  return (
    <button
      type="button"
      onClick={cycle}
      className="btn h-10 w-10 !px-0"
      title={`테마: ${labels[theme]} (클릭하여 변경)`}
      aria-label={`테마 변경. 현재 ${labels[theme]}`}
    >
      {theme === 'system' ? (
        <MonitorIcon className="h-[18px] w-[18px]" />
      ) : theme === 'light' ? (
        <SunIcon className="h-[18px] w-[18px]" />
      ) : (
        <MoonIcon className="h-[18px] w-[18px]" />
      )}
    </button>
  )
}
