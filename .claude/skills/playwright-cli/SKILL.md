---
description: Automate browser interactions and web testing via Playwright CLI. Use when the user needs to navigate websites, interact with web pages, fill forms, take screenshots, record videos, capture network requests, test web applications, or extract information from pages. Covers test recording, headless/headed modes, authentication flows, data extraction, visual snapshots, and debugging techniques.
---

# Browser Automation with Playwright CLI

Expert guide for using Playwright's interactive command-line interface to automate browser interactions, test web applications, and capture web page state for e2e testing.

## When to Use This Skill

- Recording new Playwright e2e tests interactively
- Debugging failing tests by stepping through UI interactions
- Filling forms and navigating complex user flows
- Taking screenshots and recording videos of application behavior
- Capturing network requests and responses
- Testing authentication flows
- Extracting data from web pages
- Verifying visual changes and UI state
- Creating page snapshots for visual regression testing
- Validating responsive behavior on different screen sizes

## Prerequisites

- Playwright 1.40+ installed (`npm install --save-dev @playwright/test`)
- Understanding of web selectors (CSS, XPath)
- Familiarity with web browser developer tools
- Node.js and npm available in terminal
- Basic understanding of Playwright concepts (pages, browsers, contexts)

## Quick Start

### Open Interactive Browser

```bash
# Open an interactive Playwright browser
playwright-cli open

# Open and navigate to a URL
playwright-cli open https://my-personal-project.firebaseapp.com
```

### Basic Navigation and Interaction

```bash
# Navigate to a page
playwright-cli goto https://my-personal-project.firebaseapp.com

# Take a snapshot (shows clickable elements with IDs)
playwright-cli snapshot

# Click on an element (use ID from snapshot, e.g., "e5")
playwright-cli click e5

# Type text
playwright-cli type "search query"

# Fill form field
playwright-cli fill e12 "user@example.com"

# Press key
playwright-cli press Enter

# Hover over element
playwright-cli hover e7

# Double-click
playwright-cli dblclick e3

# Take a screenshot
playwright-cli screenshot
```

### Close Browser

```bash
playwright-cli close
```

## Core Commands Reference

### Navigation

```bash
playwright-cli goto https://example.com
playwright-cli go-back
playwright-cli go-forward
playwright-cli reload
playwright-cli url  # Print current URL
playwright-cli title  # Print page title
```

### Interaction

```bash
# Click and type
playwright-cli click e5
playwright-cli type "Hello World"
playwright-cli fill e12 "value"  # Fill input directly

# Form elements
playwright-cli check e15          # Check checkbox
playwright-cli uncheck e15        # Uncheck checkbox
playwright-cli select e20 "option-value"  # Select dropdown

# Advanced interactions
playwright-cli drag e2 e8         # Drag and drop
playwright-cli upload ./file.pdf  # Upload file
playwright-cli press Enter        # Press key
playwright-cli press Escape       # Press Escape
```

### Inspection and Data

```bash
# Snapshot shows all interactive elements
playwright-cli snapshot

# Save snapshot to file
playwright-cli snapshot --filename=before-click.yaml

# Evaluate JavaScript
playwright-cli eval "document.title"
playwright-cli eval "el => el.textContent" e5  # Get element text

# Get page content
playwright-cli html                    # Print page HTML
playwright-cli content e5              # Get element content
```

### Dialogs and Popups

```bash
playwright-cli dialog-accept           # Accept alert
playwright-cli dialog-accept "Yes"     # Accept with text
playwright-cli dialog-dismiss          # Dismiss/cancel dialog
```

### Page State

```bash
playwright-cli resize 1920 1080        # Resize viewport
playwright-cli emulate-device "iPhone 12"  # Emulate device
playwright-cli wait-for-navigation     # Wait for page load
playwright-cli wait-for-element "selector"  # Wait for element
```

## Recording E2E Tests

### Workflow: Record a Test

1. **Start interactive browser**:
   ```bash
   playwright-cli open https://my-personal-project.firebaseapp.com
   ```

2. **Navigate and interact**:
   - Use `playwright-cli snapshot` to see clickable elements
   - Click, type, fill, and navigate as needed
   - Use `playwright-cli screenshot` to capture state

3. **Generate test code**:
   - Playwright Inspector records your actions
   - Export as `.spec.ts` file

4. **Save test file**:
   ```bash
   # Copy generated code from inspector
   # Paste into apps/my-personal-project-e2e/src/fixtures/article.spec.ts
   ```

### Example Recorded Test

```typescript
// apps/my-personal-project-e2e/src/fixtures/article-load.spec.ts
import { test, expect } from '@playwright/test';

test('should load article and display content', async ({ page }) => {
  // Navigate to app
  await page.goto('http://localhost:4200');

  // Wait for nav to load and click Articles
  await page.locator('[data-testid="nav-articles"]').click();

  // Wait for articles list
  await page.waitForSelector('[data-testid="article-card"]');

  // Click first article
  await page.locator('[data-testid="article-card"]').first().click();

  // Verify article content loaded
  const title = await page.locator('h1').first().textContent();
  expect(title).toBeTruthy();
});
```

