import type { Metadata } from 'next'
import './globals.css'
import { ThemeProvider } from '@/components/ui/ThemeProvider'
import { AuthProvider } from '@/hooks/useAuth'
import { Header } from '@/components/layout/Header'

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
    <html lang="zh-CN" suppressHydrationWarning>
      <body className="antialiased">
        <ThemeProvider>
          <AuthProvider>
            <Header />
            {children}
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
