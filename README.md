# Mario Personal Project

This project is a personal portfolio and article-sharing platform built with Angular, Nx, NgRx Signals, Firestore, and Tailwind CSS. It consists of two main sections:

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
- **Dark Mode** Tailwind dark mode support.

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
    git clone <your-repository-url>
    cd <your-repository-name>
    ```

2.  **Install dependencies:**

    ```bash
    npm install  # Or yarn install, or pnpm install
    ```

3.  **Configure Firebase:**

    - Create a file `src/environments/environment.ts` (and `src/environments/environment.prod.ts` for production).
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
    Or any other lib or app.

## Project Structure

This project is an Nx monorepo with the following structure:

```bash
my-personal-project/
├── apps/
│ ├── cv-app/ # Main application for the CV/History section
│ └── scribo-app/ # Main application for the Scribo article-sharing platform
└── libs/
├── shared/
│ ├── ui/ # Reusable UI components (shared across apps)
│ ├── utils/ # Reusable utility functions
│ └── data-access/ # Shared data access logic (Firebase, Auth, UserStore, generic Firestore store)
│ ├── models/
│ │ ├── firestore.schema.ts # Base Zod schema for Firestore documents
│ │ └── user.schema.ts # Zod schema for User data
│ ├── services/
│ │ ├── firestone.service.ts# Service for interacting with Firestore
│ │ └── user.store.ts # NgRx Signal Store for managing user data
│ └── state/
│ └── firestore-entity-store.ts # Generic NgRx Signal Store feature for Firestore entities
├── cv/ # CV-specific libraries
│ ├── feature-about/
│ ├── feature-experience/
│ ├── feature-projects/
│ ├── feature-skills/
│ └── data-access/ # CV-specific data access logic (can use shared/data-access)
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
