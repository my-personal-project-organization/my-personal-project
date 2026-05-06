# Component Testing Strategies

Comprehensive guide for testing Angular 19 components in  shared libraries.

## Component Test Structure

### Template

```typescript
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { TranslateModule } from '@ngx-translate/core';
import { MyComponent } from './my.component';
import { MyService } from './my.service';

describe('MyComponent', () => {
  let component: MyComponent;
  let fixture: ComponentFixture<MyComponent>;
  let myService: jest.Mocked<MyService>;

  beforeEach(async () => {
    // Create mock service BEFORE TestBed configuration
    const mockMyService = {
      method1: jest.fn(),
      method2: jest.fn(),
      data$: of([]),
    };

    // Configure TestBed
    await TestBed.configureTestingModule({
      imports: [MyComponent, NoopAnimationsModule, TranslateModule.forRoot()],
      providers: [{ provide: MyService, useValue: mockMyService }],
    }).compileComponents();

    // Create component
    fixture = TestBed.createComponent(MyComponent);
    component = fixture.componentInstance;

    // Inject service as typed mock
    myService = TestBed.inject(MyService) as jest.Mocked<MyService>;

    // Initial change detection
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
```

## Testing Input and Output Bindings

### Input Properties

```typescript
describe('Input Bindings', () => {
  it('should accept title input', () => {
    const title = 'Test Title';
    component.title = title;
    fixture.detectChanges();

    expect(component.title).toBe(title);
  });

  it('should use default value when input not provided', () => {
    expect(component.severity).toBe('info'); // Default
  });

  it('should react to input changes', () => {
    component.items = [];
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain('No items');

    component.items = [{ id: 1 }, { id: 2 }];
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).not.toContain('No items');
  });

  it('should accept complex input objects', () => {
    const config = { timeout: 5000, retryCount: 3 };
    component.config = config;
    fixture.detectChanges();

    expect(component.config).toEqual(config);
  });
});
```

### Output Events (EventEmitter)

```typescript
describe('Output Events', () => {
  it('should emit event with payload', () => {
    const emitSpy = jest.spyOn(component.itemSelected, 'emit');
    const item = { id: 1, name: 'Test' };

    component.selectItem(item);

    expect(emitSpy).toHaveBeenCalledWith(item);
  });

  it('should emit event when user clicks button', () => {
    const emitSpy = jest.spyOn(component.submit, 'emit');
    const button = fixture.nativeElement.querySelector('button');

    button.click();

    expect(emitSpy).toHaveBeenCalled();
  });

  it('should emit multiple events in sequence', () => {
    const spy1 = jest.spyOn(component.eventA, 'emit');
    const spy2 = jest.spyOn(component.eventB, 'emit');

    component.executeAction();

    expect(spy1).toHaveBeenCalled();
    expect(spy2).toHaveBeenCalled();
  });
});
```

## Testing Component Methods

### Public Methods

```typescript
describe('Component Methods', () => {
  it('should update internal state when method called', () => {
    component.toggle();

    expect(component.isOpen).toBe(true);

    component.toggle();

    expect(component.isOpen).toBe(false);
  });

  it('should return correct value from method', () => {
    const result = component.calculateTotal([1, 2, 3]);

    expect(result).toBe(6);
  });

  it('should call service method when action triggered', () => {
    component.loadData();

    expect(myService.method1).toHaveBeenCalled();
  });

  it('should handle method with arguments', () => {
    component.filterItems('search-term');

    expect(component.filteredItems).toEqual(
      expect.arrayContaining([expect.objectContaining({ name: expect.stringContaining('search-term') })])
    );
  });
});
```

### Methods with Side Effects

```typescript
describe('Methods with Side Effects', () => {
  it('should update DOM when method called', () => {
    component.show();
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('.modal')).toBeTruthy();

    component.hide();
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('.modal')).toBeFalsy();
  });

  it('should emit event with side effect', () => {
    const spy = jest.spyOn(component.stateChanged, 'emit');
    component.updateData({ name: 'new' });

    expect(spy).toHaveBeenCalledWith(expect.objectContaining({ name: 'new' }));
  });
});
```

## Testing Component Lifecycle

### Component Initialization

```typescript
describe('Component Initialization', () => {
  it('should initialize with correct default values', () => {
    // Don't call detectChanges yet
    expect(component.items).toEqual([]);
    expect(component.isLoading).toBe(false);
  });

  it('should call ngOnInit on creation', () => {
    const spy = jest.spyOn(component, 'ngOnInit');

    // detectChanges calls ngOnInit
    fixture.detectChanges();

    expect(spy).toHaveBeenCalled();
  });

  it('should load data in ngOnInit', () => {
    myService.method1.mockReturnValue(of([{ id: 1 }]));

    fixture.detectChanges();

    expect(component.items).toEqual([{ id: 1 }]);
  });
});
```

### Lifecycle Hooks

