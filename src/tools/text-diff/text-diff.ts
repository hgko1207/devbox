// 두 텍스트의 줄 단위 차이 (jsdiff 기반).
import { diffLines } from 'diff'

export interface DiffPart {
  added?: boolean
  removed?: boolean
  value: string
}

export function lineDiff(a: string, b: string): DiffPart[] {
  return diffLines(a, b)
}

export interface DiffStats {
  added: number
  removed: number
  unchanged: number
}

function countLines(value: string): number {
  if (value === '') return 0
  // diff 라이브러리는 보통 '\n' 으로 끝나는 청크를 돌려준다 — 끝의 빈 줄 한 개를 빼고 세야 정확.
  const trimmed = value.endsWith('\n') ? value.slice(0, -1) : value
  return trimmed.split('\n').length
}

export function statsOf(parts: DiffPart[]): DiffStats {
  let added = 0
  let removed = 0
  let unchanged = 0
  for (const p of parts) {
    const n = countLines(p.value)
    if (p.added) added += n
    else if (p.removed) removed += n
    else unchanged += n
  }
  return { added, removed, unchanged }
}
