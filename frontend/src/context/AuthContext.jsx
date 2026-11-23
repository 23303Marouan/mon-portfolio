import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [isAdmin, setIsAdmin] = useState(
    () => localStorage.getItem("isAdmin") === "true"
  );

  useEffect(() => {
    localStorage.setItem("isAdmin", isAdmin);
  }, [isAdmin]);

  return (
    <AuthContext.Provider value={{ isAdmin, setIsAdmin }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
