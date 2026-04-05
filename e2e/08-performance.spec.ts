import { test, expect } from '@playwright/test'

test.describe('Performance', () => {
  test('landing loads under 8s', async ({ page }) => {
    const t = Date.now()
    await page.goto('/', { waitUntil: 'domcontentloaded' })
    expect(Date.now() - t).toBeLessThan(8000)
  })
  test('login loads under 6s', async ({ page }) => {
    const t = Date.now()
    await page.goto('/auth/login', { waitUntil: 'domcontentloaded' })
    expect(Date.now() - t).toBeLessThan(6000)
  })
  test('no 5xx on landing', async ({ page }) => {
    const errs: string[] = []
    page.on('response', r => {
      if (r.status() >= 500 && !r.url().includes('supabase')) errs.push(r.url())
    })
    await page.goto('/')
    expect(errs).toHaveLength(0)
  })
})
