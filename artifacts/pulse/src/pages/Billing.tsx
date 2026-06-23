import AppLayout from "@/components/AppLayout";
import { motion } from "framer-motion";
import { Check, Zap, Building2, ArrowRight, Shield, Sparkles, Clock, Headphones } from "lucide-react";

const PRO_FEATURES = [
  "Real-time alerts & anomaly detection",
  "Basic API access (5,000 req/month)",
  "AI-generated weekly executive summaries",
  "Dashboard KPIs & revenue charts",
  "Standard email support (48h SLA)",
  "Up to 3 team members",
];

const ENTERPRISE_FEATURES = [
  "Everything in Pro",
  "Multi-tenant RLS data isolation",
  "Dedicated onboarding & success manager",
  "Custom AI playbooks & prompt tuning",
  "Unlimited API access + priority queue",
  "Custom integrations & webhooks",
  "SSO / SAML 2.0 support",
  "99.99% uptime SLA + dedicated infra",
  "Slack-based priority support (1h SLA)",
];

const TRUST_BADGES = [
  { icon: Shield, label: "SOC 2 Type II" },
  { icon: Zap, label: "99.99% Uptime" },
  { icon: Clock, label: "1-hr SLA" },
  { icon: Headphones, label: "Dedicated Support" },
];

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, delay: i * 0.12, ease: [0.25, 0.46, 0.45, 0.94] },
  }),
};

