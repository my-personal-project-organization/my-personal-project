# Mario Personal Project

This project is a personal portfolio and article-sharing platform built with Angular, Nx, NgRx Signals, Firestore, and Tailwind CSS.

You can check the project in the next URL:
**https://my-personal-project-7c70d.web.app**

It consists of two main sections:

- **CV/History:** A personal portfolio showcasing skills, experience, and projects.
- **Scribo:** An article-sharing platform where users can create, read, update, and delete articles.

## Features

- **User Authentication:** Secure user authentication using Firebase Authentication with GitHub.
- **Real-time Data:** Utilizes Firestore for real-time data synchronization.
- **State Management:** NgRx Signals provides efficient and predictable state management.
- **Data Validation:** Zod is used for robust schema validation, ensuring data integrity.
- **Responsive UI:** Tailwind CSS provides a responsive and visually appealing user interface.
- **Modular Architecture:** The project is structured as an Nx monorepo, promoting code reusability and maintainability.
- **CRUD Operations:** Full Create, Read, Update, and Delete functionality for both CV/Portfolio data and Scribo articles.
- **User Roles (Potentially):** The foundation is laid for implementing role-based access control (e.g., admin users).
- **Dark Mode:** Tailwind dark mode support.
- **Component Documentation:** Storybook is used for documenting components, including interaction tests.
- **Visual Regression Testing:** Chromatic is integrated for visual regression testing.
- **End-to-End Testing:** Playwright is used for comprehensive end-to-end testing.

## Technologies Used

