---
title: GCP の Cloud Logging を試した
publishedAt: 2021-01-17
---

Cloud Logging には良いログのプラクティスが詰まっている気がしていて、実際に使うかに関わらずその思想は学ぶ価値があると考えて試してみました。
https://github.com/odan-sandbox/cloud-logging-sandbox

## ログの構造

- GCP に送信されるログ 1 つ 1 つに `LogEntry` という名前が付けられているらしく、その型定義はここ
  - https://github.com/googleapis/nodejs-logging/blob/869bbafe3790d6d6f21a1f538549a1f336d6f918/src/entry.ts#L29-L35
- マージ対象の `google.logging.v2.ILogEntry` はここ
  - https://github.com/googleapis/nodejs-logging/blob/869bbafe3790d6d6f21a1f538549a1f336d6f918/protos/protos.d.ts#L27
- npm のライブラリ的には `Entity` という名前が付けられているぽい？
  - Logging クラスの entry メソッドを使って生成される
  - https://github.com/googleapis/nodejs-logging/blob/869bbafe37/src/index.ts#L461
- `Entity` の実装はこのクラス
  - https://github.com/googleapis/nodejs-logging/blob/869bbafe37/src/entry.ts#L113-L115
  - `metadata` が `LogEntry`
  - `data` が `Data`
    - `Data` は `string` だったりオブジェクトが入る想定っぽい
      - `LogEntry` 的には `string` だと `textPayload`、オブジェクトだと `jsonPayload` という名前がついている

## @google-cloud/logging-winston

- https://github.com/googleapis/nodejs-logging-winston
- Node.js のログライブラリの winston 用のライブラリがある
  - エラー時のスタックトレースは `jsonPayload.metadata.meta` 以下にある
- express の middleware が事前に用意されている
  - https://github.com/googleapis/nodejs-logging-winston#using-as-an-express-middleware
  - 個人的には stdout に出る内容がそのまま GCP にされてほしいので微妙かも
    - 12-factors app の思想に近い
