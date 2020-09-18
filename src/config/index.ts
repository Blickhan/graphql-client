import ClientConfig from './Config';
import prodConfig from './prod';
import devConfig from './dev';

let config: ClientConfig;
if (process.env.NODE_ENV === 'production') {
  config = prodConfig;
} else {
  config = devConfig;
}

export default config;
