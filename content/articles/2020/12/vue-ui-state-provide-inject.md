---
title: Vue.js の provide/inject を使って UI State を props から逃がす
publishedAt: 2020-12-13
---

`isLoading` などの UI State を props によるバケツリレーではなく provide/inject 機能を使ってグローバル変数に逃がす例を紹介します。

## UI State の定義
この記事での UI State とはモーダルの表示や、ボタンのローディングアニメーション、トグルボタンのオンとオフの間などの状態を指します。つまり、アプリケーションとして問題を解決するのに必要な状態ではなく、UI の表示切り替えなどに必要な状態です。

## UI State をどこで持つか
UI State はアプリケーションが問題を解決するのに必要な状態ではないため、できる限り影響範囲を小さく抑えておきたいです。
モーダルの表示/非表示は、そのモーダル自身に表示に関するフラグを持たせることで、その影響範囲をモーダルだけに限定できます。

一方で、API 呼び出しと紐付いていることが多いボタンのローディングアニメーションは事情が異なります。ボタンの押下の瞬間にローディングのアニメーションを開始して、API 呼び出しが完了したらそのアニメーションを終了させる必要があるため、UI State を単一のコンポーネントに閉じておくことが出来ません。

例えば `Page コンポーネント > Child コンポーネント > Grandchild コンポーネント > GreatGrandchild コンポーネント > ボタンコンポーネント` という依存があり、Page コンポーネントで API を叩いている場合を考えます。ローディングの状態のバケツリレーを props を使用して行う必要があります。

バケツリレーではない UI State の伝達について、これ以降考えていきます。

## provide/inject とは
provide で state をコンポーネントに設定すると、そのコンポーネント以下のすべてのコンポーネントで inject を使うことにより、その state を取得する機能です。
機能としては React Context API を同じものだと理解しています。

Vue.js v2.x では
> provide および inject は、主に高度なプラグインやコンポーネントのライブラリのために提供されています。一般的なアプリケーションのコードで利用することは推奨されません。

という注意書きと共に使い方が紹介される機能でした。
https://jp.vuejs.org/v2/api/index.html#provide-inject

v3 からはこの注意書きはなくなり、専用のページが出来ています。Vuex の実装にも取り入れられたりしていて、日の目を見るようになっている印象があります。
https://v3.vuejs.org/guide/component-provide-inject.html

## provide/inject で UI State を管理する
実際に試しに書いてみたコードは次のリポジトリです。
https://github.com/odan-sandbox/vue-provider-sandbox

[Page コンポーネント](https://github.com/odan-sandbox/vue-provider-sandbox/blob/master/src/pages/index.vue) で API を叩いて、[GreatGrandchild コンポーネント](https://github.com/odan-sandbox/vue-provider-sandbox/blob/master/src/components/GreatGrandchild.vue) は `ボタンコンポーネント` に loading の状態を渡しています。

このように UI state を間のコンポーネントをすっ飛ばして扱えます。
