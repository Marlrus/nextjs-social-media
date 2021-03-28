# User Authentication

This application needs users and custom usernames. Firebase does'nt support custom usernames out of the box, so the implementation will be up to us.

In the app we will get the firebase user, if the user is authenticated, we will fetch the user document from firestore.

Since we don't want to fetch and save the user on every page, we will place the user information in a global context to share it to the other components.

We will not be server side rendering any authenticated content because crawlers will not have access to this content.

To validate usernames we will use **two documents in firestore**, one for users which is the public facing user document, and a usernames collection that has a list of usernames and the id they are related to in the users collection. This data model is called a **reverse mapping**.

## Google sign in

We will create 3 components inside of our enter.tsx component that will handle our authentication states. We will be using the Google auth provider for this. To use this we need to set it up in our firebase configuration:

```typescript
export const auth = firebase.auth();
export const googleAuthProvider = new firebase.auth.GoogleAuthProvider();
```

Then in our component we will import these values to use inside of enter:

```tsx
import { auth, googleAuthProvider } from 'lib/firebase';
```

### User states

There are three states the user can be in:

| state                         | action             |
| ----------------------------- | ------------------ |
| Signed out                    | Show SignInButton  |
| User signed in / no username  | Show Username Form |
| User signed in / has username | Sign Out button    |

We will use these conditions for the rendering. In the course it is done with a nested ternary, which I heavily dislike. I modified the logic to this:

```tsx
const EnterPage: FC = ({}) => {
  const user = null;
  const username = null;

  const noUsername = user && !username;
  const fullLogin = user && username;

  return (
    <main>
      {!user && <SignInButton />}
      {noUsername && <UsernameForm />}
      {fullLogin && <SignOutButto />}
    </main>
  );
};
```

Inside of this component, we will create the 3 components that we are using here. I tend not to do this and want to use the const syntax. However, I will use **function** to have them after the main return but still have access to them in the componet return statement.

### Sign in Button

```tsx
function SignInButton() {
  const signInWithGoogle = async () => {
    await auth.signInWithPopup(googleAuthProvider);
  };

  return (
    <button className='btn-google' onClick={signInWithGoogle}>
      <img src={'/google.png'} alt='Google Logo' /> Sign in with Google
    </button>
  );
}
```

Here we use the firebase auth method for the popup, then we use our googleAuthProvider. After that is done, we can create the button. For the button we download a PNG of the google logo to use in the img tag.

### Sign out button

Firebase auth uses JWT. This button is very easy because we just call the **auth.signOut()** method that removes the JWT that is stored in the browser to manage the auth state on the front end.

## Auth Context

We will manage the sharing of the Auth state using React's Context API. We start by creating a **context.ts** file in our lib/ directory. Here we import createContext and pass in the starting value for the context:

```typescript
import { createContext } from 'react';

interface User {
  user: string | null;
  username: string | null;
}

export const UserContext = createContext<User>({ user: null, username: null });
```

To get this context in our app, we use in in our **app.tsx** component:

```tsx
import '../styles/globals.css';
import Navbar from 'components/Navbar';
import { Toaster } from 'react-hot-toast';
import { UserContext } from 'lib/context';

const MyApp = ({ Component, pageProps }) => {
  return (
    <UserContext.Provider value={{ user: '', username: 'Marlrus' }}>
      <Navbar />
      <Component {...pageProps} />
      <Toaster />
    </UserContext.Provider>
  );
};

export default MyApp;
```

Here we are hardcoding a user, this will change in the future, as well as our inteface.

### Using the Context in Navbar

To use context in a component, we just have to import useContext and the context that we are getting. The typing is done automatically and now this component will be updated whenever the user changes:

```tsx
import { FC, useContext } from 'react';
import { UserContext } from 'lib/context';

const { user, username } = useContext(UserContext);
```

Once this is done, we connect this context with the Enter component as well.

### Auth Hook

We need to connect our App to Firebase. We need to add the logic to the app component, but the component is getting crowded, therefore we move the logic into our own hook file.

```typescript
import { useState, useEffect } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth, firestore } from 'lib/firebase';

export const useUserData = () => {
  const [user] = useAuthState(auth);
  const [username, setUsername] = useState(null);

  useEffect(() => {
    // Turn off realtime subscription
    let unsubscribe: any;

    if (user) {
      const ref = firestore.collection('users').doc(user.uid);
      unsubscribe = ref.onSnapshot(doc => {
        setUsername(doc.data()?.username);
      });
    } else {
      setUsername(null);
    }

    // On unmount
    return unsubscribe;
  }, [user]);

  return { user, username };
};
```

In this hook we do a few things:

1. We get the user from Firestore using the **useAuthState** hook.
2. We create an internal state for the username which starts as null.
3. We use useEffect to listen for changes on the **user** object.
4. We create a varabile to handle the Firbase subscription on the useEffect cleanup.
5. If we have a user already, we match it to the user in our Firebase collection using the **uid**.
6. We store the return for **ref.onSnapshot** to **unsubscribe** because this return is the callback that cleans up our realtime subscription.
7. Inside onSnapshot, we have a callback that will be called whenever our user collection updates. Here we **setUsername** to the username in the doc.
8. If there is no user, we will set the username to null.
9. We then use the useEffect return function to unsubscribe from our snapshot.

## Custom Usernames

We want to have unique usernames, this will happen where we choose a username and it will be updated as we type. However, we don't want to fire a request on every keypress, therefore we will **debounce** the call.

For this we need to relate the **usernames** collection to the uid we have in the **users** collection in order to create the association.

We create a whole lot of code to do manual validation of the user as well as a bunch of other stuff. An interesting thing is that we install **debounce** straight from lodash without needing to install the whole package using `npm i lodash.debounce`

### Debouncing in React

We need a few things to debounce in react. Since state change triggers a re-render, we need to use **useCallback** to keep the reference to the original function. We set [] as the dependency array because we don't want it to refresh. Then inside we can use the **debounce** function, just as we would setTimeout. Inside of that function, as the callback, we user our custom function. Once that is done, our function is effectively debounced.

**Video 17**
