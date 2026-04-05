# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: 03-signup.spec.ts >> Signup Page >> password mismatch shows error
- Location: e2e/03-signup.spec.ts:36:7

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: getByText(/do not match|mismatch|confirm/i)
Expected: visible
Error: strict mode violation: getByText(/do not match|mismatch|confirm/i) resolved to 2 elements:
    1) <label for="signup-confirm-password" class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Confirm password</label> aka getByText('Confirm password')
    2) <p id="confirm-password-error" class="mt-1 text-xs text-rose-600">Passwords do not match</p> aka getByText('Passwords do not match')

Call log:
  - Expect "toBeVisible" with timeout 10000ms
  - waiting for getByText(/do not match|mismatch|confirm/i)

```

# Page snapshot

```yaml
- generic [ref=e1]:
  - generic [ref=e3]:
    - generic [ref=e4]:
      - generic [ref=e6]: ₹
      - heading "Money Manager India" [level=1] [ref=e7]
      - paragraph [ref=e8]: Free personal finance for India
    - generic [ref=e9]:
      - heading "Create your account" [level=2] [ref=e10]
      - generic [ref=e11]:
        - generic [ref=e12]:
          - generic [ref=e13]: Full name
          - textbox "Full name" [ref=e14]:
            - /placeholder: Priya Anandan
            - text: Test User
        - generic [ref=e15]:
          - generic [ref=e16]: Email address
          - textbox "Email address" [ref=e17]:
            - /placeholder: you@example.com
            - text: test@example.com
        - generic [ref=e18]:
          - generic [ref=e19]: Password
          - textbox "Password" [ref=e20]:
            - /placeholder: Min. 8 chars, uppercase & number
            - text: Password123!
        - generic [ref=e21]:
          - generic [ref=e22]: Confirm password
          - textbox "Confirm password" [active] [ref=e23]:
            - /placeholder: ••••••••
            - text: Different456!
          - paragraph [ref=e24]: Passwords do not match
        - generic [ref=e25]:
          - generic [ref=e26] [cursor=pointer]:
            - checkbox "I accept the Terms of Service and Privacy Policy *" [checked] [ref=e27]
            - generic [ref=e28]:
              - text: I accept the
              - link "Terms of Service" [ref=e29]:
                - /url: /terms
              - text: and
              - link "Privacy Policy" [ref=e30]:
                - /url: /privacy
              - text: "*"
          - generic [ref=e31] [cursor=pointer]:
            - checkbox "I consent to receive marketing and promotional communications via email (optional)" [ref=e32]
            - generic [ref=e33]: I consent to receive marketing and promotional communications via email (optional)
        - button "Create account" [ref=e34] [cursor=pointer]
      - paragraph [ref=e35]:
        - text: Already have an account?
        - link "Sign in" [ref=e36] [cursor=pointer]:
          - /url: /auth/login
  - alert [ref=e37]
```

# Test source

```ts
  1  | import { test, expect } from '@playwright/test'
  2  | 
  3  | test.describe('Signup Page', () => {
  4  |   test.beforeEach(async ({ page }) => { await page.goto('/auth/signup') })
  5  | 
  6  |   test('has correct title', async ({ page }) => {
  7  |     await expect(page).toHaveTitle(/Money Manager India/i)
  8  |   })
  9  |   test('shows Create your account heading', async ({ page }) => {
  10 |     await expect(page.locator('h2').filter({ hasText: /create your account/i })).toBeVisible()
  11 |   })
  12 |   test('has Full name field (id=signup-fullname)', async ({ page }) => {
  13 |     await expect(page.locator('#signup-fullname')).toBeVisible()
  14 |   })
  15 |   test('has email field (id=signup-email)', async ({ page }) => {
  16 |     await expect(page.locator('#signup-email')).toBeVisible()
  17 |   })
  18 |   test('has password field (id=signup-password)', async ({ page }) => {
  19 |     await expect(page.locator('#signup-password')).toBeVisible()
  20 |   })
  21 |   test('password field is masked', async ({ page }) => {
  22 |     await expect(page.locator('#signup-password')).toHaveAttribute('type', 'password')
  23 |   })
  24 |   test('has Confirm password field (id=signup-confirm-password)', async ({ page }) => {
  25 |     await expect(page.locator('#signup-confirm-password')).toBeVisible()
  26 |   })
  27 |   test('has Create account button', async ({ page }) => {
  28 |     await expect(page.getByRole('button', { name: /create account/i })).toBeVisible()
  29 |   })
  30 |   test('marketing consent unchecked by default', async ({ page }) => {
  31 |     const boxes = page.locator('input[type="checkbox"]')
  32 |     if (await boxes.count() >= 2) {
  33 |       await expect(boxes.nth(1)).not.toBeChecked()
  34 |     }
  35 |   })
  36 |   test('password mismatch shows error', async ({ page }) => {
  37 |     await page.locator('#signup-fullname').fill('Test User')
  38 |     await page.locator('#signup-email').fill('test@example.com')
  39 |     await page.locator('#signup-password').fill('Password123!')
  40 |     await page.locator('#signup-confirm-password').fill('Different456!')
  41 |     await page.locator('input[type="checkbox"]').first().check()
  42 |     await page.getByRole('button', { name: /create account/i }).click()
> 43 |     await expect(page.getByText(/do not match|mismatch|confirm/i)).toBeVisible()
     |                                                                    ^ Error: expect(locator).toBeVisible() failed
  44 |   })
  45 |   test('Sign in link leads to login', async ({ page }) => {
  46 |     await page.getByRole('link', { name: /sign in/i }).click()
  47 |     await expect(page).toHaveURL(/login/)
  48 |   })
  49 | })
  50 | 
```