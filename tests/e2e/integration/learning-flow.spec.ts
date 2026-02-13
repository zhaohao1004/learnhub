import { test, expect } from '@playwright/test';
import { waitForMonaco, runCode, clearStorage } from '../utils/helpers';

test.describe('完整学习流程', () => {
  test.beforeEach(async ({ page }) => {
    await clearStorage(page);
  });

  test('完整学习流程', async ({ page }) => {
    // 设置更长的测试超时
    test.setTimeout(120000);

    // 1. 访问首页
    await page.goto('/');
    await expect(page).toHaveTitle(/LearnHub/);

    // 2. 进入课程列表
    await page.goto('/learn');
    await expect(page.getByRole('heading', { name: /课程/i })).toBeVisible();

    // 3. 选择课程
    const courseLink = page.locator('a[href="/learn/js-basics"]');
    if (await courseLink.isVisible()) {
      await courseLink.click();
      await expect(page).toHaveURL('/learn/js-basics');
    }

    // 4. 进入第一课
    await page.goto('/learn/js-basics/lesson/lesson-1');
    await waitForMonaco(page);

    // 5. 验证页面元素
    await expect(page.locator('.monaco-editor')).toBeVisible();
    await expect(page.getByRole('button', { name: '运行代码' })).toBeVisible();

    // 6. 运行代码
    await runCode(page);
    await page.waitForTimeout(1000);

    // 7. 运行测试
    const runTestButton = page.getByRole('button', { name: /运行测试/ });
    if (await runTestButton.isVisible()) {
      await runTestButton.click();
      await page.waitForTimeout(2000);
    }

    // 8. 保存代码
    const saveButton = page.getByRole('button', { name: /保存/ });
    if (await saveButton.isVisible()) {
      await saveButton.click();
      await page.waitForTimeout(500);
    }

    // 9. 验证保存成功
    const saved = await page.evaluate(() => {
      return localStorage.getItem('learnhub_saved_codes') !== null;
    });
    expect(saved).toBe(true);
  });

  test('跨课时导航', async ({ page }) => {
    await page.goto('/learn/js-basics/lesson/lesson-1');
    await waitForMonaco(page);

    // 点击下一课
    const nextButton = page.getByRole('link', { name: /下一课/ });
    if (await nextButton.isVisible()) {
      await nextButton.click();
      await expect(page).toHaveURL(/lesson-2/);
    }
  });

  test('页面刷新后状态恢复', async ({ page }) => {
    test.setTimeout(90000);

    await page.goto('/learn/js-basics/lesson/lesson-1');
    await waitForMonaco(page);

    // 等待自动保存
    await page.waitForTimeout(3000);

    // 刷新页面
    await page.reload();
    await waitForMonaco(page);

    // 验证编辑器仍然存在
    await expect(page.locator('.monaco-editor')).toBeVisible();
  });
});