## Advanced Techniques

### Waiting for Elements

```bash
# Wait for element to appear (with timeout)
playwright-cli wait-for-element "h1" --timeout=5000

# Wait for navigation/load
playwright-cli wait-for-navigation
```

### Emulating Devices and Viewports

```bash
# Emulate iPhone 12
playwright-cli emulate-device "iPhone 12"

# Emulate iPad
playwright-cli emulate-device "iPad Pro"

# Custom viewport
playwright-cli resize 375 667  # Mobile width/height
```

### Authentication Flows

1. **Open browser and log in manually**:
   ```bash
   playwright-cli open https://my-personal-project.firebaseapp.com
   ```

2. **Perform login steps via UI**:
   - Click login button
   - Enter credentials
   - Complete GitHub OAuth flow

3. **Save authentication state**:
   ```bash
   playwright-cli save-auth-storage ./auth.json
   ```

4. **Reuse in tests**:
   ```typescript
   test.use({ storageState: './auth.json' });
   
   test('should view authenticated content', async ({ page }) => {
     await page.goto('/');
     // Already logged in
   });
   ```

### Network Monitoring

```bash
# Capture network requests (in test code)
const requests: string[] = [];

page.on('request', request => {
  requests.push(request.url());
});

// Navigate and interact
await page.goto('https://example.com');
await page.click('button');

// Verify requests
expect(requests).toContain('https://api.example.com/data');
```

### Taking Visual Snapshots

```bash
# Screenshot current page state
playwright-cli screenshot

# In tests, for visual regression
await expect(page).toHaveScreenshot('article-list.png');

# Compare with baseline
await expect(page).toHaveScreenshot('article-list.png', {
  maxDiffPixels: 100,
});
```

### Video Recording

In tests, enable video recording:

```typescript
test.use({
  video: 'on-first-retry',  // Record only on retry
});

test('should record on failure', async ({ page }) => {
  await page.goto('https://example.com');
  // If test fails, video is saved
});
```

## Debugging Failing Tests

### Step-by-Step Debugging

1. **Run in headed mode** (see the browser):
   ```bash
   npx playwright test --headed
   ```

2. **Use debug mode** (interactive inspector):
   ```bash
   npx playwright test --debug
   ```

3. **Add pauses** in test to inspect state:
   ```typescript
   await page.pause();  // Opens inspector
   ```

4. **Check snapshots** to see selectors:
   ```typescript
   await page.locator('[data-testid="article"]').screenshot();
   ```

### Common Issues

**Element not found**:
- Use `page.pause()` to inspect the page
- Verify selector exists: `await page.locator('selector').isVisible()`
- Check for dynamic loading: add `waitForSelector`

**Timing issues**:
- Use `page.waitForSelector()` before interacting
- Add `waitForNavigation()` after navigation triggers
- Use `waitForLoadState()` for network requests

**Authentication failures**:
- Record login flow once and save `auth.json`
- Reuse via `test.use({ storageState })`
- Don't hard-code credentials; use environment variables

## Test Organization

### Page Object Model

```typescript
// fixtures/pages/article.page.ts
export class ArticlePage {
  constructor(private page: Page) {}

  async goto() {
    await this.page.goto('/articles');
  }

  async clickArticle(title: string) {
    await this.page.locator(`text=${title}`).click();
  }

  async getArticleTitle() {
    return await this.page.locator('h1').textContent();
  }
}

// fixtures/article-detail.spec.ts
import { ArticlePage } from './pages/article.page';

test('should display article details', async ({ page }) => {
  const articlePage = new ArticlePage(page);
  await articlePage.goto();
  await articlePage.clickArticle('My Article');
  const title = await articlePage.getArticleTitle();
  expect(title).toBe('My Article');
});
```

### Best Practices

- **Use `data-testid` attributes** for stable selectors
- **Avoid CSS/class selectors** (brittle to style changes)
- **Use page objects** for reuse across tests
- **Record tests interactively** first, then review and refine
- **Use meaningful test names** that describe the behavior
- **Keep tests focused** — one user flow per test
- **Wait for elements** before interacting
- **Clean up** — close browsers, clear storage if needed

## Run E2E Tests

```bash
# Run all e2e tests
npm run e2e

# Run specific test file
nx e2e my-personal-project-e2e --spec="article.spec.ts"

# Run in headed mode (see browser)
nx e2e my-personal-project-e2e --headed

# Run in debug mode (interactive)
nx e2e my-personal-project-e2e --debug

# Run a single test
nx e2e my-personal-project-e2e --grep="should load article"
```

## Resources

- [Playwright Inspector Guide](https://playwright.dev/docs/inspector)
- [Selectors](https://playwright.dev/docs/selectors)
- [Locators](https://playwright.dev/docs/locators)
- [Waiting](https://playwright.dev/docs/navigations)
- [Debugging](https://playwright.dev/docs/debug)
