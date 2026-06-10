# 詳細 (Detail)

検索結果からリポジトリの詳細ページに遷移し、統計を確認する機能。各シナリオには言語非依存の安定コード `DETAIL-NNN` を付与する。`[x]` は自動テストが存在することを示す。

## 詳細を見る

- [x] **[DETAIL-001]** 検索結果から詳細ページに遷移し統計が表示される
  - 前提: `react` の検索結果
  - 操作: `facebook/react` のカードを選ぶ
  - 期待: `/repos/facebook/react` に遷移し、リポジトリ名と Star・Watcher・Fork・Issue 数が表示される（Watcher 数は `subscribers_count` 由来で、スター数とは異なる）
  - Automated: `tests/e2e/detail.spec.ts`

- [x] **[DETAIL-002]** 存在しないリポジトリは not-found ページを表示する
  - 前提: 存在しないリポジトリの URL
  - 操作: ページを直接開く
  - 期待: 「リポジトリが見つかりません」の not-found ページが表示される
  - Automated: `tests/e2e/detail.spec.ts`
