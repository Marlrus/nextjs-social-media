import Head from 'next/head';
import styles from '../styles/Home.module.css';
import Link from 'next/link';
import Loader from 'components/Loader';

const Home = () => {
  return (
    <div>
      <Loader show />
      <Link
        href={{
          pathname: '/[username]',
          query: { username: 'marlrus' },
        }}
      >
        <a>Marlrus' profile</a>
      </Link>
    </div>
  );
};

export default Home;
