import { forwardRef, memo } from 'react'

interface CodeAreaProps {
  value: string
  onChange?: (value: string) => void
  placeholder?: string
  ariaLabel: string
  readOnly?: boolean
  className?: string
}

/**
 * 모든 도구가 공유하는 모노스페이스 텍스트 영역.
 * 구문 강조 같은 무거운 렌더링을 피해 대용량 입력에서도 가볍다.
 */
export const CodeArea = memo(
  forwardRef<HTMLTextAreaElement, CodeAreaProps>(function CodeArea(
    { value, onChange, placeholder, ariaLabel, readOnly = false, className = '' },
    ref,
  ) {
    return (
      <textarea
        ref={ref}
        value={value}
        readOnly={readOnly}
        onChange={onChange ? (e) => onChange(e.target.value) : undefined}
        placeholder={placeholder}
        aria-label={ariaLabel}
        spellCheck={false}
        autoCapitalize="off"
        autoCorrect="off"
        wrap="off"
        className={`block h-full w-full resize-none rounded-lg border border-zinc-300 bg-white p-3 font-mono text-sm leading-relaxed text-zinc-900 shadow-sm placeholder:text-zinc-400 read-only:bg-zinc-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100 dark:read-only:bg-zinc-950 ${className}`}
      />
    )
  }),
)
