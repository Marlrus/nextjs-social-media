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
