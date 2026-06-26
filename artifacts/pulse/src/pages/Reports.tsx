import { useState } from "react";
import AppLayout from "@/components/AppLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { motion, AnimatePresence } from "framer-motion";
import { Download, FileText, TrendingUp, Users, BarChart2, RefreshCcw, Calendar, Loader2, Sparkles } from "lucide-react";
import ReactMarkdown from "react-markdown";
import {
  AreaChart, Area, BarChart, Bar, LineChart, Line,
  XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend
} from "recharts";

const months = ["Oct", "Nov", "Dec", "Jan", "Feb", "Mar", "Apr", "May"];

const mrrData = months.map((month, i) => ({
  month,
  mrr: Math.round(180000 + i * 15000 + (Math.random() - 0.4) * 8000),
  churn: Math.round(8000 + (Math.random() - 0.5) * 3000),
}));

const customerData = months.map((month, i) => ({
  month,
  new: Math.round(60 + i * 8 + (Math.random() - 0.5) * 10),
  churned: Math.round(12 + (Math.random() - 0.5) * 6),
}));

const cacLtvData = months.map((month, i) => ({
  month,
  cac: Math.round(420 - i * 8 + (Math.random() - 0.5) * 30),
  ltv: Math.round(6800 + i * 200 + (Math.random() - 0.5) * 200),
}));

type SavedReport = {
  title: string;
  date: string;
  type: string;
  icon: any;
  content?: string;
};

const INITIAL_REPORTS: SavedReport[] = [
  { title: "Weekly Executive Summary", date: "Apr 28, 2026", type: "Weekly", icon: FileText },
  { title: "Monthly MRR Report — April", date: "May 1, 2026", type: "Monthly", icon: TrendingUp },
  { title: "Customer Cohort Analysis", date: "Apr 15, 2026", type: "Custom", icon: Users },
  { title: "Marketing ROI Breakdown", date: "Apr 10, 2026", type: "Custom", icon: BarChart2 },
];

const MOCK_REPORT = `## Executive Summary

Strong momentum continues into Q2 2026. MRR reached **$284K** this week — a **+12.4% month-over-month** increase — driven primarily by LinkedIn and organic acquisition. Customer count grew to **1,847 active accounts** (+8.2% MoM) and the LTV:CAC ratio hit a record 16.8×. While top-line metrics are healthy, three enterprise accounts now require immediate intervention before the next billing cycle.

## Revenue Highlights

- **MRR:** $284K — up $31K from last month, tracking ahead of the $300K quarterly target
- **LTV:CAC Ratio:** 16.8× (+15% MoM) — capital efficiency at a record high
- **Expansion MRR:** +$18K from Acme Corp's 200-seat upgrade completed this cycle
- **Churn rate:** 3.2% — improved 0.5pp MoM, but a 0.8pp spike in the trailing 7 days requires monitoring

## Customer Health

Three enterprise accounts show elevated churn signals:

| Account | ARR | Risk Signal |
|---|---|---|
| **Pinnacle Corp** | $12K | 45 days with zero active sessions |
| **TechFlow** | $8K | Usage dropped 60% over 14 days |
| **BuildRight** | $6K | 3 consecutive failed Stripe payments |

Combined exposure: **$26K ARR** (9.2% of MRR). Intervention required before next billing cycle.

## Top Priorities This Week

1. **Trigger At-Risk Recovery Playbook** for Pinnacle Corp and TechFlow — assign CSM outreach within 24 hours
2. **Resolve BuildRight payment failure** — contact finance contact directly; Stripe retry scheduled in 24 hours
3. **Pause new paid acquisition spend** until churn trend reverses — reallocate budget to retention programs

## Risks to Watch

- **Churn acceleration:** 0.8pp spike in 7 days could compound — monitor daily through month-end
- **LinkedIn CAC rising 18%** over 2 weeks — evaluate bid strategy and creative refresh before next spend cycle
- **Engineering capacity:** Two senior engineers flagged bandwidth constraints that may delay Q3 roadmap commitments
`;

