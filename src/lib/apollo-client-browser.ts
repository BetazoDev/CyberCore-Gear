"use client";

import { ApolloClient, InMemoryCache, ApolloLink, HttpLink, Observable } from "@apollo/client";

const WP_API_URL = process.env.NEXT_PUBLIC_WORDPRESS_API_URL!;

const sessionCaptureLink = new ApolloLink((operation, forward) => {
  return new Observable((observer) => {
    const sub = forward(operation).subscribe({
      next: (result) => {
        const context = operation.getContext();
        const sessionToken = context.response?.headers?.get("woocommerce-session");
        if (sessionToken) {
          localStorage.setItem("woo-session-token", sessionToken);
        }
        observer.next(result);
      },
      error: observer.error.bind(observer),
      complete: observer.complete.bind(observer),
    });
    return () => sub.unsubscribe();
  });
});

const authLink = new ApolloLink((operation, forward) => {
  const headers: Record<string, string> = {};
  const wooToken = localStorage.getItem("woo-session-token");
  if (wooToken) headers["woocommerce-session"] = `Session ${wooToken}`;
  const jwtToken = localStorage.getItem("auth-token");
  if (jwtToken) headers["Authorization"] = `Bearer ${jwtToken}`;
  operation.setContext({ headers });
  return forward(operation);
});

const httpLink = new HttpLink({ uri: WP_API_URL });

export const clientApolloClient = new ApolloClient({
  cache: new InMemoryCache(),
  link: ApolloLink.from([sessionCaptureLink, authLink, httpLink]),
});
