# Supabase Realtime Health Check — 2026-09-12 17:05

**Project**: RESERVAS-APP (aagjotwckrfrmayojhom) — ACTIVE_HEALTHY
**Check window**: 30 min (now - 30m)

## Data Availability
- Logs table: 315 total entries
- Time range: 2026-09-11T17:30:00 → 2026-09-12T17:03:12
- Sources available: `postgres_logs` (270), `edge_logs` (44), `postgrest_logs` (1)
- **No `realtime` source exposed** in unified logs

## Realtime Health Assessment
- **Backend query failures**: All `edge_logs` queries with filters return "Backend error! Retry your query"
- Cannot compute p95 latency, disconnect rate, or error patterns for realtime
- Status: **UNKNOWN** — telemetry path degraded

## SRE Score
**2/5** — Critical observability gap; realtime health cannot be verified

## Action Required
1. Investigate `mcp__supabase__query_logs` backend stability (contact Supabase support if persistent)
2. Verify realtime is enabled for this project (Dashboard → Realtime → Enabled)
3. Consider adding explicit realtime metrics export if logs remain unreliable