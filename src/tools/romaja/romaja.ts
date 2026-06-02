// 한글 → 로마자 변환. 국립국어원 로마자 표기법 (2000년 개정) 기반.
//
// 주의: 모든 음운 변화를 다루지는 않습니다.
//   적용된 규칙: 받침↔초성 연음(ㅇ), 자음 동화 일부 (ㄴ+ㄹ/ㄹ+ㄴ → ㄹㄹ,
//   ㄱ/ㄷ/ㅂ + ㄴ/ㅁ → 비음화)
//   미적용: ㅎ 격음화, 구개음화, 경음화 등 — 정확한 표기는 국립국어원
//   가이드를 참고하세요.

const INITIALS = [
  'g',
  'kk',
  'n',
  'd',
  'tt',
  'r',
  'm',
  'b',
  'pp',
  's',
  'ss',
  '', // ㅇ
  'j',
  'jj',
  'ch',
  'k',
  't',
  'p',
  'h',
] as const

const VOWELS = [
  'a',
  'ae',
  'ya',
  'yae',
  'eo',
  'e',
  'yeo',
  'ye',
  'o',
  'wa',
  'wae',
  'oe',
  'yo',
  'u',
  'wo',
  'we',
  'wi',
  'yu',
  'eu',
  'ui',
  'i',
] as const

// 받침 종료 (다음 음절이 자음 초성이거나 단어 끝일 때)
const FINALS_END = [
  '',
  'k', // ㄱ
  'k', // ㄲ
  'k', // ㄳ
  'n', // ㄴ
  'n', // ㄵ
  'n', // ㄶ
  't', // ㄷ
  'l', // ㄹ
  'k', // ㄺ
  'm', // ㄻ
  'p', // ㄼ
  'l', // ㄽ
  't', // ㄾ
  'p', // ㄿ
  'l', // ㅀ
  'm', // ㅁ
  'p', // ㅂ
  'p', // ㅄ
  't', // ㅅ
  't', // ㅆ
  'ng', // ㅇ
  't', // ㅈ
  't', // ㅊ
  'k', // ㅋ
  't', // ㅌ
  'p', // ㅍ
  'h', // ㅎ
] as const

// 받침이 모음 앞으로 연음될 때 (다음 음절 초성이 ㅇ)
const FINALS_BEFORE_VOWEL = [
  '',
  'g', // ㄱ
  'kk',
  'ks',
  'n', // ㄴ
  'nj',
  'nh',
  'd', // ㄷ
  'r', // ㄹ → 모음 앞에서 r
  'lg',
  'lm',
  'lb',
  'ls',
  'lt',
  'lp',
  'lh',
  'm',
  'b',
  'bs',
  's',
  'ss',
  'ng-', // ㅇ — 연음 안 됨, ng 유지
  'j',
  'ch',
  'k',
  't',
  'p',
  'h',
] as const

interface Decomp {
  initial: number
  vowel: number
  final: number
}

function decompose(syllable: string): Decomp | null {
  const code = syllable.charCodeAt(0) - 0xac00
  if (code < 0 || code >= 11172) return null
  return {
    initial: Math.floor(code / 588),
    vowel: Math.floor((code % 588) / 28),
    final: code % 28,
  }
}

export interface RomanizeOptions {
  /** 자음 동화 적용 (예: 신라 → silla). 기본 true */
  assimilate?: boolean
}

/** 한글 문자열을 로마자로 변환한다. 비한글 문자는 그대로 둔다. */
export function romanize(input: string, opts: RomanizeOptions = {}): string {
  const { assimilate = true } = opts
  const chars = Array.from(input)
  const decomps = chars.map(decompose)

  if (assimilate) applyAssimilation(decomps)

  let out = ''
  for (let i = 0; i < chars.length; i++) {
    const d = decomps[i]
    if (!d) {
      out += chars[i]
      continue
    }

    let init: string = INITIALS[d.initial]
    // ㄹ + ㄹ → ll: 앞 받침이 ㄹ이고 현재 초성이 ㄹ
    const prev = i > 0 ? decomps[i - 1] : null
    if (d.initial === 5 && prev && prev.final === 8) {
      init = 'l'
    }

    const vowel: string = VOWELS[d.vowel]

    let finalStr = ''
    if (d.final > 0) {
      const next = decomps[i + 1]
      if (next && next.initial === 11) {
        finalStr = FINALS_BEFORE_VOWEL[d.final]
      } else {
        finalStr = FINALS_END[d.final]
      }
    }

    out += init + vowel + finalStr
  }
  return out
}

// ─── 자음 동화 (in-place 수정) ─────────────────────────────────────────────
//
// 받침 인덱스: 1=ㄱ 2=ㄲ 4=ㄴ 7=ㄷ 8=ㄹ 16=ㅁ 17=ㅂ 21=ㅇ
// 초성 인덱스: 2=ㄴ 5=ㄹ 6=ㅁ

