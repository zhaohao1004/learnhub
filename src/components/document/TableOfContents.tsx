'use client'

import { useMemo } from 'react'

interface TOCItem {
  id: string
  text: string
  level: number
}

interface TableOfContentsProps {
  content: string
  className?: string
}

export default function TableOfContents({ content, className = '' }: TableOfContentsProps) {
  const tocItems = useMemo(() => {
    const headingRegex = /^(#{1,6})\s+(.+)$/gm
    const items: TOCItem[] = []
    let match

    while ((match = headingRegex.exec(content)) !== null) {
      const level = match[1].length
      const text = match[2].trim()
      // Generate slug from heading text
      const id = text
        .toLowerCase()
        .replace(/[^\w\u4e00-\u9fa5]+/g, '-')
        .replace(/^-+|-+$/g, '')

      items.push({ id, text, level })
    }

    return items
  }, [content])

  const scrollToHeading = (id: string) => {
    const element = document.getElementById(id)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }

  if (tocItems.length === 0) {
    return null
  }

  const minLevel = Math.min(...tocItems.map((item) => item.level))

  return (
    <nav className={`bg-gray-50 dark:bg-gray-800 rounded-lg p-4 ${className}`}>
      <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-gray-100">
        目录
      </h3>
      <ul className="space-y-2">
        {tocItems.map((item, index) => {
          const indent = item.level - minLevel
          return (
            <li key={`${item.id}-${index}`}>
              <button
                onClick={() => scrollToHeading(item.id)}
                className="w-full text-left text-sm text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                style={{ paddingLeft: `${indent * 12}px` }}
              >
                <span className="truncate block">
                  {item.level === 1 ? (
                    <strong>{item.text}</strong>
                  ) : (
                    item.text
                  )}
                </span>
              </button>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}
