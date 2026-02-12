'use client'

import { useState, useCallback } from 'react'
import type { SupportedLanguage, ExecutionResult } from '@/types'
import { CodeEditor, Console, executeCode } from '@/components/code-editor'

// 默认代码模板
const defaultTemplates: Record<SupportedLanguage, string> = {
  javascript: `// JavaScript 示例
function fibonacci(n) {
  if (n <= 1) return n;
  return fibonacci(n - 1) + fibonacci(n - 2);
}

console.log('Fibonacci sequence:');
for (let i = 0; i < 10; i++) {
  console.log(\`fib(\${i}) = \${fibonacci(i)}\`);
}
`,
  typescript: `// TypeScript 示例
interface User {
  name: string;
  age: number;
}

function greet(user: User): string {
  return \`Hello, \${user.name}! You are \${user.age} years old.\`;
}

const alice: User = { name: 'Alice', age: 25 };
console.log(greet(alice));
`,
  python: `# Python 示例
def fibonacci(n):
    if n <= 1:
        return n
    return fibonacci(n - 1) + fibonacci(n - 2)

print("Fibonacci sequence:")
for i in range(10):
    print(f"fib({i}) = {fibonacci(i)}")
`,
}

export default function PlaygroundPage() {
  const [language, setLanguage] = useState<SupportedLanguage>('javascript')
  const [code, setCode] = useState(defaultTemplates.javascript)
  const [output, setOutput] = useState<ExecutionResult[]>([])
  const [isRunning, setIsRunning] = useState(false)

  // 处理语言变更
  const handleLanguageChange = useCallback((newLanguage: SupportedLanguage) => {
    setLanguage(newLanguage)
    setCode(defaultTemplates[newLanguage])
    setOutput([])
  }, [])

  // 运行代码
  const handleRun = useCallback(async () => {
    setIsRunning(true)
    try {
      const result = await executeCode(code, language)
      setOutput((prev) => [...prev, result])
    } catch (error) {
      setOutput((prev) => [
        ...prev,
        {
          output: '',
          error: error instanceof Error ? error.message : '执行失败',
        },
      ])
    } finally {
      setIsRunning(false)
    }
  }, [code, language])

  // 清空控制台
  const handleClear = useCallback(() => {
    setOutput([])
  }, [])

  return (
    <main className="min-h-screen bg-gray-950 text-white">
      {/* 顶部导航栏 */}
      <header className="border-b border-gray-800 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">代码练习</h1>
            <p className="text-gray-400 text-sm mt-1">
              在线编写和运行 JavaScript、TypeScript 代码
            </p>
          </div>
          <button
            onClick={handleRun}
            disabled={isRunning}
            className={`
              px-6 py-2.5 rounded-lg font-medium flex items-center gap-2 transition-all
              ${
                isRunning
                  ? 'bg-gray-700 text-gray-400 cursor-not-allowed'
                  : 'bg-green-600 hover:bg-green-500 text-white shadow-lg shadow-green-600/25'
              }
            `}
          >
            {isRunning ? (
              <>
                <svg
                  className="animate-spin h-5 w-5"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                运行中...
              </>
            ) : (
              <>
                <svg
                  className="h-5 w-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                运行代码
              </>
            )}
          </button>
        </div>
      </header>

      {/* 主内容区域 */}
      <div className="max-w-7xl mx-auto p-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-[calc(100vh-180px)]">
          {/* 左侧：代码编辑器 */}
          <div className="min-h-[400px]">
            <CodeEditor
              value={code}
              onChange={setCode}
              language={language}
              onLanguageChange={handleLanguageChange}
            />
          </div>

          {/* 右侧：控制台输出 */}
          <div className="min-h-[400px]">
            <Console output={output} onClear={handleClear} />
          </div>
        </div>

        {/* 快捷键提示 */}
        <div className="mt-4 text-center text-gray-500 text-sm">
          <span className="inline-flex items-center gap-1">
            提示：选择语言后会自动加载默认代码模板
          </span>
        </div>
      </div>
    </main>
  )
}
