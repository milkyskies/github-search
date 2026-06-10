import { expect, test } from "@playwright/test"

test.use({ locale: "ja-JP" })

test("検索結果から詳細ページに遷移し統計が表示される", async ({ page }) => {
	await page.goto("/ja?q=react")

	await page
		.getByRole("link", { name: /facebook\/react/ })
		.first()
		.click()

	await expect(page).toHaveURL(/\/ja\/repos\/facebook\/react/)
	await expect(page.getByRole("heading", { name: "facebook/react" })).toBeVisible()

	await expect(page.getByText("220,000")).toBeVisible()
	await expect(page.getByText("6,700")).toBeVisible()
	await expect(page.getByText("46,500")).toBeVisible()
	await expect(page.getByText("980")).toBeVisible()
})

test("存在しないリポジトリは not-found ページを表示する", async ({ page }) => {
	await page.goto("/ja/repos/ghost/missing")

	await expect(page.getByRole("heading", { name: "リポジトリが見つかりません" })).toBeVisible()
})

test("詳細ページでレート制限時はエラーと再試行が表示される", async ({ page }) => {
	await page.goto("/ja/repos/ratelimit/example")

	await expect(page.getByText("レート制限に達しました", { exact: false })).toBeVisible()
	await expect(page.getByRole("button", { name: "再試行" })).toBeVisible()
})
