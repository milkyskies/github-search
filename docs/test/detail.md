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

- [x] **[DETAIL-003]** 一時的なエラー時は再試行できる
  - 前提: GitHub がレート制限など一時的なエラーを返す
  - 操作: 詳細ページを開く
  - 期待: 原因に応じたメッセージとともに再試行ボタンが表示される（not-found や parse など一時的でないエラーには出さない）
  - Automated: `tests/e2e/detail.spec.ts`（詳細ページのレート制限）、`src/features/search/components/search-error.test.tsx`（共通の一時的エラー判定と再試行表示。`RepoDetailError` も同じ `GithubErrorDisplay` を経由する）
