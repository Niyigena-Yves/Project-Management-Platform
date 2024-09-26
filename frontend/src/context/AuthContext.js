import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const res = await axios.get('http://localhost:5000/api/users/profile', {
          headers: { 'x-auth-token': token }
        });
        setUser(res.data);
      } catch (err) {
        console.error('Error loading user:', err);
        localStorage.removeItem('token');
      }
    }
    setLoading(false);
  };

  const login = async (email, password) => {
    try {
      const res = await axios.post('http://localhost:5000/api/users/login', { email, password });
      console.log('Login response:', res.data);
      if (res.data.token) {
        localStorage.setItem('token', res.data.token);
        if (res.data.user) {
          setUser(res.data.user);
        } else {
          
          await loadUser();
        }
        return true;
      } else {
        console.error('Login successful but no token received');
        return false;
      }
    } catch (err) {
      console.error('Login error:', err);
      return false;
    }
  };

  const register = async (username, email, password) => {
    try {
      const res = await axios.post('http://localhost:5000/api/users/register', { username, email, password });
      console.log('Registration response:', res.data);
      if (res.data.token) {
        localStorage.setItem('token', res.data.token);
        if (res.data.user) {
          setUser(res.data.user);
        } else {
          await loadUser();
        }
        return true;
      } else {
        console.error('Registration successful but no token received');
        return false;
      }
    } catch (err) {
      console.error('Registration error:', err);
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, loadUser }}>
      {children}
    </AuthContext.Provider>
  );
};