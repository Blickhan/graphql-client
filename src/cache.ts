import { InMemoryCache } from '@apollo/client';

export default new InMemoryCache({
  typePolicies: {
    Todo: {
      keyFields: ['id'],
    },
    Query: {
      fields: {
        todos: {
          merge: false,
        },
      },
    },
  },
});
