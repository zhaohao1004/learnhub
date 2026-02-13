import { test, expect } from '@playwright/test';

// 已登录状态测试 - 由 chromium 项目运行（依赖 setup）
test.describe('用户菜单 - 已登录状态', () => {
  test('应显示用户菜单', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    // 用户菜单按钮（包含头像的按钮）
    const userMenuButton = page.locator('header button[class*="rounded-full"]');
    await expect(userMenuButton.first()).toBeVisible({ timeout: 10000 });
  });

  test('点击用户头像应展开下拉菜单', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1000);

    // UserMenu 组件的按钮包含 ChevronDown 图标
    const userMenuButton = page.locator('header').locator('button').filter({
      has: page.locator('svg.lucide-chevron-down')
    });

    await userMenuButton.click();
    await page.waitForTimeout(500);

    // 等待下拉菜单出现 - 使用更精确的选择器
    const dropdown = page.locator('.absolute.right-0').filter({
      has: page.getByText('个人资料')
    });
    await expect(dropdown).toBeVisible({ timeout: 5000 });
    await expect(page.getByText('退出登录')).toBeVisible();
  });

  test('点击个人资料应跳转到个人中心', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1000);

    const userMenuButton = page.locator('header').locator('button').filter({
      has: page.locator('svg.lucide-chevron-down')
    });
    await userMenuButton.click();
    await page.waitForTimeout(500);

    await page.getByText('个人资料').click();
    await expect(page).toHaveURL('/profile');
  });

  test('点击退出登录应成功登出', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1000);

    const userMenuButton = page.locator('header').locator('button').filter({
      has: page.locator('svg.lucide-chevron-down')
    });
    await userMenuButton.click();
    await page.waitForTimeout(500);

    await page.getByText('退出登录').click();
    await expect(page).toHaveURL(/\/login/, { timeout: 10000 });
  });
});
