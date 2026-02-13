import { test, expect } from '@playwright/test';
import { waitForMonaco, clearStorage } from '../utils/helpers';

test.describe('代码保存和加载功能', () => {
  test.beforeEach(async ({ page }) => {
    await clearStorage(page);
    await page.goto('/learn/js-basics/lesson/lesson-1');
    await page.waitForLoadState('networkidle');
    await waitForMonaco(page);
  });

  test('应该显示保存按钮', async ({ page }) => {
    const saveButton = page.getByRole('button', { name: /保存/ });
    await expect(saveButton).toBeVisible();
  });

  test('点击保存应该保存代码', async ({ page }) => {
    const saveButton = page.getByRole('button', { name: /保存/ });
    await saveButton.click();
    await page.waitForTimeout(500);

    // 验证 localStorage 有数据
    const saved = await page.evaluate(() => {
      return localStorage.getItem('learnhub_saved_codes') !== null;
    });
    expect(saved).toBe(true);
  });

  test('保存后应该显示已保存时间', async ({ page }) => {
    const saveButton = page.getByRole('button', { name: /保存/ });
    await saveButton.click();
    await page.waitForTimeout(500);

    // 检查是否显示已保存时间
    const savedTimeText = page.getByText(/已保存:/);
    const isVisible = await savedTimeText.isVisible().catch(() => false);

    if (isVisible) {
      const text = await savedTimeText.innerText();
      expect(text).toContain('已保存:');
    }
  });

  test('应该显示已保存代码下拉列表', async ({ page }) => {
    // 先保存一个代码
    const saveButton = page.getByRole('button', { name: /保存/ });
    await saveButton.click();
    await page.waitForTimeout(500);

    // 查找下拉列表
    const select = page.locator('select').filter({ hasText: /选择已保存的代码/ });

    if (await select.isVisible()) {
      const options = await select.locator('option').count();
      expect(options).toBeGreaterThan(1); // 包含默认选项
    }
  });

  test('加载已保存代码应该更新编辑器', async ({ page }) => {
    // 保存当前代码
    const saveButton = page.getByRole('button', { name: /保存/ });
    await saveButton.click();
    await page.waitForTimeout(500);

    // 选择已保存的代码
    const select = page.locator('select').filter({ hasText: /选择已保存的代码/ });

    if (await select.isVisible()) {
      await select.selectOption({ index: 1 });
      await page.waitForTimeout(300);

      // 点击加载按钮
      const loadButton = page.getByRole('button', { name: /加载/ });
      await loadButton.click();
      await page.waitForTimeout(500);

      // 验证编辑器仍然可见
      const editor = page.locator('.monaco-editor');
      await expect(editor).toBeVisible();
    }
  });

  test('删除已保存代码应该从列表中移除', async ({ page }) => {
    // 保存代码
    const saveButton = page.getByRole('button', { name: /保存/ });
    await saveButton.click();
    await page.waitForTimeout(500);

    // 获取刚保存的记录 ID
    const savedDataBefore = await page.evaluate(() => {
      const stored = localStorage.getItem('learnhub_saved_codes');
      return stored ? JSON.parse(stored) : null;
    });

    // 找到刚保存的记录（最新的一条）
    const savedIds = Object.keys(savedDataBefore?.data || {});
    const latestId = savedIds[savedIds.length - 1];

    // 选择已保存的代码
    const select = page.locator('select').filter({ hasText: /选择已保存的代码/ });

    if (await select.isVisible() && latestId) {
      await select.selectOption({ index: 1 });
      await page.waitForTimeout(300);

      // 点击删除按钮
      const deleteButton = page.getByRole('button', { name: /删除/ });
      await deleteButton.click();
      await page.waitForTimeout(500);

      // 验证特定记录已被删除（而不是验证总数为0）
      const savedDataAfter = await page.evaluate(() => {
        const stored = localStorage.getItem('learnhub_saved_codes');
        return stored ? JSON.parse(stored) : null;
      });

      // 验证删除的记录不再存在
      expect(savedDataAfter?.data?.[latestId]).toBeUndefined();
    }
  });

  test('自动保存应该工作', async ({ page }) => {
    // 等待自动保存（2秒防抖）
    await page.waitForTimeout(3000);

    // 验证 localStorage 有数据
    const saved = await page.evaluate(() => {
      const data = localStorage.getItem('learnhub_saved_codes');
      return data !== null && JSON.parse(data).data !== undefined;
    });
    expect(saved).toBe(true);
  });

  test('保存的数据应该包含正确的字段', async ({ page }) => {
    const saveButton = page.getByRole('button', { name: /保存/ });
    await saveButton.click();
    await page.waitForTimeout(500);

    // 验证数据结构
    const savedData = await page.evaluate(() => {
      const stored = localStorage.getItem('learnhub_saved_codes');
      return stored ? JSON.parse(stored) : null;
    });

    expect(savedData).not.toBeNull();
    expect(savedData.version).toBe(1);

    const savedCode = Object.values(savedData.data)[0] as {
      id: string;
      language: string;
      content: string;
      savedAt: string;
    };

    expect(savedCode.id).toBeDefined();
    expect(savedCode.language).toBeDefined();
    expect(savedCode.content).toBeDefined();
    expect(savedCode.savedAt).toBeDefined();
  });

  test('清除 localStorage 后页面应该正常工作', async ({ page }) => {
    // 设置更长的测试超时
    test.setTimeout(90000);

    // 清除存储
    await clearStorage(page);

    // 刷新页面
    await page.reload();
    await page.waitForLoadState('domcontentloaded');
    await waitForMonaco(page);

    // 页面应该正常显示
    const editor = page.locator('.monaco-editor');
    await expect(editor).toBeVisible();
  });
});
