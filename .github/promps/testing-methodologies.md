# Testing Methodologies Standards for Angular

This document outlines the standards for testing Angular applications. It covers unit, integration, and end-to-end testing strategies, focusing on Angular-specific considerations and modern best practices using the latest Angular version. Adhering to these standards will improve code quality, maintainability, and reliability.

## 1. General Testing Principles

- **DO** prioritize writing tests _before_ or _concurrently_ with code implementation (Test-Driven Development or Behavior-Driven Development).
  - **WHY:** This helps define clear requirements and ensures code is testable from the beginning.
- **DO** strive for high test coverage (80% or higher). Use code coverage tools to measure effectiveness.
  - **WHY:** High coverage reduces the risk of undetected bugs and facilitates refactoring.
- **DO** keep tests focused and concise. Each test should ideally cover only one specific scenario.
  - **WHY:** Easier debugging and maintenance of tests.
- **DO** use descriptive test names that clearly indicate what the test is verifying.
  - **WHY:** Improves readability and understanding of test results.
- **DO** ensure tests are isolated and independent. Each test should set up its own necessary state and clean up afterward.
  - **WHY:** Avoids cascading failures and makes debugging easier.
- **DON'T** write tests that are brittle and sensitive to minor code changes.
  - **WHY:** Reduces the cost of maintaining tests. Focus on testing behavior, not implementation details.
- **DON'T** skip writing tests for edge cases or error conditions.
  - **WHY:** Critical for demonstrating that the code handles various situations correctly.

## 2. Unit Testing

Unit tests verify the functionality of individual components, services, pipes, and other isolated units of code.

### 2.1. Frameworks and Libraries

- **DO** Using Jest, especially for larger projects that can benefit from its speed and features. Configure it properly for Angular using tools like "jest-preset-angular".
  - **WHY:** Jest offers features like snapshot testing, parallel test execution, and built-in mocking, improving testing speed and developer experience.
- **DO** use "TestBed" for configuring and creating Angular test environments. Leverage its features for dependency injection and component compilation.
  - **WHY:** "TestBed" simplifies the process of setting up test environments and provides control over dependencies.
- **DO** use mocking libraries like "ng-mocks" or "jest.fn()" to isolate units of code and control dependencies.
  - **WHY:** Mocking allows you to focus on testing the specific unit of code without relying on external dependencies or real data.

### 2.2. Component Testing

- **DO** use "TestBed.createComponent()" to create component instances in tests.
  - **WHY:** Provides a consistent way to create and manage component instances in tests.
- **DO** use "DebugElement" API to interact with component elements, access properties, and trigger events.
  - **WHY:** "DebugElement" provides type safety and better control over the component's DOM structure during testing.
- **DO** use fixture methods (e.g., "detectChanges()", "whenStable()") to manage the component's lifecycle and ensure proper rendering.
  - **WHY:** Ensures that the component's state is synchronized with the DOM during testing.
- **DO** test component inputs ("@Input()") and outputs ("@Output()") to verify proper data binding and event handling.
- **DO** use fakeAsync and tick to fully test asynchronous code such as "setTimeout" and RxJS observables within your Angular components.
- **DON'T** directly manipulate the component's DOM using native JavaScript methods.
  - **WHY:** Use "DebugElement" for type safety and Angular-specific features.

**Example:**

```typescript
// src/app/components/greeting/greeting.component.ts
import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';

@Component({
      selector: 'app-greeting',
  template: "<p>{{ greetingMessage }}</p>
             Click Me",
  styleUrls: ['./greeting.component.css']
})
export class GreetingComponent implements OnInit {

      @Input() name: string = 'World';
  @Output() buttonClicked = new EventEmitter();
  greetingMessage: string = '';

  ngOnInit(): void {
        this.greetingMessage = "Hello, ${this.name}!";
  }

  onButtonClick() {
        this.buttonClicked.emit("Button was clicked by ${this.name}");
  }
}
```

