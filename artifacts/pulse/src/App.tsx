import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
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
      <Route path="/dashboard" component={Dashboard} />
      <Route path="/chat" component={Chat} />
      <Route path="/reports" component={Reports} />
      <Route path="/integrations" component={Integrations} />
      <Route path="/settings" component={Settings} />
      <Route path="/actions" component={Actions} />
      <Route path="/alerts" component={Alerts} />
      <Route path="/competitors" component={Competitors} />
      <Route path="/team" component={Team} />
      <Route path="/investor-updates" component={InvestorUpdates} />
      <Route path="/goals" component={Goals} />
      <Route path="/forecast" component={Forecast} />
      <Route path="/customers" component={Customers} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
          <Router />
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
