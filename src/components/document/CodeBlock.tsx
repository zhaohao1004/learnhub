'use client'

import { useState, useCallback } from 'react'
import { Highlight, themes } from 'prism-react-renderer'

interface CodeBlockProps {
  code: string
  language: string
  filename?: string
}

export default function CodeBlock({ code, language, filename }: CodeBlockProps) {
  const [copied, setCopied] = useState(false)

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(code)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy code:', err)
    }
  }, [code])

  // Map common language aliases
  const normalizedLanguage = language.toLowerCase().replace(/^(js|ts|py)$/, (match) => {
    switch (match) {
      case 'js': return 'javascript'
      case 'ts': return 'typescript'
      case 'py': return 'python'
      default: return match
    }
  })

  return (
    <div className="relative group my-4 rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700">
      {/* Header with filename and copy button */}
      <div className="flex items-center justify-between bg-gray-100 dark:bg-gray-800 px-4 py-2 text-sm">
        <div className="flex items-center gap-2">
          <span className="text-gray-500 dark:text-gray-400 font-mono">
            {filename || normalizedLanguage}
          </span>
        </div>
        <button
          onClick={handleCopy}
          className="flex items-center gap-1 px-2 py-1 rounded text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
          title={copied ? 'Copied!' : 'Copy code'}
        >
          {copied ? (
            <>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span>Copied!</span>
            </>
          ) : (
            <>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
              <span>Copy</span>
            </>
          )}
        </button>
      </div>

      {/* Code content */}
      <Highlight
        theme={themes.vsDark}
        code={code.trim()}
        language={normalizedLanguage}
      >
        {({ className, style, tokens, getLineProps, getTokenProps }) => (
          <pre
            className={`${className} overflow-x-auto p-4 text-sm leading-relaxed`}
            style={{ ...style, margin: 0, background: '#1e1e1e' }}
          >
            {tokens.map((line, i) => (
              <div key={i} {...getLineProps({ line })} className="table-row">
                <span className="table-cell pr-4 text-right text-gray-500 select-none">
                  {i + 1}
                </span>
                <span className="table-cell">
                  {line.map((token, key) => (
                    <span key={key} {...getTokenProps({ token })} />
                  ))}
                </span>
              </div>
            ))}
          </pre>
        )}
      </Highlight>
    </div>
  )
}
