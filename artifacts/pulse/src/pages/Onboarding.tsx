import { useState } from "react";
import { Link, useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Loader2, CheckCircle2, ArrowRight } from "lucide-react";
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
  icon: any;
};

const integrations: Integration[] = [
  { id: "stripe", name: "Stripe", icon: SiStripe },
  { id: "shopify", name: "Shopify", icon: SiShopify },
  { id: "hubspot", name: "HubSpot", icon: SiHubspot },
  { id: "salesforce", name: "Salesforce", icon: SiSalesforce },
  { id: "quickbooks", name: "QuickBooks", icon: SiIntuit },
  { id: "xero", name: "Xero", icon: SiXero },
  { id: "ga", name: "Google Analytics", icon: SiGoogleanalytics },
  { id: "meta", name: "Meta Ads", icon: SiMeta },
  { id: "googleads", name: "Google Ads", icon: SiGoogleads },
  { id: "klaviyo", name: "Klaviyo", icon: SiMailchimp },
  { id: "mailchimp", name: "Mailchimp", icon: SiMailchimp },
  { id: "slack", name: "Slack", icon: SiSlack },
  { id: "notion", name: "Notion", icon: SiNotion },
  { id: "intercom", name: "Intercom", icon: SiIntercom },
  { id: "mixpanel", name: "Mixpanel", icon: SiMixpanel },
];

export default function Onboarding() {
  const [, setLocation] = useLocation();
  const [connected, setConnected] = useState<Record<string, boolean>>({});
  const [connecting, setConnecting] = useState<Integration | null>(null);
  const [connectSuccess, setConnectSuccess] = useState(false);

  const handleConnect = (integration: Integration) => {
    if (connected[integration.id]) return;
    
    setConnecting(integration);
    setConnectSuccess(false);

    // Simulate connection delay
    setTimeout(() => {
      setConnectSuccess(true);
      setConnected((prev) => ({ ...prev, [integration.id]: true }));
      
      // Close dialog after success
      setTimeout(() => {
        setConnecting(null);
      }, 1500);
    }, 2000);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.4 } },
  };

  return (
    <div className="min-h-[100dvh] w-full bg-background text-foreground py-12 px-4 md:px-8">
      <div className="max-w-5xl mx-auto space-y-10">
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold tracking-tight">Connect your business tools</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Select the tools you use to run your business. Omnia will unify your data to provide proactive insights.
          </p>
        </div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4"
        >
          {integrations.map((integration) => {
            const isConnected = connected[integration.id];
            
            return (
              <motion.div
                key={integration.id}
                variants={itemVariants}
                className={`relative flex flex-col items-center p-6 rounded-xl border ${
                  isConnected 
                    ? "bg-primary/5 border-primary/30" 
                    : "bg-card border-border hover:border-primary/50"
                } transition-colors group`}
              >
                <div className={`text-4xl mb-4 ${isConnected ? "text-primary" : "text-muted-foreground group-hover:text-foreground"} transition-colors`}>
                  <integration.icon />
                </div>
                <h3 className="font-medium text-sm mb-4">{integration.name}</h3>
                
                {isConnected ? (
                  <div className="flex items-center gap-1.5 text-xs font-medium text-green-500 bg-green-500/10 px-2.5 py-1 rounded-full">
                    <CheckCircle2 className="h-3 w-3" />
                    Connected
                  </div>
                ) : (
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="w-full text-xs h-8"
                    onClick={() => handleConnect(integration)}
                    data-testid={`button-connect-${integration.id}`}
                  >
                    Connect
                  </Button>
                )}
              </motion.div>
            );
          })}
        </motion.div>

        <div className="flex justify-center pt-8 border-t border-border">
          <Button 
            size="lg" 
            className="px-8 h-12 text-base shadow-md"
            onClick={() => setLocation("/dashboard")}
            data-testid="button-continue-dashboard"
          >
            Continue to Dashboard
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
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
                ? `${connecting?.name} has been successfully connected to Omnia.` 
                : "Please wait while we establish a secure connection."}
            </DialogDescription>
          </DialogHeader>
          
          <div className="flex flex-col items-center justify-center py-10">
            <AnimatePresence mode="wait">
              {!connectSuccess ? (
                <motion.div
                  key="loading"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex flex-col items-center gap-6"
                >
                  <div className="relative flex items-center justify-center">
                    <div className="absolute inset-0 bg-primary/20 rounded-full blur-xl animate-pulse" />
                    <div className="h-20 w-20 bg-card border border-border rounded-2xl flex items-center justify-center text-4xl shadow-xl z-10 relative">
                      {connecting?.icon && <connecting.icon />}
                    </div>
                  </div>
                  <Loader2 className="h-6 w-6 animate-spin text-primary" />
                </motion.div>
              ) : (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex flex-col items-center gap-6"
                >
                  <div className="h-20 w-20 bg-green-500/10 border border-green-500/20 rounded-full flex items-center justify-center text-green-500 shadow-[0_0_30px_rgba(34,197,94,0.2)]">
                    <CheckCircle2 className="h-10 w-10" />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
