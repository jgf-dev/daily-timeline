import type { TimelineEntry, TranscriptChunk } from '@daily-timeline/types';

const SILENCE_PATTERN = /^[\s.?!,;-]*$/;
const DEDUP_WINDOW_MS = 12_000;

export interface TranscriptionIngestResult {
  accepted: boolean;
  reason?: 'partial transcript' | 'continuous transcription silence' | 'final transcript duplicate';
  entry?: TimelineEntry;
}

interface TranscriptionServiceOptions {
  userId: string;
}

interface FinalTranscriptRecord {
  normalizedText: string;
  endTimeMs: number;
}

export class TranscriptionService {
  private readonly userId: string;

  private readonly recentFinalBySession = new Map<string, FinalTranscriptRecord[]>();

  constructor(options: TranscriptionServiceOptions) {
    this.userId = options.userId;
  }

  ingestChunk(chunk: TranscriptChunk): TranscriptionIngestResult {
    const normalizedText = normalizeTranscriptText(chunk.text);

    if (!chunk.isFinal) {
      return { accepted: false, reason: 'partial transcript' };
    }

    if (!normalizedText || SILENCE_PATTERN.test(normalizedText)) {
      return { accepted: false, reason: 'continuous transcription silence' };
    }

    const isDuplicate = this.isDuplicateFinalTranscript(chunk.sessionId, normalizedText, chunk.endTime);
    if (isDuplicate) {
      return { accepted: false, reason: 'final transcript duplicate' };
    }

    const entry = this.toTimelineEntry(chunk, normalizedText);
    this.trackFinalTranscript(chunk.sessionId, normalizedText, chunk.endTime);

    return {
      accepted: true,
      entry
    };
  }

  private toTimelineEntry(chunk: TranscriptChunk, normalizedText: string): TimelineEntry {
    return {
      id: `entry-${chunk.chunkId}`,
      userId: this.userId,
      source: 'voice',
      text: normalizedText,
      tags: ['voice capture session', 'final transcript'],
      createdAt: new Date().toISOString(),
      occurredAt: chunk.startTime,
      speech: {
        utteranceStartAt: chunk.startTime,
        utteranceEndAt: chunk.endTime,
        confidence: chunk.confidence ?? 0,
        deviceId: chunk.deviceId,
        sessionId: chunk.sessionId,
        projectId: chunk.projectId,
        taskId: chunk.taskId
      }
    };
  }

  private isDuplicateFinalTranscript(sessionId: string, normalizedText: string, endTime: string): boolean {
    const endTimeMs = Date.parse(endTime);
    const records = this.recentFinalBySession.get(sessionId) ?? [];

    return records.some(
      (record) => record.normalizedText === normalizedText && Math.abs(record.endTimeMs - endTimeMs) <= DEDUP_WINDOW_MS
    );
  }

  private trackFinalTranscript(sessionId: string, normalizedText: string, endTime: string): void {
    const endTimeMs = Date.parse(endTime);
    const existing = this.recentFinalBySession.get(sessionId) ?? [];
    const recent = existing.filter((record) => Math.abs(record.endTimeMs - endTimeMs) <= DEDUP_WINDOW_MS);
    recent.push({ normalizedText, endTimeMs });
    this.recentFinalBySession.set(sessionId, recent);
  }
}

export function normalizeTranscriptText(text: string): string {
  return text.replace(/\s+/g, ' ').trim();
}
