import { ApolloClient, InMemoryCache } from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
import Cookies from "universal-cookie";
import { createUploadLink } from "apollo-upload-client";
import { onError } from "@apollo/client/link/error";
import { ApolloLink } from "@apollo/client/core";

const cookies = new Cookies();

const httpLink = createUploadLink({
  uri: "http://localhost:80/graphql",
});

const authLink = setContext((_, { headers }) => {
  const token = cookies.get("ut");
  return {
    headers: {
      ...headers,
      auth: token ? `ut ${token}` : null,
    },
  };
});

const errorLink = onError(({ graphQLErrors, networkError, operation }) => {
  if (graphQLErrors) {
    graphQLErrors.forEach(({ message, location, path }) => {
      console.log(`message:${message} location:${location}`);
    });
  }

  if (networkError) {
    console.log(`networkerror: ${networkError}`);
  }
});

const client = new ApolloClient({
  link: authLink.concat(httpLink, errorLink),
  cache: new InMemoryCache(),
});

export default client;
