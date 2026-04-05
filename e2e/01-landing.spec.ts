import { test, expect } from '@playwright/test'

test.describe('Landing Page', () => {
  test.beforeEach(async ({ page }) => { await page.goto('/') })

  test('has correct title', async ({ page }) => {
    await expect(page).toHaveTitle(/Money Manager India/i)
  })
  test('hero h2 contains Take Control', async ({ page }) => {
    await expect(page.locator('h2').filter({ hasText: /take control/i }).first()).toBeVisible()
  })
  test('hero mentions Finances', async ({ page }) => {
    await expect(page.locator('h2').filter({ hasText: /finances/i }).first()).toBeVisible()
  })
  test('hero subtext mentions rupee', async ({ page }) => {
    await expect(page.getByText(/rupee/i).first()).toBeVisible()
  })
  test('Get Started Free CTA exists', async ({ page }) => {
    await expect(page.getByRole('link', { name: /get started free/i }).first()).toBeVisible()
  })
  test('Login link in nav exists', async ({ page }) => {
    await expect(page.getByRole('link', { name: /^login$/i }).first()).toBeVisible()
  })
  test('shows Expense Tracking feature', async ({ page }) => {
    await expect(page.getByText('Expense Tracking')).toBeVisible()
  })
  test('shows Budget Planning feature', async ({ page }) => {
    await expect(page.getByText('Budget Planning')).toBeVisible()
  })
  test('shows Financial Reports feature', async ({ page }) => {
    await expect(page.getByText('Financial Reports')).toBeVisible()
  })
  test('shows Tax Calculator feature', async ({ page }) => {
    await expect(page.getByText('Tax Calculator')).toBeVisible()
  })
  test('shows Goal Tracking feature', async ({ page }) => {
    await expect(page.getByText('Goal Tracking')).toBeVisible()
  })
  test('shows Smart Calculators feature', async ({ page }) => {
    await expect(page.getByText('Smart Calculators')).toBeVisible()
  })
  test('shows CTA section', async ({ page }) => {
    await page.getByText(/Ready to Take Control/i).scrollIntoViewIfNeeded()
    await expect(page.getByText(/Ready to Take Control/i)).toBeVisible()
  })
  test('footer is present', async ({ page }) => {
    await expect(page.locator('footer')).toBeVisible()
  })
  test('shows Privacy Policy link', async ({ page }) => {
    await expect(page.getByRole('link', { name: /privacy policy/i })).toBeVisible()
  })
  test('shows Terms of Service link', async ({ page }) => {
    await expect(page.getByRole('link', { name: /terms of service/i })).toBeVisible()
  })
  test('shows support email', async ({ page }) => {
    await expect(page.getByText(/support@moneymanagerindia/i)).toBeVisible()
  })
})
