---
name: angular-conventions
description: Angular 19 patterns for this project - standalone components, signals, OnPush change detection, inject() DI, typed forms, modern control flow
---

# Angular 19 Conventions

## Core Architecture Principles

**Standalone Components** — All components must use `standalone: true`. Do not use or reference NgModules in new code.

**Strong Typing** — TypeScript strict mode enforced. Use explicit types throughout; avoid `any`.

**Single Responsibility** — Each component, service, or directive has one well-defined purpose.

**Reactive State** — Signals (`signal()`, `computed()`, `effect()`) are the primary state mechanism, not RxJS directly for local state.

## Dependency Injection

Use `inject()` function-based DI instead of constructor injection:

```typescript
import { inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';

export class MyService {
  private readonly http = inject(HttpClient);
  private readonly store = inject(MyStore);
}
```

Services use `@Injectable({ providedIn: 'root' })` for singletons.

## Component Patterns

### Structure

- **Class**: Props, injected services, computed/derived state, methods (~50–100 lines for simple components)
- **Template**: Separate `.html` file; use modern control flow (`@if`, `@for`, `@switch`), no legacy `*ngIf`, `*ngFor`
- **Styles**: Separate `.scss` file; component-scoped, no global state leaking

### Change Detection

```typescript
import { Component, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'mpp-my-component',
  template: '...',
  styleUrls: ['./my-component.scss'],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush, // Always use OnPush
})
export class MyComponent {
  // ...
}
```

**Why OnPush**: Explicit and efficient. Reduces unnecessary change detection cycles, especially in large applications.

### Signals and Inputs

**Local State**: Use `signal()` for writable state:
```typescript
count = signal(0);
increment() { this.count.update(v => v + 1); }
```

**Component Inputs**: Use `input()` function for required and optional inputs:
```typescript
readonly userId = input.required<string>(); // Required input
readonly disabled = input(false); // Optional input with default
readonly data = input(null as any); // Nullable input (prefer typed generics)
```

**Computed/Derived State**: Use `computed()` for derived values:
```typescript
readonly displayName = computed(() => `${this.firstName()} ${this.lastName()}`);
```

**Two-Way Binding**: Use `model()` for parent-child sync:
```typescript
readonly count = model(0);
```

### Template Control Flow

Use modern Angular control flow (v17+):

```html
@if (isLoading()) {
  <p>Loading...</p>
} @else if (error()) {
  <p>{{ error() }}</p>
} @else {
  <p>{{ data() }}</p>
}

@for (item of items(); track item.id) {
  <div>{{ item.name }}</div>
}

@switch (status()) {
  @case ('pending') {
    <p>Pending...</p>
  }
  @case ('done') {
    <p>Done!</p>
  }
}

@defer (on viewport) {
  <heavy-component />
}
```

## Forms

Use **typed reactive forms** with `FormBuilder` and strict type inference:

```typescript
import { FormBuilder, Validators } from '@angular/forms';

export class MyComponent {
  private readonly fb = inject(FormBuilder);

  form = this.fb.group({
    name: ['', [Validators.required]],
    email: ['', [Validators.email]],
  }, { nonNullable: true }); // nonNullable improves type safety

  onSubmit() {
    const values = this.form.getRawValue(); // Typed
  }
}
```

## File Organization

**Max 400 lines per file** — Encourages single responsibility and readability.

**Typical breakdown**:
- Simple component: 50–100 lines (class only, template/scss separate)
- Feature service: 100–200 lines
- Auth guard: 30–50 lines
- Pipe: 20–40 lines

If approaching 400 lines, consider extracting helper services or child components.

## Performance

### Lazy Loading

Use `loadComponent` for route-level lazy loading:

```typescript
{
  path: 'cv',
  loadComponent: () => import('@mpp/cv/feature-about').then(m => m.CvComponent)
}
```

Use `@defer` for heavy child components:

```html
@defer (on viewport) {
  <heavy-feature-component />
}
```

### Immutability

Treat all data as immutable, especially with OnPush:

```typescript
// Good
const updated = { ...item, name: 'New' };

// Bad
item.name = 'New'; // Won't trigger OnPush detection
```

### TrackBy in Lists

When using `@for` with dynamic data, provide a track function to prevent unnecessary DOM churn:

```html
@for (item of items(); track item.id) {
  <div>{{ item.name }}</div>
}
```

## Directives and Pipes

**Directives** — Use for behavioral logic or reusable host bindings. Host property manages bindings/listeners:

```typescript
@Directive({
  selector: '[appHighlight]',
  host: {
    '[class.highlighted]': 'isActive',
    '(click)': 'toggle()',
  }
})
export class HighlightDirective { }
```

**Pipes** — Keep pure (`pure: true` default) for simple transformations depending only on inputs. Avoid impure pipes unless necessary.

## Styling

- **BEM methodology** for CSS class naming when not using utility frameworks
- **Component scoping** — Styles are view-encapsulated; don't leak to global scope
- **Tailwind** — This project uses Tailwind CSS for utility-first styling; prefer Tailwind classes over component-scoped CSS where appropriate
- **CSS Modules or SCSS** — For component-specific complex styling
- **Dark Mode** — Implemented via Tailwind's dark mode + class strategy (set on `<html>` or parent element)

## Accessibility

- **ARIA Attributes** — Add `role`, `aria-label`, `aria-disabled`, etc. where interactive
- **Keyboard Navigation** — All interactive elements must be reachable via Tab and operable via Enter/Space
- **Color Contrast** — Maintain WCAG AA contrast ratios
- **Alt Text** — Images include `alt` attributes
- **Focus Management** — Logical tab order, visible focus indicators

## Security

- **XSS Prevention** — Angular sanitizes by default; use `DomSanitizer` only when necessary and with explicit review
- **No `innerHTML`** — Use template binding; if dynamic HTML is needed, sanitize and review
- **No `@ts-ignore` or eval()** — Strict type discipline prevents runtime surprises
- **Environment Secrets** — Never commit API keys; use environment configs and runtime injection

## Error Handling

Components should represent error states:

```typescript
error = signal<string | null>(null);
isLoading = signal(false);

loadData() {
  this.isLoading.set(true);
  this.service.fetch().subscribe({
    next: (data) => { this.data.set(data); },
    error: (err) => { this.error.set(err.message); },
    finalize: () => { this.isLoading.set(false); }
  });
}
```

Services log errors and propagate typed error signals; components display error UI.

## Testing

- **Unit Tests** — Jest via `npm test`; test components via `TestBed`
- **E2E Tests** — Playwright via `npm run e2e`; use page objects for selectors
- **Storybook** — Document components in isolation via `npm run storybook`
- **Test Naming** — Describe the behavior, not the implementation: ✅ "should display error message when fetch fails" vs ❌ "should call setError()"
- **AAA Pattern** — Arrange (setup), Act (trigger), Assert (verify)
