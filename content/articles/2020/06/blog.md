---
title: NuxtJS の full-static export と nuxtjs/content でブログを作った
publishedAt: 2020-06-07
---

## 概要
最近 NuxtJS のコアに full-static export という機能が追加され、@nuxtjs/content というモジュールが公開されました。

これらを使えば簡単にブログが作れるのではと思ったので、このブログを作ってみました。この記事はその紹介です。

## リポジトリ
https://github.com/odanado/blog

## full-static export
[full-static export](https://github.com/nuxt/nuxt.js/pull/6159) は NuxtJS で静的ファイルを生成する機能です。これまであった `nuxt generate` コマンドも、レンダリング済みの HTML を返していましたが、クライアントでのルーティング時に `asyncData` が呼ばれていました。このコマンドは SSR の prerendering を行うだけのものでした。

対して、`nuxt export` を使って静的ファイルを生成すると `asyncData` の呼び出しをキャッシュするようになり、`asyncData` が呼び出されないようになります。NuxtJS に SSG (静的サイトジェネレータ) の機能が実装されたのです。

この機能を使うには、事前に `--target static` で build しておく必要があります。そのため、静的ファイルを生成するコマンドは次の通りになります。

```console
nuxt build --target static; nuxt export
```

## @nuxtjs/content
[@nuxtjs/content](https://content.nuxtjs.org/) は `content/` ディレクトリ以下に Markdown などのファイルを置くと Git-based の Headless CMS として機能する MongoDB のような API を提供するモジュールです。

`content/articles/2020/06/blog.md` というファイルを置いておくと、NuxtJS で以下の書き方で Markdown の内容や [Front Matter](https://jekyllrb.com/docs/front-matter/) の内容を取得することができます。
```js
const page = await app.$content('articles/2020/06/blog').fetch()
```

取得した内容は `<nuxt-content />` を使って HTML にレンダリングできます。

```vue
<template>
  <article>
    <h1>{{ page.title }}</h1>
    <nuxt-content :document="page" />
  </article>
</template>
```

## new.css の導入
今回は [new.css](https://newcss.net/) を導入しました。new.css は CSS フレームワークで、html のタグにモダンな見た目になるように CSS を当ててくれます。ブログの構築を急いだのでこれを採用しました。後で余裕ができたら自分で CSS を書いてデザインを当てたいと考えています。

## 終わりに
NuxtJS にも静的サイトジェネレータの機能が実装されました。これと Git-based の Headless CMS として機能を提供する `@nuxtjs/content` を組み合わせることでブログを作ってみたという話でした。

