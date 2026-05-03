import { useState } from "react";
import AppLayout from "@/components/AppLayout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { motion, AnimatePresence } from "framer-motion";
import { Bell, AlertTriangle, AlertCircle, Info, CheckCircle, TrendingDown, TrendingUp, X, Filter } from "lucide-react";

type Severity = "critical" | "warning" | "info";
type Alert = { id: number; title: string; description: string; metric: string; change: string; direction: "up" | "down"; severity: Severity; time: string; resolved: boolean };

const INITIAL_ALERTS: Alert[] = [
  { id: 1, title: "Churn rate spike detected", description: "Churn rate jumped 0.8% in the last 7 days — highest in 3 months. 3 enterprise accounts show 0 logins.", metric: "Churn Rate", change: "+0.8%", direction: "up", severity: "critical", time: "2h ago", resolved: false },
  { id: 2, title: "Failed payment surge", description: "BuildRight has 3 consecutive failed payments. $6K ARR at risk. Stripe retry will occur in 24 hours.", metric: "Revenue", change: "-$6K at risk", direction: "down", severity: "critical", time: "4h ago", resolved: false },
  { id: 3, title: "LinkedIn CAC increased 18%", description: "Cost per acquired customer on LinkedIn rose from $820 to $968 over the past 2 weeks.", metric: "CAC", change: "+18%", direction: "up", severity: "warning", time: "1d ago", resolved: false },
  { id: 4, title: "TechFlow usage at historic low", description: "TechFlow's monthly active sessions dropped 60% over 14 days. Risk of voluntary churn.", metric: "Engagement", change: "-60%", direction: "down", severity: "warning", time: "1d ago", resolved: false },
  { id: 5, title: "MRR growth acceleration", description: "MRR grew 12.4% this month — above your 10% target. Organic and referral channels are outperforming.", metric: "MRR", change: "+12.4%", direction: "up", severity: "info", time: "2d ago", resolved: false },
  { id: 6, title: "LTV:CAC ratio improved", description: "Your LTV:CAC ratio reached 16.8x, a 15% improvement MoM. Capital efficiency is excellent.", metric: "LTV:CAC", change: "+15%", direction: "up", severity: "info", time: "3d ago", resolved: false },
  { id: 7, title: "Stripe payment processor blip", description: "Brief revenue dip last Tuesday traced to Stripe outage. Resolved in 43 minutes. No net revenue loss.", metric: "Revenue", change: "~$3.2K delayed", direction: "down", severity: "info", time: "5d ago", resolved: true },
  { id: 8, title: "Customer 200-seat expansion", description: "Acme Corp upgraded from 50 to 200 seats. $18K ARR expansion. Expansion MRR at record high.", metric: "Expansion MRR", change: "+$18K ARR", direction: "up", severity: "info", time: "6d ago", resolved: true },
];

const SEV_CONFIG: Record<Severity, { icon: React.ElementType; badge: string; dot: string }> = {
  critical: { icon: AlertCircle, badge: "bg-red-500/10 text-red-400 border-red-500/20", dot: "bg-red-500" },
  warning: { icon: AlertTriangle, badge: "bg-orange-500/10 text-orange-400 border-orange-500/20", dot: "bg-orange-500" },
  info: { icon: Info, badge: "bg-blue-500/10 text-blue-400 border-blue-500/20", dot: "bg-blue-500" },
};