```typescript
// src/app/components/greeting/greeting.component.spec.ts
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { GreetingComponent } from './greeting.component';
import { DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';

describe('GreetingComponent', () =&gt; {
      let component: GreetingComponent;
  let fixture: ComponentFixture;
  let debugElement: DebugElement;

  beforeEach(async () =&gt; {
        await TestBed.configureTestingModule({
          declarations: [ GreetingComponent ]
    })
    .compileComponents();
  });

  beforeEach(() =&gt; {
        fixture = TestBed.createComponent(GreetingComponent);
    component = fixture.componentInstance;
    debugElement = fixture.debugElement;
    fixture.detectChanges(); // initial data binding
  });

  it('should create', () =&gt; {
        expect(component).toBeTruthy();
  });

  it('should display the correct greeting message with input name', () =&gt; {
        component.name = 'Test User';
    component.ngOnInit(); // Call ngOnInit manually after setting the input
    fixture.detectChanges();
    const paragraphElement: HTMLElement = debugElement.query(By.css('p')).nativeElement;
    expect(paragraphElement.textContent).toContain('Hello, Test User!');
  });

  it('should emit the buttonClicked event when the button is clicked', () =&gt; {
        let emittedValue: string | null = null;
    component.buttonClicked.subscribe(value =&gt; emittedValue = value);

    const buttonElement: HTMLElement = debugElement.query(By.css('button')).nativeElement;
    buttonElement.click();

    expect(emittedValue).toBe('Button was clicked by World');
  });
});
```

### 2.3. Service Testing

- **DO** isolate service dependencies using mocking or spies.
- **DO** test service methods with different input parameters and verify the expected output or side effects.
- **DO** use RxJS marble testing ("TestScheduler") for testing asynchronous operations and streams within services.

**Example:**

```typescript
// src/app/services/data.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
      providedIn: 'root'
})
export class DataService {

      constructor(private http: HttpClient) {}

  getData(): Observable {
        return this.http.get('https://api.example.com/data')
      .pipe(
            catchError(this.handleError('getData', []))
      );
  }
   /**
   * Handle Http operation that failed.
   * Let the app continue.
   * @param operation - name of the operation that failed
   * @param result - optional value to return as the observable result
   */
  private handleError(operation = 'operation', result?: T) {
        return (error: any): Observable =&gt; {

          // TODO: send the error to remote logging infrastructure
      console.error(error); // log to console instead

      // TODO: better job of transforming error for user consumption
      console.log("${operation} failed: ${error.message}");

      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }
}
```

```typescript
// src/app/services/data.service.spec.ts
import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { DataService } from './data.service';
import { of } from 'rxjs';

describe('DataService', () =&gt; {
      let service: DataService;
  let httpTestingController: HttpTestingController;

  beforeEach(() =&gt; {
        TestBed.configureTestingModule({
          imports: [HttpClientTestingModule],
      providers: [DataService]
    });

    service = TestBed.inject(DataService);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  afterEach(() =&gt; {
        httpTestingController.verify(); // Ensure that there are no outstanding requests.
  });

  it('should be created', () =&gt; {
        expect(service).toBeTruthy();
  });

  it('should return data from the API', () =&gt; {
        const mockData = [{ id: 1, name: 'Item 1' }, { id: 2, name: 'Item 2' }];

    service.getData().subscribe(data =&gt; {
          expect(data).toEqual(mockData);
    });

    const req = httpTestingController.expectOne('https://api.example.com/data');
    expect(req.request.method).toBe('GET');
    req.flush(mockData); // Provide mock response
  });

  it('should handle errors and return a default value', () =&gt; {
        const mockError = new ErrorEvent('Network error', {
          message: 'Simulated network error',
    });

    service.getData().subscribe(
          data =&gt; {
            expect(data).toEqual([]); // Expect default value
      },
      error =&gt; {
            fail('Expected an error to be caught and a default value returned.');
      }
    );

    const req = httpTestingController.expectOne('https://api.example.com/data');
    req.error(mockError);
  });
});
```

### 2.4. Pipe Testing

- **DO** test the "transform" method of pipes with different input values and verify the expected output.

**Example:**

```typescript
// src/app/pipes/truncate.pipe.ts
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
      name: 'truncate'
})
export class TruncatePipe implements PipeTransform {

      transform(value: string, limit: number = 10, trail: string = '...'): string {
        if (!value) return '';
    if (value.length &lt;= limit) {
          return value;
    }
    return value.substring(0, limit) + trail;
  }

}
```

```typescript
// src/app/pipes/truncate.pipe.spec.ts
import { TruncatePipe } from './truncate.pipe';

describe('TruncatePipe', () =&gt; {
      let pipe: TruncatePipe;

  beforeEach(() =&gt; {
        pipe = new TruncatePipe();
  });

  it('should create an instance', () =&gt; {
        expect(pipe).toBeTruthy();
  });

  it('should truncate the string to the specified limit with default trail', () =&gt; {
        const value = 'This is a long string';
    const result = pipe.transform(value, 10);
    expect(result).toBe('This is a l...');
  });

  it('should truncate the string to the specified limit with custom trail', () =&gt; {
        const value = 'This is a long string';
    const result = pipe.transform(value, 10, '[...]');
    expect(result).toBe('This is a l[...]');
  });

  it('should return the original string if it is shorter than the limit', () =&gt; {
        const value = 'Short';
    const result = pipe.transform(value, 10);
    expect(result).toBe('Short');
  });

  it('should return an empty string if the input is null or undefined', () =&gt; {
        expect(pipe.transform(null)).toBe('');
    expect(pipe.transform(undefined)).toBe('');
  });

});
```

