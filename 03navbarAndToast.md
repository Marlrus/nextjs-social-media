# Navbar and Toast

This component will be the one in the header of the page. It has some conditional rendering based on the state of the user. There are two possible states, a logged in user and a public user. We don't have the logic yet, but we do create the logic anticipating this.

For the navbar, we use a **nav** tag, and create an unordered list. Each list item has a **Link** component from Next that will handle the navigation.

Elements of our navigation that don't require sign up, are set outside normally. The other parts are rendered based on **username**. Since we created a [username] route, we will use this value for the navigation Link. We will also use **user.photoURL** which we will get from the user after they sign in with google.

Styles on the component are set from our global css file as well.

## Using Navbar in every page

We could add this component in every page, however the most efficient solution would be to use it in our app component. We wrap it in a Fragment and then add the Navbar over it.

```tsx
import '../styles/globals.css';
import Navbar from 'components/Navbar';

function MyApp({ Component, pageProps }) {
  return (
    <>
      <Navbar />
      <Component {...pageProps} />
    </>
  );
}

export default MyApp;
```

Having this set up, we have the same navbar in every page and we can **preserve the state on each Link transition**.

## Toast

Here we will use react-hot-toast for toaster messages. We install the package and then addit to our App component. Since this component is a module, we can add it anywhere for it to work.

### Triggering Toast

To use these toast messages, we just need to import toast into a component and then use the different methods in it to trigger the messages. In our case, we use success which takesa string that is used as the message for the toast. This is actually very nice and handy.

```tsx
import Head from 'next/head';
import styles from '../styles/Home.module.css';

import toast from 'react-hot-toast';

const Home = () => {
  return (
    <div>
      <button onClick={() => toast.success('hello toast')}>Toast</button>
    </div>
  );
};

export default Home;
```
