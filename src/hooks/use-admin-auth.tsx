
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { User } from "@supabase/supabase-js";

// Define the shape of the user object returned from Supabase admin API
interface AdminUser {
  id: string;
  email?: string;
  created_at?: string;
}

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
      
      console.log("Starting admin authentication process for user:", username);
      
      // Call the Supabase function to verify admin credentials
      const { data: isValidAdmin, error: verifyError } = await supabase.rpc('verify_admin_credentials', {
        username_input: username,
        password_input: password
      });
      
      console.log("Admin credential verification result:", { isValid: isValidAdmin, error: verifyError });
      
      if (verifyError) {
        console.error("Authentication error during verification:", verifyError);
        toast.error("Error de autenticación");
        return false;
      }
      
      if (isValidAdmin === true) {
        console.log("Admin credentials verified successfully");
        
        // Generate a consistent email for the admin user based on username
        const adminEmail = `admin_${username}@example.com`;
        
        // First check if the user already exists in the auth system
        const { data, error: getUserError } = await supabase.auth.admin.listUsers();
        
        if (getUserError) {
          console.error("Error checking if admin user exists:", getUserError);
          
          // Fall back to trying to sign in directly
          const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
            email: adminEmail,
            password: password
          });
          
          if (signInError) {
            console.error("Error signing in admin:", signInError);
            
            // Try to create the user if sign-in fails
            console.log("Attempting to create admin user in auth system");
            const { data: newUser, error: createUserError } = await supabase.auth.admin.createUser({
              email: adminEmail,
              password: password,
              email_confirm: true
            });
            
            if (createUserError) {
              console.error("Failed to create admin user:", createUserError);
              toast.error("Error creating admin user");
              return false;
            }
            
            console.log("Admin user created successfully, signing in");
            
            // Now sign in with the newly created user
            const { error: finalSignInError } = await supabase.auth.signInWithPassword({
              email: adminEmail,
              password: password
            });
            
            if (finalSignInError) {
              console.error("Failed to sign in with newly created admin user:", finalSignInError);
              toast.error("Error signing in with new admin user");
              return false;
            }
          } else {
            console.log("Admin signed in successfully");
          }
        } else {
          // Check if admin user exists in the returned list
          const users = data?.users as AdminUser[] || [];
          const adminUser = users.find(user => user.email === adminEmail);
          
          if (adminUser) {
            console.log("Found existing admin user in auth system, signing in");
            // User exists, sign in
            const { error: signInError } = await supabase.auth.signInWithPassword({
              email: adminEmail,
              password: password
            });
            
            if (signInError) {
              console.error("Error signing in with existing admin credentials:", signInError);
              toast.error("Error signing in");
              return false;
            }
          } else {
            console.log("Admin user doesn't exist in auth system, creating");
            // Create user since they don't exist
            const { error: createUserError } = await supabase.auth.admin.createUser({
              email: adminEmail,
              password: password,
              email_confirm: true
            });
            
            if (createUserError) {
              console.error("Failed to create admin user:", createUserError);
              toast.error("Error creating admin user");
              return false;
            }
            
            console.log("Admin user created successfully, signing in");
            
            // Now sign in
            const { error: finalSignInError } = await supabase.auth.signInWithPassword({
              email: adminEmail,
              password: password
            });
            
            if (finalSignInError) {
              console.error("Failed to sign in with newly created admin user:", finalSignInError);
              toast.error("Error signing in with new admin user");
              return false;
            }
          }
        }
        
        // Verify we now have a valid session
        const { data: { session } } = await supabase.auth.getSession();
        
        if (!session) {
          console.error("Failed to create a valid session");
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
