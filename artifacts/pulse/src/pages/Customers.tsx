import { useState } from "react";
import AppLayout from "@/components/AppLayout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { motion, AnimatePresence } from "framer-motion";
import { Users, Heart, AlertTriangle, Star, UserX, Search, Sparkles, Loader2, TrendingDown, TrendingUp, Clock } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { useCreateAnthropicConversation } from "@workspace/api-client-react";

type Health = "champion" | "healthy" | "at-risk" | "churned";
type Customer = { id: number; name: string; arr: number; health: Health; score: number; lastActive: string; since: string; seats: number; trend: "up" | "down" | "flat"; note: string };

const CUSTOMERS: Customer[] = [
  { id: 1, name: "Acme Corp", arr: 24000, health: "champion", score: 94, lastActive: "Today", since: "Jan 2025", seats: 200, trend: "up", note: "Expanded from 50 to 200 seats last month" },
  { id: 2, name: "NovaStar Inc", arr: 18000, health: "champion", score: 91, lastActive: "Today", since: "Mar 2025", seats: 85, trend: "up", note: "Referred 2 new customers this quarter" },
  { id: 3, name: "Meridian Labs", arr: 15600, health: "healthy", score: 82, lastActive: "2d ago", since: "Jun 2025", seats: 60, trend: "flat", note: "Consistent usage, renewal due in 60 days" },
  { id: 4, name: "Vertex Systems", arr: 12000, health: "healthy", score: 78, lastActive: "3d ago", since: "Aug 2025", seats: 45, trend: "flat", note: "Engaged with new features, support tickets resolved" },
  { id: 5, name: "SkyBridge Co", arr: 9600, health: "healthy", score: 71, lastActive: "5d ago", since: "Sep 2025", seats: 32, trend: "down", note: "Usage slightly down, check-in scheduled" },
  { id: 6, name: "Acme Corp", arr: 12000, health: "at-risk", score: 38, lastActive: "45d ago", since: "Feb 2025", seats: 42, trend: "down", note: "No logins in 45 days. Champion contact left company." },
  { id: 7, name: "TechFlow", arr: 8000, health: "at-risk", score: 29, lastActive: "18d ago", since: "Apr 2025", seats: 28, trend: "down", note: "Usage dropped 60% over 2 weeks. No response to outreach." },
  { id: 8, name: "BuildRight", arr: 6000, health: "at-risk", score: 22, lastActive: "12d ago", since: "May 2025", seats: 20, trend: "down", note: "3 failed payments. Account owner unreachable." },
  { id: 9, name: "Bluewave Ltd", arr: 5200, health: "churned", score: 0, lastActive: "62d ago", since: "Nov 2024", seats: 0, trend: "down", note: "Cancelled — migrated to competitor (MetricHQ)" },
];

