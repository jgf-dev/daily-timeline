import { Router } from "express";
import { appendEvent, appendInsight, listInsights } from "../storage/repositories.js";

export const eventsRouter = Router();

eventsRouter.post("/events", (req, res) => {
  const event = appendEvent({
    sessionId: req.body.sessionId,
    eventType: req.body.eventType,
    occurredAt: req.body.occurredAt ?? new Date().toISOString(),
    payload: req.body.payload ?? {}
  });
  res.status(201).json(event);
});

eventsRouter.post("/insights", (req, res) => {
  const insight = appendInsight({
    sessionId: req.body.sessionId,
    createdAt: req.body.createdAt ?? new Date().toISOString(),
    kind: req.body.kind ?? "summary",
    content: req.body.content,
    score: req.body.score,
    sourceEventIds: req.body.sourceEventIds ?? []
  });
  res.status(201).json(insight);
});

eventsRouter.get("/insights/:sessionId", (req, res) => {
  res.json(listInsights(req.params.sessionId));
});
