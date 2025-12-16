import { createContext, useEffect, useState } from "react";

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  // Load token from localStorage on app start
  const [token, setToken] = useState(() => {
    return localStorage.getItem("token");
  });

  const [loading, setLoading] = useState(true);

  // Sync auth state on first render
  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (storedToken) {
      setToken(storedToken);
    }
    setLoading(false);
  }, []);

  // Login handler
  const login = (jwt) => {
    localStorage.setItem("token", jwt);
    setToken(jwt);
  };

  // Logout handler
  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
  };

  // Prevent UI flicker while loading auth state
  if (loading) {
    return <p style={{ textAlign: "center" }}>Loading...</p>;
  }

  return (
    <AuthContext.Provider
      value={{
        token,
        isAuthenticated: !!token,
        login,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
