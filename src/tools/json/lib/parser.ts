// 위치(줄·열)를 추적하는 JSON 파서.
//
// 빠른 경로: 네이티브 JSON.parse 로 처리한다.
// 실패한 경우에만, 직접 작성한 파서로 다시 읽어 어디서·왜 틀렸는지(줄·열·이유)를
// 한국어로 정확히 알려준다.

export interface JsonErrorDetail {
  /** 한국어 오류 사유 */
  message: string
  /** 1부터 시작하는 줄 번호 */
  line: number
  /** 1부터 시작하는 열 번호 */
  column: number
  /** 0부터 시작하는 문자 오프셋 */
  offset: number
}

export class JsonParseError extends Error {
  detail: JsonErrorDetail
  constructor(detail: JsonErrorDetail) {
    super(detail.message)
    this.name = 'JsonParseError'
    this.detail = detail
  }
}

/** 일반 객체 여부 (직렬화 시 동일 형태로 취급할 수 있는지 판단용은 아님) */
type Json = unknown

// ── 위치 추적 파서 ────────────────────────────────────────────────────────────

// 주의: 이 파서는 *오류 위치 추적 전용*이다. parseObject/parseString/parseNumber 등의
// 반환값은 parseJson 에서 사용하지 않는다 — 정상 입력은 네이티브 JSON.parse 가 처리하고,
// 이 파서는 JSON.parse 가 실패했을 때 어디서·왜 틀렸는지만 찾는다. 큰 정수·서로게이트 등에서
// 네이티브와 결과가 다를 수 있으니 이 파서의 반환값을 데이터로 소비하지 말 것.
class LocatingParser {
  private i = 0
  private readonly text: string
  private readonly len: number

  constructor(text: string) {
    this.text = text
    this.len = text.length
  }

  parse(): Json {
    this.skipWs()
    const value = this.parseValue()
    this.skipWs()
    if (this.i < this.len) {
      this.fail(`값 이후에 불필요한 내용이 있습니다: '${this.text[this.i]}'`)
    }
    return value
  }

  private lineColOf(offset: number): { line: number; column: number } {
    let line = 1
    let column = 1
    const max = Math.min(offset, this.len)
    for (let k = 0; k < max; k++) {
      if (this.text[k] === '\n') {
        line++
        column = 1
      } else {
        column++
      }
    }
    return { line, column }
  }

  private fail(message: string, offset: number = this.i): never {
    const { line, column } = this.lineColOf(offset)
    throw new JsonParseError({ message, line, column, offset })
  }

  private skipWs(): void {
    while (this.i < this.len) {
      const c = this.text[this.i]
      if (c === ' ' || c === '\t' || c === '\n' || c === '\r') this.i++
      else break
    }
  }

  private parseValue(): Json {
    this.skipWs()
    if (this.i >= this.len) this.fail('값이 필요한데 입력이 끝났습니다.')
    const c = this.text[this.i]
    switch (c) {
      case '{':
        return this.parseObject()
      case '[':
        return this.parseArray()
      case '"':
        return this.parseString()
      case 't':
      case 'f':
        return this.parseBool()
      case 'n':
        return this.parseNull()
      case "'":
        this.fail("문자열은 작은따옴표(')가 아닌 큰따옴표(\")로 감싸야 합니다.")
        break
      default:
        if (c === '-' || (c >= '0' && c <= '9')) return this.parseNumber()
        this.fail(`예상치 못한 문자 '${c}' 입니다.`)
    }
    // 도달 불가
    return undefined
  }

  private parseObject(): Record<string, Json> {
    const obj: Record<string, Json> = {}
    this.i++ // '{'
    this.skipWs()
    if (this.text[this.i] === '}') {
      this.i++
      return obj
    }
    for (;;) {
      this.skipWs()
      if (this.i >= this.len) this.fail("'}' 가 필요한데 입력이 끝났습니다.")
      if (this.text[this.i] !== '"') {
        this.fail('객체의 키는 큰따옴표로 감싼 문자열이어야 합니다.')
      }
      const key = this.parseString()
      this.skipWs()
      if (this.text[this.i] !== ':') {
        this.fail("키 다음에는 ':' 가 와야 합니다.")
      }
      this.i++ // ':'
      const value = this.parseValue()
      obj[key] = value
      this.skipWs()
      const ch = this.text[this.i]
      if (ch === ',') {
        this.i++
        this.skipWs()
        if (this.text[this.i] === '}') {
          this.fail("쉼표 다음에 값이 없습니다. (마지막에 불필요한 쉼표가 있는지 확인하세요)")
        }
        continue
      }
      if (ch === '}') {
        this.i++
        return obj
      }
      this.fail("객체에서 ',' 또는 '}' 가 필요합니다.")
    }
  }

  private parseArray(): Json[] {
    const arr: Json[] = []
    this.i++ // '['
    this.skipWs()
    if (this.text[this.i] === ']') {
      this.i++
      return arr
    }
    for (;;) {
      const value = this.parseValue()
      arr.push(value)
      this.skipWs()
      const ch = this.text[this.i]
      if (ch === ',') {
        this.i++
        this.skipWs()
        if (this.text[this.i] === ']') {
          this.fail("쉼표 다음에 값이 없습니다. (마지막에 불필요한 쉼표가 있는지 확인하세요)")
        }
        continue
      }
      if (ch === ']') {
        this.i++
        return arr
      }
      if (this.i >= this.len) this.fail("']' 가 필요한데 입력이 끝났습니다.")
      this.fail("배열에서 ',' 또는 ']' 가 필요합니다.")
    }
  }

