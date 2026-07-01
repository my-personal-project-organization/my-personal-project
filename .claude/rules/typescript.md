---
name: typescript
description: TypeScript strict mode and type safety standards - no any, required explicit types, Zod for runtime validation
---

# TypeScript Strictness

## Strict Mode

`tsconfig.json` has `strict: true`, which enables:

```json
{
  "compilerOptions": {
    "strict": true,
    // Equivalent to:
    "noImplicitAny": true,
    "strictNullChecks": true,
    "strictFunctionTypes": true,
    "strictBindCallApply": true,
    "strictPropertyInitialization": true,
    "noImplicitThis": true,
    "alwaysStrict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noImplicitReturns": true,
    "noFallthroughCasesInSwitch": true,
    "esModuleInterop": true
  }
}
```

## No `any` Policy

**Rule**: Do not use `any` type. Use explicit types or `unknown` when type is truly dynamic.

### ✅ Good
```typescript
function process(data: unknown): void {
  if (typeof data === 'string') {
    console.log(data.toUpperCase());
  }
}

function getId(item: { id: string }): string {
  return item.id;
}

const items: string[] = ['a', 'b', 'c'];
```

### ❌ Bad
```typescript
function process(data: any): void {
  // Silently allows any operation; defeats type checking
  console.log(data.unknownMethod());
}

const items: any[] = ['a', 'b', 'c']; // Should be string[]
```

### Exception: Framework Internals

Rarely, Angular or third-party libraries may require `any` in their public API. If unavoidable, flag it with `@ts-expect-error`:

```typescript
// @ts-expect-error: Framework doesn't type this deeply nested config
const config: any = require('some-framework-config.json');
```

Add a comment explaining why. Avoid `@ts-ignore` (too broad; `@ts-expect-error` is preferred).

## Typing Patterns

### Function Arguments and Return Types

Always explicit:

```typescript
function greet(name: string, age: number): string {
  return `Hello, ${name}!`;
}

// Arrow functions
const add = (a: number, b: number): number => a + b;

// Optional parameters
function fetch(url: string, timeout?: number): Promise<Response> { }

// Default values can infer type
function retry(count: number = 3): void { }
```

### Object Types

Use interfaces or types for reusable object shapes:

```typescript
interface User {
  id: string;
  name: string;
  email: string;
  role?: 'admin' | 'user'; // Optional
}

type ApiResponse<T> = {
  data: T;
  status: number;
  message?: string;
};

const user: User = {
  id: '123',
  name: 'John',
  email: 'john@example.com',
};

const response: ApiResponse<User> = {
  data: user,
  status: 200,
};
```

### Generics

Use generics for reusable logic:

```typescript
function first<T>(arr: T[]): T | undefined {
  return arr[0];
}

class Store<T> {
  private items: T[] = [];
  add(item: T): void {
    this.items.push(item);
  }
}

const userStore = new Store<User>();
userStore.add(user);
```

### Union and Intersection Types

```typescript
// Union: value can be one of these types
type Status = 'pending' | 'success' | 'error';
type ID = string | number;

// Intersection: must satisfy all types
type AdminUser = User & { permissions: string[] };

// Discriminated union (preferred for complex unions)
type Result<T> =
  | { status: 'success'; data: T }
  | { status: 'error'; error: Error };
```

### Readonly and Immutability

Use `readonly` for immutable collections:

```typescript
interface Config {
  readonly apiUrl: string;
  readonly timeout: number;
}

const settings: readonly string[] = ['a', 'b', 'c'];
// settings[0] = 'x'; // ❌ Compile error

function process(items: ReadonlyArray<Item>): void {
  // items.push(...); // ❌ Type error
}
```

## Null and Undefined Safety

With `strictNullChecks`, `null` and `undefined` are explicit:

