import React from 'react';
import ReactDOM from 'react-dom';
import { split, ApolloClient, ApolloProvider, HttpLink } from '@apollo/client';
import { getMainDefinition } from '@apollo/client/utilities';
import { WebSocketLink } from '@apollo/client/link/ws';
import { SubscriptionClient } from 'subscriptions-transport-ws';
import App from './components/App';
import { AuthProvider } from './auth.context';
import cache from './cache';

console.log(process.env.GRAPHQL_URL);
const httpLink = new HttpLink({
  uri: process.env.GRAPHQL_URL,
  credentials: 'include',
});

console.log(process.env.SUBSCRIPTIONS_URL);
export const subscriptionClient = new SubscriptionClient(
  process.env.SUBSCRIPTIONS_URL!,
  {
    reconnect: true,
  }
);
const wsLink = new WebSocketLink(subscriptionClient);

const splitLink = split(
  ({ query }) => {
    const definition = getMainDefinition(query);
    return (
      definition.kind === 'OperationDefinition' &&
      definition.operation === 'subscription'
    );
  },
  wsLink,
  httpLink
);

const client = new ApolloClient({
  cache: cache,
  link: splitLink,
});

ReactDOM.render(
  <ApolloProvider client={client}>
    <AuthProvider>
      <App />
    </AuthProvider>
  </ApolloProvider>,
  document.getElementById('root')
);
