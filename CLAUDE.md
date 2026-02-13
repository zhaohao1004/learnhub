# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

LearnHub 是一个在线学习平台，整合了视频课程、交互式文档和在线编程环境。

**核心功能 (v0.3.0)**：
- 视频播放 - 支持播放控制、倍速播放
- 文档阅读 - Markdown 渲染、代码高亮、目录导航
- 代码练习 - 在线编辑运行 JS/TS/Python 代码
- **整合学习页面** - 视频+文档+代码三栏布局
- **深色模式** - next-themes 主题切换
- **代码保存/加载** - localStorage 持久化
- **测试验证** - 运行测试用例验证代码
- **用户认证** - Supabase Auth（ToB 场景，管理员创建用户）
- **管理员后台** - 用户管理（CRUD）

详细需求见 `docs/PRD.md` 和 `docs/PRD_backlog.md`。

## Development Commands

```bash
npm install      # 安装依赖
npm run dev      # 启动开发服务器 (localhost:3000)
npm run build    # 构建生产版本
npm start        # 启动生产服务器
npm run lint     # 代码检查

# E2E 测试
npx playwright test                          # 运行所有测试
npx playwright test tests/e2e/pages/         # 运行页面测试
npx playwright test --ui                     # UI 模式调试
npx playwright show-report                   # 查看测试报告
```

**注意**：开发时如遇到缓存问题，执行 `rm -rf .next && npm run dev`

## Architecture

```
src/
├── app/                              # Next.js App Router
│   ├── (auth)/login/                 # 登录页面
│   ├── admin/                        # 管理员后台
│   │   ├── layout.tsx                # 管理后台布局（权限检查）
│   │   ├── page.tsx                  # 管理后台首页
│   │   └── users/page.tsx            # 用户管理
│   ├── api/admin/users/              # 用户 CRUD API
│   │   ├── route.ts                  # 用户列表 API
│   │   └── [id]/route.ts             # 单用户 API
│   ├── learn/                        # 整合学习页面 (核心)
│   │   ├── page.tsx                  # 课程列表
│   │   └── [courseId]/
│   │       ├── page.tsx              # 课程详情
│   │       └── lesson/[lessonId]/page.tsx  # 学习页面
│   ├── video/demo/page.tsx           # 视频播放 demo
│   ├── document/demo/page.tsx        # 文档阅读 demo
│   ├── playground/page.tsx           # 代码编辑器 demo
│   ├── layout.tsx                    # 根布局 (Provider)
│   └── page.tsx                      # 首页
├── components/
│   ├── auth/                         # 认证组件
│   │   ├── LoginForm.tsx             # 登录表单
│   │   └── UserMenu.tsx              # 用户菜单
│   ├── admin/                        # 管理后台组件
│   │   ├── UserList.tsx              # 用户列表
│   │   └── UserForm.tsx              # 用户表单
│   ├── learn/                        # 整合学习布局
│   │   ├── LearningLayout.tsx        # 三栏布局
│   │   ├── VideoPanel.tsx            # 视频面板
│   │   ├── DocumentPanel.tsx         # 文档面板
│   │   ├── CodePanel.tsx             # 代码面板
│   │   ├── LessonHeader.tsx          # 课时头部导航
│   │   └── index.ts                  # 导出
│   ├── code-editor/                  # 代码编辑器
│   │   ├── CodeEditor.tsx            # Monaco 编辑器封装
│   │   ├── Console.tsx               # 控制台输出
│   │   ├── SaveLoadPanel.tsx         # 保存/加载面板
│   │   ├── TestPanel.tsx             # 测试验证面板
│   │   ├── Sandbox.ts                # JS/TS/Python 执行沙箱
│   │   └── index.ts                  # 导出
│   ├── video/                        # 视频播放
│   │   ├── VideoPlayer.tsx           # 播放器组件
│   │   ├── VideoControls.tsx         # 控制栏
│   │   └── index.ts                  # 导出
│   ├── document/                     # 文档渲染
│   │   ├── MarkdownRenderer.tsx      # Markdown 渲染
│   │   ├── CodeBlock.tsx             # 代码块高亮
│   │   ├── TableOfContents.tsx       # 目录导航
│   │   └── index.ts                  # 导出
│   ├── layout/                       # 布局组件
│   │   └── Header.tsx                # 顶部导航
│   └── ui/                           # UI 组件
│       ├── ThemeProvider.tsx         # 主题 Provider
│       └── ThemeToggle.tsx           # 主题切换按钮
├── hooks/
│   ├── useAuth.tsx                   # 认证状态 Hook + AuthProvider
│   ├── usePyodide.ts                 # Pyodide 加载状态 hook
│   └── useCodeStorage.ts             # 代码存储 hook
├── lib/
│   ├── supabase/                     # Supabase 客户端
│   │   ├── client.ts                 # 浏览器端
│   │   ├── server.ts                 # 服务端 + 管理员客户端
│   │   └── middleware.ts             # Session 刷新 + 路由保护
│   ├── pyodide-loader.ts             # Pyodide 单例加载器 (CDN)
│   ├── storage.ts                    # localStorage 抽象
│   ├── test-runner.ts                # 测试用例执行器
│   └── data/courses.ts               # 课程数据
├── middleware.ts                     # Next.js 中间件（认证保护）
└── types/index.ts                    # TypeScript 类型定义

tests/e2e/                            # Playwright E2E 测试
├── auth.setup.ts                     # 认证测试 setup
├── utils/helpers.ts                  # 测试工具函数
├── pages/                            # 页面测试
│   ├── home.spec.ts                  # 首页测试
│   ├── courses.spec.ts               # 课程列表测试
│   └── lesson.spec.ts                # 课时页面测试
├── features/                         # 功能测试
│   ├── code-execution.spec.ts        # 代码执行测试
│   ├── code-storage.spec.ts          # 代码存储测试
│   ├── test-validation.spec.ts       # 测试验证测试
│   └── theme-toggle.spec.ts          # 主题切换测试
└── integration/                      # 集成测试
    └── learning-flow.spec.ts         # 学习流程测试
```

