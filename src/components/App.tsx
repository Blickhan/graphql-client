import React, { useEffect } from 'react';
import { BrowserRouter, Switch, Route, Redirect } from 'react-router-dom';
import { Layout } from 'antd';
import Header from './Header';
import Todos from './Todos';
import Login from './Login';
import Signup from './Signup';
import { useAuth } from '../auth.context';

import './App.css';

const { Content } = Layout;

const App = () => {
  const { loggedInUser, setLoggedInUser } = useAuth();

  useEffect(() => {
    const user = localStorage.getItem('loggedInUser');
    if (user) {
      setLoggedInUser(JSON.parse(user));
    }
  }, [setLoggedInUser]);

  return (
    <BrowserRouter>
      <Layout style={{ minHeight: '100vh' }}>
        <Header />
        <Content style={{ padding: '20px 50px' }}>
          <Switch>
            <Route exact path="/">
              {!loggedInUser ? <Redirect to="/login" /> : <Todos />}
            </Route>
            <Route path="/login">
              {loggedInUser ? <Redirect to="/" /> : <Login />}
            </Route>
            <Route path="/signup">
              {loggedInUser ? <Redirect to="/" /> : <Signup />}
            </Route>
          </Switch>
        </Content>
      </Layout>
    </BrowserRouter>
  );
};

export default App;
