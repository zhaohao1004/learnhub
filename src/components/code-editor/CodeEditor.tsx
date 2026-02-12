'use client'

import { useRef, useEffect } from 'react'
import Editor, { OnMount } from '@monaco-editor/react'
import type { SupportedLanguage } from '@/types'

interface CodeEditorProps {
  value: string
  onChange: (value: string) => void
  language: SupportedLanguage
  onLanguageChange?: (language: SupportedLanguage) => void
  readOnly?: boolean
}

// 语言映射到 Monaco 语言标识符
const languageMap: Record<SupportedLanguage, string> = {
  javascript: 'javascript',
  typescript: 'typescript',
  python: 'python',
}

// 语言显示名称
const languageNames: Record<SupportedLanguage, string> = {
  javascript: 'JavaScript',
  typescript: 'TypeScript',
  python: 'Python',
}

export default function CodeEditor({
  value,
  onChange,
  language,
  onLanguageChange,
  readOnly = false,
}: CodeEditorProps) {
  const editorRef = useRef<unknown>(null)

  const handleEditorDidMount: OnMount = (editor) => {
    editorRef.current = editor
  }

  // 配置编辑器选项
  const editorOptions = {
    minimap: { enabled: false },
    fontSize: 14,
    lineNumbers: 'on' as const,
    roundedSelection: true,
    scrollBeyondLastLine: false,
    readOnly,
    automaticLayout: true,
    tabSize: 2,
    wordWrap: 'on' as const,
    folding: true,
    foldingStrategy: 'indentation' as const,
    renderLineHighlight: 'line' as const,
    selectOnLineNumbers: true,
    cursorBlinking: 'smooth' as const,
    cursorSmoothCaretAnimation: 'on' as const,
    smoothScrolling: true,
    padding: { top: 16, bottom: 16 },
  }

  return (
    <div className="h-full flex flex-col bg-gray-900 rounded-lg overflow-hidden">
      {/* 编辑器顶部工具栏 */}
      <div className="flex items-center justify-between px-4 py-2 bg-gray-800 border-b border-gray-700">
        <div className="flex items-center gap-2">
          <div className="flex gap-1.5">
            <div className="w-3 h-3 rounded-full bg-red-500" />
            <div className="w-3 h-3 rounded-full bg-yellow-500" />
            <div className="w-3 h-3 rounded-full bg-green-500" />
          </div>
          <span className="text-sm font-medium text-gray-300 ml-2">代码编辑器</span>
        </div>

        {/* 语言选择器 */}
        {onLanguageChange && (
          <select
            value={language}
            onChange={(e) => onLanguageChange(e.target.value as SupportedLanguage)}
            className="px-3 py-1 text-sm bg-gray-700 text-gray-200 rounded border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
          >
            {Object.entries(languageNames).map(([lang, name]) => (
              <option key={lang} value={lang}>
                {name}
              </option>
            ))}
          </select>
        )}
      </div>

      {/* Monaco 编辑器 */}
      <div className="flex-1">
        <Editor
          height="100%"
          language={languageMap[language]}
          value={value}
          onChange={(val) => onChange(val || '')}
          onMount={handleEditorDidMount}
          theme="vs-dark"
          options={editorOptions}
          loading={
            <div className="flex items-center justify-center h-full text-gray-400">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mr-3" />
              加载编辑器...
            </div>
          }
        />
      </div>
    </div>
  )
}