## 3. Integration Testing

Integration tests verify the interaction between different units or modules of code. In Angular, this typically involves testing the interaction between components, services, and modules.

- **DO** use "TestBed" to create integration test environments that include multiple components and services.
- **DO** use dependency injection to provide mock or stub implementations of dependencies during integration testing.
- **DO** focus on testing the flow of data and events between different parts of the application.
- **DO** test component interactions using "@Output()" and EventEmitters.
- **DO** mock services to avoid making real HTTP requests or accessing external resources.
- **DON'T** test individual units of code in isolation during integration testing. This is the role of unit tests.

**Example:**

```typescript
// src/app/components/parent/parent.component.ts
import { Component } from '@angular/core';

@Component({
      selector: 'app-parent',
  template: "
    Parent Component

    <p>Message from child: {{ messageFromChild }}</p>
  "
})
export class ParentComponent {
      messageFromChild: string = '';

  handleMessage(message: string) {
        this.messageFromChild = message;
  }
}
```

```typescript
// src/app/components/child/child.component.ts
import { Component, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-child',
  template: 'Send Message',
})
export class ChildComponent {
  @Output() messageEvent = new EventEmitter();

  sendMessage() {
    this.messageEvent.emit('Hello from child!');
  }
}
```

```typescript
// src/app/components/parent/parent.component.spec.ts
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ParentComponent } from './parent.component';
import { ChildComponent } from '../child/child.component';
import { DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';

describe('ParentComponent Integration Test', () =&gt; {
      let component: ParentComponent;
  let fixture: ComponentFixture;
  let debugElement: DebugElement;

  beforeEach(async () =&gt; {
        await TestBed.configureTestingModule({
          declarations: [ParentComponent, ChildComponent]
    }).compileComponents();
  });

  beforeEach(() =&gt; {
        fixture = TestBed.createComponent(ParentComponent);
    component = fixture.componentInstance;
    debugElement = fixture.debugElement;
    fixture.detectChanges();
  });

  it('should create', () =&gt; {
        expect(component).toBeTruthy();
  });

  it('should receive message from child component when button is clicked', () =&gt; {
        const childComponentDE: DebugElement = debugElement.query(By.directive(ChildComponent));
    const childComponent = childComponentDE.componentInstance;
    const button: HTMLElement = childComponentDE.query(By.css('button')).nativeElement;

    button.click();
    fixture.detectChanges();

    expect(component.messageFromChild).toBe('Hello from child!');
    const messageParagraph: HTMLElement = debugElement.query(By.css('p')).nativeElement;
    expect(messageParagraph.textContent).toContain('Hello from child!');

  });
});
```

## 4. End-to-End (E2E) Testing

E2E tests verify the functionality of the entire application, including the user interface, back-end services, and database.

### 4.1. Frameworks and Libraries

- **DO** use Cypress or Playwright for E2E testing Angular applications.
  - **WHY:** These tools provide a modern, reliable, and developer-friendly approach to E2E testing. They offer features like automatic waiting, time-travel debugging, and cross-browser support.
- **DO** consider using Protractor only for existing projects as it's deprecated. New projects must prefer Cypress or Playwright
  - **WHY:** Protractor, while historically popular, is no longer under active development and has been superseded by newer, more efficient tools.

### 4.2. Test Strategy

- **DO** focus on testing critical user flows and scenarios.
- **DO** use page object patterns to encapsulate UI elements and interactions. This encapsulates UI element locators and interactions within reusable page object classes.
  - **WHY:** Improves test maintainability and reduces code duplication.
- **DO** use environment variables and configuration files to manage test data and environment settings.
- **DO** run E2E tests in a continuous integration environment to ensure application quality.
- **DO** aim to create tests covering the main user journeys, such as login, navigation, data creation and modification, complex workflows, form submissions, and error handling.
- **DON'T** make assertions about the application state by peeking into the database. E2E tests should function the same way a user would: interact with the UI.

**Example (Cypress):**

