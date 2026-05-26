// Web Worker 를 약속(Promise) 기반으로 감싼 클라이언트.
// 요청마다 고유 id 를 부여하고 응답을 매칭한다.
import type { Indent, ValidationResult } from './parser'
import type { DiffEntry } from './diff'
import type { WorkerError, WorkerRequest, WorkerResponse } from '../worker/protocol'

export class JsonWorkerError extends Error {
  workerError: WorkerError
  constructor(workerError: WorkerError) {
    super(workerError.kind === 'json' ? workerError.detail.message : workerError.message)
    this.name = 'JsonWorkerError'
    this.workerError = workerError
  }
}

// 한 호출이 이 시간을 넘기면 중단하고 워커를 재생성한다.
// (수 MB 처리도 충분한 여유. 워커가 조용히 멈춰버리는 경우 UI 가 영구 대기하는 것을 막는다.)
const CALL_TIMEOUT_MS = 60_000

interface Pending {
  resolve: (value: unknown) => void
  reject: (reason: unknown) => void
}

let worker: Worker | null = null
let seq = 0
const pending = new Map<number, Pending>()

/** 워커를 폐기한다. 다음 call() 에서 새로 생성된다. */
function disposeWorker() {
  if (worker) {
    try {
      worker.terminate()
    } catch {
      /* 무시 */
    }
    worker = null
  }
}

/** 대기 중인 모든 요청을 거부하고 워커를 폐기한다. */
function failAll(reason: unknown) {
  for (const p of pending.values()) p.reject(reason)
  pending.clear()
  disposeWorker()
}

function getWorker(): Worker {
  if (worker) return worker
  worker = new Worker(new URL('../worker/json.worker.ts', import.meta.url), {
    type: 'module',
  })
  worker.onmessage = (e: MessageEvent<WorkerResponse>) => {
    const res = e.data
    const p = pending.get(res.id)
    if (!p) return
    pending.delete(res.id)
    if (res.ok) p.resolve(res.result)
    else p.reject(new JsonWorkerError(res.error))
  }
  worker.onerror = (event) => {
    // 치명적 워커 오류: 대기 요청을 모두 거부하고 워커를 버린다.
    // worker 를 null 로 만들어 다음 call() 이 새 워커를 생성하게 한다(영구 hang 방지).
    failAll(new Error(`워커 오류: ${event.message || '알 수 없는 오류'}`))
  }
  return worker
}

function call<T>(req: WorkerRequest): Promise<T> {
  return new Promise<T>((resolve, reject) => {
    const timer = setTimeout(() => {
      if (!pending.has(req.id)) return
      pending.delete(req.id)
      // 멈춘 워커를 폐기해 다음 호출이 정상 복구되게 한다.
      disposeWorker()
      reject(new Error('처리 시간이 너무 오래 걸려 중단했습니다.'))
    }, CALL_TIMEOUT_MS)

    pending.set(req.id, {
      resolve: (value) => {
        clearTimeout(timer)
        ;(resolve as (v: unknown) => void)(value)
      },
      reject: (reason) => {
        clearTimeout(timer)
        reject(reason)
      },
    })
    getWorker().postMessage(req)
  })
}

const nextId = () => ++seq

export function formatJsonAsync(text: string, indent: Indent): Promise<string> {
  return call<string>({ id: nextId(), op: 'format', text, indent })
}

export function minifyJsonAsync(text: string): Promise<string> {
  return call<string>({ id: nextId(), op: 'minify', text })
}

export function validateJsonAsync(text: string): Promise<ValidationResult> {
  return call<ValidationResult>({ id: nextId(), op: 'validate', text })
}

export function diffJsonAsync(left: string, right: string): Promise<DiffEntry[]> {
  return call<DiffEntry[]>({ id: nextId(), op: 'diff', left, right })
}
