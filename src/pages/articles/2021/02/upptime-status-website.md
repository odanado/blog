---
title: upptime の status website の更新で草が生えないようにしたい
publishedAt: 2021-02-16
layout: ../../../../layouts/base-layout.astro
---

[Upptime](https://upptime.js.org/) は GitHub Actions でサイトの死活監視を行う OSS です。死活監視の状況をモニタリングできるサイトを GitHub Pages に自動生成してくれますが、このサイトに対して毎日更新されるたびに GitHub に草が生えてしまうのでなんとかしたいログです。

## GitHub Pages を無効化する

結論: だめ

- [Disable status page publishing · Discussion #107 · upptime/upptime](https://github.com/upptime/upptime/discussions/107)
  - `disable status site` で検索すると見つかる
- `gh-pages` ブランチを消して、リポジトリの Settings から GitHub Pages が `None` に設定されていること確認
- `Static Site CI` を手動で実行すると、消えたはずの `gh-pages` ブランチが新しく生えている
  - ブランチが生えるのはそれはそう
  - GitHub Pages の設定も `gh-pages` ブランチに向いている

## サイト更新のユーザを制御する

結論: だめ

- [maxheld83/ghpages: Deploy arbitrary static assets through GitHub Actions](https://github.com/maxheld83/ghpages)
  - 死活監視のサイトのデプロイに使用されている
- https://github.com/maxheld83/ghpages/blob/e48ff5f4bb9b1f5c91ffe5fc1dc90e9d65ab57b0/entrypoint.sh#L21-L22
  - 実装を読むと `GITHUB_ACTOR` がユーザーとして登録されるみたい
- `Static Site CI` を実行する GitHub Actions の yaml は自動生成されている
  - yaml を直接編集することはできない
  - `.upptimerc.yml` にオプションもなさそう

誰か知見持っていたら教えて下さい
