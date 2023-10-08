import { test, expect } from '@playwright/test'

test.describe(`Bookstore web application`, async () => {
  test(`Verify user logged in`, async ({ page }) => {
    await page.goto('/')
    await expect(page.getByText(process.env.USER)).toBeVisible()
  })
})
