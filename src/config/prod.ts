import ClientConfig, { NodeEnv } from './Config';

const config: ClientConfig = {
  nodeEnv: process.env.NODE_ENV as NodeEnv,
  port: process.env.PORT || 3000,
  graphqlUrl: process.env.GRAPHQL_URL!,
  subscriptionsUrl: process.env.SUBSCRIPTIONS_URL!,
  googleClientId: process.env.GOOGLE_CLIENT_ID!,
};

export default config;
