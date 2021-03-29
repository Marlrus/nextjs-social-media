import {
  FC,
  useContext,
  useState,
  ChangeEvent,
  useEffect,
  useCallback,
  FormEvent,
} from 'react';
import { UserContext } from 'lib/context';
import { firestore } from 'lib/firebase';
import debounce from 'lodash.debounce';

const EnterPage: FC = ({}) => {
  const { user, username, signOut, signInWithGoogle } = useContext(UserContext);

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
    return (
      <button className='btn-google' onClick={signInWithGoogle}>
        <img src={'/google.png'} alt='Google Logo' /> Sign in with Google
      </button>
    );
  }

  function UsernameForm() {
    const [formValue, setFormValue] = useState('');
    const [isValid, setIsValid] = useState(false);
    const [loading, setLoading] = useState(false);

    const { user } = useContext(UserContext);

    useEffect(() => {
      checkUsername(formValue);
    }, [formValue]);

    const checkUsername = useCallback(
      debounce(async (username: string) => {
        if (username.length <= 3) return;
        const ref = firestore.doc(`usernames/${username}`);
        const { exists } = await ref.get();
        console.log('Firestore read exectued');
        setIsValid(!exists);
        setLoading(false);
      }, 500),
      []
    );

    const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault();

      // Create refs for both documents
      const userDoc = firestore.doc(`users/${user.uid}`);
      const usernameDoc = firestore.doc(`usernames/${formValue}`);

      // Run transaction for both documents
      const batch = firestore.batch();
      batch.set(userDoc, {
        username: formValue,
        photoURL: user.photoURL,
        displayName: user.displayName,
      });
      batch.set(usernameDoc, { uid: user.uid });

      await batch.commit();
    };

    // Handle UI messages based on app state
    const UsernameMessage = ({ username, isValid, loading }) => {
      if (loading) return <p>Checking...</p>;
      if (isValid)
        return <p className='text-success'>{username} is available!</p>;
      if (username && !isValid)
        return <p className='text-success'>That username is taken!</p>;
      return <p></p>;
    };

    const onChange = (e: ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value.toLowerCase();
      const regex = /^(?=[a-zA-Z0-9._]{3,15}$)(?!.*[_.]{2})[^_.].*[^_.]$/;

      if (value.length < 3) {
        setFormValue(value);
        setLoading(false);
        setIsValid(false);
        return;
      }

      if (regex.test(value)) {
        setFormValue(value);
        setLoading(true);
        setIsValid(false);
      }
    };

    return (
      <section>
        <h3>Choose Username</h3>
        <form onSubmit={onSubmit}>
          <input
            name='username'
            placeholder='username'
            value={formValue}
            onChange={onChange}
          />

          <UsernameMessage
            username={formValue}
            isValid={isValid}
            loading={loading}
          />

          <button type='submit' className='btn-green' disabled={!isValid}>
            Choose
          </button>

          <h3>Debug State</h3>
          <div>
            Username: {formValue}
            <br />
            Loading: {loading.toString()}
            <br />
            Username Valid: {isValid.toString()}
          </div>
        </form>
      </section>
    );
  }

  function SignOutButton() {
    return <button onClick={signOut}>Sign Out</button>;
  }
};

export default EnterPage;
