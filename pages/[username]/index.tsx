import { FC } from 'react';
import { GetServerSideProps } from 'next';
import { getUserWithUsername, postsToJSON } from 'lib/firebase';

import UserProfile from 'components/UserProfile';
import PostFeed from 'components/PostFeed';

export const getServerSideProps: GetServerSideProps = async ({ query }) => {
  const { username } = query as { username: string };

  const userDoc = await getUserWithUsername(username);

  if (userDoc) {
    const user = userDoc.data();
    const postsQuery = userDoc.ref
      .collection('posts')
      .where('published', '==', true)
      .orderBy('createdAt', 'desc')
      .limit(5);

    const postsRes = await postsQuery.get();
    const posts = postsRes.docs.map(postsToJSON);

    return {
      props: { user, posts },
    };
  }
};

interface UserProfilePageProps {
  user: any;
  posts: any;
}

const UserProfilePage: FC<UserProfilePageProps> = ({ user, posts }) => {
  return (
    <main>
      <UserProfile user={user} />
      <PostFeed posts={posts} admin={true} />
    </main>
  );
};

export default UserProfilePage;
