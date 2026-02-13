import { test as setup, expect } from '@playwright/test';

const authFile = 'tests/e2e/.auth/user.json';

setup('authenticate', async ({ page, context }) => {
  const email = process.env.TEST_USER_EMAIL;
  const password = process.env.TEST_USER_PASSWORD;

  if (!email || !password) {
    throw new Error('TEST_USER_EMAIL and TEST_USER_PASSWORD must be set in .env.local');
  }

  // 访问登录页面
  await page.goto('/login');
  await page.waitForLoadState('networkidle');

  // 填写登录表单
  await page.fill('input[type="email"]', email);
  await page.fill('input[type="password"]', password);

  // 点击登录按钮
  await page.click('button[type="submit"]');

  // 等待登录成功 - 检查 URL 变化或页面内容
  // 登录成功后会跳转到 /learn 或首页
  await page.waitForURL(/\/(learn|$)/, { timeout: 30000 });

  // 验证登录成功 - 不应该还在登录页面
  await expect(page).not.toHaveURL(/\/login/);

  // 保存认证状态（cookies + localStorage）
  await context.storageState({ path: authFile });

  console.log(`Authentication state saved to ${authFile}`);
});
