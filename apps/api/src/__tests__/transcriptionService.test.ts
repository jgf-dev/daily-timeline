import { describe, expect, it } from 'vitest';
import { TranscriptionService, normalizeTranscriptText } from '../services/transcription/transcriptionService';

describe('TranscriptionService', () => {
  it('normalizes whitespace in transcript text', () => {
    expect(normalizeTranscriptText('  hello   world  ')).toBe('hello world');
  });

  it('drops silence-only final transcript chunks', () => {
    const service = new TranscriptionService({ userId: 'user-1' });
    const result = service.ingestChunk({
      sessionId: 's-1',
      chunkId: 'c-1',
      text: '   ...   ',
      startTime: '2026-04-04T10:00:00.000Z',
      endTime: '2026-04-04T10:00:01.000Z',
      isFinal: true,
      deviceId: 'dev-1'
    });

    expect(result).toMatchObject({ accepted: false, reason: 'continuous transcription silence' });
  });

  it('deduplicates matching final transcript chunks in the same session', () => {
    const service = new TranscriptionService({ userId: 'user-1' });

    const first = service.ingestChunk({
      sessionId: 's-1',
      chunkId: 'c-1',
      text: 'Need to schedule sprint planning',
      startTime: '2026-04-04T10:00:00.000Z',
      endTime: '2026-04-04T10:00:04.000Z',
      isFinal: true,
      deviceId: 'dev-1'
    });

    const duplicate = service.ingestChunk({
      sessionId: 's-1',
      chunkId: 'c-2',
      text: 'Need to schedule sprint planning',
      startTime: '2026-04-04T10:00:02.000Z',
      endTime: '2026-04-04T10:00:06.000Z',
      isFinal: true,
      deviceId: 'dev-1'
    });

    expect(first.accepted).toBe(true);
    expect(duplicate).toMatchObject({ accepted: false, reason: 'final transcript duplicate' });
  });
});
