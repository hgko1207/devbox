// Web Crypto 기반 해시.

export const HASH_ALGOS = ['SHA-1', 'SHA-256', 'SHA-384', 'SHA-512'] as const
export type HashAlgo = (typeof HASH_ALGOS)[number]

function toHex(buf: ArrayBuffer): string {
  const bytes = new Uint8Array(buf)
  let out = ''
  for (let i = 0; i < bytes.length; i++) out += bytes[i].toString(16).padStart(2, '0')
  return out
}

export async function hashText(text: string, algo: HashAlgo): Promise<string> {
  const bytes = new TextEncoder().encode(text)
  const buf = await crypto.subtle.digest(algo, bytes)
  return toHex(buf)
}

export async function hashAll(text: string): Promise<Record<HashAlgo, string>> {
  const pairs = await Promise.all(HASH_ALGOS.map(async (a) => [a, await hashText(text, a)] as const))
  return Object.fromEntries(pairs) as Record<HashAlgo, string>
}
