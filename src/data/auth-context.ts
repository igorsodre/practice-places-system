import { createContext } from 'react';
export interface IAuthContext {
	isLoggedIn: boolean;
	login: () => void;
	logout: () => void;
}

const login = () => {};

const logout = () => {};

const AuthContext = createContext<IAuthContext>({ isLoggedIn: false, login, logout });

export default AuthContext;
