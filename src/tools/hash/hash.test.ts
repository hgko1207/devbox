import { describe, it, expect } from 'vitest'
import { hashText } from './hash'

describe('hash', () => {
  it('SHA-256("abc") — 알려진 값', async () => {
    expect(await hashText('abc', 'SHA-256')).toBe(
      'ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad',
    )
  })

  it('SHA-1("abc") — 알려진 값', async () => {
    expect(await hashText('abc', 'SHA-1')).toBe('a9993e364706816aba3e25717850c26c9cd0d89d')
  })

  it('SHA-512("") — 알려진 값', async () => {
    expect(await hashText('', 'SHA-512')).toBe(
      'cf83e1357eefb8bdf1542850d66d8007d620e4050b5715dc83f4a921d36ce9ce47d0d13c5d85f2b0ff8318d2877eec2f63b931bd47417a81a538327af927da3e',
    )
  })

  it('UTF-8 한글 — 길이·재현성', async () => {
    const h = await hashText('안녕 devbox', 'SHA-256')
    expect(h).toHaveLength(64)
    expect(await hashText('안녕 devbox', 'SHA-256')).toBe(h)
  })
})
