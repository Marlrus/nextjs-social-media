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
