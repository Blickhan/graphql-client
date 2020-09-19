export type NodeEnv = 'production' | 'development';

export default interface ClientConfig {
  nodeEnv: NodeEnv;
  graphqlUrl: string;
  subscriptionsUrl: string;
  googleClientId: string;
}
