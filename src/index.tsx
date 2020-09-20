import React from 'react';
import ReactDOM from 'react-dom';
import { split, ApolloClient, ApolloProvider, HttpLink } from '@apollo/client';
import { getMainDefinition } from '@apollo/client/utilities';
import { WebSocketLink } from '@apollo/client/link/ws';
import { SubscriptionClient } from 'subscriptions-transport-ws';
import App from './components/App';
import { AuthProvider } from './auth.context';
import cache from './cache';
import config from './config';

console.log(config);
const httpLink = new HttpLink({
  uri: config.graphqlUrl,
  credentials: 'include',
});

console.log(config);
export const subscriptionClient = new SubscriptionClient(
  config.subscriptionsUrl,
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
