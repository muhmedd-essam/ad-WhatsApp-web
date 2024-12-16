import { jwtDecode } from "jwt-decode";

// Save the token to local storage
export const setToken = (token) => {
  localStorage.setItem("token", token);
};

// Get the token from local storage
export const getToken = () => {
  return localStorage.getItem("token");
};

// Remove the token from local storage
export const removeToken = () => {
  localStorage.removeItem("token");
};

// Decode the token to get user information
export const decodeToken = (token) => {
  try {
    return jwtDecode(token);
  } catch (error) {
    console.error("Failed to decode token", error);
    return null;
  }
};

// Check if the token is expired
export const isTokenExpired = (token) => {
  const decoded = decodeToken(token);
  if (!decoded || !decoded.exp) {
    return true;
  }
  return decoded.exp < Date.now() / 1000;
};

// Get user info from the token
export const getUserFromToken = (token) => {
  const decoded = decodeToken(token);
  return decoded ? decoded.user : null;
};

//
export const hasToken = () => {
  return !!getToken();
};
