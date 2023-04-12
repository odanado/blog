---
title: ブログを Nuxt.js から Astro に引っ越した
publishedAt: 2023-04-11
---

## モチベーション

ずっと更新してなかったブログを Nuxt.js から Astro に引っ越しました。

元々は技術的なメモを残す場として用意した場所でしたが、[zenn.dev](https://zenn.dev) のスクラップ機能がリリースされてからは更新する理由がなくなっていました。

## Astro を選んだ理由

Nuxt.js v3 がリリースされているので単純にバージョンアップするだけでもよかったですが、最近 [Astro](https://astro.build/) をよく聞くので勉強も兼ねてこちらを選択しました。

特に最近リリースされた [Content Collections](https://docs.astro.build/ja/guides/content-collections/) という機能を使ってみたいと考えていました。幸いにもこの機能は [Nuxt.js の Content](https://content.nuxtjs.org/) に似ているので引っ越し作業もスムーズでした。

## 引っ越し作業

段階的に引っ越すのは手間が多そうなのと、最悪事故っても問題にはならいないと考えて一気に引っ越しました。

https://github.com/odanado/blog/pull/356

元々のブログは Vue.js でいくつかコンポーネントを作成していました。そのため既存のコンポーネントを https://docs.astro.build/ja/guides/integrations-guide/vue/ を使用して Astro から Vue.js のコンポーネントを呼び出す方法もありました。しかしコンポーネントの数も多くないので `.astro` ファイルに手動でコピペしました。

また引っ越しにあたって、記事のパスが変化しないように気をつけました。パスが変化するとリダイレクト処理を書かないといけないので面倒だからです。

## パフォーマンスの変化

Astro に引っ越すことでパフォーマンスが向上しました。
引越し前は Lighthouse のスコアが 80 でしたが、引越し後は 100 になりました。

引越し前の Lighthouse のスコア
<img
  src="/images/articles/2023/04/migrate-astro/before.webp"
  width="1944"
  height="268"
  alt="引越し前の Lighthouse のスコア"
/>

引越し後の Lighthouse のスコア
<img
  src="/images/articles/2023/04/migrate-astro/after.webp"
  width="1942"
  height="274"
  alt="引越し後の Lighthouse のスコア"
/>

## 今後の展望

zenn.dev があるので今後もブログを更新することはないと思いますが、サンドボックスとして遊んでいきたいと思います。
具体的には次のことを導入したいと考えています。

- Renovate のプルリクを build 差分がなければオートマージする
- Visual Regression Test の導入
- Lighthouse CI の導入

## 参考記事

引っ越しにあたって hiroppy さんの記事が参考になりました。

- https://hiroppy.me/blog/astro-content-collections
- https://hiroppy.me/blog/migrate-blog-from-hatena
