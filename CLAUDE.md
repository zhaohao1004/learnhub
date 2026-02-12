# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

LearnHub 是一个在线学习平台 MVP Demo，整合了视频课程、交互式文档和在线编程环境。

**核心功能**：
- 视频播放 - 支持播放控制、倍速播放
- 文档阅读 - Markdown 渲染、代码高亮、目录导航
- 代码练习 - 在线编辑运行 JS/TS/Python 代码

详细需求见 `docs/PRD.md`。

## Development Commands

```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 构建生产版本
npm run build

# 启动生产服务器
npm start

# 代码检查
npm run lint
```

## Architecture

```
src/
├── app/                    # Next.js App Router 页面
│   ├── video/[id]/         # 视频播放页面
│   ├── document/[id]/      # 文档阅读页面
│   └── playground/         # 代码练习页面
├── components/
│   ├── ui/                 # 通用 UI 组件
│   ├── video/              # 视频播放组件 (Agent-1)
│   ├── document/           # 文档阅读组件 (Agent-2)
│   └── code-editor/        # 代码编辑器组件 (Agent-3)
├── lib/                    # 工具函数和沙箱
└── types/                  # TypeScript 类型定义
```

## Multi-Agent Development

项目使用多 Agent 并行开发，任务分配：

| Agent | 模块 | 组件目录 |
|-------|------|----------|
| Agent-1 | 视频播放 | `src/components/video/` |
| Agent-2 | 文档阅读 | `src/components/document/` |
| Agent-3 | 代码编辑器 | `src/components/code-editor/` |

## Tech Stack

- Next.js 15 (App Router)
- TypeScript
- Tailwind CSS
- react-player (视频)
- react-markdown + remark-gfm (文档)
- @monaco-editor/react (代码编辑器)
- pyodide (Python 运行时)
