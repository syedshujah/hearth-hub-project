import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { LocalAuthProvider } from "@/contexts/LocalAuthContext";
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { store, persistor } from '@/store';
import { useEffect } from 'react';
import initializeSampleData from '@/utils/initializeData';

// Pages
import HomePage from "./pages/HomePage";
import PropertyListings from "./pages/PropertyListings";
import PropertyDetails from "./pages/PropertyDetails";
import UserDashboard from "./pages/UserDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import AboutPage from "./pages/AboutPage";
import ContactPage from "./pages/ContactPage";
import BlogPage from "./pages/BlogPage";
import BlogDetails from "./pages/BlogDetails";
import AuthCallback from "./pages/AuthCallback";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const AppContent = () => {
  useEffect(() => {
    // Initialize sample data after the store is rehydrated
    const timer = setTimeout(() => {
      initializeSampleData();
    }, 100);
    
    return () => clearTimeout(timer);
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <LocalAuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/listings" element={<PropertyListings />} />
              <Route path="/property/:id" element={<PropertyDetails />} />
              <Route path="/dashboard" element={<UserDashboard />} />
              <Route path="/add-property" element={<UserDashboard initialTab="add-property" />} />
              <Route path="/admin" element={<AdminDashboard />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/signup" element={<SignupPage />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/contact" element={<ContactPage />} />
              <Route path="/blog" element={<BlogPage />} />
              <Route path="/blog/:id" element={<BlogDetails />} />
              <Route path="/auth/callback" element={<AuthCallback />} />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </LocalAuthProvider>
    </QueryClientProvider>
  );
};

const App = () => (
  <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
      <AppContent />
    </PersistGate>
  </Provider>
);

export default App;
