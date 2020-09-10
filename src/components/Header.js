import React from 'react';
import { Link } from 'react-router-dom';
import { Layout, Menu } from 'antd';
import Logout from './Logout';
import { useAuth } from '../authContext';

const { Header } = Layout;

export default () => {
  const { loggedInUser } = useAuth();
  return (
    <Header>
      <div style={{ float: 'left' }}>
        <Link to="/">Home</Link>
      </div>
      {loggedInUser ? (
        <div style={{ float: 'right' }}>
          <Logout />
        </div>
      ) : (
        <Menu theme="dark" mode="horizontal" style={{ float: 'right' }}>
          <Menu.Item key="1">
            <Link to="/login">Login</Link>
          </Menu.Item>
          <Menu.Item key="2">
            <Link to="/signup">Sign up</Link>
          </Menu.Item>
        </Menu>
      )}
    </Header>
  );
};
