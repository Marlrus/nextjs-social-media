import { createContext } from 'react';

export interface User {
  user: {
    uid: string;
    photoUrl: string;
    displayName: string;
  } | null;
  username: string | null;
}

export const UserContext = createContext<User>({ user: null, username: null });
