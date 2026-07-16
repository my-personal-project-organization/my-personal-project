---
name: testing
description: Testing standards for this project covering Jest unit tests, Playwright e2e, Storybook docs, and Chromatic visual regression
---

# Testing Standards

This project uses a multi-layered testing strategy: Jest for unit tests, Playwright for e2e, Storybook for documentation, and Chromatic for visual regression on the shared UI library.

## General Principles

- **Test coverage** — Aim for 70%+ per library (enforced in CI)
- **Test naming** — Describe behavior, not implementation. ✅ "should display error when fetch fails" vs ❌ "should call setError()"
- **Isolation** — Each test sets up its own state; no cascading dependencies
- **AAA Pattern** — Arrange (setup), Act (trigger), Assert (verify)
- **Keep tests focused** — One assertion or behavior per test when possible
- **Avoid brittleness** — Test behavior and public APIs, not implementation details

## Unit Testing (Jest)

**Framework**: Jest 30 with `jest-preset-angular` for Angular-specific setup.

**Run**: `npm test` or `nx test <lib>`

### Configuration
- Per-project config: `<lib>/jest.config.ts`
- Preset: `jest-preset-angular` handles TypeScript compilation, Angular TestBed, etc.
- Coverage thresholds: Configurable per library; default 70%

### Component Testing

Use `TestBed` to create component instances; interact via `DebugElement`:

```typescript
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MyComponent } from './my.component';
import { DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';

describe('MyComponent', () => {
  let component: MyComponent;
  let fixture: ComponentFixture<MyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MyComponent], // standalone component
    }).compileComponents();

    fixture = TestBed.createComponent(MyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges(); // Initial change detection
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display message when data is provided', () => {
    component.message = 'Hello';
    fixture.detectChanges(); // Update bindings
    const p = fixture.debugElement.query(By.css('p'));
    expect(p.nativeElement.textContent).toContain('Hello');
  });

  it('should emit event on button click', () => {
    spyOn(component.clicked, 'emit');
    const btn = fixture.debugElement.query(By.css('button')).nativeElement;
    btn.click();
    expect(component.clicked.emit).toHaveBeenCalled();
  });
});
```

### Service Testing

Mock dependencies; test methods with various inputs:

```typescript
import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { MyService } from './my.service';

describe('MyService', () => {
  let service: MyService;
  let http: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [MyService],
    });

    service = TestBed.inject(MyService);
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => http.verify()); // Verify no outstanding requests

  it('should fetch data from API', () => {
    service.getData().subscribe(data => {
      expect(data.name).toBe('Test');
    });

    const req = http.expectOne('/api/data');
    expect(req.request.method).toBe('GET');
    req.flush({ name: 'Test' });
  });

  it('should handle error', () => {
    service.getData().subscribe(
      () => fail('should have failed'),
      (error) => {
        expect(error.status).toBe(404);
      }
    );

    http.expectOne('/api/data').error(new ErrorEvent('Not Found'), { status: 404 });
  });
});
```

### Testing Signals and Observables

For signals, directly read their values:

```typescript
it('should increment counter', () => {
  component.count = signal(0);
  component.increment();
  expect(component.count()).toBe(1);
});
```

For RxJS, use `fakeAsync` and `tick` or subscribe and verify:

```typescript
it('should emit data after delay', fakeAsync(() => {
  let emitted = false;
  service.getDelayed().subscribe(() => emitted = true);
  
  expect(emitted).toBe(false);
  tick(1000);
  expect(emitted).toBe(true);
}));
```

### Mocking

Use `jest.fn()` or `jest.mock()` for dependencies:

```typescript
const mockStore = {
  loadData: jest.fn().mockReturnValue(of({ id: 1 })),
};

TestBed.configureTestingModule({
  providers: [
    { provide: MyStore, useValue: mockStore },
  ],
});
```

## End-to-End Testing (Playwright)

**Framework**: Playwright 1.40+ with `@nx/playwright`.

**Run**: `npm run e2e` or `nx e2e <app>-e2e`

### Setup

Located in `apps/my-personal-project-e2e/`. Each test file:

