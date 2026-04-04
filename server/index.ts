import path from "node:path";
import express from "express";
import cors from "cors";
import { env } from "./config.js";
import { sessionsRouter } from "./routes/sessions.js";
import { eventsRouter } from "./routes/events.js";
import "./storage/db.js";

const app = express();
app.use(cors());
app.use(express.json());

app.get("/api/health", (_req, res) => {
  res.json({ ok: true, env: env.NODE_ENV });
});

app.use("/api/sessions", sessionsRouter);
app.use("/api", eventsRouter);

app.use(express.static(path.resolve("app")));
app.get("*", (_req, res) => {
  res.sendFile(path.resolve("app/index.html"));
});

app.listen(env.PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`Daily Timeline running at http://localhost:${env.PORT}`);
});
