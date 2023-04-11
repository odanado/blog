---
title: Vue Developer Experience / VueDXを試した
publishedAt: 2020-11-09
---

## Vue Developer Experience / VueDX とは

- https://github.com/znck/vue-developer-experience
  - DX を向上させる Vue に関するツール群
    - 2020-11-08 時点ではプレアルファバージョンらしく、11 月末にアルファリリースの予定みたい
  - vite の vue tepmlate に採用されていて、どんどん利用者は増えていきそうな予感
    - https://github.com/vitejs/create-vite-app/blob/20df7230e57e2049015589a89e74b17d1698faa5/template-vue-ts/package.json

## 試したいモチベーション

- このブログに Storybook の導入を試みている中で、`.vue` ファイルで `export` した型を `.stories.ts` ファイルから参照したくなった
  - Storybook には `Story` という型があり、各 Story を記述するときに利用できる
  - 以下は React の例

```tsx
// List.stories.tsx

import React from "react";
import { Story, Meta } from "@storybook/react/types-6-0";
import { List, ListProps } from "./List";

export default {
  component: List,
  title: "List",
} as Meta;

// Always an empty list, not super interesting
const Template: Story<ListProps> = (args) => <List {...args} />;
```

https://storybook.js.org/docs/react/writing-stories/introduction#stories-for-two-or-more-components

- `Template` 関数の `args` の型が `List` のコンポーネントファイルが export する `ListProps` になる
  - これと同様のことをしたい場合、 TypeScript (tsserver/tsc) に `.vue` ファイルを理解してもらう必要がある

## VueDX で出来ること

- [@vuedx/typecheck](https://github.com/znck/vue-developer-experience/tree/master/packages/typecheck) を使うと CLI から型チェックが可能
  - `.vue` ファイルや それを import した `.ts` ファイルの型チェックが可能
  - `tsc` のラッパー的な実装になっている
  - ただ、CLI で型チェックすること自体は [Vetur](https://github.com/vuejs/vetur) の CLI ツールである [vti](https://github.com/vuejs/vetur/tree/master/vti) でも可能

## VueDX で出来ないこと

- `tsc`/`tsserver` コマンドでの `.vue` ファイルの型チェック
  - [@vuedx/typescript-plugin-vue](https://github.com/znck/vue-developer-experience/tree/master/packages/typescript-plugin-vue) という `.vue` ファイルの型チェックを行う TypeScript Plugin が開発されている
    - `tsconfig.json` の `plugins` に `{"name": "@vuedx/typescript-plugin-vue"}` を指定できる
  - tsc/tsserver が読み込むファイルの拡張子は限定されている
    - `.ts`/`.tsx` と設定によっては `.js`/`jsx`/`.json` も
    - この制限を解除する `allowNonTsExtensions` というオプションがあるが、CLI からは指定できない
      - `@vuedx/typecheck` はこの引数に `true` を渡している
        - https://github.com/znck/vue-developer-experience/blob/252054da80afc0841b10fc91f321fe0e71acd660/packages/typecheck/src/index.ts#L101
      - オプションを expose する提案はあるけど進んでない...
        - [Expose compiler option allowNonTsExtensions · Issue #28447 · microsoft/TypeScript](https://github.com/microsoft/TypeScript/issues/28447)
