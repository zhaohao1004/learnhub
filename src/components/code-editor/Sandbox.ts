import type { ExecutionResult } from '@/types'
import { loadPyodideOnce } from '@/lib/pyodide-loader'

// 执行超时时间（毫秒）
const EXECUTION_TIMEOUT = 5000

/**
 * 重定向 console 输出的辅助函数
 */
function createConsoleCapture(): {
  logs: string[]
  originalConsole: typeof console
  restore: () => void
} {
  const logs: string[] = []
  const originalConsole = { ...console }

  const captureLog = (...args: unknown[]) => {
    const message = args
      .map((arg) => {
        if (typeof arg === 'object') {
          try {
            return JSON.stringify(arg, null, 2)
          } catch {
            return String(arg)
          }
        }
        return String(arg)
      })
      .join(' ')
    logs.push(message)
  }

  console.log = captureLog
  console.warn = captureLog
  console.error = captureLog
  console.info = captureLog

  return {
    logs,
    originalConsole,
    restore: () => {
      console.log = originalConsole.log
      console.warn = originalConsole.warn
      console.error = originalConsole.error
      console.info = originalConsole.info
    },
  }
}

/**
 * 简单的 TypeScript 类型移除器
 * 将 TypeScript 代码转换为 JavaScript 代码
 */
function stripTypeScriptTypes(code: string): string {
  let result = code

  // 移除类型注解（如 : string, : number 等）
  result = result.replace(/:\s*(string|number|boolean|any|void|never|object|unknown|bigint|symbol|null|undefined|Date|Array<[^>]+>|Map<[^>]+>|Set<[^>]+>|Record<[^>]+>|\{[^}]+\}|[A-Z][a-zA-Z0-9]*)\s*([,)={;[\n\r])/g, '$2')

  // 移除接口定义
  result = result.replace(/interface\s+\w+\s*\{[^}]*\}/g, '')

  // 移除类型定义
  result = result.replace(/type\s+\w+\s*=\s*[^;]+;/g, '')

  // 移除泛型参数
  result = result.replace(/<[^>]+>/g, '')

  // 移除 as 类型断言
  result = result.replace(/\s+as\s+\w+/g, '')

  // 移除 private/public/protected/readonly 修饰符
  result = result.replace(/(private|public|protected|readonly)\s+/g, '')

  // 清理多余的空行
  result = result.replace(/\n\s*\n\s*\n/g, '\n\n')

  return result.trim()
}

/**
 * 在沙箱中执行 JavaScript 代码
 */
export async function executeJavaScript(code: string): Promise<ExecutionResult> {
  const startTime = performance.now()

  return new Promise((resolve) => {
    const capture = createConsoleCapture()

    // 设置超时
    const timeoutId = setTimeout(() => {
      capture.restore()
      resolve({
        output: capture.logs.join('\n'),
        error: '执行超时（超过 5 秒）',
        executionTime: EXECUTION_TIMEOUT,
      })
    }, EXECUTION_TIMEOUT)

    try {
      // 使用 new Function 创建沙箱环境
      const sandboxFunction = new Function(code)
      sandboxFunction()

      clearTimeout(timeoutId)
      capture.restore()

      const executionTime = performance.now() - startTime
      resolve({
        output: capture.logs.join('\n'),
        executionTime,
      })
    } catch (error) {
      clearTimeout(timeoutId)
      capture.restore()

      const executionTime = performance.now() - startTime
      const errorMessage = error instanceof Error ? error.message : String(error)

      resolve({
        output: capture.logs.join('\n'),
        error: errorMessage,
        executionTime,
      })
    }
  })
}

/**
 * 编译并执行 TypeScript 代码
 */
export async function executeTypeScript(code: string): Promise<ExecutionResult> {
  const startTime = performance.now()

  try {
    // 将 TypeScript 转换为 JavaScript
    const jsCode = stripTypeScriptTypes(code)

    // 使用 JavaScript 执行器运行
    const result = await executeJavaScript(jsCode)

    return {
      ...result,
      executionTime: performance.now() - startTime,
    }
  } catch (error) {
    const executionTime = performance.now() - startTime
    const errorMessage = error instanceof Error ? error.message : String(error)

    return {
      output: '',
      error: `TypeScript 编译错误: ${errorMessage}`,
      executionTime,
    }
  }
}

/**
 * 在 Pyodide 中执行 Python 代码
 */
export async function executePython(code: string): Promise<ExecutionResult> {
  const startTime = performance.now()

  try {
    // 加载 Pyodide 实例
    const pyodide = await loadPyodideOnce()

    // 设置超时处理
    const timeoutPromise = new Promise<ExecutionResult>((_, reject) => {
      setTimeout(() => {
        reject(new Error('执行超时（超过 5 秒）'))
      }, EXECUTION_TIMEOUT)
    })

    // 执行 Python 代码
    const executionPromise = async (): Promise<ExecutionResult> => {
      // 使用 StringIO 捕获 stdout 输出
      await pyodide.runPythonAsync(`
import sys
from io import StringIO
_sys_stdout_capture = sys.stdout
sys.stdout = StringIO()
`)

      let result: unknown = undefined
      let hasError = false
      let errorMessage = ''

      try {
        // 执行用户代码
        result = await pyodide.runPythonAsync(code)
      } catch (err) {
        hasError = true
        errorMessage = err instanceof Error ? err.message : String(err)
      }

      // 获取捕获的输出
      const output = await pyodide.runPythonAsync(`
_captured = sys.stdout.getvalue()
sys.stdout = _sys_stdout_capture
_captured
`)

      const executionTime = performance.now() - startTime

      if (hasError) {
        return {
          output: output as string,
          error: errorMessage,
          executionTime,
        }
      }

      // 如果有返回值且输出为空，显示返回值
      let finalOutput = output as string
      if (result !== undefined && result !== null && !finalOutput.trim()) {
        finalOutput = String(result)
      }

      return {
        output: finalOutput,
        executionTime,
      }
    }

    // 使用 Promise.race 处理超时
    return await Promise.race([executionPromise(), timeoutPromise])
  } catch (error) {
    const executionTime = performance.now() - startTime
    const errorMessage = error instanceof Error ? error.message : String(error)

    // 检查是否是 Pyodide 加载错误
    if (errorMessage.includes('Failed to fetch') || errorMessage.includes('loadPyodide')) {
      return {
        output: '',
        error: 'Python 环境加载失败，请检查网络连接后重试。',
        executionTime,
      }
    }

    return {
      output: '',
      error: errorMessage,
      executionTime,
    }
  }
}

/**
 * 执行代码的统一入口
 */
export async function executeCode(
  code: string,
  language: 'javascript' | 'typescript' | 'python'
): Promise<ExecutionResult> {
  switch (language) {
    case 'javascript':
      return executeJavaScript(code)
    case 'typescript':
      return executeTypeScript(code)
    case 'python':
      return executePython(code)
    default:
      return {
        output: '',
        error: `不支持的语言: ${language}`,
      }
  }
}
