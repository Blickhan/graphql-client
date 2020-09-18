import ClientConfig from './Config';

const config: ClientConfig = {
  nodeEnv: 'development',
  port: 3000,
  graphqlUrl: 'http://localhost:4000/graphql',
  subscriptionsUrl: 'ws://localhost:4000/subscriptions',
  googleClientId:
    '343197936306-kqa5k9qp9lfr1obsjqcjdinav62lts88.apps.googleusercontent.com',
};

export default config;
