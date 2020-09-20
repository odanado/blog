import { join } from 'path';
import { tmpdir } from 'os';
import { mkdir } from 'fs/promises';
import type { Server } from 'http';

import express from 'express';
import playwright from 'playwright';
import { ImageMatcher } from '../utils/image-matcher';

const DIST_DIR = join(__dirname, '..', '..', 'dist');
const IMAGE_DIR = join(tmpdir(), 'production-visual-regression');
const PROD_URL = 'https://blog.odan.dev';
const DEV_PORT = 3000;
const DEV_URL = `http://localhost:${DEV_PORT}`;

const TARGET_PATHS = [
  '/',
  '/articles/2020/09/isucon10-qualify',
  '/articles/2020/08/aws-codebuild-run-build'
];

const THRESHOLD = 0.01;

jest.setTimeout(10000);

describe('poyo', () => {
  let server: Server;
  let browser: playwright.Browser;

  beforeAll(async () => {
    const app = express();

    app.use(express.static(DIST_DIR));

    await new Promise((resolve) => {
      server = app.listen(DEV_PORT, () => {
        resolve();
      });
    });

    await mkdir(IMAGE_DIR, { recursive: true });

    browser = await playwright.chromium.launch();
  });
  afterAll(async () => {
    server.close();
    await browser.close();
  });
  describe.each(TARGET_PATHS)('path: %s', (path) => {
    it('ok', async () => {
      const matcher = new ImageMatcher();
      const testcase = {
        dev: {
          url: `${DEV_URL}${path}`, env: 'dev', imagePath: join(IMAGE_DIR, `dev${path.split('/').join('-')}.png`)
        },
        prod: {
          url: `${PROD_URL}${path}`, env: 'prod', imagePath: join(IMAGE_DIR, `prod${path.split('/').join('-')}.png`)
        }
      };

      const page = await browser.newPage();

      await page.goto(testcase.dev.url, { waitUntil: 'domcontentloaded' });
      await page.screenshot({
        path: testcase.dev.imagePath,
        fullPage: true
      });
      await page.goto(testcase.prod.url, { waitUntil: 'domcontentloaded' });
      await page.screenshot({
        path: testcase.prod.imagePath,
        fullPage: true
      });

      const errorRate = await matcher.match([testcase.dev.imagePath, testcase.prod.imagePath]);

      expect(errorRate).toBeLessThanOrEqual(THRESHOLD);
    });
  });
});
