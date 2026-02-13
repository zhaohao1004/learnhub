'use client'

import { useState, useCallback, useEffect, useMemo, useRef } from 'react'
import type { SavedCode, SupportedLanguage } from '@/types'
import { saveCode as storageSaveCode, loadCode as storageLoadCode, listSavedCodes, deleteCode as storageDeleteCode } from '@/lib/storage'

interface UseCodeStorageOptions {
  autoSave?: boolean
  debounceMs?: number
}

export function useCodeStorage(options: UseCodeStorageOptions = {}) {
  const { autoSave = true, debounceMs = 2000 } = options
  const [savedCodes, setSavedCodes] = useState<SavedCode[]>([])
  const [isInitialized, setIsInitialized] = useState(false)

  // 使用 ref 存储最新的 code 和 id，避免 debounce 闭包问题
  const latestCodeRef = useRef<{ id: string; code: SavedCode } | null>(null)
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null)

  // 初始化加载已保存的代码列表
  useEffect(() => {
    setSavedCodes(listSavedCodes())
    setIsInitialized(true)
  }, [])

  // 防抖保存函数
  const debouncedSave = useMemo(() => {
    return (id: string, code: SavedCode) => {
      latestCodeRef.current = { id, code }

      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current)
      }

      debounceTimerRef.current = setTimeout(() => {
        if (latestCodeRef.current) {
          const { id: saveId, code: saveCode } = latestCodeRef.current
          storageSaveCode(saveId, saveCode)
          setSavedCodes(listSavedCodes())
        }
      }, debounceMs)
    }
  }, [debounceMs])

  // 清理定时器
  useEffect(() => {
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current)
      }
    }
  }, [])

  // 手动保存
  const save = useCallback((id: string, code: SavedCode) => {
    storageSaveCode(id, code)
    setSavedCodes(listSavedCodes())
  }, [])

  // 自动保存（带防抖）
  const autoSaveCode = useCallback((id: string, content: string, language: SupportedLanguage, filename: string, lessonId?: string) => {
    if (!autoSave) return

    const code: SavedCode = {
      id,
      lessonId,
      filename,
      language,
      content,
      savedAt: new Date().toISOString(),
    }

    debouncedSave(id, code)
  }, [autoSave, debouncedSave])

  // 加载代码
  const load = useCallback((id: string): SavedCode | null => {
    return storageLoadCode(id)
  }, [])

  // 删除代码
  const deleteSavedCode = useCallback((id: string) => {
    storageDeleteCode(id)
    setSavedCodes(listSavedCodes())
  }, [])

  // 刷新列表
  const refresh = useCallback(() => {
    setSavedCodes(listSavedCodes())
  }, [])

  return {
    savedCodes,
    isInitialized,
    save,
    autoSaveCode,
    load,
    deleteSavedCode,
    refresh,
  }
}
