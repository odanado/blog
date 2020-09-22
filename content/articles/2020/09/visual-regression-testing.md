---
title: Dependabot のオートマージのためにビジュアルレグレッションテストを導入した
publishedAt: 2020-09-22
---

## モチベーション
このブログは NuxtJS 製で、[このリポジトリ](https://github.com/odanado/blog)で管理しています。ソフトウェアを継続的にメンテナンスをしていくのには、依存ライブラリのアップデートが欠かせません。


[Dependabot](https://dependabot.com/) は依存ライブラリを自動アップデートしてくれる SaaS です。依存ライブラリにアップデートがあると、`package.json` と `yarn.lock` を更新するプルリクを作成してくれます。この SaaS には `automerged_updates` というオプションがあります。このオプションは、マッチ条件を満たし CI が通っていると、自動的にプルリクを master にマージするものです。

今回はこのオートマージのためにブログにビジュアルリグレッションテストを導入しました。
 

## ビジュアルリグレッションテストとは
いわゆる一般的なテストが関数の返り値などの機能についてテストを行うのに対して、ビジュアルリグレッションテストは視覚的な要素を持つテストです。
今回はこのテストを以下の方法で用意しました。

- [Playwright](https://github.com/microsoft/playwright) を使った自動ブラウザ操作
- ローカルで yarn generate した結果と、本番環境の blog.odan.dev のスクショを撮影
- 2つの環境のスクショの差分の割合を計算
- この割合が閾値以上ならテストを failed にする

## テスト
書いたテストの全体は次のとおりです。
https://github.com/odanado/blog/blob/e7b41750ab830d3c08ce7513a3907b0ca0a7ac81/test/e2e/production-visual-regression.spec.ts

```ts
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
  '/articles/2020/06/blog',
  '/articles/2020/07/hardware-wallet-protocol',
  '/articles/2020/09/isucon10-qualify',
  '/articles/2020/08/aws-codebuild-run-build'
];

const THRESHOLD = 0.001;

jest.setTimeout(15000);

describe('production-visual-regression', () => {
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

    browser = await playwright.chromium.launch({});
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

      const [devPage, prodPage] = await Promise.all([browser.newPage(), browser.newPage()]);

      await Promise.all([
        devPage.goto(testcase.dev.url, { waitUntil: 'networkidle' }),
        prodPage.goto(testcase.prod.url, { waitUntil: 'networkidle' })
      ]);

      await Promise.all([
        devPage.screenshot({
          path: testcase.dev.imagePath,
          fullPage: true
        }),
        prodPage.screenshot({
          path: testcase.prod.imagePath,
          fullPage: true
        })
      ]);

      const errorRate = await matcher.match([testcase.dev.imagePath, testcase.prod.imagePath]);

      expect(errorRate).toBeLessThanOrEqual(THRESHOLD);
    });
  });
});
```

### テスト対象となるページ
```ts
const TARGET_PATHS = [
  '/',
  '/articles/2020/06/blog',
  '/articles/2020/07/hardware-wallet-protocol',
  '/articles/2020/09/isucon10-qualify',
  '/articles/2020/08/aws-codebuild-run-build'
];
```

テスト対象となるページは `TARGET_PATHS` という変数として直接テストファイルに書いています。実装当初はサイトマップから動的に対象ページを取得する方針を検討していました。しかし、ブログの投稿数が増えた場合にテスト全体の実行時間が伸びてしまうことと、テストによって担保したい視覚的な不具合の発生を検知するには限られたページだけにテストを行えば良いと考え、今の形になりました。


### networkidle までページのロードを待つ

```ts
      await Promise.all([
        devPage.goto(testcase.dev.url, { waitUntil: 'networkidle' }),
        prodPage.goto(testcase.prod.url, { waitUntil: 'networkidle' })
      ]);
```

[goto メソッド](https://playwright.dev/#version=v1.4.1&path=docs%2Fapi.md&q=pagegotourl-options) のデフォルトでは、ツイート埋め込みの JS ロードまで待たないためか、微妙にずれがあるページが存在しました。

<blockquote class="twitter-tweet"><p lang="ja" dir="ltr">ローカルと本番環境で微妙にずれてるんだけどなんだろこれ <a href="https://t.co/JW8h1QHK08">pic.twitter.com/JW8h1QHK08</a></p>&mdash; odan (@odan3240) <a href="https://twitter.com/odan3240/status/1307649311849627650?ref_src=twsrc%5Etfw">September 20, 2020</a></blockquote> <script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>

試しに `networkidle` まで待つと、この問題が解決しました。このオプションは最後のネットワークの通信から500ミリ秒後まで待つオプションです。

### 画像マッチの実装
[pixelmatch](https://www.npmjs.com/package/pixelmatch) というライブラリを使用して、2つの画像に異なる点がいくつあるか数えています。そして、その数を画像の面積で割ることでエラーの割合を計算しています。

https://github.com/odanado/blog/blob/edbcaec9cb9e446960d36fba7faa7a60b8dae0e0/test/utils/image-matcher.ts#L25
```ts
    const { height, width } = img1;
    const diffs = pixelmatch(
      img1.data,
      img2.data,
      null,
      img1.width,
      img1.height
    );
    const error = Math.round((100 * 100 * diffs) / (width * height)) / 100;
```

この実装は [jest-image-snapshot](https://github.com/americanexpress/jest-image-snapshot) の内部の実装を簡略化したものになります。

このエラーの割合が閾値より大きいとテストを失敗にしています。

## Dependabot のオートマージを有効にする
https://github.com/odanado/blog/blob/0285e6eec65dce7b752252b463aa89b833640a00/.dependabot/config.yml

Dependabot の config は以下のとおりです。 `dependency_type` の `development` と `production` は両方とも `update_type` を `all` にしました。

```yml
update_configs:
  - package_manager: "javascript"
    directory: "/"
    update_schedule: "weekly"
    automerged_updates:
      - match:
          dependency_type: "development"
          update_type: "all"
      - match:
          dependency_type: "production"
          update_type: "all"
```

### オートマージされている様子
テストを用意しているときには気づかなかったのですが、たまにビジュアルリグレッションテストが落ちるようになっていました。原因はわからず今後の課題として調査したいです。

<blockquote class="twitter-tweet"><p lang="ja" dir="ltr">いい感じだけどテストがガチャになっちゃった <a href="https://t.co/RhAWM9xKqg">pic.twitter.com/RhAWM9xKqg</a></p>&mdash; odan (@odan3240) <a href="https://twitter.com/odan3240/status/1307785788403322880?ref_src=twsrc%5Etfw">September 20, 2020</a></blockquote> <script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>

## まとめ
このブログに対して、開発環境と本番環境を比較するビジュアルリグレッションテストを用意することで、視覚的な差分がないことをテストで担保できるようになりました。
これにより、Dependabot が作成するすべてのプルリクに対してオートマージを有効化しても問題がなくなったため、オートマージするようにしました。
