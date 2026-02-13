import { test, expect } from '@playwright/test';
import { waitForMonaco } from '../utils/helpers';

test.describe('学习页面', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/learn/js-basics/lesson/lesson-1');
  });

  test('应该显示课时标题', async ({ page }) => {
    // 使用 header 上下文精确定位标题
    const header = page.locator('header').first();
    await expect(header.getByRole('heading', { level: 1 })).toContainText('JavaScript');
  });

  test('应该加载 Monaco 编辑器', async ({ page }) => {
    await waitForMonaco(page);
    await expect(page.locator('.monaco-editor')).toBeVisible();
  });

  test('应该显示文档内容', async ({ page }) => {
    // 使用更精确的选择器，定位文档区域
    const docArea = page.locator('.overflow-auto, .prose, article').first();
    await expect(docArea.getByText(/JavaScript/i).first()).toBeVisible();
  });

  test('应该显示运行按钮', async ({ page }) => {
    // 使用精确匹配"运行代码"按钮
    const runButton = page.locator('header').first().getByRole('button', { name: '运行代码' });
    await expect(runButton).toBeVisible();
  });

  test('底部导航应该正常工作', async ({ page }) => {
    const nextButton = page.getByRole('link', { name: /下一课/ });
    if (await nextButton.isVisible()) {
      await nextButton.click();
      await expect(page).toHaveURL(/lesson-2/);
    }
  });
});
