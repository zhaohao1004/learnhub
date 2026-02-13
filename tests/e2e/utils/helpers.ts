import { Page, expect } from '@playwright/test';

/**
 * 等待 Monaco Editor 加载完成
 */
export async function waitForMonaco(page: Page) {
  await page.waitForLoadState('domcontentloaded');
  await page.waitForSelector('.monaco-editor', { timeout: 60000 });
  await page.waitForTimeout(1000);
}

/**
 * 等待 Pyodide 加载完成
 */
export async function waitForPyodide(page: Page) {
  await page.waitForFunction(
    () => (window as unknown as { pyodideReady?: boolean }).pyodideReady === true,
    { timeout: 60000 }
  ).catch(() => {
    // Pyodide 可能还没加载，忽略错误
  });
}

/**
 * 执行代码
 */
export async function runCode(page: Page) {
  // 使用精确匹配"运行代码"，避免匹配到"运行测试"
  const runButton = page.getByRole('button', { name: '运行代码' });
  await runButton.first().click();
  await page.waitForTimeout(500);
}

/**
 * 切换主题
 */
export async function toggleTheme(page: Page) {
  const themeButton = page.getByRole('button', { name: /切换主题|深色|浅色/ });
  await themeButton.click();
  await page.waitForTimeout(300);
}

/**
 * 验证当前主题
 */
export async function verifyTheme(page: Page, expectedTheme: 'dark' | 'light') {
  const html = page.locator('html');
  if (expectedTheme === 'dark') {
    await expect(html).toHaveClass(/dark/);
  } else {
    await expect(html).not.toHaveClass(/dark/);
  }
}

/**
 * 清除 localStorage（安全版本，处理 about:blank 等特殊情况）
 */
export async function clearStorage(page: Page) {
  try {
    // 确保页面已加载且可以访问 localStorage
    const url = page.url();
    if (url.startsWith('about:') || url === '') {
      return; // 跳过空白页面
    }
    await page.evaluate(() => {
      localStorage.clear();
    });
  } catch {
    // 忽略 localStorage 访问错误（某些页面可能不允许访问）
  }
}

/**
 * 获取控制台输出
 */
export async function getConsoleOutput(page: Page): Promise<string> {
  const consoleContent = page.locator('.console-output, [data-testid="console"], .text-gray-300');
  return await consoleContent.innerText().catch(() => '');
}

/**
 * 等待用户菜单加载
 */
export async function waitForUserMenu(page: Page) {
  await page.waitForSelector('header', { timeout: 10000 });
}

/**
 * 打开用户菜单
 */
export async function openUserMenu(page: Page) {
  const menuButton = page.locator('header').getByRole('button').first();
  await menuButton.click();
  await page.waitForTimeout(300);
}

/**
 * 退出登录
 */
export async function signOut(page: Page) {
  await openUserMenu(page);
  await page.getByText('退出登录').click();
  await page.waitForURL(/\/login/);
}
