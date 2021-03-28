import '../styles/globals.css';
import Navbar from 'components/Navbar';
import { Toaster } from 'react-hot-toast';
import { UserContext } from 'lib/context';
import { useUserData } from 'lib/hooks';

const MyApp = ({ Component, pageProps }) => {
  const { user, username, signOut } = useUserData();

  return (
    <UserContext.Provider value={{ user, username, signOut }}>
      <Navbar />
      <Component {...pageProps} />
      <Toaster />
    </UserContext.Provider>
  );
};

export default MyApp;
