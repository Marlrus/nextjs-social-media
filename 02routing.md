# Routing

Next uses **file system based routing**. We will be creating the files for the routes we will be using for the project. We will create an **pages/enter.tsx** file for the /enter route.

Sometimes we need routes that go multiple levels deep. In this case we need to create a **dir** for those routes. We will do this for the admin routes. When we create an **index.js** file inisde a dir in this page, it works like the root page but uses the name of the directory as the route. In our case **pages/admin/index.tsx** will point to our /admin route component.

## Dynamic route

Until now we have a 1 to 1 relationship with our pages. We might need a dynamic route where many different routes point to the same component. This is the case with the slug, more correctly labeled a **dynamic url segment**. We can do this in next through the **file name**: **admin/[slug].tsx** will make it so that anything after /admin will point to this component. We can test that in our route and it works. We can extract this data from the url and use it.

## Dynamic routes after the root

We want to have multiple routes in a directory that has a dynamic route, for example, /username/panel. We achieve this with the same brakcet notation, but we use it in the directory instead: **[username]/index.tsx**.

This **does not conflict with the routes we have already set up, because NextJS gives static routes priority.** This is a relief compared to what has to be done in CRA.

This page will be a public facing page that will also have a dynamic route after the username. We do this by creating a **[slug].tsx** file inside our username directory. Now we have 2 adjacent dynamic routes.

## Link Component

This component is used for navigation in our Next app. We don't want to use a basic a tag for navigation because it will re trigger a full page refresh. Next provides a **Link** component for its built in router. What is added to the **href** property, will be the path linked to by the children inside the link. The children can be anything.

```tsx
<Link href='/marlrus'>
  <a>Marlrus' profile</a>
</Link>
```

This will send us to the **[username]/index.tsx** component we have set. We can be **more explicit** by setting the path based on our file structure, as well as the query parameter we want to use on the link:

```tsx
<Link
  href={{
    pathname: '/[username]',
    query: { username: 'marlrus' },
  }}
>
  <a>Marlrus' profile</a>
</Link>
```

### Prefetching

This component has **default prefetching**, meaning that the page will load this content in the background so when a user clicks the link, it will redirect instantly seemlessly. This can be disabled by adding the **prefetching={false}** property to our Link component.

## Loading Spinner

We will create a reusable loading indication that we will use accross our entire app. It will go in our components/ directory.

```tsx
import { FC } from 'react';

interface LoaderProps {
  show: boolean;
}

const Loader: FC<LoaderProps> = ({ show }) => {
  if (show) return <div className='loader' />;
};

export default Loader;
```

This component takes styles from the global css file. Now we can import this component in any of our pages.

### Absolute imports in Next

Since Next doesn't have a src/ directory, the setup is easier. In our tsconfig or jsconfig ile we add the **baseUrl** property to **"."**:

```json
{
  "compilerOptions": {
    "baseUrl": "."
  }
}
```
