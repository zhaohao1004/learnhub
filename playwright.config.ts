import { defineConfig, devices } from '@playwright/test';
import dotenv from 'dotenv';

// 加载 .env.local 环境变量
dotenv.config({ path: '.env.local' });

export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'list',

  // 自动启动开发服务器
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI, // 本地开发时复用已有服务器
    timeout: 120000, // 等待服务器启动的超时时间
    stdout: 'ignore', // 忽略服务器日志
    stderr: 'pipe', // 显示错误日志
  },
  projects: [
    // Setup project - 登录并保存认证状态
    {
      name: 'setup',
      testMatch: /auth\.setup\.ts/,
      use: {
        baseURL: 'http://localhost:3000',
      },
    },
    // 未登录测试项目 - 只运行 auth.spec.ts
    {
      name: 'chromium-guest',
      testMatch: /features\/auth\.spec\.ts/,
      use: {
        ...devices['Desktop Chrome'],
        baseURL: 'http://localhost:3000',
        trace: 'on-first-retry',
        screenshot: 'only-on-failure',
      },
    },
    // 已登录测试项目 - 排除 auth.spec.ts
    {
      name: 'chromium',
      use: {
        ...devices['Desktop Chrome'],
        baseURL: 'http://localhost:3000',
        trace: 'on-first-retry',
        screenshot: 'only-on-failure',
        storageState: 'tests/e2e/.auth/user.json',
      },
      dependencies: ['setup'],
      testIgnore: /features\/auth\.spec\.ts/,
    },
  ],
});
