export type ISODateString = string;

export interface DiaryEntry {
  id: string;
  sessionId: string;
  createdAt: ISODateString;
  text: string;
  mood?: string;
  tags: string[];
}

export interface TranscriptSegment {
  id: string;
  sessionId: string;
  startedAt: ISODateString;
  endedAt: ISODateString;
  speaker: "user" | "assistant";
  text: string;
  confidence?: number;
}

export interface ScreenshotEvent {
  id: string;
  sessionId: string;
  capturedAt: ISODateString;
  imagePath: string;
  appName?: string;
  windowTitle?: string;
  ocrText?: string;
}

export interface Insight {
  id: string;
  sessionId: string;
  createdAt: ISODateString;
  kind: "summary" | "pattern" | "task" | "risk";
  content: string;
  score?: number;
  sourceEventIds: string[];
}

export interface ProjectContext {
  id: string;
  projectName: string;
  goals: string[];
  constraints: string[];
  preferredTone?: string;
  updatedAt: ISODateString;
}

export interface DailySession {
  id: string;
  date: ISODateString;
  startedAt: ISODateString;
  endedAt?: ISODateString;
  timezone: string;
  projectContextId?: string;
  status: "active" | "review" | "closed";
}

export interface TimestampedEvent {
  id: string;
  sessionId: string;
  eventType: "activity" | "voice" | "note" | "system";
  occurredAt: ISODateString;
  payload: Record<string, unknown>;
}

export interface UserCorrection {
  id: string;
  sessionId: string;
  targetType: "transcript" | "insight" | "ocr";
  targetId: string;
  createdAt: ISODateString;
  correctedValue: string;
  reason?: string;
}
