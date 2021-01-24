---
title: zkSync を試した
publishedAt: 2021-01-20
---

Rollup が熱いらしい。


## チュートリアルをやる
- https://zksync.io/sdk/js/tutorial.html を順番にやる
  - 一部 typo があったのでプルリク投げた
    - [fix typo of ethers.getDefaultProvider by odanado · Pull Request #35 · matter-labs/zksync-docs](https://github.com/matter-labs/zksync-docs/pull/35)

### L2 にデポジットする
- チュートリアルのコードをコピペしてくる

```ts
async function main(): Promise<void> {
  const MNEMONIC = process.env.MNEMONIC!;
  const syncProvider = await zksync.getDefaultProvider("rinkeby");
  const ethersProvider = ethers.getDefaultProvider("rinkeby");

  // memo: 0x13FCd5b4348feFe49aAcf98275cBd9f5F2A2acd2
  const ethWallet = ethers.Wallet.fromMnemonic(MNEMONIC).connect(
    ethersProvider
  );

  console.log(ethWallet.address);

  const syncWallet = await zksync.Wallet.fromEthSigner(ethWallet, syncProvider);

  const deposit = await syncWallet.depositToSyncFromEthereum({
    depositTo: syncWallet.address(),
    token: "ETH",
    amount: ethers.utils.parseEther("0.00000000000001"),
  });

  console.log(deposit);

  console.log(await deposit.awaitReceipt());

  console.log(await deposit.awaitVerifyReceipt());
}
```

- `deposit.awaitReceipt` の結果はわりとすぐ返ってくる
```js
{
  executed: true,
  block: { blockNumber: 5090, committed: true, verified: false }
}
```

- `deposit.awaitVerifyReceipt` の結果は結構待つ
  - https://rinkeby.zkscan.io/explorer/ を見るに1時間に1回のペースでしか Verify されないっぽい...？
- Ethereum の deposit のトランザクション
  - https://rinkeby.etherscan.io/tx/0xdadad25caf7d1a84ac2b9c829aa082943f79ced62957124083a82d1eadab5c86
  - `ethWallet` の address を引数に渡して `depositETH` を呼び出している
  - deposit の proxy コントラクト
    - https://rinkeby.etherscan.io/address/0x82f67958a5474e40e1485742d648c0b0686b6e5d
  - 実際の deposit コントラクト
    - https://rinkeby.etherscan.io/address/0x5ba6758440508a51627c667bec04d8d3fe83ff6c
- zkSync コントラクトを追う
  - `depositETH`
    - https://github.com/matter-labs/zksync/blob/47bb16fe233d2695c50ccf291dc77dd9f0036dd0/contracts/contracts/ZkSync.sol#L174
  - `registerDeposit`
    - https://github.com/matter-labs/zksync/blob/47bb16fe233d2695c50ccf291dc77dd9f0036dd0/contracts/contracts/ZkSync.sol#L174
  - `Deposit` は struct
    - https://github.com/matter-labs/zksync/blob/47bb16fe23/contracts/contracts/Operations.sol#L46
  - `Operations.writeDepositPubdata` は `Deposit` を `bytes` にエンコードする関数
  - `addPriorityRequest`
    - https://github.com/matter-labs/zksync/blob/47bb16fe233d2695c50ccf291dc77dd9f0036dd0/contracts/contracts/ZkSync.sol#L411
    - `firstPriorityRequestId` はデータの削除のために配列をシフトするための変数だと思う
    - `priorityRequests` は `mapping(uint64 => PriorityOperation)` なマップ
      - https://github.com/matter-labs/zksync/blob/47bb16fe233d2695c50ccf291dc77dd9f0036dd0/contracts/contracts/Storage.sol#L104

## アカウントのアンロック

```ts
  if (!(await syncWallet.isSigningKeySet())) {
    if ((await syncWallet.getAccountId()) == undefined) {
      throw new Error("Unknown account");
    }

    const changePubkey = await syncWallet.setSigningKey({ feeToken: "ETH" });

    await changePubkey.awaitReceipt();
  }
```

実行しても次のエラーが出る

```ts
ZKSyncTxError: zkSync transaction failed: Not enough balance
    at Transaction.<anonymous> (/Users/odan/source/github.com/odan-sandbox/zksync-sandbox/node_modules/zksync/build/wallet.js:619:36)
    at Generator.next (<anonymous>)
    at fulfilled (/Users/odan/source/github.com/odan-sandbox/zksync-sandbox/node_modules/zksync/build/wallet.js:5:58)
    at processTicksAndRejections (node:internal/process/task_queues:93:5) {
  value: {
    executed: true,
    success: false,
    failReason: 'Not enough balance',
    block: { blockNumber: 5178, committed: true, verified: false }
  }
}
```

- https://rinkeby.zkscan.io/accounts/0x13FCd5b4348feFe49aAcf98275cBd9f5F2A2acd2
  - 0.00000000000003 ETH しかないから...？
    - https://rinkeby.zkscan.io/explorer/transactions/40250d7a579278058f0bb3dd317eb3d7b7be82ee5b2dd55129626a6f90344eba
    - 失敗したトランザクションを見ると Fee に `ETH 0.0000331` と書いてあった
  - 0.1 ETH を更に deposit してみる
    - deposit したら↑のエラーで失敗したと思ったトランザクションが成功になったっぽい...？
    - 同じブロックの間ならこういうことが可能なんだろうか
  - unlock できると `isSigningKeySet` は true を返すようになるみたい
- Ethereum 上ではトランザクションは発行されないっぽい

## アカウントの状態を見る

```ts
  const { syncWallet } = await getProviderAndWallet(MNEMONIC);

  const state = await syncWallet.getAccountState();

  console.log({ state });
```

- committed か verified な state を見ることができる

```ts
{
  state: {
    address: '0x13fcd5b4348fefe49aacf98275cbd9f5f2a2acd2',
    id: 6722,
    depositing: { balances: {} },
    committed: {
      balances: [Object],
      nonce: 1,
      pubKeyHash: 'sync:00b0ee1b1934ac8f606bceaebb6ffaf2ae520ee1'
    },
    verified: {
      balances: [Object],
      nonce: 1,
      pubKeyHash: 'sync:00b0ee1b1934ac8f606bceaebb6ffaf2ae520ee1'
    }
  }
}
```

- `pubKeyHash` が committed と verified の両方にあるのは changePubKey 中は値が違うからかな

## zkSync 上で ETH を転送

```ts
  const amount = zksync.utils.closestPackableTransactionAmount(
    ethers.utils.parseEther("0.01")
  );
  console.log({ amount });

  // 0xd2820FA24B72D7d25DE2C932dC40b10b0536e06C
  console.log(syncWallet2.address());

  const transfer = await syncWallet.syncTransfer({
    to: syncWallet2.address(),
    token: "ETH",
    amount,
  });
  console.log({ transfer });

  const transferReceipt = await transfer.awaitReceipt();
  console.log({ transferReceipt });
```

- `closestPackableTransactionAmount` は浮動小数点的な近似なんだろうか
  - 浮動小数点だとゼロ知識証明的に都合が悪い...？
- トランザクション
  - https://rinkeby.zkscan.io/explorer/transactions/6507598fa302fa57cfa9f6f3981f71339090e2a9661911045b7bf2113815fbd0
- この時点では Ethereum 側にはなにもない(それはそう)
  - https://rinkeby.etherscan.io/address/0xd2820fa24b72d7d25de2c932dc40b10b0536e06c

## Ethereum に引き出す

```ts
  // 0xd2820FA24B72D7d25DE2C932dC40b10b0536e06C
  console.log(syncWallet2.address());
  const withdraw = await syncWallet2.withdrawFromSyncToEthereum({
    ethAddress: ethWallet2.address,
    token: "ETH",
    amount: ethers.utils.parseEther("0.001"),
  });

  console.log({ withdraw });

  console.log(await withdraw.awaitReceipt());

  console.log(await withdraw.awaitVerifyReceipt());
```

- 実行すると locked だよと怒られる
  - https://rinkeby.zkscan.io/explorer/transactions/0bf83a63a06dd03305a688fc0500ff3e417667481b7be841bd111c64ca658a61
  - status が `Rejected`

```ts
{
  value: {
    executed: true,
    success: false,
    failReason: 'Account is locked',
    block: { blockNumber: 5180, committed: true, verified: false }
  }
}
```

- `setSigningKey` しておく
- unlock 後は成功した
  - https://rinkeby.zkscan.io/explorer/transactions/fcd819b532b5b857dd1ee5070758c09da54708776ad4af7d27349cd574f7da3b
  - ETH tx hash は `Not yet sent on the chain.`
  - ファイナリティを速める技術じゃないので時間がかかる
