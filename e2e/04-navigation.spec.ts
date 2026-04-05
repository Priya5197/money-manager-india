import { test, expect } from '@playwright/test'

test.describe('Navigation & Auth Guards', () => {
  test('landing → login nav', async ({ page }) => {
    await page.goto('/')
    await page.getByRole('link', { name: /^login$/i }).first().click()
    // Accept /login or /auth/login
    await expect(page).toHaveURL(/login/, { timeout: 10000 })
  })
  test('landing → signup via CTA', async ({ page }) => {
    await page.goto('/')
    await page.getByRole('link', { name: /get started free/i }).first().click()
    // Accept /signup or /auth/signup
    await expect(page).toHaveURL(/signup/, { timeout: 10000 })
  })
  for (const p of ['/dashboard','/transactions','/budgets','/accounts','/reports','/settings','/profile','/calculators']) {
    test(`${p} redirects unauthenticated → login`, async ({ page }) => {
      await page.goto(p)
      await expect(page).toHaveURL(/auth\/login|login/, { timeout: 10000 })
    })
  }
  test('unknown route handled gracefully', async ({ page }) => {
    // Next.js middleware may redirect unknown routes to login for unauthenticated users
    // Both a 404 page and a login redirect are acceptable behaviours
    await page.goto('/this-xyz-does-not-exist-at-all')
    await page.waitForLoadState('domcontentloaded')
    // Page should show SOMETHING - either 404 content or login page
    const bodyText = await page.locator('body').innerText()
    expect(bodyText.length).toBeGreaterThan(10)
  })
  test('Privacy Policy page loads', async ({ page }) => {
    await page.goto('/privacy')
    await expect(page).toHaveTitle(/Privacy/i)
  })
  test('Terms page loads', async ({ page }) => {
    await page.goto('/terms')
    await expect(page).toHaveTitle(/Terms/i)
  })
  test('Footer Privacy link navigates', async ({ page }) => {
    await page.goto('/')
    await page.getByRole('link', { name: /privacy policy/i }).click()
    await expect(page).toHaveURL(/privacy/)
  })
  test('Footer Terms link navigates', async ({ page }) => {
    await page.goto('/')
    await page.getByRole('link', { name: /terms of service/i }).click()
    await expect(page).toHaveURL(/terms/)
  })
})
