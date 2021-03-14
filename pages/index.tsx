import Head from 'next/head';
import styles from '../styles/Home.module.css';
import Link from 'next/link';

const Home = () => {
  return (
    <div>
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
