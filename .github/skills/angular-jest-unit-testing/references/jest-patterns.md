# Jest Patterns & API Reference

Comprehensive guide to Jest syntax, patterns, and assertions used in test files.

## Jest Test Structure

### Basic Test Anatomy

```typescript
describe('MyComponent', () => {
  // Setup (runs before each test)
  beforeEach(() => {
    // Initialize TestBed, create fixtures, etc.
  });

  // Cleanup (runs after each test)
  afterEach(() => {
    // Clean up subscriptions, mocks, etc.
  });

  // Single test (also called spec)
  it('should do something', () => {
    // Arrange (set up test data)
    const input = 'test';

    // Act (perform action being tested)
    const result = myFunction(input);

    // Assert (verify expected outcome)
    expect(result).toBe('expected');
  });
});
```

## Key Jest Functions

### Test Grouping

```typescript
describe('Feature Name', () => {
  // Group related tests
  describe('Specific Behavior', () => {
    it('should work', () => {});
  });
});
```

### Setup & Teardown

```typescript
beforeEach(() => {
  // Runs before EACH test
  TestBed.configureTestingModule({});
});

afterEach(() => {
  // Runs after EACH test
  httpMock.verify();
});

beforeAll(() => {
  // Runs ONCE before all tests in this block
});

afterAll(() => {
  // Runs ONCE after all tests in this block
});
```

### Skipping & Focusing Tests

```typescript
it.skip('should skip this test', () => {});

it.only('should run only this test', () => {});

describe.skip('entire block is skipped', () => {});

describe.only('run only this block', () => {});
```

## Expect Matchers

### Equality

```typescript
expect(value).toBe(5); // ===
expect(value).toEqual({ a: 1 }); // Deep equality
expect(value).toStrictEqual({ a: 1 }); // Strict type + value

// Not variants
expect(value).not.toBe(5);
expect(value).not.toEqual({ a: 2 });
```

### Truthiness

```typescript
expect(value).toBeTruthy(); // !!value === true
expect(value).toBeFalsy(); // !!value === false
expect(value).toBeNull();
expect(value).toBeUndefined();
expect(value).toBeDefined();
```

### Numbers

```typescript
expect(3).toBeGreaterThan(2);
expect(2).toBeGreaterThanOrEqual(2);
expect(1).toBeLessThan(2);
expect(2).toBeLessThanOrEqual(2);
expect(0.1 + 0.2).toBeCloseTo(0.3); // Floating point tolerance
```

### Strings & Arrays

```typescript
expect(string).toContain('substring');
expect(array).toContain(element);
expect(array).toEqual(expect.arrayContaining([1, 2]));
expect(array).toHaveLength(3);

// Pattern matching
expect(string).toMatch(/regex/);
expect(string).toMatch('substring');
```

### Objects & Properties

```typescript
expect(obj).toHaveProperty('key');
expect(obj).toHaveProperty('key', 'value');
expect(obj).toMatchObject({ a: 1 });

// Partial object matching
expect(response).toEqual(
  expect.objectContaining({
    status: 200,
    headers: expect.any(Object),
  }),
);
```

### Type Checking

```typescript
expect(value).toBeInstanceOf(MyClass);
expect(value).toEqual(expect.any(String));
expect(value).toEqual(expect.any(Number));
expect(value).toEqual(expect.any(Function));
```

### Collections

```typescript
expect(array).toContainEqual(elementToFind);
expect(array).toEqual(expect.arrayContaining([2, 1])); // Order doesn't matter
```

## Mock Functions

### Creating Mocks

```typescript
// Simple mock function
const mockFunction = jest.fn();

// Mock with return value
const mockFunction = jest.fn(() => 'return value');

// Mock with specific return for specific calls
const mockFunction = jest
  .fn()
  .mockReturnValueOnce('first call')
  .mockReturnValueOnce('second call')
  .mockReturnValue('all other calls');

// Mock with resolved promise
const mockFunction = jest.fn().mockResolvedValue({ id: 1 });

// Mock with rejected promise
const mockFunction = jest.fn().mockRejectedValue(new Error('Failed'));

// Mock that calls through to original
const mockFunction = jest.fn((x) => x + 1);
```

### Spying on Methods

```typescript
// Spy on existing method (doesn't replace implementation)
const spy = jest.spyOn(component, 'method');

// Spy and replace implementation
const spy = jest.spyOn(component, 'method').mockImplementation(() => {});

// Spy and restore original after test
const spy = jest.spyOn(component, 'method');
spy.mockRestore();

// Spy with retval
jest.spyOn(component, 'method').mockReturnValue('test');
```

### Verifying Mock Calls

```typescript
expect(mockFunction).toHaveBeenCalled();
expect(mockFunction).toHaveBeenCalledTimes(3);

// With specific arguments
expect(mockFunction).toHaveBeenCalledWith('arg1', 'arg2');
expect(mockFunction).toHaveBeenNthCalledWith(2, 'arg1', 'arg2'); // Nth call

// With partially matched arguments
expect(mockFunction).toHaveBeenCalledWith(
  expect.stringContaining('Hello'),
  expect.objectContaining({ id: 1 }),
);

// Verify not called
expect(mockFunction).not.toHaveBeenCalled();
```

### Mock Properties

```typescript
const mockFunction = jest.fn();

// Get number of calls
mockFunction.mock.calls.length;

// Get call arguments
mockFunction.mock.calls[0]; // First call args
mockFunction.mock.calls[0][0]; // First argument of first call

// Get return values
mockFunction.mock.results[0].value; // Return value of first call

// Clear mock
mockFunction.mockClear();

// Reset mock to original implementation
mockFunction.mockRestore();
```

