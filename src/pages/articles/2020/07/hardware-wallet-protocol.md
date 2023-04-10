---
title: ハードウェアウォレットのプロトコルを話したい
publishedAt: 2020-07-06
layout: ../../../../layouts/base-layout.astro
---

- 動機

<blockquote class="twitter-tweet"><p lang="ja" dir="ltr">趣味でハードウェアウォレット買って遊びたいけど買うだけの余裕がないので、適当にハードウェアウォレットのプロトコルを喋るやつを作って MetaMask と連携させてみたい</p>&mdash; odan (@odan3240) <a href="https://twitter.com/odan3240/status/1279997293395980289?ref_src=twsrc%5Etfw">July 6, 2020</a></blockquote> <script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>

- MetaMask が対応しているハードウェアウォレットは Ledger と Trezor
  - https://github.com/MetaMask/eth-ledger-bridge-keyring
  - https://github.com/MetaMask/eth-trezor-keyring
  - eth-keyring-controller で制御される
    - https://github.com/MetaMask/KeyringController
      - fork すれば任意の keyring を追加できそう
      - https://github.com/MetaMask/metamask-extension/blob/2301d9980eda9629c01a1d1ca4ae264f7545941e/app/scripts/metamask-controller.js#L203
      - サンプル
        - https://github.com/MetaMask/eth-simple-keyring
- https://github.com/MetaMask/eth-ledger-bridge-keyring
  - BRIDGE_URL に対して iframe 経由で通信してるぽい？
  - https://github.com/MetaMask/eth-ledger-bridge-keyring/blob/3e200141bb6ec122eaaff827617c7e81983037c9/index.js#L8
  - https://www.ledger.com/ledger-live
    - これが必要らしい
    - https://lab.stir.network/2020/04/13/metamaskメタマスクを経由してledger-nano-sレジャーナノsで送信/
- https://github.com/MetaMask/eth-trezor-keyring
  - trezor-connect に依存してる
    - https://github.com/trezor/connect
    - https://wiki.trezor.io/Trezor_Connect_API
  - trezor は bridge を native アプリとして入れるタイプ
    - https://wallet.trezor.io/#/bridge
    - 実装？
      - https://github.com/trezor/trezord-go
  - https://github.com/trezor/connect/blob/1b194882aec96d0744b96e340e549f60a7041b41/src/js/iframe/builder.js#L45
    - `settings.iframeSrc` の iframe を作って、そこに PostMessage している
      - 設定はここ
        - https://github.com/trezor/connect/blob/bb7b23076ec98f54eae0d57c58e62160a798a68a/src/js/data/ConnectSettings.js#L121
- 結局どちらも hack 的なことは難しそう
  - そもそも bridge を偽装するのはどうなんだ？
    - bridge 先を UI から変更できるとすると、詐欺が増えそう
  - 仮想 USB 的なのを作ってハードウェアウォレットに偽装する方法
    - USB のデバイスがちゃんとしたハードウェアウォレットか検証しているだろうし難しい
  - fork して任意の keyring を追加する方法が良さそうか
