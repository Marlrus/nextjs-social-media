import { useState, useEffect } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth, googleAuthProvider, firestore } from 'lib/firebase';

export const useUserData = () => {
  const [user] = useAuthState(auth);
  const [username, setUsername] = useState<string | null>(null);

  const signOut = () => {
    setUsername(null);
    auth.signOut();
  };

  const signInWithGoogle = async () => {
    await auth.signInWithPopup(googleAuthProvider);
  };

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

  return { user, username, signOut, signInWithGoogle };
};
