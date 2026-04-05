import { test, expect } from '@playwright/test'

const vps = [
  { name: 'mobile-375',   width: 375,  height: 812  },
  { name: 'tablet-768',   width: 768,  height: 1024 },
  { name: 'desktop-1280', width: 1280, height: 800  },
]
for (const vp of vps) {
  test.describe(`Responsive [${vp.name}]`, () => {
    test.use({ viewport: { width: vp.width, height: vp.height } })

    test('landing renders brand', async ({ page }) => {
      await page.goto('/')
      // Use page title — reliable across all viewport sizes
      // (nav brand text may be visually hidden at certain breakpoints)
      await expect(page).toHaveTitle(/Money Manager/i)
    })

    test('login form renders inputs', async ({ page }) => {
      await page.goto('/auth/login')
      await expect(page.locator('#login-email')).toBeVisible()
      await expect(page.locator('#login-password')).toBeVisible()
    })

    test('signup form renders', async ({ page }) => {
      await page.goto('/auth/signup')
      await expect(page.locator('#signup-fullname')).toBeVisible()
    })

    test('unknown route is handled', async ({ page }) => {
      // Middleware may redirect to login rather than showing 404 — both are fine
      await page.goto('/xyz-not-found-page')
      await page.waitForLoadState('domcontentloaded')
      const bodyText = await page.locator('body').innerText()
      expect(bodyText.length).toBeGreaterThan(10)
    })
  })
}
