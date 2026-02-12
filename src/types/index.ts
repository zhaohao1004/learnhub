// 视频模块类型
export interface Video {
  id: string
  title: string
  description: string
  url: string
  duration: number
  thumbnail?: string
}

export interface VideoProgress {
  videoId: string
  currentTime: number
  completed: boolean
}

// 文档模块类型
export interface Document {
  id: string
  title: string
  content: string
  category?: string
  order?: number
}

// 代码编辑器类型
export type SupportedLanguage = 'javascript' | 'typescript' | 'python'

export interface CodeFile {
  id: string
  filename: string
  language: SupportedLanguage
  content: string
}

export interface ExecutionResult {
  output: string
  error?: string
  executionTime?: number
}

export interface TestCase {
  id: string
  name: string
  input: string
  expectedOutput: string
}

// 通用类型
export interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: string
}
