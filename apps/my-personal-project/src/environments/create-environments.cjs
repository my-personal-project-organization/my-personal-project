/* eslint-disable @typescript-eslint/no-require-imports */
require('dotenv').config();
const fs = require('fs');
const path = require('path');
const successColor = '\x1b[32m%s\x1b[0m';
const checkSign = '\u{2705}';
const envList = ['local', 'prod'];

// ? Follow: https://medium.com/@ragabon/create-multiple-environment-ts-in-angular-using-env-and-automate-using-node-js-933503fca752

function createEnvironments() {
  envList.forEach((en) => {
    const envPath = en !== 'local' ? `.${en}` : '';
    const apiUrl = en === 'local' ? 'local' : 'prod';
    const production = en === 'local' ? false : true;

    const envFile = `export const environment = {
      apiUrl: '${apiUrl}',
      production: ${production},
      firebaseConfig: {
        apiKey: '${process.env.FIREBASE_API_KEY}',
        authDomain: 'my-personal-project-7c70d.firebaseapp.com',
        projectId: 'my-personal-project-7c70d',
        storageBucket: 'my-personal-project-7c70d.firebasestorage.app',
        messagingSenderId: '938956948971',
        appId: '1:938956948971:web:34ade1fc4fb53a773a45ae',
        measurementId: 'G-422CWNGJS7',
      }
    };`;

    const targetPath = path.join(
      __dirname,
      `../environments/environment${envPath}.ts`,
    );
    fs.writeFile(targetPath, envFile, (err) => {
      if (err) {
        console.error(err);
        throw err;
      } else {
        console.log(
          successColor,
          `${checkSign} Successfully generated ${en} environment file`,
        );
      }
    });
  });
}

createEnvironments();
module.exports = { createEnvironments };
