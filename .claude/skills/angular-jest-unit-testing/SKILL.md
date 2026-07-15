---
description: Expert Angular 20 unit testing with Jest for shared libraries. Write comprehensive specs for components (TestBed, fixture detection, async, ChangeDetectionStrategy.OnPush), services (injection, observables, mocks), directives, and utilities. Use when writing tests, debugging test failures, implementing test coverage, testing reactive forms, mocking services, testing observables, or ensuring component behavior verification. Covers Jest setup, mocking strategies, async patterns, snapshot testing, and Angular-specific testing conventions.
---

# Angular Jest Unit Testing

Expert guide for writing, debugging, and maintaining unit tests for Angular 20 components and services using Jest. Focused on testing shared libraries and monorepo projects with signals, standalone components, and modern patterns.

## When to Use This Skill

- Writing new `.spec.ts` files for components, services, directives, or utilities
- Debugging failing tests or test setup issues
- Implementing test coverage for existing code
- Testing reactive forms with FormControl/FormGroup
- Mocking services, HTTP requests, or dependencies
- Testing async operations (observables, promises, signals, fakeAsync)
- Testing components with OnPush change detection strategy
- Testing template interactions (button clicks, form submissions)
- Testing directive behavior or input binding changes
- Setting up Jest mocks for services
- Improving test quality and coverage metrics
- Learning Angular testing conventions and best practices

## Prerequisites

- Angular 20.3.9 understanding (standalone components, signals, `inject()`)
- Jest fundamentals (`test`, `expect`, `beforeEach`, `afterEach`, mocks)
- Angular testing utilities: `TestBed`, `ComponentFixture`, `fakeAsync`, `tick`
- Monorepo structure: `libs/` layout with `@mpp/*` import aliases
- Component patterns: `ChangeDetectionStrategy.OnPush`, `inject()`-based DI
- TypeScript basics and generics
- Reactive Forms API (`FormControl`, `FormGroup`, `Validators`)

## Quick Start: Test a Component

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
      imports: [MyComponent], // standalone
    }).compileComponents();

    fixture = TestBed.createComponent(MyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges(); // Initial CD
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display message', () => {
    component.message = 'Hello';
    fixture.detectChanges();
    const el = fixture.debugElement.query(By.css('p'));
    expect(el.nativeElement.textContent).toContain('Hello');
  });

  it('should emit event on click', () => {
    spyOn(component.clicked, 'emit');
    const btn = fixture.debugElement.query(By.css('button')).nativeElement;
    btn.click();
    expect(component.clicked.emit).toHaveBeenCalled();
  });
});
```

## TestBed Setup for Standalone Components

```typescript
beforeEach(async () => {
  const mockService = {
    fetchData: jest.fn().mockReturnValue(of({ id: 1 })),
  };

  await TestBed.configureTestingModule({
    imports: [
      MyComponent, // Standalone component
      HttpClientTestingModule, // For HTTP testing
    ],
    providers: [
      { provide: MyService, useValue: mockService }, // Mock service
    ],
  }).compileComponents();

  fixture = TestBed.createComponent(MyComponent);
  component = fixture.componentInstance;
  service = TestBed.inject(MyService);
});
```

## Testing Signals

```typescript
import { signal } from '@angular/core';

it('should increment signal value', () => {
  component.count = signal(0);
  component.increment();
  expect(component.count()).toBe(1);
});

it('should update computed signal', () => {
  component.firstName = signal('John');
  component.lastName = signal('Doe');
  expect(component.fullName()).toBe('John Doe');
});
```

## Testing Services with HTTP

```typescript
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

describe('DataService', () => {
  let service: DataService;
  let http: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [DataService],
    });
    service = TestBed.inject(DataService);
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => http.verify()); // Verify no outstanding requests

  it('should fetch data from API', () => {
    service.getData().subscribe(data => {
      expect(data.name).toBe('Test');
    });

    const req = http.expectOne('/api/data');
    expect(req.request.method).toBe('GET');
    req.flush({ name: 'Test' }); // Mock response
  });

  it('should handle error', () => {
    service.getData().subscribe(
      () => fail('should have failed'),
      (error) => expect(error.status).toBe(404)
    );

    http.expectOne('/api/data').error(
      new ErrorEvent('Not Found'),
      { status: 404 }
    );
  });
});
```

## Testing Async Code

### Using `fakeAsync` and `tick`

```typescript
import { fakeAsync, tick } from '@angular/core/testing';

