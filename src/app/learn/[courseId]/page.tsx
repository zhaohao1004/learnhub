import Link from 'next/link'
import { notFound } from 'next/navigation'
// TODO: 替换为 @/lib/data/courses 中的 getCourse()
// import { getCourse } from '@/lib/data/courses'

// 临时 mock 数据 - 等待 Agent-1 完成数据层
const mockCourses: Record<string, {
  id: string
  title: string
  description: string
  chapters: Array<{
    id: string
    title: string
    lessons: Array<{
      id: string
      title: string
      duration: string
    }>
  }>
}> = {
  'js-basics': {
    id: 'js-basics',
    title: 'JavaScript 基础入门',
    description: '从零开始学习 JavaScript，掌握编程基础',
    chapters: [
      {
        id: 'chapter-1',
        title: '第一章：JavaScript 简介',
        lessons: [
          { id: 'lesson-1', title: '什么是 JavaScript', duration: '10:00' },
          { id: 'lesson-2', title: '环境搭建', duration: '15:00' },
          { id: 'lesson-3', title: '第一个程序', duration: '12:00' },
        ],
      },
      {
        id: 'chapter-2',
        title: '第二章：变量与数据类型',
        lessons: [
          { id: 'lesson-4', title: '变量声明', duration: '18:00' },
          { id: 'lesson-5', title: '基本数据类型', duration: '20:00' },
          { id: 'lesson-6', title: '类型转换', duration: '15:00' },
        ],
      },
      {
        id: 'chapter-3',
        title: '第三章：运算符与表达式',
        lessons: [
          { id: 'lesson-7', title: '算术运算符', duration: '16:00' },
          { id: 'lesson-8', title: '比较运算符', duration: '14:00' },
          { id: 'lesson-9', title: '逻辑运算符', duration: '12:00' },
        ],
      },
    ],
  },
  'typescript-advanced': {
    id: 'typescript-advanced',
    title: 'TypeScript 进阶',
    description: '深入学习 TypeScript 的高级特性和最佳实践',
    chapters: [
      {
        id: 'chapter-1',
        title: '第一章：类型系统基础',
        lessons: [
          { id: 'lesson-1', title: '类型注解', duration: '15:00' },
          { id: 'lesson-2', title: '接口定义', duration: '18:00' },
        ],
      },
    ],
  },
  'react-fundamentals': {
    id: 'react-fundamentals',
    title: 'React 核心概念',
    description: '学习 React 组件化开发，构建现代 Web 应用',
    chapters: [
      {
        id: 'chapter-1',
        title: '第一章：React 入门',
        lessons: [
          { id: 'lesson-1', title: 'React 简介', duration: '12:00' },
          { id: 'lesson-2', title: 'JSX 语法', duration: '20:00' },
        ],
      },
    ],
  },
}

interface CoursePageProps {
  params: Promise<{
    courseId: string
  }>
}

export default async function CoursePage({ params }: CoursePageProps) {
  const { courseId } = await params

  // TODO: 使用真实数据
  // const course = getCourse(courseId)
  const course = mockCourses[courseId]

  if (!course) {
    notFound()
  }

  // 计算总课时
  const totalLessons = course.chapters.reduce(
    (sum, chapter) => sum + chapter.lessons.length,
    0
  )

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-950">
      {/* 顶部导航 */}
      <header className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div>
              <Link
                href="/learn"
                className="text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 flex items-center gap-1 mb-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                返回课程列表
              </Link>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                {course.title}
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-1">
                {course.description}
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* 课程信息卡 */}
      <div className="max-w-7xl mx-auto px-6 py-6">
        <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 p-4 flex items-center gap-6">
          <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
            <span>{course.chapters.length} 章节</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
            <span>{totalLessons} 课时</span>
          </div>
        </div>
      </div>

      {/* 章节列表 */}
      <div className="max-w-7xl mx-auto px-6 pb-12">
        <div className="space-y-6">
          {course.chapters.map((chapter, chapterIndex) => (
            <div
              key={chapter.id}
              className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 overflow-hidden"
            >
              {/* 章节标题 */}
              <div className="px-5 py-4 bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
                <h2 className="font-semibold text-gray-900 dark:text-white">
                  {chapter.title}
                </h2>
              </div>

              {/* 课时列表 */}
              <div className="divide-y divide-gray-100 dark:divide-gray-800">
                {chapter.lessons.map((lesson, lessonIndex) => {
                  const isFirstLesson = chapterIndex === 0 && lessonIndex === 0

                  return (
                    <Link
                      key={lesson.id}
                      href={`/learn/${courseId}/lesson/${lesson.id}`}
                      className="flex items-center justify-between px-5 py-4 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                    >
                      <div className="flex items-center gap-4">
                        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-700 text-sm font-medium text-gray-600 dark:text-gray-300">
                          {lessonIndex + 1}
                        </div>
                        <span className="text-gray-900 dark:text-white">
                          {lesson.title}
                        </span>
                        {isFirstLesson && (
                          <span className="px-2 py-0.5 text-xs font-medium bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300 rounded">
                            开始学习
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                        <span>{lesson.duration}</span>
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </div>
                    </Link>
                  )
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  )
}
