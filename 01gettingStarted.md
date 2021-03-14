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