function applyAssimilation(decomps: (Decomp | null)[]): void {
  for (let i = 0; i < decomps.length - 1; i++) {
    const cur = decomps[i]
    const next = decomps[i + 1]
    if (!cur || !next) continue

    // 1) ㄴ + ㄹ → ㄹㄹ (신라 → silla)
    if (cur.final === 4 && next.initial === 5) {
      cur.final = 8
    }
    // 2) ㄹ + ㄴ → ㄹㄹ (칼날 → kallal)
    else if (cur.final === 8 && next.initial === 2) {
      next.initial = 5
    }
    // 3) ㄱ + ㄴ/ㅁ → ㅇ + ㄴ/ㅁ (작년 → jangnyeon, 국물 → gungmul)
    else if (cur.final === 1 && (next.initial === 2 || next.initial === 6)) {
      cur.final = 21
    }
    // 4) ㄷ + ㄴ/ㅁ → ㄴ + ㄴ/ㅁ (받는 → banneun)
    else if (cur.final === 7 && (next.initial === 2 || next.initial === 6)) {
      cur.final = 4
    }
    // 5) ㅂ + ㄴ/ㅁ → ㅁ + ㄴ/ㅁ (입는 → imneun)
    else if (cur.final === 17 && (next.initial === 2 || next.initial === 6)) {
      cur.final = 16
    }
  }
}

// ─── 인명 모드 ─────────────────────────────────────────────────────────────

/** 자주 쓰는 성씨의 관용 표기 (여권·명함). 기본 변환과 다른 경우만 기재. */
const SURNAME_CUSTOM: Record<string, string> = {
  이: 'Lee',
  김: 'Kim',
  박: 'Park',
  최: 'Choi',
  정: 'Jung',
  조: 'Cho',
  강: 'Kang',
  윤: 'Yoon',
  임: 'Lim',
  신: 'Shin',
  안: 'Ahn',
  유: 'Yoo',
  오: 'Oh',
  황: 'Hwang',
  전: 'Jeon',
  홍: 'Hong',
  고: 'Ko',
  문: 'Moon',
  손: 'Son',
  백: 'Baek',
  허: 'Heo',
  남: 'Nam',
  심: 'Sim',
  노: 'Noh',
  하: 'Ha',
  곽: 'Kwak',
  성: 'Sung',
  차: 'Cha',
  주: 'Joo',
  우: 'Woo',
  구: 'Koo',
  민: 'Min',
  나: 'Na',
  진: 'Jin',
  지: 'Ji',
  엄: 'Eom',
  채: 'Chae',
  원: 'Won',
  천: 'Cheon',
  방: 'Bang',
  공: 'Kong',
  현: 'Hyun',
  함: 'Ham',
  변: 'Byun',
  여: 'Yeo',
  추: 'Choo',
  도: 'Do',
  소: 'So',
  석: 'Seok',
  선: 'Sun',
}

export interface NameOptions {
  /** 성씨 표기. 'custom' = 여권 관용 표기 (Lee/Park/Kim), 'standard' = 국립국어원 표준 */
  surname?: 'custom' | 'standard'
  /** 이름 형태. 'joined' = Gildong, 'hyphen' = Gil-dong */
  given?: 'joined' | 'hyphen'
}

/** 한국 인명을 변환한다. 첫 글자는 성씨, 나머지는 이름으로 처리. */
export function romanizeName(name: string, opts: NameOptions = {}): string {
  const { surname = 'custom', given = 'joined' } = opts
  const trimmed = name.replace(/\s/g, '')
  if (trimmed.length === 0) return ''

  const surnameChar = trimmed[0]
  const givenChars = trimmed.slice(1)

  if (trimmed.length === 1) {
    if (surname === 'custom' && SURNAME_CUSTOM[surnameChar]) {
      return SURNAME_CUSTOM[surnameChar]
    }
    return capitalize(romanize(surnameChar))
  }

  let surnameRoman: string
  if (surname === 'custom' && SURNAME_CUSTOM[surnameChar]) {
    surnameRoman = SURNAME_CUSTOM[surnameChar]
  } else {
    surnameRoman = capitalize(romanize(surnameChar))
  }

  if (given === 'hyphen') {
    const parts = Array.from(givenChars).map((ch) => capitalize(romanize(ch, { assimilate: false })))
    return `${surnameRoman} ${parts.join('-')}`
  }
  // joined — 이름 전체에 자음 동화 미적용 (성+이름 결합 시 표기 안정성 우선)
  const givenRoman = capitalize(romanize(givenChars, { assimilate: false }))
  return `${surnameRoman} ${givenRoman}`
}

function capitalize(s: string): string {
  return s.length > 0 ? s[0].toUpperCase() + s.slice(1) : s
}
