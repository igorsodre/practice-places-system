import React, { useCallback, useState } from 'react';
import { BrowserRouter as Router, Redirect, Route, Switch } from 'react-router-dom';

import MainNavigation from './components/Navigation/MainNavigation';
import NewPlace from './places/pages/NewPlace';
import UpdatePlace from './places/pages/UpdatePlace';
import UserPlaces from './places/pages/UserPlaces';
import Users from './users/pages/Users';
import Authentication from './users/pages/Authentication';

import './App.scss';
import AuthContext from './data/auth-context';

const App = (): JSX.Element => {
	const [isLoggedIn, setIsLoggedIn] = useState(false);

	const login = useCallback(() => {
		setIsLoggedIn(true);
	}, []);

	const logout = useCallback(() => {
		setIsLoggedIn(false);
	}, []);

	let routes: JSX.Element;
	if (!isLoggedIn) {
		routes = (
			<Switch>
				<Route path='/' component={Users} exact />
				<Route path='/:userId/places' component={UserPlaces} exact />
				<Route path='/auth' component={Authentication} exact />
				<Redirect to='/auth' />
			</Switch>
		);
	} else {
		routes = (
			<Switch>
				<Route path='/' component={Users} exact />
				<Route path='/places/new' component={NewPlace} exact />
				<Route path='/places/:placeId' component={UpdatePlace} exact />
				<Route path='/:userId/places' component={UserPlaces} exact />
				<Redirect to='/' />
			</Switch>
		);
	}

	return (
		<AuthContext.Provider value={{ isLoggedIn, login, logout }}>
			<Router>
				<MainNavigation />
				<main>{routes}</main>
			</Router>
		</AuthContext.Provider>
	);
};

export default App;
