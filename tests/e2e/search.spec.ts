import { expect, test } from "@playwright/test"

test.use({ locale: "en-US" })

test("pressing Enter puts the query in the URL", async ({ page }) => {
	await page.goto("/en")

	await page.getByRole("searchbox").fill("react")
	await page.getByRole("searchbox").press("Enter")

	await expect(page).toHaveURL(/[?&]q=react/)
})

test("clicking Search puts the query in the URL", async ({ page }) => {
	await page.goto("/en")

	await page.getByRole("searchbox").fill("vue")
	await page.getByRole("button", { name: "Search" }).click()

	await expect(page).toHaveURL(/[?&]q=vue/)
})

test("submitting an empty box clears the query", async ({ page }) => {
	await page.goto("/en?q=react")

	await page.getByRole("searchbox").fill("")
	await page.getByRole("searchbox").press("Enter")

	await expect(page).toHaveURL(/\/en$/)
})
