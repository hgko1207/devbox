import type { ValidationResult } from '../lib/parser'
import { CheckIcon } from '@/components/icons'

function formatBytes(n: number): string {
  if (n < 1024) return `${n} B`
  if (n < 1024 * 1024) return `${(n / 1024).toFixed(1)} KB`
  return `${(n / (1024 * 1024)).toFixed(2)} MB`
}

interface StatusBarProps {
  validation: ValidationResult
  charCount: number
  byteCount: number
  onJumpToError?: (offset: number) => void
}

export function StatusBar({ validation, charCount, byteCount, onJumpToError }: StatusBarProps) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-2 rounded-md border border-zinc-200 bg-white px-3 py-2 text-sm dark:border-zinc-800 dark:bg-zinc-900">
      <div className="min-w-0 flex-1">
        {validation.status === 'empty' && (
          <span className="text-zinc-400">JSON 을 입력하면 자동으로 검사합니다.</span>
        )}
        {validation.status === 'valid' && (
          <span className="inline-flex items-center gap-1.5 font-medium text-emerald-600 dark:text-emerald-400">
            <CheckIcon className="h-4 w-4" />
            유효한 JSON 입니다
          </span>
        )}
        {validation.status === 'invalid' && (
          <span className="inline-flex flex-wrap items-center gap-x-2 gap-y-1 text-red-600 dark:text-red-400">
            <span className="font-medium">오류:</span>
            <span className="break-words">{validation.error.message}</span>
            <span className="text-xs text-red-500/80">
              (줄 {validation.error.line}, 열 {validation.error.column})
            </span>
            {onJumpToError && (
              <button
                type="button"
                onClick={() => onJumpToError(validation.error.offset)}
                className="rounded border border-red-300 px-1.5 py-0.5 text-xs font-medium hover:bg-red-50 dark:border-red-800 dark:hover:bg-red-950"
              >
                위치로 이동
              </button>
            )}
          </span>
        )}
      </div>
      <div className="shrink-0 text-xs text-zinc-500 dark:text-zinc-400">
        {charCount.toLocaleString()}자 · {formatBytes(byteCount)}
      </div>
    </div>
  )
}
