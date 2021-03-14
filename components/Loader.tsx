import { FC } from 'react';

interface LoaderProps {
  show: boolean;
}

const Loader: FC<LoaderProps> = ({ show }) => {
  if (show) return <div className='loader' />;
};

export default Loader;
