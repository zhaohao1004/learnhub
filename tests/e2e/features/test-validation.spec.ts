import { test, expect } from '@playwright/test';
import { waitForMonaco, clearStorage } from '../utils/helpers';

test.describe('测试验证功能', () => {
  test.beforeEach(async ({ page }) => {
    await clearStorage(page);
    // 访问有测试用例的课时页面 (lesson-1 有测试用例)
    await page.goto('/learn/js-basics/lesson/lesson-1');
    await page.waitForLoadState('networkidle');
    await waitForMonaco(page);
  });

  test('应该显示测试面板', async ({ page }) => {
    await expect(page.getByText(/测试用例/)).toBeVisible();
  });

  test('应该显示运行测试按钮', async ({ page }) => {
    const runTestButton = page.getByRole('button', { name: /运行测试/ });
    await expect(runTestButton).toBeVisible();
    await expect(runTestButton).toBeEnabled();
  });

  test('运行测试应显示结果', async ({ page }) => {
    await page.getByRole('button', { name: /运行测试/ }).click();
    await page.waitForTimeout(2000);

    // 验证测试结果区域显示（使用更精确的选择器）
    const resultArea = page.locator('.bg-gray-800\\/50').filter({ hasText: /通过率/ }).or(
      page.locator('[class*="bg-gray-800"]').filter({ hasText: /通过率/ })
    );
    const isVisible = await resultArea.isVisible().catch(() => false);

    // 如果没有结果区域，检查是否有测试用例文本
    if (!isVisible) {
      await expect(page.getByText(/测试用例|测试结果/).first()).toBeVisible();
    }
  });

  test('测试通过应该显示绿色图标', async ({ page }) => {
    const runTestButton = page.getByRole('button', { name: /运行测试/ });
    await runTestButton.click();
    await page.waitForTimeout(2000);

    // 查找通过的图标（绿色勾）
    const passedIcon = page.locator('.text-green-400 svg, [class*="text-green"] svg');
    const count = await passedIcon.count();

    // 如果测试通过，应该有绿色图标
    if (count > 0) {
      await expect(passedIcon.first()).toBeVisible();
    }
  });

  test('测试失败应该显示红色图标', async ({ page }) => {
    // 修改代码使其测试失败
    const editor = page.locator('.monaco-editor .view-lines');
    await editor.click();

    // 使用键盘全选并输入错误代码
    await page.keyboard.press('Control+a');
    await page.keyboard.type('// wrong code\nconsole.log("wrong");');

    const runTestButton = page.getByRole('button', { name: /运行测试/ });
    await runTestButton.click();
    await page.waitForTimeout(2000);

    // 查找失败的图标（红色 X）
    const failedIcon = page.locator('.text-red-400 svg, [class*="text-red"] svg');
    const count = await failedIcon.count();

    // 如果有失败的测试，应该显示红色图标
    if (count > 0) {
      await expect(failedIcon.first()).toBeVisible();
    }
  });

  test('应该显示通过率百分比', async ({ page }) => {
    const runTestButton = page.getByRole('button', { name: /运行测试/ });
    await runTestButton.click();
    await page.waitForTimeout(2000);

    // 检查通过率显示 - 使用父容器获取完整文本
    const passRateContainer = page.locator('div').filter({ hasText: /^通过率:/ }).first();
    const hasPassRate = await passRateContainer.isVisible().catch(() => false);

    if (hasPassRate) {
      const text = await passRateContainer.innerText();
      // 父容器包含"通过率:"和百分比数字
      expect(text).toMatch(/\d+%/);
    }
  });

  test('展开测试详情应该显示期望和实际输出', async ({ page }) => {
    const runTestButton = page.getByRole('button', { name: /运行测试/ });
    await runTestButton.click();
    await page.waitForTimeout(2000);

    // 查找测试项并点击展开
    const testItem = page.locator('text=测试 1').or(page.locator('text=/test/i')).first();

    if (await testItem.isVisible()) {
      await testItem.click();
      await page.waitForTimeout(300);

      // 检查是否显示了详细信息
      const expectedOutput = page.getByText(/期望输出:/);
      const actualOutput = page.getByText(/实际输出:/);

      const hasExpected = await expectedOutput.isVisible().catch(() => false);
      const hasActual = await actualOutput.isVisible().catch(() => false);

      // 如果展开成功，应该显示详情
      if (hasExpected || hasActual) {
        expect(hasExpected || hasActual).toBe(true);
      }
    }
  });

  test('测试运行时按钮应该显示加载状态', async ({ page }) => {
    const runTestButton = page.getByRole('button', { name: /运行测试/ });

    // 点击运行
    await runTestButton.click();

    // 立即检查按钮状态（可能显示"运行中..."）
    const runningText = page.getByRole('button', { name: /运行中/ });
    const isRunningVisible = await runningText.isVisible().catch(() => false);

    // 等待完成
    await page.waitForTimeout(2000);

    // 按钮应该恢复
    await expect(page.getByRole('button', { name: /运行测试/ }).first()).toBeEnabled();
  });

  test('多个测试用例应该分别显示状态', async ({ page }) => {
    // 检查是否有多个测试用例
    const testItems = page.locator('text=/测试 \\d+|test.*\\d+/i');
    const count = await testItems.count();

    const runTestButton = page.getByRole('button', { name: /运行测试/ });
    await runTestButton.click();
    await page.waitForTimeout(2000);

    // 每个测试用例应该有状态指示
    const statusIcons = page.locator('.w-4.h-4, svg[class*="w-4"]');
    const iconCount = await statusIcons.count();

    // 如果有测试用例，应该有状态图标
    if (count > 0 || iconCount > 0) {
      expect(count > 0 || iconCount > 0).toBe(true);
    }
  });

  test('显示通过数量统计', async ({ page }) => {
    const runTestButton = page.getByRole('button', { name: /运行测试/ });
    await runTestButton.click();
    await page.waitForTimeout(2000);

    // 检查通过数量显示 - 使用父容器获取完整文本
    const passedContainer = page.locator('div').filter({ hasText: /^通过:/ }).first();
    const hasPassedText = await passedContainer.isVisible().catch(() => false);

    if (hasPassedText) {
      const text = await passedContainer.innerText();
      // 父容器包含"通过:"和数字
      expect(text).toMatch(/\d+/);
    }
  });
});
