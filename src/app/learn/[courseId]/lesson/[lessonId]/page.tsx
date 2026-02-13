'use client'

import { useState, useCallback, useEffect } from 'react'
import Link from 'next/link'
import { useParams, notFound } from 'next/navigation'
import { CodeEditor, Console, executeCode } from '@/components/code-editor'
import { VideoPlayer } from '@/components/video'
import { MarkdownRenderer } from '@/components/document'
import { TestPanel } from '@/components/code-editor/TestPanel'
import SaveLoadPanel from '@/components/code-editor/SaveLoadPanel'
import { usePyodide } from '@/hooks/usePyodide'
import { useCodeStorage } from '@/hooks/useCodeStorage'
import type { SupportedLanguage, ExecutionResult, VideoProgress, TestCase, SavedCode } from '@/types'

// TODO: 替换为 @/lib/data/courses 中的 getLesson() 和 getCourse()
// import { getCourse, getLesson } from '@/lib/data/courses'

// 临时 mock 数据 - 等待 Agent-1 完成数据层
const mockLessons: Record<string, {
  id: string
  courseId: string
  title: string
  video: {
    url: string
    duration: number
  }
  document: {
    content: string
  }
  codeTemplate?: {
    language: SupportedLanguage
    initialCode: string
    testCases?: TestCase[]
  }
  prevLessonId?: string
  nextLessonId?: string
}> = {
  'js-basics:lesson-1': {
    id: 'lesson-1',
    courseId: 'js-basics',
    title: '什么是 JavaScript',
    video: {
      url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
      duration: 600,
    },
    document: {
      content: `# 什么是 JavaScript

JavaScript 是一种轻量级的解释型编程语言，主要用于网页开发。

## 主要特点

- **动态类型**: 变量不需要预先声明类型
- **弱类型**: 可以进行隐式类型转换
- **面向对象**: 支持基于原型的面向对象编程
- **函数式**: 函数是一等公民

## 应用场景

1. 前端 Web 开发
2. 后端服务 (Node.js)
3. 移动应用 (React Native)
4. 桌面应用 (Electron)

\`\`\`javascript
// 一个简单的 JavaScript 示例
console.log('Hello, World!')
\`\`\`

## 练习

尝试在右侧的代码编辑器中运行你的第一行 JavaScript 代码！
`,
    },
    codeTemplate: {
      language: 'javascript',
      initialCode: `// 在这里写下你的第一行 JavaScript 代码
console.log('Hello, JavaScript!');

// 尝试声明一些变量
let name = '学习者';
console.log('你好, ' + name + '!');`,
      testCases: [
        {
          id: 'test-1',
          name: '输出 Hello, JavaScript!',
          input: '',
          expectedOutput: 'Hello, JavaScript!\n你好, 学习者!'
        }
      ]
    },
    nextLessonId: 'lesson-2',
  },
  'js-basics:lesson-2': {
    id: 'lesson-2',
    courseId: 'js-basics',
    title: '环境搭建',
    video: {
      url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
      duration: 900,
    },
    document: {
      content: `# 环境搭建

本章介绍如何搭建 JavaScript 开发环境。

## 浏览器开发者工具

所有现代浏览器都内置了 JavaScript 控制台：

- Chrome: F12 或 Cmd+Option+I
- Firefox: F12 或 Cmd+Option+K
- Safari: Cmd+Option+C (需要先启用开发菜单)

## Node.js

Node.js 让你可以在服务器端运行 JavaScript。

\`\`\`bash
# 检查是否安装了 Node.js
node -v

# 运行 JavaScript 文件
node script.js
\`\`\`
`,
    },
    codeTemplate: {
      language: 'javascript',
      initialCode: `// 练习：使用 console.log 输出信息
console.log('环境配置完成！');
`,
    },
    prevLessonId: 'lesson-1',
    nextLessonId: 'lesson-3',
  },
  'js-basics:lesson-3': {
    id: 'lesson-3',
    courseId: 'js-basics',
    title: '数据类型',
    video: {
      url: 'https://test-videos.co.uk/vids/bigbuckbunny/mp4/h264/360/Big_Buck_Bunny_360_10s_1MB.mp4',
      duration: 720,
    },
    document: {
      content: `# 数据类型

JavaScript 有多种数据类型，分为原始类型和引用类型。

## 原始类型

- **String**: 字符串，如 \`'hello'\` 或 \`"world"\`
- **Number**: 数字，如 \`42\` 或 \`3.14\`
- **Boolean**: 布尔值，\`true\` 或 \`false\`
- **undefined**: 未定义
- **null**: 空值
- **Symbol**: ES6 新增的唯一标识符
- **BigInt**: 大整数

## 引用类型

- **Object**: 对象
- **Array**: 数组
- **Function**: 函数

## 类型检查

使用 \`typeof\` 操作符检查类型：

\`\`\`javascript
typeof 'hello' // 'string'
typeof 42      // 'number'
typeof true    // 'boolean'
typeof {}      // 'object'
typeof []      // 'object' (数组也是对象)
\`\`\`

## 练习

尝试在代码编辑器中使用 \`typeof\` 检查不同数据类型！
`,
    },
    codeTemplate: {
      language: 'javascript',
      initialCode: `// 练习：数据类型检查

// 检查字符串类型
console.log(typeof 'Hello');

// 检查数字类型
console.log(typeof 42);

// 检查布尔类型
console.log(typeof true);

// 检查对象类型
console.log(typeof { name: 'Alice' });

// 检查数组（注意：数组也是 object）
console.log(typeof [1, 2, 3]);

// 检查 undefined
console.log(typeof undefined);`,
    },
    prevLessonId: 'lesson-2',
    nextLessonId: 'lesson-4',
  },
  'js-basics:lesson-4': {
    id: 'lesson-4',
    courseId: 'js-basics',
    title: '变量声明',
    video: {
      url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
      duration: 1080,
    },
    document: {
      content: `# 变量声明

JavaScript 有三种声明变量的方式：\`var\`、\`let\` 和 \`const\`。

## var

\`var\` 是 ES5 的声明方式，存在变量提升。

\`\`\`javascript
var name = 'John';
\`\`\`

## let

\`let\` 是 ES6 新增的，具有块级作用域。

\`\`\`javascript
let age = 25;
age = 26; // 可以重新赋值
\`\`\`

## const

\`const\` 声明常量，一旦赋值不能更改。

\`\`\`javascript
const PI = 3.14159;
// PI = 3.14; // 错误！不能重新赋值
\`\`\`

## 最佳实践

- 默认使用 \`const\`
- 需要重新赋值时使用 \`let\`
- 避免使用 \`var\`
`,
    },
    codeTemplate: {
      language: 'javascript',
      initialCode: `// 练习变量声明

// 使用 const 声明一个常量
const greeting = 'Hello';

// 使用 let 声明一个可以改变的变量
let count = 0;
count = count + 1;

console.log(greeting);
console.log('Count:', count);`,
    },
    prevLessonId: 'lesson-3',
    nextLessonId: 'lesson-5',
  },
}

