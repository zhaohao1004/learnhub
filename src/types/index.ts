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

// 测试结果
export interface TestResult {
  testCaseId: string
  passed: boolean
  actualOutput: string
  expectedOutput: string
  error?: string
  executionTime?: number
}

// 课程模块类型
export interface Course {
  id: string
  title: string
  description: string
  thumbnail?: string
  author?: string
  lessons: Lesson[]
  chapters?: Chapter[]
  createdAt: string
  updatedAt: string
}

// 章节
export interface Chapter {
  id: string
  title: string
  order: number
  lessonIds: string[]
}

// 章节/课时
export interface Lesson {
  id: string
  courseId: string
  title: string
  description?: string
  order: number
  video?: Video
  document?: LessonDocument
  codeTemplate?: CodeTemplate
  duration: number
  prevLessonId?: string
  nextLessonId?: string
}

// 课时文档
export interface LessonDocument {
  id: string
  title: string
  content: string
}

// 代码模板
export interface CodeTemplate {
  id: string
  language: SupportedLanguage
  initialCode: string
  expectedOutput?: string
  testCases?: TestCase[]
}

// 学习进度
export interface LearningProgress {
  courseId: string
  lessonId: string
  videoProgress?: VideoProgress
  codeSnapshot?: string
  completed: boolean
  lastAccessedAt: string
}

// 保存的代码
export interface SavedCode {
  id: string
  lessonId?: string
  filename: string
  language: SupportedLanguage
  content: string
  savedAt: string
}

// 通用类型
export interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: string
}

// ========== 用户认证类型 ==========

export type UserRole = 'admin' | 'user'
export type UserStatus = 'active' | 'disabled'

// 用户资料（扩展 Supabase User）
export interface Profile {
  id: string
  email: string
  name: string | null
  avatar: string | null
  role: UserRole
  status: UserStatus
  createdAt: string
  updatedAt: string
  lastLoginAt: string | null
}

// 认证状态
export interface AuthState {
  user: Profile | null
  isLoading: boolean
  isAuthenticated: boolean
}

// 管理员创建用户请求
export interface CreateUserRequest {
  email: string
  password: string
  name?: string
  role?: UserRole
}

// 管理员更新用户请求
export interface UpdateUserRequest {
  name?: string
  role?: UserRole
  status?: UserStatus
  password?: string
}
