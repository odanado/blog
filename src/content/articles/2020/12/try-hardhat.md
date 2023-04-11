---
title: hardhat を試した
publishedAt: 2020-12-27
---

Ethereum のスマートコントラクト開発の補助ツールである [hardbat](https://hardhat.org/) を試してみました。個人的には truffle の代替になってくれることを期待して試してみました。

試した内容は https://github.com/odan-sandbox/erc721-compare-gas-used にあります。

## hardhat.config.js

- デフォルトで生成される config ファイルはこんな感じ

```js
require("@nomiclabs/hardhat-waffle");

// This is a sample Hardhat task. To learn how to create your own go to
// https://hardhat.org/guides/create-task.html
task("accounts", "Prints the list of accounts", async () => {
  const accounts = await ethers.getSigners();

  for (const account of accounts) {
    console.log(account.address);
  }
});

// You need to export an object to set up your config
// Go to https://hardhat.org/config/ to learn more

/**
 * @type import('hardhat/config').HardhatUserConfig
 */
module.exports = {
  solidity: "0.7.3",
};
```

- 3 つの部分から成るっぽい
  - plugin を読み込む部分
  - task を定義する部分
    - gulp を思い出す記法...
    - task runner は `npm scripts` かシェルスクリプトに寄せて、ツール側に持たせたくない...
  - truffle っぽい config を書く部分
    - network に応じて optimizer を切り替える方法はない？
      - ローカルだと false にして、メインネットでは true にしておきたい
      - https://hardhat.org/guides/compile-contracts.html
      - https://hardhat.org/config/#available-config-options

## キャッシュ

- `artifacts` や `cache` にコンパイル結果をキャッシュしてくれるみたい
- truffle だとコマンド実行するたびにコンパイルが走っていた記憶がある

## TypeScript 対応

- hardhat.config.js
  - グローバルな変数 `hre` やグローバルな関数 `task` があるので、型定義を書いてやる必要がある
    - https://hardhat.org/advanced/hardhat-runtime-environment.html#as-global-variables
    - hardhat 側で提供されているかもしれないけど、見つけられなかった
  - グローバル変数、TypeScript で真面目にやるなら Solution style の tsconfig を書く必要があるのでめんどい...

```ts
declare var task: typeof import("hardhat/config").task;
declare var hre: import("hardhat/types").HardhatRuntimeEnvironment;
```

- hardhat.config.ts
  - https://hardhat.org/guides/typescript.html
  - 完全に TypeScript 対応することもできる
  - 例: https://github.com/odan-sandbox/erc721-compare-gas-used/blob/master/hardhat.config.ts

## scripts

- https://hardhat.org/guides/scripts.html
- `npx hardhat run script.js` みたいにして実行できる
  - グローバル変数 `hre` が自動的に inject される
- 冪等性を担保する仕組みはない
  - デフォルトだと scripts に deploy.js というコントラクトをデプロイをするスクリプトファイルが生えるが、このファイルを実行するたびに新しいコントラクトがデプロイされてしまう
  - truffle はフレームワーク的だったけど、hardhat は toolchain 的な思想っぽい
  - デプロイプラグインについて議論中っぽい
    - https://github.com/nomiclabs/hardhat/issues/381
    - サードパーティのツール、良さそう
      - https://github.com/wighawag/hardhat-deploy

## グローバル変数 hre を使わない

- task
  - https://hardhat.org/guides/create-task.html#advanced-usage
  - action の第 2 引数に `hre` が渡される
- test や scripts
  - https://hardhat.org/advanced/hardhat-runtime-environment.html#explicitly
  - `const hre = require("hardhat")` すれば良い

## eth-optimism/ovm-toolchain

- https://hardhat.org/plugins/buidler-ovm-compiler.html
  - OVM の plugin もある :eyes:

## テスト

- solidity 側のスタックトレースも表示する機能があるらしく良さそう
  - https://hardhat.org/hardhat-network/#solidity-stack-traces

## 感想

- グローバル変数に依存しない仕組みの提供や、TypeScript に対応しているのが良い
- 毎回コンパイルしないので動作が軽いのも良い
- task は必要ない気がする
  - task runner 組みたいなら `npm scripts` やシェルスクリプトで良い
  - 引数をコマンドラインからよしなに受け取りたいなら yargs などを使うほうが良い
- scripts はいい感じに network を切り替えるために使えるので有用
  - 本番運用するなら hardhat-deploy は必須な気がする
- truffle よりは断然開発体験が良いのでこっちを使っていきたい
