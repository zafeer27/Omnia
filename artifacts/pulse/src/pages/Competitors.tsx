import { useState } from "react";
import AppLayout from "@/components/AppLayout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import { Globe, TrendingDown, TrendingUp, ExternalLink, Plus, Calendar, DollarSign, Users, Star } from "lucide-react";

type NewsItem = { date: string; headline: string; type: "pricing" | "product" | "funding" | "hiring" | "general" };
type Competitor = { id: number; name: string; tagline: string; logo: string; arr: string; customers: string; growth: string; growthDir: "up" | "down"; price: string; ourPrice: string; rating: number; news: NewsItem[]; threat: "high" | "medium" | "low" };

const COMPETITORS: Competitor[] = [
  {
    id: 1, name: "ChiefAI", tagline: "AI-powered business intelligence", logo: "C", arr: "~$8M", customers: "600+", growth: "+22%", growthDir: "up", price: "$499/mo", ourPrice: "$299/mo", rating: 4.1,
    threat: "high",
    news: [
      { date: "Apr 29", headline: "ChiefAI raises $15M Series B to expand enterprise features", type: "funding" },
      { date: "Apr 22", headline: "Launched AI board report generation — directly competes with our Reports feature", type: "product" },
      { date: "Apr 15", headline: "Increased pricing by 20% for new customers", type: "pricing" },
    ],
  },
  {
    id: 2, name: "FounderOS", tagline: "Operating system for modern founders", logo: "F", arr: "~$3.2M", customers: "280+", growth: "+8%", growthDir: "up", price: "$199/mo", ourPrice: "$299/mo", rating: 3.8,
    threat: "medium",
    news: [
      { date: "Apr 27", headline: "FounderOS announces Slack integration for daily digests", type: "product" },
      { date: "Apr 10", headline: "Hiring VP Sales — scaling GTM", type: "hiring" },
    ],
  },
  {
    id: 3, name: "MetricHQ", tagline: "Metrics and reporting for SaaS leaders", logo: "M", arr: "~$12M", customers: "1,100+", growth: "-3%", growthDir: "down", price: "$649/mo", ourPrice: "$299/mo", rating: 4.4,
    threat: "medium",
    news: [
      { date: "Apr 24", headline: "MetricHQ lost 3 key engineers to Google — product velocity concern", type: "general" },
      { date: "Apr 18", headline: "Customers report slow support response times in Q2", type: "general" },
    ],
  },
  {
    id: 4, name: "Brieferly", tagline: "Executive summaries powered by AI", logo: "B", arr: "~$800K", customers: "95+", growth: "+41%", growthDir: "up", price: "$149/mo", ourPrice: "$299/mo", rating: 3.5,
    threat: "low",
    news: [
      { date: "Apr 25", headline: "Brieferly launches free tier — aggressive growth play", type: "pricing" },
      { date: "Apr 12", headline: "Crossed 100 paying customers milestone", type: "general" },
    ],
  },
];

const NEWS_TYPE_COLORS: Record<NewsItem["type"], string> = {
  pricing: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",
  product: "bg-blue-500/10 text-blue-400 border-blue-500/20",
  funding: "bg-purple-500/10 text-purple-400 border-purple-500/20",
  hiring: "bg-green-500/10 text-green-400 border-green-500/20",
  general: "bg-muted text-muted-foreground border-border",
};

const THREAT_COLORS: Record<string, string> = {
  high: "bg-red-500/10 text-red-400 border-red-500/20",
  medium: "bg-orange-500/10 text-orange-400 border-orange-500/20",
  low: "bg-green-500/10 text-green-400 border-green-500/20",
};

