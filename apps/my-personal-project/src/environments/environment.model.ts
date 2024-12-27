// ? We follow: https://ekrem-kocak.medium.com/using-environment-variables-with-nx-19-and-angular-18-058f2e989fc9

export type EnvironmentModel = {
  apiUrl: string;
  production: boolean;
  apiKey: string;
  authDomain: string;
  projectId: string;
  storageBucket: string;
  messagingSenderId: string;
  appId: string;
  measurementId: string;
};