```typescript
describe('Lifecycle Hooks', () => {
  it('should execute ngAfterViewInit', () => {
    const spy = jest.spyOn(component, 'ngAfterViewInit');

    fixture.detectChanges();

    expect(spy).toHaveBeenCalled();
  });

  it('should cleanup subscriptions in ngOnDestroy', () => {
    const subscription = component.data$.subscribe();
    const spy = jest.spyOn(subscription, 'unsubscribe');

    component.ngOnDestroy();

    expect(spy).toHaveBeenCalled();
  });

  it('should detect changes in ngAfterViewChecked', () => {
    const spy = jest.spyOn(component, 'ngAfterViewChecked');

    fixture.detectChanges();

    expect(spy).toHaveBeenCalled();
  });
});
```

## Testing Template Interactions

### DOM Queries and Click Events

```typescript
describe('Template Interactions', () => {
  it('should find element by CSS selector', () => {
    component.title = 'Main Title';
    fixture.detectChanges();

    const element = fixture.nativeElement.querySelector('h1');

    expect(element).toBeTruthy();
    expect(element.textContent).toContain('Main Title');
  });

  it('should find multiple elements', () => {
    component.items = [{ id: 1 }, { id: 2 }, { id: 3 }];
    fixture.detectChanges();

    const elements = fixture.nativeElement.querySelectorAll('.item');

    expect(elements.length).toBe(3);
  });

  it('should handle button click in template', () => {
    const spy = jest.spyOn(component, 'onSubmit');
    const button = fixture.nativeElement.querySelector('button[type="submit"]');

    button.click();

    expect(spy).toHaveBeenCalled();
  });

  it('should handle input change in template', () => {
    const input = fixture.nativeElement.querySelector('input') as HTMLInputElement;
    input.value = 'new value';
    input.dispatchEvent(new Event('input'));
    fixture.detectChanges();

    expect(component.value).toBe('new value');
  });
});
```

### ngIf/ngFor Directives

```typescript
describe('Structural Directives', () => {
  it('should show content when condition is true', () => {
    component.showContent = true;
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('.content')).toBeTruthy();
  });

  it('should hide content when condition is false', () => {
    component.showContent = false;
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('.content')).toBeFalsy();
  });

  it('should render list items with ngFor', () => {
    component.items = [
      { id: 1, name: 'Item 1' },
      { id: 2, name: 'Item 2' },
      { id: 3, name: 'Item 3' },
    ];
    fixture.detectChanges();

    const items = fixture.nativeElement.querySelectorAll('.list-item');

    expect(items.length).toBe(3);
    expect(items[0].textContent).toContain('Item 1');
    expect(items[1].textContent).toContain('Item 2');
    expect(items[2].textContent).toContain('Item 3');
  });

  it('should update list when items change', () => {
    component.items = [{ id: 1 }];
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelectorAll('.list-item').length).toBe(1);

    component.items = [{ id: 1 }, { id: 2 }, { id: 3 }];
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelectorAll('.list-item').length).toBe(3);
  });

  it('should show empty state when list is empty', () => {
    component.items = [];
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('.empty-state')).toBeTruthy();
    expect(fixture.nativeElement.querySelectorAll('.list-item').length).toBe(0);
  });
});
```

### Form Interactions

```typescript
describe('Form Interactions', () => {
  it('should update component property when form input changes', () => {
    const input = fixture.nativeElement.querySelector('input[name="email"]');
    input.value = 'test@example.com';
    input.dispatchEvent(new Event('input'));
    fixture.detectChanges();

    expect(component.email).toBe('test@example.com');
  });

  it('should validate form before submission', () => {
    const form = fixture.nativeElement.querySelector('form');
    const submitButton = form.querySelector('button[type="submit"]');

    submitButton.click();

    expect(form.checkValidity()).toBe(false);
  });

  it('should submit form with valid data', () => {
    const spy = jest.spyOn(component, 'onSubmit');
    component.email = 'test@example.com';
    component.password = 'password123';
    fixture.detectChanges();

    const form = fixture.nativeElement.querySelector('form');
    form.dispatchEvent(new Event('submit'));

    expect(spy).toHaveBeenCalled();
  });
});
```

## Testing Change Detection

### OnPush Strategy

```typescript
describe('OnPush Change Detection', () => {
  it('should only detect changes when input changes', () => {
    component.data = { id: 1 };
    fixture.detectChanges();

    const initialText = fixture.nativeElement.textContent;

    // Modifying nested property doesn't trigger CD
    component.data.id = 2;
    fixture.detectChanges(); // Still needed to render

    // Use fixture.detectChanges() when:
    // - Inputs change
    // - Events are triggered
    // - Observables emit
  });

  it('should update view when observable emits', (done) => {
    component.data$ = of({ id: 1 });
    fixture.detectChanges();

    setTimeout(() => {
      expect(fixture.nativeElement.textContent).toContain('1');
      done();
    }, 0);
  });

  it('should handle async observable with OnPush', (done) => {
    component.data$ = of({ id: 1, name: 'Test' }).pipe(delay(100));
    fixture.detectChanges();

    setTimeout(() => {
      fixture.detectChanges();
      expect(fixture.nativeElement.querySelector('.name')).toBeTruthy();
      done();
    }, 150);
  });
});
```