export default function Competitors() {
  const [selected, setSelected] = useState<number>(1);
  const comp = COMPETITORS.find((c) => c.id === selected)!;

  return (
    <AppLayout>
      <div className="flex-1 overflow-auto p-6 md:p-8">
        <div className="max-w-6xl mx-auto space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-semibold tracking-tight">Competitor Pulse</h1>
              <p className="text-muted-foreground mt-1">Track market movements, pricing, and product changes</p>
            </div>
            <Button variant="outline" className="gap-2"><Plus className="h-4 w-4" />Track competitor</Button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Competitor list */}
            <div className="space-y-3">
              {COMPETITORS.map((c) => (
                <motion.button key={c.id} onClick={() => setSelected(c.id)} whileHover={{ scale: 1.01 }}
                  className={`w-full text-left p-4 rounded-xl border transition-all ${selected === c.id ? "border-primary/50 bg-primary/5" : "border-border bg-card hover:bg-muted/30"}`}>
                  <div className="flex items-center gap-3">
                    <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-slate-600 to-slate-800 flex items-center justify-center text-white font-bold text-sm border border-white/10">
                      {c.logo}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-sm">{c.name}</span>
                        <Badge variant="outline" className={`text-xs ${THREAT_COLORS[c.threat]}`}>{c.threat} threat</Badge>
                      </div>
                      <p className="text-xs text-muted-foreground truncate">{c.tagline}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 mt-3 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1"><DollarSign className="h-3 w-3" />{c.arr} ARR</span>
                    <span className={`flex items-center gap-1 font-medium ${c.growthDir === "up" ? "text-green-400" : "text-red-400"}`}>
                      {c.growthDir === "up" ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}{c.growth} YoY
                    </span>
                  </div>
                </motion.button>
              ))}
            </div>

            {/* Detail panel */}
            <div className="lg:col-span-2 space-y-4">
              <motion.div key={comp.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
                {/* Header */}
                <div className="p-5 rounded-xl border bg-card">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-4">
                      <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-slate-600 to-slate-800 flex items-center justify-center text-white font-bold text-lg border border-white/10">
                        {comp.logo}
                      </div>
                      <div>
                        <h2 className="text-lg font-bold">{comp.name}</h2>
                        <p className="text-sm text-muted-foreground">{comp.tagline}</p>
                        <div className="flex items-center gap-1 mt-1">
                          {[...Array(5)].map((_, i) => <Star key={i} className={`h-3 w-3 ${i < Math.floor(comp.rating) ? "text-yellow-400 fill-yellow-400" : "text-muted"}`} />)}
                          <span className="text-xs text-muted-foreground ml-1">{comp.rating}</span>
                        </div>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm" className="gap-1 text-muted-foreground"><ExternalLink className="h-3.5 w-3.5" />Visit</Button>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-5 pt-4 border-t border-border">
                    {[
                      { label: "Est. ARR", value: comp.arr },
                      { label: "Customers", value: comp.customers },
                      { label: "Their price", value: comp.price },
                      { label: "Our price", value: comp.ourPrice },
                    ].map((s) => (
                      <div key={s.label}>
                        <p className="text-xs text-muted-foreground">{s.label}</p>
                        <p className="font-semibold text-sm mt-0.5">{s.value}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Pricing comparison */}
                <div className="p-5 rounded-xl border bg-card">
                  <h3 className="text-sm font-semibold mb-3">Price Position</h3>
                  <div className="space-y-2.5">
                    <div>
                      <div className="flex justify-between text-xs mb-1"><span className="text-muted-foreground">Pulse (us)</span><span className="font-medium">{comp.ourPrice}</span></div>
                      <div className="h-2 rounded-full bg-muted overflow-hidden"><div className="h-full bg-primary rounded-full" style={{ width: "50%" }} /></div>
                    </div>
                    <div>
                      <div className="flex justify-between text-xs mb-1"><span className="text-muted-foreground">{comp.name}</span><span className="font-medium">{comp.price}</span></div>
                      <div className="h-2 rounded-full bg-muted overflow-hidden">
                        <div className="h-full bg-orange-400 rounded-full" style={{ width: `${(parseInt(comp.price.replace(/[^0-9]/g, "")) / 700) * 100}%` }} />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Recent news */}
                <div className="p-5 rounded-xl border bg-card">
                  <h3 className="text-sm font-semibold mb-3 flex items-center gap-2"><Globe className="h-4 w-4 text-muted-foreground" />Recent Intel</h3>
                  <div className="space-y-3">
                    {comp.news.map((item, i) => (
                      <div key={i} className="flex gap-3">
                        <div className="flex items-center gap-2 shrink-0 mt-0.5">
                          <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
                          <span className="text-xs text-muted-foreground w-12">{item.date}</span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm leading-relaxed">{item.headline}</p>
                          <Badge variant="outline" className={`text-xs mt-1 ${NEWS_TYPE_COLORS[item.type]}`}>{item.type}</Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
