import { Suspense } from 'react'
import { Outlet } from 'react-router-dom'
import { Header } from './Header'
import { Sidebar } from './Sidebar'
import { CommandPaletteProvider } from '@/lib/commandPalette'
import { CommandPalette } from './CommandPalette'
import { SidebarProvider } from '@/lib/sidebar'

function Loading() {
  return (
    <div className="flex items-center justify-center py-24 text-sm text-zinc-500 dark:text-zinc-400">
      <span className="h-4 w-4 animate-spin rounded-full border-2 border-zinc-300 border-t-brand-600 dark:border-zinc-700 dark:border-t-brand-400" />
      <span className="ml-2">불러오는 중…</span>
    </div>
  )
}

export function Layout() {
  return (
    <SidebarProvider>
      <CommandPaletteProvider>
        <div className="flex min-h-full flex-col">
          <Header />
          <div className="flex flex-1">
            <Sidebar />
            <main className="min-w-0 flex-1">
              <div className="mx-auto w-full max-w-5xl px-4 py-6">
                <Suspense fallback={<Loading />}>
                  <Outlet />
                </Suspense>
              </div>
            </main>
          </div>
          <footer className="border-t border-zinc-200 py-6 text-center text-xs text-zinc-500 dark:border-zinc-800 dark:text-zinc-400">
            <p>
              devbox · 정적 사이트 · 회원가입/광고/추적 없음 ·{' '}
              <a
                href="https://github.com/hgko1207/devbox"
                target="_blank"
                rel="noopener noreferrer"
                className="underline hover:text-zinc-700 dark:hover:text-zinc-200"
              >
                GitHub
              </a>
            </p>
          </footer>
          <CommandPalette />
        </div>
      </CommandPaletteProvider>
    </SidebarProvider>
  )
}
