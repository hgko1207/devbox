// 두 JSON 값의 구조적 차이를 계산한다.
// 객체는 키 기준, 배열은 인덱스 기준으로 비교한다.

export type DiffType = 'added' | 'removed' | 'changed'

export interface DiffEntry {
  /** 경로. 예: 'user.name', 'items[2].id' */
  path: string
  type: DiffType
  /** 변경 전 값 (added 인 경우 없음) */
  left?: unknown
  /** 변경 후 값 (removed 인 경우 없음) */
  right?: unknown
}

function isObject(v: unknown): v is Record<string, unknown> {
  return typeof v === 'object' && v !== null && !Array.isArray(v)
}

function joinKey(base: string, key: string): string {
  // 식별자로 안전한 키는 점 표기, 그 외에는 ["..."] 표기
  if (base === '') return /^[A-Za-z_$][\w$]*$/.test(key) ? key : `["${key}"]`
  return /^[A-Za-z_$][\w$]*$/.test(key) ? `${base}.${key}` : `${base}["${key}"]`
}

/**
 * left → right 로 갈 때의 변경 목록을 반환한다.
 * 경로 순서대로 정렬되어 반환된다.
 */
export function diffJson(left: unknown, right: unknown): DiffEntry[] {
  const entries: DiffEntry[] = []

  function walk(a: unknown, b: unknown, path: string): void {
    if (Object.is(a, b)) return

    const bothObjects = isObject(a) && isObject(b)
    const bothArrays = Array.isArray(a) && Array.isArray(b)

    if (bothObjects) {
      const keys = new Set([...Object.keys(a), ...Object.keys(b)])
      const sorted = [...keys].sort()
      for (const key of sorted) {
        const hasA = Object.prototype.hasOwnProperty.call(a, key)
        const hasB = Object.prototype.hasOwnProperty.call(b, key)
        const childPath = joinKey(path, key)
        if (hasA && !hasB) {
          entries.push({ path: childPath, type: 'removed', left: a[key] })
        } else if (!hasA && hasB) {
          entries.push({ path: childPath, type: 'added', right: b[key] })
        } else {
          walk(a[key], b[key], childPath)
        }
      }
      return
    }

    if (bothArrays) {
      const max = Math.max(a.length, b.length)
      for (let idx = 0; idx < max; idx++) {
        const childPath = `${path}[${idx}]`
        const inA = idx < a.length
        const inB = idx < b.length
        if (inA && !inB) {
          entries.push({ path: childPath, type: 'removed', left: a[idx] })
        } else if (!inA && inB) {
          entries.push({ path: childPath, type: 'added', right: b[idx] })
        } else {
          walk(a[idx], b[idx], childPath)
        }
      }
      return
    }

    // 타입이 다르거나 원시값이 다른 경우 → 변경
    entries.push({ path: path || '(루트)', type: 'changed', left: a, right: b })
  }

  walk(left, right, '')
  return entries
}

export interface DiffSummary {
  added: number
  removed: number
  changed: number
}

export function summarize(entries: DiffEntry[]): DiffSummary {
  const summary: DiffSummary = { added: 0, removed: 0, changed: 0 }
  for (const e of entries) summary[e.type]++
  return summary
}
