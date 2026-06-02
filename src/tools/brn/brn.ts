// 사업자등록번호 (BRN) 검증.
// 국세청 공식 체크섬 알고리즘 + 사업자 종류 디코딩.

const WEIGHTS = [1, 3, 7, 1, 3, 7, 1, 3, 5]

export interface ValidationStep {
  digit: number
  weight: number
  product: number
}

export interface BrnResult {
  ok: boolean
  /** 실패 이유 (한국어) */
  reason?: string
  /** 입력에서 정제한 10자리 숫자 */
  normalized?: string
  /** 입력된 검증 1자리 (10번째) */
  actualCheck?: number
  /** 알고리즘이 계산한 검증 1자리 */
  computedCheck?: number
  /** 1~9번 자리의 가중치 곱·합 단계 */
  steps?: ValidationStep[]
  /** 9번째 × 5 의 10 나눈 몫 (가산값) */
  extra?: number
  /** 가중치 곱·합 (extra 포함 전) */
  sum?: number
  /** 4~5번 자리로 디코딩한 사업자 종류 */
  businessType?: string
}

/** 사업자등록번호 검증. 하이픈 유무 자동 처리. */
export function validateBrn(input: string): BrnResult {
  const digits = input.replace(/\D/g, '')

  if (digits.length === 0) return { ok: false, reason: '사업자등록번호를 입력하세요.' }
  if (digits.length !== 10) {
    return { ok: false, reason: `10자리 숫자가 필요합니다 (현재 ${digits.length}자리).` }
  }

  const steps: ValidationStep[] = []
  let sum = 0
  for (let i = 0; i < 9; i++) {
    const d = parseInt(digits[i], 10)
    const w = WEIGHTS[i]
    const product = d * w
    sum += product
    steps.push({ digit: d, weight: w, product })
  }

  // 9번째(0-indexed 8) 자리 × 5 의 10 나눈 몫을 더한다
  const ninth = parseInt(digits[8], 10)
  const extra = Math.floor((ninth * 5) / 10)
  const total = sum + extra

  const computedCheck = (10 - (total % 10)) % 10
  const actualCheck = parseInt(digits[9], 10)
  const ok = computedCheck === actualCheck

  return {
    ok,
    reason: ok ? undefined : '체크섬이 일치하지 않습니다.',
    normalized: digits,
    actualCheck,
    computedCheck,
    steps,
    extra,
    sum,
    businessType: decodeBusinessType(digits.slice(3, 5)),
  }
}

/** 입력 도중 자동 포맷: `2208183676` → `220-81-83676` */
export function formatBrn(input: string): string {
  const d = input.replace(/\D/g, '').slice(0, 10)
  if (d.length <= 3) return d
  if (d.length <= 5) return `${d.slice(0, 3)}-${d.slice(3)}`
  return `${d.slice(0, 3)}-${d.slice(3, 5)}-${d.slice(5)}`
}

/** 검증을 통과하는 임의의 BRN 을 생성한다 (테스트 데이터). */
export function generateBrn(): string {
  const digits: number[] = []
  for (let i = 0; i < 9; i++) digits.push(Math.floor(Math.random() * 10))
  let sum = 0
  for (let i = 0; i < 9; i++) sum += digits[i] * WEIGHTS[i]
  sum += Math.floor((digits[8] * 5) / 10)
  digits.push((10 - (sum % 10)) % 10)
  return digits.join('')
}

function decodeBusinessType(bb: string): string {
  const n = parseInt(bb, 10)
  if (isNaN(n)) return '알 수 없음'
  if (n <= 79) return '개인 과세사업자'
  if (n === 80) return '아파트관리사무소·다단계판매원 등'
  if (n === 81 || n === 86 || n === 87 || n === 88) return '영리법인 본점'
  if (n === 82) return '비영리법인 (본·지점)'
  if (n === 83) return '국가·지방자치단체·지방자치단체조합'
  if (n === 84) return '외국법인 본·지점 및 연락사무소'
  if (n === 85) return '영리법인 지점'
  if (n === 89) return '법인격 없는 사단·재단·단체'
  if (n >= 90 && n <= 99) return '개인 면세사업자'
  return '알 수 없음'
}
