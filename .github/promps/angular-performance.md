# Performance Optimization Standards for Angular

This document outlines the coding standards specifically focused on performance optimization for Angular applications. These standards are designed to improve application speed, responsiveness, and minimize resource usage. They emphasize best practices tailored to the latest version of Angular and aim to help developers write efficient, scalable, and maintainable code.

## 1. Change Detection Optimization

### 1.1. Understanding Change Detection

**Why:** Angular’s change detection mechanism is crucial for updating the view when the application state changes. However, inefficient change detection can lead to significant performance bottlenecks, especially in large and complex applications.

**Do This:**

- Understand the different change detection strategies.

**Don't Do This:**

- Rely solely on the default "ChangeDetectionStrategy.Default" without considering its impact.

### 1.2. Using "OnPush" Change Detection

**Why:** "ChangeDetectionStrategy.OnPush" tells Angular to only check for changes when the input properties of a component change or an event is triggered from within the component. This can drastically reduce the number of change detection cycles.

**Do This:**

- Use "ChangeDetectionStrategy.OnPush" for components with immutable data or when changes are triggered internally.

**Code Example:**

```typescript
import { Component, Input, ChangeDetectionStrategy } from '@angular/core';

@Component({
selector: 'app-data-display',
template: "
<p>Data: {{ data.name }}</p>
",
styleUrls: ['./data-display.component.css'],
changeDetection: ChangeDetectionStrategy.OnPush
})
export class DataDisplayComponent {
@Input() data: { name: string };
}
```

**Don't Do This:**

- Use "OnPush" without understanding its implications, potentially leading to missed updates. For example, if "data" is mutated directly without creating a new object, the component will not update.

**Anti-Pattern:**

```typescript
// Avoid mutating input properties directly with OnPush
this.data.name = 'New Name'; // Component won't update!
```

### 1.3. Detaching and Reattaching Change Detectors

**Why:** In specific scenarios, you might need to detach a component's change detector to prevent updates and reattach it later when updates are required.

**Do This:**

- Use "ChangeDetectorRef" to detach and reattach change detectors when dealing with external events or asynchronous operations.

**Code Example:**

```typescript
import { Component, ChangeDetectorRef, OnInit, OnDestroy } from '@angular/core';

@Component({
selector: 'app-external-data',
template: "
<p>External Data: {{ externalData }}</p>
"
})
export class ExternalDataComponent implements OnInit, OnDestroy {
externalData: string;
intervalId: any;

constructor(private cdr: ChangeDetectorRef) {}

ngOnInit() {
this.cdr.detach(); // Detach the change detector

    this.intervalId = setInterval(() =&gt; {
          this.externalData = 'Updated Data: ' + new Date().toLocaleTimeString();
      this.cdr.detectChanges(); // Manually trigger change detection
    }, 5000);

}

ngOnDestroy() {
clearInterval(this.intervalId);
this.cdr.reattach(); // Reattach when the component is destroyed
}
}
```

**Don't Do This:**

- Detach change detectors without reattaching them, which can lead to a broken UI.

### 1.4. Using Async Pipe

**Why:** The "async" pipe automatically subscribes to an "Observable" or "Promise" and unsubscribes when the component is destroyed, preventing memory leaks and simplifying template logic.

**Do This:**

- Use the "async" pipe for handling asynchronous data in templates.

**Code Example:**

```typescript
import { Component } from '@angular/core';
import { Observable, interval } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
selector: 'app-time-display',
template: "
<p>Current Time: {{ currentTime$ | async }}</p>
"
})
export class TimeDisplayComponent {
currentTime$: Observable = interval(1000).pipe(
map(() =&gt; new Date().toLocaleTimeString())
);
}
```

**Don't Do This:**

- Manually subscribe to "Observables" in the component and update the template directly, leading to potential memory leaks if not properly unsubscribed.

**Anti-Pattern:**

