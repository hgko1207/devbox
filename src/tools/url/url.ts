// URL 구성요소 인코드/디코드 (encodeURIComponent 기반).

export function encodeUrl(text: string): string {
  return encodeURIComponent(text)
}

export function decodeUrl(text: string): string {
  try {
    return decodeURIComponent(text)
  } catch {
    throw new Error('올바르지 않은 URL 인코딩입니다. (% 뒤에 16진수 2자리가 와야 합니다)')
  }
}
