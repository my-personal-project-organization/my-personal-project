---
name: angular-jest-unit-testing
description: 'Expert Angular 19 unit testing with Jest for  monorepo shared libraries. Write comprehensive specs for components (TestBed, fixture detection, async, ChangeDetectionStrategy.OnPush), services (injection, observables, mocks), directives, and utilities. Use when writing tests, debugging test failures, implementing test coverage, testing reactive forms, mocking services, testing observables, or ensuring component behavior verification for @/shared/ui and @/shared/* libraries. Covers Jest setup, mocking strategies, async patterns, snapshot testing, and -specific testing conventions.'
---

# Angular Jest Unit Testing for Shared Libraries

Expert guide for writing, debugging, and maintaining unit tests for Angular 19 components and services using Jest in the monorepo. Focused on testing shared libraries: `@/shared/ui`, `@/shared/data-access`, and other reusable modules.

## When to Use This Skill

- Writing new `.spec.ts` files for components, services, directives, or utilities
- Debugging failing tests or test setup issues
- Implementing test coverage for existing code
- Testing reactive forms with FormControl/FormGroup
- Mocking services, HTTP requests, or dependencies
- Testing async operations (observables, promises, timers, fakeAsync/flushMicrotasks)
- Testing components with OnPush change detection strategy
- Testing template interactions (button clicks, form submissions)
- Testing directive behavior or input binding changes
- Setting up Jest mocks for services (ToastService, DialogService, API clients)
- Improving test quality and coverage metrics
- Learning testing conventions and best practices

## Prerequisites

- Angular 19.2.9 understanding (standalone components, signalsm inject())
- Jest fundamentals (test, expect, beforeEach, afterEach, mocks)
- Angular testing utilities: TestBed, ComponentFixture, fakeAsync
- Monorepo structure: `libs/shared/ui`, `libs/shared/data-access`, etc.
- component patterns: ControlValueAccessor, OnPush, injection()-based DI
- TypeScript basics and generics
- Reactive Forms API (FormControl, FormGroup, Validators)

## Step-by-Step Workflows

### Workflow 1: Testing a Shared UI Component

**Goal**: Write a comprehensive spec for a component like `ToastComponent` or `AvatarComponent`

#### Step 1: Set Up TestBed Configuration

```typescript
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MyComponent } from './my.component';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { TranslateModule } from '@ngx-translate/core';
import { MyService } from '@/shared/data-access';

describe('MyComponent', () => {
  let component: MyComponent;
  let fixture: ComponentFixture<MyComponent>;
  let myService: jest.Mocked<MyService>;

  beforeEach(async () => {
    // Mock services before TestBed setup
    const mockMyService = {
      method1: jest.fn(),
      method2: jest.fn(),
      observable$: of([]),
    };

    await TestBed.configureTestingModule({
      imports: [MyComponent, NoopAnimationsModule, TranslateModule.forRoot()],
      providers: [{ provide: MyService, useValue: mockMyService }],
    }).compileComponents();

    fixture = TestBed.createComponent(MyComponent);
    component = fixture.componentInstance;
    myService = TestBed.inject(MyService) as jest.Mocked<MyService>;
    fixture.detectChanges(); // Initial CD after setup
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
```

#### Step 2: Test Component Inputs and Outputs

```typescript
describe('Input/Output Binding', () => {
  it('should render with provided inputs', () => {
    component.title = 'Test Title';
    component.severity = 'success';
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('h2')?.textContent).toContain('Test Title');
  });

  it('should emit event when action triggered', () => {
    const emitSpy = jest.spyOn(component.action, 'emit');
    const button = fixture.nativeElement.querySelector('.action-button') as HTMLButtonElement;

    button.click();

    expect(emitSpy).toHaveBeenCalledWith(jasmine.any(Object));
  });
});
```

#### Step 3: Test Component Methods

```typescript
describe('Component Methods', () => {
  it('should call service when method invoked', () => {
    component.submit();

    expect(myService.method1).toHaveBeenCalled();
  });

  it('should update component state when service returns data', () => {
    myService.method2.mockReturnValue(of({ id: 1, name: 'Test' }));

    component.loadData();
    fixture.detectChanges();

    expect(component.data).toEqual({ id: 1, name: 'Test' });
  });
});
```

