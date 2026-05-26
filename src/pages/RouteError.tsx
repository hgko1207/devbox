import { Link, useRouteError } from 'react-router-dom'

export default function RouteError() {
  const error = useRouteError()
  const message = error instanceof Error ? error.message : String(error ?? '')
  // 흔한 경우: 새 배포로 기존 청크 해시가 사라져 lazy import 가 실패한다.
  const isChunkError = /loading chunk|dynamically imported module|failed to fetch|importing a module script/i.test(
    message,
  )

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 px-4 text-center">
      <p className="text-4xl" aria-hidden="true">
        ⚠️
      </p>
      <h1 className="text-lg font-semibold">문제가 발생했습니다</h1>
      <p className="max-w-md text-sm text-zinc-500 dark:text-zinc-400">
        {isChunkError
          ? '앱이 업데이트되어 이 페이지를 다시 불러와야 합니다. 새로고침해 주세요.'
          : '페이지를 표시하는 중 오류가 발생했습니다.'}
      </p>
      <div className="flex gap-2">
        <button type="button" className="btn btn-primary" onClick={() => window.location.reload()}>
          새로고침
        </button>
        <Link to="/" className="btn">
          홈으로
        </Link>
      </div>
    </div>
  )
}
