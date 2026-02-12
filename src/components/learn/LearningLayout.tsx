'use client'

import { Panel, Group, Separator } from 'react-resizable-panels'
import LessonHeader from './LessonHeader'
import VideoPanel from './VideoPanel'
import DocumentPanel from './DocumentPanel'
import CodePanel from './CodePanel'
import type { Video, VideoProgress, SupportedLanguage, ExecutionResult } from '@/types'

// Lesson 接口定义
export interface Lesson {
  id: string
  title: string
  courseName: string
  lessonIndex: number
  totalLessons: number
  video: Video
  documentContent: string
  initialCode?: string
}

interface LearningLayoutProps {
  lesson: Lesson
  videoProgress?: VideoProgress
  onVideoProgress?: (progress: VideoProgress) => void
  code?: string
  onCodeChange?: (code: string) => void
  language?: SupportedLanguage
  onLanguageChange?: (lang: SupportedLanguage) => void
  output?: ExecutionResult[]
  isRunning?: boolean
  onRun?: () => void
  onClearOutput?: () => void
  onBack?: () => void
}

export default function LearningLayout({
  lesson,
  videoProgress,
  onVideoProgress,
  code,
  onCodeChange,
  language = 'javascript',
  onLanguageChange,
  output,
  isRunning,
  onRun,
  onClearOutput,
  onBack,
}: LearningLayoutProps) {
  return (
    <div className="h-screen flex flex-col bg-gray-100 dark:bg-gray-900">
      {/* 头部导航 */}
      <LessonHeader
        courseName={lesson.courseName}
        lessonTitle={lesson.title}
        lessonIndex={lesson.lessonIndex}
        totalLessons={lesson.totalLessons}
        onBack={onBack}
      />

      {/* 主内容区域 - 可调节布局 */}
      <div className="flex-1 p-4 min-h-0">
        <Group
          orientation="vertical"
          className="h-full rounded-lg overflow-hidden"
        >
          {/* 上方面板：视频 + 文档 */}
          <Panel id="top" defaultSize={55} minSize={30}>
            <Group orientation="horizontal" className="h-full">
              {/* 视频面板 */}
              <Panel id="video" defaultSize={50} minSize={30}>
                <div className="h-full p-1">
                  <VideoPanel
                    video={lesson.video}
                    onProgress={onVideoProgress}
                    initialTime={videoProgress?.currentTime}
                  />
                </div>
              </Panel>

              {/* 垂直拖拽分隔符 */}
              <Separator className="w-2 bg-gray-200 dark:bg-gray-700 hover:bg-blue-400 dark:hover:bg-blue-600 transition-colors" />

              {/* 文档面板 */}
              <Panel id="document" defaultSize={50} minSize={30}>
                <div className="h-full p-1">
                  <DocumentPanel content={lesson.documentContent} />
                </div>
              </Panel>
            </Group>
          </Panel>

          {/* 水平拖拽分隔符 */}
          <Separator className="h-2 bg-gray-200 dark:bg-gray-700 hover:bg-blue-400 dark:hover:bg-blue-600 transition-colors" />

          {/* 下方面板：代码编辑器 */}
          <Panel id="code" defaultSize={45} minSize={25}>
            <div className="h-full p-1">
              <CodePanel
                code={code ?? lesson.initialCode ?? ''}
                onCodeChange={onCodeChange}
                language={language}
                onLanguageChange={onLanguageChange}
                output={output}
                isRunning={isRunning}
                onRun={onRun}
                onClearOutput={onClearOutput}
              />
            </div>
          </Panel>
        </Group>
      </div>
    </div>
  )
}
