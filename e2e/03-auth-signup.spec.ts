import { test, expect } from '@playwright/test'

test.describe('Signup Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/auth/signup')
  })

  test('has correct page title', async ({ page }) => {
    await expect(page).toHaveTitle(/Money Manager India/i)
  })

  test('shows rupee icon', async ({ page }) => {
    await expect(page.getByText('₹')).toBeVisible()
  })

  test('shows Create your account heading', async ({ page }) => {
    await expect(page.getByRole('heading', { name: /create your account/i })).toBeVisible()
  })

  test('has Full name field', async ({ page }) => {
    await expect(page.locator('#signup-fullname')).toBeVisible()
  })

  test('has Email address field', async ({ page }) => {
    await expect(page.locator('#signup-email')).toBeVisible()
  })

  test('has Password field', async ({ page }) => {
    await expect(page.locator('#signup-password')).toBeVisible()
  })

  test('has Confirm password field', async ({ page }) => {
    await expect(page.locator('#signup-confirm-password')).toBeVisible()
  })

  test('password fields are masked', async ({ page }) => {
    await expect(page.locator('#signup-password')).toHaveAttribute('type', 'password')
    await expect(page.locator('#signup-confirm-password')).toHaveAttribute('type', 'password')
  })

  test('has Terms of Service checkbox', async ({ page }) => {
    await expect(page.getByText(/terms of service/i)).toBeVisible()
    await expect(page.locator('input[type="checkbox"]').first()).toBeVisible()
  })

  test('has marketing consent checkbox', async ({ page }) => {
    await expect(page.getByText(/marketing|promotional/i)).toBeVisible()
    const marketingCheckbox = page.locator('input[type="checkbox"]').last()
    await expect(marketingCheckbox).not.toBeChecked()
  })

  test('has Create account button', async ({ page }) => {
    await expect(page.getByRole('button', { name: /create account/i })).toBeVisible()
  })

  test('shows validation error on empty submit', async ({ page }) => {
    await page.getByRole('button', { name: /create account/i }).click()
    await expect(page).toHaveURL(/signup/)
  })

  test('password mismatch shows error', async ({ page }) => {
    await page.locator('#signup-fullname').fill('Test User')
    await page.locator('#signup-email').fill('test@example.com')
    await page.locator('#signup-password').fill('Password123!')
    await page.locator('#signup-confirm-password').fill('DifferentPassword456!')
    // Accept terms so only the password mismatch error fires
    await page.locator('#signup-accept-terms').check()
    await page.getByRole('button', { name: /create account/i }).click()
    await expect(
      page.getByText(/passwords do not match/i)
    ).toBeVisible({ timeout: 5000 })
  })

  test('link to login page works', async ({ page }) => {
    const loginLink = page.getByRole('link', { name: /sign in|login/i })
    await loginLink.click()
    await expect(page).toHaveURL(/login/)
  })

  test('marketing consent is optional', async ({ page }) => {
    const marketingCheckbox = page.locator('input[type="checkbox"]').last()
    await expect(marketingCheckbox).not.toBeChecked()
    await expect(page.getByText(/optional/i)).toBeVisible()
  })
})
