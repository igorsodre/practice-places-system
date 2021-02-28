import React, { useCallback, useEffect, useState } from 'react';
import { BrowserRouter as Router, Redirect, Route, Switch } from 'react-router-dom';

import MainNavigation from './components/Navigation/MainNavigation';
import NewPlace from './places/pages/NewPlace';
import UpdatePlace from './places/pages/UpdatePlace';
import UserPlaces from './places/pages/UserPlaces';
import Users from './users/pages/Users';
import Authentication from './users/pages/Authentication';

import './App.scss';
import AuthContext from './data/auth-context';

let activeTimer: NodeJS.Timeout;
const App = (): JSX.Element => {
  const [token, setToken] = useState<Nullable<string>>(null);
  const [expireDate, setExpireDate] = useState<Nullable<string>>();
  const [userId, setUserId] = useState<string>();

  const login = useCallback((userId?: string, token?: string, expirationDate?: string) => {
    localStorage.setItem('token', token || '');
    localStorage.setItem('userId', userId || '');
    const tokenExpirationDate = expirationDate || new Date(new Date().getTime() + 1000 * 60 * 60).toISOString();
    localStorage.setItem('tokenExpirationDate', tokenExpirationDate);

    setExpireDate(tokenExpirationDate);
    setToken(token);
    setUserId(userId);
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    localStorage.removeItem('tokenExpirationDate');
    setToken(null);
    setUserId(undefined);
    setExpireDate(undefined);
  }, []);

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    const storedUserId = localStorage.getItem('userId');
    const tokenExpirationDate = localStorage.getItem('tokenExpirationDate');
    if (storedToken && storedUserId && tokenExpirationDate && new Date(tokenExpirationDate) > new Date()) {
      login(storedUserId, storedToken, tokenExpirationDate);
    }
  }, [login]);

  useEffect(() => {
    if (token && expireDate) {
      const remaningTime = new Date(expireDate).getTime() - new Date().getTime();
      activeTimer = setTimeout(logout, remaningTime);
    } else {
      clearTimeout(activeTimer);
    }
  }, [token, expireDate, logout]);

  let routes: JSX.Element;
  if (!token) {
    routes = (
      <Switch>
        <Route path="/" component={Users} exact />
        <Route path="/:userId/places" component={UserPlaces} exact />
        <Route path="/auth" component={Authentication} exact />
        <Redirect to="/auth" />
      </Switch>
    );
  } else {
    routes = (
      <Switch>
        <Route path="/" component={Users} exact />
        <Route path="/places/new" component={NewPlace} exact />
        <Route path="/places/:placeId" component={UpdatePlace} exact />
        <Route path="/:userId/places" component={UserPlaces} exact />
        <Redirect to="/" />
      </Switch>
    );
  }

  return (
    <AuthContext.Provider value={{ isLoggedIn: Boolean(token), login, logout, userId, token }}>
      <Router>
        <MainNavigation />
        <main>{routes}</main>
      </Router>
    </AuthContext.Provider>
  );
};

export default App;
