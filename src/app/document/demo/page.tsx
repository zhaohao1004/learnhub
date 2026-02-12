'use client'

import { MarkdownRenderer, TableOfContents } from '@/components/document'

const demoContent = `# JavaScript 基础教程

## 简介

JavaScript 是一种轻量级解释型编程语言。

## 变量声明

### 使用 let 和 const

\`\`\`javascript
let name = 'Alice';
const age = 25;
console.log(\`Hello, \${name}!\`);
\`\`\`

### 使用 var（不推荐）

\`\`\`javascript
var oldWay = 'legacy';
\`\`\`

## 数据类型

| 类型 | 描述 | 示例 |
|------|------|------|
| String | 字符串 | \`'hello'\` |
| Number | 数字 | \`42\` |
| Boolean | 布尔值 | \`true\` |

## 函数

\`\`\`typescript
function greet(name: string): string {
  return \`Hello, \${name}!\`;
}
\`\`\`

## 总结

- JavaScript 是动态类型语言
- 推荐使用 \`let\` 和 \`const\`
- 函数是 JavaScript 的核心概念
`

export default function DocumentPage() {
  return (
    <main className="min-h-screen p-8 bg-white dark:bg-gray-900">
      <div className="max-w-6xl mx-auto">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
            文档阅读
          </h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            LearnHub 文档渲染示例 - 支持 Markdown、代码高亮和目录导航
          </p>
        </header>

        <div className="flex gap-8">
          {/* Sidebar with Table of Contents */}
          <aside className="hidden lg:block w-64 flex-shrink-0">
            <div className="sticky top-8">
              <TableOfContents content={demoContent} />
            </div>
          </aside>

          {/* Main content area */}
          <article className="flex-1 min-w-0">
            <div className="bg-white dark:bg-gray-800 rounded-lg p-8 shadow-sm border border-gray-200 dark:border-gray-700">
              <MarkdownRenderer content={demoContent} />
            </div>
          </article>
        </div>
      </div>
    </main>
  )
}