```typescript
// Avoid manual subscriptions
time: string;

ngOnInit() {
interval(1000).subscribe(val =&gt; {
this.time = new Date().toLocaleTimeString(); // Leads to memory leak if not unsubscribed
});
}
```

## 2. Lazy Loading

### 2.1. Route-Based Lazy Loading

**Why:** Loading all modules upfront can significantly increase the initial load time of an application. Route-based lazy loading allows you to load modules only when their corresponding routes are navigated to.

**Do This:**

- Configure route-based lazy loading for feature modules.

**Code Example:**

```typescript
// app-routing.module.ts
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
{
path: 'feature',
loadChildren: () =&gt; import('./feature/feature.module').then(m =&gt; m.FeatureModule)
}
];

@NgModule({
imports: [RouterModule.forRoot(routes)],
exports: [RouterModule]
})
export class AppRoutingModule { }
```

**Don't Do This:**

- Import all modules eagerly in the "AppModule", negating the benefits of lazy loading.

### 2.2. Module-Based Lazy Loading

**Why:** Helps to organize application features into separate modules that can be loaded on demand.

**Do This:**

- Use Angular CLI to generate feature modules and configure lazy loading.

**Code Example:**

```bash
ng generate module feature --route feature --module app.module
```

**Don't Do This:**

- Create large, monolithic modules that contain too many components and services, reducing modularity and load times.

### 2.3. Preloading Strategies

**Why:** Preloading modules in the background after the initial load can improve the user experience by making navigation to lazy-loaded routes faster.

**Do This:**

- Implement preloading strategies (e.g., "PreloadAllModules", "SelectivePreloadingStrategy") to improve navigation speed.

**Code Example:**

```typescript
// app-routing.module.ts
import { NgModule } from '@angular/core';
import { RouterModule, Routes, PreloadAllModules } from '@angular/router';

const routes: Routes = [
{
path: 'feature',
loadChildren: () =&gt; import('./feature/feature.module').then(m =&gt; m.FeatureModule)
}
];

@NgModule({
imports: [RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })],
exports: [RouterModule]
})
export class AppRoutingModule { }
```

**Don't Do This:**

- Use "PreloadAllModules" indiscriminately, especially for large applications with many modules. Consider a custom preloading strategy.

## 3. Optimizing Templates

### 3.1. Reducing DOM Manipulations

**Why:** Frequent and unnecessary DOM manipulations can significantly impact performance. Minimize these operations to improve rendering speed.

**Do This:**

- Use "trackBy" function in "\*ngFor" directives to minimize DOM updates when the underlying data changes.

**Code Example:**

```typescript
import { Component } from '@angular/core';

@Component({
selector: 'app-data-list',
template: "

        {{ item.id }} - {{ item.name }}


"
})
export class DataListComponent {
items = [
{ id: 1, name: 'Item 1' },
{ id: 2, name: 'Item 2' },
{ id: 3, name: 'Item 3' }
];

trackByFn(index: number, item: any): any {
return item.id;
}
}
```

**Don't Do This:**

- Rely on Angular's default change detection in "\*ngFor" without providing a "trackBy" function, leading to unnecessary DOM updates. Without "trackBy", Angular re-renders the entire list even if only one item changes.

### 3.2. Using Pure Pipes

**Why:** Pure pipes are only re-evaluated when their input arguments change. This can improve performance by avoiding unnecessary computations.

**Do This:**

- Use pure pipes for simple transformations that depend only on their input arguments.
- Use impure pipes only when necessary, understanding their performance implications, as they are executed on every change detection cycle.

**Code Example:**

```typescript
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'truncate',
  pure: true,
})
export class TruncatePipe implements PipeTransform {
  transform(value: string, limit: number): string {
    return value.length & gt;
    limit ? value.substring(0, limit) + '...' : value;
  }
}
```

**Template Usage:**

```html
<p>{{ longText | truncate: 50 }}</p>
```

