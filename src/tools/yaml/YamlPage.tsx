import { useCallback } from 'react'
import { ToolHeader } from '@/components/ToolHeader'
import { EncodeDecodeTool } from '@/components/EncodeDecodeTool'
import { YamlIcon } from '@/components/icons'
import { jsonToYaml, yamlToJson } from './yaml'

const EXAMPLE = `{
  "name": "devbox",
  "version": "1.0",
  "tools": ["json", "yaml"],
  "config": { "port": 3000, "debug": false }
}`

export default function YamlPage() {
  const transform = useCallback(
    (input: string, mode: 'encode' | 'decode') =>
      mode === 'encode' ? jsonToYaml(input) : yamlToJson(input),
    [],
  )
  return (
    <div className="space-y-5">
      <ToolHeader
        name="JSON ↔ YAML"
        description="JSON 과 YAML 사이를 변환합니다. UTF-8(한글) 안전, 모든 처리는 브라우저에서만."
        icon={YamlIcon}
      />
      <EncodeDecodeTool
        toolName="YAML"
        transform={transform}
        encodeLabel="JSON → YAML"
        decodeLabel="YAML → JSON"
        inputPlaceholder="모드에 맞춰 JSON 또는 YAML 을 입력하세요"
        example={EXAMPLE}
      />
    </div>
  )
}
