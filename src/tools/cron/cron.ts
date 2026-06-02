// Cron(5-필드) 파서, 한국어 풀이, 다음 실행 계산.

export interface CronParts {
  minute: number[]
  hour: number[]
  dom: number[]
  month: number[]
  dow: number[]
}

function expandField(field: string, min: number, max: number, dowMode = false): number[] {
  const out = new Set<number>()
  for (const item of field.split(',')) {
    let basePart = item
    let stepPart: string | undefined
    if (item.includes('/')) {
      const idx = item.indexOf('/')
      basePart = item.slice(0, idx)
      stepPart = item.slice(idx + 1)
    }
    let rangeMin: number
    let rangeMax: number
    if (basePart === '*' || basePart === '') {
      rangeMin = min
      rangeMax = max
    } else if (basePart.includes('-')) {
      const [a, b] = basePart.split('-').map(Number)
      if (!Number.isFinite(a) || !Number.isFinite(b))
        throw new Error(`잘못된 cron 항목: "${item}"`)
      rangeMin = a
      rangeMax = b
    } else {
      const n = Number(basePart)
      if (!Number.isFinite(n)) throw new Error(`잘못된 cron 항목: "${item}"`)
      rangeMin = n
      rangeMax = stepPart ? max : n
    }
    const step = stepPart ? Math.max(1, Number(stepPart)) : 1
    if (!Number.isFinite(step)) throw new Error(`잘못된 step: "${item}"`)
    for (let i = rangeMin; i <= rangeMax; i += step) {
      let v = i
      if (dowMode && v === 7) v = 0
      if (v < min || v > max) throw new Error(`"${item}" 가 허용 범위 ${min}~${max} 를 벗어납니다.`)
      out.add(v)
    }
  }
  return [...out].sort((a, b) => a - b)
}

export function parseCron(expr: string): CronParts {
  const parts = expr.trim().split(/\s+/)
  if (parts.length !== 5) {
    throw new Error('cron 식은 5개 필드여야 합니다 (분 시 일 월 요일).')
  }
  return {
    minute: expandField(parts[0], 0, 59),
    hour: expandField(parts[1], 0, 23),
    dom: expandField(parts[2], 1, 31),
    month: expandField(parts[3], 1, 12),
    dow: expandField(parts[4], 0, 6, true),
  }
}

// ── 한국어 풀이 ─────────────────────────────────────────────────────────────────

const KO_DOW = ['일', '월', '화', '수', '목', '금', '토']

function isFullRange(values: number[], min: number, max: number): boolean {
  return values.length === max - min + 1
}

function detectStep(values: number[]): number | null {
  if (values.length < 2) return null
  const step = values[1] - values[0]
  if (step <= 0) return null
  for (let i = 2; i < values.length; i++) {
    if (values[i] - values[i - 1] !== step) return null
  }
  return step
}

function describeNumeric(
  values: number[],
  min: number,
  max: number,
  pointUnit: string,
  intervalUnit: string = pointUnit,
): string {
  if (isFullRange(values, min, max)) return `매${pointUnit}`
  if (values.length === 1) return `${values[0]}${pointUnit}`
  const step = detectStep(values)
  if (step && step > 1 && values[0] === min && values[values.length - 1] + step > max) {
    return `${step}${intervalUnit}마다`
  }
  return values.join(', ') + pointUnit
}

function describeMonth(values: number[]): string {
  if (isFullRange(values, 1, 12)) return '매월'
  return values.map((v) => `${v}월`).join(', ')
}

function describeDow(values: number[]): string {
  if (values.length === 7) return '매요일'
  // 연속된 요일이면 "월~금" 같이 표시
  if (values.length >= 3) {
    const step = detectStep(values)
    if (step === 1) {
      return `${KO_DOW[values[0]]}~${KO_DOW[values[values.length - 1]]}요일`
    }
  }
  return values.map((v) => `${KO_DOW[v]}요일`).join(', ')
}

function describeDom(values: number[]): string {
  if (isFullRange(values, 1, 31)) return '매일'
  return describeNumeric(values, 1, 31, '일')
}

export function describeCron(parts: CronParts): string {
  const month = describeMonth(parts.month)
  const dom = describeDom(parts.dom)
  const dow = describeDow(parts.dow)
  const h = describeNumeric(parts.hour, 0, 23, '시', '시간')
  const m = describeNumeric(parts.minute, 0, 59, '분')
  return `${month} · ${dom} · ${dow} · ${h} ${m}`
}

// ── 다음 실행 ───────────────────────────────────────────────────────────────────

function matches(p: CronParts, d: Date): boolean {
  return (
    p.minute.includes(d.getMinutes()) &&
    p.hour.includes(d.getHours()) &&
    p.dom.includes(d.getDate()) &&
    p.month.includes(d.getMonth() + 1) &&
    p.dow.includes(d.getDay())
  )
}

export function nextRuns(parts: CronParts, from: Date, count: number): Date[] {
  const out: Date[] = []
  const d = new Date(from.getTime())
  d.setSeconds(0, 0)
  d.setMinutes(d.getMinutes() + 1)
  const limit = 60 * 24 * 366 * 2 // 최대 ~2년 범위 탐색
  for (let i = 0; i < limit && out.length < count; i++) {
    if (matches(parts, d)) out.push(new Date(d.getTime()))
    d.setMinutes(d.getMinutes() + 1)
  }
  return out
}
