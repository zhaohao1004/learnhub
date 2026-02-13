import { executeCode } from '@/components/code-editor/Sandbox'
import type { TestCase, TestResult, SupportedLanguage } from '@/types'

/**
 * 标准化输出，便于比较
 */
function normalizeOutput(output: string): string {
  return output.trim().replace(/\r\n/g, '\n')
}

/**
 * 运行测试用例
 */
export async function runTests(
  code: string,
  tests: TestCase[],
  language: SupportedLanguage
): Promise<TestResult[]> {
  const results: TestResult[] = []

  for (const test of tests) {
    const startTime = performance.now()

    try {
      // 如果有输入，将输入与代码组合
      const fullCode = test.input
        ? `${code}\n// Test input\n${test.input}`
        : code

      const execution = await executeCode(fullCode, language)

      const actualOutput = normalizeOutput(execution.output)
      const expectedOutput = normalizeOutput(test.expectedOutput)

      results.push({
        testCaseId: test.id,
        passed: !execution.error && actualOutput === expectedOutput,
        actualOutput: execution.output,
        expectedOutput: test.expectedOutput,
        error: execution.error,
        executionTime: performance.now() - startTime
      })
    } catch (error) {
      results.push({
        testCaseId: test.id,
        passed: false,
        actualOutput: '',
        expectedOutput: test.expectedOutput,
        error: error instanceof Error ? error.message : String(error),
        executionTime: performance.now() - startTime
      })
    }
  }

  return results
}

/**
 * 计算测试通过率
 */
export function calculatePassRate(results: TestResult[]): number {
  if (results.length === 0) return 0
  const passed = results.filter(r => r.passed).length
  return Math.round((passed / results.length) * 100)
}

/**
 * 获取测试摘要
 */
export function getTestSummary(results: TestResult[]): {
  total: number
  passed: number
  failed: number
} {
  const total = results.length
  const passed = results.filter((r) => r.passed).length
  const failed = total - passed

  return { total, passed, failed }
}
