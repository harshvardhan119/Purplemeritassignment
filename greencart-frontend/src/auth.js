import {jwtDecode} from 'jwt-decode';

export function setToken(token) { localStorage.setItem('token', token); }
export function getToken() { return localStorage.getItem('token'); }
export function removeToken() { localStorage.removeItem('token'); }
export function isLoggedIn() { return !!getToken(); }

export function currentUser() {
  try {
    const t = getToken();
    if (!t) return null;
    return jwtDecode(t);
  } catch {
    return null;
  }
}
