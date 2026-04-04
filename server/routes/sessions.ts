import { Router } from "express";
import { createSession, listSessions } from "../storage/repositories.js";

export const sessionsRouter = Router();

sessionsRouter.get("/", (_req, res) => {
  res.json(listSessions());
});

sessionsRouter.post("/", (req, res) => {
  const session = createSession({
    date: req.body.date ?? new Date().toISOString().slice(0, 10),
    startedAt: req.body.startedAt ?? new Date().toISOString(),
    timezone: req.body.timezone ?? "UTC",
    projectContextId: req.body.projectContextId,
    status: req.body.status ?? "active",
    endedAt: req.body.endedAt
  });
  res.status(201).json(session);
});
