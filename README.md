# LearnHub

一个现代化的在线学习平台，整合了视频课程、交互式文档和在线编程环境。

## ✨ 核心功能

- 📺 **视频播放** - 支持播放控制、倍速播放
- 📖 **文档阅读** - Markdown 渲染、代码高亮、目录导航
- 💻 **代码练习** - 在线编辑运行 JS/TS/Python 代码
- 🎯 **整合学习页面** - 视频+文档+代码三栏布局
- 🌙 **深色模式** - 主题切换
- 💾 **代码保存/加载** - localStorage 持久化
- ✅ **测试验证** - 运行测试用例验证代码
- 🔐 **用户认证** - Supabase Auth（ToB 场景）
- 👮 **管理员后台** - 用户管理（CRUD）

## 🚀 快速开始

### 安装依赖

```bash
npm install
```

### 配置环境变量

创建 `.env.local` 文件：

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

### 运行开发服务器

```bash
npm run dev
```

访问 [http://localhost:3000](http://localhost:3000)

## 🛠️ 技术栈

| 层级 | 技术 |
|------|------|
| 框架 | Next.js 15 (App Router) |
| 语言 | TypeScript |
| 样式 | Tailwind CSS + next-themes |
| 认证 | Supabase Auth |
| 数据库 | Supabase PostgreSQL |
| 视频播放 | react-player |
| Markdown | react-markdown + remark-gfm |
| 代码编辑器 | Monaco Editor |
| Python 运行 | Pyodide |
| E2E 测试 | Playwright |

## 📦 主要页面

| 路由 | 说明 |
|------|------|
| `/` | 首页 |
| `/learn` | 课程列表 |
| `/learn/[courseId]/lesson/[lessonId]` | 整合学习页面 |
| `/playground` | 代码编辑器 |
| `/admin` | 管理后台（需管理员权限） |
| `/admin/users` | 用户管理 |

## 🧪 测试

```bash
# 运行所有测试
npx playwright test

# UI 模式调试
npx playwright test --ui

# 查看测试报告
npx playwright show-report
```

## 📁 项目结构

```
src/
├── app/              # Next.js App Router 页面
├── components/       # React 组件
│   ├── learn/       # 整合学习布局
│   ├── code-editor/ # 代码编辑器
│   ├── video/       # 视频播放器
│   ├── document/    # 文档渲染
│   └── auth/        # 认证组件
├── hooks/           # 自定义 Hooks
├── lib/             # 工具库和配置
└── types/           # TypeScript 类型定义
```

## 📚 文档

- [产品需求文档](./docs/PRD.md)
- [待开发功能](./docs/PRD_backlog.md)
- [开发指南](./CLAUDE.md)

## 📄 License

MIT
