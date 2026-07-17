import { Router } from "express";
import { and, desc, eq } from "drizzle-orm";
import { db, conversations as conversationsTable, messages as messagesTable } from "@workspace/db";
import { anthropic } from "@workspace/integrations-anthropic-ai";
import {
  CreateAnthropicConversationBody,
  GetAnthropicConversationParams,
  DeleteAnthropicConversationParams,
  ListAnthropicMessagesParams,
  SendAnthropicMessageParams,
  SendAnthropicMessageBody,
} from "@workspace/api-zod";
import type { AuthRequest } from "../../middlewares/auth.js";

const router = Router();

const PULSE_SYSTEM_PROMPT = `You are Omnia, an AI Chief of Staff for founders and CEOs. You have deep knowledge of business operations, growth strategies, and startup metrics.

You have access to the following mock business context:
- Company: TechScale Inc. (SaaS startup, Series A)
- MRR: $284,000 (+12.4% MoM)
- Total Customers: 1,847 (+8.2% MoM)
- Churn Rate: 3.2% (-0.5% MoM improvement)
- LTV:CAC Ratio: 16.8x (+15% MoM)
- Top acquisition channels: LinkedIn (38%), Organic Search (28%), Referrals (22%), Paid (12%)
- Top at-risk customers: Acme Corp ($12K ARR, 45 days inactive), TechFlow ($8K ARR, usage dropped 60%), BuildRight ($6K ARR, 3 failed payments)
- Revenue trend: Growing steadily with a slight dip last Tuesday due to a Stripe payment processor outage
- Key risks: Increasing competition in SMB segment, rising CAC in paid channels, engineering team capacity

You provide concise, actionable insights. You think like a strategic advisor — direct, data-driven, and focused on what matters most. Keep responses focused and practical. Use markdown formatting for clarity.`;

/** Fetch a conversation and verify it belongs to userId. Returns null if not found or not owned. */
async function getOwnedConversation(id: number, userId: string) {
  const [conversation] = await db
    .select()
    .from(conversationsTable)
    .where(and(eq(conversationsTable.id, id), eq(conversationsTable.userId, userId)));
  return conversation ?? null;
}

// ---------------------------------------------------------------------------
// Abuse controls for POST /conversations/:id/messages
//
// 1. Per-user rate limit  — sliding window, max RATE_LIMIT_MAX req/min
// 2. Per-user concurrency — max MAX_CONCURRENT_PER_USER simultaneous streams
// 3. Hard stream deadline — STREAM_TIMEOUT_MS combined with disconnect abort
// 4. Bounded DB history  — only the most recent MAX_HISTORY_MESSAGES rows
//    fetched from Postgres (LIMIT in SQL, not slice-in-memory)
// ---------------------------------------------------------------------------

const RATE_LIMIT_WINDOW_MS = 60_000;
const RATE_LIMIT_MAX = 10;
const MAX_CONCURRENT_PER_USER = 3;
const STREAM_TIMEOUT_MS = 120_000; // 2-minute hard deadline per generation
const MAX_HISTORY_MESSAGES = 20;

// --- Sliding-window rate limiter ---
const rateLimitStore = new Map<string, number[]>();

function isRateLimited(userId: string): boolean {
  const now = Date.now();
  const windowStart = now - RATE_LIMIT_WINDOW_MS;
  const timestamps = (rateLimitStore.get(userId) ?? []).filter(
    (ts) => ts > windowStart,
  );
  if (timestamps.length >= RATE_LIMIT_MAX) {
    return true;
  }
  timestamps.push(now);
  rateLimitStore.set(userId, timestamps);
  return false;
}

// --- Per-user concurrency tracker ---
const concurrencyStore = new Map<string, number>();

function acquireConcurrencySlot(userId: string): boolean {
  const current = concurrencyStore.get(userId) ?? 0;
  if (current >= MAX_CONCURRENT_PER_USER) return false;
  concurrencyStore.set(userId, current + 1);
  return true;
}

function releaseConcurrencySlot(userId: string): void {
  const current = concurrencyStore.get(userId) ?? 0;
  if (current <= 1) {
    concurrencyStore.delete(userId);
  } else {
    concurrencyStore.set(userId, current - 1);
  }
}

router.get("/conversations", async (req, res) => {
  const { userId } = req as AuthRequest;
  try {
    const conversations = await db
      .select()
      .from(conversationsTable)
      .where(eq(conversationsTable.userId, userId!))
      .orderBy(conversationsTable.createdAt);
    res.json(conversations.map(({ userId: _uid, ...rest }) => rest));
  } catch (err) {
    req.log.error({ err }, "Failed to list conversations");
    res.status(500).json({ error: "Failed to list conversations" });
  }
});

router.post("/conversations", async (req, res) => {
  const { userId } = req as AuthRequest;
  try {
    const parsed = CreateAnthropicConversationBody.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ error: "Invalid request body" });
      return;
    }
    const [conversation] = await db
      .insert(conversationsTable)
      .values({ title: parsed.data.title, userId: userId! })
      .returning();
    const { userId: _uid, ...conversationResponse } = conversation;
    res.status(201).json(conversationResponse);
  } catch (err) {
    req.log.error({ err }, "Failed to create conversation");
    res.status(500).json({ error: "Failed to create conversation" });
  }
});

router.get("/conversations/:id", async (req, res) => {
  const { userId } = req as AuthRequest;
  try {
    const parsed = GetAnthropicConversationParams.safeParse({ id: Number(req.params.id) });
    if (!parsed.success) {
      res.status(400).json({ error: "Invalid id" });
      return;
    }
    const conversation = await getOwnedConversation(parsed.data.id, userId!);
    if (!conversation) {
      res.status(404).json({ error: "Conversation not found" });
      return;
    }
    const messages = await db
      .select()
      .from(messagesTable)
      .where(eq(messagesTable.conversationId, parsed.data.id))
      .orderBy(messagesTable.createdAt);
    const { userId: _uid, ...conversationResponse } = conversation;
    res.json({ ...conversationResponse, messages });
  } catch (err) {
    req.log.error({ err }, "Failed to get conversation");
    res.status(500).json({ error: "Failed to get conversation" });
  }
});

