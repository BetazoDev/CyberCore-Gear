"use client";

import { ApolloClient, ApolloNextAppProvider, InMemoryCache } from "@apollo/experimental-nextjs-app-support";
import { ApolloLink, HttpLink, type Operation } from "@apollo/client";

function makeClient() {
  const httpLink = new HttpLink({
    uri: process.env.NEXT_PUBLIC_WORDPRESS_API_URL,
    fetchOptions: { cache: "no-store" },
  });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const authLink = new ApolloLink((operation: any, forward: any) => {
    if (typeof window !== "undefined") {
      const headers: Record<string, string> = {};
      const wooToken = localStorage.getItem("woo-session-token");
      if (wooToken) headers["woocommerce-session"] = `Session ${wooToken}`;
      const jwtToken = localStorage.getItem("auth-token");
      if (jwtToken) headers["Authorization"] = `Bearer ${jwtToken}`;
      operation.setContext(({ headers: existing = {} }: { headers?: Record<string, string> }) => ({
        headers: { ...existing, ...headers },
      }));
    }
    return forward(operation);
  });

  return new ApolloClient({
    cache: new InMemoryCache(),
    link: ApolloLink.from([authLink, httpLink]),
  });
}

export default function ApolloClientProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ApolloNextAppProvider makeClient={makeClient}>
      {children}
    </ApolloNextAppProvider>
  );
}