#### Step 4: Test Template Changes and Change Detection

```typescript
describe('Template Rendering', () => {
  it('should detect changes and update template', () => {
    component.items = [];
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('.empty-state')).toBeTruthy();

    component.items = [{ id: 1 }, { id: 2 }];
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelectorAll('.item').length).toBe(2);
  });

  it('should conditionally render based on state', () => {
    component.isLoading = true;
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('shared-ui-progress-bar')).toBeTruthy();

    component.isLoading = false;
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('shared-ui-progress-bar')).toBeFalsy();
  });
});
```

#### Step 5: Test Async Operations

```typescript
describe('Async Operations', () => {
  it('should handle async service calls', (done) => {
    const result = { status: 'success' };
    myService.method1.mockReturnValue(of(result));

    component.processData();

    setTimeout(() => {
      expect(component.result).toEqual(result);
      done();
    }, 100);
  });

  it('should handle observable completion', () => {
    const subscription = component.subscribe();

    expect(component.isSubscribed).toBe(true);

    subscription.unsubscribe();

    expect(component.isSubscribed).toBe(false);
  });
});
```

### Workflow 2: Testing a Shared Service

**Goal**: Write comprehensive specs for a service like `ToastService` or data service

#### Step 1: Set Up Service Test

```typescript
import { TestBed } from '@angular/core/testing';
import { MyService } from './my.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

describe('MyService', () => {
  let service: MyService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [MyService],
    });

    service = TestBed.inject(MyService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify(); // Ensure no outstanding HTTP requests
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
```

#### Step 2: Test Observable Methods

```typescript
describe('Observable Methods', () => {
  it('should emit values on subscription', (done) => {
    const expectedData = { id: 1, name: 'Test' };

    service.getData$().subscribe((data) => {
      expect(data).toEqual(expectedData);
      done();
    });

    const req = httpMock.expectOne('/api/data');
    req.flush(expectedData);
  });

  it('should handle multiple subscriptions', () => {
    const listener1 = jest.fn();
    const listener2 = jest.fn();

    service.getData$().subscribe(listener1);
    service.getData$().subscribe(listener2);

    const req = httpMock.expectOne('/api/data');
    req.flush({ id: 1 });

    expect(listener1).toHaveBeenCalled();
    expect(listener2).toHaveBeenCalled();
  });
});
```

#### Step 3: Test Error Handling

```typescript
describe('Error Handling', () => {
  it('should handle HTTP errors gracefully', (done) => {
    service.getData$().subscribe(
      () => fail('should have failed'),
      (error) => {
        expect(error.status).toBe(404);
        done();
      },
    );

    const req = httpMock.expectOne('/api/data');
    req.flush('Not Found', { status: 404, statusText: 'Not Found' });
  });

  it('should retry on error with exponential backoff', () => {
    const spy = jest.spyOn(service, 'retryableCall');

    service.retryableCall().subscribe(
      () => {},
      () => {},
    );

    expect(spy).toHaveBeenCalled();
  });
});
```

#### Step 4: Test State Management

```typescript
describe('State Management', () => {
  it('should initialize with correct default state', () => {
    expect(service.state$).toBeDefined();
  });

  it('should update state when method called', (done) => {
    service.updateState({ loading: true });

    service.state$.subscribe((state) => {
      expect(state.loading).toBe(true);
      done();
    });
  });
});
```

### Workflow 3: Testing Components with Forms (ControlValueAccessor)

**Goal**: Test form-enabled components like Input, Checkbox, TelephoneInput

#### Step 1: Test ControlValueAccessor Interface

```typescript
describe('ControlValueAccessor Implementation', () => {
  it('should implement ControlValueAccessor', () => {
    expect(component.writeValue).toBeDefined();
    expect(component.registerOnChange).toBeDefined();
    expect(component.registerOnTouched).toBeDefined();
    expect(component.setDisabledState).toBeDefined();
  });

  it('should update internal value when writeValue called', () => {
    component.writeValue('test-value');

    expect(component.value).toBe('test-value');
  });

  it('should call onChange when value changes', () => {
    const onChangeSpy = jest.fn();
    component.registerOnChange(onChangeSpy);

    component.value = 'new-value';
    component.onValueChange('new-value');

    expect(onChangeSpy).toHaveBeenCalledWith('new-value');
  });
});
```

