import React, { useState } from 'react';
import { Input, Button, Alert } from 'antd';
import { useMutation, gql } from '@apollo/client';
import { useAuth } from '../authContext';

const SIGNUP = gql`
  mutation Signup($username: String!, $password: String!) {
    signup(userInput: { username: $username, password: $password }) {
      error {
        message
      }
      user {
        id
        username
      }
    }
  }
`;

const Signup = () => {
  const { setLoggedInUser } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState(null);
  const [signup] = useMutation(SIGNUP, {
    onCompleted({ signup }) {
      setLoggedInUser(signup.user);
      localStorage.setItem('loggedInUser', JSON.stringify(signup.user));
    },
  });

  const onSubmit = async () => {
    setErrorMessage(null);

    try {
      const {
        data: {
          signup: { error },
        },
      } = await signup({ variables: { username, password } });

      if (error) {
        setErrorMessage(error.message);
      }
    } catch (e) {
      console.error(e);
    }
  };
  return (
    <div className="content">
      <h2>Sign up</h2>
      {errorMessage && (
        <div style={{ paddingBottom: '10px' }}>
          <Alert message={errorMessage} type="error" banner closable />
        </div>
      )}
      <div style={{ paddingBottom: '10px' }}>
        <Input
          style={{ maxWidth: '300px' }}
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
      </div>
      <div style={{ paddingBottom: '10px' }}>
        <Input.Password
          style={{ maxWidth: '300px' }}
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          visibilityToggle={true}
        />
      </div>
      <div style={{ paddingBottom: '10px' }}>
        <Button type="primary" onClick={onSubmit}>
          Sign up
        </Button>
      </div>
    </div>
  );
};

export default Signup;
