# SSR

This part is the main content page creation part. Next has hybrid rendering with minimal configuration. If you have non blocking data Next will statically generate it. When you need data it gets tricky. There are 2 ways to do this, SSR through **getServerSideProps**. When you export this function in a file it tells Next to fetch the data for the page and then render the page in the server. This makes it harder to cache.

SSG is donne with **getStaticProps** which generates your page in advanced. There is a third approach which is ISR which will SSG your page on an interval that is set. To do this you have to add the **revalidate** prop on your return with a set amount of seconds. This will generate a new site every X seconds.

## When to use each

1. Is the page private?

If the page is private, you want to fetch your data on the client side like you would in CRA. This is especially recommended when your session is managed on the front end like it is when using firebase.

2. Is SEO not Important?

If it is not, then you have to ask:

3. Does the data change often?

If it does then you want to do CSR. If NOT, then you want to do **SSG**.o

4. Is the page realtime?

If SEO and Realtime are important, you want to do SSR or SSG with hydration on the client side.

5. Does the content change often?

If it doesn't, then you want to use SSG. If it does you want to do SSR or ISR.

## Data Model

For the Posts we will create a new **sub-collection** posts that is nested under **users**. Even if this collection is nested under users, we will be able to query accross the entirety of our posts using a **collectionGroup** query. For the hearts we will create a **hearts** document, nested under the post. It will have the user ID so that each user can only add one heart per post. To start we will create dummy data manually in our firestore.

```typescript
interface Post {
  content: string;
  createdAt: string;
  heartCount: number;
  published: boolean;
  slug: string;
  title: string;
  uid: string;
  updatedAt: string;
  username: string;
}
```

This will be reflected in the following way in our database:

- users/:uid (Public user profile)
- usernames/:username (Username uniqueness tracking)
- users/:uid/posts/:slug (User can have many posts)
- users/:uid/posts/:slug/hearts/:uid (Many to many relationship between users and posts via hearts)

## Profile Page

This is a public page that has user data and the latest post for the user. This will be done with SSR. We will create 2 reusable components: **PostFeed and UserProfile**.

The UserProfile component recieves the user and then uses it to display the data. The PostFeed component has a built in component called PostItem that will receive the post and will be rendered on the map done on posts. Here we caluclate the word count and then mintues to read based on that. We have a link tho the user profile, the post, and if we are an admin, the post edit button.

## SSR in [username]

To use SSR we need to call the **getServerSideProps** function. Here we will use the username in the query object to get the username and then use it to get the posts. For this we need to create a service that gets users by username.

### getUserWithUsername

We create this function in our lib/firebase file.

```typescript
export const getUserWithUsername = async (username: string) => {
  const usersRef = firestore.collection('users');
  const query = usersRef.where('username', '==', username).limit(1);

  const userDoc = (await query.get()).docs[0];

  return userDoc;
};
```

This function gets the ref from the users collection. Then runs a query to get the user that matches our string. Since there is only one, we limit to 1. Then we run the query with .get() and get the first and only doc. Then we return the userDoc.

```tsx
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
  }

  return {
    props: { user, posts },
  };
};
```

This is step one in our query. We get the userDoc with our helper. Then if we have it, we will get the user from the data and then create a query so that we can get the posts. We can see what posts we are getting with the query. Then we need to parse these docmuents but since they have a firestore timestamp, we need to create a serializel that converts our posts to JSON.

### postToJSON

```typescript
export const postToJSON = (doc: firebase.firestore.DocumentSnapshot) => {
  const data = doc.data();
  return {
    ...data,
    createdAt: data.createdAt.toMillis(),
    updatedAt: data.updatedAt.toMillis(),
  };
};
```

Here our helper recieves a DocumentSnapshot and then gets the data in it. It returns the data, and then converts the timestamps to a number that can be interpreted using the **toMillis** method that firebase timpestamps have.
