---
title: vercel/virtual-event-starter-kit の実装を読んでみた
publishedAt: 2020-12-20
---

[vercel/virtual-event-starter-kit: Open source demo that Next.js developers can clone, deploy, and fully customize for events.](https://github.com/vercel/virtual-event-starter-kit) は Vercel が公開したオンラインイベントのデモサイトです。このサイトの実装には現在の Web 開発のプラクティスが詰まっていると考えて読んでみました。

普段は Nuxt.js を使っていて、Next.js については何も知らない人です。

## DatoCMS
- [DatoCMS: Headless CMS, done right - DatoCMS](https://www.datocms.com/)
- `datocms.json` に config がある
- Headless CMS の1つらしい
  - 初耳だった
- スピーカーとかジョブの管理をしている

## nprogress
- [rstacruz/nprogress: For slim progress bars like on YouTube, Medium, etc](https://github.com/rstacruz/nprogress)
- Nuxt.js だとデフォルトでプログレスバーを出す機能があるけど、Next.js にはないからこれを使ってるのかな...？
- スタイルをちょっと書く
  - https://github.com/vercel/virtual-event-starter-kit/blob/main/styles/nprogress.css
- コンポーネントの実装はこれ
  - https://github.com/vercel/virtual-event-starter-kit/blob/main/components/nprogress.tsx

## CSS 変数
- https://github.com/vercel/virtual-event-starter-kit/blob/main/styles/global.css#L28-L59
- SaaS の変数じゃなくて CSS 変数を使っている
- IE11 がなき現代なら良さそう
- 色だけじゃなくて余白に関する変数も定義しているの良さそう

## react-aria
- SSRProvider/OverlayProvider
  - https://github.com/vercel/virtual-event-starter-kit/blob/main/pages/_app.tsx で `SSRProvider` と `OverlayProvider` を設定している
  - リポジトリは https://github.com/souporserious/react-aria ぽいけど、今は Adobe の方に移った？
    - Adobe: https://react-spectrum.adobe.com/react-aria/index.html
  - SSRProvider
    - https://github.com/adobe/react-spectrum/blob/main/packages/%40react-aria/ssr/src/SSRProvider.tsx
    - SSR 時と CSR 時に共通の ID を使うために必要なものっぽいけど、その ID が何のためにあるのかわからん
  - OverlayProvider
    - https://github.com/adobe/react-spectrum/blob/d6696e3192/packages/%40react-aria/overlays/src/useModal.tsx
    - modal のために必要な provider
    - modal が1つでも開いていると `aria-hidden` を設定する機能がある
- useButton
  - https://react-spectrum.adobe.com/react-aria/useButton.html
  - button タグに設定できる attr のうちアクセシビリティ関連のものを生成してくれるやつ
    - https://github.com/adobe/react-spectrum/blob/main/packages/%40react-aria/button/src/useButton.ts#L91-L108

## resize-handler.tsx
- https://github.com/vercel/virtual-event-starter-kit/blob/main/components/resize-handler.tsx
- iOS には 100vh に関するバグがあるらしく、これを解決する workaround なコンポーネント
  - [CSSでheight: 100vh;を定義したのに、iOSのスマホで高さいっぱいに表示されないのを解決するCSSのテクニック | コリス](https://coliss.com/articles/build-websites/operation/css/css-fix-for-100vh-in-ios.html)

## Reach UI
- [Reach UI](https://reach.tech/)
- アクセシビリティ周りを整えてくれるライブラリ？
- SkipNavLink
  - https://github.com/reach/reach-ui/blob/main/packages/skip-nav/src/index.tsx
  - [WebAIM: "Skip Navigation" Links](https://webaim.org/techniques/skipnav/)
  - スクリーンリーダーで読むときに画面上部のナビゲーションリンクを飛ばして、メインコンテンツから選択されるようにするもの

## pages.tsx
- https://github.com/vercel/virtual-event-starter-kit/blob/37449e5fe98ce94a4b57652816e6e6f9e0453fdf/components/page.tsx
- `head` タグの中身を実装しているコンポーネント
- 抑えておきたいタグが並んでいる気がする
- Nuxt.js だと `layouts/default.vue` の `meta` に書く内容だけど、Next.js では別のコンポーネントとして共通化するのか

## チケットの OGP image の生成
- https://github.com/vercel/virtual-event-starter-kit/blob/main/pages/api/ticket-images/%5Busername%5D.tsx にリクエストが飛ぶ
  - puppeteer を使用してチケットページのスクショを撮影
    - https://github.com/vercel/virtual-event-starter-kit/blob/151a635c47/lib/screenshot.ts
  - チケットページ
    - https://github.com/vercel/virtual-event-starter-kit/blob/151a635c47/components/ticket-image.tsx
- チケットページを React で組み立てて、`puppeteer` でスクショ撮って `image/png` としてレスポンスを返すの面白い

## .eslintrc.json
- https://github.com/vercel/virtual-event-starter-kit/blob/151a635c47/.eslintrc.json
- `plugin:@typescript-eslint/recommended-requiring-type-checking` も指定している

## 感想
- アクセシビリティに関する実装をライブラリに任せるの良さそう
  - `aria-*` に何があるかすべて無知
  - 知識ゲーの領域だと思っている
- `puppeteer` で OGP image を組み立てているの、デザイン統一できるしメンテもしやすいで良さそう
