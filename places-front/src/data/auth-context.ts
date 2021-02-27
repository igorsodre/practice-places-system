import { createContext } from 'react';
export interface IAuthContext {
	isLoggedIn: boolean;
	userId?: string;
	login: (arg0?: string) => void;
	logout: () => void;
}

const login = () => {};

const logout = () => {};

const AuthContext = createContext<IAuthContext>({ isLoggedIn: false, login, logout });

export default AuthContext;
