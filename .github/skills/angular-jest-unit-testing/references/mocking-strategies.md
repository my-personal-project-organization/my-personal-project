# Mocking Strategies for Services

Comprehensive guide for creating and using mocks in unit tests, with -specific examples.

## Mock Service Templates

### Basic Service Mock

```typescript
// Mock for a simple data service
const mockDataService = {
  getData: jest.fn().mockReturnValue(of([])),
  saveData: jest.fn().mockReturnValue(of(null)),
  deleteData: jest.fn().mockReturnValue(of(null)),
};

// Usage in TestBed
TestBed.configureTestingModule({
  providers: [{ provide: DataService, useValue: mockDataService }],
});
```

### Observable Service Mock with BehaviorSubject

```typescript
// Mock for service with state observable
const mockUserService = {
  currentUser$: new BehaviorSubject({ id: 1, name: 'John' }),
  users$: new BehaviorSubject([]),

  loadUsers: jest.fn().mockImplementation(function () {
    this.users$.next([
      { id: 1, name: 'John' },
      { id: 2, name: 'Jane' },
    ]);
    return this.users$;
  }),

  selectUser: jest.fn().mockImplementation(function (user) {
    this.currentUser$.next(user);
  }),
};
```

### HTTP Service Mock

```typescript
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

// Mock API service
const mockApiService = {
  get: jest.fn().mockImplementation((url: string) => of({ data: 'mock data', url })),
  post: jest.fn().mockResolvedValue({ success: true }),
  put: jest.fn().mockResolvedValue({ updated: true }),
  delete: jest.fn().mockResolvedValue({ deleted: true }),
};

// In test:
TestBed.configureTestingModule({
  imports: [HttpClientTestingModule],
  providers: [{ provide: ApiService, useValue: mockApiService }],
});
```

## Shared Service Mocks

### ToastService Mock

```typescript
import { Toast } from '@/shared/ui/components/molecules/toast';

const mockToastService = {
  show: jest.fn(),
  remove: jest.fn(),
  showSuccess: jest.fn(),
  showError: jest.fn(),
  showInfo: jest.fn(),
  showWarn: jest.fn(),
  toasts$: new BehaviorSubject<Toast[]>([]),

  // Helper for testing
  getLastToast: jest.fn().mockImplementation(function () {
    const toasts = this.toasts$.value;
    return toasts[toasts.length - 1];
  }),
};

// Usage
TestBed.configureTestingModule({
  providers: [{ provide: ToastService, useValue: mockToastService }],
});

// In test
component.showNotification('test');
expect(mockToastService.show).toHaveBeenCalledWith(
  expect.objectContaining({
    severity: 'success',
    summary: 'test',
  }),
);
```

### DialogService Mock

```typescript
const mockDialogService = {
  open: jest.fn().mockImplementation((options) => {
    return {
      confirmed$: of(true),
      getInstance: jest.fn().mockReturnValue({}),
    };
  }),

  close: jest.fn(),

  // Variants
  confirm: jest.fn().mockReturnValue(of(true)),
  alert: jest.fn().mockReturnValue(of(true)),
};

// Usage
TestBed.configureTestingModule({
  providers: [{ provide: DialogService, useValue: mockDialogService }],
});

// In test
component.openDeleteDialog();
expect(mockDialogService.open).toHaveBeenCalledWith(
  expect.objectContaining({
    title: 'Confirm Delete',
  }),
);
```

### CountriesService Mock

```typescript
import { Country } from '@/shared/ui/services/countries.service';

const mockCountriesService = {
  getCountries: jest.fn().mockReturnValue([
    {
      name: 'Spain',
      code: 'ES',
      dialCode: '+34',
      flag: '🇪🇸',
      phoneFormat: '### ### ###',
    },
    {
      name: 'United States',
      code: 'US',
      dialCode: '+1',
      flag: '🇺🇸',
      phoneFormat: '(###) ###-####',
    },
  ] as Country[]),

  getCountryByCode: jest.fn().mockImplementation((code: string) => {
    const countries = mockCountriesService.getCountries();
    return countries.find((c) => c.code === code);
  }),

  validatePhone: jest.fn().mockReturnValue(true),
};

// Usage
TestBed.configureTestingModule({
  providers: [{ provide: CountriesService, useValue: mockCountriesService }],
});
```

### AuthService Mock

