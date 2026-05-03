import { useState } from "react";
import AppLayout from "@/components/AppLayout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { motion, AnimatePresence } from "framer-motion";
import { ListTodo, Sparkles, RefreshCw, CheckCircle, Circle, Clock, Zap, AlertTriangle, Loader2 } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { useCreateAnthropicConversation } from "@workspace/api-client-react";

type Priority = "critical" | "high" | "medium" | "low";
type Task = { id: number; title: string; description: string; priority: Priority; category: string; time: string; done: boolean };

const INITIAL_TASKS: Task[] = [
  { id: 1, title: "Reach out to Acme Corp", description: "45-day inactive account at $12K ARR. Send a personal check-in before they churn.", priority: "critical", category: "Retention", time: "30 min", done: false },
  { id: 2, title: "Review BuildRight failed payments", description: "3 consecutive failed payment attempts. Escalate to finance and contact account owner.", priority: "critical", category: "Revenue", time: "20 min", done: false },
  { id: 3, title: "Analyze paid CAC increase", description: "Paid channel CAC rose 18% this month. Review campaign performance and adjust bids.", priority: "high", category: "Growth", time: "45 min", done: false },
  { id: 4, title: "Approve Q2 hiring plan", description: "Engineering team at capacity. Review 4 open JDs before EOD for board sign-off.", priority: "high", category: "Team", time: "1 hr", done: false },
  { id: 5, title: "Send investor weekly update", description: "Monday investor digest is due. MRR milestone worth highlighting this week.", priority: "medium", category: "Investors", time: "20 min", done: false },
  { id: 6, title: "Review TechFlow usage drop", description: "Usage dropped 60% over 14 days. Schedule a product review call.", priority: "medium", category: "Retention", time: "30 min", done: false },
  { id: 7, title: "Update revenue forecast model", description: "Incorporate April actuals into Q2 projection deck ahead of board meeting.", priority: "low", category: "Finance", time: "1 hr", done: false },
];

