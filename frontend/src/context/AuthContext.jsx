import { createContext, useCallback, useEffect, useState } from 'react';
import { authApi } from '../services/api/authApi';
import { userApi } from '../services/api/userApi';

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (!token) {

      setLoading(false);
      return;
    }
    userApi
      .getMe()
      .then(setUser)
      .catch(() => {

        localStorage.removeItem('accessToken');
      })
      .finally(() => setLoading(false));
  }, []);

  const login = useCallback(async (email, password) => {
    const data = await authApi.login(email, password);
    localStorage.setItem('accessToken', data.accessToken);
    const me = await userApi.getMe();
    setUser(me);
    return me;
  }, []);

  const register = useCallback(async (payload) => {
    const data = await authApi.register(payload);
    localStorage.setItem('accessToken', data.accessToken);
    const me = await userApi.getMe();
    setUser(me);
    return me;
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('accessToken');
    setUser(null);
  }, []);

  const refreshUser = useCallback(async () => {
    const me = await userApi.getMe();
    setUser(me);
    return me;
  }, []);

  const value = { user, loading, isAuthenticated: Boolean(user), login, register, logout, refreshUser };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

