import { useState, useEffect, useRef } from "react";
import AppLayout from "@/components/AppLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Activity, Send, Bot, User, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import ReactMarkdown from "react-markdown";
import { useCreateAnthropicConversation } from "@workspace/api-client-react";

type Message = {
  id: string;
  role: "user" | "assistant";
  content: string;
};

const SUGGESTED_PROMPTS = [
  "Why did revenue drop last week?",
  "Which customers are at churn risk?",
  "What should I focus on this week?",
  "Where should I spend more on marketing?",
];

export default function Chat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [conversationId, setConversationId] = useState<number | null>(null);
  const [isStreaming, setIsStreaming] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const createConversation = useCreateAnthropicConversation();

  useEffect(() => {
    // Create a new conversation on mount
    createConversation.mutate(
      { data: { title: "New Conversation" } },
      {
        onSuccess: (data) => {
          setConversationId(data.id);
        },
      }
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    // Scroll to bottom when messages change
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isStreaming]);

  const handleSend = async (text: string) => {
    if (!text.trim() || !conversationId || isStreaming) return;

    const userMessage: Message = { id: Date.now().toString(), role: "user", content: text };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsStreaming(true);

    const assistantMessageId = (Date.now() + 1).toString();
    setMessages((prev) => [...prev, { id: assistantMessageId, role: "assistant", content: "" }]);

    try {
      const response = await fetch(`${import.meta.env.BASE_URL}api/anthropic/conversations/${conversationId}/messages`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: text }),
      });

      if (!response.body) throw new Error("No response body");

      const reader = response.body.getReader();
      const decoder = new TextDecoder();

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        const lines = chunk.split('\n');

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const dataStr = line.slice(6);
            if (dataStr === '[DONE]') continue;
            try {
              const data = JSON.parse(dataStr);
              if (data.type === 'content_block_delta' && data.delta?.text) {
                setMessages((prev) => prev.map((msg) => 
                  msg.id === assistantMessageId 
                    ? { ...msg, content: msg.content + data.delta.text } 
                    : msg
                ));
              }
            } catch (e) {
              console.error("Error parsing SSE data", e);
            }
          }
        }
      }
    } catch (error) {
      console.error("Failed to send message", error);
      setMessages((prev) => prev.map((msg) => 
        msg.id === assistantMessageId 
          ? { ...msg, content: "Sorry, I encountered an error processing your request." } 
          : msg
      ));
    } finally {
      setIsStreaming(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend(input);
    }
  };

  return (
    <AppLayout>
      <div className="flex flex-col h-full bg-background">
        {/* Chat Header */}
        <div className="border-b border-border p-4 px-6 flex items-center justify-between bg-card/50 backdrop-blur-sm z-10 shrink-0">
          <div>
            <h2 className="font-semibold tracking-tight">Ask Omnia anything</h2>
            <p className="text-xs text-muted-foreground">Your AI Chief of Staff</p>
          </div>
          <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-sm">
            <Activity className="text-white h-4 w-4" />
          </div>
        </div>

        {/* Chat Messages */}
        <div className="flex-1 overflow-y-auto p-4 px-4 md:px-8 space-y-6">
          <div className="max-w-4xl mx-auto w-full space-y-6">
            {messages.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-[50vh] text-center space-y-8">
                {/* Icon with glow */}
                <div className="relative">
                  <div className="absolute inset-0 rounded-2xl blur-xl opacity-40"
                    style={{ background: "linear-gradient(135deg, #6366f1, #a855f7)", transform: "scale(1.4)" }} />
                  <div className="relative h-16 w-16 rounded-2xl flex items-center justify-center border border-primary/20"
                    style={{ background: "linear-gradient(135deg, hsl(var(--primary)/0.15), hsl(var(--primary)/0.05))" }}>
                    <Activity className="h-8 w-8 text-primary" />
                  </div>
                </div>

                <div className="space-y-2">
                  <h3 className="text-xl font-semibold">How can I help you today?</h3>
                  <p className="text-sm max-w-md mx-auto" style={{ color: "hsl(var(--muted-foreground))" }}>
                    Analyze data, draft communications, or make strategic decisions — just ask.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5 w-full max-w-2xl">
                  {SUGGESTED_PROMPTS.map((prompt, i) => (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.08 }}
                      key={prompt}
                    >
                      <button
                        className="w-full text-left px-4 py-3 rounded-xl border text-sm font-medium transition-all group"
                        style={{
                          background: "hsl(var(--card))",
                          borderColor: "hsl(var(--border))",
                          color: "hsl(var(--foreground))",
                        }}
                        onMouseEnter={(e) => {
                          (e.currentTarget as HTMLButtonElement).style.borderColor = "hsl(var(--primary)/0.4)";
                          (e.currentTarget as HTMLButtonElement).style.background = "hsl(var(--primary)/0.05)";
                        }}
                        onMouseLeave={(e) => {
                          (e.currentTarget as HTMLButtonElement).style.borderColor = "hsl(var(--border))";
                          (e.currentTarget as HTMLButtonElement).style.background = "hsl(var(--card))";
                        }}
                        onClick={() => handleSend(prompt)}
                      >
                        <span className="text-primary mr-2 text-xs">→</span>
                        {prompt}
                      </button>
                    </motion.div>
                  ))}
                </div>
              </div>
            ) : (
              <AnimatePresence initial={false}>
                {messages.map((message) => (
                  <motion.div
                    key={message.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`flex gap-4 ${message.role === "user" ? "flex-row-reverse" : "flex-row"}`}
                  >
                    <div className={`shrink-0 h-8 w-8 rounded-full flex items-center justify-center ${
                      message.role === "user" 
                        ? "bg-secondary text-secondary-foreground" 
                        : "bg-primary/10 text-primary border border-primary/20"
                    }`}>
                      {message.role === "user" ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
                    </div>
                    
                    <div className={`max-w-[80%] rounded-2xl px-5 py-3.5 ${
                      message.role === "user"
                        ? "bg-primary text-primary-foreground rounded-tr-sm"
                        : "bg-card border border-border shadow-sm rounded-tl-sm text-foreground"
                    }`}>
                      {message.role === "assistant" && message.content === "" ? (
                        <div className="flex items-center gap-1.5 h-6">
                          <span className="w-1.5 h-1.5 bg-primary/60 rounded-full animate-bounce" style={{ animationDelay: "0ms" }}></span>
                          <span className="w-1.5 h-1.5 bg-primary/60 rounded-full animate-bounce" style={{ animationDelay: "150ms" }}></span>
                          <span className="w-1.5 h-1.5 bg-primary/60 rounded-full animate-bounce" style={{ animationDelay: "300ms" }}></span>
                        </div>
                      ) : (
                        <div className={`prose prose-sm max-w-none ${message.role === "user" ? "prose-invert" : "dark:prose-invert"} prose-p:leading-relaxed prose-pre:bg-muted/50 prose-pre:border prose-pre:border-border`}>
                          <ReactMarkdown>{message.content}</ReactMarkdown>
                        </div>
                      )}
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            )}
            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Input Area */}
        <div className="p-4 px-4 md:px-8 border-t border-border bg-background shrink-0">
          <div className="max-w-4xl mx-auto relative flex items-end">
            <Input
              data-testid="input-chat"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={isStreaming ? "Omnia is thinking..." : "Ask anything about your business..."}
              className="pr-12 py-6 rounded-xl bg-card border-border shadow-sm focus-visible:ring-primary/50 text-base"
              disabled={isStreaming || !conversationId}
            />
            <Button
              data-testid="button-send-chat"
              size="icon"
              className="absolute right-2 bottom-2 h-8 w-8 rounded-lg"
              disabled={!input.trim() || isStreaming || !conversationId}
              onClick={() => handleSend(input)}
            >
              {isStreaming ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
            </Button>
          </div>
          <div className="text-center mt-2">
            <span className="text-[10px] text-muted-foreground uppercase tracking-wider font-medium">Omnia AI can make mistakes. Verify important information.</span>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