export default function Alerts() {
  const [alerts, setAlerts] = useState<Alert[]>(INITIAL_ALERTS);
  const [filter, setFilter] = useState<"all" | Severity>("all");
  const [showResolved, setShowResolved] = useState(false);

  const resolve = (id: number) => setAlerts((prev) => prev.map((a) => a.id === id ? { ...a, resolved: true } : a));
  const dismiss = (id: number) => setAlerts((prev) => prev.filter((a) => a.id !== id));

  const active = alerts.filter((a) => !a.resolved);
  const critical = active.filter((a) => a.severity === "critical").length;
  const warnings = active.filter((a) => a.severity === "warning").length;

  const displayed = alerts
    .filter((a) => showResolved ? true : !a.resolved)
    .filter((a) => filter === "all" ? true : a.severity === filter);

  return (
    <AppLayout>
      <div className="flex-1 overflow-auto p-6 md:p-8">
        <div className="max-w-3xl mx-auto space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-semibold tracking-tight">Alerts & Anomalies</h1>
              <p className="text-muted-foreground mt-1">Real-time metric monitoring for your business</p>
            </div>
            <Button variant="outline" size="sm" onClick={() => setShowResolved((v) => !v)} className="gap-2">
              <Filter className="h-4 w-4" />
              {showResolved ? "Hide resolved" : "Show resolved"}
            </Button>
          </div>

          {/* Summary cards */}
          <div className="grid grid-cols-3 gap-4">
            {[
              { label: "Critical", count: critical, color: "border-red-500/30 bg-red-500/5", text: "text-red-400", icon: AlertCircle },
              { label: "Warnings", count: warnings, color: "border-orange-500/30 bg-orange-500/5", text: "text-orange-400", icon: AlertTriangle },
              { label: "Active Total", count: active.length, color: "border-border bg-card", text: "text-foreground", icon: Bell },
            ].map((s) => (
              <div key={s.label} className={`rounded-xl border p-4 ${s.color}`}>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground font-medium">{s.label}</span>
                  <s.icon className={`h-4 w-4 ${s.text}`} />
                </div>
                <div className={`text-2xl font-bold mt-1 ${s.text}`}>{s.count}</div>
              </div>
            ))}
          </div>

          {/* Filters */}
          <div className="flex gap-1.5 flex-wrap">
            {(["all", "critical", "warning", "info"] as const).map((f) => (
              <button key={f} onClick={() => setFilter(f)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all border ${filter === f ? "bg-primary text-primary-foreground border-primary" : "border-border text-muted-foreground hover:text-foreground"}`}>
                {f.charAt(0).toUpperCase() + f.slice(1)}
              </button>
            ))}
          </div>

          {/* Alert list */}
          <div className="space-y-3">
            <AnimatePresence>
              {displayed.map((alert) => {
                const cfg = SEV_CONFIG[alert.severity];
                const Icon = cfg.icon;
                return (
                  <motion.div key={alert.id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 10 }}
                    className={`p-4 rounded-xl border bg-card ${alert.resolved ? "opacity-50" : ""}`}>
                    <div className="flex gap-4">
                      <div className="shrink-0 mt-0.5">
                        <div className={`h-8 w-8 rounded-lg flex items-center justify-center ${cfg.badge}`}>
                          <Icon className="h-4 w-4" />
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <div className="space-y-0.5">
                            <div className="flex items-center gap-2">
                              <span className="font-medium text-sm">{alert.title}</span>
                              {alert.resolved && <Badge variant="outline" className="text-xs text-green-400 border-green-500/20 bg-green-500/10">Resolved</Badge>}
                            </div>
                            <p className="text-xs text-muted-foreground leading-relaxed">{alert.description}</p>
                          </div>
                          {!alert.resolved && (
                            <button onClick={() => dismiss(alert.id)} className="text-muted-foreground hover:text-foreground transition-colors shrink-0">
                              <X className="h-4 w-4" />
                            </button>
                          )}
                        </div>
                        <div className="flex items-center justify-between mt-3">
                          <div className="flex items-center gap-3">
                            <span className="text-xs text-muted-foreground">{alert.metric}</span>
                            <div className={`flex items-center gap-1 text-xs font-semibold ${alert.direction === "up" ? (alert.severity === "info" ? "text-green-400" : "text-red-400") : (alert.severity === "info" ? "text-muted-foreground" : "text-red-400")}`}>
                              {alert.direction === "up" ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                              {alert.change}
                            </div>
                            <span className="text-xs text-muted-foreground">{alert.time}</span>
                          </div>
                          {!alert.resolved && (
                            <Button variant="ghost" size="sm" className="h-7 text-xs gap-1 text-green-400 hover:text-green-300" onClick={() => resolve(alert.id)}>
                              <CheckCircle className="h-3 w-3" /> Mark resolved
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
            {displayed.length === 0 && (
              <div className="text-center py-12 text-muted-foreground">
                <Bell className="h-8 w-8 mx-auto mb-3 opacity-30" />
                <p className="text-sm">No alerts match this filter</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
