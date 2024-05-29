import { useContext, createContext, useState, useEffect } from "react";
import PropTypes from 'prop-types'
const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsAuthenticated(!!token)
  }, [])

  const login = () => {
    setIsAuthenticated(true);
  }

  const logOut = () => {
    localStorage.removeItem("token");
    setIsAuthenticated(false);
  }
  return <AuthContext.Provider value={{ logOut, login, isAuthenticated }}>
    {children}
    </AuthContext.Provider>
}

AuthProvider.propTypes ={
  children: PropTypes.node
}
export default AuthProvider;

export const useAuth = () => {
  return useContext(AuthContext);
}