import type { DailyReviewSession, Insight, TimelineEntry, VoiceCaptureSession } from '@daily-timeline/types';
import { useVoiceCaptureSession } from './audio/useVoiceCaptureSession';

const timelineEntries: TimelineEntry[] = [
  {
    id: 'entry-1',
    userId: 'user-1',
    source: 'voice',
    createdAt: new Date().toISOString(),
    occurredAt: new Date().toISOString(),
    text: 'Drafted product architecture and wrote implementation notes.',
    tags: ['architecture', 'planning', 'voice capture session'],
    speech: {
      utteranceStartAt: new Date().toISOString(),
      utteranceEndAt: new Date().toISOString(),
      confidence: 0.94,
      deviceId: 'browser-default-mic',
      sessionId: 'voice-session-1',
      projectId: 'project-123',
      taskId: 'task-456'
    }
  }
];

const voiceSession: VoiceCaptureSession = {
  id: 'voice-session-1',
  entryIds: timelineEntries.map((entry) => entry.id),
  startedAt: new Date().toISOString(),
  endedAt: null,
  language: 'en-US',
  state: 'capturing'
};

const insight: Insight = {
  id: 'insight-1',
  entryIds: timelineEntries.map((entry) => entry.id),
  confidence: 0.91,
  createdAt: new Date().toISOString(),
  summary: 'Planning work is concentrated in the first half of the day.',
  type: 'pattern'
};

const review: DailyReviewSession = {
  id: 'review-1',
  date: new Date().toISOString().slice(0, 10),
  startedAt: new Date().toISOString(),
  completedAt: null,
  insightIds: [insight.id],
  status: 'in_progress'
};

export function App() {
  const { captureState, lastError, startCapture, stopCapture } = useVoiceCaptureSession();

  return (
    <main className="app-shell">
      <header>
        <h1>Daily Timeline</h1>
        <p>Rolling canvas UI starter for timeline capture and review.</p>
      </header>

      <section>
        <h2>Voice Controls</h2>
        <p>Recording state: {captureState}</p>
        <button type="button" onClick={() => void startCapture()} disabled={captureState === 'recording'}>
          Start recording
        </button>
        <button type="button" onClick={() => void stopCapture()} disabled={captureState !== 'recording'}>
          Stop recording
        </button>
        {lastError ? <p role="alert">{lastError}</p> : null}
      </section>

      <section>
        <h2>TimelineEntry</h2>
        <pre>{JSON.stringify(timelineEntries[0], null, 2)}</pre>
      </section>

      <section>
        <h2>VoiceCaptureSession</h2>
        <pre>{JSON.stringify(voiceSession, null, 2)}</pre>
      </section>

      <section>
        <h2>Insight + DailyReviewSession</h2>
        <pre>{JSON.stringify({ insight, review }, null, 2)}</pre>
      </section>
    </main>
  );
}