it('should emit data after delay', fakeAsync(() => {
  let result = '';
  
  service.getDelayed().subscribe(data => {
    result = data;
  });

  expect(result).toBe(''); // Not emitted yet
  tick(1000); // Fast-forward time
  expect(result).toBe('expected data'); // Now emitted
}));
```

### Using `waitForAsync` for Observables

```typescript
import { waitForAsync } from '@angular/core/testing';

it('should resolve promise', waitForAsync(() => {
  let resolved = false;

  Promise.resolve().then(() => {
    resolved = true;
  });

  expect(resolved).toBe(false);
  fixture.whenStable().then(() => {
    expect(resolved).toBe(true);
  });
}));
```

## Testing Reactive Forms

```typescript
it('should validate form inputs', () => {
  component.form = new FormGroup({
    name: new FormControl('', [Validators.required]),
    email: new FormControl('', [Validators.email]),
  });

  expect(component.form.valid).toBe(false);

  component.form.patchValue({
    name: 'John',
    email: 'john@example.com',
  });

  expect(component.form.valid).toBe(true);
});

it('should submit form data', () => {
  spyOn(component.submitted, 'emit');
  component.form.patchValue({ name: 'John', email: 'john@example.com' });

  component.onSubmit();

  expect(component.submitted.emit).toHaveBeenCalledWith({
    name: 'John',
    email: 'john@example.com',
  });
});
```

## Mocking Strategies

### Using `jest.fn()` for Methods

```typescript
const mockService = {
  getData: jest.fn().mockReturnValue(of({ id: 1 })),
  delete: jest.fn().mockResolvedValue(undefined),
};

TestBed.configureTestingModule({
  providers: [{ provide: MyService, useValue: mockService }],
});
```

### Using Spies

```typescript
it('should call service method', () => {
  const spy = jest.spyOn(service, 'fetch');
  component.loadData();
  expect(spy).toHaveBeenCalledWith('endpoint');
});
```

## Testing OnPush Change Detection

```typescript
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
})
export class MyComponent {
  @Input() data: any;
}

it('should update with OnPush when input changes', () => {
  component.data = { id: 1 };
  fixture.detectChanges();
  expect(fixture.nativeElement.textContent).toContain('1');

  component.data = { id: 2 };
  fixture.detectChanges(); // Must manually trigger
  expect(fixture.nativeElement.textContent).toContain('2');
});
```

## Common Patterns

### Test Error Handling

```typescript
it('should show error state on failure', () => {
  service.fetch.mockReturnValue(throwError(() => new Error('Network failed')));
  
  component.load();
  fixture.detectChanges();

  expect(component.error()).toBe('Network failed');
  expect(fixture.nativeElement.querySelector('.error')).toBeTruthy();
});
```

### Test Conditional Rendering

```typescript
it('should render loading state', () => {
  component.isLoading = signal(true);
  fixture.detectChanges();
  expect(fixture.nativeElement.querySelector('app-spinner')).toBeTruthy();

  component.isLoading.set(false);
  fixture.detectChanges();
  expect(fixture.nativeElement.querySelector('app-spinner')).toBeFalsy();
});
```

### Snapshot Testing

```typescript
it('should render correctly', () => {
  fixture.detectChanges();
  expect(fixture.nativeElement).toMatchSnapshot();
});
```

## Run Tests

```bash
# Run all tests in a library
nx test libs/shared/ui

# Run specific test file
npm test -- my.component.spec.ts

# Run with coverage
nx test libs/shared/ui --coverage

# Watch mode
nx test libs/shared/ui --watch
```

## Coverage Goals

- **Statements**: 70%+
- **Branches**: 70%+
- **Functions**: 70%+
- **Lines**: 70%+

Configure thresholds in each library's `jest.config.ts`.

## Debugging Tips

- Use `fit()` to focus on a single test
- Use `xit()` to skip a test temporarily
- Add `debugger;` and run with `node --inspect-brk`
- Check `fixture.nativeElement` for DOM state
- Use `console.log(component)` to inspect component state
