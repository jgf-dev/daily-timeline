import fs from "node:fs";
import path from "node:path";
import Database from "better-sqlite3";
import { env } from "../config.js";

const dbPath = path.resolve(env.DATABASE_PATH);
fs.mkdirSync(path.dirname(dbPath), { recursive: true });

export const db = new Database(dbPath);

db.pragma("journal_mode = WAL");
db.pragma("foreign_keys = ON");

db.exec(`
CREATE TABLE IF NOT EXISTS sessions (
  id TEXT PRIMARY KEY,
  date TEXT NOT NULL,
  started_at TEXT NOT NULL,
  ended_at TEXT,
  timezone TEXT NOT NULL,
  project_context_id TEXT,
  status TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS diary_entries (
  id TEXT PRIMARY KEY,
  session_id TEXT NOT NULL,
  created_at TEXT NOT NULL,
  text TEXT NOT NULL,
  mood TEXT,
  tags TEXT NOT NULL,
  FOREIGN KEY(session_id) REFERENCES sessions(id)
);

CREATE TABLE IF NOT EXISTS transcript_segments (
  id TEXT PRIMARY KEY,
  session_id TEXT NOT NULL,
  started_at TEXT NOT NULL,
  ended_at TEXT NOT NULL,
  speaker TEXT NOT NULL,
  text TEXT NOT NULL,
  confidence REAL,
  FOREIGN KEY(session_id) REFERENCES sessions(id)
);

CREATE TABLE IF NOT EXISTS screenshot_events (
  id TEXT PRIMARY KEY,
  session_id TEXT NOT NULL,
  captured_at TEXT NOT NULL,
  image_path TEXT NOT NULL,
  app_name TEXT,
  window_title TEXT,
  ocr_text TEXT,
  FOREIGN KEY(session_id) REFERENCES sessions(id)
);

CREATE TABLE IF NOT EXISTS timestamped_events (
  id TEXT PRIMARY KEY,
  session_id TEXT NOT NULL,
  event_type TEXT NOT NULL,
  occurred_at TEXT NOT NULL,
  payload TEXT NOT NULL,
  FOREIGN KEY(session_id) REFERENCES sessions(id)
);

CREATE TABLE IF NOT EXISTS insights (
  id TEXT PRIMARY KEY,
  session_id TEXT NOT NULL,
  created_at TEXT NOT NULL,
  kind TEXT NOT NULL,
  content TEXT NOT NULL,
  score REAL,
  source_event_ids TEXT NOT NULL,
  FOREIGN KEY(session_id) REFERENCES sessions(id)
);

CREATE TABLE IF NOT EXISTS user_corrections (
  id TEXT PRIMARY KEY,
  session_id TEXT NOT NULL,
  target_type TEXT NOT NULL,
  target_id TEXT NOT NULL,
  created_at TEXT NOT NULL,
  corrected_value TEXT NOT NULL,
  reason TEXT,
  FOREIGN KEY(session_id) REFERENCES sessions(id)
);
`);
