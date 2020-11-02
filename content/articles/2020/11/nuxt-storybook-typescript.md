---
title: TypeScript を採用している Nuxt.js プロジェクトで @nuxtjs/storybook を導入してハマったポイント 
publishedAt: 2020-11-02
---


## @nuxtjs/storybook とは

[Storybook](https://storybook.js.org/)を簡単に使うための Nuxt.js のモジュールです。
従来は `nuxt.config.js` とは別に、Storybook 用の `webpack.config.js` を別でメンテする必要がありましたが、このモジュールが `nuxt.config.js` から Storybook 用の `webpack.config.js` を生成してくれるので、不要になりました。

## yarn nuxt storybook build がエラーで失敗する

このモジュールがリリースされて、真っ先にこのブログに導入しました。しかしドキュメントの通りに導入して `yarn nuxt storybook` を実行すると以下のエラーが発生して、Storybook を利用できませんでした。

```shell
ERR! Module not found: Error: Can't resolve '../components/the-header.vue' in '/home/runner/work/blog/blog/.nuxt-storybook/layouts'
(node:2746) UnhandledPromiseRejectionWarning: ModuleNotFoundError: Module not found: Error: Can't resolve '../components/the-header.vue' in '/home/runner/work/blog/blog/.nuxt-storybook/layouts'
    at /home/runner/work/blog/blog/node_modules/webpack/lib/Compilation.js:925:10
    at /home/runner/work/blog/blog/node_modules/webpack/lib/NormalModuleFactory.js:401:22
    at /home/runner/work/blog/blog/node_modules/webpack/lib/NormalModuleFactory.js:130:21
    at /home/runner/work/blog/blog/node_modules/webpack/lib/NormalModuleFactory.js:224:22
    at /home/runner/work/blog/blog/node_modules/neo-async/async.js:2830:7
    at /home/runner/work/blog/blog/node_modules/neo-async/async.js:6877:13
    at /home/runner/work/blog/blog/node_modules/webpack/lib/NormalModuleFactory.js:214:25
    at /home/runner/work/blog/blog/node_modules/webpack/node_modules/enhanced-resolve/lib/Resolver.js:213:14
    at /home/runner/work/blog/blog/node_modules/webpack/node_modules/enhanced-resolve/lib/Resolver.js:285:5
    at eval (eval at create (/home/runner/work/blog/blog/node_modules/tapable/lib/HookCodeFactory.js:33:10), <anonymous>:15:1)
    at /home/runner/work/blog/blog/node_modules/webpack/node_modules/enhanced-resolve/lib/UnsafeCachePlugin.js:44:7
    at /home/runner/work/blog/blog/node_modules/webpack/node_modules/enhanced-resolve/lib/Resolver.js:285:5
    at eval (eval at create (/home/runner/work/blog/blog/node_modules/tapable/lib/HookCodeFactory.js:33:10), <anonymous>:15:1)
    at /home/runner/work/blog/blog/node_modules/webpack/node_modules/enhanced-resolve/lib/Resolver.js:285:5
    at eval (eval at create (/home/runner/work/blog/blog/node_modules/tapable/lib/HookCodeFactory.js:33:10), <anonymous>:27:1)
    at /home/runner/work/blog/blog/node_modules/webpack/node_modules/enhanced-resolve/lib/DescriptionFilePlugin.js:67:43
(Use `node --trace-warnings ...` to show where the warning was created)
(node:2746) UnhandledPromiseRejectionWarning: Unhandled promise rejection. This error originated either by throwing inside of an async function without a catch block, or by rejecting a promise which was not handled with .catch(). To terminate the node process on unhandled promise rejection, use the CLI flag `--unhandled-rejections=strict` (see https://nodejs.org/api/cli.html#cli_unhandled_rejections_mode). (rejection id: 1)
(node:2746) [DEP0018] DeprecationWarning: Unhandled promise rejections are deprecated. In the future, promise rejections that are not handled will terminate the Node.js process with a non-zero exit code.
[fatal] Failed to run command `nuxt-storybook`:
Error: Command failed with exit code 1: nuxt-storybook build
```

この原因は、Nuxt.js の設定を `nuxt.config.js` ではなく `nuxt.config.ts` に書いているからでした。

`nuxt.config.ts` に設定を書くのは [Nuxt TypeScript の公式ドキュメント](https://typescript.nuxtjs.org/ja/cookbook/configuration.html) に書かれているように合法な設定手段です。
しかし、`yarn nuxt` のサブコマンドとして `nuxt-storybook` を実行すると、 [execa](https://github.com/sindresorhus/execa) でコマンドが実行されるため `ts-node` ではなく `node` を使用して `nuxt-storybook` は起動します。このため、`nuxt.config.ts` が読み込めていませんでした。

この問題に対する workaround としては、`yarn nuxt storybook` の代わりに `yarn ts-node node_modules/.bin/nuxt-storybook` を実行することです。こうすれば、`ts-node` を使用して起動するため、`nuxt.config.ts` を読み込むことができます。

ただ、`@nuxtjs/storybook` に同様の issue が立っているので、時間が経てば解決するかと思われます。
[How to use with nuxt.config.ts? · Issue #160 · nuxt-community/storybook](https://github.com/nuxt-community/storybook/issues/160)