  private parseString(): string {
    const start = this.i
    this.i++ // 시작 '"'
    let result = ''
    while (this.i < this.len) {
      const c = this.text[this.i]
      if (c === '"') {
        this.i++
        return result
      }
      if (c === '\\') {
        this.i++
        const esc = this.text[this.i]
        switch (esc) {
          case '"':
            result += '"'
            break
          case '\\':
            result += '\\'
            break
          case '/':
            result += '/'
            break
          case 'b':
            result += '\b'
            break
          case 'f':
            result += '\f'
            break
          case 'n':
            result += '\n'
            break
          case 'r':
            result += '\r'
            break
          case 't':
            result += '\t'
            break
          case 'u': {
            const hex = this.text.slice(this.i + 1, this.i + 5)
            if (!/^[0-9a-fA-F]{4}$/.test(hex)) {
              this.fail('\\u 뒤에는 16진수 4자리가 와야 합니다.', this.i - 1)
            }
            result += String.fromCharCode(parseInt(hex, 16))
            this.i += 4
            break
          }
          default:
            this.fail(`잘못된 이스케이프 문자 '\\${esc ?? ''}' 입니다.`, this.i - 1)
        }
        this.i++
        continue
      }
      // 제어 문자는 문자열 안에서 이스케이프 없이 올 수 없다
      if (c < ' ') {
        this.fail('문자열 안에 이스케이프되지 않은 제어 문자가 있습니다.')
      }
      result += c
      this.i++
    }
    this.fail('문자열이 닫히지 않았습니다. (닫는 큰따옴표가 없습니다)', start)
  }

  private parseNumber(): number {
    const start = this.i
    if (this.text[this.i] === '-') this.i++
    if (this.text[this.i] === '0') {
      this.i++
    } else if (this.text[this.i] >= '1' && this.text[this.i] <= '9') {
      while (this.isDigit(this.text[this.i])) this.i++
    } else {
      this.fail('숫자 형식이 올바르지 않습니다.', start)
    }
    if (this.text[this.i] === '.') {
      this.i++
      if (!this.isDigit(this.text[this.i])) this.fail('소수점 뒤에 숫자가 필요합니다.')
      while (this.isDigit(this.text[this.i])) this.i++
    }
    if (this.text[this.i] === 'e' || this.text[this.i] === 'E') {
      this.i++
      if (this.text[this.i] === '+' || this.text[this.i] === '-') this.i++
      if (!this.isDigit(this.text[this.i])) this.fail('지수(e) 뒤에 숫자가 필요합니다.')
      while (this.isDigit(this.text[this.i])) this.i++
    }
    return Number(this.text.slice(start, this.i))
  }

  private parseBool(): boolean {
    if (this.text.startsWith('true', this.i)) {
      this.i += 4
      return true
    }
    if (this.text.startsWith('false', this.i)) {
      this.i += 5
      return false
    }
    this.fail('잘못된 리터럴입니다. true 또는 false 를 기대했습니다.')
  }

  private parseNull(): null {
    if (this.text.startsWith('null', this.i)) {
      this.i += 4
      return null
    }
    this.fail('잘못된 리터럴입니다. null 을 기대했습니다.')
  }

  private isDigit(c: string): boolean {
    return c >= '0' && c <= '9'
  }
}

// ── 공개 API ──────────────────────────────────────────────────────────────────

/**
 * JSON 문자열을 파싱한다. 실패하면 JsonParseError(줄·열·이유 포함)를 던진다.
 * 네이티브 JSON.parse 로 빠르게 처리하고, 실패 시에만 위치 추적 파서로 원인을 찾는다.
 */
export function parseJson(text: string): Json {
  try {
    return JSON.parse(text)
  } catch {
    // 위치를 찾기 위해 직접 파싱 (반드시 JsonParseError 를 던진다)
    new LocatingParser(text).parse()
    // 위치 추적 파서가 통과했는데 네이티브가 실패한 경우 (드묾)
    throw new JsonParseError({
      message: 'JSON 을 해석할 수 없습니다.',
      line: 1,
      column: 1,
      offset: 0,
    })
  }
}

export type ValidationResult =
  | { status: 'empty' }
  | { status: 'valid' }
  | { status: 'invalid'; error: JsonErrorDetail }

/** 입력을 검증한다. 빈 입력은 'empty', 정상은 'valid', 오류는 위치 정보를 반환한다. */
export function validateJson(text: string): ValidationResult {
  if (text.trim() === '') return { status: 'empty' }
  try {
    parseJson(text)
    return { status: 'valid' }
  } catch (e) {
    if (e instanceof JsonParseError) return { status: 'invalid', error: e.detail }
    return {
      status: 'invalid',
      error: { message: String(e), line: 1, column: 1, offset: 0 },
    }
  }
}

export type Indent = 2 | 4 | 'tab'

function indentValue(indent: Indent): number | string {
  return indent === 'tab' ? '\t' : indent
}

/** 보기 좋게 들여쓰기하여 포맷한다. */
export function formatJson(text: string, indent: Indent = 2): string {
  const value = parseJson(text)
  return JSON.stringify(value, null, indentValue(indent))
}

/** 공백을 모두 제거하여 압축(minify)한다. */
export function minifyJson(text: string): string {
  const value = parseJson(text)
  return JSON.stringify(value)
}
