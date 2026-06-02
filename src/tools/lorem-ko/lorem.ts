// Lorem 한국어 — 자연스러운 한국어 더미 텍스트 생성.

import { SENTENCES } from './corpus'

export type Unit = 'paragraph' | 'sentence' | 'word'

export interface LoremOptions {
  unit: Unit
  /** 단위 개수 (1~50) */
  count: number
}

/** 더미 텍스트를 생성한다. 결정적이지 않다 (랜덤). */
export function generate(opts: LoremOptions): string {
  const count = Math.max(1, Math.min(100, Math.floor(opts.count)))

  if (opts.unit === 'sentence') {
    return Array.from({ length: count }, randomSentence).join(' ')
  }

  if (opts.unit === 'paragraph') {
    const paragraphs: string[] = []
    for (let i = 0; i < count; i++) {
      const sentences = 3 + Math.floor(Math.random() * 3) // 3~5문장
      paragraphs.push(Array.from({ length: sentences }, randomSentence).join(' '))
    }
    return paragraphs.join('\n\n')
  }

  // word — 어절 단위로 N개. 문장을 연속으로 잘라 자연스러운 흐름 유지.
  const words: string[] = []
  while (words.length < count) {
    const tokens = randomSentence().split(/\s+/).filter(Boolean)
    words.push(...tokens)
  }
  return words.slice(0, count).join(' ')
}

function randomSentence(): string {
  return SENTENCES[Math.floor(Math.random() * SENTENCES.length)]
}
