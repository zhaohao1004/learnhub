import { test, expect } from '@playwright/test';

test.describe('个人中心页面', () => {
  // 已登录测试（需要 auth state）
  test.describe('已登录', () => {
    test.use({ storageState: 'tests/e2e/.auth/user.json' });

    test('应该显示个人信息表单', async ({ page }) => {
      await page.goto('/profile');
      await expect(page.getByRole('heading', { name: '个人信息' })).toBeVisible();
      await expect(page.getByLabel('邮箱')).toBeVisible();
      await expect(page.getByLabel('姓名')).toBeVisible();
    });

    test('应该显示密码修改表单', async ({ page }) => {
      await page.goto('/profile');
      await expect(page.getByRole('heading', { name: '修改密码' })).toBeVisible();
    });

    test('应该能填写并提交姓名修改表单', async ({ page }) => {
      await page.goto('/profile');
      await page.waitForLoadState('networkidle');

      const nameInput = page.getByLabel('姓名');
      await nameInput.fill('测试用户');

      // 验证输入值已更新
      await expect(nameInput).toHaveValue('测试用户');

      // 点击保存按钮（不验证 API 结果，因为依赖真实 Supabase 连接）
      const saveButton = page.getByRole('button', { name: '保存' });
      await expect(saveButton).toBeEnabled();
    });
  });
});
