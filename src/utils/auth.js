import axios from 'axios';

export const setToken = (token) => {
  localStorage.setItem("token", token);
  axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
};

export const getToken = () => {
  return localStorage.getItem("token");
};

export const logout = () => {
  localStorage.removeItem("token");
  delete axios.defaults.headers.common['Authorization'];
};

export const isLoggedIn = () => {
  return !!localStorage.getItem("token");
};