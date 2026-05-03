import { useState } from "react";
import AppLayout from "@/components/AppLayout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, ChevronDown, ChevronRight, TrendingUp, CheckCircle, AlertTriangle, XCircle } from "lucide-react";

type Status = "on-track" | "at-risk" | "off-track" | "achieved";
type KeyResult = {
  id: string;
  title: string;
  current: number;
  target: number;
  unit: string;
  status: Status;
  progressPct?: number;
};
type Objective = { id: string; title: string; owner: string; quarter: string; status: Status; keyResults: KeyResult[] };

const OBJECTIVES: Objective[] = [
  {
    id: "o1", title: "Reach $300K MRR", owner: "CEO", quarter: "Q2 2026", status: "on-track",
    keyResults: [
      { id: "kr1", title: "Grow MRR from $284K to $300K", current: 284, target: 300, unit: "K MRR", status: "on-track" },
      { id: "kr2", title: "Reduce churn to below 2.5%", current: 0.5, target: 1.2, unit: "pp reduced", status: "at-risk", progressPct: 42 },
      { id: "kr3", title: "Add 200 net new customers", current: 147, target: 200, unit: "customers", status: "on-track" },
    ],
  },
  {
    id: "o2", title: "Scale GTM to drive $1M ARR pipeline", owner: "VP Sales", quarter: "Q2 2026", status: "at-risk",
    keyResults: [
      { id: "kr4", title: "Close 15 new enterprise deals", current: 6, target: 15, unit: "deals", status: "at-risk" },
      { id: "kr5", title: "Reduce sales cycle 45→30 days", current: 7, target: 15, unit: "days saved", status: "on-track", progressPct: 47 },
      { id: "kr6", title: "Hire 2 Account Executives", current: 1, target: 2, unit: "AEs hired", status: "on-track" },
    ],
  },
  {
    id: "o3", title: "Ship 3 AI-powered product features", owner: "Head of Eng", quarter: "Q2 2026", status: "on-track",
    keyResults: [
      { id: "kr7", title: "Launch AI weekly report generation", current: 1, target: 1, unit: "shipped", status: "achieved" },
      { id: "kr8", title: "Launch predictive churn alerts", current: 0, target: 1, unit: "shipped", status: "at-risk" },
      { id: "kr9", title: "Launch AI-powered investor updates", current: 1, target: 1, unit: "shipped", status: "achieved" },
    ],
  },
  {
    id: "o4", title: "Achieve SOC 2 Type II certification", owner: "Head of Ops", quarter: "Q2 2026", status: "on-track",
    keyResults: [
      { id: "kr10", title: "Complete all security controls", current: 28, target: 34, unit: "controls", status: "on-track" },
      { id: "kr11", title: "Pass annual security audit", current: 0, target: 1, unit: "audit", status: "on-track" },
      { id: "kr12", title: "Train all 10 employees on security", current: 8, target: 10, unit: "trained", status: "on-track" },
    ],
  },
];

