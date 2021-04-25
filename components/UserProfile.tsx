import { FC } from 'react';

interface User {
  photoUrl: string;
  username: string;
  displayName: string;
}

interface CustomProps {
  user: User;
}

const UserProfile: FC<CustomProps> = ({ user }) => {
  return (
    <div className='box-center'>
      <img src={user.photoUrl} className='card-img-center' />
      <p>
        <i>@{user.username}</i>
      </p>
      <h1>{user.displayName}</h1>
    </div>
  );
};

export default UserProfile;
