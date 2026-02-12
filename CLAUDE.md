# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

LearnHub 是一个在线学习平台 MVP Demo，整合了视频课程、交互式文档和在线编程环境。

**核心功能**：
- 视频播放 - 支持播放控制、倍速播放
- 文档阅读 - Markdown 渲染、代码高亮、目录导航
- 代码练习 - 在线编辑运行 JS/TS 代码
- **整合学习页面** - 视频+文档+代码三栏布局，边看边练

详细需求见 `docs/PRD.md`。

## Development Commands

```bash
npm install      # 安装依赖
npm run dev      # 启动开发服务器
npm run build    # 构建生产版本
npm start        # 启动生产服务器
npm run lint     # 代码检查
```

**注意**：开发时如遇到奇怪的缓存问题，执行 `rm -rf .next && npm run dev`

## Architecture

```
src/
├── app/                           # Next.js App Router 页面
│   ├── learn/                     # 整合学习页面 (核心)
│   │   ├── page.tsx               # 课程列表
│   │   └── [courseId]/
│   │       ├── page.tsx           # 课程详情
│   │       └── lesson/[lessonId]/page.tsx  # 学习页面
│   ├── video/demo/                # 视频播放 demo
│   ├── document/demo/             # 文档阅读 demo
│   └── playground/                # 代码编辑器 demo
├── components/
│   ├── learn/                     # 整合学习布局组件
│   │   ├── LearningLayout.tsx     # 可调节三栏布局
│   │   ├── VideoPanel.tsx         # 视频面板
│   │   ├── DocumentPanel.tsx      # 文档面板
│   │   └── CodePanel.tsx          # 代码面板
│   ├── video/                     # 视频播放组件
│   ├── document/                  # 文档阅读组件
│   └── code-editor/               # 代码编辑器组件
├── lib/
│   └── data/courses.ts            # 课程数据
└── types/                         # TypeScript 类型定义
```

## Key Pages

| 路由 | 说明 |
|------|------|
| `/learn` | 课程列表 |
| `/learn/[courseId]` | 课程详情/章节列表 |
| `/learn/[courseId]/lesson/[lessonId]` | **整合学习页面**（视频+文档+代码） |

## Tech Stack

- Next.js 15 (App Router)
- TypeScript
- Tailwind CSS
- react-player (视频，需动态导入禁用 SSR)
- react-markdown + remark-gfm (文档)
- @monaco-editor/react (代码编辑器)
- react-resizable-panels (可调节面板布局)

## Important Notes

### ReactPlayer SSR 问题
`react-player` 在 SSR 时会导致 hydration 不匹配，必须使用动态导入：
```tsx
import dynamic from 'next/dynamic'
const ReactPlayer = dynamic(() => import('react-player/lazy'), { ssr: false })
```

### React Hooks 顺序
所有 hooks（useState、useCallback、useEffect 等）必须**在任何条件返回之前**调用，否则会导致 "Rendered fewer hooks than expected" 错误。

### 数据流
- 课程数据定义在 `src/lib/data/courses.ts`
- 类型定义在 `src/types/index.ts`
- 目前使用 mock 数据，后续可接入后端 API
