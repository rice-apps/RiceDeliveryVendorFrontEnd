// Welcome to the main entry point.
//
// In this file, we'll be kicking off our app or storybook.

import { AppRegistry, AsyncStorage } from "react-native"
import { RootComponent } from "./root-component"
import { ApolloProvider } from "react-apollo"
import { ApolloClient } from "apollo-client"
import { createHttpLink } from "apollo-link-http"
import { InMemoryCache } from "apollo-cache-inmemory"
import {onError} from "apollo-link-error"
import { ApolloLink } from "apollo-link";
import { setContext } from 'apollo-link-context';
/**
 * This needs to match what's found in your app_delegate.m and MainActivity.java.
 */
const APP_NAME = "testIgniteProject"



const errorLink = onError(({ graphQLErrors, networkError }) => {
  if (graphQLErrors) {
    graphQLErrors.map(({ message, locations, path }) =>
      console.log(
        `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`,
      ),
    );
    // return graphQLErrors
  }
  if (networkError) {
    console.log(`[Network error]: ${networkError}`)
    // return networkError
  }
});// link for real device

const serverLink = createHttpLink({
  // uri: "http://10.115.176.127:3000/graphql",
  // uri: "http://localhost:3000/graphql",
  uri: "https://hedwig-233703.appspot.com/graphql",
})


const authLink = setContext(async (_, { headers }) => {
  // get the authentication token from local storage if it exists
  const token = await AsyncStorage.getItem('token');
  console.log(token);
  // return the headers to the context so httpLink can read them
  return {
    headers: {
      ...headers,
      authorization: token ? `${token}` : "",
    }
  }
});

// const serverLink = createHttpLink({
//   uri: "http://localhost:3000/graphql",
// })

// const link = ApolloLink.from([serverLink])
export const client = new ApolloClient({
  link: authLink.concat(serverLink),
  cache: new InMemoryCache(),
  defaultOptions: {
    query: {
      fetchPolicy: "no-cache",
    },
  },
})

// Should we show storybook instead of our app?
//
// ⚠️ Leave this as `false` when checking into git.

// appease the typescript overlords
declare global {
  var module
}

AppRegistry.registerComponent(APP_NAME, () => RootComponent)
