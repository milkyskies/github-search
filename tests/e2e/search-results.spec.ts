import { expect, test } from "@playwright/test"

test.use({ locale: "ja-JP" })

test("一致する検索でリポジトリ一覧が表示される", async ({ page }) => {
	await page.goto("/ja?q=react")

	await expect(page.getByRole("link", { name: /facebook\/react/ })).toBeVisible()
})

test("もっと読み込むと次のページが追加される", async ({ page }) => {
	await page.goto("/ja?q=react")

	const cards = page.getByRole("listitem")
	await expect(cards).toHaveCount(20)

	await page.getByRole("button", { name: "もっと読み込む" }).click()

	await expect(cards).toHaveCount(40)
})

test("追加読み込みが失敗したら再試行できる", async ({ page }) => {
	await page.goto("/ja?q=__failmore__")

	await page.getByRole("button", { name: "もっと読み込む" }).click()

	await expect(page.getByText("続きを読み込めませんでした")).toBeVisible()
	await expect(page.getByRole("button", { name: "再試行" })).toBeVisible()
})

test("一致が無いと空の状態が表示される", async ({ page }) => {
	await page.goto("/ja?q=__empty__")

	await expect(page.getByText("に一致するリポジトリはありません", { exact: false })).toBeVisible()
})

test("レート制限時はエラーメッセージが表示される", async ({ page }) => {
	await page.goto("/ja?q=__ratelimit__")

	await expect(page.getByText("GitHub のレート制限に達しました", { exact: false })).toBeVisible()
})
