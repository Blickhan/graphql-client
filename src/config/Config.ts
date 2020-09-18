export type NodeEnv = 'production' | 'development';

export default interface ClientConfig {
  nodeEnv: NodeEnv;
  port: string | number;
  graphqlUrl: string;
  subscriptionsUrl: string;
  googleClientId: string;
}