const mockCourses: Record<string, {
  id: string
  title: string
  chapters: Array<{
    id: string
    lessons: Array<{ id: string }>
  }>
}> = {
  'js-basics': {
    id: 'js-basics',
    title: 'JavaScript 基础入门',
    chapters: [
      { id: 'chapter-1', lessons: [{ id: 'lesson-1' }, { id: 'lesson-2' }, { id: 'lesson-3' }] },
      { id: 'chapter-2', lessons: [{ id: 'lesson-4' }, { id: 'lesson-5' }, { id: 'lesson-6' }] },
    ],
  },
}

export default function LessonPage() {
  const params = useParams()
  const courseId = params.courseId as string
  const lessonId = params.lessonId as string

  // 获取课时数据
  const lessonKey = `${courseId}:${lessonId}`
  const lesson = mockLessons[lessonKey]
  const course = mockCourses[courseId]

  // 所有 hooks 必须在条件返回之前调用
  const [mounted, setMounted] = useState(false)
  const [code, setCode] = useState(lesson?.codeTemplate?.initialCode || '')
  const [language, setLanguage] = useState<SupportedLanguage>(
    lesson?.codeTemplate?.language || 'javascript'
  )
  const [output, setOutput] = useState<ExecutionResult[]>([])
  const [isRunning, setIsRunning] = useState(false)
  const [videoProgress, setVideoProgress] = useState(0)

  // Pyodide 状态（用于 Python 加载指示）
  const { isLoading: pyodideLoading, progress: pyodideProgress } = usePyodide()

  // 代码存储（自动保存）
  const { autoSaveCode, save } = useCodeStorage({ autoSave: true, debounceMs: 2000 })

  useEffect(() => {
    setMounted(true)
  }, [])

  // 自动保存代码
  useEffect(() => {
    if (code && lessonId) {
      autoSaveCode(
        `autosave_${lessonKey}`,
        code,
        language,
        lesson?.title || 'untitled',
        lessonId
      )
    }
  }, [code, language, lessonId, lessonKey, lesson?.title, autoSaveCode])

  // 加载已保存的代码
  const handleLoadSavedCode = useCallback((savedCode: SavedCode) => {
    setCode(savedCode.content)
    setLanguage(savedCode.language)
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
  const handleClearOutput = useCallback(() => {
    setOutput([])
  }, [])

  // 语言切换
  const handleLanguageChange = useCallback((newLanguage: SupportedLanguage) => {
    setLanguage(newLanguage)
    setOutput([])
  }, [])

  // 如果数据不存在，显示占位内容
  if (mounted && !lesson) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            课时不存在
          </h1>
          <Link
            href={`/learn/${courseId}`}
            className="text-blue-600 hover:text-blue-700 dark:text-blue-400"
          >
            返回课程
          </Link>
        </div>
      </div>
    )
  }

  // 导航链接
  const prevLessonHref = lesson?.prevLessonId
    ? `/learn/${courseId}/lesson/${lesson.prevLessonId}`
    : null
  const nextLessonHref = lesson?.nextLessonId
    ? `/learn/${courseId}/lesson/${lesson.nextLessonId}`
    : null

  return (
    <div className="h-screen flex flex-col bg-gray-100 dark:bg-gray-950">
      {/* 顶部标题栏 */}
      <header className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 px-4 py-3 flex-shrink-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link
              href={`/learn/${courseId}`}
              className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </Link>
            <div>
              <h1 className="font-semibold text-gray-900 dark:text-white">
                {lesson?.title || '加载中...'}
              </h1>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {course?.title}
              </p>
            </div>
          </div>

          {/* 运行按钮 */}
          <div className="flex items-center gap-4">
            {/* 保存/加载面板 */}
            <SaveLoadPanel
              currentCode={code}
              currentLanguage={language}
              currentFilename={lesson?.title}
              lessonId={lessonId}
              onLoad={handleLoadSavedCode}
            />

            <button
              onClick={handleRun}
              disabled={isRunning || (language === 'python' && pyodideLoading)}
              className={`
                px-4 py-2 rounded-lg font-medium flex items-center gap-2 transition-all text-sm
                ${
                  isRunning || (language === 'python' && pyodideLoading)
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed dark:bg-gray-700 dark:text-gray-400'
                    : 'bg-green-600 hover:bg-green-500 text-white'
                }
              `}
            >
              {isRunning ? (
                <>
                  <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  运行中
                </>
              ) : language === 'python' && pyodideLoading ? (
                <>
                  <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  加载 Python... {pyodideProgress}%
                </>
              ) : (
                <>
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  运行代码
                </>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* 主内容区域 - 学习布局 */}
      <div className="flex-1 flex overflow-hidden">
        {/* 左侧：视频 + 文档 */}
        <div className="w-1/2 flex flex-col border-r border-gray-200 dark:border-gray-800 overflow-hidden">
          {/* 视频区域 */}
          <div className="flex-shrink-0 bg-black">
            {lesson?.video ? (
              <VideoPlayer
                video={{
                  id: lesson.id,
                  title: lesson.title,
                  description: '',
                  url: lesson.video.url,
                  duration: lesson.video.duration,
                }}
                onProgress={(progress: VideoProgress) => setVideoProgress(progress.currentTime)}
              />
            ) : (
              <div className="w-full aspect-video flex items-center justify-center text-gray-500">
                视频加载中...
              </div>
            )}
          </div>

          {/* 文档区域 */}
          <div className="flex-1 overflow-auto bg-white dark:bg-gray-900 p-6">
            {lesson?.document ? (
              <MarkdownRenderer content={lesson.document.content} />
            ) : (
              <div className="text-gray-500">文档加载中...</div>
            )}
          </div>
        </div>

        {/* 右侧：代码编辑器 + 控制台 */}
        <div className="w-1/2 flex flex-col overflow-hidden">
          {/* 代码编辑器 */}
          <div className="flex-1 min-h-0">
            <CodeEditor
              value={code}
              onChange={setCode}
              language={language}
              onLanguageChange={handleLanguageChange}
            />
          </div>

          {/* 控制台 */}
          <div className="h-48 flex-shrink-0 border-t border-gray-200 dark:border-gray-800">
            <Console output={output} onClear={handleClearOutput} />
          </div>

          {/* 测试面板 */}
          {lesson?.codeTemplate?.testCases && lesson.codeTemplate.testCases.length > 0 && (
            <TestPanel
              testCases={lesson.codeTemplate.testCases}
              code={code}
              language={language}
            />
          )}
        </div>
      </div>

      {/* 底部导航栏 */}
      <footer className="bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 px-6 py-3 flex-shrink-0">
        <div className="flex items-center justify-between">
          {/* 上一课 */}
          {prevLessonHref ? (
            <Link
              href={prevLessonHref}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              <span>上一课</span>
            </Link>
          ) : (
            <div className="w-20" />
          )}

          {/* 进度指示 */}
          <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>视频进度: {Math.floor(videoProgress)}s</span>
          </div>

          {/* 下一课 */}
          {nextLessonHref ? (
            <Link
              href={nextLessonHref}
              className="flex items-center gap-2 text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 transition-colors"
            >
              <span>下一课</span>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          ) : (
            <div className="w-20" />
          )}
        </div>
      </footer>
    </div>
  )
}
