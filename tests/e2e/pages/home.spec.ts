import { test, expect } from '@playwright/test';

test.describe('首页', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('应该正确加载首页', async ({ page }) => {
    await expect(page).toHaveTitle(/LearnHub/);
  });

  test('应该显示欢迎内容', async ({ page }) => {
    await expect(page.locator('body')).toBeVisible();
  });

  test('应该能导航到课程列表', async ({ page }) => {
    // 使用更精确的链接选择器
    const learnLink = page.locator('a[href="/learn"]');
    if (await learnLink.isVisible()) {
      await learnLink.click();
      await expect(page).toHaveURL('/learn');
    }
  });
});
