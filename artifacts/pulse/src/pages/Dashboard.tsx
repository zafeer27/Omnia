import AppLayout from "@/components/AppLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { motion } from "framer-motion";
import { AlertTriangle, TrendingUp, Users, ArrowUpRight, ArrowDownRight, RefreshCcw, Download, Sparkles } from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, BarChart, Bar, Cell } from "recharts";

// Mock data for charts
const revenueData = Array.from({ length: 30 }).map((_, i) => {
  const base = 220000;
  const progress = i / 29;
  const noise = (Math.random() - 0.5) * 15000;
  const value = base + (progress * 64000) + noise;
  return {
    day: i + 1,
    revenue: Math.round(value),
  };
});

const acquisitionData = [
  { channel: "LinkedIn", percentage: 38, color: "hsl(var(--chart-1))" },
  { channel: "Organic", percentage: 28, color: "hsl(var(--chart-2))" },
  { channel: "Referrals", percentage: 22, color: "hsl(var(--chart-3))" },
  { channel: "Paid", percentage: 12, color: "hsl(var(--chart-4))" },
];

const riskCustomers = [
  { name: "Acme Corp", arr: "$12K", issue: "45 days inactive", severity: "high" },
  { name: "TechFlow", arr: "$8K", issue: "usage -60%", severity: "medium" },
  { name: "BuildRight", arr: "$6K", issue: "3 failed payments", severity: "high" },
];

export default function Dashboard() {
  const kpiVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  return (
    <AppLayout>
      <div className="flex-1 overflow-auto p-6 md:p-8">
        <div className="max-w-7xl mx-auto space-y-8">
          
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-semibold tracking-tight">Good morning, founder</h1>
              <p className="text-muted-foreground mt-1">Here is what is happening with your business today.</p>
            </div>
            <Button data-testid="button-generate-report" className="shadow-sm">
              <Download className="mr-2 h-4 w-4" />
              Generate Weekly Report
            </Button>
          </div>

          {/* AI Insight */}
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-xl border border-orange-500/20 bg-orange-500/5 p-4 flex gap-4"
          >
            <div className="mt-0.5 bg-orange-500/20 p-2 rounded-lg h-fit">
              <Sparkles className="h-5 w-5 text-orange-500" />
            </div>
            <div>
              <h3 className="font-semibold text-orange-500 mb-1 flex items-center gap-2">
                AI Insight of the Day
              </h3>
              <p className="text-sm text-foreground/90 leading-relaxed">
                Revenue is up 12.4% this month, but your churn rate has increased 0.8% in the last 7 days — focus on retention before adding more acquisition spend.
              </p>
            </div>
          </motion.div>

          {/* KPIs */}
          <motion.div 
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
            initial="hidden"
            animate="visible"
            variants={{
              visible: { transition: { staggerChildren: 0.1 } }
            }}
          >
            <motion.div variants={kpiVariants}>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">MRR</CardTitle>
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">$284K</div>
                  <p className="text-xs text-green-500 flex items-center mt-1 font-medium">
                    <ArrowUpRight className="h-3 w-3 mr-1" />
                    +12.4% from last month
                  </p>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div variants={kpiVariants}>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Customers</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">1,847</div>
                  <p className="text-xs text-green-500 flex items-center mt-1 font-medium">
                    <ArrowUpRight className="h-3 w-3 mr-1" />
                    +8.2% from last month
                  </p>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div variants={kpiVariants}>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Churn Rate</CardTitle>
                  <RefreshCcw className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">3.2%</div>
                  <p className="text-xs text-green-500 flex items-center mt-1 font-medium">
                    <ArrowDownRight className="h-3 w-3 mr-1" />
                    -0.5% from last month
                  </p>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div variants={kpiVariants}>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">LTV:CAC</CardTitle>
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">16.8x</div>
                  <p className="text-xs text-green-500 flex items-center mt-1 font-medium">
                    <ArrowUpRight className="h-3 w-3 mr-1" />
                    +15% from last month
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>

          {/* Charts and Lists */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Revenue Chart */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Revenue (Last 30 Days)</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[300px] w-full mt-4">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={revenueData} margin={{ top: 5, right: 0, left: 0, bottom: 0 }}>
                      <defs>
                        <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3}/>
                          <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <XAxis 
                        dataKey="day" 
                        axisLine={false} 
                        tickLine={false} 
                        tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }}
                        tickFormatter={(value) => `Day ${value}`}
                        minTickGap={30}
                      />
                      <YAxis 
                        axisLine={false} 
                        tickLine={false} 
                        tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }}
                        tickFormatter={(value) => `$${value / 1000}k`}
                      />
                      <Tooltip 
                        contentStyle={{ backgroundColor: "hsl(var(--card))", borderColor: "hsl(var(--border))", borderRadius: "8px" }}
                        formatter={(value: number) => [`$${value.toLocaleString()}`, "Revenue"]}
                        labelFormatter={(label) => `Day ${label}`}
                      />
                      <Area 
                        type="monotone" 
                        dataKey="revenue" 
                        stroke="hsl(var(--primary))" 
                        strokeWidth={2}
                        fillOpacity={1} 
                        fill="url(#colorRevenue)" 
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <div className="space-y-6 flex flex-col">
              
              {/* Acquisition Chart */}
              <Card className="flex-1">
                <CardHeader className="pb-2">
                  <CardTitle>Acquisition by Channel</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-[140px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={acquisitionData} layout="vertical" margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                        <XAxis type="number" hide />
                        <YAxis dataKey="channel" type="category" axisLine={false} tickLine={false} tick={{ fontSize: 12 }} width={80} />
                        <Tooltip cursor={{ fill: 'transparent' }} contentStyle={{ backgroundColor: "hsl(var(--card))", borderColor: "hsl(var(--border))" }} />
                        <Bar dataKey="percentage" radius={[0, 4, 4, 0]} barSize={16}>
                          {acquisitionData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              {/* Top Risks */}
              <Card className="flex-1">
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4 text-destructive" />
                    Top Risks
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4 mt-2">
                    {riskCustomers.map((customer) => (
                      <div key={customer.name} className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium">{customer.name}</p>
                          <p className="text-xs text-muted-foreground">{customer.issue}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-medium">{customer.arr}</p>
                          <span className={`text-[10px] px-1.5 py-0.5 rounded-sm font-medium uppercase tracking-wider ${
                            customer.severity === 'high' 
                              ? 'bg-destructive/10 text-destructive' 
                              : 'bg-yellow-500/10 text-yellow-500'
                          }`}>
                            {customer.severity}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

          </div>
        </div>
      </div>
    </AppLayout>
  );
}
