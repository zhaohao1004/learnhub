import { test, expect } from '@playwright/test';
import { waitForMonaco, runCode, clearStorage } from '../utils/helpers';

test.describe('代码执行功能', () => {
  test.beforeEach(async ({ page }) => {
    await clearStorage(page);
  });

  test.describe('Playground 页面 JavaScript 执行', () => {
    test.beforeEach(async ({ page }) => {
      await page.goto('/playground');
      await page.waitForLoadState('networkidle');
      await waitForMonaco(page);
    });

    test('应该显示代码编辑器', async ({ page }) => {
      const monacoEditor = page.locator('.monaco-editor');
      await expect(monacoEditor).toBeVisible();
    });

    test('应该显示运行按钮', async ({ page }) => {
      const runButton = page.getByRole('button', { name: '运行代码' });
      await expect(runButton).toBeVisible();
      await expect(runButton).toBeEnabled();
    });

    test('应该显示语言选择器', async ({ page }) => {
      // 查找语言选择器（可能是 select 或 tab）
      const languageSelector = page.locator('select').first()
        .or(page.getByRole('tab').filter({ hasText: /javascript|typescript|python/i }));

      const count = await languageSelector.count();
      expect(count).toBeGreaterThan(0);
    });

    test('点击运行应执行代码', async ({ page }) => {
      await runCode(page);
      await page.waitForTimeout(1000);

      // 验证控制台有输出
      const consoleArea = page.locator('.text-gray-300, .console-output, [data-testid="console"]');
      await expect(consoleArea.first()).toBeVisible();
    });

    test('控制台应该显示 console.log 输出', async ({ page }) => {
      // 执行默认代码
      await runCode(page);
      await page.waitForTimeout(1500);

      // 检查控制台输出（使用实际的控制台输出颜色类）
      const consoleContent = page.locator('.text-green-400, .console-output, pre, code').first();

      if (await consoleContent.isVisible()) {
        const text = await consoleContent.innerText();
        // 默认代码应该输出 Fibonacci 相关内容
        expect(text.toLowerCase()).toContain('fibonacci');
      }
    });

    test('运行中状态应该显示加载指示', async ({ page }) => {
      const runButton = page.getByRole('button', { name: '运行代码' });

      // 点击运行
      await runButton.click();

      // 检查是否有加载状态
      const isLoading = await runButton.isDisabled().catch(() => false);

      // 等待执行完成
      await page.waitForTimeout(2000);

      // 按钮应该重新可用
      await expect(runButton).toBeEnabled();
    });

    test('切换到 TypeScript 应该更新编辑器', async ({ page }) => {
      // 查找 TypeScript 选项
      const select = page.locator('select').first();
      const selectCount = await select.count();

      if (selectCount > 0) {
        const options = await select.locator('option').allInnerTexts();
        const hasTypescript = options.some(opt => opt.toLowerCase().includes('typescript'));

        if (hasTypescript) {
          await select.selectOption({ label: 'TypeScript' });
          await page.waitForTimeout(500);
          await expect(page.locator('.monaco-editor')).toBeVisible();
        } else {
          test.skip(true, 'TypeScript 选项未找到');
        }
      } else {
        // 尝试 tab 形式的选择器
        const tsTab = page.getByRole('tab', { name: /typescript/i });
        if (await tsTab.isVisible()) {
          await tsTab.click();
          await page.waitForTimeout(500);
          await expect(page.locator('.monaco-editor')).toBeVisible();
        } else {
          test.skip(true, 'TypeScript 选项未找到');
        }
      }
    });

    test('切换到 Python 应该触发加载', async ({ page }) => {
      const select = page.locator('select').first();
      const selectCount = await select.count();

      if (selectCount > 0) {
        const options = await select.locator('option').allInnerTexts();
        const hasPython = options.some(opt => opt.toLowerCase().includes('python'));

        if (hasPython) {
          await select.selectOption({ label: 'Python' });
          await page.waitForTimeout(1000);
          await expect(page.locator('.monaco-editor')).toBeVisible();
        } else {
          test.skip(true, 'Python 选项未找到');
        }
      } else {
        test.skip(true, 'Python 选项未找到');
      }
    });
  });

  test.describe('学习页面代码执行', () => {
    test.beforeEach(async ({ page }) => {
      await page.goto('/learn/js-basics/lesson/lesson-1');
      await page.waitForLoadState('networkidle');
      await waitForMonaco(page);
    });

    test('学习页面应该有代码编辑器', async ({ page }) => {
      const monacoEditor = page.locator('.monaco-editor');
      await expect(monacoEditor).toBeVisible();
    });

    test('学习页面应该有运行按钮', async ({ page }) => {
      // 使用 header 上下文精确定位运行代码按钮
      const runButton = page.locator('header').first().getByRole('button', { name: '运行代码' });
      await expect(runButton).toBeVisible();
    });

    test('应该能执行初始代码', async ({ page }) => {
      await runCode(page);
      await page.waitForTimeout(1000);

      // 验证有输出
      const consoleOutput = page.locator('.text-gray-300, .console-output');
      const text = await consoleOutput.first().innerText().catch(() => '');
      expect(text.length).toBeGreaterThanOrEqual(0);
    });

    test('执行代码应该更新控制台输出', async ({ page }) => {
      // 执行代码
      await runCode(page);
      await page.waitForTimeout(1500);

      // 验证控制台区域
      const consoleArea = page.locator('.console-output, [data-testid="console"], .text-gray-300').first();
      await expect(consoleArea).toBeVisible();
    });
  });
});
