import { Navigate } from "react-router-dom";

function RedirectIfAuthentication({ children }) {
  const isAuthenticated = !!localStorage.getItem("token");
  return isAuthenticated ? <Navigate to={"/dashboard"} /> : children;
}

export default RedirectIfAuthentication;