const container = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.07 } } };
const item = { hidden: { opacity: 0, y: 12 }, visible: { opacity: 1, y: 0, transition: { duration: 0.3 } } };

export default function Reports() {
  const [reports, setReports] = useState<SavedReport[]>(INITIAL_REPORTS);
  const [isGenerating, setIsGenerating] = useState(false);
  const [reportOpen, setReportOpen] = useState(false);
  const [reportContent, setReportContent] = useState("");
  const [viewingReport, setViewingReport] = useState<SavedReport | null>(null);

  const handleGenerateReport = () => {
    setReportContent("");
    setViewingReport(null);
    setReportOpen(true);
    setIsGenerating(true);

    setTimeout(() => {
      setReportContent(MOCK_REPORT);
      setIsGenerating(false);
      const newReport: SavedReport = {
        title: "Weekly Executive Summary",
        date: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
        type: "Weekly",
        icon: Sparkles,
        content: MOCK_REPORT,
      };
      setReports((prev) => [newReport, ...prev]);
    }, 1500);
  };

  const handleViewReport = (report: SavedReport) => {
    if (report.content) {
      setReportContent(report.content);
      setViewingReport(report);
      setReportOpen(true);
    }
  };

  return (
    <AppLayout>
      <div className="flex-1 overflow-auto p-8">
        <div className="max-w-5xl mx-auto space-y-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold tracking-tight">Reports</h1>
              <p className="text-muted-foreground mt-1">Trends, analytics, and exportable summaries</p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" className="gap-2">
                <Calendar className="h-4 w-4" />
                Last 8 months
              </Button>
              <Button size="sm" className="gap-2" onClick={handleGenerateReport} disabled={isGenerating}>
                {isGenerating ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCcw className="h-4 w-4" />}
                Generate report
              </Button>
            </div>
          </div>

          {/* Charts */}
          <motion.div variants={container} initial="hidden" animate="visible" className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <motion.div variants={item}>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-semibold">MRR Growth vs Churn Revenue</CardTitle>
                  <CardDescription>Monthly recurring revenue and revenue lost to churn</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={200}>
                    <AreaChart data={mrrData} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
                      <defs>
                        <linearGradient id="mrrGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="hsl(var(--chart-1))" stopOpacity={0.3} />
                          <stop offset="95%" stopColor="hsl(var(--chart-1))" stopOpacity={0} />
                        </linearGradient>
                        <linearGradient id="churnGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="hsl(var(--chart-5))" stopOpacity={0.3} />
                          <stop offset="95%" stopColor="hsl(var(--chart-5))" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                      <XAxis dataKey="month" tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} axisLine={false} tickLine={false} />
                      <YAxis tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} axisLine={false} tickLine={false} tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`} />
                      <Tooltip formatter={(v: number) => [`$${v.toLocaleString()}`, ""]} contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8, fontSize: 12 }} />
                      <Area type="monotone" dataKey="mrr" name="MRR" stroke="hsl(var(--chart-1))" fill="url(#mrrGrad)" strokeWidth={2} />
                      <Area type="monotone" dataKey="churn" name="Churn" stroke="hsl(var(--chart-5))" fill="url(#churnGrad)" strokeWidth={2} />
                    </AreaChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div variants={item}>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-semibold">New vs Churned Customers</CardTitle>
                  <CardDescription>Monthly customer acquisition and churn count</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={200}>
                    <BarChart data={customerData} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                      <XAxis dataKey="month" tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} axisLine={false} tickLine={false} />
                      <YAxis tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} axisLine={false} tickLine={false} />
                      <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8, fontSize: 12 }} />
                      <Bar dataKey="new" name="New" fill="hsl(var(--chart-2))" radius={[4, 4, 0, 0]} />
                      <Bar dataKey="churned" name="Churned" fill="hsl(var(--chart-5))" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div variants={item} className="lg:col-span-2">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-semibold">CAC vs LTV Trend</CardTitle>
                  <CardDescription>Customer acquisition cost vs lifetime value — ratio is your efficiency score</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={200}>
                    <LineChart data={cacLtvData} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                      <XAxis dataKey="month" tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} axisLine={false} tickLine={false} />
                      <YAxis tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} axisLine={false} tickLine={false} tickFormatter={(v) => `$${(v / 1000).toFixed(1)}k`} />
                      <Tooltip formatter={(v: number) => [`$${v.toLocaleString()}`, ""]} contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8, fontSize: 12 }} />
                      <Legend wrapperStyle={{ fontSize: 12 }} />
                      <Line type="monotone" dataKey="ltv" name="LTV" stroke="hsl(var(--chart-1))" strokeWidth={2} dot={false} />
                      <Line type="monotone" dataKey="cac" name="CAC" stroke="hsl(var(--chart-4))" strokeWidth={2} dot={false} />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>

          {/* Saved reports */}
          <div>
            <h2 className="text-base font-semibold mb-4">Saved Reports</h2>
            <motion.div variants={container} initial="hidden" animate="visible" className="space-y-3">
              <AnimatePresence>
                {reports.map((report, idx) => (
                  <motion.div
                    key={`${report.title}-${idx}`}
                    variants={item}
                    initial="hidden"
                    animate="visible"
                    layout
                  >
                    <Card className="hover:border-border/80 transition-colors">
                      <CardContent className="p-4 flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                            <report.icon className="h-5 w-5" />
                          </div>
                          <div>
                            <p className="text-sm font-medium">{report.title}</p>
                            <p className="text-xs text-muted-foreground mt-0.5">{report.date}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="text-xs bg-secondary text-muted-foreground px-2 py-0.5 rounded">{report.type}</span>
                          {report.content && (
                            <Button
                              variant="ghost"
                              size="sm"
                              className="gap-1.5 h-8 text-xs"
                              onClick={() => handleViewReport(report)}
                            >
                              View
                            </Button>
                          )}
                          <Button variant="ghost" size="sm" className="gap-1.5 h-8 text-xs">
                            <Download className="h-3.5 w-3.5" />
                            Export
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Report Modal */}
      <Dialog open={reportOpen} onOpenChange={setReportOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh] flex flex-col">
          <DialogHeader className="shrink-0">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="h-7 w-7 rounded-md bg-primary/10 flex items-center justify-center text-primary">
                  <Sparkles className="h-4 w-4" />
                </div>
                <DialogTitle>{viewingReport ? viewingReport.title : "Weekly Executive Summary"}</DialogTitle>
              </div>
            </div>
            <DialogDescription>
              {viewingReport ? viewingReport.date : new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" })}
            </DialogDescription>
          </DialogHeader>

          <div className="flex-1 overflow-y-auto mt-2 pr-1">
            {isGenerating && reportContent === "" ? (
              <div className="flex flex-col items-center justify-center h-40 gap-3 text-muted-foreground">
                <Loader2 className="h-6 w-6 animate-spin text-primary" />
                <p className="text-sm">Analyzing your metrics...</p>
              </div>
            ) : (
              <div className="prose prose-sm dark:prose-invert max-w-none text-sm leading-relaxed [&_h2]:text-base [&_h2]:font-semibold [&_h2]:mt-4 [&_h2]:mb-2 [&_strong]:font-semibold [&_ul]:my-2 [&_li]:my-0.5">
                <ReactMarkdown>{reportContent}</ReactMarkdown>
                {isGenerating && (
                  <span className="inline-block h-4 w-0.5 bg-primary animate-pulse ml-0.5 align-middle" />
                )}
              </div>
            )}
          </div>

          {!isGenerating && reportContent && (
            <div className="shrink-0 pt-4 border-t border-border flex justify-end gap-2">
              <Button variant="outline" size="sm" className="gap-2">
                <Download className="h-4 w-4" />
                Export PDF
              </Button>
              <Button size="sm" onClick={() => setReportOpen(false)}>Done</Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </AppLayout>
  );
}
