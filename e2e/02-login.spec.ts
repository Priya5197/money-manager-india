import { test, expect } from '@playwright/test'

test.describe('Login Page', () => {
  test.beforeEach(async ({ page }) => { await page.goto('/auth/login') })

  test('has correct title', async ({ page }) => {
    await expect(page).toHaveTitle(/Money Manager India/i)
  })
  test('shows rupee icon', async ({ page }) => {
    await expect(page.getByText('₹').first()).toBeVisible()
  })
  test('shows brand name', async ({ page }) => {
    await expect(page.getByText('Money Manager India').first()).toBeVisible()
  })
  test('shows Welcome back heading', async ({ page }) => {
    await expect(page.locator('h2').filter({ hasText: /welcome back/i })).toBeVisible()
  })
  test('has email input (id=login-email)', async ({ page }) => {
    await expect(page.locator('#login-email')).toBeVisible()
  })
  test('has password input (id=login-password)', async ({ page }) => {
    await expect(page.locator('#login-password')).toBeVisible()
  })
  test('password field is masked', async ({ page }) => {
    await expect(page.locator('#login-password')).toHaveAttribute('type', 'password')
  })
  test('has Sign in button', async ({ page }) => {
    await expect(page.getByRole('button', { name: /sign in/i })).toBeVisible()
  })
  test('has Forgot password link', async ({ page }) => {
    await expect(page.getByText(/forgot password/i)).toBeVisible()
  })
  test('has Create one free link to signup', async ({ page }) => {
    await expect(page.getByRole('link', { name: /create one free/i })).toHaveAttribute('href', /signup/i)
  })
  test('empty submit stays on login', async ({ page }) => {
    await page.getByRole('button', { name: /sign in/i }).click()
    await expect(page).toHaveURL(/login/)
  })
  test('Forgot password navigates correctly', async ({ page }) => {
    await page.getByRole('link', { name: /forgot password/i }).click()
    await expect(page).toHaveURL(/forgot-password/)
  })
})
