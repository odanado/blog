---
title: ISUCON10 予選 参加記
publishedAt: 2020-09-12
---

## 結果
WIP


## 個人でやったこと
### New Relic の導入
入れて config 書くだけで各リクエストのメトリクスがわかるのは便利でした。各リクエストに紐づく MySQL のクエリが見えると思っていたんですが、結局当日までやり方がわかりませんでした...。

最後 New Relic を無効化してベンチ回したら500ぐらいスコアが伸びました。

### nginx で bot 対策
レギュレーションに書いていて、手が空いていたのでやりました。nginx.conf の書き方全然知らなかったので結構手間取りました。

### nginx で 静的ファイルをcache
いつものやつ。けどベンチは API しか叩いてないし、さばけた GET リクエストの数でスコアが変化するわけでもないので、意味があったのかわかりません。

### insert を bulk insert に変更
自明な改善点だったのでやりました。nodejs の [mysql](https://www.npmjs.com/package/mysql) の nested array をいい感じに bind してくれる機能の挙動がわからずかなりハマりました。

これはその時の様子です。

<blockquote class="twitter-tweet"><p lang="ja" dir="ltr">様子です <a href="https://t.co/aaMEHsOOVf">pic.twitter.com/aaMEHsOOVf</a></p>&mdash; odan (@odan3240) <a href="https://twitter.com/odan3240/status/1304763355798749184?ref_src=twsrc%5Etfw">September 12, 2020</a></blockquote> <script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>

### nginx をロードバランサーにして app を3台に増加
夕方ぐらいからそろそろやるかとなって取り掛かりました。やり方は理解していたので楽勝だと思っていましたが、色々ハマって時間を使いました。具体的には次のとおりです。

- 最初から用意されている MySQL の isucon ユーザーは localhost からしか接続を受け付けていない
- mysqld.cnf の `bind-address` のデフォルトは 127.0.0.1
- nginx.conf の `upstream` は http 以下にしか書けない
- nginx.conf の `location` は server 以下にしか書けない

最初は app/MySQL/nginx を server1 に同居させて、server2/server3 は app だけの構成にしていました。しかし New Relic のコンソールを見ていると、server1 の CPU 使用率が100%なことに対して server2/server3 の CPU 使用率が 50% 程度なことから、server1 で app を動かすのをやめる構成にしました。


### 再起動チェック
いつものやつ。`systemctl enable` を実行するのを忘れていて、再起動したら golang の app が動いていたので危なかったです。

### トピックごとにテキストチャンネルを分ける
会話が脱線しないようになるかなと思ってやってみました。8時間という短い時間なので、あまり意味がなかったかもしません。

<blockquote class="twitter-tweet"><p lang="ja" dir="ltr">トピックごとにテキストチャンネルを作って文脈を追いやすくしてみていた、あまり効果なかったかも <a href="https://twitter.com/hashtag/isucon?src=hash&amp;ref_src=twsrc%5Etfw">#isucon</a> <a href="https://t.co/weMCwPdH3u">pic.twitter.com/weMCwPdH3u</a></p>&mdash; odan (@odan3240) <a href="https://twitter.com/odan3240/status/1304783847947513857?ref_src=twsrc%5Etfw">September 12, 2020</a></blockquote> <script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>


## チーム的にやらなかったこと
- `/api/estate/search` の `OFFSET` を `WHERE id` に置き換える
  - nginx のログから `OFFSET` に実際に渡される値の統計をとってもらったら、高々100だったのでやりませんでした
- `/api/estate/search` の `features` を正規化する
  - これも nginx のログを見て、`features` が含まれるリクエストはそこまで多くないことからやりませんでした


## 出来なかったこと
思いついたけどやる時間がなかったものを簡単にメモっておきます。

- HogeRangeId 系を DB に id として持って where で等号で比較する
- `/api/recommended_estate/:id` をいい感じにする
  - ベンチマーカーの裏設定で GET 後のコンバージョンが良いように設定されていたりしない？とか勝手に考えていました
  - ちょっと頭を使ってクエリを書き換えたけどベンチが失敗しました
- 凸多角形の内包判定を app でやる
  - 大学生の頃に競プロのためにこれを判定するライブラリを持っていたので頭に浮かびました
  - チームの人が空間 Index でいい感じにしてくれたので手を出さずに住みました

## 感想戦で知ったこと
Discord の感想戦を眺めてなるほどって思ったものを書いておきます。

- テーブルごとにDB を分ける
  - たしかに今回 JOIN がないのでこれでできる
- UPDATE の前の SELECT FOR UPDATE は不要
  - たしかに！
- クエリキャッシュ
  - 思いつかなかった
- SET 型がある
  - https://dev.mysql.com/doc/refman/5.6/ja/set.html
  - 知らなかった
- Generated Columns
  - https://dev.mysql.com/doc/refman/5.7/en/create-table-generated-columns.html
  - 知らなかった

## 感想
去年より問題はかなりシンプルになったにも関わらず、やることがたくさんあって楽しかったです。

改善しそうな何かをする前に、それって本当にやる価値あるの？と考えてしまい、そのための調査にメンバーの時間を使うことが多かったです。8時間しかない ISUCON だとやる価値がありそうなことを順番にやるよりも、ある程度の効果が期待できそうかつ、手数がそんなに多くないものから取り掛かるのが正解だったかもしれません...。

去年より問題に対する解像度や手札の数が増えてきたのを感じるので、来年も参加したいです。
