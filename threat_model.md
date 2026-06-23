# Threat Model

## Project Overview

Pulse is a founder-facing SaaS app with a React + Vite frontend, an Express 5 API server, PostgreSQL via Drizzle for chat persistence, Supabase Auth for user authentication, and direct browser-side Supabase access for some per-user product data. Production users authenticate in the browser, call authenticated API routes under `/api/anthropic/*`, and can also read and mutate selected Supabase-backed tables from the client.

Production scope assumptions for this repository:
- `artifacts/pulse/`, `artifacts/api-server/`, `lib/db/`, `lib/api-spec/`, `lib/api-client-react/`, `lib/api-zod/`, and `lib/integrations-anthropic-ai/` are production-relevant.
- `artifacts/mockup-sandbox/` is dev-only and should be ignored unless a production reachability path is demonstrated.
- Replit-managed TLS is assumed in production.
- This repl is not currently deployed, so assess issues based on what would matter if it were deployed publicly.

## Assets

- **User accounts and bearer tokens** — Supabase access tokens gate all protected API access. Token compromise enables impersonation.
- **Founder chat transcripts** — conversation history and prompts can contain sensitive business strategy, customer issues, revenue context, and generated executive summaries.
- **Business telemetry and alerts** — dashboard alerts and related founder-facing metrics may reveal customer health, revenue risk, and operational issues.
- **Application secrets** — `DATABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, and AI integration credentials provide privileged backend access.
- **AI spend / service availability** — authenticated access to Anthropic-backed generation is financially sensitive and can be abused for cost amplification or service degradation.

## Trust Boundaries

- **Browser to Express API** — all `/api/anthropic/*` requests cross from an untrusted client into trusted server code; every request requires authentication and per-resource authorization.
- **Browser to Supabase** — the frontend directly queries and mutates Supabase tables with the public anon key; access control depends on Supabase-side policies, not the client. For the `alerts` surface specifically, safe production use requires owner-based RLS tied to `auth.uid()`.
- **Express API to PostgreSQL** — the API has direct database access for conversation storage; broken authorization at this layer exposes all chat history.
- **Express API to Supabase Admin** — the backend uses a service-role client to validate user tokens; this credential must remain server-only.
- **Express API to Anthropic integration** — user-controlled prompts are forwarded to a paid external AI service; abusive request volume or oversized histories can translate into cost and availability impact.
- **Public to authenticated surface** — `/api/healthz` is public; `/api/anthropic/*` is authenticated; frontend route guards are UX controls only and do not replace server-side enforcement.

## Scan Anchors

- Production API entry point: `artifacts/api-server/src/app.ts`, `artifacts/api-server/src/routes/`.
- Highest-risk backend area: `artifacts/api-server/src/routes/anthropic/index.ts` plus `lib/db/src/schema/*`.
- Auth boundary: `artifacts/api-server/src/middlewares/auth.ts`, `artifacts/pulse/src/contexts/AuthContext.tsx`.
- Browser-side data access: `artifacts/pulse/src/pages/Dashboard.tsx`, `artifacts/pulse/src/pages/Alerts.tsx`, `artifacts/pulse/src/lib/seedDemoAlerts.ts`.
- Supabase note: this repo does not contain local RLS/policy definitions for `alerts`, so do not treat client-side filters as access control and do not report browser-side Supabase issues without code or policy evidence.
- Dev-only area to usually ignore: `artifacts/mockup-sandbox/`.

## Threat Categories

### Spoofing

Pulse relies on Supabase bearer tokens to identify users. All protected API routes must require a valid token and must not trust client-side route guards or client-supplied user identifiers. Any backend action that persists or fetches user data must bind that data to the authenticated subject derived from the verified token.

### Tampering

The browser can directly submit data to both the Express API and Supabase. Client input such as conversation titles, prompts, alert mutations, and any user-scoped filters must be treated as attacker-controlled. The system must validate request structure and ensure attackers cannot modify another user’s records by swapping IDs or omitting ownership constraints. For browser-side Supabase tables, owner checks must live in Supabase RLS/policies rather than in client `.eq("user_id", ...)` filters.

### Information Disclosure

Chat transcripts, generated summaries, and operational alerts are founder-sensitive business data. The application must ensure conversation and message queries are scoped to the authenticated owner, must avoid leaking service-role secrets to the client, and must keep logs free of tokens and other sensitive material.

### Denial of Service

Anthropic-backed generation is a cost- and latency-heavy endpoint. The application must prevent a single authenticated user from creating unbounded expensive requests, and server-side external calls should have bounded execution characteristics so one client cannot tie up resources indefinitely or amplify spend.

### Elevation of Privilege

The main privilege boundary is user-to-user isolation rather than admin roles. Any object referenced by numeric IDs, especially conversations and messages, must be authorized server-side against the authenticated user. Missing ownership checks, even on authenticated routes, would let one user read, append to, or delete another user’s data.
