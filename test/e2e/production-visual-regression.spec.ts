import { join } from 'path';
import { tmpdir } from 'os';
import { mkdir } from 'fs/promises';
import type { Server } from 'http';

import express from 'express';
import playwright from 'playwright';

const DIST_DIR = join(__dirname, '..', '..', 'dist');
const IMAGE_DIR = join(tmpdir(), 'production-visual-regression');
let server: Server;

describe('poyo', () => {
  beforeAll((done) => {
    const app = express();

    app.use(express.static(DIST_DIR));

    server = app.listen(3000, () => {
      done();
    });
  });
  afterAll(() => {
    server.close();
  });
  it('poyo', async () => {
    const browser = await playwright.chromium.launch();
    const page = await browser.newPage();

    await mkdir(IMAGE_DIR, { recursive: true });

    await page.goto('http://localhost:3000');

    await page.screenshot({
      path: join(IMAGE_DIR, 'poyo.png'),
      fullPage: true
    });

    await browser.close();
  });
});
