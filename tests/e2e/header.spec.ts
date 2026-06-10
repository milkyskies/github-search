import { expect, test } from "@playwright/test"

test.use({ locale: "ja-JP" })

test("言語を英語に切り替えるとURLが /en になる", async ({ page }) => {
	await page.goto("/ja")

	await page.getByLabel("言語").click()
	await page.getByRole("option", { name: "English" }).click()

	await expect(page).toHaveURL(/\/en$/)
})

test("ダークテーマを選ぶと html に dark クラスが付く", async ({ page }) => {
	await page.goto("/ja")

	await page.getByRole("button", { name: "ダーク" }).click()

	await expect(page.locator("html")).toHaveClass(/dark/)
})
