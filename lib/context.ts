import { createContext } from 'react';

interface User {
  uid: string;
  photoURL: string;
  displayName: string;
}

interface UserAndUsername {
  user: User | null;
  username: string | null;
  signOut: () => void;
  signInWithGoogle: () => void;
}

export const UserContext = createContext<UserAndUsername>({
  user: null,
  username: null,
  signOut: null,
  signInWithGoogle: null,
});
