export type TimelineEntrySource = 'manual' | 'voice' | 'screenshot' | 'system';

export interface SpeechMetadata {
  utteranceStartAt: string;
  utteranceEndAt: string;
  confidence: number;
  deviceId: string;
  sessionId: string;
  projectId?: string;
  taskId?: string;
}

export interface TimelineEntry {
  id: string;
  userId: string;
  source: TimelineEntrySource;
  text: string;
  tags: string[];
  createdAt: string;
  occurredAt: string;
  speech?: SpeechMetadata;
}

export interface VoiceCaptureSession {
  id: string;
  entryIds: string[];
  startedAt: string;
  endedAt: string | null;
  language: string;
  state: 'capturing' | 'processing' | 'completed' | 'failed';
}

export interface TranscriptChunk {
  sessionId: string;
  chunkId: string;
  text: string;
  startTime: string;
  endTime: string;
  isFinal: boolean;
  confidence?: number;
  deviceId: string;
  projectId?: string;
  taskId?: string;
}

export interface ScreenshotEvent {
  id: string;
  timelineEntryId: string;
  capturedAt: string;
  url: string;
  width: number;
  height: number;
  appContext: string | null;
  extractedText: string | null;
}

export interface Insight {
  id: string;
  entryIds: string[];
  createdAt: string;
  type: 'pattern' | 'anomaly' | 'recommendation' | 'summary';
  summary: string;
  confidence: number;
}

export interface DailyReviewSession {
  id: string;
  date: string;
  startedAt: string;
  completedAt: string | null;
  insightIds: string[];
  status: 'pending' | 'in_progress' | 'completed';
}
