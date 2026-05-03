import { useState } from "react";
import AppLayout from "@/components/AppLayout";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { motion } from "framer-motion";
import { AlertTriangle, TrendingUp, Users, ArrowUpRight, ArrowDownRight, RefreshCcw, Sparkles, Loader2, Download } from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import ReactMarkdown from "react-markdown";
import { useCreateAnthropicConversation } from "@workspace/api-client-react";

const WEEKLY_REPORT_PROMPT = `You are Pulse, an AI Chief of Staff for founders. Generate a concise Weekly Executive Summary based on:

**Metrics (week ending May 2, 2026):**
- MRR: $284K (+12.4% MoM)
- Active Customers: 1,847 (+8.2% MoM)
- Churn Rate: 3.2% (-0.5% MoM improvement)
- LTV:CAC Ratio: 16.8x (+15% MoM)
- Top acquisition: LinkedIn (38%), Organic (28%), Referrals (22%), Paid (12%)
- At-risk: Pinnacle Corp ($12K ARR, 45 days inactive), TechFlow ($8K ARR, usage -60%), BuildRight ($6K ARR, 3 failed payments)

Format with: **Executive Summary**, **Revenue Highlights**, **Customer Health**, **Top Priorities This Week** (3 action items), **Risks to Watch**. Be specific and under 400 words.`;

const revenueData = Array.from({ length: 30 }).map((_, i) => {
  const base = 220000;
  const progress = i / 29;
  const noise = (Math.sin(i * 0.8) * 8000) + (Math.cos(i * 1.3) * 4000);
  return { day: i + 1, revenue: Math.round(base + progress * 64000 + noise) };
});

const acquisitionData = [
  { channel: "LinkedIn", pct: 38 },
  { channel: "Organic", pct: 28 },
  { channel: "Referrals", pct: 22 },
  { channel: "Paid", pct: 12 },
];

const riskCustomers = [
  { name: "Pinnacle Corp", arr: "$12K", issue: "45 days inactive" },
  { name: "TechFlow", arr: "$8K", issue: "Usage −60%" },
  { name: "BuildRight", arr: "$6K", issue: "3 failed payments" },
];

const KPI_CARDS = [
  { label: "MRR", value: "$284K", change: "+12.4%", suffix: "vs last month", up: true, icon: TrendingUp },
  { label: "Customers", value: "1,847", change: "+8.2%", suffix: "vs last month", up: true, icon: Users },
  { label: "Churn Rate", value: "3.2%", change: "−0.5%", suffix: "improvement", up: false, churnGood: true, icon: RefreshCcw },
  { label: "LTV : CAC", value: "16.8×", change: "+15%", suffix: "vs last month", up: true, icon: TrendingUp },
];