**Don't Do This:**

- Use impure pipes for expensive operations, leading to performance bottlenecks. Impure pipes recalculate on _every_ change detection cycle, even if the input hasn't changed.

### 3.3. Limiting Interpolation Complexity

**Why:** Complex expressions in templates can slow down rendering.

**Do This:**

- Move complex logic from templates to component classes.

**Don't Do This:**

- Embed complex logic and function calls directly in templates that are executed during change detection.

**Anti-Pattern:**

```html
<p>{{ calculateSomethingComplex(item.value) }}</p>
```

Instead, pre-calculate the value in the component:

```typescript
// In the component class
calculatedValue: any;

ngOnInit() {
      this.calculatedValue = this.calculateSomethingComplex(this.item.value);
}
```

```html
<p>{{ calculatedValue }}</p>
```

## 4. Optimizing Data Handling

### 4.1. Using Observables Efficiently

**Why:** Observables are powerful for handling asynchronous data, but improper usage can lead to memory leaks and performance issues.

**Do This:**

- Use appropriate RxJS operators to transform and filter data efficiently.
- Unsubscribe from Observables when components are destroyed to prevent memory leaks. Use "takeUntil" or the "async" pipe.

**Code Example (Using "takeUntil"):**

```typescript
import { Component, OnInit, OnDestroy } from '@angular/core';
import { interval, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
      selector: 'app-data-stream',
  template: "
    <p>Data: {{ data }}</p>
  "
})
export class DataStreamComponent implements OnInit, OnDestroy {
      data: number;
  private destroy$ = new Subject();

  ngOnInit() {
        interval(1000)
      .pipe(takeUntil(this.destroy$))
      .subscribe(val =&gt; {
            this.data = val;
      });
  }

  ngOnDestroy() {
        this.destroy$.next();
    this.destroy$.complete();
  }
}
```

**Don't Do This:**

- Create unnecessary subscriptions to "Observables" that persist after the relevant component is destroyed, causing memory leaks.
- Chain RxJS operators inefficiently, potentially causing performance issues with large datasets.

### 4.2. Immutability

**Why:** Immutability simplifies change detection and improves performance, especially when using "OnPush" change detection.

**Do This:**

- Treat data as immutable and create new objects when modifying data. Avoid directly mutating existing objects.

**Code Example:**

```typescript
// Immutable update
const updatedItem = { ...item, name: 'New Name' }; // creates a new object

// Avoid mutable updates
item.name = 'New Name'; // Mutates the original object
```

**Don't Do This:**

- Mutate data directly, which can make change detection unpredictable and inefficient.

### 4.3. Pagination and Virtualization

**Why:** When dealing with large datasets, rendering all items at once can lead to performance issues.

**Do This:**

- Implement pagination or virtualization (e.g., using "cdk-virtual-scroll") to load and render data in chunks.

**Code Example (Virtual Scrolling with CDK):**

```typescript
import { Component } from '@angular/core';
import { CdkVirtualScrollViewport } from '@angular/cdk/scrolling';

@Component({
      selector: 'app-virtual-scroll-list',
  template: "


        {{i}}: {{item}}


  ",
  styleUrls: ['./virtual-scroll-list.component.css']
})
export class VirtualScrollListComponent {
      items = Array.from({ length: 100000 }).map((_, i) =&gt; "Item #${i}");
}
```

```css
/* virtual-scroll-list.component.css */
.example-viewport {
  height: 200px;
  width: 200px;
  border: 1px solid black;
}

.example-item {
  height: 50px;
}
```

**Don't Do This:**

- Render large lists without pagination or virtualization, leading to slow rendering and poor user experience.

## 5. Optimizing Build and Deployment

### 5.1. Using Ahead-of-Time (AOT) Compilation

**Why:** AOT compilation compiles Angular templates and components during the build process, resulting in smaller bundle sizes and faster startup times.

