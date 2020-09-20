import React from 'react';
import { message } from 'antd';
import { useMutation, gql } from '@apollo/client';
import GoogleLogin, { GoogleLoginResponse } from 'react-google-login';
import { useAuth } from '../auth.context';

const AUTH_GOOGLE = gql`
  mutation AuthGoogle($accessToken: String!) {
    authGoogle(accessToken: $accessToken) {
      errors {
        message
      }
      user {
        id
      }
    }
  }
`;

export default (): JSX.Element => {
  const { setLoggedInUser } = useAuth();
  const [authGoogle] = useMutation(AUTH_GOOGLE, {
    onCompleted({ authGoogle }) {
      localStorage.setItem('loggedInUser', JSON.stringify(authGoogle.user));
      setLoggedInUser(authGoogle.user);
    },
  });

  const loginWithGoogle = async (response: GoogleLoginResponse) => {
    try {
      const {
        data: {
          authGoogle: { errors },
        },
      } = await authGoogle({
        variables: { accessToken: response.accessToken },
      });

      if (errors) {
        throw new Error(errors[0].message);
      }
    } catch (e) {
      message.error(e.message);
    }
  };

  return (
    <GoogleLogin
      clientId={process.env.GOOGLE_CLIENT_ID!}
      // @ts-ignore
      onSuccess={loginWithGoogle}
      onFailure={({ error, details }) => message.error(`${error}: ${details}`)}
      cookiePolicy={'single_host_origin'}
    />
  );
};
