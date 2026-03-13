import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { VipLayout } from "./components/VipLayout";
import Dashboard from "./pages/Dashboard";
import Operations from "./pages/Operations";
import Methods from "./pages/Methods";
import History from "./pages/History";
import SettingsPage from "./pages/SettingsPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <VipLayout>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/operacoes" element={<Operations />} />
            <Route path="/metodos" element={<Methods />} />
            <Route path="/historico" element={<History />} />
            <Route path="/configuracoes" element={<SettingsPage />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </VipLayout>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