#### Step 2: Test Reactive Forms Integration

```typescript
describe('Reactive Forms Integration', () => {
  let form: FormGroup;

  beforeEach(() => {
    form = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email]),
      phone: new FormControl(''),
    });
  });

  it('should bind to FormControl', () => {
    const control = form.get('email');
    component.formControl = control as FormControl<string>;
    fixture.detectChanges();

    component.value = 'test@example.com';
    component.onValueChange('test@example.com');

    expect(control?.value).toBe('test@example.com');
  });

  it('should display validation errors', () => {
    const control = form.get('email');
    control?.markAsTouched();
    control?.setErrors({ required: true });
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('.error')).toBeTruthy();
  });
});
```

#### Step 3: Test Input Validation

```typescript
describe('Input Validation', () => {
  it('should validate email format', () => {
    component.type = 'email';
    component.onValueChange('invalid-email');

    expect(component.isValid).toBe(false);

    component.onValueChange('valid@example.com');

    expect(component.isValid).toBe(true);
  });

  it('should validate phone number format', () => {
    component.type = 'tel';
    component.onValueChange('123');

    expect(component.isValid).toBe(false);

    component.onValueChange('+34612345678');

    expect(component.isValid).toBe(true);
  });
});
```

### Workflow 4: Testing Components with OnPush Change Detection

**Goal**: Test components using `ChangeDetectionStrategy.OnPush`

#### Step 1: Ensure Proper Change Detection Triggering

```typescript
describe('OnPush Change Detection', () => {
  it('should update template when inputs change', () => {
    component.title = 'Initial';
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain('Initial');

    component.title = 'Updated';
    fixture.detectChanges(); // Must manually trigger with OnPush

    expect(fixture.nativeElement.textContent).toContain('Updated');
  });

  it('should detect changes when observable emits', (done) => {
    component.data$ = of({ message: 'Test' });
    fixture.detectChanges();

    setTimeout(() => {
      expect(fixture.nativeElement.textContent).toContain('Test');
      done();
    }, 0);
  });
});
```

#### Step 2: Test Async Pipe with OnPush

```typescript
describe('Async Pipe Integration', () => {
  it('should update view when async observable emits', (done) => {
    component.data$ = of({ id: 1, name: 'Test' });
    fixture.detectChanges();

    setTimeout(() => {
      fixture.detectChanges();
      expect(fixture.nativeElement.querySelector('.name')?.textContent).toContain('Test');
      done();
    }, 0);
  });
});
```

### Workflow 5: Mocking Services and Dependencies

**Goal**: Set up proper mocks for services used by components

#### Step 1: Create Mock Services

```typescript
describe('Service Mocking', () => {
  beforeEach(async () => {
    const mockToastService = {
      show: jest.fn(),
      remove: jest.fn(),
      showSuccess: jest.fn(),
      showError: jest.fn(),
      showInfo: jest.fn(),
      showWarn: jest.fn(),
      toasts$: BehaviorSubject<Toast[]>,
    };

    const mockDialogService = {
      open: jest.fn().mockReturnValue({ confirmed$: of(true) }),
      close: jest.fn(),
    };

    await TestBed.configureTestingModule({
      imports: [MyComponent],
      providers: [
        { provide: ToastService, useValue: mockToastService },
        { provide: DialogService, useValue: mockDialogService },
      ],
    }).compileComponents();
  });
});
```

#### Step 2: Verify Mock Calls

```typescript
describe('Mock Verification', () => {
  it('should call ToastService.show with correct parameters', () => {
    component.showNotification('test-message');

    expect(toastService.show).toHaveBeenCalledWith(
      expect.objectContaining({
        severity: 'success',
        summary: 'test-message',
      }),
    );
  });

  it('should call DialogService.open on confirmation', () => {
    component.confirmDelete();

    expect(dialogService.open).toHaveBeenCalledWith(
      expect.objectContaining({
        title: 'Confirm Action',
      }),
    );
  });
});
```

