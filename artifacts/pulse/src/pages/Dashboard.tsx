import { useState } from "react";
import AppLayout from "@/components/AppLayout";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { motion } from "framer-motion";
import { AlertTriangle, TrendingUp, Users, ArrowUpRight, ArrowDownRight, RefreshCcw, Download, Sparkles, Loader2 } from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, BarChart, Bar, Cell } from "recharts";
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
  const value = base + (progress * 64000) + noise;
  return { day: i + 1, revenue: Math.round(value) };
});

const acquisitionData = [
  { channel: "LinkedIn", percentage: 38, color: "#6366f1" },
  { channel: "Organic", percentage: 28, color: "#22c55e" },
  { channel: "Referrals", percentage: 22, color: "#a855f7" },
  { channel: "Paid", percentage: 12, color: "#f59e0b" },
];

const riskCustomers = [
  { name: "Pinnacle Corp", arr: "$12K", issue: "45 days inactive", severity: "high" },
  { name: "TechFlow", arr: "$8K", issue: "usage −60%", severity: "high" },
  { name: "BuildRight", arr: "$6K", issue: "3 failed payments", severity: "medium" },
];

const KPI_CONFIG = [
  {
    label: "MRR",
    value: "$284K",
    change: "+12.4% from last month",
    up: true,
    icon: TrendingUp,
    accent: "#6366f1",
    glow: "rgba(99,102,241,0.15)",
  },
  {
    label: "Customers",
    value: "1,847",
    change: "+8.2% from last month",
    up: true,
    icon: Users,
    accent: "#22c55e",
    glow: "rgba(34,197,94,0.12)",
  },
  {
    label: "Churn Rate",
    value: "3.2%",
    change: "−0.5% from last month",
    up: false,
    icon: RefreshCcw,
    accent: "#f59e0b",
    glow: "rgba(245,158,11,0.12)",
  },
  {
    label: "LTV : CAC",
    value: "16.8x",
    change: "+15% from last month",
    up: true,
    icon: TrendingUp,
    accent: "#a855f7",
    glow: "rgba(168,85,247,0.12)",
  },
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
              if (data.type === "content_block_delta" && data.delta?.text) {
                full += data.delta.text;
                setReportContent(full);
              }
            } catch {}
          }
        }
      }
    } catch {
      setReportContent("Sorry, there was an error generating the report. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <AppLayout>
      <div className="flex-1 overflow-auto p-6 md:p-8">
        <div className="max-w-7xl mx-auto space-y-7">

          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-semibold tracking-tight">Good morning, founder</h1>
              <p className="text-sm mt-1" style={{ color: "hsl(var(--muted-foreground))" }}>
                Here's what's happening with your business today.
              </p>
            </div>
            <Button
              onClick={handleGenerateReport}
              disabled={isGenerating}
              className="gap-2 shadow-lg"
              style={{ boxShadow: "0 0 20px rgba(99,102,241,0.3)" }}
            >
              {isGenerating ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
              Generate Weekly Report
            </Button>
          </div>

          {/* AI Insight */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="rounded-xl p-4 flex gap-4 border"
            style={{
              background: "linear-gradient(135deg, rgba(99,102,241,0.08), rgba(168,85,247,0.05))",
              borderColor: "rgba(99,102,241,0.2)",
            }}
          >
            <div className="mt-0.5 rounded-lg h-8 w-8 shrink-0 flex items-center justify-center"
              style={{ background: "rgba(99,102,241,0.15)" }}>
              <Sparkles className="h-4 w-4" style={{ color: "#818cf8" }} />
            </div>
            <div>
              <h3 className="text-sm font-semibold mb-1" style={{ color: "#818cf8" }}>AI Insight of the Day</h3>
              <p className="text-sm leading-relaxed" style={{ color: "hsl(var(--foreground)/0.85)" }}>
                Revenue is up 12.4% this month, but churn spiked 0.8% in the last 7 days — focus on retention before adding acquisition spend.
              </p>
            </div>
          </motion.div>

          {/* KPI Cards */}
          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
            initial="hidden"
            animate="visible"
            variants={{ visible: { transition: { staggerChildren: 0.08 } } }}
          >
            {KPI_CONFIG.map((kpi) => (
              <motion.div
                key={kpi.label}
                variants={{ hidden: { opacity: 0, y: 16 }, visible: { opacity: 1, y: 0, transition: { duration: 0.4 } } }}
              >
                <div className="rounded-xl border p-5 relative overflow-hidden transition-all hover:border-opacity-80"
                  style={{
                    background: `linear-gradient(135deg, hsl(var(--card)), hsl(var(--card)))`,
                    borderColor: "hsl(var(--border))",
                  }}
                  onMouseEnter={(e) => { (e.currentTarget as HTMLDivElement).style.borderColor = kpi.accent + "40"; }}
                  onMouseLeave={(e) => { (e.currentTarget as HTMLDivElement).style.borderColor = "hsl(var(--border))"; }}
                >
                  {/* Glow */}
                  <div className="absolute top-0 right-0 w-24 h-24 rounded-full pointer-events-none"
                    style={{ background: kpi.glow, filter: "blur(20px)", transform: "translate(30%, -30%)" }} />
                  {/* Top bar accent */}
                  <div className="absolute top-0 left-0 right-0 h-0.5 rounded-t-xl"
                    style={{ background: `linear-gradient(90deg, ${kpi.accent}, transparent)` }} />

                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-medium uppercase tracking-wider" style={{ color: "hsl(var(--muted-foreground))" }}>
                      {kpi.label}
                    </span>
                    <div className="h-7 w-7 rounded-lg flex items-center justify-center"
                      style={{ background: kpi.accent + "18" }}>
                      <kpi.icon className="h-3.5 w-3.5" style={{ color: kpi.accent }} />
                    </div>
                  </div>
                  <div className="text-2xl font-bold tracking-tight mb-2">{kpi.value}</div>
                  <p className="text-xs flex items-center gap-1 font-medium"
                    style={{ color: kpi.label === "Churn Rate" ? "#f59e0b" : "#22c55e" }}>
                    {kpi.up ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
                    {kpi.change}
                  </p>
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

            {/* Revenue Chart */}
            <div className="lg:col-span-2 rounded-xl border p-5" style={{ background: "hsl(var(--card))", borderColor: "hsl(var(--border))" }}>
              <div className="flex items-center justify-between mb-5">
                <div>
                  <h3 className="text-sm font-semibold">Revenue</h3>
                  <p className="text-xs mt-0.5" style={{ color: "hsl(var(--muted-foreground))" }}>Last 30 days</p>
                </div>
                <div className="text-xs font-semibold px-2.5 py-1 rounded-full"
                  style={{ background: "rgba(34,197,94,0.1)", color: "#22c55e" }}>
                  ↑ $64K MoM
                </div>
              </div>
              <div className="h-[260px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={revenueData} margin={{ top: 5, right: 0, left: 0, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#6366f1" stopOpacity={0.4} />
                        <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <XAxis dataKey="day" axisLine={false} tickLine={false}
                      tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }}
                      tickFormatter={(v) => `D${v}`} minTickGap={30} />
                    <YAxis axisLine={false} tickLine={false}
                      tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }}
                      tickFormatter={(v) => `$${v / 1000}k`} />
                    <Tooltip
                      contentStyle={{ backgroundColor: "hsl(var(--card))", borderColor: "hsl(var(--border))", borderRadius: "10px", fontSize: 12, boxShadow: "0 4px 20px rgba(0,0,0,0.3)" }}
                      formatter={(v: number) => [`$${v.toLocaleString()}`, "Revenue"]}
                      labelFormatter={(l) => `Day ${l}`}
                    />
                    <Area type="monotone" dataKey="revenue" stroke="#6366f1" strokeWidth={2}
                      fillOpacity={1} fill="url(#colorRevenue)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="space-y-5 flex flex-col">

              {/* Acquisition */}
              <div className="flex-1 rounded-xl border p-5" style={{ background: "hsl(var(--card))", borderColor: "hsl(var(--border))" }}>
                <h3 className="text-sm font-semibold mb-4">Acquisition by Channel</h3>
                <div className="space-y-3">
                  {acquisitionData.map((item) => (
                    <div key={item.channel}>
                      <div className="flex justify-between text-xs mb-1.5">
                        <span style={{ color: "hsl(var(--foreground))" }}>{item.channel}</span>
                        <span className="font-semibold" style={{ color: item.color }}>{item.percentage}%</span>
                      </div>
                      <div className="h-1.5 rounded-full overflow-hidden" style={{ background: "hsl(var(--muted))" }}>
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${item.percentage}%` }}
                          transition={{ duration: 0.8, delay: 0.2 }}
                          className="h-full rounded-full"
                          style={{ background: item.color }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Top Risks */}
              <div className="flex-1 rounded-xl border p-5" style={{ background: "hsl(var(--card))", borderColor: "hsl(var(--border))" }}>
                <h3 className="text-sm font-semibold mb-4 flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4 text-red-400" />
                  At-Risk Accounts
                </h3>
                <div className="space-y-3">
                  {riskCustomers.map((c) => (
                    <div key={c.name} className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium">{c.name}</p>
                        <p className="text-xs" style={{ color: "hsl(var(--muted-foreground))" }}>{c.issue}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-semibold">{c.arr}</p>
                        <span className={`text-[10px] px-1.5 py-0.5 rounded font-medium uppercase tracking-wide ${
                          c.severity === "high"
                            ? "bg-red-500/10 text-red-400"
                            : "bg-yellow-500/10 text-yellow-400"
                        }`}>{c.severity}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Weekly Report Dialog */}
      <Dialog open={reportOpen} onOpenChange={setReportOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh] flex flex-col">
          <DialogHeader className="shrink-0">
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 rounded-lg flex items-center justify-center"
                style={{ background: "rgba(99,102,241,0.15)" }}>
                <Sparkles className="h-4 w-4" style={{ color: "#818cf8" }} />
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
              <div className="flex flex-col items-center justify-center h-40 gap-3" style={{ color: "hsl(var(--muted-foreground))" }}>
                <Loader2 className="h-6 w-6 animate-spin" style={{ color: "#818cf8" }} />
                <p className="text-sm">Analyzing your metrics...</p>
              </div>
            ) : (
              <div className="prose prose-sm dark:prose-invert max-w-none text-sm leading-relaxed [&_h2]:text-sm [&_h2]:font-semibold [&_h2]:mt-4 [&_h2]:mb-2 [&_strong]:font-semibold [&_ul]:my-2 [&_li]:my-0.5">
                <ReactMarkdown>{reportContent}</ReactMarkdown>
                {isGenerating && <span className="inline-block h-4 w-0.5 animate-pulse ml-0.5 align-middle" style={{ background: "#818cf8" }} />}
              </div>
            )}
          </div>
          {!isGenerating && reportContent && (
            <div className="shrink-0 pt-4 flex justify-end gap-2" style={{ borderTop: "1px solid hsl(var(--border))" }}>
              <Button variant="outline" size="sm" className="gap-2">
                <Download className="h-4 w-4" />Export PDF
              </Button>
              <Button size="sm" onClick={() => setReportOpen(false)}>Done</Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </AppLayout>
  );
}
