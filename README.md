[English](README.en.md) | 日本語

# GitHub リポジトリ検索

GitHub のリポジトリをキーワードで検索し、結果を閲覧し、任意のリポジトリの詳細ページ（オーナー・言語・Star・Watcher・Fork・Issue）を開けます。Next.js 16 で実装しています。

デモ: <https://github-search-theta-one.vercel.app>

## 機能

- GitHub REST API（`GET /search/repositories`）へのキーワード検索。結果は一覧で表示し、無限スクロールで読み込みます。
- 各結果の詳細ページ（モーダルではなく独立したルート）。リポジトリ名・オーナーアイコン・言語・Star / Watcher / Fork / Issue 数を表示します。
- ルーティングされた `ja` / `en` の多言語対応と、ライト / ダーク / システムのテーマ。

## 技術スタック

- Next.js 16（App Router・Turbopack・React Server Components）
- TypeScript・Tailwind CSS v4・Base UI（スタイルなしのプリミティブ）
- next-intl：ルーティングされた `ja` / `en` の国際化
- next-themes：ライト / ダーク / システム
- Biome（lint + format）・Vitest + Testing Library + MSW（ユニット）・Playwright（e2e）・Storybook（コンポーネントワークショップ）
- pnpm

## セットアップ

### 前提

- Node 24 以上・pnpm 11 以上（または [`mise`](https://mise.jdx.dev)、`mise install` が `mise.toml` を読み込みます）

### インストール

```bash
pnpm install
```

### 環境変数（任意）

```bash
cp .env.example .env
```

`GITHUB_TOKEN` は任意です。未設定でも動作し、GitHub API のレート制限が低くなるだけです。`.env.example` を参照してください。

### 起動

```bash
pnpm dev
```

<http://localhost:3000> を開くと、ブラウザの言語に応じて `/ja` または `/en` にリダイレクトされます。

### テストと Storybook

```bash
pnpm test          # ユニットテスト（Vitest + MSW）。監視モードは pnpm test:watch
pnpm test:e2e      # Playwright の e2e：アプリをビルドし、モックの GitHub サーバーに対して実行
pnpm storybook     # http://localhost:6006 でコンポーネントワークショップ
```

e2e は `:3000` / `:4000` で独自のサーバーを起動するため、`pnpm dev` が動いていれば先に止めてください。さもないと Playwright が（実際の GitHub API を叩く）開発サーバーを再利用し、モック前提のビルドを使いません。

## スクリプト

| コマンド                        | 内容                                |
| ------------------------------- | ----------------------------------- |
| `pnpm dev`                      | 開発サーバー                        |
| `pnpm build` / `pnpm start`     | 本番ビルド / 配信                   |
| `pnpm lint` / `pnpm fmt`        | Biome のチェック / 自動修正         |
| `pnpm typecheck`                | ルート型生成 + `tsc --noEmit`       |
| `pnpm test` / `pnpm test:watch` | Vitest                              |
| `pnpm test:e2e`                 | Playwright                          |
| `pnpm storybook`                | `:6006` でコンポーネントワークショップ |

## 設計上の判断

プロダクション水準を目指して意識したポイントです。

### アーキテクチャ

- データは Server Components で取得するため、`GITHUB_TOKEN` がクライアントに渡りません。未認証でも（レート制限は低くなりますが）動作します。
- Octokit や axios のようなクライアントライブラリではなく、素の `fetch` を使っています。依存が増えず（Octokit だけで 16 パッケージ / 7.3 MB、axios も信頼・監査・更新の対象が 1 つ増えます）、さらに Next.js ではフレームワークがグローバルの `fetch` を Data Cache・`revalidate`・キャッシュタグで拡張しており、axios や Octokit の呼び出しはそれを完全にバイパスしてしまいます。どちらも欲しいランタイムバリデーションは提供しないため、`fetch` を薄いクライアントで包み、zod でパースして型付きの結果を返します。
- データ層は、汎用のトランスポート（`GithubClient.request(path, schema)`）とドメイン API（`GithubService.searchRepositories(...)`）に分割しています。HTTP とパースの仕組みを一箇所にまとめ、呼び出し側は素直なドメイン操作として読めます。
- ワイヤー形式の検証には、生成物（orval / `@octokit/openapi-types`）ではなく手書きの zod スキーマを使っています。公式の OpenAPI 仕様は、実際に使う 2 エンドポイント・7 フィールドに対して数メガバイトあります。対象を絞った手書きスキーマのほうが軽量で、かつ堅牢です（読み取るフィールドだけを検証し、それ以外は捨てます）。
- GitHub REST API を使っていますが、ここに微妙な罠があります。REST の `watchers_count` は Star 数のエイリアスなので、Watcher 数は詳細エンドポイントの `subscribers_count` から読み取ります。それらしいフィールドを素直に使うと誤った値になります。

### Next.js の活用

- Server Components により、データ層は完全にサーバー側で完結し、データ取得のためのクライアント JS はゼロです。
- Server Actions（`"use server"`）が、無限スクロールの追加読み込みと、キャッシュを破棄する再試行の両方を担います。
- `<Suspense>` によるストリーミングで、読み込み中はスケルトンを表示しつつ、再検索の間も前の結果を画面に残し、スケルトンに戻って点滅しないようにしています。
- Data Cache（`revalidate`）とキャッシュタグ・`updateTag`（Next 16）により、再試行で read-your-own-writes な鮮度が得られます。
- `generateMetadata` と `generateStaticParams` で、静的に既知のロケールに対するロケール別タイトル / SEO を提供します。
- `error.tsx` / `not-found.tsx` のルート規約で失敗状態を扱い、`next/image` でアバターを最適化し、`next/font` でフォントをセルフホストしてレイアウトシフトを防ぎます。
- Middleware がロケールルーティングを担い、`React.cache()` がリクエスト単位の取得を重複排除し、ビルドは Turbopack で行います。

### コードスタイル

- データにクラスは使いません。関数はオブジェクト＋クロージャでまとめ（リソースの API は 1 つの PascalCase の名前空間オブジェクト）、ミューテーションは避けます。
- 型付けは厳格に徹底しています。信頼できる境界（JSON・環境変数）以外では `as` キャストを使わず、非 null アサーション `!` も `any` も使わず、「値が無い」場合は常に明示的に絞り込むか処理します。
- ドメインの状態は判別可能なユニオンで表し、タグに対する網羅的な `switch` と `never` の `default` で消費します。未処理のケースを足すとコンパイルエラーになります。TypeScript におけるパターンマッチの代替です。
- GitHub データ層は失敗を型付きの `Result` ユニオンで返します。レート制限・ネットワーク・タイムアウト・パースのエラーは例外ではなく「値」であり、ライブラリのエラー（`ZodError` や fetch の throw）が境界の外に漏れません。
- ドメインモデルは純粋な `readonly` 型です。zod スキーマと変換は（モデルではなく）境界（`github.schema.ts`）に置き、その境界でワイヤーの `null` をドメインの `undefined` に変換するため、ドメインが 2 種類の「無い」を扱うことはありません。
- i18n のメッセージキーは型安全で（キーの不足やタイポはコンパイルエラー）、`ja` / `en` のカタログ一致テストに支えられています。これらにより、型そのものが多くのバグをランタイム前に捕まえるテストになります。
- 関数はフェーズ（準備 → 検証 → 処理 → 返却）ごとに空行で区切って読めるようにし、マジック値は `UPPER_SNAKE_CASE` 定数として命名します。
- ファイルは深いフォルダ階層にせず、自己説明的で冗長な kebab-case の名前（フォルダに埋もれた素の `service.ts` ではなく `github.service.ts`）でフラットに保ち、barrel（`index.ts`）も作りません。フォルダを辿るのではなくファイル名のあいまい検索で移動するため、各名前はそれ単体で一意かつ grep しやすく、1 つのシンボルに 1 つのパスだけが対応します。

### キャッシュ

- GitHub のレスポンスはサーバーの Data Cache（`revalidate`）にキャッシュし、再試行ではタグ + `updateTag` でそのキャッシュを破棄して、古いエラーを返さず実際に再取得します。
- アバターは積極的にキャッシュします。URL がコンテンツでバージョン管理されている（`?v=N`）ため、`minimumCacheTTL` を 31 日に設定し、URL 自体をキャッシュバスターとして使います。

### 使いやすさ

- 無限スクロールは先読みを積極的に行い、閲覧がシームレスに感じられるようにします。先読みを追い越したときだけスピナーを出し、`overscroll-contain` で速いフリックでも末尾できっちり止まります。
- 一時的なエラー（レート制限・ネットワーク）は、行き止まりのメッセージではなく、実際の原因と再試行ボタンを表示します。
- レイアウトはレスポンシブかつモバイルファーストで、結果パネルと 4 列の統計グリッドが小さい画面にも適応します。

### セキュリティ

npm や GitHub Actions を狙ったサプライチェーン攻撃は、もはや日常的です（メンテナアカウントの乗っ取りによる悪意あるリリースの公開、タグを密かに悪意あるコードへ再ポイントする手口など）。そのため依存関係と CI の姿勢を、後回しではなくプロダクションの関心事として扱っています。

- 最小限の依存が第一の防御線です。ライブラリより（`fetch`・`Intl`・`Headers` といった）プラットフォームを優先し、パッケージが少なければ侵入口も少なくなります。
- Dependabot はクールダウン付きで動かし、公開されたばかりのリリースを 1 日は取り込みません。乗っ取られたバージョンが lockfile に届く前に表面化する猶予を作ります。
- GitHub Actions は可動タグではなくコミット SHA で固定しているため、タグの再ポイント（tj-actions 系の攻撃）で CI に悪意あるコードを差し込まれません。
- すべての PR をスキャンします。既知の脆弱な依存には OSV-Scanner、安全でないワークフローには zizmor。
- アプリ層では、厳格な Content-Security-Policy とセキュリティヘッダー一式（HSTS・X-Frame-Options・Referrer-Policy・Permissions-Policy・X-Content-Type-Options）を設定し、GitHub トークンはサーバー専用でクライアントバンドルには一切入れません。

### テストと CI

- テストは 2 階層です。ロジックのユニットテスト（HTTP 境界は MSW でモック）と、本番ビルドに対する Playwright の e2e で、後者は決定的なフック（`__ratelimit__`・`__empty__`・`__failmore__`）を持つモックの GitHub サーバーに対して実行します。
- テストは本物のロジック（エラー分類器・結果の重複排除・ビューステート変換）を対象とし、ライブラリの素通しやフレームワークの繋ぎ込みは対象にしません。
- ユーザー向けの振る舞いは [`docs/test/`](docs/test/) の Gherkin 形式の仕様ドキュメント（[search](docs/test/search.md)・[detail](docs/test/detail.md)）に、安定した `SEARCH-NNN` / `DETAIL-NNN` コードと、それを自動化するテストへのリンク付きで記述しています。
- ビジュアルコンポーネントには Storybook の story を用意し、テスト名はプロダクトに合わせて日本語で記述し、CI は各 PR をゲート（lint・typecheck・test・build・e2e）しつつセキュリティスキャン（OSV-Scanner・zizmor）も走らせます。

## 代替案

ここでの選択は、GitHub トークンをサーバー側に保つ、単一でサーバーレンダリングする Next.js コードベースにまとめています。より大きく長期的なプロダクトでは、ふだんは別の構成を選びます。

- 関数型のコアには Effect-TS。型付きエラー、パターンマッチには `Match`、パースとエンコードには `@effect/schema`、そして pipe ベースの合成を使います。今回はエンドポイント 2 つを、Effect を持ち込まず手書きの zod スキーマと小さな `Result` ユニオンでまかないました。
- 疎結合な SPA。Vite に TanStack Router と TanStack Query を組み合わせ、データ取得・キャッシュ・無効化は TanStack Query に任せます。今回は Server Components のほうが、別途バックエンドを用意せずトークンをクライアントから隠せるため適していました。
- コントラクトファーストな API クライアント。ふだんは RESTful API を作り、その実装から OpenAPI 仕様を生成し、orval で型付きクライアントを生成します。クライアントは手書きではなくコントラクトから導出されます。GitHub の 2 エンドポイントには、対象を絞った手書きスキーマのほうが軽量でした。

一貫しているのは、関心を分離してフレームワークに縛られないことです。フレームワーク間を移動できる、コントラクトファーストなフロントエンドとバックエンドを好みます。ここではあえてその逆（一体型の Next.js アプリ）にしました。トークンをサーバー側に保つ最も簡素な方法だからです。

## プロジェクト構成

```
src/
├── app/[locale]/        ルート（薄いシェル）。ルートレイアウトはパススルー
├── features/            ドメイン別の UI（search・repo-detail・shared）
├── services/github/     GitHub REST クライアント（トランスポート + 操作）
├── models/              ドメイン型
├── config/              環境変数アクセス（サーバー専用）
├── i18n/                next-intl のルーティング + リクエスト設定
├── proxy.ts             ロケールルーティング用ミドルウェア（Next 16）
└── lib/                 汎用ユーティリティ（cn・フォーマッタ）
```

## AI の利用について

本プロジェクトは Claude Code を用い、`.claude/rules/` の規約に沿って実装しました。協働は意図的に人間主導かつコミット単位で進めています。アーキテクチャ上の判断は私が行い、すべての変更を取り込む前にレビューしました。

私の規約はコード化されており、セッションごとに説明し直すことはありません。`.claude/rules/` に再利用可能なルール一式を用意し、すべてのプロジェクトで使い回しています：コーディングスタイル（クラスを使わない・網羅的な `switch`/`never`・エラーを値として扱う・命名・空行によるフェーズ分け）、テスト戦略、コミット / ブランチ / PR のワークフロー、設定とセキュリティの規約です。エージェントはこれらに沿って作業するため、出力は汎用的なデフォルトではなく私の基準に合い、レビューはセンスを教え直すというより遵守の確認が中心になります。

作業は GitHub Issue（[ghlobes](https://github.com/milkyskies/ghlobes) 経由）で管理し、1 機能につき 1 ブランチ・PR・CI としました。エージェントが各単位（コンポーネント・GitHub クライアント・テスト一式）を実装して品質ゲートを走らせ、私が各コミットをレビューし、大きめの変更には `/simplify` と `/code-review` を通し、グリーンになって初めてマージしました。
