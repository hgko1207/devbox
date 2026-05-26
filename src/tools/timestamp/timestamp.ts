// Unix 타임스탬프 ↔ 날짜 변환.

export interface TimeInfo {
  iso: string
  utc: string
  local: string
  unixSec: number
  unixMs: number
}

/** Unix 타임스탬프(초 또는 밀리초) → 시각 정보. 절댓값이 1e12 이상이면 밀리초로 간주. */
export function fromEpoch(input: string): TimeInfo {
  const trimmed = input.trim()
  if (!/^-?\d+$/.test(trimmed)) {
    throw new Error('정수 형태의 Unix 타임스탬프를 입력하세요.')
  }
  const n = Number(trimmed)
  const ms = Math.abs(n) >= 1e12 ? n : n * 1000
  const d = new Date(ms)
  if (Number.isNaN(d.getTime())) throw new Error('유효한 시각으로 변환할 수 없습니다.')
  return {
    iso: d.toISOString(),
    utc: d.toUTCString(),
    local: d.toLocaleString('ko-KR'),
    unixSec: Math.floor(ms / 1000),
    unixMs: ms,
  }
}

/** 날짜 문자열(예: datetime-local 'YYYY-MM-DDTHH:mm:ss') → Unix(초/밀리초). */
export function fromDate(input: string): { unixSec: number; unixMs: number } {
  const trimmed = input.trim()
  if (trimmed === '') throw new Error('날짜를 입력하세요.')
  const ms = new Date(trimmed).getTime()
  if (Number.isNaN(ms)) throw new Error('날짜 형식을 인식할 수 없습니다.')
  return { unixSec: Math.floor(ms / 1000), unixMs: ms }
}