export default function Billing() {
  return (
    <AppLayout>
      <div className="flex-1 overflow-auto p-6 md:p-10">
        <div className="max-w-5xl mx-auto space-y-10">

          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35 }}
            className="text-center space-y-3"
          >
            <div className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full border"
              style={{
                background: "hsl(var(--primary)/0.08)",
                borderColor: "hsl(var(--primary)/0.2)",
                color: "hsl(var(--primary))",
              }}>
              <Sparkles className="h-3 w-3" />
              Simple, transparent pricing
            </div>
            <h1 className="text-3xl font-bold tracking-tight text-foreground">
              Choose your instance tier
            </h1>
            <p className="text-muted-foreground max-w-md mx-auto text-sm leading-relaxed">
              Deploy a dedicated Omnia instance for your company. No hidden fees,
              no per-seat surprises — one flat rate per workspace.
            </p>
          </motion.div>

          {/* Pricing cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 items-start">

            {/* Pro */}
            <motion.div
              custom={0}
              variants={cardVariants}
              initial="hidden"
              animate="visible"
              className="rounded-2xl border border-border bg-card p-7 flex flex-col gap-6 relative overflow-hidden"
            >
              {/* Subtle background glow */}
              <div className="absolute top-0 right-0 w-48 h-48 rounded-full pointer-events-none"
                style={{ background: "radial-gradient(circle, hsl(var(--primary)/0.06) 0%, transparent 70%)", transform: "translate(30%, -30%)" }} />

              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="h-9 w-9 rounded-xl flex items-center justify-center"
                    style={{ background: "hsl(var(--primary)/0.12)" }}>
                    <Zap className="h-4 w-4 text-primary" />
                  </div>
                  <span className="text-xs font-medium px-2.5 py-1 rounded-full border border-border text-muted-foreground">
                    Most popular
                  </span>
                </div>
                <h2 className="text-lg font-bold text-foreground">Pro</h2>
                <p className="text-sm text-muted-foreground mt-0.5">For growing companies ready to operationalize AI.</p>
              </div>

              <div className="flex items-end gap-1.5">
                <span className="text-4xl font-extrabold tracking-tight text-foreground">$99</span>
                <span className="text-muted-foreground text-sm mb-1.5">/month</span>
              </div>

              <ul className="space-y-2.5 flex-1">
                {PRO_FEATURES.map((f) => (
                  <li key={f} className="flex items-start gap-2.5 text-sm">
                    <span className="mt-0.5 h-4 w-4 rounded-full flex items-center justify-center shrink-0"
                      style={{ background: "hsl(var(--primary)/0.15)" }}>
                      <Check className="h-2.5 w-2.5 text-primary" strokeWidth={3} />
                    </span>
                    <span className="text-foreground/80">{f}</span>
                  </li>
                ))}
              </ul>

              <button
                className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-sm font-semibold transition-all duration-200 border group"
                style={{
                  background: "hsl(var(--primary))",
                  borderColor: "hsl(var(--primary))",
                  color: "hsl(var(--primary-foreground))",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.opacity = "0.9";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.opacity = "1";
                }}
              >
                Deploy Instance
                <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
              </button>
            </motion.div>

            {/* Enterprise */}
            <motion.div
              custom={1}
              variants={cardVariants}
              initial="hidden"
              animate="visible"
              className="rounded-2xl border flex flex-col gap-6 p-7 relative overflow-hidden"
              style={{
                borderColor: "hsl(var(--primary)/0.35)",
                background: "linear-gradient(145deg, hsl(var(--card)) 0%, hsl(var(--primary)/0.04) 100%)",
              }}
            >
              {/* Top accent line */}
              <div className="absolute top-0 left-0 right-0 h-[2px] rounded-t-2xl"
                style={{ background: "linear-gradient(90deg, hsl(var(--primary)/0.8), hsl(var(--primary)/0.3))" }} />

              {/* Glow */}
              <div className="absolute top-0 left-0 w-64 h-64 pointer-events-none"
                style={{ background: "radial-gradient(circle, hsl(var(--primary)/0.08) 0%, transparent 65%)", transform: "translate(-20%, -20%)" }} />

              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="h-9 w-9 rounded-xl flex items-center justify-center"
                    style={{ background: "hsl(var(--primary)/0.18)" }}>
                    <Building2 className="h-4 w-4 text-primary" />
                  </div>
                  <span className="text-xs font-semibold px-2.5 py-1 rounded-full"
                    style={{
                      background: "hsl(var(--primary)/0.15)",
                      color: "hsl(var(--primary))",
                      border: "1px solid hsl(var(--primary)/0.25)",
                    }}>
                    ✦ Enterprise
                  </span>
                </div>
                <h2 className="text-lg font-bold text-foreground">Enterprise</h2>
                <p className="text-sm text-muted-foreground mt-0.5">For organisations that need full control and isolation.</p>
              </div>

              <div className="flex items-end gap-1.5">
                <span className="text-4xl font-extrabold tracking-tight text-foreground">$299</span>
                <span className="text-muted-foreground text-sm mb-1.5">/month</span>
              </div>

              <ul className="space-y-2.5 flex-1">
                {ENTERPRISE_FEATURES.map((f) => (
                  <li key={f} className="flex items-start gap-2.5 text-sm">
                    <span className="mt-0.5 h-4 w-4 rounded-full flex items-center justify-center shrink-0"
                      style={{ background: "hsl(var(--primary)/0.2)" }}>
                      <Check className="h-2.5 w-2.5 text-primary" strokeWidth={3} />
                    </span>
                    <span className={f === "Everything in Pro" ? "text-foreground font-medium" : "text-foreground/80"}>{f}</span>
                  </li>
                ))}
              </ul>

              <button
                className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-sm font-semibold transition-all duration-200 border group"
                style={{
                  background: "transparent",
                  borderColor: "hsl(var(--primary)/0.5)",
                  color: "hsl(var(--primary))",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.background = "hsl(var(--primary)/0.08)";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.background = "transparent";
                }}
              >
                Contact Operations
                <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
              </button>
            </motion.div>
          </div>

          {/* Trust row */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.35 }}
            className="flex flex-wrap items-center justify-center gap-6"
          >
            {TRUST_BADGES.map(({ icon: Icon, label }) => (
              <div key={label} className="flex items-center gap-2 text-xs text-muted-foreground">
                <Icon className="h-3.5 w-3.5" />
                <span>{label}</span>
              </div>
            ))}
          </motion.div>

          {/* FAQ strip */}
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: 0.45 }}
            className="rounded-2xl border border-border bg-card p-7"
          >
            <h3 className="text-sm font-semibold text-foreground mb-5">Common questions</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-5">
              {[
                {
                  q: "Can I switch tiers later?",
                  a: "Yes — upgrades take effect immediately and are prorated. Downgrades apply at the next billing cycle.",
                },
                {
                  q: "What does 'Deploy Instance' mean?",
                  a: "Each workspace gets its own isolated compute and data environment. No shared infrastructure between tenants.",
                },
                {
                  q: "Is there a free trial?",
                  a: "All new accounts include a 14-day Pro trial. No credit card required to start.",
                },
                {
                  q: "What's included in Custom AI Playbooks?",
                  a: "Enterprise customers can define domain-specific prompt strategies, tone, and decision frameworks Omnia follows.",
                },
              ].map(({ q, a }) => (
                <div key={q}>
                  <p className="text-sm font-medium text-foreground">{q}</p>
                  <p className="text-xs text-muted-foreground mt-1 leading-relaxed">{a}</p>
                </div>
              ))}
            </div>
          </motion.div>

        </div>
      </div>
    </AppLayout>
  );
}
