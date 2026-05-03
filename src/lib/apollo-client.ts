import { ApolloClient, InMemoryCache } from "@apollo/experimental-nextjs-app-support";
import { HttpLink } from "@apollo/client";
import { registerApolloClient } from "@apollo/experimental-nextjs-app-support/rsc";

const WP_API_URL = process.env.NEXT_PUBLIC_WORDPRESS_API_URL!;

export const { getClient, query, PreloadQuery } = registerApolloClient(() => {
  return new ApolloClient({
    cache: new InMemoryCache(),
    link: new HttpLink({
      uri: WP_API_URL,
      fetchOptions: { cache: "no-store" },
    }),
  });
});
