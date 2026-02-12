'use client'

import { ArrowLeft } from 'lucide-react'

interface LessonHeaderProps {
  courseName: string
  lessonTitle: string
  lessonIndex: number
  totalLessons: number
  onBack?: () => void
}

export default function LessonHeader({
  courseName,
  lessonTitle,
  lessonIndex,
  totalLessons,
  onBack,
}: LessonHeaderProps) {
  const progress = Math.round((lessonIndex / totalLessons) * 100)

  return (
    <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4">
      <div className="flex items-center justify-between">
        {/* 左侧：返回按钮和课程信息 */}
        <div className="flex items-center gap-4">
          {onBack && (
            <button
              onClick={onBack}
              className="flex items-center justify-center w-10 h-10 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              aria-label="返回"
            >
              <ArrowLeft className="w-5 h-5 text-gray-600 dark:text-gray-300" />
            </button>
          )}
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">{courseName}</p>
            <h1 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
              {lessonTitle}
            </h1>
          </div>
        </div>

        {/* 右侧：进度显示 */}
        <div className="flex items-center gap-4">
          <div className="text-sm text-gray-500 dark:text-gray-400">
            {lessonIndex} / {totalLessons} 课时
          </div>
          <div className="flex items-center gap-2">
            <div className="w-32 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
              <div
                className="h-full bg-blue-500 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              {progress}%
            </span>
          </div>
        </div>
      </div>
    </header>
  )
}