const PRIORITY_CONFIG: Record<Priority, { label: string; color: string; icon: React.ElementType }> = {
  critical: { label: "Critical", color: "bg-red-500/10 text-red-400 border-red-500/20", icon: Zap },
  high: { label: "High", color: "bg-orange-500/10 text-orange-400 border-orange-500/20", icon: AlertTriangle },
  medium: { label: "Medium", color: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20", icon: Clock },
  low: { label: "Low", color: "bg-slate-500/10 text-slate-400 border-slate-500/20", icon: Circle },
};

const AI_PROMPT = `You are Pulse, an AI Chief of Staff. Based on these business metrics for TechScale Inc:
- MRR: $284K (+12.4% MoM), Churn: 3.2%, 3 at-risk accounts totaling $26K ARR
- CAC rising in paid channels, engineering at capacity, board meeting next week

Generate a focused action list of 5-6 prioritized tasks the founder should tackle today. Format each as:
**[PRIORITY] Task Title** (Category · Time estimate)
Brief 1-2 sentence description of why this matters and what to do.

Be direct, specific, and actionable. Focus on highest-leverage items.`;

export default function Actions() {
  const [tasks, setTasks] = useState<Task[]>(INITIAL_TASKS);
  const [tab, setTab] = useState<"today" | "week">("today");
  const [aiOpen, setAiOpen] = useState(false);
  const [aiContent, setAiContent] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const createConversation = useCreateAnthropicConversation();

  const toggle = (id: number) => setTasks((prev) => prev.map((t) => t.id === id ? { ...t, done: !t.done } : t));
  const done = tasks.filter((t) => t.done).length;

  const handleGenerate = async () => {
    setAiContent("");
    setAiOpen(true);
    setIsGenerating(true);
    try {
      const conv = await new Promise<{ id: number }>((resolve, reject) => {
        createConversation.mutate({ data: { title: "Action Items" } }, { onSuccess: resolve, onError: reject });
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
    } catch { setAiContent("Error generating priorities. Please try again."); }
    finally { setIsGenerating(false); }
  };

  const displayTasks = tab === "today" ? tasks.slice(0, 5) : tasks;

  return (
    <AppLayout>
      <div className="flex-1 overflow-auto p-6 md:p-8">
        <div className="max-w-3xl mx-auto space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-semibold tracking-tight">Action Items</h1>
              <p className="text-muted-foreground mt-1">{done}/{tasks.length} completed today</p>
            </div>
            <Button onClick={handleGenerate} disabled={isGenerating} className="gap-2">
              {isGenerating ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
              AI Reprioritize
            </Button>
          </div>

          {/* Progress */}
          <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden">
            <motion.div className="h-full bg-primary rounded-full" initial={{ width: 0 }} animate={{ width: `${(done / tasks.length) * 100}%` }} transition={{ duration: 0.5 }} />
          </div>

          {/* Tabs */}
          <div className="flex gap-1 p-1 rounded-lg w-fit border border-border bg-card">
            {(["today", "week"] as const).map((t) => (
              <button key={t} onClick={() => setTab(t)}
                className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${
                  tab === t
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted"
                }`}>
                {t === "today" ? "Today" : "This Week"}
              </button>
            ))}
          </div>

          {/* Task List */}
          <div className="space-y-2">
            <AnimatePresence>
              {displayTasks.map((task, i) => {
                const cfg = PRIORITY_CONFIG[task.priority];
                const Icon = cfg.icon;
                return (
                  <motion.div key={task.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}
                    className={`flex gap-4 p-4 rounded-xl border bg-card transition-all hover:border-border/80 ${task.done ? "opacity-50" : ""}`}
                    style={{ borderLeft: `3px solid ${
                      task.priority === "critical" ? "rgb(248,113,113)" :
                      task.priority === "high" ? "rgb(251,146,60)" :
                      task.priority === "medium" ? "rgb(250,204,21)" :
                      "hsl(var(--border))"
                    }` }}>
                    <button onClick={() => toggle(task.id)} className="mt-0.5 shrink-0">
                      {task.done ? <CheckCircle className="h-5 w-5 text-primary" /> : <Circle className="h-5 w-5 text-muted-foreground hover:text-primary transition-colors" />}
                    </button>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-3">
                        <p className={`font-medium text-sm ${task.done ? "line-through text-muted-foreground" : ""}`}>{task.title}</p>
                        <div className="flex items-center gap-2 shrink-0">
                          <Badge variant="outline" className={`text-xs gap-1 ${cfg.color}`}>
                            <Icon className="h-3 w-3" />{cfg.label}
                          </Badge>
                          <span className="text-xs text-muted-foreground hidden sm:block">{task.time}</span>
                        </div>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1 leading-relaxed">{task.description}</p>
                      <div className="flex items-center gap-2 mt-2">
                        <span className="text-xs px-2 py-0.5 rounded-full bg-muted font-medium">{task.category}</span>
                        <span className="text-xs text-muted-foreground flex items-center gap-1"><Clock className="h-3 w-3" />{task.time}</span>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>

          {/* AI Panel */}
          <AnimatePresence>
            {aiOpen && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }}
                className="rounded-xl border bg-card p-5 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm font-semibold">
                    <Sparkles className="h-4 w-4 text-primary" />
                    AI-generated priorities
                  </div>
                  <button onClick={() => setAiOpen(false)} className="text-xs text-muted-foreground hover:text-foreground">Dismiss</button>
                </div>
                {isGenerating && aiContent === "" ? (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground py-4 justify-center">
                    <Loader2 className="h-4 w-4 animate-spin text-primary" /> Analyzing your metrics...
                  </div>
                ) : (
                  <div className="prose prose-sm dark:prose-invert max-w-none text-sm leading-relaxed">
                    <ReactMarkdown>{aiContent}</ReactMarkdown>
                    {isGenerating && <span className="inline-block h-4 w-0.5 bg-primary animate-pulse ml-0.5 align-middle" />}
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
