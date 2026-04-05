import crypto from "node:crypto";
import { db } from "./db.js";
import type { DailySession, Insight, TimestampedEvent } from "../../shared/models.js";

const sessionInsert = db.prepare(`
INSERT INTO sessions (id, date, started_at, timezone, project_context_id, status)
VALUES (@id, @date, @startedAt, @timezone, @projectContextId, @status)
`);

const eventInsert = db.prepare(`
INSERT INTO timestamped_events (id, session_id, event_type, occurred_at, payload)
VALUES (@id, @sessionId, @eventType, @occurredAt, @payload)
`);

const insightInsert = db.prepare(`
INSERT INTO insights (id, session_id, created_at, kind, content, score, source_event_ids)
VALUES (@id, @sessionId, @createdAt, @kind, @content, @score, @sourceEventIds)
`);

export function createSession(input: Omit<DailySession, "id">): DailySession {
  const session: DailySession = { id: crypto.randomUUID(), ...input };
  sessionInsert.run(session);
  return session;
}

export function listSessions(): DailySession[] {
  const rows = db.prepare("SELECT * FROM sessions ORDER BY started_at DESC").all() as Array<Record<string, string>>;
  return rows.map((row) => ({
    id: row.id,
    date: row.date,
    startedAt: row.started_at,
    endedAt: row.ended_at ?? undefined,
    timezone: row.timezone,
    projectContextId: row.project_context_id ?? undefined,
    status: row.status as DailySession["status"]
  }));
}

export function appendEvent(input: Omit<TimestampedEvent, "id">): TimestampedEvent {
  const event: TimestampedEvent = { id: crypto.randomUUID(), ...input };
  eventInsert.run({ ...event, payload: JSON.stringify(event.payload) });
  return event;
}

export function appendInsight(input: Omit<Insight, "id">): Insight {
  const insight: Insight = { id: crypto.randomUUID(), ...input };
  insightInsert.run({ ...insight, sourceEventIds: JSON.stringify(insight.sourceEventIds) });
  return insight;
}

export function listInsights(sessionId: string): Insight[] {
  const rows = db.prepare("SELECT * FROM insights WHERE session_id = ? ORDER BY created_at DESC").all(sessionId) as Array<Record<string, string>>;
  return rows.map((row) => ({
    id: row.id,
    sessionId: row.session_id,
    createdAt: row.created_at,
    kind: row.kind as Insight["kind"],
    content: row.content,
    score: typeof row.score === "number" ? row.score : undefined,
    sourceEventIds: JSON.parse(row.source_event_ids)
  }));
}
