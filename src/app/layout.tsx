import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'LearnHub - 在线学习平台',
  description: '视频课程、交互式文档和在线编程环境',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="zh-CN">
      <body className="antialiased">
        {children}
      </body>
    </html>
  )
}
