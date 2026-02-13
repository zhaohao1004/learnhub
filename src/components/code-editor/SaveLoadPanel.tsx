'use client'

import { useState, useEffect } from 'react'
import type { SavedCode, SupportedLanguage } from '@/types'
import { listSavedCodes, deleteCode } from '@/lib/storage'

interface SaveLoadPanelProps {
  currentCode: string
  currentLanguage: SupportedLanguage
  currentFilename?: string
  lessonId?: string
  onSave?: (savedCode: SavedCode) => void
  onLoad?: (savedCode: SavedCode) => void
  onDelete?: (id: string) => void
}

export default function SaveLoadPanel({
  currentCode,
  currentLanguage,
  currentFilename = 'untitled',
  lessonId,
  onSave,
  onLoad,
  onDelete,
}: SaveLoadPanelProps) {
  const [savedCodes, setSavedCodes] = useState<SavedCode[]>([])
  const [selectedId, setSelectedId] = useState<string>('')
  const [isSaving, setIsSaving] = useState(false)
  const [lastSavedAt, setLastSavedAt] = useState<string | null>(null)

  // 加载已保存的代码列表
  useEffect(() => {
    setSavedCodes(listSavedCodes())
  }, [])

  // 生成唯一 ID
  const generateId = () => {
    return `code_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  }

  // 手动保存
  const handleSave = () => {
    setIsSaving(true)
    const id = generateId()
    const now = new Date().toISOString()
    const savedCode: SavedCode = {
      id,
      lessonId,
      filename: currentFilename,
      language: currentLanguage,
      content: currentCode,
      savedAt: now,
    }

    // 保存到 localStorage
    const stored = localStorage.getItem('learnhub_saved_codes')
    let data: { version: number; data: Record<string, SavedCode> } = { version: 1, data: {} }
    if (stored) {
      try {
        data = JSON.parse(stored)
      } catch {
        // ignore
      }
    }
    data.data[id] = savedCode
    localStorage.setItem('learnhub_saved_codes', JSON.stringify(data))

    // 更新状态
    setSavedCodes(listSavedCodes())
    setLastSavedAt(now)
    setIsSaving(false)
    onSave?.(savedCode)
  }

  // 加载选中的代码
  const handleLoad = () => {
    if (!selectedId) return
    const code = savedCodes.find((c) => c.id === selectedId)
    if (code) {
      onLoad?.(code)
    }
  }

  // 删除选中的代码
  const handleDelete = () => {
    if (!selectedId) return
    deleteCode(selectedId)
    setSavedCodes(listSavedCodes())
    setSelectedId('')
    onDelete?.(selectedId)
  }

  // 格式化时间
  const formatTime = (isoString: string) => {
    const date = new Date(isoString)
    return date.toLocaleString('zh-CN', {
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  return (
    <div className="flex items-center gap-3">
      {/* 保存按钮 */}
      <button
        onClick={handleSave}
        disabled={isSaving || !currentCode.trim()}
        className="px-3 py-1.5 text-xs font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed rounded transition-colors flex items-center gap-1.5"
      >
        <svg
          className="w-3.5 h-3.5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4"
          />
        </svg>
        {isSaving ? '保存中...' : '保存'}
      </button>

      {/* 上次保存时间 */}
      {lastSavedAt && (
        <span className="text-xs text-gray-500">
          已保存: {formatTime(lastSavedAt)}
        </span>
      )}

      {/* 分隔线 */}
      <div className="w-px h-5 bg-gray-700" />

      {/* 已保存代码下拉列表 */}
      <select
        value={selectedId}
        onChange={(e) => setSelectedId(e.target.value)}
        className="px-3 py-1.5 text-xs bg-gray-700 text-gray-200 rounded border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer min-w-[160px]"
      >
        <option value="">选择已保存的代码...</option>
        {savedCodes.map((code) => (
          <option key={code.id} value={code.id}>
            {code.filename} ({formatTime(code.savedAt)})
          </option>
        ))}
      </select>

      {/* 加载按钮 */}
      <button
        onClick={handleLoad}
        disabled={!selectedId}
        className="px-3 py-1.5 text-xs font-medium text-gray-300 bg-gray-700 hover:bg-gray-600 disabled:text-gray-500 disabled:cursor-not-allowed rounded transition-colors"
      >
        加载
      </button>

      {/* 删除按钮 */}
      <button
        onClick={handleDelete}
        disabled={!selectedId}
        className="px-3 py-1.5 text-xs font-medium text-red-400 hover:text-red-300 hover:bg-gray-700 disabled:text-gray-500 disabled:cursor-not-allowed rounded transition-colors"
      >
        删除
      </button>
    </div>
  )
}
