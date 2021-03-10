# NextJS pre course

There are 4 videos before the course. Most of the things here are known to me, but I will re-watch to see if there is something I have missed.

## React Basics

As review, useRef is best used to target elements from the DOM and use native JS methods on them.

useMemo is used to memoize and improve performance when it becomes a bottleneck. useMemo looks like useEffect, but it has a dependency array that determines _when_ the component should be recomputed. (Tell Juan Leon tomorrow)

useCallback memoizes functions and works in the same way as useMemo. This means that we can create a function and pass it down to all children which will use the same reference.

useImperativeHandle. I have never used this one. This hook allows us to change the default behavior of a ref we have with useRef, for example we could use this to alter the **click** method on a button element.

useLayoutEffect. Never used this one either. This one works like useEffect, but it well be run after the component has been rendered, but before it has been painted on the screen. This blocks visual updates until the callback is finished.

useDebugValue. Never used this one either. This allows us to use custom label for react dev tools when we make our own hooks.

This video is about hooks, there is a part about using custom hooks.

### Custom Hooks

- Why? When? How?

- **When** we are using two hooks that are working together. For exapmle an API call in a useEffect, and a useState to hold the response value.
- **How** we create a regular JS function that runs the same logic we use in our component, meaining that in this case it has useState and useEffect. The difference is that we **return the value we set in our useState at the end of the function**, which gives us access to this value.
- **Why** to create re-usable multiple hook code that can be used in many components.

## Firebase Basics

I have used firebase slightly in the React course, but to be frank I don't want to use it. The greatest features are the auth service and the live server with websockets.

For Firebase to work we need to have node. Then we create a Firebase project in the webpage. It is a GDK BaaS (Backend as a server). The console has many areas, the most important one is Develompment. The Quality area contains data for bugs, crashes, performance and basically everything that has to do with users on the page. The analytics tab has analytics. Growth has A/B testing amongst other things.

A firebase project can have multiple web apps. We get a script tag that we need to add to our webapp for our firebase configuration. These are safe to expose in the frontend. We can choose or ignore multiple scripts depending on the services we want from Firebase.

### Firebase CLI

Firebase has a CLI that allows us to test, manage, and deploy our firebase project from the command line. We do this through: `npm i firebase-tools -g` Which will install this globally.

To login, we run: `firebase login` This will allow us to manage our firebase app from the CL. There is a Firebase Explorer VSCode plugin that allows you to manage everything in your Firebase app from the IDE.

### Firebase configuration

To **configure** Firebase in the app we need to run `firebase init` here we will select what features we want to use from Firebase. There is a **Firebase Emulator** that emulates Firebase on your system locally.

- There is a **.firebaserc** (Resource Config) contains the identifier for our project in the cloud.
- The **firebase.json** file allows us to customize the way our Firebase app works.o

### Running and Deploying our Firebase App

We can run the app with `firebase emulators:start` or `firebase start` which will launch the application on port 5000.

We can run `firebase deploy` to upload the files in our set directory to a bucket in the cloud. It will automatically create a url for it with the name of the app followed by web.app: **test-app.web.app**

In the Hosting tab, we can see the different versions of our app that have been deployed. Here we can connect our custom domain.

## User Authentication

We can handle users in Firebase. I already did it for my ts eCommerce project. The cost of users in firebase is 0.

To use it we need to use `firebase.auth()` which gives us access to all of the auth tools. Once this is done, we need 3 things an **auth provider**, and then we need to attach the **auth.signInWithPopup()** method and the **auth.signOut()** method. Sign in takes the auth provider that we determined. Having done this, Firebase handles the rest.

### Auth state changes

When we have an app, the auth state can change multiple times. To create a handler for this we use the **auth.onAuthStateChanged()** Which takes a callback that is used anytime the user's auth state changes. This method gives us access to the **current user**, inside we can use an if/else block to handle what happens when **!user** and **user**.

## Firestore

Firebase has 2 databases, **realtime database** and **cloud firestore**. Firestore is the multitool of the two. It is a NoSQL, document oriented DB. I have seen this before on my TS Project. This DB stays updated with our app in real time without us having to do anything to it.

Friestore has a free quota per month, and payment starts once you break that quota and is based on consumption.

Firestore has **Collections** and **Documents** which we can create manually in the dashboard. The document has a unique id and fields (properties) a type, and a value. This data can be queried directly in the database tab in firestore.

### Firestore in the app

We import the db SDK by adding it to a variable `const db = firebase.firestore()` Then we create two variables, one for the collection we are going to query and one to unsubscribe from the realtime stream that comes with firebase.

We then use **auth.onAuthStateChanged** to check whether there is a user so that the CRUD operations can be done. The reference to the collection is done with: `thingsRef = db.collection('things')` which uses the same name created in the firebase db. Having that ref we have access to the crud methods, in this case we use add() and send the data to create the document in the collection. At this point in the course, the createdAt flag is done in the front end because the BaaS doesn't allow us to create a timestamp anywhere else. To have consistency we use the: `const { serverTimestamp } = firebase.firestore.FieldValue` to work around this issue.

Then it goes into the implementation of the observable pattern with firestore which was done in the ts eCommerce project.

## Cloud fns

Since we might need to use custom backend, Firebase now has a cloud fns service.

## NextJS pre course

Notes on new things:

- Next handles 3 strategies: SSR, SSG, ISA.
- ISA: Incremental Static Regeneration. Re-generates single pages in the background. This allows us to set an interval in which Next will create a static page if there are changes, which is a good combination between both worlds.

## Technical Overview

The non-free videos in Firebase are hosted on Vimeo and use their player in an iframe.

The project is inspired by social platforms like Dev.to. It needs to be SEO friendly and highly interactive.

### /

Main homepage holds the newest content on the page. Here we want to limit the reads to the DB in Firestore. This page contains the latest 10 articles and is purely SSR. This page will have basic pagination. This data will not be connected to firestore in real time.

### /enter

This handles the user registration and auth. The username is unique. This adds complexity but it is worth it.

### /[username]

This route will use each users unique name, and will be SSR completely. This page has the avatar and the list of user posts that was generated. Clicking this item will take you to the slug of the article under the username.

### /[username]/[slug]

This content will be initially **pre-rendered** then it will be hydrated with data on Firestore and be updated in real-time. Here ISR is implemented. This page has a heart button feature that is complex and requires data modeling considerations and security because a user should only be able to heart a post once.

### /admin

Here you go to the route where you handle the content creation, this part is CSR completely because there is no point in SSR here becuase this content does not need SEOs. When you create a new post or go edit a post, it will send you to the create page on that post.

In this page you write a post in MD and can preview it with a button. Files can also be uploaded here and a markdown snippet to add this to your MD is returned as well.
