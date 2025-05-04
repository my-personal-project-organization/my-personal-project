## Angular Standalone Migration Prompt

**## Goal**

Migrate only the provided legacy Angular files (using NgModules, CommonModule, or SharedModule) to the modern Angular Standalone APIs following the latest Angular project, and TypeScript guidelines.

**## Instructions**

**## 1. Preparation:**

- Commit all work and use a clean git branch before starting.

**## 2. Automated Migration (Recommended):**

- Run the official Angular schematic only on the files provided as context:

  `ng g @angular/core:standalone-migration --path=<relative-path-to-file-or-folder>`

- Do not run the migration on the entire project. Only migrate the files explicitly provided in the prompt.
- Follow the prompts but:
  1. Convert only components, directives, and pipes in the provided files to standalone.
  2. Remove unnecessary NgModule classes in the provided files.
  3. Assume any NgModule the component was part of (the root module is included in the context).
- See the official guide for details: https://angular.dev/reference/migrations/standalone

**## 3. Manual Migration Steps (for provided files):**

- Remove all `NgModule` classes and related metadata.
- Add `standalone: true` to components, directives, and pipes.
- Update components/directives/pipes to import dependencies directly, instead of relying on `NgModule`. Move dependencies from `NgModule` (`declarations`, `imports`) to the `imports` array of the component/directive/pipe.
- For services, ensure they are provided `in root` or in a specific `NgModule` using `providedIn`. Or move services to the `providers` property of components if needed.
- Update bootstrapping: Replace `bootstrapModule` with `bootstrapApplication`. The root `AppComponent` must be standalone. Configure providers using `bootstrapApplication`'s second argument.
- Update routing: Use `loadComponent` for lazy loading and route-level code splitting.
- Update tests: Adjust test setups (`TestBed.configureTestingModule`) to import standalone components, directives, and pipes directly or use `ComponentFixtureAutoDetect` and potentially helper methods like `provideRouter` for testing routing.
- Check Templates: Update template syntax if necessary (e.g., structural directives like `*ngIf`, `*ngFor` might need `CommonModule` imported if not using standalone components that import it). Replace removed/aliased directives/pipes. Use element selectors with custom prefixes (e.g., `<app-feature-box>`).
- Update `imports`: Replace `CommonModule` and `FormsModule` / `ReactiveFormsModule` functions for common directives/pipes and form features. Ensure all dependencies (components, directives, pipes, modules) are imported directly in the `imports` array of the standalone component/directive/pipe.
- Update Inputs and Outputs: Use the `input()` and `output()` functions for declaring inputs and outputs instead of the `@Input()` and `@Output()` decorators. Use required inputs using the new `input.required()` syntax.
- Update Dependency Injection: Use the `inject()` function within constructor or factory functions for dependency injection where possible.
- Refactor code: Simplify code where possible. Remove redundant code (e.g., unused `NgModule` imports). Use new control flow syntax (`@if`, `@for`, `@switch`) instead of structural directives where appropriate.
- Style encapsulation: Ensure styles are correctly encapsulated (ViewEncapsulation). Use `:host` and `::ng-deep` sparingly and correctly. Check global styles.
- Optimize imports: Organize imports using specific paths, group imports, use barrel files (`index.ts`) where appropriate, but avoid circular dependencies. Use Nx's capabilities for enforcing module boundaries if applicable.
- Types and Patterns: Use strong typing (`TypeScript`), Signals State Management patterns (`signal`, `computed`, `effect`) where appropriate, use RxJS observables for async operations/events, use async/await for promises. Follow SOLID principles. Use Ngrx Store with strong typing and recommended patterns.
- Use linters and formatters: Enforce code style consistency (e.g., ESLint, Prettier).
- Accessibility: Ensure all UI components meet accessibility standards and use Angular Material v1+ for standard UI components and theming.

**## 4. Post-Migration:**

- Review generated code: Manually inspect changes for correctness and potential issues.
- Test Thoroughly: Run all unit tests and fix any failures. Run end-to-end tests (e.g., Cypress, Playwright) if available. Manually test the affected application parts.
- Check build and serve: Ensure the application builds and serves without any warnings or errors.

**## Resources:**

- **[Official Angular Standalone Migration Guide]**(https://angular.dev/reference/migrations/standalone)
- **[Angular Standalone Components In-Depth]**(https://angular.dev/guide/standalone-components)
- **[TypeScript StyleGuide]**(https://google.github.io/styleguide/tsguide.html)
- **[Angular Style Guide]**(https://angular.dev/guide/styleguide)

**### Example Migration Steps**

**1. Before (NgModule-Bound):**

```typescript
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { UserListComponent } from './user-list.component'; // Assume this exists

@NgModule({
  declarations: [
    UserListComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild([{ path: '', component: UserListComponent }])
  ],
  exports: [
    UserListComponent
  ]
})
export class UserModule { }

// user-list.component.ts (simplified)
import { Component } from '@angular/core';

@Component({
  selector: 'app-user-list',
  template: `<ul><li *ngFor="let user of users">{{ user.name }}</li></ul>`
})
export class UserListComponent {
  users = [{ name: 'Alice' }, { name: 'Bob' }];
}
```
**2. After (Standalone):**

```typescript
// user-list.component.ts
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common'; // Import directly

@Component({
  standalone: true, // Mark as standalone
  selector: 'app-user-list',
  imports: [CommonModule], // Import dependencies here
  template: `<ul><li *ngFor="let user of users">{{ user.name }}</li></ul>`
})
export class UserListComponent {
  users = [{ name: 'Alice' }, { name: 'Bob' }];
}

// app.routes.ts (or wherever routing is defined)
import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'users',
    // Use loadComponent for lazy loading standalone components
    loadComponent: () => import('./user-list.component').then(m => m.UserListComponent)
  },
  // other routes...
];

// No UserModule needed anymore!
```

## Always follow the latest Angular, TypeScript, and project guidelines. For more, see:

[Official Angular Standalone Migration Guide](https://angular.dev/reference/migrations/standalone)
[Angular Style Guide](https://www.google.com/url?sa=E&amp;source=gmail&amp;q=https://angular.dev/guide/styleguide)
[TypeScript StyleGuide](https://google.github.io/styleguide/tsguide.html)
[Effective TypeScript](https://effectivetypescript.com/)
[RxJS Guidelines](https://rxjs.dev/guide/overview)