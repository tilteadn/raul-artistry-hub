
import { useState, useEffect } from "react";

export const useAdminAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for authentication in localStorage or sessionStorage
    const storedAuth = localStorage.getItem("adminAuthenticated") || sessionStorage.getItem("adminAuthenticated");
    
    if (storedAuth === "true") {
      setIsAuthenticated(true);
    }
    
    setIsLoading(false);
  }, []);

  const login = () => {
    setIsAuthenticated(true);
  };

  const logout = () => {
    localStorage.removeItem("adminAuthenticated");
    sessionStorage.removeItem("adminAuthenticated");
    setIsAuthenticated(false);
  };

  return {
    isAuthenticated,
    isLoading,
    login,
    logout
  };
};
