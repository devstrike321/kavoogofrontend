import {jwtDecode} from 'jwt-decode';

export const setToken = (token: string) => localStorage.setItem('token', token);

export const getToken = () => localStorage.getItem('token');

export const removeToken = () => localStorage.removeItem('token');

export const isAuthenticated = () => !!getToken();

export const getUserRole = () => {
  const token = getToken();
  if (token) {
    const decoded: any = jwtDecode(token);
    return decoded.role; // Assume backend includes role in token (admin, team, partner)
  }
  return null;
};