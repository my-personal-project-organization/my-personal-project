# Service Testing Strategies

Comprehensive guide for testing Angular 19 services in the shared libraries.

## Service Test Structure

### Template

```typescript
import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { MyService } from './my.service';
import { MyDependency } from './my-dependency.service';

describe('MyService', () => {
  let service: MyService;
  let httpMock: HttpTestingController;
  let myDependency: jest.Mocked<MyDependency>;

  beforeEach(() => {
    const mockMyDependency = {
      process: jest.fn().mockReturnValue('processed'),
      calculate: jest.fn().mockReturnValue(42),
    };

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [MyService, { provide: MyDependency, useValue: mockMyDependency }],
    });

    service = TestBed.inject(MyService);
    httpMock = TestBed.inject(HttpTestingController);
    myDependency = TestBed.inject(MyDependency) as jest.Mocked<MyDependency>;
  });

  afterEach(() => {
    httpMock.verify(); // Verify no outstanding HTTP requests
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
```

## Testing Observable Methods

### Observable with subscription

```typescript
describe('Observable Methods', () => {
  it('should return observable', (done) => {
    const expectedData = { id: 1, name: 'Test' };

    service.getData$().subscribe((data) => {
      expect(data).toEqual(expectedData);
      done();
    });

    const req = httpMock.expectOne('/api/data');
    expect(req.request.method).toBe('GET');
    req.flush(expectedData);
  });

  it('should emit correct value sequence', (done) => {
    const values: number[] = [];

    service.counter$().subscribe((value) => {
      values.push(value);

      if (values.length === 3) {
        expect(values).toEqual([1, 2, 3]);
        done();
      }
    });

    // Simulate emissions
    const req = httpMock.expectOne('/api/counter');
    req.flush([1, 2, 3]);
  });

  it('should handle multiple subscriptions independently', () => {
    const listener1 = jest.fn();
    const listener2 = jest.fn();

    service.getData$().subscribe(listener1);
    service.getData$().subscribe(listener2);

    const req = httpMock.expectOne('/api/data');
    req.flush({ id: 1 });

    expect(listener1).toHaveBeenCalledWith({ id: 1 });
    expect(listener2).toHaveBeenCalledWith({ id: 1 });
  });

  it('should handle late subscribers', (done) => {
    const listener1 = jest.fn();
    const listener2 = jest.fn();

    const source = service.getData$();
    source.subscribe(listener1);

    const req = httpMock.expectOne('/api/data');

    setTimeout(() => {
      source.subscribe(listener2);
      req.flush({ id: 1 });
    }, 100);
  });
});
```

## Testing HTTP Requests

### GET Requests

```typescript
describe('GET Requests', () => {
  it('should fetch data from correct endpoint', () => {
    service.fetchUsers().subscribe();

    const req = httpMock.expectOne('/api/users');
    expect(req.request.method).toBe('GET');
    req.flush([{ id: 1, name: 'User 1' }]);
  });

  it('should handle query parameters', () => {
    service.searchUsers('admin').subscribe();

    const req = httpMock.expectOne('/api/users?role=admin');
    req.flush([]);
  });

  it('should construct URL correctly', () => {
    service.getUserById(123).subscribe();

    const req = httpMock.expectOne('/api/users/123');
    req.flush({ id: 123, name: 'User' });
  });
});
```

### POST Requests

```typescript
describe('POST Requests', () => {
  it('should send POST request with data', () => {
    const newUser = { name: 'John', email: 'john@example.com' };

    service.createUser(newUser).subscribe();

    const req = httpMock.expectOne('/api/users');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(newUser);
    req.flush({ id: 1, ...newUser });
  });

  it('should include correct headers', () => {
    service.createUser({ name: 'Test' }).subscribe();

    const req = httpMock.expectOne('/api/users');
    expect(req.request.headers.has('Content-Type')).toBe(true);
    req.flush({});
  });
});
```

### PUT/PATCH Requests

```typescript
describe('PUT/PATCH Requests', () => {
  it('should send PUT request for full update', () => {
    const updatedUser = { id: 1, name: 'Jane', email: 'jane@example.com' };

    service.updateUser(1, updatedUser).subscribe();

    const req = httpMock.expectOne('/api/users/1');
    expect(req.request.method).toBe('PUT');
    expect(req.request.body).toEqual(updatedUser);
    req.flush(updatedUser);
  });

  it('should send PATCH request for partial update', () => {
    const patch = { name: 'Jane' };

    service.patchUser(1, patch).subscribe();

    const req = httpMock.expectOne('/api/users/1');
    expect(req.request.method).toBe('PATCH');
    expect(req.request.body).toEqual(patch);
    req.flush({ id: 1, ...patch });
  });
});
```

