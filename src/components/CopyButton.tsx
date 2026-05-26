import { useCopy } from '@/lib/useCopy'
import { CheckIcon, CopyIcon } from './icons'

interface CopyButtonProps {
  text: string
  label?: string
  className?: string
}

export function CopyButton({ text, label = '복사', className = 'btn' }: CopyButtonProps) {
  const { copied, failed, copy } = useCopy()
  return (
    <button type="button" className={className} onClick={() => copy(text)} disabled={text === ''}>
      {copied ? <CheckIcon className="h-4 w-4 text-emerald-500" /> : <CopyIcon className="h-4 w-4" />}
      {copied ? '복사됨' : failed ? '복사 실패' : label}
    </button>
  )
}
