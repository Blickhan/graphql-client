import React from 'react';
import { Button, message } from 'antd';
import { useMutation, gql } from '@apollo/client';
import { subscriptionClient } from '../index';
import { useAuth } from '../auth.context';

const LOGOUT = gql`
  mutation Logout {
    logout
  }
`;

const Logout = () => {
  const { setLoggedInUser } = useAuth();
  const [logout] = useMutation(LOGOUT, {
    async update(cache) {
      localStorage.clear();
      setLoggedInUser(null);
      await cache.reset(); // clear local state
      subscriptionClient.close(); // close open subscriptions
    },
  });

  const onSubmit = async () => {
    try {
      await logout();
    } catch (e) {
      message.error(e.message);
    }
  };
  return (
    <div>
      <Button type="primary" onClick={onSubmit}>
        Logout
      </Button>
    </div>
  );
};

export default Logout;