### DELETE Requests

```typescript
describe('DELETE Requests', () => {
  it('should send DELETE request', () => {
    service.deleteUser(1).subscribe();

    const req = httpMock.expectOne('/api/users/1');
    expect(req.request.method).toBe('DELETE');
    req.flush({});
  });
});
```

## Error Handling

### HTTP Errors

```typescript
describe('HTTP Error Handling', () => {
  it('should handle 404 error', (done) => {
    service.getUserById(999).subscribe(
      () => fail('should have errored'),
      (error) => {
        expect(error.status).toBe(404);
        expect(error.statusText).toBe('Not Found');
        done();
      },
    );

    const req = httpMock.expectOne('/api/users/999');
    req.flush('User not found', { status: 404, statusText: 'Not Found' });
  });

  it('should handle 500 error', (done) => {
    service.someRequest().subscribe(
      () => fail('should have errored'),
      (error) => {
        expect(error.status).toBe(500);
        done();
      },
    );

    const req = httpMock.expectOne(/.*$/);
    req.flush(null, { status: 500, statusText: 'Internal Server Error' });
  });

  it('should handle network error', (done) => {
    service.someRequest().subscribe(
      () => fail('should have errored'),
      (error) => {
        expect(error.status).toBe(0);
        done();
      },
    );

    const req = httpMock.expectOne(/.*$/);
    req.error(new ProgressEvent('error'));
  });
});
```

### Observable Error Handling

```typescript
describe('Observable Error Handling', () => {
  it('should emit error and complete', (done) => {
    const error = new Error('Failed to load');

    service.faultyOperation().subscribe(
      () => fail('should have errored'),
      (err) => {
        expect(err.message).toBe('Failed to load');
        done();
      },
    );
  });

  it('should handle error in pipe chain', (done) => {
    service
      .getData$()
      .pipe(
        map((data) => data.property),
        catchError((error) => {
          return of(null);
        }),
      )
      .subscribe((result) => {
        expect(result).toBeNull();
        done();
      });

    const req = httpMock.expectOne(/.*$/);
    req.flush(null, { status: 500, statusText: 'Error' });
  });
});
```

## Testing Observable Operators

### Transformation Operators

```typescript
describe('Transformation Operators', () => {
  it('should map data correctly', (done) => {
    service
      .getUsers$()
      .pipe(map((users) => users.map((u) => u.name)))
      .subscribe((names) => {
        expect(names).toEqual(['John', 'Jane']);
        done();
      });

    const req = httpMock.expectOne('/api/users');
    req.flush([
      { id: 1, name: 'John' },
      { id: 2, name: 'Jane' },
    ]);
  });

  it('should filter data correctly', (done) => {
    service
      .getUsers$()
      .pipe(filter((users) => users.length > 0))
      .subscribe((users) => {
        expect(users.length).toBeGreaterThan(0);
        done();
      });

    const req = httpMock.expectOne('/api/users');
    req.flush([{ id: 1, name: 'John' }]);
  });

  it('should combine operations', (done) => {
    service
      .getUsers$()
      .pipe(
        map((users) => users.filter((u) => u.active)),
        map((users) => users.map((u) => u.name)),
      )
      .subscribe((names) => {
        expect(names).toEqual(['John']);
        done();
      });

    const req = httpMock.expectOne(/.*$/);
    req.flush([
      { id: 1, name: 'John', active: true },
      { id: 2, name: 'Jane', active: false },
    ]);
  });
});
```

## Testing Subjects and State Management

### BehaviorSubject

```typescript
describe('BehaviorSubject', () => {
  it('should emit current value on subscription', (done) => {
    const listener = jest.fn();

    service.currentUser$.subscribe(listener);

    setTimeout(() => {
      expect(listener).toHaveBeenCalledWith({ id: 1, name: 'John' });
      done();
    }, 0);
  });

  it('should emit new values', (done) => {
    const values: any[] = [];

    service.currentUser$.subscribe((user) => {
      values.push(user);
    });

    service.setUser({ id: 2, name: 'Jane' });

    setTimeout(() => {
      expect(values).toContainEqual({ id: 1, name: 'John' }); // Initial
      expect(values).toContainEqual({ id: 2, name: 'Jane' }); // Updated
      done();
    }, 0);
  });
});
```

### ReplaySubject

```typescript
describe('ReplaySubject', () => {
  it('should replay previous values', (done) => {
    const values: any[] = [];

    service.events$.next('event1');
    service.events$.next('event2');

    // Subscribe after events emitted
    service.events$.subscribe((event) => {
      values.push(event);
    });

    setTimeout(() => {
      expect(values).toContain('event1');
      expect(values).toContain('event2');
      done();
    }, 0);
  });
});
```

