// Pyodide 类型定义
export interface PyodideInterface {
  runPythonAsync: (code: string) => Promise<unknown>
  runPython: (code: string) => unknown
  globals: unknown
  FS: unknown
}

declare global {
  interface Window {
    loadPyodide?: (config: { indexURL: string }) => Promise<PyodideInterface>
  }
}

let pyodideInstance: PyodideInterface | null = null
let loadingState = {
  isLoading: false,
  progress: 0,
  error: null as string | null
}

/**
 * 从 CDN 加载 Pyodide 脚本
 */
function loadPyodideScript(): Promise<void> {
  return new Promise((resolve, reject) => {
    if (typeof window.loadPyodide === 'function') {
      resolve()
      return
    }

    const script = document.createElement('script')
    script.src = 'https://cdn.jsdelivr.net/pyodide/v0.26.2/full/pyodide.js'
    script.onload = () => resolve()
    script.onerror = () => reject(new Error('Failed to load Pyodide script'))
    document.head.appendChild(script)
  })
}

/**
 * 加载 Pyodide 实例（单例模式）
 * 确保在整个应用中只加载一次
 */
export async function loadPyodideOnce(): Promise<PyodideInterface> {
  // 确保只在客户端运行
  if (typeof window === 'undefined') {
    throw new Error('Pyodide can only be loaded in the browser')
  }

  if (pyodideInstance) return pyodideInstance

  // 防止重复加载
  if (loadingState.isLoading) {
    // 等待现有加载完成
    while (loadingState.isLoading) {
      await new Promise(resolve => setTimeout(resolve, 100))
    }
    if (pyodideInstance) return pyodideInstance
    throw new Error(loadingState.error || 'Pyodide 加载失败')
  }

  loadingState.isLoading = true
  loadingState.progress = 0

  try {
    // 加载 Pyodide 脚本
    await loadPyodideScript()
    loadingState.progress = 30

    // 初始化 Pyodide
    if (!window.loadPyodide) {
      throw new Error('Pyodide script failed to load')
    }
    pyodideInstance = await window.loadPyodide({
      indexURL: 'https://cdn.jsdelivr.net/pyodide/v0.26.2/full/',
    })

    loadingState.progress = 100
    return pyodideInstance
  } catch (error) {
    loadingState.error = error instanceof Error ? error.message : String(error)
    throw error
  } finally {
    loadingState.isLoading = false
  }
}

/**
 * 获取当前加载状态
 */
export function getLoadingState() {
  return { ...loadingState }
}

/**
 * 获取已加载的 Pyodide 实例（不触发加载）
 */
export function getPyodideInstance(): PyodideInterface | null {
  return pyodideInstance
}

/**
 * 重置 Pyodide 实例（用于测试或重新加载）
 */
export function resetPyodideInstance(): void {
  pyodideInstance = null
  loadingState = {
    isLoading: false,
    progress: 0,
    error: null
  }
}
