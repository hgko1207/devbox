import { Link } from 'react-router-dom'
import { ThemeToggle } from './ThemeToggle'
import { BracesIcon, GithubIcon, SearchIcon } from './icons'
import { useCommandPalette } from '@/lib/commandPalette'

export function Header() {
  const { setOpen } = useCommandPalette()

  return (
    <header className="sticky top-0 z-20 border-b border-zinc-200 bg-zinc-50/80 backdrop-blur dark:border-zinc-800 dark:bg-zinc-950/80">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between gap-2 px-4">
        <Link
          to="/"
          className="flex items-center gap-2 text-lg font-bold tracking-tight text-zinc-900 dark:text-zinc-50"
        >
          <span className="flex h-7 w-7 items-center justify-center rounded-md bg-brand-600 text-white">
            <BracesIcon className="h-4 w-4" />
          </span>
          devbox
        </Link>

        <div className="flex items-center gap-2">
          {/* 도구 검색 (⌘K / Ctrl+K) */}
          <button
            type="button"
            onClick={() => setOpen(true)}
            aria-label="도구 검색 (Ctrl+K)"
            title="도구 검색 (Ctrl+K)"
            className="flex h-10 items-center gap-2 rounded-md border border-zinc-300 bg-white px-2.5 text-sm text-zinc-500 transition-colors hover:bg-zinc-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800"
          >
            <SearchIcon className="h-4 w-4" />
            <span className="hidden sm:inline">도구 검색</span>
            <kbd className="ml-1 hidden rounded border border-zinc-300 bg-zinc-50 px-1.5 py-0.5 font-mono text-[10px] text-zinc-500 md:inline dark:border-zinc-700 dark:bg-zinc-950">
              ⌘K
            </kbd>
          </button>

          {/* GitHub */}
          <a
            href="https://github.com/hgko1207/devbox"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="GitHub 저장소 열기"
            title="GitHub 저장소"
            className="btn h-10 w-10 !px-0"
          >
            <GithubIcon className="h-[18px] w-[18px]" />
          </a>

          <ThemeToggle />
        </div>
      </div>
    </header>
  )
}
