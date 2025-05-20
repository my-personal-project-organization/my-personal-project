# Angular 15 Guidelines

Use these guidelines when working with Angular 15 related code.

## 1. Core Architecture

- **Standalone API:** Angular 15 introduces stable Standalone Components, Directives, and Pipes. Use `standalone: true` when creating them. This simplifies authorship by removing the need for `NgModule`.
- **Strong Typing:** TypeScript types, interfaces, and models provide type safety throughout the codebase.
- **Single Responsibility:** Each component and service has a single, well-defined responsibility.
- **Rule of One:** Files focus on a single concept or functionality.
- **Dependency Injection:** Angular's DI system manages service instances.
- **Function-Based DI:** Use function-based dependency injection with the `inject()` function instead of constructor-based injection in new code. Example:

  ```typescript
  import { inject } from '@angular/core';
  import { HttpClient } from '@angular/common/http';

  export class MyService {
    private readonly http = inject(HttpClient);
    // ...
  }
  ```

- **Lazy Loading:**
  - For NgModules: Use route-level lazy loading with `loadChildren`.
  - For Standalone Components: Use route-level lazy loading with `loadComponent`.
- **Directive Composition API:** (Introduced in v14) The Directive Composition API enables reusable component behavior by applying directives to a component's host element.
- **Prefer Standalone APIs:** For new features, prefer using standalone APIs. NgModules are still supported and may be necessary for existing applications or specific library patterns.
- **`ApplicationConfig`:** (Introduced in v14) For bootstrapping standalone applications, use `bootstrapApplication` with an `ApplicationConfig` to provide application-wide configuration.
- **`ENVIRONMENT_INITIALIZER`:** (Introduced in v14) A multi-provider token that can be used to register functions that will be executed when the application is initialized.

## 2. Angular Style Guide Patterns

- **Code Size:** Files are limited to 400 lines of code.
- **Single Purpose Files:** Each file defines one entity (component, service, etc.).
- **Naming Conventions:** Symbols have consistent, descriptive names.
- **Folder Structure:** Code is organized by feature-based folders.
- **File Separation:** Templates and styles exist in their own files for components.
- **Property Decoration:** Input and output properties have proper decoration (`@Input()`, `@Output()`).
- **Component Selectors:** Component selectors use custom prefixes and kebab-case (e.g., `app-feature-name`).
- **No CommonModule or RouterModule Imports (for Standalone Components):** When using standalone components, import only the required standalone components, directives, or pipes directly (e.g., `NgIf`, `NgFor`, `RouterLink`). For NgModule-based components, `CommonModule` and `RouterModule` are often imported into the NgModule.

## 3. Input and Output Patterns

- **Input Decorator:** Use the `@Input()` decorator to define input properties.

  ```typescript
  import { Component, Input, OnInit } from '@angular/core';

  @Component({
    /* ... */
  })
  export class MyComponent implements OnInit {
    @Input() value: number = 0;
    @Input() name?: string; // Optional input
    @Input() id!: string; // Non-optional input, parent must provide

    ngOnInit() {
      if (this.id === undefined) {
        // Or throw an error, depending on desired strictness
        console.error("Error: 'id' input is required for MyComponent.");
      }
    }
  }
  ```

- **Output Decorator and EventEmitter:** Use the `@Output()` decorator with `EventEmitter` to define output properties for emitting custom events.

  ```typescript
  import { Component, Output, EventEmitter } from '@angular/core';

  @Component({
    /* ... */
  })
  export class MyComponent {
    @Output() valueChange = new EventEmitter<number>();

    emitNewValue(newValue: number): void {
      this.valueChange.emit(newValue);
    }
  }
  ```

- **Two-Way Binding with `[(ngModel)]` (Template-Driven Forms) or Custom Setup:**
  For two-way binding, `[(ngModel)]` is common in template-driven forms (requires `FormsModule`). For reactive forms or custom component two-way binding, use an `@Input()` for the value and an `@Output()` for its change event, following the `value`/`valueChange` naming convention.

  ```typescript
  // Custom two-way binding pattern for a component
  import { Component, Input, Output, EventEmitter } from '@angular/core';

  @Component({
    selector: 'app-custom-input',
    template: `<input [value]="value" (input)="onInput($event)" />`,
    // Ensure this component is standalone or declared in an NgModule
  })
  export class CustomInputComponent {
    @Input() value: string = '';
    @Output() valueChange = new EventEmitter<string>();

    onInput(event: Event): void {
      const inputValue = (event.target as HTMLInputElement).value;
      // No need to set this.value here if the parent handles it via two-way binding
      this.valueChange.emit(inputValue);
    }
  }
  ```

  Usage: `<app-custom-input [(value)]="parentProperty"></app-custom-input>`

## 3a. Typed Reactive Forms

