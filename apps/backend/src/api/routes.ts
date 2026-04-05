import type { FastifyInstance } from 'fastify';
import type {
  EndOfDayReviewSession,
  Screenshot,
  TranscriptSegment
} from '@daily-timeline/domain';
import { DeepSearchQueue } from '../services/jobQueue';
import { ReviewSessionStore } from '../services/reviewSessionStore';
import { TimelineStore } from '../services/timelineStore';

export function registerRoutes(
  app: FastifyInstance,
  timelineStore: TimelineStore,
  deepSearchQueue: DeepSearchQueue,
  reviewSessionStore: ReviewSessionStore
) {
  app.post<{ Body: TranscriptSegment }>(
    '/ingest/transcript',
    {
      schema: {
        body: {
          type: 'object',
          required: ['id', 'source', 'text', 'startTime', 'endTime', 'projectIds', 'taskIds', 'contextTagIds'],
          properties: {
            id: { type: 'string' },
            source: { type: 'string', enum: ['microphone', 'system-audio'] },
            text: { type: 'string' },
            startTime: { type: 'string' },
            endTime: { type: 'string' },
            confidence: { type: 'number' },
            projectIds: { type: 'array', items: { type: 'string' } },
            taskIds: { type: 'array', items: { type: 'string' } },
            contextTagIds: { type: 'array', items: { type: 'string' } }
          }
        }
      }
    },
    async (request) => {
      const segment = request.body;
    timelineStore.ingest({
      id: `entry-${segment.id}`,
      timestamp: segment.startTime,
      type: 'transcript',
      summary: segment.text,
      transcriptSegmentId: segment.id,
      projectIds: segment.projectIds,
      taskIds: segment.taskIds,
      contextTagIds: segment.contextTagIds
    });

    return { ok: true };
  });

  app.post<{ Body: Screenshot }>(
    '/ingest/screenshot',
    {
      schema: {
        body: {
          type: 'object',
          required: ['id', 'capturedAt', 'projectIds', 'taskIds', 'contextTagIds'],
          properties: {
            id: { type: 'string' },
            capturedAt: { type: 'string' },
            description: { type: 'string' },
            projectIds: { type: 'array', items: { type: 'string' } },
            taskIds: { type: 'array', items: { type: 'string' } },
            contextTagIds: { type: 'array', items: { type: 'string' } }
          }
        }
      }
    },
    async (request) => {
      const screenshot = request.body;
      timelineStore.ingest({
        id: `entry-${screenshot.id}`,
        timestamp: screenshot.capturedAt,
        type: 'screenshot',
        summary: screenshot.description ?? 'Screenshot captured.',
        screenshotId: screenshot.id,
        projectIds: screenshot.projectIds,
        taskIds: screenshot.taskIds,
        contextTagIds: screenshot.contextTagIds
      });

      return { ok: true };
    }
  );

  app.get('/timeline', async () => ({ entries: timelineStore.list() }));

  app.post('/jobs/deep-search', async (request) => {
    const body = request.body as { query: string; timelineEntryIds: string[] };

    const job = deepSearchQueue.enqueue({
      id: crypto.randomUUID(),
      query: body.query,
      timelineEntryIds: body.timelineEntryIds,
      createdAt: new Date().toISOString()
    });

    return { job };
  });

  app.get('/jobs/deep-search', async () => ({ jobs: deepSearchQueue.list() }));

  app.get('/review/session', async () => ({ session: reviewSessionStore.get() }));

  app.put<{ Body: EndOfDayReviewSession }>(
    '/review/session',
    {
      schema: {
        body: {
          type: 'object',
          required: ['id', 'date', 'status', 'selectedEntryIds'],
          properties: {
            id: { type: 'string' },
            date: { type: 'string' },
            status: { type: 'string' },
            selectedEntryIds: { type: 'array', items: { type: 'string' } },
            selectedTranscriptSegmentIds: { type: 'array', items: { type: 'string' } },
            selectedScreenshotIds: { type: 'array', items: { type: 'string' } },
            notes: { type: 'string' },
            summary: { type: 'string' },
            createdAt: { type: 'string' },
            updatedAt: { type: 'string' },
            completedAt: { type: 'string' }
          }
        }
      }
    },
    async (request) => ({
      session: reviewSessionStore.set(request.body)
    })
  );
}
