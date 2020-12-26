---
title: @truffle/contract の仕組みを追う
publishedAt: 2020-12-26
---

@truffle/contract の仕組みを知る必要があったのでコードを読んだときのメモです

## メモ
- artifacts.require
  - Contract クラス的なオブジェクトが返される
  - require の実装はここ
    - https://github.com/trufflesuite/truffle/blob/2f9f6c5d95ff8bfeece6f6c6dee8ca813ddfea7a/packages/resolver/lib/resolver.ts#L30
- Contract.deployed
  - デプロイされた Contarct インスタンス的なオブジェクトが返される
  - deployed の実装がどこにあるか見つからなかった
  - 実装の中身は https://github.com/trufflesuite/truffle/blob/2b247527f3d3c402f98ae1a968994e3ffcbf56be/packages/contract/lib/contract/index.js#L17
    - プロパティに色々継ぎ足しているので読みにくい...
  - https://github.com/trufflesuite/truffle/blob/3aaa6a8b8bc2dbac44a69d55138535590c404e04/packages/contract/lib/contract/constructorMethods.js#L11 は Contract クラスのプロパティっぽい
- `@truffle/contract` の型定義
  - `@truffle/contract` は型定義ファイルが同梱されている
    - https://github.com/trufflesuite/truffle/blob/fab2e77a243fefc580ca54890fbd613de0a3fccc/packages/contract/typings/index.d.ts#L1
  - 実態は `@truffle/contract-schema`
    - json-schema-to-typescript を使って json schema から自動生成されている
      - https://github.com/trufflesuite/truffle/blob/395d5816846b414cbb4fc3925af4952df9c133f8/packages/contract-schema/scripts/generate-declarations#L5
    - 型が間違っている
      - デプロイされたコントラクトの address は `contract.networks["mainnet"].address;` からしか取得できないと型は主張しているけど、実際は `contract.address` から取得できる
        - https://github.com/trufflesuite/truffle/blob/9d7bbffd6273e768cf3a0109cc79fbc7e5365154/packages/contract/lib/contract/properties.js#L129 で getter が定義されているため

## 感想
- 実装がかなり追いにくい...
  - ES にクラスが追加される以前のコードってみんなこんな感じだったんだろうか
- 型が嘘をついている
  - 実装と型が別だと乖離していくのかなあ
  - この界隈型に対する興味関心が薄い感じがする...
    - ここまで自明なものが残ってるとはって感じ
