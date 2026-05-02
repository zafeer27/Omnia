import { Link } from "wouter";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Activity, Database, Zap, Sparkles } from "lucide-react";
import {
  SiStripe,
  SiShopify,
  SiHubspot,
  SiGoogleanalytics,
  SiQuickbooks,
  SiSalesforce,
  SiSlack,
  SiNotion,
} from "react-icons/si";

export default function Landing() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
  };

  const features = [
    {
      title: "Unified Data",
      description: "Connect Stripe, Shopify, QuickBooks, and CRM in one click. No code required.",
      icon: Database,
    },
    {
      title: "Ask Anything",
      description: "Chat with your business data in plain English. Get instant answers.",
      icon: Zap,
    },
    {
      title: "Proactive Insights",
      description: "Pulse tells you what matters before you ask. Churn risks, revenue drops, and more.",
      icon: Sparkles,
    },
  ];

  const logos = [
    { icon: SiStripe, name: "Stripe" },
    { icon: SiShopify, name: "Shopify" },
    { icon: SiHubspot, name: "HubSpot" },
    { icon: SiGoogleanalytics, name: "Google Analytics" },
    { icon: SiQuickbooks, name: "QuickBooks" },
    { icon: SiSalesforce, name: "Salesforce" },
    { icon: SiSlack, name: "Slack" },
    { icon: SiNotion, name: "Notion" },
  ];

  return (
    <div className="min-h-[100dvh] w-full bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-foreground overflow-x-hidden selection:bg-primary/30">
      <div className="container mx-auto px-4 py-6 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
            <Activity className="text-white h-5 w-5" />
          </div>
          <span className="font-bold text-xl tracking-tight">Pulse</span>
        </div>
        <div className="flex items-center gap-4">
          <Link href="/dashboard">
            <Button variant="ghost" className="text-muted-foreground hover:text-foreground">
              Sign In
            </Button>
          </Link>
          <Link href="/onboarding">
            <Button data-testid="button-get-started-nav">Get Started</Button>
          </Link>
        </div>
      </div>

      <motion.main
        className="container mx-auto px-4 pt-32 pb-24 max-w-6xl"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <div className="text-center max-w-3xl mx-auto space-y-8">
          <motion.div variants={itemVariants} className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium border border-primary/20">
            <Sparkles className="h-4 w-4" />
            <span>Meet your new executive team member</span>
          </motion.div>

          <motion.h1 variants={itemVariants} className="text-5xl md:text-7xl font-bold tracking-tighter text-balance">
            Your AI <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">Chief of Staff</span>
          </motion.h1>

          <motion.p variants={itemVariants} className="text-xl text-muted-foreground leading-relaxed max-w-2xl mx-auto">
            Connect your business tools. Ask anything. Get answers, forecasts, and actions — in plain English.
          </motion.p>

          <motion.div variants={itemVariants} className="pt-4">
            <Link href="/onboarding">
              <Button size="lg" className="h-14 px-8 text-lg font-medium shadow-lg shadow-primary/25" data-testid="button-get-started-hero">
                Get Started Free
              </Button>
            </Link>
          </motion.div>
        </div>

        <motion.div variants={itemVariants} className="mt-32">
          <div className="text-center text-sm font-medium text-muted-foreground mb-8 uppercase tracking-widest">
            Connects with the tools you already use
          </div>
          <div className="flex flex-wrap justify-center gap-8 md:gap-12 opacity-50 grayscale hover:grayscale-0 transition-all duration-500">
            {logos.map((logo) => (
              <div key={logo.name} className="flex items-center justify-center text-3xl hover:text-foreground transition-colors" title={logo.name}>
                <logo.icon />
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-32">
          {features.map((feature) => (
            <div key={feature.title} className="p-8 rounded-2xl bg-card border border-border hover:border-primary/50 transition-colors group">
              <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-6 group-hover:bg-primary/20 transition-colors">
                <feature.icon className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
              <p className="text-muted-foreground leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </motion.div>
      </motion.main>
    </div>
  );
}
