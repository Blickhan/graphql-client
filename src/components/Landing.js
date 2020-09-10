import React from 'react';
import { useAuth } from '../authContext';

export default () => {
  const { loggedInUser } = useAuth();

  return (
    <div className="content">
      Hello {loggedInUser ? loggedInUser.username : ''} 🚀
    </div>
  );
};
