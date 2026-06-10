import { expect, test } from "@playwright/test"

test.use({ locale: "ja-JP" })

test("一致する検索でリポジトリ一覧が表示される", async ({ page }) => {
	await page.goto("/ja?q=react")

	await expect(page.getByRole("link", { name: /facebook\/react/ })).toBeVisible()
})

test("一致が無いと空の状態が表示される", async ({ page }) => {
	await page.goto("/ja?q=__empty__")

	await expect(page.getByText("に一致するリポジトリはありません", { exact: false })).toBeVisible()
})

test("レート制限時はエラーメッセージが表示される", async ({ page }) => {
	await page.goto("/ja?q=__ratelimit__")

	await expect(page.getByText("GitHub のレート制限に達しました", { exact: false })).toBeVisible()
})
