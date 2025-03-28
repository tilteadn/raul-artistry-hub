
import { useState, useEffect } from "react";

// Define valid credentials
const ADMIN_USERNAME = "bossman";
const ADMIN_PASSWORD = "RaulM0la!";

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

  const login = (username: string, password: string): boolean => {
    // Validate credentials
    const isValid = username === ADMIN_USERNAME && password === ADMIN_PASSWORD;
    
    if (isValid) {
      setIsAuthenticated(true);
      return true;
    }
    
    return false;
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
