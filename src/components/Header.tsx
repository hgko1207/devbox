import { Link } from 'react-router-dom'
import { ThemeToggle } from './ThemeToggle'
import { BracesIcon } from './icons'

export function Header() {
  return (
    <header className="sticky top-0 z-20 border-b border-zinc-200 bg-zinc-50/80 backdrop-blur dark:border-zinc-800 dark:bg-zinc-950/80">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4">
        <Link
          to="/"
          className="flex items-center gap-2 text-lg font-bold tracking-tight text-zinc-900 dark:text-zinc-50"
        >
          <span className="flex h-7 w-7 items-center justify-center rounded-md bg-indigo-600 text-white">
            <BracesIcon className="h-4 w-4" />
          </span>
          devbox
        </Link>
        <div className="flex items-center gap-2">
          <span className="hidden text-xs text-zinc-500 sm:inline dark:text-zinc-400">
            모든 처리는 브라우저에서만 · 데이터 전송 없음
          </span>
          <ThemeToggle />
        </div>
      </div>
    </header>
  )
}
