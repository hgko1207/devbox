import { useEffect, useMemo, useRef, useState, type KeyboardEvent } from 'react'
import { createPortal } from 'react-dom'
import { useNavigate } from 'react-router-dom'
import { tools } from '@/tools/registry'
import { useCommandPalette } from '@/lib/commandPalette'

export function CommandPalette() {
  const { open, setOpen } = useCommandPalette()
  const [query, setQuery] = useState('')
  const [selected, setSelected] = useState(0)
  const navigate = useNavigate()
  const inputRef = useRef<HTMLInputElement>(null)
  const listRef = useRef<HTMLUListElement>(null)

  const items = useMemo(() => {
    const q = query.toLowerCase().trim()
    if (q === '') return tools
    return tools.filter((t) => {
      const hay = [
        t.name,
        t.description,
        t.path,
        t.category ?? '',
        ...(t.keywords ?? []),
      ]
        .join(' ')
        .toLowerCase()
      return hay.includes(q)
    })
  }, [query])

  // 열릴 때 입력 초기화 + 자동 포커스
  useEffect(() => {
    if (open) {
      setQuery('')
      setSelected(0)
      const t = setTimeout(() => inputRef.current?.focus(), 10)
      return () => clearTimeout(t)
    }
  }, [open])

  useEffect(() => {
    setSelected(0)
  }, [query])

  // 선택된 항목이 보이도록 스크롤
  useEffect(() => {
    if (!open) return
    const el = listRef.current?.children[selected] as HTMLElement | undefined
    el?.scrollIntoView({ block: 'nearest' })
  }, [selected, open])

  function onKey(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setSelected((s) => Math.min(items.length - 1, s + 1))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setSelected((s) => Math.max(0, s - 1))
    } else if (e.key === 'Enter') {
      e.preventDefault()
      const t = items[selected]
      if (t) {
        navigate(t.path)
        setOpen(false)
      }
    }
  }

  if (!open) return null

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-start justify-center bg-zinc-900/60 px-4 pt-[15vh] backdrop-blur-sm"
      onClick={() => setOpen(false)}
      role="dialog"
      aria-modal="true"
      aria-label="도구 검색 팔레트"
    >
      <div
        className="w-full max-w-lg overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-2xl dark:border-zinc-800 dark:bg-zinc-900"
        onClick={(e) => e.stopPropagation()}
      >
        <input
          ref={inputRef}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={onKey}
          placeholder="도구 이름·설명·키워드 검색…"
          aria-label="검색"
          className="block w-full border-b border-zinc-200 bg-transparent px-4 py-3 text-sm placeholder:text-zinc-400 focus:outline-none dark:border-zinc-800"
        />
        {items.length === 0 ? (
          <div className="px-4 py-8 text-center text-sm text-zinc-500 dark:text-zinc-400">
            결과 없음
          </div>
        ) : (
          <ul ref={listRef} className="max-h-80 overflow-y-auto py-1">
            {items.map((t, i) => {
              const Icon = t.icon
              const isSel = i === selected
              return (
                <li key={t.id}>
                  <button
                    type="button"
                    onClick={() => {
                      navigate(t.path)
                      setOpen(false)
                    }}
                    onMouseEnter={() => setSelected(i)}
                    className={`flex w-full items-center gap-3 px-4 py-2.5 text-left ${
                      isSel ? 'bg-brand-50 dark:bg-brand-950/40' : ''
                    }`}
                  >
                    <span
                      className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-md ${
                        isSel
                          ? 'bg-brand-100 text-brand-700 dark:bg-brand-900 dark:text-brand-200'
                          : 'bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300'
                      }`}
                    >
                      <Icon className="h-4 w-4" />
                    </span>
                    <div className="min-w-0 flex-1">
                      <div className="truncate text-sm font-medium text-zinc-900 dark:text-zinc-100">
                        {t.name}
                      </div>
                      <div className="truncate text-xs text-zinc-500 dark:text-zinc-400">
                        {t.description}
                      </div>
                    </div>
                    <code className="hidden shrink-0 text-xs text-zinc-400 sm:inline">
                      {t.path}
                    </code>
                  </button>
                </li>
              )
            })}
          </ul>
        )}
        <div className="flex items-center justify-between border-t border-zinc-200 bg-zinc-50 px-4 py-2 text-[11px] text-zinc-500 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-400">
          <span>↑↓ 이동 · Enter 선택 · Esc 닫기</span>
          <span>{items.length}개</span>
        </div>
      </div>
    </div>,
    document.body,
  )
}
