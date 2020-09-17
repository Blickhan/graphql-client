import React from 'react';
import { Link } from 'react-router-dom';
import { Layout, Menu } from 'antd';
import Logout from './Logout';
import { useAuth } from '../auth.context';

const { Header } = Layout;

export default () => {
  const { loggedInUser } = useAuth();
  return (
    <Header>
      <div style={{ float: 'right' }}>
        {loggedInUser ? (
          <Logout />
        ) : (
          <Menu theme="dark" mode="horizontal">
            <Menu.Item key="1">
              <Link to="/login">Login</Link>
            </Menu.Item>
            <Menu.Item key="2">
              <Link to="/signup">Sign up</Link>
            </Menu.Item>
          </Menu>
        )}
      </div>
    </Header>
  );
};
