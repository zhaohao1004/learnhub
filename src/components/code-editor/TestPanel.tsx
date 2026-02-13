'use client'

import { useState } from 'react'
import type { TestCase, TestResult } from '@/types'
import { runTests, calculatePassRate } from '@/lib/test-runner'
import type { SupportedLanguage } from '@/types'

interface TestPanelProps {
  testCases: TestCase[]
  code: string
  language: SupportedLanguage
  onRunTests?: () => void
}

export function TestPanel({ testCases, code, language, onRunTests }: TestPanelProps) {
  const [results, setResults] = useState<TestResult[]>([])
  const [isRunning, setIsRunning] = useState(false)
  const [expandedTest, setExpandedTest] = useState<string | null>(null)

  const handleRunTests = async () => {
    setIsRunning(true)
    try {
      const testResults = await runTests(code, testCases, language)
      setResults(testResults)
      onRunTests?.()
    } catch (error) {
      console.error('Test execution failed:', error)
    } finally {
      setIsRunning(false)
    }
  }

  const passRate = results.length > 0 ? calculatePassRate(results) : 0
  const passedCount = results.filter(r => r.passed).length

  if (testCases.length === 0) {
    return null
  }

  return (
    <div className="border-t border-gray-700 bg-gray-900">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-2 border-b border-gray-700">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-gray-200">测试用例</span>
          <span className="text-xs text-gray-400">({testCases.length})</span>
        </div>
        <button
          onClick={handleRunTests}
          disabled={isRunning}
          className="px-3 py-1 text-xs font-medium bg-green-600 hover:bg-green-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white rounded transition-colors"
        >
          {isRunning ? '运行中...' : '运行测试'}
        </button>
      </div>

      {/* Results Summary */}
      {results.length > 0 && (
        <div className="flex items-center gap-4 px-4 py-2 bg-gray-800/50 border-b border-gray-700">
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-400">通过率:</span>
            <span className={`text-sm font-medium ${passRate === 100 ? 'text-green-400' : passRate >= 50 ? 'text-yellow-400' : 'text-red-400'}`}>
              {passRate}%
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-400">通过:</span>
            <span className="text-sm font-medium text-green-400">{passedCount}</span>
            <span className="text-gray-500">/</span>
            <span className="text-sm text-gray-400">{results.length}</span>
          </div>
        </div>
      )}

      {/* Test Cases List */}
      <div className="divide-y divide-gray-700 max-h-64 overflow-y-auto">
        {testCases.map((test, index) => {
          const result = results.find(r => r.testCaseId === test.id)
          const isExpanded = expandedTest === test.id

          return (
            <div key={test.id} className="px-4 py-2">
              <div
                className="flex items-center justify-between cursor-pointer"
                onClick={() => result && setExpandedTest(isExpanded ? null : test.id)}
              >
                <div className="flex items-center gap-2">
                  {/* Status Icon */}
                  {result ? (
                    result.passed ? (
                      <svg className="w-4 h-4 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    ) : (
                      <svg className="w-4 h-4 text-red-400" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    )
                  ) : (
                    <div className="w-4 h-4 rounded-full border-2 border-gray-500" />
                  )}
                  <span className="text-sm text-gray-200">{test.name || `测试 ${index + 1}`}</span>
                </div>
                {result && (
                  <span className="text-xs text-gray-400">
                    {result.executionTime?.toFixed(0)}ms
                  </span>
                )}
              </div>

              {/* Expanded Details */}
              {isExpanded && result && (
                <div className="mt-2 pl-6 space-y-2">
                  {result.error ? (
                    <div className="text-xs text-red-400 bg-red-900/20 p-2 rounded">
                      错误: {result.error}
                    </div>
                  ) : (
                    <>
                      <div className="text-xs">
                        <span className="text-gray-400">期望输出:</span>
                        <pre className="mt-1 p-2 bg-gray-800 rounded text-green-400 overflow-x-auto">
                          {result.expectedOutput || '(空)'}
                        </pre>
                      </div>
                      <div className="text-xs">
                        <span className="text-gray-400">实际输出:</span>
                        <pre className={`mt-1 p-2 bg-gray-800 rounded overflow-x-auto ${result.passed ? 'text-green-400' : 'text-red-400'}`}>
                          {result.actualOutput || '(空)'}
                        </pre>
                      </div>
                    </>
                  )}
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
