import type { FastifyInstance } from 'fastify';
import type { Insight, ScreenshotEvent, TimelineEntry, TranscriptChunk, VoiceCaptureSession } from '@daily-timeline/types';
import { z } from 'zod';
import { TranscriptionService } from './services/transcription/transcriptionService';

const transcriptChunkSchema = z.object({
  sessionId: z.string().min(1),
  chunkId: z.string().min(1),
  text: z.string(),
  startTime: z.string().datetime(),
  endTime: z.string().datetime(),
  isFinal: z.boolean(),
  confidence: z.number().min(0).max(1).optional(),
  deviceId: z.string().min(1),
  projectId: z.string().optional(),
  taskId: z.string().optional()
});

export function registerRoutes(server: FastifyInstance): void {
  const timelineEntries: TimelineEntry[] = [];
  const voiceSessions: VoiceCaptureSession[] = [];
  const screenshotEvents: ScreenshotEvent[] = [];
  const insights: Insight[] = [];
  const transcriptionService = new TranscriptionService({ userId: 'user-1' });

  server.get('/health', async () => ({ ok: true, service: 'daily-timeline-api' }));

  server.get('/timeline/entries', async () => ({ data: timelineEntries }));
  server.get('/voice/sessions', async () => ({ data: voiceSessions }));
  server.get('/screenshots/events', async () => ({ data: screenshotEvents }));
  server.get('/insights', async () => ({ data: insights }));

  server.post('/api/transcription/chunk', async (request, reply) => {
    const parsed = transcriptChunkSchema.safeParse(request.body);
    if (!parsed.success) {
      return reply.code(400).send({ error: 'Invalid transcription chunk payload.' });
    }

    const chunk: TranscriptChunk = parsed.data;
    const result = transcriptionService.ingestChunk(chunk);

    if (result.accepted && result.entry) {
      timelineEntries.push(result.entry);
    }

    return {
      accepted: result.accepted,
      reason: result.reason,
      entry: result.entry ?? null
    };
  });
}