const STATUS_CONFIG: Record<Status, { label: string; color: string; badge: string; icon: React.ElementType }> = {
  "on-track": { label: "On Track", color: "bg-green-500", badge: "bg-green-500/10 text-green-400 border-green-500/20", icon: TrendingUp },
  "at-risk": { label: "At Risk", color: "bg-yellow-500", badge: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20", icon: AlertTriangle },
  "off-track": { label: "Off Track", color: "bg-red-500", badge: "bg-red-500/10 text-red-400 border-red-500/20", icon: XCircle },
  "achieved": { label: "Achieved", color: "bg-primary", badge: "bg-primary/10 text-primary border-primary/20", icon: CheckCircle },
};

function ProgressBar({ kr }: { kr: KeyResult }) {
  const pct = kr.progressPct !== undefined
    ? kr.progressPct
    : Math.min((kr.current / kr.target) * 100, 100);
  const color =
    kr.status === "achieved" ? "bg-primary"
    : kr.status === "on-track" ? "bg-green-500"
    : kr.status === "at-risk" ? "bg-yellow-500"
    : "bg-red-500";
  return (
    <div className="flex items-center gap-3 flex-1">
      <div className="flex-1 h-1.5 rounded-full bg-muted overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className={`h-full rounded-full ${color}`}
        />
      </div>
      <span className="text-xs text-muted-foreground whitespace-nowrap">
        {kr.current}/{kr.target} {kr.unit}
      </span>
    </div>
  );
}

export default function Goals() {
  const [expanded, setExpanded] = useState<string[]>(["o1"]);
  const toggle = (id: string) =>
    setExpanded((prev) => prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]);

  const onTrack = OBJECTIVES.filter((o) => o.status === "on-track").length;
  const atRisk = OBJECTIVES.filter((o) => o.status === "at-risk").length;

  return (
    <AppLayout>
      <div className="flex-1 overflow-auto p-6 md:p-8">
        <div className="max-w-3xl mx-auto space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-semibold tracking-tight">Goals & OKRs</h1>
              <p className="text-muted-foreground mt-1">Q2 2026 · {onTrack} on track · {atRisk} at risk</p>
            </div>
            <Button className="gap-2"><Plus className="h-4 w-4" />Add objective</Button>
          </div>

          {/* Summary */}
          <div className="grid grid-cols-4 gap-3">
            {(["on-track", "at-risk", "off-track", "achieved"] as Status[]).map((s) => {
              const cfg = STATUS_CONFIG[s];
              const count = OBJECTIVES.filter((o) => o.status === s).length;
              return (
                <div key={s} className={`rounded-xl border p-3 ${cfg.badge}`}>
                  <cfg.icon className="h-4 w-4 mb-1" />
                  <div className="text-xl font-bold">{count}</div>
                  <div className="text-xs opacity-80">{cfg.label}</div>
                </div>
              );
            })}
          </div>

          {/* Objectives */}
          <div className="space-y-3">
            {OBJECTIVES.map((obj) => {
              const cfg = STATUS_CONFIG[obj.status];
              const isOpen = expanded.includes(obj.id);
              const onTrackKRs = obj.keyResults.filter(
                (kr) => kr.status === "on-track" || kr.status === "achieved"
              ).length;
              const totalKRs = obj.keyResults.length;

              return (
                <div key={obj.id} className="rounded-xl border bg-card overflow-hidden">
                  <button
                    className="w-full p-5 flex items-center gap-4 text-left hover:bg-muted/20 transition-colors"
                    onClick={() => toggle(obj.id)}
                  >
                    <div className={`h-2.5 w-2.5 rounded-full shrink-0 ${cfg.color}`} />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-semibold text-sm">{obj.title}</span>
                        <Badge variant="outline" className={`text-xs ${cfg.badge}`}>{cfg.label}</Badge>
                      </div>
                      <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
                        <span>{obj.quarter}</span>
                        <span>Owner: {obj.owner}</span>
                        <span>{onTrackKRs}/{totalKRs} KRs on track</span>
                      </div>
                    </div>
                    {isOpen
                      ? <ChevronDown className="h-4 w-4 text-muted-foreground shrink-0" />
                      : <ChevronRight className="h-4 w-4 text-muted-foreground shrink-0" />}
                  </button>

                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        key={`${obj.id}-krs`}
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.25, ease: "easeInOut" }}
                        className="overflow-hidden"
                      >
                        <div className="border-t border-border px-5 pb-4 space-y-3 pt-3">
                          {obj.keyResults.map((kr) => {
                            const krc = STATUS_CONFIG[kr.status];
                            return (
                              <div key={kr.id} className="flex items-center gap-3">
                                <krc.icon className={`h-4 w-4 shrink-0 ${krc.badge.split(" ")[1]}`} />
                                <span className="text-sm w-56 shrink-0 truncate">{kr.title}</span>
                                <ProgressBar kr={kr} />
                              </div>
                            );
                          })}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
