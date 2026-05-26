import { useCallback } from 'react'
import { ToolHeader } from '@/components/ToolHeader'
import { EncodeDecodeTool } from '@/components/EncodeDecodeTool'
import { LinkIcon } from '@/components/icons'
import { decodeUrl, encodeUrl } from './url'

export default function UrlPage() {
  const transform = useCallback(
    (input: string, mode: 'encode' | 'decode') =>
      mode === 'encode' ? encodeUrl(input) : decodeUrl(input),
    [],
  )

  return (
    <div className="space-y-5">
      <ToolHeader
        name="URL 인코드"
        description="URL 구성요소 인코드·디코드(encodeURIComponent). 한글·특수문자 안전, 모든 처리는 브라우저에서만."
        icon={LinkIcon}
      />
      <EncodeDecodeTool
        toolName="URL"
        transform={transform}
        inputPlaceholder="인코드할 텍스트 또는 디코드할 URL 문자열"
        example="검색어 = 한글 & 특수문자!"
      />
    </div>
  )
}
