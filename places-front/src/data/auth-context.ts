import { createContext } from 'react';
export interface IAuthContext {
  isLoggedIn: boolean;
  userId?: string;
  login: (arg0?: string, arg1?: string) => void;
  logout: () => void;
  token: Nullable<string>;
}

const login = () => {};

const logout = () => {};

const AuthContext = createContext<IAuthContext>({ isLoggedIn: false, login, logout, token: '' });

export default AuthContext;
