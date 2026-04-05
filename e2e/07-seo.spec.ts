import { test, expect } from '@playwright/test'

test.describe('SEO & Meta', () => {
  test('landing title', async ({ page }) => {
    await page.goto('/')
    await expect(page).toHaveTitle(/Money Manager India/i)
  })
  test('login title', async ({ page }) => {
    await page.goto('/auth/login')
    await expect(page).toHaveTitle(/Money Manager India/i)
  })
  test('signup title', async ({ page }) => {
    await page.goto('/auth/signup')
    await expect(page).toHaveTitle(/Money Manager India/i)
  })
  test('privacy title', async ({ page }) => {
    await page.goto('/privacy')
    await expect(page).toHaveTitle(/Privacy/i)
  })
  test('terms title', async ({ page }) => {
    await page.goto('/terms')
    await expect(page).toHaveTitle(/Terms/i)
  })
})