```typescript
// article-list.spec.ts
import { test, expect } from '@playwright/test';

test.describe('Article List', () => {
  test('should load and display articles', async ({ page }) => {
    // Navigate to the app
    await page.goto('http://localhost:4200');
    
    // Wait for articles to load
    await page.waitForSelector('[data-testid="article-card"]');
    
    // Assert
    const cards = await page.locator('[data-testid="article-card"]').count();
    expect(cards).toBeGreaterThan(0);
  });
});
```

### Best Practices

- **Page Objects** — Extract selectors and actions into helper classes for reuse:
  ```typescript
  class ArticleListPage {
    constructor(private page: Page) {}
    
    async goto() {
      await this.page.goto('http://localhost:4200');
    }
    
    async getArticleCount() {
      return this.page.locator('[data-testid="article-card"]').count();
    }
  }
  ```

- **Data Attributes** — Use `data-testid` for stable selectors (less brittle than CSS class selectors):
  ```html
  <button data-testid="save-button">Save</button>
  <div data-testid="article-card">...</div>
  ```

- **Fixtures** — Use Playwright fixtures for setup/teardown:
  ```typescript
  const test = base.extend({
    authenticatedPage: async ({ page }, use) => {
      await page.goto('/login');
      await page.fill('#email', 'test@example.com');
      await page.click('[type="submit"]');
      await use(page);
    }
  });
  ```

- **Visual Regression** — Capture screenshots for comparison:
  ```typescript
  await expect(page).toHaveScreenshot('article-list.png');
  ```

## Component Documentation (Storybook)

**Framework**: Storybook 10.5 (`@storybook/angular-vite`, Vite-based) on `libs/shared/ui`.

**Run**: `npm run storybook`

**Build**: `npm run build-storybook`

### Structure

Stories live alongside components:

```typescript
// libs/shared/ui/src/lib/components/atoms/button/button.stories.ts
import type { Meta, StoryObj } from '@storybook/angular-vite';
import { ButtonComponent } from './button.component';

const meta: Meta<ButtonComponent> = {
  component: ButtonComponent,
  title: 'Atoms/Button',
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: {
    label: 'Click me',
    size: 'md',
  },
};

export const Large: Story = {
  args: {
    label: 'Large Button',
    size: 'lg',
  },
};

export const Disabled: Story = {
  args: {
    label: 'Disabled',
    disabled: true,
  },
};
```

## Visual Regression Testing (Chromatic)

**Tool**: Chromatic (SaaS integration with Storybook).

**Run**: `npm run chromatic` (requires API token in CI)

**Purpose**: Detect unintended visual changes to shared UI components across versions and browsers.

### Workflow

1. Commit changes to `libs/shared/ui`
2. CI runs `npm run chromatic`
3. Chromatic compares against baseline; flags new or changed snapshots
4. Review and approve visual changes in Chromatic dashboard
5. Changes merge after approval

### Best Practices

- **Write stories first** — Every UI component variant should have a story before merging
- **Update stories when visual changes are intentional** — Run chromatic locally during development
- **Group stories by type** — Atoms, Molecules, etc. for better navigation

## Coverage and CI

**Coverage thresholds** (per library):
- Statements: 70%
- Branches: 70%
- Functions: 70%
- Lines: 70%

Configure in `jest.config.ts`:

```typescript
export default {
  coverageThreshold: {
    global: {
      branches: 70,
      functions: 70,
      lines: 70,
      statements: 70,
    },
  },
};
```

**Pre-push checks**: Run `npm run run-before-pr` locally to catch issues early:

```bash
npm run run-before-pr  # Runs: nx affected -t lint test build e2e
```

**CI Pipeline** (`ci.yml`):
- Lint → Test → Build → E2E (Playwright)
- Storybook build and Chromatic push

## Debugging Tests

### Jest
```bash
node --inspect-brk node_modules/.bin/jest --runInBand
# Open chrome://inspect in Chrome to debug
```

### Playwright
```bash
npm run e2e -- --debug
# Opens Playwright Inspector
```

### Storybook
```bash
npm run storybook
# Browser opens at http://localhost:6006
# Hot-reload on file changes
```