```typescript
import { AuthState } from '@/shared/data-access';

const mockAuthService = {
  currentUser$: new BehaviorSubject({ id: 1, email: 'user@example.com' }),
  isLoggedIn$: new BehaviorSubject(true),
  isAdmin$: new BehaviorSubject(false),

  login: jest.fn().mockReturnValue(of({ token: 'jwt-token', user: { id: 1, email: 'user@example.com' } })),

  logout: jest.fn().mockReturnValue(of(null)),

  refreshToken: jest.fn().mockReturnValue(of({ token: 'new-jwt-token' })),

  checkPermission: jest.fn().mockReturnValue(true),
};

// Usage
TestBed.configureTestingModule({
  providers: [{ provide: AuthService, useValue: mockAuthService }],
});
```

## Advanced Mocking Patterns

### Conditional Mock Behavior

```typescript
const mockDataService = {
  getData: jest.fn().mockImplementation((id: number) => {
    if (id === 1) {
      return of({ id: 1, name: 'Valid' });
    } else if (id === 999) {
      return throwError(() => new Error('Not found'));
    } else {
      return of({ id, name: 'Item' });
    }
  }),
};
```

### Sequential Mock Returns

```typescript
const mockAuthService = {
  login: jest
    .fn()
    .mockReturnValueOnce(throwError(() => new Error('Invalid credentials')))
    .mockReturnValueOnce(throwError(() => new Error('Account locked')))
    .mockReturnValue(of({ token: 'jwt-token', user: { id: 1 } })),
};

// Usage: First call fails, second call fails, third call succeeds
```

### Time-Based Mock Behavior

```typescript
jest.useFakeTimers();

const mockNotificationService = {
  notify: jest.fn().mockImplementation(() => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({ sent: true });
      }, 1000);
    });
  }),
};

// In test:
it('should wait for notification', fakeAsync(() => {
  mockNotificationService.notify();

  tick(1000);

  expect(mockNotificationService.notify).toHaveBeenCalled();
}));
```

### Partial Mocking (Mock + Real Implementation)

```typescript
// Keep most of service real, mock only specific method
jest.mock('@/shared/data-access', () => ({
  ...jest.requireActual('@/shared/data-access'),
  DataService: {
    ...jest.requireActual('@/shared/data-access').DataService,
    getCachedData: jest.fn().mockReturnValue({ cached: true }),
  },
}));
```

## Mocking Dependencies

### Component Dependency Mocking

```typescript
describe('MyComponent with dependencies', () => {
  beforeEach(async () => {
    const mockToastService = { show: jest.fn() };
    const mockDialogService = { open: jest.fn() };
    const mockDataService = { getData: jest.fn().mockReturnValue(of([])) };

    await TestBed.configureTestingModule({
      imports: [MyComponent],
      providers: [
        { provide: ToastService, useValue: mockToastService },
        { provide: DialogService, useValue: mockDialogService },
        { provide: DataService, useValue: mockDataService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(MyComponent);
    component = fixture.componentInstance;
  });

  it('should use all services correctly', () => {
    fixture.detectChanges();
    // Test interactions
  });
});
```

### Nested Service Mocking

```typescript
describe('Service with dependencies', () => {
  let service: MyService;
  let mockDataService: jest.Mocked<DataService>;
  let mockCacheService: jest.Mocked<CacheService>;

  beforeEach(() => {
    mockDataService = {
      fetch: jest.fn().mockReturnValue(of({ data: 'test' })),
    } as any;

    mockCacheService = {
      get: jest.fn(),
      set: jest.fn(),
      clear: jest.fn(),
    } as any;

    TestBed.configureTestingModule({
      providers: [
        MyService,
        { provide: DataService, useValue: mockDataService },
        { provide: CacheService, useValue: mockCacheService },
      ],
    });

    service = TestBed.inject(MyService);
  });

  it('should use cache before fetching', () => {
    mockCacheService.get.mockReturnValue({ cached: true });

    service.getData().subscribe();

    expect(mockCacheService.get).toHaveBeenCalled();
    expect(mockDataService.fetch).not.toHaveBeenCalled();
  });

  it('should fetch when cache miss', () => {
    mockCacheService.get.mockReturnValue(null);
    mockDataService.fetch.mockReturnValue(of({ data: 'test' }));

    service.getData().subscribe();

    expect(mockDataService.fetch).toHaveBeenCalled();
    expect(mockCacheService.set).toHaveBeenCalled();
  });
});
```

## Typed Mocks (jest.Mocked<T>)

### Proper Typing for Mocked Services

```typescript
interface MyServiceInterface {
  getData(): Observable<any>;
  processData(data: any): void;
  cache$: BehaviorSubject<any[]>;
}

const mockMyService: jest.Mocked<MyServiceInterface> = {
  getData: jest.fn(),
  processData: jest.fn(),
  cache$: new BehaviorSubject([]),
};

// Now TypeScript knows the types:
mockMyService.getData.mockReturnValue(of({ id: 1 })); // ✅ Type-safe
mockMyService.processData.mockImplementation((data) => console.log(data)); // ✅ Type-safe
```