- **Typed Forms:** (Stable in v14) Always use strictly typed reactive forms by defining an interface or type for the form values and using `FormGroup`, `FormBuilder.group()`, and `FormControl()`.
- **Non-Nullable Controls:** Prefer `nonNullable: true` for controls to avoid `null` issues and improve type safety.
- **Patch and Get Values:** Use `patchValue` and `getRawValue()` to work with typed form values.
- **Reference:** See the [Angular Typed Forms documentation](https://angular.dev/guide/forms/typed-forms) for details and examples.

## 4. Component Patterns

- **Naming Pattern:** Components follow consistent naming - `feature.type.ts` (e.g., `hero-list.component.ts`).
- **Template Extraction:** Non-trivial templates exist in separate `.html` files.
- **Style Extraction:** Styles exist in separate `.css/.scss` files.
- **Input and Output Decorators:** Components use `@Input()` and `@Output()` for property binding.
- **Lifecycle Hooks:** Components implement appropriate lifecycle hook interfaces (OnInit, OnDestroy, etc.).
- **Element Selectors:** Components use element selectors (`selector: 'app-hero-detail'`).
- **Logic Delegation:** Services contain complex logic.
- **Input Initialization:** Inputs have default values or are handled if required (e.g., in `ngOnInit`).
- **Error Handling:** Try-catch blocks handle errors in synchronous code; use RxJS error handling for asynchronous operations.
- **Structural Directives:** Templates use `*ngIf`, `*ngFor`, `*ngSwitch` for conditional rendering and iteration.
- **State Representation:** Components implement loading and error states (e.g., using boolean flags or state variables, often managed with RxJS for complex scenarios).
- **Derived State:** Use component class getters or RxJS `map` operator for derived state.
- **Prefer Standalone Components:** For new components, prefer creating them as standalone (`standalone: true`). NgModules are still fully supported.
- **`ngOptimizedImage`:** (Introduced in v14.2, stable in v15) Use the `NgOptimizedImage` directive from `@angular/common` to improve image loading performance (e.g., lazy loading, preconnect, automatic `srcset`). Import `NgOptimizedImage` into your standalone component or NgModule.

  ```html
  <!-- Example: Make sure to import NgOptimizedImage -->
  <img ngSrc="assets/my-image.png" width="400" height="200" priority />
  ```

## 5. Styling Patterns

- **Component Encapsulation:** Components use scoped styles with proper encapsulation.
- **CSS Methodology:** BEM methodology guides CSS class naming when not using Angular Material.
- **Component Libraries:** Angular Material or other component libraries provide consistent UI elements.
- **Theming:** Color systems and theming enable consistent visual design.
- **Accessibility:** Components follow a11y standards.
- **Dark Mode:** Components support dark mode where appropriate.

## 5a. Angular Material and Angular CDK Usage

- **Standard UI Library:** Use Angular Material for standard UI components to ensure consistency, accessibility, and alignment with Angular best practices.
- **Component Development:** Build new UI components using Angular Material components as a foundation.
- **Behavioral Primitives:** Use Angular CDK for advanced behaviors (drag-and-drop, overlays, accessibility, virtual scrolling, etc.).
- **Theming:** Leverage Angular Material's theming system.
- **Accessibility:** All UI components must meet accessibility (a11y) standards.
- **Best Practices:**
  - Prefer Material's layout and typography utilities.
  - Use Material icons and fonts.
  - Avoid mixing multiple UI libraries.
  - Reference the [Angular Material documentation](https://material.angular.io).
- **CDK Utilities:** Use Angular CDK utilities for custom behaviors, overlays, accessibility, and testing harnesses.
- **Migration:** For legacy components, consider migrating to Angular Material/CDK.

## 5b. Template Patterns

- **Structural Directives:** Use structural directives `*ngIf`, `*ngFor`, `*ngSwitch` in templates for control flow.

  ```html
  <!-- *ngIf Example -->
  <div *ngIf="user; else loading">Hello, {{ user.name }}</div>
  <ng-template #loading>Loading user data...</ng-template>

  <!-- *ngFor Example -->
  <ul>
    <li *ngFor="let item of items; trackBy: trackByIdFn">{{ item.name }}</li>
  </ul>
  <!-- In component: trackByIdFn(index: number, item: any) { return item.id; } -->

  <!-- *ngSwitch Example -->
  <div [ngSwitch]="accessLevel">
    <div *ngSwitchCase="'admin'">Admin Controls</div>
    <div *ngSwitchCase="'editor'">Editor Tools</div>
    <div *ngSwitchDefault>View Mode</div>
  </div>
  ```

- **TrackBy with `*ngFor`:** Always use a `trackBy` function with `*ngFor` for performance improvements when iterating over collections, especially if items can be reordered, added, or removed.

## 6. Service and DI Patterns

- **Service Declaration:** Services use the `@Injectable()` decorator with `providedIn: 'root'` for singletons.
- **Data Services:** Data services handle API calls and data operations.
- **Error Handling:** Services include error handling, often using RxJS `catchError`.
- **DI Hierarchy:** Services follow the Angular DI hierarchy.
- **Service Contracts:** Interfaces define service contracts.
- **Focused Responsibilities:** Services focus on specific tasks.
- **Function-Based DI:** Use function-based dependency injection with the `inject()` function.
- **Functional Interceptors:** (Introduced in v15) Prefer functional HTTP interceptors over class-based interceptors for simpler syntax and better tree-shakability.

  ```typescript
  // Example of a functional interceptor
  import { HttpInterceptorFn, HttpRequest, HttpHandlerFn } from '@angular/common/http'; // Ensure correct imports

  export const loggingInterceptor: HttpInterceptorFn = (req: HttpRequest<unknown>, next: HttpHandlerFn) => {
    console.log(`Request to ${req.url}`);
    return next(req);
  };

  // Provide in ApplicationConfig (for standalone apps) or AppModule providers:
  // import { provideHttpClient, withInterceptors } from '@angular/common/http';
  // provideHttpClient(withInterceptors([loggingInterceptor]));
  // Or for NgModule-based apps:
  // { provide: HTTP_INTERCEPTORS, useValue: loggingInterceptor, multi: true }
  ```

## 7. Directive and Pipe Patterns

- **Attribute Directives:** Directives handle presentation logic without templates.
- **Host Property:** The `host` property manages bindings and listeners:

  ```typescript
  import { Directive, HostBinding, HostListener } from '@angular/core'; // HostBinding/Listener are common alternatives to host object

  @Directive({
    selector: '[appHighlight]',
    standalone: true, // If it's a standalone directive
    // host property is also valid:
    // host: {
    //   '[class.highlighted]': 'isHighlighted',
    //   '(mouseenter)': 'onMouseEnter()',
    // }
  })
  export class HighlightDirective {
    @HostBinding('class.highlighted') isHighlighted = false;
    @HostBinding('style.color') highlightColor = 'black';

    @HostListener('mouseenter') onMouseEnter() {
      this.isHighlighted = true;
      this.highlightColor = 'blue';
    }
    @HostListener('mouseleave') onMouseLeave() {
      this.isHighlighted = false;
      this.highlightColor = 'black';
    }
    // For static properties, they can be set directly or via HostBinding
    @HostBinding('attr.role') role = 'button';
    // @HostBinding('attr.aria-label') ariaLabel = 'Custom highlighted element';
  }
  ```

- **Selector Prefixes:** Directive selectors use custom prefixes.
- **Pure Pipes:** Pipes are pure by default and preferred for better performance.
- **Pipe Naming:** Pipes follow camelCase naming conventions (e.g., `myCustom.pipe.ts`).
- **Directive Composition API:** (Introduced in v14) Leverage the Directive Composition API to apply directives to a component's host element, promoting reusability.

## 8. State Management Patterns

- **RxJS for Reactive State:** Utilize RxJS (Observables, Subjects, BehaviorSubjects, operators like `map`, `filter`, `switchMap`, `tap`) for managing complex component and service state.
- **Local Component State:** Use simple class properties for managing local component state. For reactive updates or shared state within a component's template, consider RxJS BehaviorSubjects.
- **Service-Based State:** Encapsulate shared application state within services, often using RxJS BehaviorSubjects or Subjects to provide observable state and methods to update it.
- **Avoid Manual Subscriptions (where possible):** Prefer the `async` pipe in templates to handle subscriptions and unsubscriptions automatically. If manual subscriptions are necessary (e.g., in `ngOnInit`), ensure they are unsubscribed (e.g., using `takeUntil` with a subject in `ngOnDestroy`) to prevent memory leaks.

## 9. Testing Patterns

- **Test Coverage:** Tests cover components, services, pipes, and directives.
- **Unit Tests:** Focused unit tests verify individual pieces of logic.
- **Component Testing:** `TestBed` and component harnesses (e.g., Angular Material component harnesses) test components' interaction and rendering.
- **Mocking:** Tests use mocking techniques (e.g., Jasmine spies, mock services/classes) for dependencies.
- **Test Organization:** Tests follow the AAA pattern (Arrange, Act, Assert).
- **Test Naming:** Tests have descriptive names that explain the expected behavior.
- **Playwright Usage:** Playwright handles E2E testing with fixtures and test isolation.
- **Test Environment:** Test environments match production as closely as possible.

## 10. Performance Patterns

- **Change Detection:** Components use `ChangeDetectionStrategy.OnPush` where appropriate, especially with immutable data structures or observable-based inputs.
- **Lazy Loading:** Routes and components load lazily (see Core Architecture).
- **Virtual Scrolling:** Use `cdk-virtual-scroll-viewport` from `@angular/cdk/scrolling` for rendering long lists efficiently.
- **Memoization:** Memoization can optimize expensive computations in pipes or functions.
- **Bundle Size:** Monitor bundle size (e.g., with `webpack-bundle-analyzer`) and optimize (tree shaking, code splitting).
- **Server-Side Rendering (SSR):** Consider Angular Universal for SSR to improve initial load performance and SEO.
- **Web Workers:** Offload CPU-intensive tasks to Web Workers to keep the main thread responsive.
- **`ngOptimizedImage`:** Use the `NgOptimizedImage` directive for optimized image loading (see Component Patterns).

## 11. Security Patterns

- **XSS Prevention:** Angular's built-in sanitization helps prevent XSS. Be cautious with `bypassSecurityTrustHtml` and similar methods.
- **CSRF Protection:** Implement CSRF protection mechanisms (e.g., tokens) if your backend requires it.
- **Content Security Policy (CSP):** Use CSP headers to restrict content sources.
- **Authentication:** Implement secure authentication flows (e.g., OAuth 2.0, OpenID Connect).
- **Authorization:** Implement authorization checks to control access to resources and features.
- **Sensitive Data:** Avoid storing sensitive data in client-side code or local storage.

## 12. Accessibility Patterns

- **ARIA Attributes:** Use ARIA attributes to enhance accessibility for dynamic content and custom controls.
- **Keyboard Navigation:** Ensure all interactive elements are keyboard accessible and operable.
- **Color Contrast:** UI elements must maintain proper color contrast ratios (WCAG AA).
- **Screen Readers:** Test components with screen readers to ensure they are perceivable and operable.
- **Focus Management:** Manage focus appropriately, especially in modals, menus, and dynamic views.
- **Alternative Text:** Images include descriptive `alt` text (or `ngSrc` with `NgOptimizedImage` handles this well if `alt` is provided).

## 13. Routing Patterns

- **Functional Guards and Resolvers:** (Introduced in v14) Prefer functional guards (`CanActivateFn`, `CanDeactivateFn`, `CanActivateChildFn`, `CanLoadFn`) and resolvers (`ResolveFn`) over class-based ones for simplicity and better tree-shakability.

  ```typescript
  import { CanActivateFn, Router } from '@angular/router';
  import { inject } from '@angular/core';
  // import { AuthService } from './auth.service'; // Assuming an AuthService

  // Example: Placeholder for AuthService
  class AuthService {
    isLoggedIn = () => true;
  }

  export const authGuard: CanActivateFn = (route, state) => {
    const authService = inject(AuthService); // Ensure AuthService is provided
    const router = inject(Router);
    if (authService.isLoggedIn()) {
      return true;
    }
    return router.parseUrl('/login'); // Or router.createUrlTree(['/login'])
  };
  ```

  Usage in route definition: `{ path: 'admin', component: AdminComponent, canActivate: [authGuard] }`

- **`CanMatch` Guard:** (Introduced in v14) Use the `CanMatch` guard to conditionally control whether a route can even be matched, allowing for more flexible route configurations (e.g., based on feature flags or user roles before attempting to load a module/component).

  ```typescript
  import { CanMatchFn, Route, UrlSegment, Router } from '@angular/router';
  import { inject } from '@angular/core';
  // import { FeatureFlagService } from './feature-flag.service'; // Assuming a service

  // Example: Placeholder for FeatureFlagService
  class FeatureFlagService {
    isFeatureEnabled = (featureName: string) => true;
  }

  export const featureFlagGuard: CanMatchFn = (route: Route, segments: UrlSegment[]) => {
    const featureFlagService = inject(FeatureFlagService); // Ensure service is provided
    const router = inject(Router);
    const featureName = route.data?.['featureName'] as string;

    if (featureFlagService.isFeatureEnabled(featureName)) {
      return true;
    }
    // Optionally, redirect or return a UrlTree to a different route
    // return router.parseUrl('/feature-disabled');
    return false; // Or prevent matching
  };
  ```

  Usage in route definition:

  ```typescript
  import { Routes } from '@angular/router';
  const routes: Routes = [
    {
      path: 'new-feature',
      canMatch: [featureFlagGuard],
      data: { featureName: 'amazingNewFeature' },
      loadChildren: () => import('./new-feature/new-feature.module').then((m) => m.NewFeatureModule),
      // Or loadComponent for standalone
    },
    // ... other routes
  ];
  ```

- **Typed Route Parameters and Data:** While full built-in typed router support evolved significantly after v15, strive for type safety by defining interfaces for route `data`, `params`, and `queryParams`, and casting them appropriately after retrieval from `ActivatedRoute`.
