'use client'

import type { ExecutionResult } from '@/types'

interface ConsoleProps {
  output: ExecutionResult[]
  onClear?: () => void
}

export default function Console({ output, onClear }: ConsoleProps) {
  return (
    <div className="h-full flex flex-col bg-gray-900 rounded-lg overflow-hidden">
      {/* 控制台头部 */}
      <div className="flex items-center justify-between px-4 py-2 bg-gray-800 border-b border-gray-700">
        <div className="flex items-center gap-2">
          <div className="flex gap-1.5">
            <div className="w-3 h-3 rounded-full bg-red-500" />
            <div className="w-3 h-3 rounded-full bg-yellow-500" />
            <div className="w-3 h-3 rounded-full bg-green-500" />
          </div>
          <span className="text-sm font-medium text-gray-300 ml-2">控制台</span>
        </div>
        {onClear && (
          <button
            onClick={onClear}
            className="px-3 py-1 text-xs text-gray-400 hover:text-white hover:bg-gray-700 rounded transition-colors"
          >
            清空
          </button>
        )}
      </div>

      {/* 控制台内容 */}
      <div className="flex-1 overflow-auto p-4 font-mono text-sm">
        {output.length === 0 ? (
          <div className="text-gray-500 italic">// 运行代码查看输出...</div>
        ) : (
          <div className="space-y-2">
            {output.map((result, index) => (
              <div key={index} className="space-y-1">
                {/* 执行时间 */}
                {result.executionTime !== undefined && (
                  <div className="text-gray-500 text-xs">
                    执行时间: {result.executionTime.toFixed(2)}ms
                  </div>
                )}

                {/* 正常输出 */}
                {result.output && (
                  <div className="text-green-400 whitespace-pre-wrap">
                    {result.output.split('\n').map((line, lineIndex) => (
                      <div key={lineIndex}>
                        <span className="text-gray-500 select-none mr-2">&gt;</span>
                        {line}
                      </div>
                    ))}
                  </div>
                )}

                {/* 错误输出 */}
                {result.error && (
                  <div className="text-red-400 whitespace-pre-wrap">
                    <span className="text-red-500 font-bold">Error: </span>
                    {result.error}
                  </div>
                )}

                {/* 分隔线 */}
                {index < output.length - 1 && (
                  <div className="border-t border-gray-700 my-2" />
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