### Using jest.Mocked with TestBed

```typescript
describe('Component using typed mocks', () => {
  let component: MyComponent;
  let fixture: ComponentFixture<MyComponent>;
  let myService: jest.Mocked<MyServiceInterface>;

  beforeEach(async () => {
    const mockService: jest.Mocked<MyServiceInterface> = {
      getData: jest.fn().mockReturnValue(of([])),
      processData: jest.fn(),
      cache$: new BehaviorSubject([]),
    };

    await TestBed.configureTestingModule({
      imports: [MyComponent],
      providers: [{ provide: MyService, useValue: mockService }],
    }).compileComponents();

    fixture = TestBed.createComponent(MyComponent);
    component = fixture.componentInstance;
    myService = TestBed.inject(MyService) as jest.Mocked<MyServiceInterface>;
  });

  it('should call service method', () => {
    component.loadData();

    expect(myService.getData).toHaveBeenCalled();
  });
});
```

## Testing with Mocked Observables

### Mock Observable Streams

```typescript
describe('Component with observable streams', () => {
  it('should subscribe to mocked observable', (done) => {
    const mockDataService = {
      data$: new BehaviorSubject({ id: 1, name: 'Test' }),
      updates$: new Subject<any>(),
    };

    TestBed.configureTestingModule({
      imports: [MyComponent],
      providers: [{ provide: DataService, useValue: mockDataService }],
    });

    fixture = TestBed.createComponent(MyComponent);
    fixture.detectChanges();

    setTimeout(() => {
      expect(component.data).toEqual({ id: 1, name: 'Test' });
      done();
    }, 0);
  });

  it('should handle observable updates', (done) => {
    const mockDataService = {
      updates$: new Subject<any>(),
    };

    fixture = TestBed.createComponent(MyComponent);
    const updatesService = TestBed.inject(DataService);

    fixture.detectChanges();

    mockDataService.updates$.next({ status: 'updated' });

    setTimeout(() => {
      expect(component.status).toBe('updated');
      done();
    }, 0);
  });
});
```

## Mocking API Responses

### Paginated Response Mock

```typescript
const mockApiService = {
  getUsers: jest.fn().mockImplementation((page: number, limit: number) => {
    const allUsers = [
      { id: 1, name: 'User 1' },
      { id: 2, name: 'User 2' },
      { id: 3, name: 'User 3' },
      { id: 4, name: 'User 4' },
    ];

    const start = (page - 1) * limit;
    const end = start + limit;

    return of({
      data: allUsers.slice(start, end),
      total: allUsers.length,
      page,
      pageSize: limit,
    });
  }),
};
```

### Search Response Mock

```typescript
const mockSearchService = {
  search: jest.fn().mockImplementation((query: string) => {
    if (!query) return of([]);

    const results = [
      { id: 1, title: 'Search Result 1', query: 'test' },
      { id: 2, title: 'Search Result 2', query: 'testing' },
      { id: 3, title: 'Test Search Result', query: 'search' },
    ];

    return of(results.filter((r) => r.title.toLowerCase().includes(query.toLowerCase())));
  }),
};
```

## Best Practices

### ✅ DO

```typescript
// Create mocks with all required properties
const goodMock = {
  method1: jest.fn(),
  method2: jest.fn(),
  observable$: of([]),
};

// Use typed mocks for type safety
const typedMock: jest.Mocked<MyService> = {
  /* ... */
};

// Mock return values explicitly
mockService.getData.mockReturnValue(of({ id: 1 }));

// Verify mock calls in assertions
expect(mockService.getData).toHaveBeenCalledWith(1);

// Reset mocks between tests if needed
mockService.getData.mockClear();
```

### ❌ DON'T

```typescript
// Don't use partial mocks without explicit typing
const badMock = { method1: jest.fn() }; // Missing other properties

// Don't forget to provide mocks in TestBed
// This will fail if the actual service isn't available

// Don't over-mock - keep mocks focused
const overmock = {
  getData: jest.fn(),
  getDataAdvanced: jest.fn(),
  getDataWithCache: jest.fn(),
  // ... 50 more methods
};

// Don't forget httpMock.verify() in afterEach
// This leaves outstanding HTTP requests
```

---

**See Also**: [Jest Patterns](./jest-patterns.md), [Component Testing](./component-testing.md), [Service Testing](./service-testing.md)
