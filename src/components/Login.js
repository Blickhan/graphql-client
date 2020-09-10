import React, { useState } from 'react';
import { Input, Button, Alert } from 'antd';
import { useMutation, gql } from '@apollo/client';
import { useAuth } from '../authContext';

const LOGIN = gql`
  mutation Login($username: String!, $password: String!) {
    login(userInput: { username: $username, password: $password }) {
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

const Login = () => {
  const { setLoggedInUser } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState(null);
  const [login] = useMutation(LOGIN, {
    onCompleted({ login }) {
      setLoggedInUser(login.user);
      localStorage.setItem('loggedInUser', JSON.stringify(login.user));
    },
  });

  const onSubmit = async () => {
    setErrorMessage(null);

    try {
      const {
        data: {
          login: { error },
        },
      } = await login({ variables: { username, password } });

      if (error) {
        setErrorMessage(error.message);
      }
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="content">
      <h2>Login</h2>
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
          Login
        </Button>
      </div>
    </div>
  );
};

export default Login;
