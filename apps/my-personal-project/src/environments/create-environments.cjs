const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');

// Load environment variables from .env file in the app root
const envPath = path.resolve(__dirname, '../../.env');
const envConfig = dotenv.config({ path: envPath }).parsed || {};

const targetPath = path.resolve(__dirname, './environment.ts');
const targetProdPath = path.resolve(__dirname, './environment.prod.ts');

const envFileContent = `
// IMPORTANT: THIS FILE IS AUTO GENERATED! DO NOT MANUALLY EDIT OR CHECKIN!
/* eslint-disable */
export const environment = {
  production: false,
  firebaseConfig: {
    apiKey: '${envConfig.FIREBASE_API_KEY || ''}',
    authDomain: 'my-personal-project-7c70d.firebaseapp.com',
    projectId: 'my-personal-project-7c70d',
    storageBucket: 'my-personal-project-7c70d.firebasestorage.app',
    messagingSenderId: '938956948971',
    appId: '1:938956948971:web:34ade1fc4fb53a773a45ae',
    measurementId: 'G-422CWNGJS7',
  },
  // Add other environment variables here
};
/* eslint-enable */
`;

const envProdFileContent = `
// IMPORTANT: THIS FILE IS AUTO GENERATED! DO NOT MANUALLY EDIT OR CHECKIN!
/* eslint-disable */
export const environment = {
  production: true,
  firebaseConfig: {
    apiKey: '${envConfig.FIREBASE_API_KEY || ''}',
    authDomain: 'my-personal-project-7c70d.firebaseapp.com',
    projectId: 'my-personal-project-7c70d',
    storageBucket: 'my-personal-project-7c70d.firebasestorage.app',
    messagingSenderId: '938956948971',
    appId: '1:938956948971:web:34ade1fc4fb53a773a45ae',
    measurementId: 'G-422CWNGJS7',
  },
  // Add other environment variables here
};
/* eslint-enable */
`;

// Write the content to the respective file
fs.writeFileSync(targetPath, envFileContent);
console.log(`Output generated at ${targetPath}`);
fs.writeFileSync(targetProdPath, envProdFileContent);
console.log(`Output generated at ${targetProdPath}`);