const HEALTH_CONFIG: Record<Health, { label: string; icon: React.ElementType; color: string; badge: string; bg: string }> = {
  champion: { label: "Champion", icon: Star, color: "text-yellow-400", badge: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20", bg: "bg-yellow-500" },
  healthy: { label: "Healthy", icon: Heart, color: "text-green-400", badge: "bg-green-500/10 text-green-400 border-green-500/20", bg: "bg-green-500" },
  "at-risk": { label: "At Risk", icon: AlertTriangle, color: "text-red-400", badge: "bg-red-500/10 text-red-400 border-red-500/20", bg: "bg-red-500" },
  churned: { label: "Churned", icon: UserX, color: "text-muted-foreground", badge: "bg-muted text-muted-foreground border-border", bg: "bg-muted-foreground" },
};

const AI_PROMPT = `You are Pulse. The following accounts are at risk of churning for TechScale Inc:
1. Acme Corp – $12K ARR, 45 days inactive, champion contact left
2. TechFlow – $8K ARR, usage -60% over 14 days, not responding
3. BuildRight – $6K ARR, 3 failed payments, account owner unreachable
Total at risk: $26K ARR

Provide a specific action plan for saving each account. For each:
**Account Name** ($ARR at risk)
- Root cause assessment (1 sentence)
- Recommended action (specific, with timeline)
- Who should own the outreach

Keep each recommendation to 3-4 lines. Be direct and tactical.`;

export default function Customers() {
  const [filter, setFilter] = useState<Health | "all">("all");
  const [search, setSearch] = useState("");
  const [aiOpen, setAiOpen] = useState(false);
  const [aiContent, setAiContent] = useState("");
  const [generating, setGenerating] = useState(false);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const createConversation = useCreateAnthropicConversation();

  const handleAI = async () => {
    setAiContent("");
    setAiOpen(true);
    setGenerating(true);
    try {
      const conv = await new Promise<{ id: number }>((resolve, reject) => {
        createConversation.mutate({ data: { title: "Customer Health" } }, { onSuccess: resolve, onError: reject });
      });
      const res = await fetch(`${import.meta.env.BASE_URL}api/anthropic/conversations/${conv.id}/messages`, {
        method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ content: AI_PROMPT }),
      });
      const reader = res.body!.getReader();
      const dec = new TextDecoder();
      let full = "";
      while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        for (const line of dec.decode(value, { stream: true }).split("\n")) {
          if (line.startsWith("data: ")) {
            try { const d = JSON.parse(line.slice(6)); if (d.type === "content_block_delta" && d.delta?.text) { full += d.delta.text; setAiContent(full); } } catch {}
          }
        }
      }
    } catch { setAiContent("Error generating recommendations."); }
    finally { setGenerating(false); }
  };

  const displayed = CUSTOMERS.filter((c) => {
    const matchFilter = filter === "all" || c.health === filter;
    const matchSearch = c.name.toLowerCase().includes(search.toLowerCase());
    return matchFilter && matchSearch;
  });

  const atRiskARR = CUSTOMERS.filter((c) => c.health === "at-risk").reduce((a, c) => a + c.arr, 0);

  return (
    <AppLayout>
      <div className="flex-1 overflow-auto p-6 md:p-8">
        <div className="max-w-5xl mx-auto space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-semibold tracking-tight">Customer Health</h1>
              <p className="text-muted-foreground mt-1">Health scores, risk signals, and expansion opportunities</p>
            </div>
            <Button onClick={handleAI} disabled={generating} className="gap-2">
              {generating ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
              AI Save Playbook
            </Button>
          </div>

          {/* Summary */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {(["champion", "healthy", "at-risk", "churned"] as Health[]).map((h) => {
              const cfg = HEALTH_CONFIG[h];
              const count = CUSTOMERS.filter((c) => c.health === h).length;
              const arr = CUSTOMERS.filter((c) => c.health === h).reduce((a, c) => a + c.arr, 0);
              return (
                <button key={h} onClick={() => setFilter(filter === h ? "all" : h)}
                  className={`rounded-xl border p-4 text-left transition-all ${filter === h ? "border-primary/50 bg-primary/5" : "border-border bg-card hover:bg-muted/20"}`}>
                  <div className="flex items-center justify-between mb-2">
                    <cfg.icon className={`h-4 w-4 ${cfg.color}`} />
                    <span className="text-xs text-muted-foreground">{count} accounts</span>
                  </div>
                  <div className="text-xl font-bold">{count}</div>
                  <div className={`text-xs font-medium ${cfg.color}`}>{cfg.label}</div>
                  <div className="text-xs text-muted-foreground mt-1">${(arr / 1000).toFixed(0)}K ARR</div>
                </button>
              );
            })}
          </div>

          {/* At-risk callout */}
          {atRiskARR > 0 && (
            <div className="rounded-xl border border-red-500/20 bg-red-500/5 p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <AlertTriangle className="h-5 w-5 text-red-400 shrink-0" />
                <div>
                  <p className="text-sm font-semibold text-red-400">${(atRiskARR / 1000).toFixed(0)}K ARR at risk of churning</p>
                  <p className="text-xs text-muted-foreground mt-0.5">3 accounts need immediate attention</p>
                </div>
              </div>
              <Button variant="outline" size="sm" className="border-red-500/30 text-red-400 hover:text-red-300 shrink-0" onClick={handleAI}>
                Get AI playbook
              </Button>
            </div>
          )}

          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search customers..." className="w-full pl-9 pr-4 py-2 rounded-lg border border-border bg-card text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" />
          </div>

          {/* Customer list */}
          <div className="space-y-2">
            {displayed.map((c, i) => {
              const cfg = HEALTH_CONFIG[c.health];
              return (
                <motion.button key={c.id} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }}
                  onClick={() => setSelectedId(selectedId === c.id ? null : c.id)}
                  className={`w-full text-left p-4 rounded-xl border bg-card hover:bg-muted/20 transition-all ${selectedId === c.id ? "border-primary/40" : "border-border"}`}>
                  <div className="flex items-center gap-4">
                    <div className={`h-9 w-9 rounded-lg ${cfg.bg} bg-opacity-20 flex items-center justify-center shrink-0`}>
                      <cfg.icon className={`h-4 w-4 ${cfg.color}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-sm">{c.name}</span>
                          <Badge variant="outline" className={`text-xs ${cfg.badge}`}>{cfg.label}</Badge>
                        </div>
                        <div className="flex items-center gap-4 text-xs text-muted-foreground shrink-0">
                          <span className="font-semibold text-foreground">${(c.arr / 1000).toFixed(0)}K ARR</span>
                          <span className="flex items-center gap-1">
                            {c.trend === "up" ? <TrendingUp className="h-3 w-3 text-green-400" /> : c.trend === "down" ? <TrendingDown className="h-3 w-3 text-red-400" /> : null}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1"><Clock className="h-3 w-3" />{c.lastActive}</span>
                        <span>{c.seats} seats</span>
                        <span>Since {c.since}</span>
                        <div className="flex items-center gap-1.5 ml-auto">
                          <span>Score:</span>
                          <div className="w-16 h-1.5 rounded-full bg-muted overflow-hidden">
                            <div className={`h-full rounded-full ${cfg.bg}`} style={{ width: `${c.score}%` }} />
                          </div>
                          <span className="font-semibold text-foreground">{c.score}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <AnimatePresence>
                    {selectedId === c.id && (
                      <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="mt-3 pt-3 border-t border-border text-xs text-muted-foreground">
                        {c.note}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.button>
              );
            })}
          </div>

          {/* AI Panel */}
          <AnimatePresence>
            {aiOpen && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="rounded-xl border bg-card p-5 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm font-semibold"><Sparkles className="h-4 w-4 text-primary" />AI Save Playbook</div>
                  <button onClick={() => setAiOpen(false)} className="text-xs text-muted-foreground hover:text-foreground">Dismiss</button>
                </div>
                {generating && aiContent === "" ? (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground py-6 justify-center">
                    <Loader2 className="h-4 w-4 animate-spin text-primary" /> Analyzing at-risk accounts...
                  </div>
                ) : (
                  <div className="prose prose-sm dark:prose-invert max-w-none text-sm leading-relaxed [&_h2]:text-sm [&_h2]:font-semibold [&_h2]:mt-3">
                    <ReactMarkdown>{aiContent}</ReactMarkdown>
                    {generating && <span className="inline-block h-4 w-0.5 bg-primary animate-pulse ml-0.5 align-middle" />}
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </AppLayout>
  );
}