### Manual Change Detection Triggering

```typescript
describe('Manual Change Detection', () => {
  it('should trigger change detection manually', () => {
    component.items = [];
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('.empty-state')).toBeTruthy();

    component.items = [{ id: 1 }];
    fixture.detectChanges(); // Manually trigger

    expect(fixture.nativeElement.querySelector('.empty-state')).toBeFalsy();
  });

  it('should verify component state before detectChanges', () => {
    component.isVisible = true;
    fixture.detectChanges();

    const element = fixture.nativeElement.querySelector('.modal');

    expect(element).toBeTruthy();
  });
});
```

## Testing Async Operations

### Observables and Subscriptions

```typescript
describe('Observable Operations', () => {
  it('should subscribe to observable on init', (done) => {
    myService.method1.mockReturnValue(of({ id: 1, name: 'Test' }));

    fixture.detectChanges();

    setTimeout(() => {
      expect(component.data).toEqual({ id: 1, name: 'Test' });
      done();
    }, 0);
  });

  it('should handle observable stream', (done) => {
    const values = [{ id: 1 }, { id: 2 }, { id: 3 }];
    myService.method1.mockReturnValue(from(values));

    fixture.detectChanges();

    setTimeout(() => {
      expect(component.data).toEqual({ id: 3 });
      done();
    }, 0);
  });

  it('should handle observable error', (done) => {
    const error = new Error('Failed to load');
    myService.method1.mockReturnValue(throwError(() => error));

    fixture.detectChanges();

    setTimeout(() => {
      expect(component.error).toEqual(error);
      done();
    }, 0);
  });
});
```

### Using fakeAsync and tick

```typescript
describe('Fake Timers', () => {
  it('should handle setTimeout with fakeAsync', fakeAsync(() => {
    component.loadData();

    expect(component.isLoading).toBe(true);

    tick(1000);

    expect(component.isLoading).toBe(false);
  }));

  it('should handle multiple timers', fakeAsync(() => {
    component.startSequence();

    tick(500);
    expect(component.step).toBe(1);

    tick(500);
    expect(component.step).toBe(2);

    tick(500);
    expect(component.step).toBe(3);
  }));
});
```

### Using flushMicrotasks

```typescript
describe('Promise Handling', () => {
  it('should handle promise resolution with flushMicrotasks', fakeAsync(() => {
    component.fetchData();

    expect(component.data).toBeUndefined();

    flushMicrotasks();

    expect(component.data).toBeDefined();
  }));
});
```

## Advanced Testing Patterns

### Testing with Dependencies

```typescript
describe('Component with Multiple Dependencies', () => {
  beforeEach(async () => {
    const mocks = {
      serviceA: { getData: jest.fn().mockReturnValue(of([])) },
      serviceB: { processData: jest.fn() },
      serviceC: { save: jest.fn().mockResolvedValue({ success: true }) },
    };

    await TestBed.configureTestingModule({
      imports: [MyComponent],
      providers: [
        { provide: ServiceA, useValue: mocks.serviceA },
        { provide: ServiceB, useValue: mocks.serviceB },
        { provide: ServiceC, useValue: mocks.serviceC },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(MyComponent);
    component = fixture.componentInstance;
  });

  it('should orchestrate service calls', () => {
    fixture.detectChanges();

    expect(component.data).toBeDefined();
  });
});
```

### Testing Projection Content

```typescript
describe('Content Projection', () => {
  it('should render projected content', () => {
    // Create host component to test projection
    @Component({
      template: `
        <shared-ui-card>
          <p>Project this content</p>
        </shared-ui-card>
      `,
      standalone: true,
      imports: [CardComponent],
    })
    class HostComponent {}

    const hostFixture = TestBed.createComponent(HostComponent);
    hostFixture.detectChanges();

    const projected = hostFixture.nativeElement.querySelector('p');
    expect(projected.textContent).toContain('Project this content');
  });
});
```

### Testing Template Reference Variables

```typescript
describe('Template Reference Variables', () => {
  it('should access template reference variable', () => {
    fixture.detectChanges();

    const input = fixture.componentInstance.myInput.nativeElement as HTMLInputElement;

    expect(input).toBeTruthy();
  });

  it('should interact with template ref element', () => {
    fixture.detectChanges();

    const button = fixture.componentInstance.submitBtn.nativeElement;
    button.click();

    expect(component.submitted).toBe(true);
  });
});
```

## Snapshot Testing

```typescript
describe('Snapshot Tests', () => {
  it('should render component correctly', () => {
    component.items = [{ id: 1, name: 'Item 1' }];
    fixture.detectChanges();

    expect(fixture.nativeElement.innerHTML).toMatchSnapshot();
  });

  it('should match state snapshot', () => {
    component.loadData();

    expect(component.state).toMatchSnapshot();
  });
});
```

---

**See Also**: [Jest Patterns Reference](./jest-patterns.md), [Mocking Strategies](./mocking-strategies.md)
