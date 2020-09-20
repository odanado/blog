import { join } from 'path';
import { tmpdir } from 'os';
import { mkdir } from 'fs/promises';
import { URL } from 'url';
import type { Server } from 'http';

import express from 'express';
import playwright from 'playwright';
import { fetchSitemap } from '../utils/fetch-sitemap';
import { ImageMatcher } from '../utils/image-matcher';

const DIST_DIR = join(__dirname, '..', '..', 'dist');
const IMAGE_DIR = join(tmpdir(), 'production-visual-regression');
const PROD_URL = 'https://blog.odan.dev';
const DEV_PORT = 3000;
const DEV_URL = `http://localhost:${DEV_PORT}`;

let server: Server;

describe('poyo', () => {
  beforeAll((done) => {
    const app = express();

    app.use(express.static(DIST_DIR));

    server = app.listen(DEV_PORT, () => {
      done();
    });
    jest.setTimeout(30000);
  });
  afterAll(() => {
    server.close();
  });
  it('poyo', async () => {
    const urls = await (await fetchSitemap(`${PROD_URL}/sitemap.xml`)).urlset.url.map(x => x.loc);
    const pathnames = urls.map(url => new URL(url).pathname);
    console.log(pathnames);
    console.log(pathnames[0].split('/').join('-'));
    const browser = await playwright.chromium.launch();
    const page = await browser.newPage();

    await mkdir(IMAGE_DIR, { recursive: true });

    const testcases = pathnames.map(pathname => ({
      dev: {
        url: `${DEV_URL}${pathname}`, env: 'dev', imagePath: join(IMAGE_DIR, `dev${pathname.split('/').join('-')}.png`)
      },
      prod: {
        url: `${PROD_URL}${pathname}`, env: 'prod', imagePath: join(IMAGE_DIR, `prod${pathname.split('/').join('-')}.png`)
      }
    }));

    console.log(IMAGE_DIR);
    const matcher = new ImageMatcher();
    for (const testcase of testcases) {
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

      console.log([testcase.dev.imagePath, testcase.prod.imagePath]);
      console.log(testcase.dev.url, await matcher.match([testcase.dev.imagePath, testcase.prod.imagePath]));
    }

    await browser.close();
  });
});
