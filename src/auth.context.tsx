import React, { createContext, useState, useContext } from 'react';
import { User } from './models/User';

interface AuthContextProps {
  loggedInUser?: User;
  setLoggedInUser: Function;
}

const AuthContext = createContext<AuthContextProps>({
  setLoggedInUser: () => {},
});

interface AuthProviderProps {
  children: JSX.Element;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [loggedInUser, setLoggedInUser] = useState();
  return (
    <AuthContext.Provider value={{ loggedInUser, setLoggedInUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextProps => {
  const { loggedInUser, setLoggedInUser } = useContext(AuthContext);

  return {
    loggedInUser,
    setLoggedInUser,
  };
};
