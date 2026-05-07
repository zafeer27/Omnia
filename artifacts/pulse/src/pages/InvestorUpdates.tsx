import { useState } from "react";
import AppLayout from "@/components/AppLayout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, Sparkles, Copy, Check, Calendar, TrendingUp, ChevronRight, Loader2 } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { useCreateAnthropicConversation } from "@workspace/api-client-react";

type Update = { id: number; period: string; date: string; mrr: string; growth: string; status: "sent" | "draft" };

const PAST_UPDATES: Update[] = [
  { id: 1, period: "March 2026", date: "Apr 1, 2026", mrr: "$252K", growth: "+10.2%", status: "sent" },
  { id: 2, period: "February 2026", date: "Mar 3, 2026", mrr: "$229K", growth: "+9.1%", status: "sent" },
  { id: 3, period: "January 2026", date: "Feb 2, 2026", mrr: "$210K", growth: "+8.8%", status: "sent" },
  { id: 4, period: "Q1 2026 Summary", date: "Apr 5, 2026", mrr: "$252K", growth: "+32% QoQ", status: "sent" },
];

const AI_PROMPT = `You are Omnia, drafting a monthly investor update email for TechScale Inc (SaaS, Series A).

Business context this month:
- MRR: $284,000 (+12.4% MoM, +72% YoY)
- Customers: 1,847 (+8.2% MoM)
- Churn: 3.2% (improved from 3.7%)
- LTV:CAC: 16.8x (+15% MoM)
- New logos: 12 this month
- Expansion MRR: $18K from Acme Corp upgrade
- Top acquisition: LinkedIn (38%), Organic (28%)
- Key risk: 3 at-risk enterprise accounts ($26K ARR)
- Engineering: hired 1 senior engineer, 2 open roles
- Next milestone: $300K MRR by end of Q2

Write a professional, concise investor update email with these sections:
## Subject Line
## Headline Numbers
## Highlights (3 bullet points)  
## Challenges (1-2 honest points)
## Ask / What we need from you
## Key metric dashboard (table format)

Keep it under 400 words. Tone: confident, transparent, data-driven.`;

export default function InvestorUpdates() {
  const [generating, setGenerating] = useState(false);
  const [draft, setDraft] = useState("");
  const [draftOpen, setDraftOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [selected, setSelected] = useState<number | null>(null);
  const createConversation = useCreateAnthropicConversation();

  const handleGenerate = async () => {
    setDraft("");
    setDraftOpen(true);
    setGenerating(true);
    setSelected(null);
    try {
      const conv = await new Promise<{ id: number }>((resolve, reject) => {
        createConversation.mutate({ data: { title: "Investor Update" } }, { onSuccess: resolve, onError: reject });
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
            try { const d = JSON.parse(line.slice(6)); if (d.type === "content_block_delta" && d.delta?.text) { full += d.delta.text; setDraft(full); } } catch {}
          }
        }
      }
    } catch { setDraft("Error generating update. Please try again."); }
    finally { setGenerating(false); }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(draft);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <AppLayout>
      <div className="flex-1 overflow-auto p-6 md:p-8">
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-semibold tracking-tight">Investor Updates</h1>
              <p className="text-muted-foreground mt-1">Auto-draft monthly updates from your live metrics</p>
            </div>
            <Button onClick={handleGenerate} disabled={generating} className="gap-2">
              {generating ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
              Draft April Update
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4">
            {[
              { label: "Updates sent", value: "4", icon: Mail },
              { label: "Avg MoM growth", value: "+10.1%", icon: TrendingUp },
              { label: "Current MRR", value: "$284K", icon: TrendingUp },
            ].map((s) => (
              <div key={s.label} className="rounded-xl border bg-card p-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">{s.label}</span>
                  <s.icon className="h-4 w-4 text-muted-foreground" />
                </div>
                <div className="text-xl font-bold mt-1">{s.value}</div>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
            {/* Past updates list */}
            <div className="lg:col-span-2 space-y-3">
              <h3 className="text-sm font-semibold">Past Updates</h3>
              {PAST_UPDATES.map((u) => (
                <button key={u.id} onClick={() => { setSelected(u.id); setDraftOpen(false); }}
                  className={`w-full text-left p-4 rounded-xl border transition-all ${selected === u.id ? "border-primary/50 bg-primary/5" : "border-border bg-card hover:bg-muted/20"}`}>
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-sm">{u.period}</span>
                    <Badge variant="outline" className="text-xs bg-green-500/10 text-green-400 border-green-500/20">{u.status}</Badge>
                  </div>
                  <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1"><Calendar className="h-3 w-3" />{u.date}</span>
                    <span className="flex items-center gap-1"><TrendingUp className="h-3 w-3 text-green-400" />{u.growth}</span>
                  </div>
                  <div className="text-sm font-semibold mt-1">{u.mrr} MRR</div>
                </button>
              ))}
            </div>

            {/* Draft panel */}
            <div className="lg:col-span-3">
              <AnimatePresence mode="wait">
                {draftOpen ? (
                  <motion.div key="draft" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="rounded-xl border bg-card p-5 space-y-4 h-full">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-sm font-semibold">
                        <Sparkles className="h-4 w-4 text-primary" />
                        AI Draft — April 2026
                      </div>
                      {!generating && draft && (
                        <Button variant="ghost" size="sm" onClick={handleCopy} className="gap-1.5 text-xs">
                          {copied ? <Check className="h-3.5 w-3.5 text-green-400" /> : <Copy className="h-3.5 w-3.5" />}
                          {copied ? "Copied!" : "Copy"}
                        </Button>
                      )}
                    </div>
                    {generating && draft === "" ? (
                      <div className="flex flex-col items-center justify-center h-48 gap-3 text-muted-foreground">
                        <Loader2 className="h-5 w-5 animate-spin text-primary" />
                        <p className="text-sm">Analyzing your metrics...</p>
                      </div>
                    ) : (
                      <div className="prose prose-sm dark:prose-invert max-w-none text-sm leading-relaxed overflow-auto max-h-[480px] pr-1 [&_h2]:text-sm [&_h2]:font-semibold [&_h2]:mt-3 [&_table]:text-xs [&_td]:py-1 [&_th]:py-1">
                        <ReactMarkdown>{draft}</ReactMarkdown>
                        {generating && <span className="inline-block h-4 w-0.5 bg-primary animate-pulse ml-0.5 align-middle" />}
                      </div>
                    )}
                    {!generating && draft && (
                      <div className="flex gap-2 pt-2 border-t border-border">
                        <Button size="sm" className="gap-1.5"><Mail className="h-4 w-4" />Send to investors</Button>
                        <Button variant="outline" size="sm">Edit draft</Button>
                      </div>
                    )}
                  </motion.div>
                ) : selected ? (
                  <motion.div key="selected" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="rounded-xl border bg-card p-5 space-y-4">
                    <h3 className="text-sm font-semibold">{PAST_UPDATES.find((u) => u.id === selected)?.period}</h3>
                    <p className="text-sm text-muted-foreground">This update was sent successfully on {PAST_UPDATES.find((u) => u.id === selected)?.date}.</p>
                    <Button variant="outline" size="sm" className="gap-2"><ChevronRight className="h-4 w-4" />View full update</Button>
                  </motion.div>
                ) : (
                  <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="rounded-xl border border-dashed border-border bg-muted/20 flex flex-col items-center justify-center h-48 gap-3 text-muted-foreground">
                    <Mail className="h-8 w-8 opacity-30" />
                    <p className="text-sm">Click "Draft April Update" to generate your investor email</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
