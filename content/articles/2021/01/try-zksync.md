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
