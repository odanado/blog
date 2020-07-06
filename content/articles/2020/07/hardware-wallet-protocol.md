---
title: ハードウェアウォレットのプロトコルを話したい
publishedAt: 2020-07-06
---

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
- 結局どちらも hack 的なことは難しそう
  - そもそも bridge を偽装するのはどうなんだ？
  - fork して任意の keyring を追加する方法が良さそうか