router.delete("/conversations/:id", async (req, res) => {
  const { userId } = req as AuthRequest;
  try {
    const parsed = DeleteAnthropicConversationParams.safeParse({ id: Number(req.params.id) });
    if (!parsed.success) {
      res.status(400).json({ error: "Invalid id" });
      return;
    }
    const [deleted] = await db
      .delete(conversationsTable)
      .where(and(eq(conversationsTable.id, parsed.data.id), eq(conversationsTable.userId, userId!)))
      .returning();
    if (!deleted) {
      res.status(404).json({ error: "Conversation not found" });
      return;
    }
    res.status(204).end();
  } catch (err) {
    req.log.error({ err }, "Failed to delete conversation");
    res.status(500).json({ error: "Failed to delete conversation" });
  }
});

router.get("/conversations/:id/messages", async (req, res) => {
  const { userId } = req as AuthRequest;
  try {
    const parsed = ListAnthropicMessagesParams.safeParse({ id: Number(req.params.id) });
    if (!parsed.success) {
      res.status(400).json({ error: "Invalid id" });
      return;
    }
    const conversation = await getOwnedConversation(parsed.data.id, userId!);
    if (!conversation) {
      res.status(404).json({ error: "Conversation not found" });
      return;
    }
    const messages = await db
      .select()
      .from(messagesTable)
      .where(eq(messagesTable.conversationId, parsed.data.id))
      .orderBy(messagesTable.createdAt);
    res.json(messages);
  } catch (err) {
    req.log.error({ err }, "Failed to list messages");
    res.status(500).json({ error: "Failed to list messages" });
  }
});

router.post("/conversations/:id/messages", async (req: AuthRequest, res) => {
  const userId = req.userId ?? "anonymous";

  // --- Check 1: per-user rate limit ---
  if (isRateLimited(userId)) {
    res
      .status(429)
      .json({ error: "Too many requests. Please wait before sending another message." });
    return;
  }

  // --- Check 2: per-user concurrency cap ---
  if (!acquireConcurrencySlot(userId)) {
    res
      .status(429)
      .json({ error: "Too many concurrent requests. Please wait for an active response to finish." });
    return;
  }

  try {
    const paramsParsed = SendAnthropicMessageParams.safeParse({ id: Number(req.params.id) });
    if (!paramsParsed.success) {
      res.status(400).json({ error: "Invalid id" });
      return;
    }
    const bodyParsed = SendAnthropicMessageBody.safeParse(req.body);
    if (!bodyParsed.success) {
      res.status(400).json({ error: "Invalid request body" });
      return;
    }

    const conversationId = paramsParsed.data.id;
    const userContent = bodyParsed.data.content;

    // Ownership check: ensures the conversation belongs to the authenticated user
    const conversation = await getOwnedConversation(conversationId, userId);
    if (!conversation) {
      res.status(404).json({ error: "Conversation not found" });
      return;
    }

    await db.insert(messagesTable).values({
      conversationId,
      role: "user",
      content: userContent,
    });

    // --- Check 4: bounded DB fetch — only the most recent N rows ---
    const recentMessages = await db
      .select()
      .from(messagesTable)
      .where(eq(messagesTable.conversationId, conversationId))
      .orderBy(desc(messagesTable.createdAt))
      .limit(MAX_HISTORY_MESSAGES);
    recentMessages.reverse(); // restore chronological order for the API

    const chatMessages = recentMessages.map((m) => ({
      role: m.role as "user" | "assistant",
      content: m.content,
    }));

    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");

    // --- Check 2/3: combine disconnect abort + hard deadline into one signal ---
    const disconnectController = new AbortController();
    req.on("close", () => {
      disconnectController.abort();
    });

    const combinedSignal = AbortSignal.any([
      disconnectController.signal,
      AbortSignal.timeout(STREAM_TIMEOUT_MS),
    ]);

    let fullResponse = "";

    const stream = anthropic.messages.stream(
      {
        model: "claude-sonnet-4-6",
        max_tokens: 8192,
        system: PULSE_SYSTEM_PROMPT,
        messages: chatMessages,
      },
      { signal: combinedSignal },
    );

    try {
      for await (const event of stream) {
        if (
          event.type === "content_block_delta" &&
          event.delta.type === "text_delta"
        ) {
          fullResponse += event.delta.text;
          res.write(
            `data: ${JSON.stringify({ type: "content_block_delta", delta: { text: event.delta.text } })}\n\n`
          );
        }
      }
    } catch (streamErr) {
      if (combinedSignal.aborted) {
        const reason = disconnectController.signal.aborted ? "client disconnected" : "deadline exceeded";
        req.log.info({ conversationId, reason }, "Anthropic stream cancelled");
        res.end();
        return;
      }
      throw streamErr;
    }

    await db.insert(messagesTable).values({
      conversationId,
      role: "assistant",
      content: fullResponse,
    });

    res.write("data: [DONE]\n\n");
    res.end();
  } catch (err) {
    req.log.error({ err }, "Failed to send message");
    if (!res.headersSent) {
      res.status(500).json({ error: "Failed to send message" });
    } else {
      res.write(`data: ${JSON.stringify({ error: "Stream failed" })}\n\n`);
      res.end();
    }
  } finally {
    releaseConcurrencySlot(userId);
  }
});

export default router;
