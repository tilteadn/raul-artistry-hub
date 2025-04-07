
import { useEffect, useState } from "react";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import Layout from "./components/Layout";
import Index from "./pages/Index";
import Artworks from "./pages/Artworks";
import ArtworkPage from "./pages/ArtworkPage";
import AboutMe from "./pages/AboutMe";
import Contact from "./pages/Contact";
import Admin from "./pages/Admin";
import NotFound from "./pages/NotFound";
import CookieConsent, { useCookieConsent } from "./components/CookieConsent";
import { trackVisit } from "./utils/visitor/trackVisit";

const queryClient = new QueryClient();

// This component will handle the visit tracking
const VisitTracker = () => {
  const location = useLocation();
  const { consentGiven } = useCookieConsent();
  
  useEffect(() => {
    // Only track when we have an explicit boolean value for consent
    if (consentGiven === true) {
      // Call the async function
      trackVisit().catch(error => {
        console.error("Failed to track visit:", error);
      });
    }
  }, [location.pathname, consentGiven]);
  
  return null;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <HelmetProvider>
      <TooltipProvider>
        <BrowserRouter>
          <Layout>
            <VisitTracker />
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/obras" element={<Artworks />} />
              <Route path="/obras/:id" element={<ArtworkPage />} />
              <Route path="/sobre-mi" element={<AboutMe />} />
              <Route path="/contacto" element={<Contact />} />
              <Route path="/admin" element={<Admin />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Layout>
        </BrowserRouter>
        <CookieConsent />
        <Toaster />
      </TooltipProvider>
    </HelmetProvider>
  </QueryClientProvider>
);

export default App;