export default function Dashboard() {
  const [reportOpen, setReportOpen] = useState(false);
  const [reportContent, setReportContent] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const createConversation = useCreateAnthropicConversation();

  const handleGenerateReport = async () => {
    setReportContent("");
    setReportOpen(true);
    setIsGenerating(true);
    try {
      const conv = await new Promise<{ id: number }>((resolve, reject) => {
        createConversation.mutate({ data: { title: "Weekly Report" } }, { onSuccess: resolve, onError: reject });
      });
      const response = await fetch(
        `${import.meta.env.BASE_URL}api/anthropic/conversations/${conv.id}/messages`,
        { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ content: WEEKLY_REPORT_PROMPT }) }
      );
      if (!response.body) throw new Error("No response body");
      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let full = "";
      while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        for (const line of decoder.decode(value, { stream: true }).split("\n")) {
          if (line.startsWith("data: ")) {
            try {
              const data = JSON.parse(line.slice(6));
              if (data.type === "content_block_delta" && data.delta?.text) { full += data.delta.text; setReportContent(full); }
            } catch {}
          }
        }
      }
    } catch { setReportContent("Sorry, there was an error generating the report. Please try again."); }
    finally { setIsGenerating(false); }
  };

  return (
    <AppLayout>
      <div className="flex-1 overflow-auto p-6 md:p-8">
        <div className="max-w-7xl mx-auto space-y-7">

          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-semibold tracking-tight text-foreground">Good morning, founder</h1>
              <p className="text-sm mt-1 text-muted-foreground">Here's what's happening with your business today.</p>
            </div>
            <Button onClick={handleGenerateReport} disabled={isGenerating} className="gap-2">
              {isGenerating ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
              Generate Weekly Report
            </Button>
          </div>

          {/* AI Insight */}
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35 }}
            className="rounded-xl p-4 flex gap-3 border"
            style={{
              background: "hsl(var(--primary)/0.06)",
              borderColor: "hsl(var(--primary)/0.15)",
            }}
          >
            <div className="h-8 w-8 rounded-lg shrink-0 flex items-center justify-center mt-0.5"
              style={{ background: "hsl(var(--primary)/0.12)" }}>
              <Sparkles className="h-4 w-4 text-primary" />
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider mb-1 text-primary">AI Insight of the Day</p>
              <p className="text-sm leading-relaxed text-foreground/85">
                Revenue is up 12.4% this month, but churn spiked 0.8% in the last 7 days — prioritise retention before adding acquisition spend.
              </p>
            </div>
          </motion.div>

          {/* KPI Cards */}
          <motion.div
            className="grid grid-cols-2 lg:grid-cols-4 gap-3"
            initial="hidden"
            animate="visible"
            variants={{ visible: { transition: { staggerChildren: 0.07 } } }}
          >
            {KPI_CARDS.map((kpi) => (
              <motion.div
                key={kpi.label}
                variants={{ hidden: { opacity: 0, y: 12 }, visible: { opacity: 1, y: 0, transition: { duration: 0.35 } } }}
                className="rounded-xl border p-5 bg-card relative overflow-hidden group transition-all duration-200 hover:border-primary/25"
                style={{ borderColor: "hsl(var(--border))" }}
              >
                <div className="flex items-start justify-between mb-4">
                  <span className="text-xs font-medium text-muted-foreground">{kpi.label}</span>
                  <kpi.icon className="h-3.5 w-3.5 text-muted-foreground/50 shrink-0" />
                </div>
                <div className="text-[1.65rem] font-bold tracking-tight text-foreground mb-1">{kpi.value}</div>
                <div className={`flex items-center gap-1 text-xs font-medium ${
                  kpi.churnGood ? "text-emerald-400" : kpi.up ? "text-emerald-400" : "text-red-400"
                }`}>
                  {kpi.up || kpi.churnGood ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
                  <span>{kpi.change}</span>
                  <span className="text-muted-foreground font-normal">{kpi.suffix}</span>
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">

            {/* Revenue Chart */}
            <div className="lg:col-span-2 rounded-xl border bg-card p-5"
              style={{ borderColor: "hsl(var(--border))" }}>
              <div className="flex items-baseline justify-between mb-5">
                <div>
                  <h3 className="text-sm font-semibold text-foreground">Revenue</h3>
                  <p className="text-xs text-muted-foreground mt-0.5">Last 30 days</p>
                </div>
                <span className="text-xs font-semibold text-emerald-400 tabular-nums">↑ $64K MoM</span>
              </div>
              <div className="h-[240px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={revenueData} margin={{ top: 4, right: 0, left: 0, bottom: 0 }}>
                    <defs>
                      <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.2} />
                        <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <XAxis dataKey="day" axisLine={false} tickLine={false}
                      tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }}
                      tickFormatter={(v) => `D${v}`} minTickGap={28} />
                    <YAxis axisLine={false} tickLine={false}
                      tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }}
                      tickFormatter={(v) => `$${Math.round(v / 1000)}k`} />
                    <Tooltip
                      contentStyle={{
                        background: "hsl(var(--card))", border: "1px solid hsl(var(--border))",
                        borderRadius: "8px", fontSize: 12, boxShadow: "var(--shadow-md)"
                      }}
                      formatter={(v: number) => [`$${v.toLocaleString()}`, "Revenue"]}
                      labelFormatter={(l) => `Day ${l}`}
                    />
                    <Area type="monotone" dataKey="revenue" stroke="hsl(var(--primary))"
                      strokeWidth={1.5} fillOpacity={1} fill="url(#revGrad)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="flex flex-col gap-4">
              {/* Acquisition */}
              <div className="flex-1 rounded-xl border bg-card p-5" style={{ borderColor: "hsl(var(--border))" }}>
                <h3 className="text-sm font-semibold text-foreground mb-4">Acquisition</h3>
                <div className="space-y-3.5">
                  {acquisitionData.map((item) => (
                    <div key={item.channel}>
                      <div className="flex justify-between text-xs mb-1.5">
                        <span className="text-muted-foreground">{item.channel}</span>
                        <span className="font-semibold text-foreground tabular-nums">{item.pct}%</span>
                      </div>
                      <div className="h-1 rounded-full overflow-hidden bg-muted">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${item.pct}%` }}
                          transition={{ duration: 0.7, delay: 0.2 }}
                          className="h-full rounded-full bg-primary"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* At Risk */}
              <div className="flex-1 rounded-xl border bg-card p-5" style={{ borderColor: "hsl(var(--border))" }}>
                <h3 className="text-sm font-semibold text-foreground mb-4 flex items-center gap-2">
                  <AlertTriangle className="h-3.5 w-3.5 text-red-400" />
                  At-Risk Accounts
                </h3>
                <div className="space-y-3">
                  {riskCustomers.map((c) => (
                    <div key={c.name} className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-foreground">{c.name}</p>
                        <p className="text-xs text-muted-foreground mt-0.5">{c.issue}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-semibold text-foreground tabular-nums">{c.arr}</p>
                        <span className="text-[10px] text-red-400 font-medium">at risk</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Report Dialog */}
      <Dialog open={reportOpen} onOpenChange={setReportOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh] flex flex-col">
          <DialogHeader className="shrink-0">
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 rounded-lg flex items-center justify-center bg-primary/10">
                <Sparkles className="h-4 w-4 text-primary" />
              </div>
              <div>
                <DialogTitle>Weekly Executive Summary</DialogTitle>
                <DialogDescription className="text-xs mt-0.5">
                  {new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" })}
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>
          <div className="flex-1 overflow-y-auto mt-3 pr-1">
            {isGenerating && reportContent === "" ? (
              <div className="flex flex-col items-center justify-center h-40 gap-3 text-muted-foreground">
                <Loader2 className="h-6 w-6 animate-spin text-primary" />
                <p className="text-sm">Analysing your metrics...</p>
              </div>
            ) : (
              <div className="prose prose-sm dark:prose-invert max-w-none text-sm leading-relaxed [&_h2]:text-sm [&_h2]:font-semibold [&_h2]:mt-4 [&_h2]:mb-2 [&_strong]:font-semibold [&_ul]:my-2 [&_li]:my-0.5">
                <ReactMarkdown>{reportContent}</ReactMarkdown>
                {isGenerating && <span className="inline-block h-4 w-0.5 animate-pulse ml-0.5 align-middle bg-primary" />}
              </div>
            )}
          </div>
          {!isGenerating && reportContent && (
            <div className="shrink-0 pt-4 flex justify-end gap-2 border-t border-border">
              <Button variant="outline" size="sm" className="gap-2">
                <Download className="h-4 w-4" /> Export PDF
              </Button>
              <Button size="sm" onClick={() => setReportOpen(false)}>Done</Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </AppLayout>
  );
}