```javascript
// cypress/e2e/login.cy.ts
describe('Login Flow', () =&gt; {
      it('should successfully log in with valid credentials', () =&gt; {
        cy.visit('/login'); // Assuming /login is the login page URL

    cy.get('input[name="username"]').type('testuser');
    cy.get('input[name="password"]').type('password123');

    cy.get('button[type="submit"]').click();

    cy.url().should('include', '/dashboard'); // Verify URL after login
    cy.contains('Welcome, testuser!').should('be.visible'); // Verify welcome message
  });

  it('should display an error message with invalid credentials', () =&gt; {
        cy.visit('/login');

    cy.get('input[name="username"]').type('invaliduser');
    cy.get('input[name="password"]').type('wrongpassword');

    cy.get('button[type="submit"]').click();

    cy.contains('Invalid username or password').should('be.visible'); // Verify error message
  });
});
```

```javascript
// cypress/support/commands.js (Example of a custom command)
Cypress.Commands.add('login', (username, password) =&gt; {
      cy.visit('/login');
  cy.get('input[name="username"]').type(username);
  cy.get('input[name="password"]').type(password);
  cy.get('button[type="submit"]').click();
  cy.url().should('include', '/dashboard');
});

//Example usage:
describe('Dashboard Tests', () =&gt; {
      it('should display user data', () =&gt; {
        cy.login('testuser', 'password123');
    cy.visit('/dashboard');
    cy.contains('User Profile').should('be.visible');
  });
});
```

```javascript
// cypress/pages/LoginPage.js (Example of Page Object Model)
class LoginPage {
      visit() {
        cy.visit('/login');
  }

  fillUsername(username) {
        cy.get('input[name="username"]').type(username);
  }

  fillPassword(password) {
        cy.get('input[name="password"]').type(password);
  }

  submit() {
        cy.get('button[type="submit"]').click();
  }

  verifyLoginSuccess() {
          cy.url().should('include', '/dashboard');
      cy.contains('Welcome').should('be.visible');
  }

  verifyLoginFailure() {
          cy.contains('Invalid credentials').should('be.visible');
  }
}

export default new LoginPage();

// Usage in the test:
import LoginPage from '../pages/LoginPage';

describe('Login Tests with Page Object Model', () =&gt; {
        it('should log in successfully', () =&gt; {
            LoginPage.visit();
        LoginPage.fillUsername('testuser');
        LoginPage.fillPassword('password123');
        LoginPage.submit();
        LoginPage.verifyLoginSuccess();
    });

    it('should fail login with invalid credentials', () =&gt; {
            LoginPage.visit();
        LoginPage.fillUsername('invaliduser');
        LoginPage.fillPassword('wrongpassword');
        LoginPage.submit();
        LoginPage.verifyLoginFailure();
    });
});
```

## 5. Accessibility Testing

- **DO** incorporate accessibility testing into your testing strategy to ensure your application is usable by people with disabilities.
- **DO** use tools like "axe-core" (available for both unit and E2E testing) to automatically detect accessibility issues.
- **DO** manually test your application using assistive technologies like screen readers to verify the user experience.
- **DO** follow accessibility guidelines and standards like WCAG (Web Content Accessibility Guidelines).

**Example (using axe-core in Cypress):**

```javascript
// cypress/e2e/accessibility.cy.ts
import 'cypress-axe';

describe('Accessibility Tests', () =&gt; {
      it('should run axe on the entire page', () =&gt; {
        cy.visit('/'); // Replace '/' with the URL of your page
    cy.injectAxe();
    cy.checkA11y(); // Checks the entire page for accessibility violations
  });
});
```

## 6. Performance Testing

- **DO** use performance testing tools to identify and address performance bottlenecks in your application.
- **DO** use tools like Lighthouse (integrated into Chrome DevTools) to measure performance metrics like First Contentful Paint (FCP), Largest Contentful Paint (LCP), and Cumulative Layout Shift (CLS).
- **DO** use tools like WebPageTest (webpagetest.org) for more in-depth analysis of page load performance.
- **DO** load test APIs and backend services using tools like JMeter or Gatling to identify performance bottlenecks under high load.
- **DO** continuously monitor application performance in production using tools like New Relic or Datadog.
- **DO** pay attention to optimization techniques such as code splitting, lazy loading, image optimization, and caching.

By adhering to these testing methodologies, teams can deliver robust, reliable, and maintainable Angular applications. The specific tools and frameworks used may vary depending on the project's requirements and team preferences, but the underlying principles remain consistent.
