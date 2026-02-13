# 产品需求积压 (Product Backlog)

本文档存放 LearnHub 待开发功能，用于后续迭代规划。

## v0.2.0 - 功能增强 ✅ 已完成

### 1. Python 代码执行 (P1) ✅

**描述**：通过 Pyodide 在浏览器中运行 Python 代码。

**实现方案**：
- 使用 CDN 动态加载 Pyodide 脚本（避免 SSR 问题）
- `src/lib/pyodide-loader.ts` - 单例加载器
- `src/hooks/usePyodide.ts` - React 状态管理
- `src/components/code-editor/Sandbox.ts` - executePython()

**相关文件**：
- `src/lib/pyodide-loader.ts`
- `src/hooks/usePyodide.ts`
- `src/components/code-editor/Sandbox.ts`

---

### 2. 代码保存和加载 (P1) ✅

**描述**：本地保存代码草稿，支持重新加载。

**实现方案**：
- localStorage 存储 (`learnhub_saved_codes`)
- 2秒防抖自动保存
- 手动保存/加载/删除 UI

**相关文件**：
- `src/lib/storage.ts`
- `src/hooks/useCodeStorage.ts`
- `src/components/code-editor/SaveLoadPanel.tsx`

---

### 3. 测试验证功能 (P1) ✅

**描述**：运行预设测试用例验证代码正确性。

**实现方案**：
- 测试用例定义在 `codeTemplate.testCases`
- 运行测试并比较输出
- 显示通过/失败状态和详情

**相关文件**：
- `src/lib/test-runner.ts`
- `src/components/code-editor/TestPanel.tsx`
- `src/types/index.ts` (TestResult)

---

### 4. 深色模式 (P1) ✅

**描述**：支持明暗主题切换。

**实现方案**：
- `next-themes` 管理主题
- `ThemeProvider` 包裹应用
- `ThemeToggle` 切换按钮
- 持久化用户偏好

**相关文件**：
- `src/components/ui/ThemeProvider.tsx`
- `src/components/ui/ThemeToggle.tsx`
- `src/app/layout.tsx`

---

## v0.3.0 - 用户体系 ✅ 已完成

### 1. 用户认证 (P0) ✅

**描述**：ToB 场景用户认证系统，管理员创建用户，用户无法自行注册。

**实现方案**：
- 使用 Supabase Auth 进行用户认证
- `@supabase/ssr` 处理 SSR 场景
- 管理员通过 Dashboard 或 API 创建用户
- 禁用公开注册

**相关文件**：
- `src/lib/supabase/client.ts` - 浏览器端客户端
- `src/lib/supabase/server.ts` - 服务端 + 管理员客户端
- `src/lib/supabase/middleware.ts` - Session 刷新 + 路由保护
- `src/hooks/useAuth.tsx` - 认证状态 Hook + AuthProvider
- `src/components/auth/LoginForm.tsx` - 登录表单
- `src/components/auth/UserMenu.tsx` - 用户菜单
- `src/middleware.ts` - Next.js 中间件

---

### 2. 管理员后台 (P0) ✅

**描述**：用户管理后台，支持 CRUD 操作。

**实现方案**：
- `/admin/users` 用户管理页面
- 使用 service_role key 绕过 RLS
- 支持创建/编辑/删除用户

**相关文件**：
- `src/app/admin/layout.tsx` - 管理后台布局
- `src/app/admin/page.tsx` - 管理后台首页
- `src/app/admin/users/page.tsx` - 用户列表页
- `src/components/admin/UserList.tsx` - 用户列表组件
- `src/components/admin/UserForm.tsx` - 用户表单组件
- `src/app/api/admin/users/route.ts` - 用户列表 API
- `src/app/api/admin/users/[id]/route.ts` - 单用户 API

---

## v0.4.0 - 进度追踪与数据持久化 (下一迭代)

> **注意**：本版本依赖 v0.3.0 的用户认证系统

### 1. 进度追踪 (P1) ⏳

**描述**：追踪用户的学习进度。

**功能要点**：
- 视频播放进度
- 文档阅读进度
- 代码练习完成状态
- 可视化进度展示
- 跨设备进度同步

**数据结构**：
```typescript
interface LearningProgress {
  userId: string
  courseId: string
  lessonId: string
  videoProgress: number  // 秒
  documentProgress: number  // 百分比
  codeCompleted: boolean
  lastAccessedAt: string
}
```

**相关文件**（待创建）：
- `src/lib/progress.ts`
- `src/hooks/useProgress.ts`
- `src/components/learn/ProgressBar.tsx`

---

### 2. 课程管理 (P1) 📚

**描述**：支持更多课程和课程分类。

**功能要点**：
- 课程分类（前端/后端/数据科学等）
- 课程搜索
- 课程收藏
- 学习路径推荐

---

### 3. 云端数据持久化 (P1) 💾

**描述**：将用户数据持久化到云端（Supabase）。

**功能要点**：
- 代码草稿云端同步
- 学习进度云端备份
- 用户设置同步
- 离线优先 + 后台同步

**注意**：数据库表已在 v0.3.0 创建（learning_progress, saved_codes, favorites）

---

## P2 功能 (低优先级)

### 1. 全屏模式
- 视频播放器全屏支持
- 代码编辑器全屏支持

### 2. 进度记忆
- 视频播放位置记忆
- 文档阅读位置记忆

### 3. 代码复制
- 代码块一键复制按钮
- 复制成功提示

### 4. 阅读进度
- 文档阅读进度条
- 预计阅读时间

### 5. HLS 流媒体支持
- 支持 HLS 协议视频
- 自适应码率

### 6. 课程评论
- 课时评论区
- 用户互动

### 7. 笔记功能
- 课程笔记
- Markdown 支持

---

## 技术债务

1. **E2E 测试** ✅ - 已添加 Playwright 测试框架
   - `tests/e2e/pages/` - 页面测试 (home, courses, lesson)
   - `tests/e2e/features/` - 功能测试 (code-execution, code-storage, test-validation, theme-toggle)
   - `tests/e2e/integration/` - 集成测试 (learning-flow)
   - `tests/e2e/auth.setup.ts` - 认证测试 setup
   - `tests/e2e/utils/helpers.ts` - 测试工具函数

2. **单元测试**：为核心组件添加 Jest/Vitest 测试

3. **性能优化**：
   - 代码分割
   - 图片优化
   - 缓存策略

4. **无障碍**：ARIA 标签、键盘导航

5. **国际化**：多语言支持
