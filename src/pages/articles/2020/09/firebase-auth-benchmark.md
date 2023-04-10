---
title: Firebase Authentication のパフォーマンスを計測してみた
publishedAt: 2020-09-28
layout: ../../../../layouts/base-layout.astro
---

## 概要

Firebase Authentication はユーザー認証に関するサービスです。様々な認証方式をサポートしており、活用することで認証に関する実装を大きくサボることが可能になるものです。

一方で、パフォーマンスには難点があることが知られており、[firebase auth 遅い - Twitter 検索 / Twitter](https://twitter.com/search?q=firebase%20auth%20%E9%81%85%E3%81%84&src=typed_query&f=live) を見ると、いくつかの人が遅さについて言及しています。

そこで、パフォーマンスについて測定したので、その結果をまとめます。

## 環境

実験を行った環境は以下の通りです。ネットワークによる影響を調べるために、2 つのリージョンで実験を行いました。

- NodeJS v14.12.0
- firebase 7.21.1
- firebase-admin 9.2.0
- EC2 インスタンス t2.micro
- リージョン ap-northeast-1/us-east-1
- コード [odan-sandbox/firebase-auth-benchmark](https://github.com/odan-sandbox/firebase-auth-benchmark)

## パフォーマンス測定の対象となる関数

以下の関数についてパフォーマンスの計測を行いました。

- `admin.auth().createUser`
- `admin.auth().getUser`
- `firebase.auth().onAuthStateChanged`
- `firebase.User の getIdToken`
- `admin.auth().verifyIdToken (checkRevoked が true)`
- `admin.auth().verifyIdToken (checkRevoked が false)`

## 測定結果

各関数を 10 回ずつ実行したときの、平均時間と標準偏差を結果に書いています。

### ap-northeast-1

| 関数                                               | 結果                          |
| -------------------------------------------------- | ----------------------------- |
| admin.auth().createUser                            | 859.8 ms ± 65.3 ms (10 runs)  |
| admin.auth().getUser                               | 346.2 ms ± 15.0 ms (10 runs)  |
| firebase.auth().onAuthStateChanged                 | 0.0 ms ± 0.0 ms (10 runs)     |
| firebase.User の getIdToken                        | 0.0 ms ± 0.0 ms (10 runs)     |
| admin.auth().verifyIdToken (checkRevoked が true)  | 430.8 ms ± 220.1 ms (10 runs) |
| admin.auth().verifyIdToken (checkRevoked が false) | 0.3 ms ± 0.5 ms (10 runs)     |

### us-east-1

| 関数                                               | 結果                          |
| -------------------------------------------------- | ----------------------------- |
| admin.auth().createUser                            | 418.1 ms ± 108.4 ms (10 runs) |
| admin.auth().getUser                               | 124.5 ms ± 23.8 ms (10 runs)  |
| firebase.auth().onAuthStateChanged                 | 0.0 ms ± 0.0 ms (10 runs)     |
| firebase.User の getIdToken                        | 0.1 ms ± 0.3 ms (10 runs)     |
| admin.auth().verifyIdToken (checkRevoked が true)  | 121.7 ms ± 36.5 ms (10 runs)  |
| admin.auth().verifyIdToken (checkRevoked が false) | 0.3 ms ± 0.5 ms (10 runs)     |

## 感想

`firebase-admin` の `createUser` と `getUser` と `verifyIdToken (checkRevoked が true)` は、リージョンが異なると実行時間に倍以上の違いがあることがわかりました。Firebase Authentication のバックエンドはアメリカにあり、東京からリクエストを行うと、アメリカまでの通信 + 認証に関する処理に時間がかかっているようです。
`getUser` は us-east-1 だと遅くはないが速くもない程度ですが、ap-northeast-1 では遅いと感じ始めるぐらいのレスポンスタイムでしょうか。

書き方が悪かったのか `onAuthStateChanged` はどちらのリージョンでも実行時間を計測することが出来ませんでした。ブラウザでこの関数を待つと 500ms 程度かかる記憶がありましたが、サインイン方式や ブラウザ/NodeJS の環境の違いによるもの何でしょうか。

## まとめ

Firebase Authentication の関数についてパフォーマンスの計測を行いました。

`firebase-admin` の参照系の関数を東京から呼ぶと、300~400 ms 程度の時間がかかることがわかりました。

ブラウザで `onAuthStateChanged` の計測を正しく行ったり、GCP の Identity Platform のパフォーマンスについても調べてみたいです。
