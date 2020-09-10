import React, { createContext, useState, useContext } from 'react';

const Context = createContext();

export const AuthProvider = ({ children }) => {
  const [loggedInUser, setLoggedInUser] = useState(null);
  return (
    <Context.Provider value={[loggedInUser, setLoggedInUser]}>
      {children}
    </Context.Provider>
  );
};

export const useAuth = () => {
  const [loggedInUser, setLoggedInUser] = useContext(Context);

  return {
    loggedInUser,
    setLoggedInUser,
  };
};
