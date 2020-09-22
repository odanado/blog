---
title: AWS の Observability ワークショップをちょっと触ってみた
publishedAt: 2020-09-23
---

[3〜4時間でAWSの監視系のサービス一気に学べたらコスパ良いと思いませんか | Developers.IO](https://dev.classmethod.jp/articles/introduction-of-one-observability-demo-workshop/)

面白そうなワークショップがあったので途中までやってみました。

https://github.com/aws-samples/one-observability-demo

## 感想
- AWS CDK でワークショップ用の環境を用意出来るようになっているけど、概要を掴むだけならドキュメントを流し見るだけで良さそう
  - AWS の料金かかるし途中で気づいて手を動かすのを辞めた
- Amazon CloudWatch ServiceLens 便利そう
  - サービスの各コンポーネントが視覚的に表示されるのは良さそう

![](https://observability.workshop.aws/images/servicelens/sl-map.png?classes=shadow)

- ServiceLens と X-Ray の違いがよくわからなかった
  - 見れる情報似ているし、何が違うんだろう...？
- CloudWatch Logs インサイトでロググループを横断して検索できるのは、request id を使ってをログを横串で見るためなのか
- Amazon CloudWatch Synthetics で Puppeteer を使えたの知らなかった
  - 監視対象をかなり柔軟に指定できて良さそう


## demo の AWS CDK をデプロイするとエラーでハマったメモ

ドキュメントに沿って `yarn cdk bootstrap` を実行すると以下のエラーが発生して失敗しました。

```
This CDK CLI is not compatible with the CDK library used by your application. Please upgrade the CLI to the latest version.
(Cloud assembly schema version mismatch: Maximum schema version supported is 4.0.0, but found 5.0.0)
```
原因は、 `cdk.out/manifest.json` のバージョンと https://github.com/aws/aws-cdk/blob/bf3cc21c2d19cf344b706a4da2de939daded89a7/packages/%40aws-cdk/cloud-assembly-schema/schema/cloud-assembly.version.json の不一致です。

demo 用のリポジトリには lock ファイルが存在せず、おそらくバージョンの不整合が原因だろうと考えて `yarn add -D aws-cdk@1.58.0` を実行したら解決しました。

一応このときの yarn.lock ファイルを置いておきます。
https://gist.github.com/odanado/d4525aea88ad8586a542e4f3e45ca0bd

demo のリポジトリもあったので [issue](https://github.com/aws-samples/one-observability-demo/issues/28) を立てておきました。



