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
    nx serve cv-app  # To run the CV/History app
    # OR
    nx serve scribo-app  # To run the Scribo app
    ```

    The application will be available at `http://localhost:4200` (or a different port if 4200 is in use).

5.  **Run tests**

    ```bash
    nx test shared-data-access
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

- **cv-app/**: Main application for the CV/History section.
- **scribo-app/**: Main application for the Scribo article-sharing platform.

### Libraries (`libs/`)

#### Shared Libraries (`shared/`)

- **ui/**: Reusable UI components shared across applications.
- **utils/**: Reusable utility functions.
- **data-access/**: Shared data access logic, including:
  - **models/**: Zod schemas for Firestore documents and user data.
    - `firestore.schema.ts`: Base Zod schema for Firestore documents.
    - `user.schema.ts`: Zod schema for User data.
  - **services/**: Services for interacting with Firestore and managing user data.
    - `firestore.service.ts`: Service for interacting with Firestore.
    - `user.store.ts`: NgRx Signal Store for managing user data.
  - **state/**: State management utilities.
    - `firestore-entity-store.ts`: Generic NgRx Signal Store feature for Firestore entities.

#### CV-Specific Libraries (`cv/`)

- **feature-about/**: Feature module for the "About" section of the CV.
- **feature-experience/**: Feature module for the "Experience" section of the CV.
- **feature-projects/**: Feature module for the "Projects" section of the CV.
- **feature-skills/**: Feature module for the "Skills" section of the CV.
- **data-access/**: CV-specific data access logic, leveraging shared data-access libraries.

#### Scribo-Specific Libraries (`scribo/`)

- **feature-article-list/**: Feature module for listing articles.
- **feature-article-view/**: Feature module for viewing individual articles.
- **feature-article-create/**: Feature module for creating new articles.
- **feature-user-profile/**: Feature module for managing user profiles.
- **data-access/**: Scribo-specific data access logic, leveraging shared data-access libraries.

This structure ensures modularity, reusability, and scalability, making it easier to maintain and extend the project.

```bash
my-personal-project/
├── apps/
│   ├── cv-app/ # Main application for the CV/History section
│   └── scribo-app/ # Main application for the Scribo article-sharing platform
└── libs/
    ├── shared/
    │   ├── ui/ # Reusable UI components (shared across apps)
    │   ├── utils/ # Reusable utility functions
    │   └── data-access/ # Shared data access logic (Firebase, Auth, UserStore, generic Firestore store)
    │       ├── models/
    │       │   ├── firestore.schema.ts # Base Zod schema for Firestore documents
    │       │   └── user.schema.ts # Zod schema for User data
    │       ├── services/
    │       │   ├── firestone.service.ts# Service for interacting with Firestore
    │       │   └── user.store.ts # NgRx Signal Store for managing user data
    │       └── state/
    │           └── firestore-entity-store.ts # Generic NgRx Signal Store feature for Firestore entities
    ├── cv/ # CV-specific libraries
    │   ├── feature-about/
    │   ├── feature-experience/
    │   ├── feature-projects/
    │   ├── feature-skills/
    │   └── data-access/ # CV-specific data access logic (can use shared/data-access)
    └── scribo/ # Scribo-specific libraries
        ├── feature-article-list/
        ├── feature-article-view/
        ├── feature-article-create/
        ├── feature-user-profile/
        └── data-access/ # Scribo-specific data access logic (can use shared/data-access)
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
