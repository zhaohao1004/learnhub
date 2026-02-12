'use client'

import { useState, useCallback } from 'react'
import { CodeEditor, Console, executeCode } from '@/components/code-editor'
import { Play, Loader2 } from 'lucide-react'
import type { SupportedLanguage, ExecutionResult } from '@/types'

interface CodePanelProps {
  code?: string
  onCodeChange?: (code: string) => void
  language?: SupportedLanguage
  onLanguageChange?: (lang: SupportedLanguage) => void
  output?: ExecutionResult[]
  isRunning?: boolean
  onRun?: () => void
  onClearOutput?: () => void
}

export default function CodePanel({
  code = '',
  onCodeChange,
  language = 'javascript',
  onLanguageChange,
  output: externalOutput,
  isRunning: externalIsRunning,
  onRun: externalOnRun,
  onClearOutput,
}: CodePanelProps) {
  const [internalOutput, setInternalOutput] = useState<ExecutionResult[]>([])
  const [internalIsRunning, setInternalIsRunning] = useState(false)

  // 使用外部或内部状态
  const output = externalOutput ?? internalOutput
  const isRunning = externalIsRunning ?? internalIsRunning

  // 内部运行逻辑
  const handleInternalRun = useCallback(async () => {
    if (!code.trim()) {
      return
    }

    setInternalIsRunning(true)
    try {
      const result = await executeCode(code, language)
      setInternalOutput((prev) => [...prev, result])
    } catch (error) {
      setInternalOutput((prev) => [
        ...prev,
        {
          output: '',
          error: error instanceof Error ? error.message : '执行失败',
        },
      ])
    } finally {
      setInternalIsRunning(false)
    }
  }, [code, language])

  // 内部清空逻辑
  const handleInternalClear = useCallback(() => {
    setInternalOutput([])
  }, [])

  const handleRun = externalOnRun || handleInternalRun
  const handleClear = onClearOutput || handleInternalClear

  return (
    <div className="h-full flex flex-col bg-gray-900 rounded-lg overflow-hidden">
      {/* 面板标题栏 */}
      <div className="flex items-center justify-between px-4 py-3 bg-gray-800 border-b border-gray-700">
        <div className="flex items-center gap-2">
          <svg
            className="w-5 h-5 text-green-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"
            />
          </svg>
          <span className="text-sm font-medium text-gray-200">代码练习</span>
        </div>
        <button
          onClick={handleRun}
          disabled={isRunning || !code.trim()}
          className="flex items-center gap-2 px-4 py-1.5 bg-green-600 hover:bg-green-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white text-sm font-medium rounded transition-colors"
        >
          {isRunning ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              运行中...
            </>
          ) : (
            <>
              <Play className="w-4 h-4" />
              运行
            </>
          )}
        </button>
      </div>

      {/* 编辑器和控制台分割 */}
      <div className="flex-1 flex flex-col min-h-0">
        {/* 代码编辑器 */}
        <div className="flex-1 min-h-0 border-b border-gray-700">
          <CodeEditor
            value={code}
            onChange={onCodeChange || (() => {})}
            language={language}
            onLanguageChange={onLanguageChange}
          />
        </div>

        {/* 控制台 */}
        <div className="h-48 min-h-48">
          <Console output={output} onClear={handleClear} />
        </div>
      </div>
    </div>
  )
}
