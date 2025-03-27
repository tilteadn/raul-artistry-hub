
import { useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import Layout from "./components/Layout";
import Index from "./pages/Index";
import Artworks from "./pages/Artworks";
import ArtworkPage from "./pages/ArtworkPage";
import Contact from "./pages/Contact";
import Admin from "./pages/Admin";
import NotFound from "./pages/NotFound";
import { trackVisit } from "./utils/visitorTrackingService";

const queryClient = new QueryClient();

// This component will handle the visit tracking
const VisitTracker = () => {
  const location = useLocation();
  
  useEffect(() => {
    trackVisit();
  }, [location.pathname]);
  
  return null;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <BrowserRouter>
        <Layout>
          <VisitTracker />
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/obras" element={<Artworks />} />
            <Route path="/obras/:id" element={<ArtworkPage />} />
            <Route path="/contacto" element={<Contact />} />
            <Route path="/admin" element={<Admin />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Layout>
      </BrowserRouter>
      <Toaster />
      <Sonner />
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