## Common Testing Patterns

### Testing Observables

```typescript
// Simple observable
myService.getData$().subscribe((data) => {
  expect(data).toBeDefined();
});

// With marble testing (advanced)
import { TestScheduler } from 'rxjs/testing';

it('should emit correct sequences', () => {
  const scheduler = new TestScheduler((actual, expected) => {
    expect(actual).toEqual(expected);
  });

  scheduler.run(({ expectObservable }) => {
    const result$ = service.getData$();
    expectObservable(result$).toBe('--a', { a: { id: 1 } });
  });
});
```

### Testing Async Operations

```typescript
// Using done callback
it('should complete async operation', (done) => {
  service.asyncMethod().then(() => {
    expect(component.loaded).toBe(true);
    done();
  });
});

// Using fakeAsync and flush
it('should handle timers properly', fakeAsync(() => {
  component.methodWithTimeout();

  expect(component.state).toBe('pending');

  tick(1000);

  expect(component.state).toBe('complete');
}));

// Using flushMicrotasks for promises
it('should handle promise resolution', fakeAsync(() => {
  component.methodWithPromise();

  flushMicrotasks();

  expect(component.resolved).toBe(true);
}));
```

### Testing Template Events

```typescript
it('should handle button click', () => {
  const spy = jest.spyOn(component, 'onSubmit');
  const button = fixture.nativeElement.querySelector('button');

  button.click();

  expect(spy).toHaveBeenCalled();
});

it('should handle form submission', () => {
  const spy = jest.spyOn(component, 'onSubmit');
  const form = fixture.nativeElement.querySelector('form');

  form.dispatchEvent(new Event('submit'));

  expect(spy).toHaveBeenCalled();
});

it('should handle input change', () => {
  const input = fixture.nativeElement.querySelector('input');
  input.value = 'test';
  input.dispatchEvent(new Event('input'));
  fixture.detectChanges();

  expect(component.value).toBe('test');
});
```

### Testing with Snapshot Testing

```typescript
it('should match snapshot', () => {
  expect(fixture.nativeElement).toMatchSnapshot();
});

it('should match component state snapshot', () => {
  expect(component.state).toMatchSnapshot();
});
```

## Troubleshooting

| Issue                        | Solution                                                                                       |
| ---------------------------- | ---------------------------------------------------------------------------------------------- |
| "Cannot find module"         | Ensure imports use `@/` paths from `tsconfig.base.json`; check npm link if local packages      |
| Mock not working             | Verify mock is defined BEFORE `TestBed.configureTestingModule()`, use `jest.Mocked<T>` type    |
| Change detection not trigger | Manual `fixture.detectChanges()` required; check OnPush strategy in component                  |
| Observable not emitting      | Use `done()` callback, `fakeAsync()`, or higher timeout in `waitFor()`                         |
| "Cannot read property" null  | Initialize component properties in test or add null checks; use optional chaining `?.`         |
| Timeout in async tests       | Increase Jest timeout: `jest.setTimeout(10000)`; check for unresolved promises                 |
| Memory leaks in tests        | Ensure `afterEach(() => httpMock.verify())` and subscriptions use `takeUntilDestroyed()`       |
| Template selector not found  | Check selector name, wait for `fixture.detectChanges()`, log `fixture.nativeElement.innerHTML` |
| Form validation not working  | Manually call `control.markAsTouched()` and `control.updateValueAndValidity()`                 |

## References

- [Jest Patterns & API](./references/jest-patterns.md)
- [Component Testing Strategies](./references/component-testing.md)
- [Service Testing Strategies](./references/service-testing.md)
- [Mocking Strategies](./references/mocking-strategies.md)
- [Angular Testing Guide](https://angular.io/guide/testing)
- [Jest Documentation](https://jestjs.io/docs/getting-started)

---

**Last Updated**: February 2026 | **Angular**: 19.2.9 | **Jest**: 29+ | **Nx**: 20.8.2
