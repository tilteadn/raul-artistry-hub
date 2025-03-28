
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

export const useAdminAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Check authentication status on mount
  useEffect(() => {
    // Check for authentication in localStorage or sessionStorage
    const storedAuth = localStorage.getItem("adminAuthenticated") || sessionStorage.getItem("adminAuthenticated");
    
    if (storedAuth === "true") {
      setIsAuthenticated(true);
    }
    
    setIsLoading(false);
  }, []);

  const login = async (username: string, password: string): Promise<boolean> => {
    try {
      setIsLoading(true);
      
      // Call the Supabase function to verify admin credentials
      const { data, error } = await supabase.rpc('verify_admin_credentials', {
        username_input: username,
        password_input: password
      });
      
      if (error) {
        console.error("Authentication error:", error);
        toast.error("Error de autenticación");
        return false;
      }
      
      if (data === true) {
        setIsAuthenticated(true);
        return true;
      } else {
        toast.error("Credenciales incorrectas");
        return false;
      }
    } catch (error) {
      console.error("Authentication error:", error);
      toast.error("Error al iniciar sesión");
      return false;
    } finally {
      setIsLoading(false);
    }
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
