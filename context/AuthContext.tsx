'use client';
import { createContext, useContext, useReducer, ReactNode, useEffect } from 'react';
import { AuthAPI } from '@/lib/api';

interface User {
  id: number;
  name: string;
  email: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
}

type Action = { type: 'LOGIN'; payload: { user: User; token: string } } | { type: 'LOGOUT' };

const initialState: AuthState = { user: null, token: null };

function reducer(state: AuthState, action: Action): AuthState {
  switch (action.type) {
    case 'LOGIN':
      return { user: action.payload.user, token: action.payload.token };
    case 'LOGOUT':
      return { user: null, token: null };
    default:
      return state;
  }
}

const AuthContext = createContext<{
  state: AuthState;
  login: (email: string, password: string) => Promise<void>;
  register: (
    name: string,
    email: string,
    password: string,
    password_confirmation: string
  ) => Promise<void>;
  logout: () => Promise<void>;
}>({
  state: initialState,
  login: async () => {},
  register: async () => {},
  logout: async () => {},
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  // Restore session from localStorage
  useEffect(() => {
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');
    if (token && user) {
      dispatch({
        type: 'LOGIN',
        payload: { token, user: JSON.parse(user) as User },
      });
    }
  }, []);

  async function login(email: string, password: string) {
    const res: any = await AuthAPI.login({ email, password });

    localStorage.setItem('token', res.token);
    localStorage.setItem('user', JSON.stringify(res.user));
    document.cookie = `token=${res.token}; path=/; max-age=${res.expires_in}`;

    dispatch({ type: 'LOGIN', payload: { user: res.user, token: res.token } });
  }

  async function register(
    name: string,
    email: string,
    password: string,
    password_confirmation: string
  ) {
    const res: any = await AuthAPI.register({
      name,
      email,
      password,
      password_confirmation,
    });

    // auto login after successful register
    localStorage.setItem('token', res.token);
    localStorage.setItem('user', JSON.stringify(res.user));
    document.cookie = `token=${res.token}; path=/; max-age=${res.expires_in}`;

    dispatch({ type: 'LOGIN', payload: { user: res.user, token: res.token } });
  }

  async function logout() {
    try {
      if (state.token) await AuthAPI.logout(state.token);
    } catch (e) {
      console.error('Logout API failed', e);
    }
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    document.cookie = 'token=; path=/; max-age=0';
    dispatch({ type: 'LOGOUT' });
  }

  return (
    <AuthContext.Provider value={{ state, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
