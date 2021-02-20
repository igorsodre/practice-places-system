import React from 'react';
import { BrowserRouter as Router, Redirect, Route, Switch } from 'react-router-dom';
import MainNavigation from './components/Navigation/MainNavigation';
import NewPlace from './places/pages/NewPlace';
import UpdatePlace from './places/pages/UpdatePlace';
import UserPlaces from './places/pages/UserPlaces';
import Users from './users/pages/Users';
import './App.scss';

const App = (): JSX.Element => {
	return (
		<Router>
			<MainNavigation />
			<main>
				<Switch>
					<Route path='/' component={Users} exact />
					<Route path='/places/new' component={NewPlace} exact />
					<Route path='/:userId/places' component={UserPlaces} exact />
					<Route path='/places/:placeId' component={UpdatePlace} exact />
					<Redirect to='/' />
				</Switch>
			</main>
		</Router>
	);
};

export default App;