## Service Method Testing

### Public Methods

```typescript
describe('Public Service Methods', () => {
  it('should process and return data', () => {
    const input = { id: 1, value: 100 };
    const result = service.processData(input);

    expect(result).toEqual({ id: 1, value: 200 });
  });

  it('should call dependency method', () => {
    service.executeOperation();

    expect(myDependency.process).toHaveBeenCalled();
  });

  it('should combine multiple dependencies', () => {
    service.complexOperation();

    expect(myDependency.process).toHaveBeenCalled();
    expect(myDependency.calculate).toHaveBeenCalled();
  });
});
```

### Cache Management

```typescript
describe('Cache Management', () => {
  it('should cache results', () => {
    service.getData$().subscribe();
    service.getData$().subscribe();

    const requests = httpMock.match('/api/data');
    expect(requests.length).toBe(1); // Only one request

    requests[0].flush({ id: 1 });
  });

  it('should invalidate cache', () => {
    service.getData$().subscribe();
    service.invalidateCache();
    service.getData$().subscribe();

    const requests = httpMock.match('/api/data');
    expect(requests.length).toBe(2); // Two requests

    requests.forEach((req) => {
      req.flush({ id: 1 });
    });
  });
});
```

## Testing Service Initialization

### Service Configuration

```typescript
describe('Service Configuration', () => {
  it('should initialize with default config', () => {
    expect(service.config).toEqual(
      expect.objectContaining({
        timeout: 30000,
        retryCount: 3,
      }),
    );
  });

  it('should accept custom configuration', () => {
    const customService = new MyService(httpClient, {
      timeout: 5000,
      retryCount: 1,
    });

    expect(customService.config).toEqual(
      expect.objectContaining({
        timeout: 5000,
        retryCount: 1,
      }),
    );
  });
});
```

## Advanced Testing Patterns

### Retry Logic

```typescript
describe('Retry Logic', () => {
  it('should retry on failure', () => {
    let attemptCount = 0;

    service.retryableCall$().subscribe(
      () => {},
      (error) => {
        expect(attemptCount).toBe(3); // Retried 3 times
      },
    );

    // Simulate failures then success
    let reqs = httpMock.match('/api/data');
    expect(reqs.length).toBe(1);

    reqs[0].flush(null, { status: 500, statusText: 'Error' });
    attemptCount++;

    reqs = httpMock.match('/api/data');
    reqs[0].flush(null, { status: 500, statusText: 'Error' });
    attemptCount++;

    reqs = httpMock.match('/api/data');
    reqs[0].flush({ id: 1 });
  });
});
```

### Timeout Handling

```typescript
describe('Timeout Handling', () => {
  it('should timeout long-running requests', (done) => {
    service.slowRequest$().subscribe(
      () => fail('should have timed out'),
      (error) => {
        expect(error.name).toBe('TimeoutError');
        done();
      },
    );
  });
});
```

### Polling

```typescript
describe('Polling', () => {
  it('should poll at intervals', fakeAsync(() => {
    const listener = jest.fn();

    service.poll$().subscribe(listener);

    tick(1000);
    expect(httpMock.match('/api/data').length).toBe(1);

    tick(1000);
    expect(httpMock.match('/api/data').length).toBe(1);

    tick(1000);
    expect(httpMock.match('/api/data').length).toBe(1);

    service.stopPolling();
  }));
});
```

## HttpTestingController Advanced

### Verify No Outstanding Requests

```typescript
describe('HttpTestingController Usage', () => {
  afterEach(() => {
    // Verify no outstanding requests
    httpMock.verify();
  });

  it('should handle single request', () => {
    service.getData().subscribe();

    const req = httpMock.expectOne('/api/data');
    expect(req.request.method).toBe('GET');
    req.flush({});
  });

  it('should handle multiple requests', () => {
    service.getData().subscribe();
    service.postData({ id: 1 }).subscribe();

    const requests = httpMock.match(/\/api\/data/);
    expect(requests.length).toBe(2);

    requests.forEach((req) => req.flush({}));
  });

  it('should fail if request not made', () => {
    expect(() => {
      const req = httpMock.expectOne('/api/data');
    }).toThrow();
  });

  it('should use match with regex', () => {
    service.getData().subscribe();

    const requests = httpMock.match((req) => {
      return req.url.startsWith('/api/data');
    });

    expect(requests.length).toBe(1);
    requests[0].flush({});
  });
});
```

---

**See Also**: [Jest Patterns Reference](./jest-patterns.md), [Component Testing](./component-testing.md), [Mocking Strategies](./mocking-strategies.md)
