import { describe, it, expect } from 'vitest'
import { decodeJwt, extractTimeClaims } from './jwt'
import { encodeBase64 } from '../base64/base64'

function makeToken(header: object, payload: object): string {
  return [
    encodeBase64(JSON.stringify(header), true),
    encodeBase64(JSON.stringify(payload), true),
    'signature',
  ].join('.')
}

describe('jwt', () => {
  const token = makeToken(
    { alg: 'HS256', typ: 'JWT' },
    { sub: '123', name: '홍길동', iat: 1516239022, exp: 1516242622 },
  )

  it('헤더·페이로드 디코드 (한글 포함)', () => {
    const d = decodeJwt(token)
    expect((d.header as { alg: string }).alg).toBe('HS256')
    expect((d.payload as { name: string }).name).toBe('홍길동')
    expect((d.payload as { iat: number }).iat).toBe(1516239022)
    expect(d.signature).toBe('signature')
  })

  it('3부분이 아니면 한국어 오류', () => {
    expect(() => decodeJwt('a.b')).toThrow(/3개 부분/)
  })

  it('시간 클레임 추출 (iat/exp)', () => {
    const claims = extractTimeClaims(decodeJwt(token).payload)
    const keys = claims.map((c) => c.key)
    expect(keys.some((k) => k.includes('iat'))).toBe(true)
    expect(keys.some((k) => k.includes('exp'))).toBe(true)
  })
})