## Key Routes

| 路由 | 说明 | 认证 |
|------|------|------|
| `/` | 首页 | 公开 |
| `/login` | 登录页面 | 公开 |
| `/learn` | 课程列表 | 公开 |
| `/learn/[courseId]` | 课程详情 | 公开 |
| `/learn/[courseId]/lesson/[lessonId]` | 整合学习页面 | 公开 |
| `/admin` | 管理后台首页 | 管理员 |
| `/admin/users` | 用户管理 | 管理员 |
| `/playground` | 代码编辑器 | 公开 |
| `/video/demo` | 视频播放 Demo | 公开 |
| `/document/demo` | 文档阅读 Demo | 公开 |

## Tech Stack

| 层级 | 技术选型 |
|------|----------|
| 框架 | Next.js 15 (App Router) |
| 语言 | TypeScript |
| 样式 | Tailwind CSS + next-themes |
| 认证 | Supabase Auth + @supabase/ssr |
| 数据库 | Supabase PostgreSQL (RLS) |
| 视频播放 | react-player (动态导入) |
| Markdown | react-markdown + remark-gfm |
| 代码编辑器 | @monaco-editor/react |
| 面板布局 | react-resizable-panels |
| Python 运行 | pyodide (CDN) |
| 代码高亮 | prism-react-renderer |
| 图标 | lucide-react |
| E2E 测试 | @playwright/test |

## Important Notes

### Supabase 认证
- ToB 场景：禁用公开注册，管理员通过 Dashboard 或 API 创建用户
- 使用 `getUser()` 验证 JWT（安全），不要用 `getSession()`
- 管理员操作需要 `service_role` key（仅服务端）
- Profile 通过数据库触发器自动创建

### Pyodide CDN 加载
Pyodide 必须通过 CDN 脚本加载，不能通过 npm import（会导致 SSR 问题）

### ReactPlayer SSR 问题
必须使用动态导入：
```tsx
const ReactPlayer = dynamic(() => import('react-player/lazy'), { ssr: false })
```

### React Hooks 顺序
所有 hooks 必须在任何条件返回之前调用，否则会导致 "Rendered fewer hooks than expected" 错误。

### 数据流
- 课程数据: `src/lib/data/courses.ts`
- 类型定义: `src/types/index.ts`
- 用户认证: `src/hooks/useAuth.tsx` + Supabase
- 代码存储: localStorage (`learnhub_saved_codes`)

## Environment Variables

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIs...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIs...  # 仅服务端
```

## Documentation

| 文档 | 说明 |
|------|------|
| `docs/PRD.md` | 产品需求文档 |
| `docs/PRD_backlog.md` | 待开发功能积压 |

## Development Status

- v0.1.0: MVP (已完成)
- v0.2.0: Python 执行、代码保存、测试验证、深色模式 (已完成)
- v0.3.0: 用户认证、管理员后台 (已完成)
- v0.4.0: 进度追踪、课程管理、云端数据持久化 (待开发)