```typescript
let name: string = 'John';
// name = null; // ❌ Type error

let optionalName: string | null = null;
// optionalName.toUpperCase(); // ❌ Type error

// Use optional chaining and nullish coalescing
const upper = optionalName?.toUpperCase() ?? 'UNKNOWN';

// Type guards
function greet(name: string | null): void {
  if (name !== null) {
    console.log(name.toUpperCase());
  }
}
```

## Async / Promises

Always type Promises and async functions:

```typescript
async function fetchUser(id: string): Promise<User> {
  const response = await fetch(`/api/users/${id}`);
  return response.json();
}

const p: Promise<number> = new Promise(resolve => {
  resolve(42);
});

// Type async generators
async function* paginate<T>(ids: string[]): AsyncGenerator<T[]> {
  for (const id of ids) {
    yield await fetchUser(id) as T[];
  }
}
```

## Runtime Validation with Zod

TypeScript types exist only at compile time. For user input or external data, use **Zod** for runtime validation:

```typescript
import { z } from 'zod';

// Define schema
const UserSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1),
  email: z.string().email(),
  age: z.number().int().gte(0).optional(),
});

// Infer TypeScript type from schema
type User = z.infer<typeof UserSchema>;

// Validate at runtime
const data = await response.json();
try {
  const user: User = UserSchema.parse(data);
  // TypeScript now knows user is valid User
} catch (error) {
  console.error('Invalid user data:', error.errors);
}

// Or use .safeParse() for error handling without exceptions
const result = UserSchema.safeParse(data);
if (result.success) {
  const user = result.data;
} else {
  console.error(result.error.flatten());
}
```

### Zod Patterns in Angular

In HTTP services:

```typescript
import { HttpClient } from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class ArticleService {
  private readonly http = inject(HttpClient);

  private readonly articleSchema = z.object({
    id: z.string(),
    title: z.string(),
    body: z.string(),
  });

  getArticle(id: string): Observable<z.infer<typeof this.articleSchema>> {
    return this.http.get<unknown>(`/api/articles/${id}`).pipe(
      map(data => this.articleSchema.parse(data))
    );
  }
}
```

## Type Inference

Let TypeScript infer types where obvious:

```typescript
// ✅ Good: infer array type from content
const numbers = [1, 2, 3]; // inferred as number[]

// ❌ Unnecessary: explicit when obvious
const numbers: number[] = [1, 2, 3];

// ✅ Good: infer function return from return statement
function add(a: number, b: number) {
  return a + b; // return type inferred as number
}

// ⚠️ Sometimes explicit is better (e.g., for public APIs)
function fetchUser(id: string): Promise<User> {
  // Explicit return type documents the contract
}
```

## Common Patterns

### Assertion Functions

For type narrowing:

```typescript
function assertIsString(value: unknown): asserts value is string {
  if (typeof value !== 'string') {
    throw new TypeError('Expected string');
  }
}

let name: unknown = 'John';
assertIsString(name);
console.log(name.toUpperCase()); // ✅ TS now knows name is string
```

### Type Predicates

For filtering and type guards:

```typescript
function isUser(obj: any): obj is User {
  return obj && typeof obj.id === 'string' && typeof obj.name === 'string';
}

const items: unknown[] = getItems();
const users = items.filter(isUser); // Type narrowed to User[]
```

### Never Type

For exhaustiveness checks:

```typescript
type Status = 'pending' | 'success' | 'error';

function handleStatus(status: Status): string {
  switch (status) {
    case 'pending':
      return 'Loading...';
    case 'success':
      return 'Done!';
    case 'error':
      return 'Failed';
    default:
      const _exhaustive: never = status; // TS error if status case missed
      return _exhaustive;
  }
}
```

## Linting

ESLint enforces these rules with `@typescript-eslint` plugins. Run:

```bash
npm run lint
# or
nx lint <lib>
```

Common violations:
- `@typescript-eslint/no-explicit-any` — catches `any` usage
- `@typescript-eslint/explicit-function-return-types` — requires return types on public functions
- `@typescript-eslint/no-unused-vars` — caught by `noUnusedLocals` in tsconfig
