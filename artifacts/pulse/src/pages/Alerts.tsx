import { useState, useEffect, useCallback } from "react";
import AppLayout from "@/components/AppLayout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { motion, AnimatePresence } from "framer-motion";
import { Bell, AlertTriangle, AlertCircle, Info, CheckCircle, TrendingDown, TrendingUp, X, Filter, Loader2 } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/contexts/AuthContext";

type Severity = "critical" | "warning" | "info";

type Alert = {
  id: string | number;
  title: string;
  description: string;
  metric: string;
  change: string;
  direction: "up" | "down";
  severity: Severity;
  time: string;
  resolved: boolean;
};

const SEV_CONFIG: Record<Severity, { icon: React.ElementType; badge: string; dot: string }> = {
  critical: { icon: AlertCircle, badge: "bg-red-500/10 text-red-400 border-red-500/20", dot: "bg-red-500" },
  warning: { icon: AlertTriangle, badge: "bg-orange-500/10 text-orange-400 border-orange-500/20", dot: "bg-orange-500" },
  info: { icon: Info, badge: "bg-blue-500/10 text-blue-400 border-blue-500/20", dot: "bg-blue-500" },
};

function timeAgo(ts: string): string {
  const diff = Date.now() - new Date(ts).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

function toAlert(row: Record<string, unknown>): Alert {
  return {
    id: row.id as string | number,
    title: (row.title as string) ?? "",
    description: (row.description as string) ?? "",
    metric: (row.metric as string) ?? "",
    change: (row.change as string) ?? "",
    direction: (row.direction as "up" | "down") ?? "up",
    severity: (row.severity as Severity) ?? "info",
    time: row.created_at ? timeAgo(row.created_at as string) : "",
    resolved: (row.resolved as boolean) ?? false,
  };
}

export default function Alerts() {
  const { user } = useAuth();
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<"all" | Severity>("all");
  const [showResolved, setShowResolved] = useState(false);

  const fetchAlerts = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    setError(null);
    const { data, error: err } = await supabase
      .from("alerts")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });
    if (err) {
      setError(err.message);
    } else {
      setAlerts((data ?? []).map(toAlert));
    }
    setLoading(false);
  }, [user]);

  useEffect(() => { void fetchAlerts(); }, [fetchAlerts]);

  const resolve = async (id: string | number) => {
    setAlerts((prev) => prev.map((a) => a.id === id ? { ...a, resolved: true } : a));
    await supabase.from("alerts").update({ resolved: true }).eq("id", id);
  };

  const dismiss = async (id: string | number) => {
    setAlerts((prev) => prev.filter((a) => a.id !== id));
    await supabase.from("alerts").delete().eq("id", id);
  };

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
                <div className={`text-2xl font-bold mt-1 ${s.text}`}>
                  {loading ? <Loader2 className="h-5 w-5 animate-spin opacity-40 mt-1" /> : s.count}
                </div>
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
          {loading ? (
            <div className="flex flex-col items-center justify-center py-16 gap-3 text-muted-foreground">
              <Loader2 className="h-6 w-6 animate-spin text-primary" />
              <p className="text-sm">Loading alerts…</p>
            </div>
          ) : error ? (
            <div className="text-center py-12 text-destructive">
              <AlertCircle className="h-8 w-8 mx-auto mb-3 opacity-50" />
              <p className="text-sm">{error}</p>
              <Button variant="outline" size="sm" className="mt-4" onClick={fetchAlerts}>Retry</Button>
            </div>
          ) : (
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
          )}
        </div>
      </div>
    </AppLayout>
  );
}
