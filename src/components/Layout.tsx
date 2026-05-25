import { Suspense } from 'react'
import { Outlet } from 'react-router-dom'
import { Header } from './Header'

function Loading() {
  return (
    <div className="flex items-center justify-center py-24 text-sm text-zinc-500 dark:text-zinc-400">
      <span className="h-4 w-4 animate-spin rounded-full border-2 border-zinc-300 border-t-indigo-600 dark:border-zinc-700 dark:border-t-indigo-400" />
      <span className="ml-2">불러오는 중…</span>
    </div>
  )
}

export function Layout() {
  return (
    <div className="flex min-h-full flex-col">
      <Header />
      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-6">
        <Suspense fallback={<Loading />}>
          <Outlet />
        </Suspense>
      </main>
      <footer className="border-t border-zinc-200 py-6 text-center text-xs text-zinc-500 dark:border-zinc-800 dark:text-zinc-400">
        <p>devbox · 정적 사이트 · 회원가입/광고/추적 없음</p>
      </footer>
    </div>
  )
}
