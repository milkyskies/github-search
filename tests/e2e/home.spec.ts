import { expect, test } from "@playwright/test"

test.describe("japanese browser preference", () => {
	test.use({ locale: "ja-JP" })

	test("serves the japanese home page from the bare path", async ({ page }) => {
		await page.goto("/")

		await expect(page).toHaveURL(/\/ja$/)
		await expect(page.getByRole("heading", { level: 1 })).toHaveText("GitHub リポジトリ検索")
	})
})

test.describe("english browser preference", () => {
	test.use({ locale: "en-US" })

	test("serves the english home page from the bare path", async ({ page }) => {
		await page.goto("/")

		await expect(page).toHaveURL(/\/en$/)
		await expect(page.getByRole("heading", { level: 1 })).toHaveText("GitHub Repository Search")
	})
})
