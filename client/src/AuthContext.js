// ==== AuthContext.js ====
import { createContext, useState, useEffect } from 'react';
import axios from 'axios';

axios.defaults.baseURL = 'http://localhost:5000';

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      axios.get('/auth/user', {
        headers: { Authorization: `${token}` }
      })
        .then(res => setUser(res.data.user))
        .catch(() => {
          localStorage.removeItem('token');
          setUser(null);
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (credentials, navigate, location) => {
    try {
      const res = await axios.post('/auth/login', credentials);
      const { token, user } = res.data;
      localStorage.setItem('token', token);
      setUser(user);
      const from = location.state?.from?.pathname || '/dashboard';
      navigate(from, { replace: true });
    } catch (err) {
      alert('Login failed');
    }
  };

  const register = async (details, navigate) => {
    try {
      const res = await axios.post('/auth/register', details);
      const { token, user } = res.data;
      localStorage.setItem('token', token);
      setUser(user);
      navigate('/dashboard', { replace: true });
    } catch (err) {
      alert('Registration failed',JSON.stringify(err));
      alert(JSON.stringify(err));
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