**Do This:**

- Use AOT compilation in production builds.

**How:** AOT is enabled by default in Angular CLI production builds. Ensure you build for production: "ng build --prod"

**Don't Do This:**

- Rely solely on Just-in-Time (JIT) compilation in production, leading to larger bundle sizes and slower startup times.

### 5.2. Code Splitting

**Why:** Code splitting divides the application into smaller chunks, which can be loaded on demand, reducing the initial load time.

**Do This:**

- Utilize Angular's lazy loading capabilities to split code into separate modules. Modern Angular CLI automatically handles many code-splitting scenarios.

**Don't Do This:**

- Create large, monolithic bundles that contain all application code, increasing initial load time.

### 5.3. Tree Shaking

**Why:** Tree shaking removes unused code from the final bundle, reducing its size.

**Do This:**

- Write code in a way that is tree-shakeable by using ES modules and avoiding side effects. Services should specify "providedIn: 'root'":

```typescript
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class MyService {
  // ...
}
```

**Don't Do This:**

- Include large, unused libraries in the application, increasing bundle size. Also, don't write code that prevents the tree shaker from removing unused code.

### 5.4. Minification and Compression

**Why:** Minification reduces the size of JavaScript, HTML, and CSS files by removing unnecessary characters. Compression (e.g., using Gzip or Brotli) further reduces the size of these files during transfer.

**Do This:**

- Use minification and compression in production builds. Angular CLI handles minification automatically with the "--prod" flag. Configure your server to use Gzip or Brotli compression.

**Don't Do This:**

- Deploy unminified and uncompressed assets to production, leading to increased load times.

## 6. Using Web Workers

### 6.1. Offloading Tasks

**Why:** Some tasks in Angular, such as complex calculations or data transformations, can be resource-intensive and block the main thread, leading to a poor user experience. Web Workers allow you to offload these tasks to a separate thread.

**Do This:**

- Identify CPU-intensive tasks and offload them to Web Workers.

**Code Example:**

```typescript
// my-worker.worker.ts
addEventListener('message', ({ data }) =&gt; {
      const result = performComplexCalculation(data);
  postMessage(result);
});

function performComplexCalculation(data: any): any {
      // Implement the complex calculation logic here
  return data * 2;
}
```

```typescript
// In your component
const worker = new Worker('./my-worker.worker', { type: 'module' });

worker.onmessage = ({ data }) =&gt; {
      console.log("Result from worker: ${data}");
  this.result = data;
  this.cdr.detectChanges(); // Ensure Angular detects the change
};

worker.postMessage(this.inputData);
```

**Don't Do This:**

- Perform all tasks on the main thread, leading to a blocked UI and poor responsiveness. Keep UI-related tasks on the main thread and computationally expensive tasks in web workers.
- Use web workers unnecessarily for simple tasks, as the overhead of communication between threads can outweigh the benefits. Carefully profile your application to identify performance bottlenecks before implementing web workers.

## 7. Profiling and Monitoring

### 7.1. Using Performance Profiling Tools

**Why:** Profiling tools help identify performance bottlenecks in the application.

**Do This:**

- Use tools like Chrome DevTools, Angular DevTools, and Lighthouse to profile the application and identify areas for improvement.

**Don't Do This:**

- Guess at performance issues without using profiling tools, leading to ineffective optimizations.

### 7.2. Monitoring Application Performance

**Why:** Monitoring application performance in production helps identify and address performance issues proactively.

**Do This:**

- Implement monitoring tools to track metrics like page load times, API response times, and error rates.

**Don't Do This:**

- Ignore performance issues in production, leading to a poor user experience.

By adhering to these performance optimization standards, Angular developers can build high-performing, scalable, and maintainable applications that deliver an excellent user experience. Regularly reviewing and updating these standards based on the latest Angular releases and best practices is essential to staying ahead in the ever-evolving world of web development.
