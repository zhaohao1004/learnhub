import { test, expect } from '@playwright/test';

test.describe('课程列表页', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/learn');
  });

  test('应该显示页面标题', async ({ page }) => {
    await expect(page.getByRole('heading', { name: /课程/i })).toBeVisible();
  });

  test('应该显示课程卡片', async ({ page }) => {
    const courseLinks = page.locator('a[href^="/learn/"]');
    await expect(courseLinks.first()).toBeVisible();
  });

  test('点击课程应跳转到详情页', async ({ page }) => {
    const firstCourse = page.locator('a[href="/learn/js-basics"]');
    if (await firstCourse.isVisible()) {
      await firstCourse.click();
      await expect(page).toHaveURL('/learn/js-basics');
    }
  });
});
