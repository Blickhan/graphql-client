import React from 'react';
import { Button } from 'antd';
import { useMutation, gql } from '@apollo/client';
import { useAuth } from '../authContext';

const LOGOUT = gql`
  mutation Logout {
    logout
  }
`;

const Logout = () => {
  const { setLoggedInUser } = useAuth();
  const [logout] = useMutation(LOGOUT, {
    onCompleted() {
      setLoggedInUser(null);
      localStorage.clear();
    },
  });

  const onSubmit = async () => {
    try {
      await logout();
    } catch (e) {
      console.error(e);
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
