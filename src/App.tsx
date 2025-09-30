import { useEffect, useState } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { SplashScreen } from '@capacitor/splash-screen';
import Index from "./pages/Index";

const queryClient = new QueryClient();

const App = () => {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const initializeApp = async () => {
      try {
        // Show splash screen
        await SplashScreen.show({
          showDuration: 1500,
          autoHide: true,
        });

        // Simulate app initialization time
        // In a real app, you might load data, check authentication, etc.
        await new Promise(resolve => setTimeout(resolve, 1500));

        // App is ready
        setIsReady(true);

        // Hide splash screen
        await SplashScreen.hide();
      } catch (error) {
        console.error('Error initializing app:', error);
        // Still show the app even if splash screen fails
        setIsReady(true);
      }
    };

    initializeApp();
  }, []);

  if (!isReady) {
    return null; // Splash screen is handled by Capacitor
  }

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <Index />
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
