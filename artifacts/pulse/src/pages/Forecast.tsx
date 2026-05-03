import AppLayout from "@/components/AppLayout";
import { useState } from "react";
import { motion } from "framer-motion";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { TrendingUp, ArrowUpRight } from "lucide-react";

type Scenario = "bear" | "base" | "bull";

const ACTUALS = [
  { month: "Oct", mrr: 166 }, { month: "Nov", mrr: 182 }, { month: "Dec", mrr: 195 },
  { month: "Jan", mrr: 210 }, { month: "Feb", mrr: 229 }, { month: "Mar", mrr: 252 },
  { month: "Apr", mrr: 284 },
];

const PROJECTIONS: Record<Scenario, { month: string; bear: number | null; base: number | null; bull: number | null }[]> = {
  bear: [
    { month: "Apr", bear: 284, base: null, bull: null },
    { month: "May", bear: 298, base: null, bull: null },
    { month: "Jun", bear: 309, base: null, bull: null },
    { month: "Jul", bear: 317, base: null, bull: null },
    { month: "Aug", bear: 323, base: null, bull: null },
    { month: "Sep", bear: 329, base: null, bull: null },
  ],
  base: [
    { month: "Apr", bear: null, base: 284, bull: null },
    { month: "May", bear: null, base: 312, bull: null },
    { month: "Jun", bear: null, base: 343, bull: null },
    { month: "Jul", bear: null, base: 378, bull: null },
    { month: "Aug", bear: null, base: 416, bull: null },
    { month: "Sep", bear: null, base: 457, bull: null },
  ],
  bull: [
    { month: "Apr", bear: null, base: null, bull: 284 },
    { month: "May", bear: null, base: null, bull: 330 },
    { month: "Jun", bear: null, base: null, bull: 384 },
    { month: "Jul", bear: null, base: null, bull: 447 },
    { month: "Aug", bear: null, base: null, bull: 520 },
    { month: "Sep", bear: null, base: null, bull: 604 },
  ],
};

const COMBINED = [
  { month: "Oct", actual: 166 }, { month: "Nov", actual: 182 }, { month: "Dec", actual: 195 },
  { month: "Jan", actual: 210 }, { month: "Feb", actual: 229 }, { month: "Mar", actual: 252 },
  { month: "Apr", actual: 284, bear: 284, base: 284, bull: 284 },
  { month: "May", bear: 298, base: 312, bull: 330 },
  { month: "Jun", bear: 309, base: 343, bull: 384 },
  { month: "Jul", bear: 317, base: 378, bull: 447 },
  { month: "Aug", bear: 323, base: 416, bull: 520 },
  { month: "Sep", bear: 329, base: 457, bull: 604 },
];

const SCENARIO_CONFIG: Record<Scenario, { label: string; desc: string; color: string; end: string; growth: string; assumptions: string[] }> = {
  bear: {
    label: "Bear", desc: "Churn worsens, CAC rises", color: "#f87171", end: "$329K",
    growth: "+16%", assumptions: ["Churn rises to 5%", "No new enterprise logos", "Paid CAC increases 25%"],
  },
  base: {
    label: "Base", desc: "Current trajectory holds", color: "#3b82f6", end: "$457K",
    growth: "+61%", assumptions: ["Churn stays at 3.2%", "2 enterprise deals close", "LinkedIn CAC stabilizes"],
  },
  bull: {
    label: "Bull", desc: "Strong growth, low churn", color: "#22c55e", end: "$604K",
    growth: "+113%", assumptions: ["Churn drops to 2%", "5 enterprise deals close", "New referral channel activates"],
  },
};

function fmt(v: number) { return `$${v}K`; }

