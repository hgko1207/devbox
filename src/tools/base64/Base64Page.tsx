import { useCallback, useState } from 'react'
import { ToolHeader } from '@/components/ToolHeader'
import { EncodeDecodeTool } from '@/components/EncodeDecodeTool'
import { CodeIcon } from '@/components/icons'
import { decodeBase64, encodeBase64 } from './base64'

export default function Base64Page() {
  const [urlSafe, setUrlSafe] = useState(false)

  const transform = useCallback(
    (input: string, mode: 'encode' | 'decode') =>
      mode === 'encode' ? encodeBase64(input, urlSafe) : decodeBase64(input),
    [urlSafe],
  )

  return (
    <div className="space-y-5">
      <ToolHeader
        name="Base64"
        description="텍스트 ↔ Base64 변환. UTF-8(한글·이모지) 안전, URL-safe 지원. 모든 처리는 브라우저에서만 이루어집니다."
        icon={CodeIcon}
      />
      <EncodeDecodeTool
        toolName="Base64"
        transform={transform}
        inputPlaceholder="인코드할 텍스트 또는 디코드할 Base64 를 입력하세요"
        example="안녕하세요 devbox 👋"
        extraControls={
          <label className="flex items-center gap-1.5 text-sm text-zinc-600 dark:text-zinc-400">
            <input
              type="checkbox"
              checked={urlSafe}
              onChange={(e) => setUrlSafe(e.target.checked)}
              className="h-4 w-4 rounded border-zinc-300 text-brand-600 focus-visible:ring-brand-500 dark:border-zinc-600"
            />
            URL-safe
          </label>
        }
      />
    </div>
  )
}
