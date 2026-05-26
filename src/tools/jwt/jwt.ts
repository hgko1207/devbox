// JWT 디코더 (서명 검증은 하지 않음 — 내용 확인용).

export interface JwtDecoded {
  header: unknown
  payload: unknown
  signature: string
}

function base64UrlToText(part: string): string {
  let s = part.replace(/-/g, '+').replace(/_/g, '/')
  const pad = s.length % 4
  if (pad === 2) s += '=='
  else if (pad === 3) s += '='
  else if (pad === 1) throw new Error('Base64URL 길이 오류')
  const bin = atob(s)
  const bytes = new Uint8Array(bin.length)
  for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i)
  return new TextDecoder().decode(bytes)
}

export function decodeJwt(token: string): JwtDecoded {
  const parts = token.trim().split('.')
  if (parts.length !== 3) {
    throw new Error('JWT 는 점(.)으로 구분된 3개 부분이어야 합니다.')
  }
  let header: unknown
  let payload: unknown
  try {
    header = JSON.parse(base64UrlToText(parts[0]))
  } catch {
    throw new Error('헤더를 디코딩할 수 없습니다. (Base64URL/JSON 확인)')
  }
  try {
    payload = JSON.parse(base64UrlToText(parts[1]))
  } catch {
    throw new Error('페이로드를 디코딩할 수 없습니다. (Base64URL/JSON 확인)')
  }
  return { header, payload, signature: parts[2] }
}

export interface TimeClaim {
  key: string
  epoch: number
  date: string
}

/** payload 의 시간 클레임(iat/nbf/exp)을 사람이 읽기 좋은 형태로 추출. */
export function extractTimeClaims(payload: unknown): TimeClaim[] {
  if (typeof payload !== 'object' || payload === null) return []
  const labels: Record<string, string> = {
    iat: '발급 시각 (iat)',
    nbf: '유효 시작 (nbf)',
    exp: '만료 시각 (exp)',
  }
  const out: TimeClaim[] = []
  for (const key of ['iat', 'nbf', 'exp']) {
    const v = (payload as Record<string, unknown>)[key]
    if (typeof v === 'number') {
      out.push({ key: labels[key], epoch: v, date: new Date(v * 1000).toLocaleString('ko-KR') })
    }
  }
  return out
}
