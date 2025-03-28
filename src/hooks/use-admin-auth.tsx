
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

  const login = (username: string, password: string): boolean => {
    // For demonstration purposes - in a real app, this would validate against Supabase
    // Using hardcoded credentials for now as specified in the requirements
    const isValid = username === "bossman" && password === "RaulM0la!";
    
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
