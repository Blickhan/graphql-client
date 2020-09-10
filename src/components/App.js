import React, { useEffect } from 'react';
import { BrowserRouter, Switch, Route, Redirect } from 'react-router-dom';
import { Layout } from 'antd';
import Header from './Header';
import Landing from './Landing';
import Login from './Login';
import Signup from './Signup';
import { useAuth } from '../authContext';

const { Content } = Layout;

const App = () => {
  const { loggedInUser, setLoggedInUser } = useAuth();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('loggedInUser'));
    if (user) {
      setLoggedInUser(user);
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <BrowserRouter>
      <Layout style={{ height: '100vh' }}>
        <Header />
        <Content style={{ padding: '20px 50px' }}>
          <Switch>
            <Route exact path="/">
              <Landing />
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
