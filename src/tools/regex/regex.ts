// 정규식 매치 (JS / ECMAScript).

export interface Match {
  index: number
  match: string
  groups: string[]
}

/** 패턴/플래그로 매치 목록 계산. 잘못된 패턴이면 한국어 오류를 throw. */
export function findMatches(pattern: string, flags: string, text: string): Match[] {
  // matchAll 은 g 플래그가 필요하다.
  const f = flags.includes('g') ? flags : flags + 'g'
  let re: RegExp
  try {
    re = new RegExp(pattern, f)
  } catch (e) {
    throw new Error('정규식 오류: ' + (e instanceof Error ? e.message : String(e)))
  }
  const out: Match[] = []
  for (const m of text.matchAll(re)) {
    out.push({ index: m.index ?? 0, match: m[0], groups: m.slice(1) as string[] })
    // zero-width 매치(예: 'a*' on 'bbb')에서 무한 루프를 방지.
    if (m[0] === '') break
    // 너무 많은 매치도 방어적으로 컷.
    if (out.length >= 1000) break
  }
  return out
}
