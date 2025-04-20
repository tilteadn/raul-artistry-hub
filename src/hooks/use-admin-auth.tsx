
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

export const useAdminAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Check authentication status on mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        // First check for stored auth in localStorage/sessionStorage
        const storedAuth = localStorage.getItem("adminAuthenticated") || sessionStorage.getItem("adminAuthenticated");
        
        // Then verify with Supabase to confirm auth is still valid
        const { data: { session } } = await supabase.auth.getSession();
        
        console.log("Admin auth check:", {
          hasStoredAuth: storedAuth === "true",
          hasValidSession: !!session
        });
        
        // Only consider authenticated if both local storage AND session are valid
        if (storedAuth === "true" && session) {
          setIsAuthenticated(true);
          console.log("Admin authentication confirmed");
        } else {
          // If there's a mismatch, clear local storage
          if (storedAuth === "true" && !session) {
            console.warn("Stored auth exists but no valid session found. Clearing stored auth.");
            localStorage.removeItem("adminAuthenticated");
            sessionStorage.removeItem("adminAuthenticated");
          }
          setIsAuthenticated(false);
        }
      } catch (error) {
        console.error("Error checking authentication status:", error);
        setIsAuthenticated(false);
      } finally {
        setIsLoading(false);
      }
    };
    
    checkAuth();
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
        // Log the successful authentication
        console.log("Admin credentials verified successfully");
        
        // Create a session for the admin user
        const { error: signInError } = await supabase.auth.signInWithPassword({
          email: `admin_${username}@example.com`, // Use a consistent email based on username
          password: password
        });
        
        if (signInError) {
          console.error("Error creating session:", signInError);
          toast.error("Error creating session");
          return false;
        }
        
        // Update the authentication state
        setIsAuthenticated(true);
        console.log("Admin authentication complete and session created");
        
        // Store auth status based on remember me preference
        // This will be handled in the component
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

  const logout = async () => {
    try {
      // Sign out from Supabase
      await supabase.auth.signOut();
      console.log("Admin signed out from Supabase");
      
      // Clear local storage
      localStorage.removeItem("adminAuthenticated");
      sessionStorage.removeItem("adminAuthenticated");
      
      // Update state
      setIsAuthenticated(false);
    } catch (error) {
      console.error("Error during logout:", error);
      toast.error("Error al cerrar sesión");
    }
  };

  return {
    isAuthenticated,
    setIsAuthenticated, // Expose this to allow direct state updates
    isLoading,
    login,
    logout
  };
};
