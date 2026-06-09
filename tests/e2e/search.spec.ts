import { expect, test } from "@playwright/test"

test.use({ locale: "ja-JP" })

test("Enterキーで検索を実行するとクエリがURLに入る", async ({ page }) => {
	await page.goto("/ja")

	await page.getByRole("searchbox").fill("react")
	await page.getByRole("searchbox").press("Enter")

	await expect(page).toHaveURL(/[?&]q=react/)
})

test("検索ボタンで検索を実行するとクエリがURLに入る", async ({ page }) => {
	await page.goto("/ja")

	await page.getByRole("searchbox").fill("vue")
	await page.getByRole("button", { name: "検索" }).click()

	await expect(page).toHaveURL(/[?&]q=vue/)
})

test("検索欄を空にして送信するとクエリが消える", async ({ page }) => {
	await page.goto("/ja?q=react")

	await page.getByRole("searchbox").fill("")
	await page.getByRole("searchbox").press("Enter")

	await expect(page).toHaveURL(/\/ja$/)
})
