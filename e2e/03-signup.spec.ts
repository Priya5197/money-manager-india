import { test, expect } from '@playwright/test'

test.describe('Signup Page', () => {
  test.beforeEach(async ({ page }) => { await page.goto('/auth/signup') })

  test('has correct title', async ({ page }) => {
    await expect(page).toHaveTitle(/Money Manager India/i)
  })
  test('shows Create your account heading', async ({ page }) => {
    await expect(page.locator('h2').filter({ hasText: /create your account/i })).toBeVisible()
  })
  test('has Full name field (id=signup-fullname)', async ({ page }) => {
    await expect(page.locator('#signup-fullname')).toBeVisible()
  })
  test('has email field (id=signup-email)', async ({ page }) => {
    await expect(page.locator('#signup-email')).toBeVisible()
  })
  test('has password field (id=signup-password)', async ({ page }) => {
    await expect(page.locator('#signup-password')).toBeVisible()
  })
  test('password field is masked', async ({ page }) => {
    await expect(page.locator('#signup-password')).toHaveAttribute('type', 'password')
  })
  test('has Confirm password field (id=signup-confirm-password)', async ({ page }) => {
    await expect(page.locator('#signup-confirm-password')).toBeVisible()
  })
  test('has Create account button', async ({ page }) => {
    await expect(page.getByRole('button', { name: /create account/i })).toBeVisible()
  })
  test('marketing consent unchecked by default', async ({ page }) => {
    const boxes = page.locator('input[type="checkbox"]')
    if (await boxes.count() >= 2) {
      await expect(boxes.nth(1)).not.toBeChecked()
    }
  })
  test('password mismatch shows error', async ({ page }) => {
    await page.locator('#signup-fullname').fill('Test User')
    await page.locator('#signup-email').fill('test@example.com')
    await page.locator('#signup-password').fill('Password123!')
    await page.locator('#signup-confirm-password').fill('Different456!')
    await page.locator('input[type="checkbox"]').first().check()
    await page.getByRole('button', { name: /create account/i }).click()
    await expect(page.getByText(/do not match|mismatch|confirm/i)).toBeVisible()
  })
  test('Sign in link leads to login', async ({ page }) => {
    await page.getByRole('link', { name: /sign in/i }).click()
    await expect(page).toHaveURL(/login/)
  })
})
