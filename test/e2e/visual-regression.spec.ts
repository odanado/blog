import { test, expect } from '@playwright/test';

const PROD_URL = 'https://blog.odan.dev';
const DEV_PORT = 4321;
const DEV_URL = `http://localhost:${DEV_PORT}`;

const TARGET_PATHS = [
  '/',
  '/articles/2020/06/blog',
  '/articles/2020/07/hardware-wallet-protocol',
  '/articles/2020/09/isucon10-qualify',
  '/articles/2020/08/aws-codebuild-run-build',
];

test.describe('Visual Regression Tests', () => {
  for (const targetPath of TARGET_PATHS) {
    test(`should match visual appearance for ${targetPath}`, async ({ page }) => {
      // Navigate to dev version
      await page.goto(`${DEV_URL}${targetPath}`, { waitUntil: 'networkidle' });
      const devScreenshot = await page.screenshot({ fullPage: true });
      
      // Navigate to production version
      await page.goto(`${PROD_URL}${targetPath}`, { waitUntil: 'networkidle' });
      const prodScreenshot = await page.screenshot({ fullPage: true });
      
      // Compare screenshots
      expect(devScreenshot).toMatchSnapshot(`${targetPath.replace(/\//g, '-')}-dev.png`);
      expect(prodScreenshot).toMatchSnapshot(`${targetPath.replace(/\//g, '-')}-prod.png`);
    });
  }
});