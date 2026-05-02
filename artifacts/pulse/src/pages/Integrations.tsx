import { useState } from "react";
import AppLayout from "@/components/AppLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, Loader2, Plus, Unplug } from "lucide-react";
import {
  SiStripe,
  SiShopify,
  SiHubspot,
  SiSalesforce,
  SiIntuit,
  SiXero,
  SiGoogleanalytics,
  SiMeta,
  SiGoogleads,
  SiMailchimp,
  SiSlack,
  SiNotion,
  SiIntercom,
  SiMixpanel,
} from "react-icons/si";

type Integration = {
  id: string;
  name: string;
  category: string;
  icon: any;
  description: string;
};

const integrations: Integration[] = [
  { id: "stripe", name: "Stripe", category: "Payments", icon: SiStripe, description: "Revenue, subscriptions, and payment data" },
  { id: "shopify", name: "Shopify", category: "eCommerce", icon: SiShopify, description: "Orders, customers, and product analytics" },
  { id: "hubspot", name: "HubSpot", category: "CRM", icon: SiHubspot, description: "Deals, contacts, and pipeline data" },
  { id: "salesforce", name: "Salesforce", category: "CRM", icon: SiSalesforce, description: "Enterprise CRM and sales forecasting" },
  { id: "quickbooks", name: "QuickBooks", category: "Finance", icon: SiIntuit, description: "P&L, expenses, and cash flow" },
  { id: "xero", name: "Xero", category: "Finance", icon: SiXero, description: "Accounting and financial reporting" },
  { id: "ga", name: "Google Analytics", category: "Analytics", icon: SiGoogleanalytics, description: "Traffic, conversions, and user behavior" },
  { id: "meta", name: "Meta Ads", category: "Marketing", icon: SiMeta, description: "Facebook and Instagram ad performance" },
  { id: "googleads", name: "Google Ads", category: "Marketing", icon: SiGoogleads, description: "Search and display ad spend and ROI" },
  { id: "klaviyo", name: "Klaviyo", category: "Marketing", icon: SiMailchimp, description: "Email marketing flows and revenue" },
  { id: "mailchimp", name: "Mailchimp", category: "Marketing", icon: SiMailchimp, description: "Email campaigns and audience data" },
  { id: "slack", name: "Slack", category: "Productivity", icon: SiSlack, description: "Team alerts and Pulse notifications" },
  { id: "notion", name: "Notion", category: "Productivity", icon: SiNotion, description: "Sync reports to your workspace" },
  { id: "intercom", name: "Intercom", category: "Support", icon: SiIntercom, description: "Customer conversations and CSAT" },
  { id: "mixpanel", name: "Mixpanel", category: "Analytics", icon: SiMixpanel, description: "Product usage and retention metrics" },
];

const categories = ["All", ...Array.from(new Set(integrations.map((i) => i.category)))];

export default function Integrations() {
  const [connected, setConnected] = useState<Record<string, boolean>>({ stripe: true, hubspot: true });
  const [connecting, setConnecting] = useState<Integration | null>(null);
  const [connectSuccess, setConnectSuccess] = useState(false);
  const [activeCategory, setActiveCategory] = useState("All");

  const handleConnect = (integration: Integration) => {
    if (connected[integration.id]) {
      setConnected((prev) => { const next = { ...prev }; delete next[integration.id]; return next; });
      return;
    }
    setConnecting(integration);
    setConnectSuccess(false);
    setTimeout(() => {
      setConnectSuccess(true);
      setConnected((prev) => ({ ...prev, [integration.id]: true }));
      setTimeout(() => setConnecting(null), 1500);
    }, 2000);
  };

  const filtered = activeCategory === "All" ? integrations : integrations.filter((i) => i.category === activeCategory);
  const connectedCount = Object.keys(connected).length;

  return (
    <AppLayout>
      <div className="flex-1 overflow-auto p-8">
        <div className="max-w-5xl mx-auto space-y-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold tracking-tight">Integrations</h1>
              <p className="text-muted-foreground mt-1">{connectedCount} of {integrations.length} connected</p>
            </div>
            <Button variant="outline" size="sm" className="gap-2">
              <Plus className="h-4 w-4" />
              Request integration
            </Button>
          </div>

          <div className="flex gap-2 flex-wrap">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                  activeCategory === cat
                    ? "bg-primary text-primary-foreground"
                    : "bg-secondary text-muted-foreground hover:text-foreground"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <motion.div
            layout
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
          >
            <AnimatePresence>
              {filtered.map((integration) => {
                const isConnected = connected[integration.id];
                return (
                  <motion.div
                    key={integration.id}
                    layout
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Card className={`transition-all ${isConnected ? "border-primary/30 bg-primary/5" : "hover:border-border/80"}`}>
                      <CardContent className="p-5">
                        <div className="flex items-start justify-between mb-3">
                          <div className={`text-3xl ${isConnected ? "text-primary" : "text-muted-foreground"}`}>
                            <integration.icon />
                          </div>
                          {isConnected && (
                            <span className="flex items-center gap-1 text-xs font-medium text-green-500 bg-green-500/10 px-2 py-0.5 rounded-full">
                              <CheckCircle2 className="h-3 w-3" />
                              Connected
                            </span>
                          )}
                        </div>
                        <h3 className="font-semibold text-sm">{integration.name}</h3>
                        <p className="text-xs text-muted-foreground mt-0.5 mb-4">{integration.description}</p>
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-muted-foreground bg-secondary px-2 py-0.5 rounded">{integration.category}</span>
                          <Button
                            variant={isConnected ? "ghost" : "outline"}
                            size="sm"
                            className={`h-7 text-xs gap-1.5 ${isConnected ? "text-muted-foreground hover:text-destructive" : ""}`}
                            onClick={() => handleConnect(integration)}
                          >
                            {isConnected ? (
                              <><Unplug className="h-3 w-3" />Disconnect</>
                            ) : (
                              <>Connect</>
                            )}
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </motion.div>
        </div>
      </div>

      <Dialog open={!!connecting} onOpenChange={(open) => !open && setConnecting(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-center text-xl">
              {connectSuccess ? "Connection Successful" : `Connecting to ${connecting?.name}...`}
            </DialogTitle>
            <DialogDescription className="text-center">
              {connectSuccess
                ? `${connecting?.name} has been successfully connected to Pulse.`
                : "Please wait while we establish a secure connection."}
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col items-center justify-center py-10">
            <AnimatePresence mode="wait">
              {!connectSuccess ? (
                <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-col items-center gap-6">
                  <div className="relative flex items-center justify-center">
                    <div className="absolute inset-0 bg-primary/20 rounded-full blur-xl animate-pulse" />
                    <div className="h-20 w-20 bg-card border border-border rounded-2xl flex items-center justify-center text-4xl shadow-xl z-10 relative">
                      {connecting?.icon && <connecting.icon />}
                    </div>
                  </div>
                  <Loader2 className="h-6 w-6 animate-spin text-primary" />
                </motion.div>
              ) : (
                <motion.div key="success" initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} className="flex flex-col items-center gap-6">
                  <div className="h-20 w-20 bg-green-500/10 border border-green-500/20 rounded-full flex items-center justify-center text-green-500 shadow-[0_0_30px_rgba(34,197,94,0.2)]">
                    <CheckCircle2 className="h-10 w-10" />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </DialogContent>
      </Dialog>
    </AppLayout>
  );
}
