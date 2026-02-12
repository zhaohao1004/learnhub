'use client'

import React from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import CodeBlock from './CodeBlock'

interface MarkdownRendererProps {
  content: string
  className?: string
}

export default function MarkdownRenderer({ content, className = '' }: MarkdownRendererProps) {
  return (
    <div className={`prose prose-slate dark:prose-invert max-w-none ${className}`}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          // Custom code block rendering
          code({ className, children, node, ...props }) {
            const match = /language-(\w+)/.exec(className || '')
            const language = match ? match[1] : 'text'
            const codeString = String(children).replace(/\n$/, '')
            const isInline = !node?.position?.start?.line || node?.position?.start?.line === node?.position?.end?.line

            // If it's not inline and has a language or contains newlines, render as block
            if (!isInline && (!!match || codeString.includes('\n'))) {
              return <CodeBlock code={codeString} language={language} />
            }

            // Inline code
            return (
              <code
                className="bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 rounded text-sm font-mono text-pink-600 dark:text-pink-400"
                {...props}
              >
                {children}
              </code>
            )
          },
          // Add IDs to headings for TOC navigation
          h1: ({ children, ...props }) => {
            const text = String(children)
            const id = text
              .toLowerCase()
              .replace(/[^\w\u4e00-\u9fa5]+/g, '-')
              .replace(/^-+|-+$/g, '')
            return (
              <h1 id={id} className="text-3xl font-bold mt-8 mb-4 text-gray-900 dark:text-gray-100" {...props}>
                {children}
              </h1>
            )
          },
          h2: ({ children, ...props }) => {
            const text = String(children)
            const id = text
              .toLowerCase()
              .replace(/[^\w\u4e00-\u9fa5]+/g, '-')
              .replace(/^-+|-+$/g, '')
            return (
              <h2 id={id} className="text-2xl font-semibold mt-6 mb-3 text-gray-900 dark:text-gray-100" {...props}>
                {children}
              </h2>
            )
          },
          h3: ({ children, ...props }) => {
            const text = String(children)
            const id = text
              .toLowerCase()
              .replace(/[^\w\u4e00-\u9fa5]+/g, '-')
              .replace(/^-+|-+$/g, '')
            return (
              <h3 id={id} className="text-xl font-medium mt-4 mb-2 text-gray-900 dark:text-gray-100" {...props}>
                {children}
              </h3>
            )
          },
          h4: ({ children, ...props }) => {
            const text = String(children)
            const id = text
              .toLowerCase()
              .replace(/[^\w\u4e00-\u9fa5]+/g, '-')
              .replace(/^-+|-+$/g, '')
            return (
              <h4 id={id} className="text-lg font-medium mt-3 mb-2 text-gray-900 dark:text-gray-100" {...props}>
                {children}
              </h4>
            )
          },
          // Custom paragraph styling
          p: ({ children }) => (
            <p className="mb-4 leading-7 text-gray-700 dark:text-gray-300">{children}</p>
          ),
          // Custom list styling
          ul: ({ children }) => (
            <ul className="list-disc list-inside mb-4 space-y-2 text-gray-700 dark:text-gray-300">
              {children}
            </ul>
          ),
          ol: ({ children }) => (
            <ol className="list-decimal list-inside mb-4 space-y-2 text-gray-700 dark:text-gray-300">
              {children}
            </ol>
          ),
          li: ({ children }) => (
            <li className="pl-1">{children}</li>
          ),
          // Custom table styling
          table: ({ children }) => (
            <div className="overflow-x-auto mb-4">
              <table className="min-w-full border-collapse border border-gray-300 dark:border-gray-600">
                {children}
              </table>
            </div>
          ),
          thead: ({ children }) => (
            <thead className="bg-gray-100 dark:bg-gray-800">{children}</thead>
          ),
          th: ({ children }) => (
            <th className="border border-gray-300 dark:border-gray-600 px-4 py-2 text-left font-semibold text-gray-900 dark:text-gray-100">
              {children}
            </th>
          ),
          td: ({ children }) => (
            <td className="border border-gray-300 dark:border-gray-600 px-4 py-2 text-gray-700 dark:text-gray-300">
              {children}
            </td>
          ),
          // Custom blockquote styling
          blockquote: ({ children }) => (
            <blockquote className="border-l-4 border-blue-500 pl-4 py-2 my-4 bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-300">
              {children}
            </blockquote>
          ),
          // Custom link styling
          a: ({ href, children }) => (
            <a
              href={href}
              className="text-blue-600 dark:text-blue-400 hover:underline"
              target={href?.startsWith('http') ? '_blank' : undefined}
              rel={href?.startsWith('http') ? 'noopener noreferrer' : undefined}
            >
              {children}
            </a>
          ),
          // Custom hr styling
          hr: () => <hr className="my-8 border-gray-300 dark:border-gray-600" />,
          // Custom strong styling
          strong: ({ children }) => (
            <strong className="font-bold text-gray-900 dark:text-gray-100">{children}</strong>
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  )
}
