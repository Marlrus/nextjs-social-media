# Getting Started

To create the Next app we run the npx command: `npx create-next-app appName` which will start a NextJS project just like the npx CRA scripts. The commands can be seen on the package json file. A Next project has 3 dependencies only: next, react, and react-dom. The rendering happens through react, the **next** package handles SSR, routing, and other considerations for building a full scale application.

## Styles Dir

We have a styles dir that has 2 files, global.css and Home.module.css. The styles in the globals file are accessable in any part of the project but we need to be mindful of creating possible name collisions and style conflicts. Files with **fileName.modules.css** are scoped locally and get a random class name on compilation to avoid name collision. I copy and paste the styles for the global application from the repo in github.

## Pages Dir

This is the most important directory because it determines the routing in our application. The index.js file in this directory is what will be rendered on the / path of our app. There is also a **app.js** file in this dir that basically wraps all of the pages in the application.

There is also an API directory in here that won't be used in the course, but it allows us to create a backend API to bundle code that won't be in our client side application. These will only execute on the server and won't add to your JS bundle.

## Custom directories

Nex doesn't have a components/ dir, but we will need to store re-usable components in our application. Here we will follow the convention that is used by the course, a **components/** directory for re-usable components, and a **lib/** dir for re usable services. We will create these and a few files for them.

## Integrating Typescript

To use TS, we need to create a tsconfig.json file. In Next _you don't add anything to this file because we want next to generate it for us._ We stop the server and restart in, this will give us an error which will show us the command we need to run in order to setup TS in our app: `yarn add --dev typescript @types/react @types/node`

When we run this command and restart our server, if the file is empty, Next will generate the content for us. It also creates the next-env.d.ts file automatically, which we should not have to touch.

## Firebase Setup

We need to create a Firebase project, for this we need a firebase account.

### Configuration

1. Authentication. Here we _get started_ and enable Google. This required a support email, which I set up to my personal email.

2. Firestore. When starting you will be asked to start in locked mode or test mode. Locked does not allow read or write operations. We will start with test mode to ease development, but will come back to this when managing security. This has now been changed to **production mode** instead of locked mode. We are prompted for a location, after it is set **it cannot be changed**.

3. Config for connection

We go to the cog in Project Overview and into project settings. Here we can rename our app if we want to. Then on **your apps** we create a new web app. We create a nickname and we get a code snippet containing our **firebase configuration**.

4. Firebase in our app

We need some packages to get firebase working in our app: `yarn add firebase react-firebase-hooks`

Once that is done we go to the firebase.ts file that we created and add the imports required to include firebase in our bundle. Then we use the data in the configuration file.

```typescript
import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';
import 'firebase/storage';

const firebaseConfig = {
  apiKey: 'AIzaSyBgUkAPvTckpXg_KiS-NVUBGx73PxgUKkI',
  authDomain: 'next-social-media-app.firebaseapp.com',
  projectId: 'next-social-media-app',
  storageBucket: 'next-social-media-app.appspot.com',
  messagingSenderId: '106791911488',
  appId: '1:106791911488:web:26aeab2949155b537cdfa5',
  measurementId: 'G-K6BM8J4RJB',
};
```

- Initializing the app

We can only initialize our firebase app once, however Next might try to run this code twice because of how it works in development. To fix this we add a condition so that it only initializes if the firebase.apps.lenght is 0.

```typescript
if (firebase.apps.length === 0) firebase.initializeApp(firebaseConfig);
```

- SDK library instanciation

We initate the tools from the SDK we will use and have them in a centralized file. As we keep adding functionality, we may add things to this file:

```typescript
export const auth = firebase.auth();
export const firestore = firebase.firestore();
export const storage = firebase.storage();
```

- \*Optional CLI

We can run: `npm i -g firebase-tools` to install the firebase CLI tools. This gives us access to `firebase init` which allows us to set firestore and use the **emulator suite** to create a mock db in our local system.
