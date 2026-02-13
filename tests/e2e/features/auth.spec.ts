import { test, expect } from '@playwright/test';

// 未登录状态测试 - 由 chromium-guest 项目运行
test.describe('用户认证 - 未登录状态', () => {
  test('首页应显示登录按钮', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    // 等待 UserMenu 组件加载完成（跳过 loading 状态）
    await page.waitForTimeout(1000);
    const loginButton = page.locator('header').getByRole('link', { name: '登录' });
    await expect(loginButton).toBeVisible({ timeout: 10000 });
  });

  test('点击登录按钮应跳转到登录页', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1000);
    const loginButton = page.locator('header').getByRole('link', { name: '登录' });
    await loginButton.click();
    await expect(page).toHaveURL(/\/login/);
  });
});
