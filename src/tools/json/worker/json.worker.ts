// JSON 무거운 연산을 메인 스레드 밖에서 처리한다.
// 수 MB 입력에도 UI 가 멈추지 않도록 포맷/압축/검증/비교를 여기서 수행한다.
import {
  JsonParseError,
  formatJson,
  minifyJson,
  parseJson,
  validateJson,
} from '../lib/parser'
import { diffJson } from '../lib/diff'
import type { WorkerError, WorkerRequest, WorkerResponse } from './protocol'

// 워커 전역의 postMessage 타입을 위해 캐스팅
const ctx = self as unknown as Worker

function reply(id: number, result: unknown): void {
  const res: WorkerResponse = { id, ok: true, result }
  ctx.postMessage(res)
}

function toWorkerError(e: unknown, side?: 'left' | 'right'): WorkerError {
  if (e instanceof JsonParseError) return { kind: 'json', detail: e.detail, side }
  return { kind: 'generic', message: e instanceof Error ? e.message : String(e) }
}

function fail(id: number, e: unknown, side?: 'left' | 'right'): void {
  const res: WorkerResponse = { id, ok: false, error: toWorkerError(e, side) }
  ctx.postMessage(res)
}

self.onmessage = (e: MessageEvent<WorkerRequest>) => {
  const req = e.data
  try {
    switch (req.op) {
      case 'format':
        return reply(req.id, formatJson(req.text, req.indent))
      case 'minify':
        return reply(req.id, minifyJson(req.text))
      case 'validate':
        return reply(req.id, validateJson(req.text))
      case 'diff': {
        let leftVal: unknown
        try {
          leftVal = parseJson(req.left)
        } catch (err) {
          return fail(req.id, err, 'left')
        }
        let rightVal: unknown
        try {
          rightVal = parseJson(req.right)
        } catch (err) {
          return fail(req.id, err, 'right')
        }
        return reply(req.id, diffJson(leftVal, rightVal))
      }
    }
  } catch (err) {
    fail(req.id, err)
  }
}
