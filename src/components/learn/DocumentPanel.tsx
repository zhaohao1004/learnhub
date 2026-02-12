'use client'

import { useState } from 'react'
import { MarkdownRenderer, TableOfContents } from '@/components/document'
import { Book, List } from 'lucide-react'

interface DocumentPanelProps {
  content: string
  title?: string
  showToc?: boolean
}

export default function DocumentPanel({
  content,
  title,
  showToc = true,
}: DocumentPanelProps) {
  const [tocVisible, setTocVisible] = useState(false)

  return (
    <div className="h-full flex flex-col bg-white dark:bg-gray-800 rounded-lg overflow-hidden">
      {/* 面板标题栏 */}
      <div className="flex items-center justify-between px-4 py-3 bg-gray-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-2">
          <Book className="w-5 h-5 text-blue-500" />
          <span className="text-sm font-medium text-gray-700 dark:text-gray-200">
            {title || '课程文档'}
          </span>
        </div>
        {showToc && (
          <button
            onClick={() => setTocVisible(!tocVisible)}
            className={`flex items-center gap-1 px-3 py-1.5 text-xs rounded transition-colors ${
              tocVisible
                ? 'bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-300'
                : 'text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700'
            }`}
          >
            <List className="w-4 h-4" />
            目录
          </button>
        )}
      </div>

      {/* 内容区域 */}
      <div className="flex-1 flex overflow-hidden">
        {/* 目录侧边栏 */}
        {showToc && tocVisible && (
          <div className="w-64 border-r border-gray-200 dark:border-gray-700 overflow-auto p-4 bg-gray-50 dark:bg-gray-900">
            <TableOfContents content={content} />
          </div>
        )}

        {/* Markdown 内容 */}
        <div className="flex-1 overflow-auto p-6">
          <MarkdownRenderer content={content} />
        </div>
      </div>
    </div>
  )
}
