import { ApolloClient, InMemoryCache, HttpLink } from '@apollo/client';

const client = new ApolloClient({
  link: new HttpLink({
    uri: process.env.NEXT_PUBLIC_WORDPRESS_API_URL || 'https://bluereeftech.com/demo-next-js/graphql',
  }),
  cache: new InMemoryCache(),
});

export default client;