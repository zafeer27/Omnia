import AppLayout from "@/components/AppLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Download, FileText, TrendingUp, Users, BarChart2, RefreshCcw, Calendar } from "lucide-react";
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

const reports = [
  { title: "Weekly Executive Summary", date: "Apr 28, 2026", type: "Weekly", icon: FileText },
  { title: "Monthly MRR Report — April", date: "May 1, 2026", type: "Monthly", icon: TrendingUp },
  { title: "Customer Cohort Analysis", date: "Apr 15, 2026", type: "Custom", icon: Users },
  { title: "Marketing ROI Breakdown", date: "Apr 10, 2026", type: "Custom", icon: BarChart2 },
];

const container = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.07 } } };
const item = { hidden: { opacity: 0, y: 12 }, visible: { opacity: 1, y: 0, transition: { duration: 0.3 } } };

export default function Reports() {
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
              <Button size="sm" className="gap-2">
                <RefreshCcw className="h-4 w-4" />
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
              {reports.map((report) => (
                <motion.div key={report.title} variants={item}>
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
                        <Button variant="ghost" size="sm" className="gap-1.5 h-8 text-xs">
                          <Download className="h-3.5 w-3.5" />
                          Export
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
