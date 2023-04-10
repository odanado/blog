---
title: aws-codebuild-run-build を試した
publishedAt: 2020-08-16
layout: ../../../../layouts/base-layout.astro
---

## aws-codebuild-run-build とは

https://github.com/aws-actions/aws-codebuild-run-build

aws-codebuild-run-build は AWS 公式の GitHub Actions の一つです。
この Actions は workflow の step として AWS CodeBuild を実行するものです。

## モチベーション

[Actions の VM](https://docs.github.com/en/actions/reference/virtual-environments-for-github-hosted-runners#supported-runners-and-hardware-resources) には 2 コアの CPU と 7GB のメモリーが割り当てられています。
これより強いマシンでテストやビルドを実行するには[セルフホストランナー](https://docs.github.com/ja/actions/hosting-your-own-runners/about-self-hosted-runners)を使用する選択肢があります。しかしこの選択肢は常に強いマシンを動かしておく必要があるため、コストが高くなります。  
そこで、aws-codebuild-run-build の出番です。CodeBuild は従量課金制のサービスで、ビルド実行時にだけインスタンスが割り当てられます。aws-codebuild-run-build を使うことにより、強いマシン上でのテストやビルドの実行を従量課金として実行することが出来ます。

また、ビルドのトリガーを Actions に寄せることによって、トリガーの柔軟さがあるのもメリットの 1 つです。

## サンプル

今回試したリポジトリです。
https://github.com/odan-sandbox/aws-codebuild-run-build-sandbox

`aws-actions/aws-codebuild-run-build@v1.0.3` を uses することで、CodeBuild 上でビルドを開始しています。

```yml
name: codebuild

on:
  push:
    branches:
      - "**"

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - name: Configure AWS Credentials
        uses: aws-actions/configure-aws-credentials@v1
        with:
          aws-access-key-id: ${{ secrets.AWS_ACCESS_KEY_ID }}
          aws-secret-access-key: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
          aws-region: ap-northeast-1
      - name: Run CodeBuild
        uses: aws-actions/aws-codebuild-run-build@v1.0.3
        with:
          project-name: aws-codebuild-run-build-sandbox
          buildspec-override: buildspecs/run-build.yaml
```

## 比較

NuxtJS + TypeScript なボイラープレートのビルド時間を比べてみました。  
Actions の VM だと常に 12 秒かかるところを、お金に力でインスタンスをスケールアップすることにより時間の短縮を実現しています。

|                                | yarn build |
| ------------------------------ | ---------- |
| Actions VM (7GB メモリ 2 vCPU) | 12.12s     |
| CodeBuild (3GB メモリ 2 vCPU)  | 14.51s     |
| CodeBuild (7GB メモリ 4 vCPU)  | 10.03s     |

ただ今回のケースでは、CodeBuild のインスタンスのプロビジョニングに必要な時間を含めると、Actions の VM で実行する方が早い結果になりました。ビルドが CPU ヘビーな処理で、実行時間が全体の時間に対して支配的な場合に有効だと言えます。
