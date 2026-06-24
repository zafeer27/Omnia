import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useTheme } from "@/contexts/ThemeContext";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import NotFound from "@/pages/not-found";
import Login from "@/pages/Login";
import Landing from "@/pages/Landing";
import Onboarding from "@/pages/Onboarding";
import Dashboard from "@/pages/Dashboard";
import Chat from "@/pages/Chat";
import Integrations from "@/pages/Integrations";
import Settings from "@/pages/Settings";
import Reports from "@/pages/Reports";
import Actions from "@/pages/Actions";
import Alerts from "@/pages/Alerts";
import Competitors from "@/pages/Competitors";
import Team from "@/pages/Team";
import InvestorUpdates from "@/pages/InvestorUpdates";
import Goals from "@/pages/Goals";
import Forecast from "@/pages/Forecast";
import Customers from "@/pages/Customers";
import Billing from "@/pages/Billing";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

function Router() {
  return (
    <Switch>
      <Route path="/" component={Login} />
      <Route path="/home" component={Landing} />
      <Route path="/onboarding" component={Onboarding} />
      <Route path="/dashboard">
        <ProtectedRoute><Dashboard /></ProtectedRoute>
      </Route>
      <Route path="/chat">
        <ProtectedRoute><Chat /></ProtectedRoute>
      </Route>
      <Route path="/reports">
        <ProtectedRoute><Reports /></ProtectedRoute>
      </Route>
      <Route path="/integrations">
        <ProtectedRoute><Integrations /></ProtectedRoute>
      </Route>
      <Route path="/settings">
        <ProtectedRoute><Settings /></ProtectedRoute>
      </Route>
      <Route path="/actions">
        <ProtectedRoute><Actions /></ProtectedRoute>
      </Route>
      <Route path="/alerts">
        <ProtectedRoute><Alerts /></ProtectedRoute>
      </Route>
      <Route path="/competitors">
        <ProtectedRoute><Competitors /></ProtectedRoute>
      </Route>
      <Route path="/team">
        <ProtectedRoute><Team /></ProtectedRoute>
      </Route>
      <Route path="/investor-updates">
        <ProtectedRoute><InvestorUpdates /></ProtectedRoute>
      </Route>
      <Route path="/goals">
        <ProtectedRoute><Goals /></ProtectedRoute>
      </Route>
      <Route path="/forecast">
        <ProtectedRoute><Forecast /></ProtectedRoute>
      </Route>
      <Route path="/customers">
        <ProtectedRoute><Customers /></ProtectedRoute>
      </Route>
      <Route path="/billing">
        <ProtectedRoute><Billing /></ProtectedRoute>
      </Route>
      <Route component={NotFound} />
    </Switch>
  );
}

function ThemedToaster() {
  const { theme } = useTheme();
  return <Toaster theme={theme} />;
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
          <Router />
        </WouterRouter>
        <ThemedToaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
