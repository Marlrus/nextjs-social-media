import { FC } from 'react';
import { auth, googleAuthProvider } from 'lib/firebase';

const EnterPage: FC = ({}) => {
  const user = null;
  const username = null;

  const noUsername = user && !username;
  const fullLogin = user && username;

  return (
    <main>
      {!user && <SignInButton />}
      {noUsername && <UsernameForm />}
      {fullLogin && <SignOutButton />}
    </main>
  );

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

  function UsernameForm() {
    return <></>;
  }

  function SignOutButton() {
    return <button onClick={() => auth.signOut()}>Sign Out</button>;
  }
};

export default EnterPage;
