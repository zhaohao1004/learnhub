import type { ExecutionResult } from '@/types'

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
      // Python 支持将在后续实现
      return {
        output: '',
        error: 'Python 执行尚未实现。请使用 JavaScript 或 TypeScript。',
      }
    default:
      return {
        output: '',
        error: `不支持的语言: ${language}`,
      }
  }
}
