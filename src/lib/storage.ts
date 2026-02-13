import type { SavedCode } from '@/types'

const STORAGE_KEY = 'learnhub_saved_codes'
const STORAGE_VERSION = 1

interface StorageData {
  version: number
  data: Record<string, SavedCode>
}

function getStorageData(): StorageData {
  if (typeof window === 'undefined') {
    return { version: STORAGE_VERSION, data: {} }
  }

  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return { version: STORAGE_VERSION, data: {} }
    return JSON.parse(raw)
  } catch {
    return { version: STORAGE_VERSION, data: {} }
  }
}

export function saveCode(id: string, code: SavedCode): void {
  const storage = getStorageData()
  storage.data[id] = { ...code, savedAt: new Date().toISOString() }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(storage))
}

export function loadCode(id: string): SavedCode | null {
  const storage = getStorageData()
  return storage.data[id] || null
}

export function listSavedCodes(): SavedCode[] {
  const storage = getStorageData()
  return Object.values(storage.data).sort(
    (a, b) => new Date(b.savedAt).getTime() - new Date(a.savedAt).getTime()
  )
}

export function deleteCode(id: string): void {
  const storage = getStorageData()
  delete storage.data[id]
  localStorage.setItem(STORAGE_KEY, JSON.stringify(storage))
}
