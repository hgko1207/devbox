// UTF-8 안전 Base64 인코드/디코드. URL-safe 변형 지원.

/** 텍스트 → Base64. urlSafe 면 +/ → -_ 로 바꾸고 패딩(=)을 제거한다. */
export function encodeBase64(text: string, urlSafe = false): string {
  const bytes = new TextEncoder().encode(text)
  let bin = ''
  for (let i = 0; i < bytes.length; i++) bin += String.fromCharCode(bytes[i])
  let b64 = btoa(bin)
  if (urlSafe) b64 = b64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')
  return b64
}

/** Base64(일반/URL-safe) → 텍스트. 잘못된 입력이면 한국어 오류를 throw. */
export function decodeBase64(input: string): string {
  let s = input.trim().replace(/\s+/g, '')
  s = s.replace(/-/g, '+').replace(/_/g, '/')
  const pad = s.length % 4
  if (pad === 2) s += '=='
  else if (pad === 3) s += '='
  else if (pad === 1) throw new Error('Base64 길이가 올바르지 않습니다.')
  if (!/^[A-Za-z0-9+/]*={0,2}$/.test(s)) {
    throw new Error('Base64 가 아닌 문자가 포함되어 있습니다.')
  }
  let bin: string
  try {
    bin = atob(s)
  } catch {
    throw new Error('Base64 디코딩에 실패했습니다.')
  }
  const bytes = new Uint8Array(bin.length)
  for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i)
  return new TextDecoder().decode(bytes)
}
