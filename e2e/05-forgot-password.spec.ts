import { test, expect } from '@playwright/test'

test.describe('Forgot Password', () => {
  test.beforeEach(async ({ page }) => { await page.goto('/auth/forgot-password') })

  test('page loads at correct URL', async ({ page }) => {
    await expect(page).toHaveURL(/forgot-password/)
  })
  test('has email input (id=forgot-email)', async ({ page }) => {
    await expect(page.locator('#forgot-email')).toBeVisible()
  })
  test('has send/reset button', async ({ page }) => {
    await expect(page.getByRole('button', { name: /send|reset|email/i })).toBeVisible()
  })
  test('has Back to login link', async ({ page }) => {
    await expect(page.getByRole('link', { name: /back|login|sign in/i })).toBeVisible()
  })
  test('empty submit stays on page', async ({ page }) => {
    await page.getByRole('button', { name: /send|reset|email/i }).click()
    await expect(page).toHaveURL(/forgot-password/)
  })
})