export default function Forecast() {
  const [scenario, setScenario] = useState<Scenario>("base");
  const cfg = SCENARIO_CONFIG[scenario];

  return (
    <AppLayout>
      <div className="flex-1 overflow-auto p-6 md:p-8">
        <div className="max-w-5xl mx-auto space-y-6">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">Revenue Forecast</h1>
            <p className="text-muted-foreground mt-1">AI-powered MRR projections through September 2026</p>
          </div>

          {/* Scenario toggle */}
          <div className="flex gap-2">
            {(["bear", "base", "bull"] as Scenario[]).map((s) => {
              const c = SCENARIO_CONFIG[s];
              return (
                <button key={s} onClick={() => setScenario(s)}
                  className={`flex-1 p-4 rounded-xl border transition-all text-left ${scenario === s ? "border-primary/50 bg-primary/5" : "border-border bg-card hover:bg-muted/20"}`}>
                  <div className="flex items-center gap-2 mb-1">
                    <div className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: c.color }} />
                    <span className="font-semibold text-sm">{c.label}</span>
                  </div>
                  <p className="text-xs text-muted-foreground">{c.desc}</p>
                  <div className="text-lg font-bold mt-2">{c.end}</div>
                  <div className="text-xs text-muted-foreground">by Sep 2026 · {c.growth}</div>
                </button>
              );
            })}
          </div>

          {/* Chart */}
          <motion.div key={scenario} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="rounded-xl border bg-card p-5">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-sm font-semibold">MRR Projection — All Scenarios</h3>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <div className="w-8 h-0.5 bg-primary rounded" />Actuals
                <div className="w-8 h-0.5 bg-red-400 rounded border-dashed" style={{ borderTop: "2px dashed #f87171", height: 0 }} />Bear
              </div>
            </div>
            <ResponsiveContainer width="100%" height={320}>
              <AreaChart data={COMBINED} margin={{ top: 5, right: 20, bottom: 5, left: 10 }}>
                <defs>
                  <linearGradient id="colorActual" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorBase" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.25} />
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorBull" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#22c55e" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorBear" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f87171" stopOpacity={0.15} />
                    <stop offset="95%" stopColor="#f87171" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="month" tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }} axisLine={false} tickLine={false} />
                <YAxis tickFormatter={(v) => `$${v}K`} tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }} axisLine={false} tickLine={false} />
                <Tooltip formatter={(v: number) => [`$${v}K`, ""]} contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8, fontSize: 12 }} />
                <Area type="monotone" dataKey="actual" stroke="#6366f1" strokeWidth={2.5} fill="url(#colorActual)" name="Actuals" connectNulls />
                <Area type="monotone" dataKey="base" stroke="#3b82f6" strokeWidth={2} strokeDasharray="6 3" fill="url(#colorBase)" name="Base" connectNulls />
                <Area type="monotone" dataKey="bull" stroke="#22c55e" strokeWidth={2} strokeDasharray="6 3" fill="url(#colorBull)" name="Bull" connectNulls />
                <Area type="monotone" dataKey="bear" stroke="#f87171" strokeWidth={2} strokeDasharray="6 3" fill="url(#colorBear)" name="Bear" connectNulls />
              </AreaChart>
            </ResponsiveContainer>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {/* Assumptions */}
            <div className="rounded-xl border bg-card p-5">
              <h3 className="text-sm font-semibold mb-3">{cfg.label} Case Assumptions</h3>
              <ul className="space-y-2">
                {cfg.assumptions.map((a) => (
                  <li key={a} className="flex items-start gap-2 text-sm text-muted-foreground">
                    <div className="h-1.5 w-1.5 rounded-full mt-2 shrink-0" style={{ backgroundColor: cfg.color }} />
                    {a}
                  </li>
                ))}
              </ul>
            </div>

            {/* Milestone tracker */}
            <div className="rounded-xl border bg-card p-5">
              <h3 className="text-sm font-semibold mb-3">MRR Milestones</h3>
              <div className="space-y-3">
                {[
                  { target: "$300K", label: "Next milestone", eta: "Jun 2026 (base)", done: false },
                  { target: "$500K", label: "Series B signal", eta: "Sep 2026 (bull)", done: false },
                  { target: "$250K", label: "Series A benchmark", eta: "Feb 2026", done: true },
                  { target: "$100K", label: "Default alive", eta: "Jun 2025", done: true },
                ].map((m) => (
                  <div key={m.target} className="flex items-center gap-3">
                    <div className={`h-5 w-5 rounded-full border-2 flex items-center justify-center shrink-0 ${m.done ? "bg-primary border-primary" : "border-muted-foreground"}`}>
                      {m.done && <div className="h-2 w-2 rounded-full bg-white" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className={`text-sm font-medium ${m.done ? "line-through text-muted-foreground" : ""}`}>{m.target} MRR</span>
                        {m.done && <span className="text-xs text-green-400 flex items-center gap-1"><ArrowUpRight className="h-3 w-3" />Achieved</span>}
                      </div>
                      <p className="text-xs text-muted-foreground">{m.label} · {m.eta}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
