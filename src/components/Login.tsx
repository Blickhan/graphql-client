import React, { useState } from 'react';
import { Input, Button, Alert } from 'antd';
import { useMutation, gql } from '@apollo/client';
import { useAuth } from '../auth.context';
import GoogleLogin from './GoogleLogin';

const LOGIN = gql`
  mutation Login($email: String!, $password: String!) {
    login(userInput: { email: $email, password: $password }) {
      errors {
        message
      }
      user {
        id
      }
    }
  }
`;

const Login = () => {
  const { setLoggedInUser } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState(null);
  const [login] = useMutation(LOGIN, {
    onCompleted({ login }) {
      localStorage.setItem('loggedInUser', JSON.stringify(login.user));
      setLoggedInUser(login.user);
    },
  });

  const onSubmit = async () => {
    setErrorMessage(null);

    try {
      const {
        data: {
          login: { errors },
        },
      } = await login({ variables: { email, password } });

      if (errors) {
        throw new Error(errors[0].message);
      }
    } catch (e) {
      setErrorMessage(e.message);
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
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
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
      <br />
      <h3 style={{ fontStyle: 'italic', fontWeight: 300 }}>or</h3>
      <br />
      <GoogleLogin />
    </div>
  );
};

export default Login;
