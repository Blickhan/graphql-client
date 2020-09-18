import React from 'react';
import ReactDOM from 'react-dom';
import { split, ApolloClient, ApolloProvider, HttpLink } from '@apollo/client';
import { getMainDefinition } from '@apollo/client/utilities';
import { WebSocketLink } from '@apollo/client/link/ws';
import App from './components/App';
import { AuthProvider } from './auth.context';
import cache from './cache';
import config from './config';

const httpLink = new HttpLink({
  uri: config.graphqlUrl,
  credentials: 'include',
});

export const wsLink = new WebSocketLink({
  uri: config.subscriptionsUrl,
  options: {
    reconnect: true,
  },
});

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
