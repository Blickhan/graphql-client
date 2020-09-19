import React, { useState } from 'react';
import { Input, Button, Alert } from 'antd';
import { useMutation, gql } from '@apollo/client';
import { useAuth } from '../auth.context';
import GoogleLogin from './GoogleLogin';

const SIGNUP = gql`
  mutation Signup($username: String!, $password: String!) {
    signup(userInput: { username: $username, password: $password }) {
      errors {
        message
      }
      user {
        id
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
      localStorage.setItem('loggedInUser', JSON.stringify(signup.user));
      setLoggedInUser(signup.user);
    },
  });

  const onSubmit = async () => {
    setErrorMessage(null);

    try {
      const {
        data: {
          signup: { errors },
        },
      } = await signup({ variables: { username, password } });

      if (errors) {
        throw new Error(errors[0].message);
      }
    } catch (e) {
      setErrorMessage(e.message);
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
          type="username"
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
      <br />
      <h3 style={{ fontStyle: 'italic', fontWeight: 300 }}>or</h3>
      <br />
      <GoogleLogin />
    </div>
  );
};

export default Signup;
