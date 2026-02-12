import Link from 'next/link'
// TODO: 替换为 @/lib/data/courses 中的 getCourses()
// import { getCourses } from '@/lib/data/courses'

// 临时 mock 数据 - 等待 Agent-1 完成数据层
const mockCourses = [
  {
    id: 'js-basics',
    title: 'JavaScript 基础入门',
    description: '从零开始学习 JavaScript，掌握编程基础',
    chapters: 5,
    lessons: 15,
    duration: '3小时',
    level: '入门',
  },
  {
    id: 'typescript-advanced',
    title: 'TypeScript 进阶',
    description: '深入学习 TypeScript 的高级特性和最佳实践',
    chapters: 4,
    lessons: 12,
    duration: '2.5小时',
    level: '进阶',
  },
  {
    id: 'react-fundamentals',
    title: 'React 核心概念',
    description: '学习 React 组件化开发，构建现代 Web 应用',
    chapters: 6,
    lessons: 18,
    duration: '4小时',
    level: '入门',
  },
]

export default function CoursesPage() {
  // TODO: 使用真实数据
  // const courses = getCourses()
  const courses = mockCourses

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-950">
      {/* 顶部导航 */}
      <header className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                课程中心
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-1">
                选择一门课程开始你的学习之旅
              </p>
            </div>
            <Link
              href="/"
              className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
            >
              返回首页
            </Link>
          </div>
        </div>
      </header>

      {/* 课程列表 */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((course) => (
            <Link
              key={course.id}
              href={`/learn/${course.id}`}
              className="group block bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 overflow-hidden hover:shadow-lg hover:border-blue-500 dark:hover:border-blue-400 transition-all duration-200"
            >
              {/* 课程封面 */}
              <div className="h-40 bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                <span className="text-white text-4xl font-bold opacity-20">
                  {course.title.charAt(0)}
                </span>
              </div>

              {/* 课程信息 */}
              <div className="p-5">
                <div className="flex items-center gap-2 mb-2">
                  <span className="px-2 py-0.5 text-xs font-medium bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300 rounded">
                    {course.level}
                  </span>
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    {course.duration}
                  </span>
                </div>

                <h3 className="text-lg font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                  {course.title}
                </h3>

                <p className="mt-2 text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                  {course.description}
                </p>

                <div className="mt-4 flex items-center text-sm text-gray-500 dark:text-gray-400">
                  <span>{course.chapters} 章节</span>
                  <span className="mx-2">·</span>
                  <span>{course.lessons} 课时</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </main>
  )
}
