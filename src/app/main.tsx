// Welcome to the main entry point.
//
// In this file, we'll be kicking off our app or storybook.

import { AppRegistry } from "react-native"
import { RootComponent } from "./root-component"
import { ApolloProvider } from 'react-apollo'
import { ApolloClient } from 'apollo-client'
import { createHttpLink } from 'apollo-link-http'
import { InMemoryCache } from 'apollo-cache-inmemory'

/**
 * This needs to match what's found in your app_delegate.m and MainActivity.java.
 */
const APP_NAME = "testIgniteProject"

const link = createHttpLink({
  uri: 'http://localhost:3000/graphql'
})

export const client = new ApolloClient({
  link: link,
  cache: new InMemoryCache(),
  defaultOptions: {
    query: {
      fetchPolicy: 'no-cache'
    }
  }
});

// Should we show storybook instead of our app?
//
// ⚠️ Leave this as `false` when checking into git.

// appease the typescript overlords
declare global {
  var module
}

AppRegistry.registerComponent(APP_NAME, () => RootComponent)

