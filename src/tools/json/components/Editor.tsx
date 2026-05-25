import { forwardRef, memo } from 'react'

interface EditorProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  ariaLabel: string
  className?: string
}

/**
 * 대용량 입력을 위한 단순 textarea 에디터.
 * 구문 강조 같은 무거운 렌더링을 피해 수 MB 입력에서도 가볍게 동작한다.
 * memo 로 감싸 형제 상태 변화 시 불필요한 재렌더를 막는다.
 */
export const Editor = memo(
  forwardRef<HTMLTextAreaElement, EditorProps>(function Editor(
    { value, onChange, placeholder, ariaLabel, className = '' },
    ref,
  ) {
    return (
      <textarea
        ref={ref}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        aria-label={ariaLabel}
        spellCheck={false}
        autoCapitalize="off"
        autoCorrect="off"
        wrap="off"
        className={`block h-full w-full resize-none rounded-md border border-zinc-300 bg-white p-3 font-mono text-sm leading-relaxed text-zinc-900 placeholder:text-zinc-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100 ${className}`}
      />
    )
  }),
)