- [Angular](https://angular.io/) (v19+) - Frontend framework
- [Nx](https://nx.dev/) - Monorepo build system
- [NgRx Signals](https://ngrx.io/guide/signals) - State management
- [Firebase](https://firebase.google.com/) - Backend services (Authentication, Firestore)
- [AngularFire](https://github.com/angular/angularfire) - Official Angular library for Firebase
- [Zod](https://zod.dev/) - Schema validation
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS framework
- [Jest](https://jestjs.io/) - Testing framework
- [Playwright](https://playwright.dev/) - End-to-end testing (configured, but not fully implemented in the provided code)
- [Storybook](https://storybook.js.org/) - Component documentation and interaction testing
- [ESLint](https://eslint.org/) - Linting
- [RxJs](https://rxjs.dev/) - Reactive Extensions for JavaScript

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes.

**Prerequisites:**

- [Node.js](https://nodejs.org/) (LTS version recommended)
- [npm](https://www.npmjs.com/) or [Yarn](https://yarnpkg.com/) or [pnpm](https://pnpm.io/)
- [Angular CLI](https://cli.angular.io/) (`npm install -g @angular/cli`)
- [Nx CLI](https://nx.dev/getting-started/installation) (`npm install -g nx`)
- A Firebase project with Firestore and Authentication (GitHub provider) enabled.
- A GitHub account (for OAuth app creation).

**Installation:**

1.  **Clone the repository:**

    ```bash
    git clone https://github.com/my-personal-project-organization/my-personal-project.git
    cd my-personal-project
    ```

2.  **Install dependencies:**

    ```bash
    npm install
    ```

3.  **Configure Firebase:**

    - If you run the project automatically it will create a file `src/environments/environment.ts` (and `src/environments/environment.prod.ts` for production).
    - Add your Firebase configuration to these files:

      ```typescript
      // src/environments/environment.ts
      export const environment = {
        production: false,
        firebase: {
          apiKey: 'YOUR_API_KEY',
          authDomain: 'YOUR_AUTH_DOMAIN',
          projectId: 'YOUR_PROJECT_ID',
          storageBucket: 'YOUR_STORAGE_BUCKET',
          messagingSenderId: 'YOUR_MESSAGING_SENDER_ID',
          appId: 'YOUR_APP_ID',
          measurementId: 'YOUR_MEASUREMENT_ID', // Optional
        },
      };
      ```

      Replace the placeholder values with your actual Firebase project configuration from the Firebase console (Project settings -> General -> Your apps -> Web app -> Config).

4.  **Run the application:**

    ```bash
    npm start
    ```

    The application will be available at `http://localhost:4200` (or a different port if 4200 is in use).

5.  **Run tests**

    ```bash
    npm run run-before-pr     # Full pre-PR validation (lint, test, build, e2e on affected)
    npx nx run cv/feature-about:test   # Run CV feature tests
    npx nx run scribo/data-access:test # Run Scribo state management tests
    npx nx run my-personal-project-e2e:e2e  # Run E2E tests
    ```

    To simplify running tasks, it is recommended to use the Nx Console, a powerful UI for managing Nx workspaces. Nx Console is available as a Visual Studio Code extension, allowing you to easily run, debug, and explore tasks without needing to memorize CLI commands. You can install it from the [Visual Studio Code Marketplace](https://marketplace.visualstudio.com/items?itemName=nrwl.angular-console).

    Once installed, you can access Nx Console directly from the VS Code sidebar, where you can select and execute tasks such as building, serving, testing, or linting specific apps or libraries in your workspace.

6.  **Understand the Pipelines**

    The project uses GitHub Actions for CI/CD pipelines. These pipelines automate tasks such as linting, testing, building, and deploying the application. Below is an overview of the key pipelines:

    - **Linting:** Ensures code quality and consistency using ESLint.
    - **Unit Testing:** Runs unit tests using Jest to verify the functionality of individual components and services.
    - **End-to-End Testing:** Executes Playwright tests to validate the application's behavior in a browser environment.
    - **Build and Deploy:** Builds the application using Angular AOT and deploys it to the configured hosting environment.
    - **Chromatic Visual Regression Testing:** Chromatic is integrated to ensure visual consistency across UI components. It captures snapshots of your Storybook stories and compares them against the baseline to detect unintended visual changes. The pipeline is triggered on every push.

    You can find the pipeline configurations in the `.github/workflows/` directory. To trigger these pipelines, push your changes to the repository or create a pull request.

## Project Structure

This project is organized as an Nx monorepo, containing multiple applications and libraries. Below is an overview of the structure:

### Applications (`apps/`)

- **my-personal-project/**: Main Angular application combining CV/Portfolio and Scribo article platform.
- **my-personal-project-e2e/**: End-to-end tests using Playwright.

### Libraries (`libs/`)

#### Shared Libraries (`shared/`)

- **ui/**: Reusable UI components (Storybook-documented, standalone Angular 19 components).
  - ToastContainer, dialogs, and other shared components
  - Tailwind CSS styling with dark mode support
  - Icon library
- **data-access/**: Shared data access layer
  - `AuthGuard` and route protection guards
  - Global services (Firebase integration, API clients)
  - Shared models and types
  - Global state management
- **util-error/**: Global error handling
  - `GlobalErrorHandler` service provider
  - Error UI utilities
- **util-translation/**: i18n utilities
  - `loadAppTranslations()` function for loading locale translations
  - Support for `en-US` (default) and `es` (Spanish)
- **utils/**: General utility functions
  - Helper functions, validators, formatters

#### CV-Specific Libraries (`cv/`)

- **feature-about/**: About/CV landing page component with resume and portfolio display.
- **data-access/**: CV-specific state management and services.
  - Portfolio data models
  - CV-related services
  - Integration with shared/data-access

#### Scribo-Specific Libraries (`scribo/`)

- **feature-landing/**: Public-facing article discovery and filtering page (no auth required).
- **feature-article-list/**: Authenticated article list with CRUD operations (protected by AuthGuard).
- **feature-user-profile/**: User profile dashboard and settings.
- **feature-layout/**: Layout wrapper and navigation for Scribo feature routes.
- **data-access/**: Scribo-specific state management and services.
  - NgRx Signals store for article state
  - Firestore service integration
  - Article models and schemas (Zod validation)

This structure ensures modularity, reusability, and scalability, making it easier to maintain and extend the project.

```bash
my-personal-project/
├── apps/
│   ├── my-personal-project/        # Main web application (Angular 19 standalone)
│   │   └── src/
│   │       ├── app/                # Feature modules (cv, scribo, auth)
│   │       ├── environments/       # Environment configurations
│   │       ├── locales/            # i18n translation files (en-US, es)
│   │       ├── main.ts             # Bootstrap
│   │       └── styles.scss         # Global styles
│   └── my-personal-project-e2e/    # Playwright E2E tests
│       └── src/
│           └── example.spec.ts
└── libs/
    ├── cv/                         # Portfolio/CV domain
    │   ├── feature-about/          # About/CV landing page
    │   └── data-access/            # CV state & services
    ├── scribo/                     # Article-sharing platform domain
    │   ├── feature-landing/        # Public article discovery
    │   ├── feature-article-list/   # Authenticated article CRUD (AuthGuard)
    │   ├── feature-user-profile/   # User profile management
    │   ├── feature-layout/         # Layout wrapper for scribo routes
    │   └── data-access/            # Article services & NgRx Signals store
    └── shared/                     # Cross-domain utilities
        ├── data-access/            # Global state, guards, services, Firebase integration
        ├── ui/                     # Component library with Storybook
        ├── util-error/             # Global error handling
        ├── util-translation/       # i18n utilities
        └── utils/                  # Helper functions, validators, formatters
```

## Contributing

Contributions are welcome! Please follow these guidelines:

1.  Fork the repository.
2.  Create a new branch for your feature/fix: `git checkout -b feature/my-new-feature`
3.  Commit your changes: `git commit -m "Add some feature"`
4.  Push to the branch: `git push origin feature/my-new-feature`
5.  Create a pull request.

Please make sure to update tests as appropriate.

## License

This project is licensed under the MIT License.

---