## Typed Mocks (Jest.Mocked<T>)

```typescript
import { jest } from '@jest/globals';

interface MyService {
  getData(): Observable<any>;
  processData(data: any): void;
}

const mockService: jest.Mocked<MyService> = {
  getData: jest.fn(),
  processData: jest.fn(),
};

// Now TypeScript knows about the methods
mockService.getData.mockReturnValue(of([]));
mockService.processData.mockImplementation((data) => {});

// Type-safe assertion
expect(mockService.getData).toHaveBeenCalled();
```

## Module Mocking

### Mock Entire Module

```typescript
jest.mock('@/shared/data-access', () => ({
  MyService: jest.fn().mockImplementation(() => ({
    getData: jest.fn().mockReturnValue(of([])),
  })),
}));
```

### Partial Mocks

```typescript
jest.mock('@/shared/data-access', () => ({
  ...jest.requireActual('@/shared/data-access'),
  MyService: jest.fn(),
}));
```

### Clearing Module Mocks

```typescript
jest.clearAllMocks(); // Clear all mock calls
jest.resetAllMocks(); // Reset mock returns and implementations
jest.restoreAllMocks(); // Restore all mocked modules
```

## Async Testing

### Done Callback

```typescript
it('should handle async operation', (done) => {
  asyncFunction().then((result) => {
    expect(result).toBe('success');
    done(); // Tell Jest when test is complete
  });
});

// If test doesn't call done(), Jest times out
jest.setTimeout(5000); // Custom timeout per test
```

### Mock Promises

```typescript
it('should handle mock promise', () => {
  const mockFunction = jest.fn().mockResolvedValue({ id: 1 });

  return mockFunction().then((result) => {
    expect(result.id).toBe(1);
  });
});

// With rejected promise
it('should handle promise rejection', () => {
  const mockFunction = jest.fn().mockRejectedValue(new Error('Failed'));

  return expect(mockFunction()).rejects.toThrow('Failed');
});
```

### Fake Timers

```typescript
beforeEach(() => {
  jest.useFakeTimers();
});

afterEach(() => {
  jest.useRealTimers();
});

it('should handle timeout', () => {
  const callback = jest.fn();
  setTimeout(callback, 1000);

  jest.advanceTimersByTime(500);
  expect(callback).not.toHaveBeenCalled();

  jest.advanceTimersByTime(500);
  expect(callback).toHaveBeenCalledTimes(1);
});

// Run all pending timers
jest.runAllTimers();

// Run only pending timers (not recursively scheduled)
jest.runOnlyPendingTimers();
```

## Snapshot Testing

```typescript
it('should match snapshot', () => {
  expect(fixture.nativeElement.innerHTML).toMatchSnapshot();
});

// Inline snapshot
it('should match inline snapshot', () => {
  expect(value).toMatchInlineSnapshot(`"expected value"`);
});

// Update snapshots
// Run with: jest --updateSnapshot or jest -u
```

## Error Handling

```typescript
// Test that function throws
expect(() => {
  myFunction();
}).toThrow();

// Test specific error
expect(() => {
  myFunction();
}).toThrow('error message');

// Test error type
expect(() => {
  myFunction();
}).toThrow(TypeError);

// Async error handling
expect(promise).rejects.toThrow('error message');
```

## Debugging Tips

```typescript
// Print to console during tests
console.log('Debug value:', value);

// Use jest.spyOn on console (be careful)
const consoleSpy = jest.spyOn(console, 'log').mockImplementation();
consoleSpy.mockRestore();

// Run specific test
npm run test -- --testNamePattern="should do something"

// Run specific file
npm run test -- toast.component.spec.ts

// Run with coverage
npm run test -- --coverage

// Watch mode
npm run test -- --watch

// Debug with Node inspector
node --inspect-brk node_modules/.bin/jest --runInBand
```

## Monorepo Specific

### Testing Standalone Components

```typescript
// Import component directly (no NgModule)
await TestBed.configureTestingModule({
  imports: [MyComponent, MyDependency],
}).compileComponents();
```

### Testing Services with HttpClientTestingModule

```typescript
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

beforeEach(() => {
  TestBed.configureTestingModule({
    imports: [HttpClientTestingModule],
    providers: [MyService],
  });
  httpMock = TestBed.inject(HttpTestingController);
});

afterEach(() => {
  httpMock.verify(); // Ensure no outstanding requests
});

it('should make HTTP request', () => {
  service.getData().subscribe((data) => {
    expect(data).toBe('response');
  });

  const req = httpMock.expectOne('/api/data');
  expect(req.request.method).toBe('GET');
  req.flush('response');
});
```

### Testing with Signals (Angular 19)

```typescript
it('should update signal value', () => {
  const signal = signal({ id: 1 });

  // Read signal value
  expect(signal()).toEqual({ id: 1 });

  // Update signal
  signal.set({ id: 2 });
  expect(signal()).toEqual({ id: 2 });

  // Update specific property
  signal.update((prev) => ({ ...prev, id: 3 }));
  expect(signal()).toEqual({ id: 3 });
});

it('should track derived signals', () => {
  const count = signal(1);
  const doubled = computed(() => count() * 2);

  expect(doubled()).toBe(2);

  count.set(5);
  expect(doubled()).toBe(10);
});
```

---

**References**: [Jest Official Docs](https://jestjs.io/), [Angular Testing Guide](https://angular.io/guide/testing)
