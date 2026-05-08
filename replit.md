# Workspace

## Overview

pnpm workspace monorepo using TypeScript. Contains the **Pulse** app — an AI Chief of Staff for founders — built with React + Vite frontend, Express backend, and Claude AI via Replit AI Integrations.

## Stack

- **Monorepo tool**: pnpm workspaces
- **Node.js version**: 24
- **Package manager**: pnpm
- **TypeScript version**: 5.9
- **Frontend**: React + Vite + Tailwind CSS + shadcn/ui + Framer Motion + Recharts
- **API framework**: Express 5
- **Database**: PostgreSQL + Drizzle ORM
- **Validation**: Zod (`zod/v4`), `drizzle-zod`
- **API codegen**: Orval (from OpenAPI spec)
- **Build**: esbuild (CJS bundle)
- **AI**: Anthropic Claude (via Replit AI Integrations — no API key required)

## Pulse App

4-page SaaS app at `/`:
- **Landing** (`/`) — dark gradient hero, feature cards, brand logo cloud
- **Onboarding** (`/onboarding`) — connect 15 integrations with simulated connection flow
- **Dashboard** (`/dashboard`) — KPI cards, revenue chart, acquisition chart, top risks panel
- **Chat** (`/chat`) — real-time streaming chat with Claude claude-sonnet-4-6 as an AI Chief of Staff

## Key Commands

- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- `pnpm --filter @workspace/api-server run dev` — run API server locally

## Architecture

- `artifacts/pulse/` — React + Vite frontend (wouter routing, Tailwind dark mode)
- `artifacts/api-server/` — Express API server with Anthropic chat routes
- `lib/api-spec/openapi.yaml` — OpenAPI spec (source of truth)
- `lib/api-client-react/` — Generated React Query hooks
- `lib/api-zod/` — Generated Zod validation schemas
- `lib/db/` — Drizzle ORM schema (conversations + messages tables)
- `lib/integrations-anthropic-ai/` — Anthropic SDK client wrapper

## Supabase Integration

- **Auth**: Supabase Auth (email/password, Google OAuth, password reset)
- **Client**: `artifacts/pulse/src/lib/supabase.ts` — browser client (anon key)
- **Admin**: `artifacts/api-server/src/lib/supabase.ts` — server admin client (service role key)
- **Auth context**: `artifacts/pulse/src/contexts/AuthContext.tsx` — session state + auto token injection
- **Route guard**: `artifacts/pulse/src/components/ProtectedRoute.tsx` — redirects unauthenticated users to `/`
- **API middleware**: `artifacts/api-server/src/middlewares/auth.ts` — verifies Supabase JWT on all `/api/anthropic` routes

## Environment Variables (auto-set)

- `DATABASE_URL` — PostgreSQL connection string
- `AI_INTEGRATIONS_ANTHROPIC_BASE_URL` — Replit AI proxy URL
- `AI_INTEGRATIONS_ANTHROPIC_API_KEY` — Replit AI proxy key (dummy string)
- `SUPABASE_URL` / `VITE_SUPABASE_URL` — Supabase project URL
- `SUPABASE_ANON_KEY` — Public anon key (injected into Vite frontend via `define`)
- `SUPABASE_SERVICE_ROLE_KEY` — Server-side admin key (API server only)

See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details.
