import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AppProvider, useApp } from "./context/AppContext";
import { VipLayout } from "./components/VipLayout";
import Dashboard from "./pages/Dashboard";
import Operations from "./pages/Operations";
import Methods from "./pages/Methods";
import History from "./pages/History";
import SettingsPage from "./pages/SettingsPage";
import LoginPage from "./pages/LoginPage";
import AdminPanel from "./pages/AdminPanel";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

function AuthGate({ children }: { children: React.ReactNode }) {
  const { isLoggedIn } = useApp();
  if (!isLoggedIn) return <Navigate to="/login" replace />;
  return <>{children}</>;
}

function AdminGate({ children }: { children: React.ReactNode }) {
  const { isAdmin } = useApp();
  if (!isAdmin) return <Navigate to="/" replace />;
  return <>{children}</>;
}

function LoginGate() {
  const { isLoggedIn } = useApp();
  if (isLoggedIn) return <Navigate to="/" replace />;
  return <LoginPage />;
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <AppProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<LoginGate />} />
            <Route path="*" element={
              <AuthGate>
                <VipLayout>
                  <Routes>
                    <Route path="/" element={<Dashboard />} />
                    <Route path="/operacoes" element={<Operations />} />
                    <Route path="/membros" element={<AdminGate><AdminPanel /></AdminGate>} />
                    <Route path="/metodos" element={<Methods />} />
                    <Route path="/historico" element={<History />} />
                    <Route path="/configuracoes" element={<SettingsPage />} />
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                </VipLayout>
              </AuthGate>
            } />
          </Routes>
        </BrowserRouter>
      </AppProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
