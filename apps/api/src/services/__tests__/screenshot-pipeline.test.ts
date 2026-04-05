import { describe, expect, it } from 'vitest';
import type { Insight, TimelineEntry } from '@daily-timeline/types';
import { analyzeScreenshot, extractOcrText } from '../vision';
import { linkScreenshotToTimeline } from '../screenshots/linker';
import { ingestScreenshotEvent } from '../screenshots/service';
import { InMemoryScreenshotStorage } from '../screenshots/storage';

describe('screenshot pipeline', () => {
  it('extractOcrText uses hinted text first', () => {
    const text = extractOcrText({
      imageUrl: 'https://storage.example.com/no-content.png',
      windowTitle: 'Editor',
      hintedText: 'deploy warning in terminal',
    });

    expect(text).toBe('deploy warning in terminal');
  });

  it('analyzeScreenshot identifies clues and anomalies', () => {
    const analysis = analyzeScreenshot({
      imageUrl: 'https://storage.example.com/deploy_error.png',
      windowTitle: 'VSCode deploy warning',
      hintedText: 'TODO resolve error before review',
    });

    expect(analysis.taskClues).toContain('todo');
    expect(analysis.anomalies).toContain('error');
  });

  it('ingestScreenshotEvent links to relevant timeline and emits anomaly insight', () => {
    const timelineEntries: TimelineEntry[] = [
      {
        id: 'entry-1',
        userId: 'user-1',
        source: 'voice',
        text: 'Finish deploy checklist and review app logs',
        tags: ['deploy', 'review'],
        createdAt: '2024-01-01T00:00:00.000Z',
        occurredAt: '2024-01-01T00:00:00.000Z',
      },
    ];
    const insights: Insight[] = [];
    const storage = new InMemoryScreenshotStorage();

    const event = ingestScreenshotEvent(
      {
        imageUrl: 'https://storage.example.com/deploy_error.png',
        capturedAt: '2024-01-15T09:00:00.000Z',
        windowTitle: 'Deploy warning',
        hintedText: 'TODO deploy failed in prod',
        userId: 'user-1',
      },
      { storage, timelineEntries, insights }
    );

    expect(event.linkedTimelineEntryIds).toContain('entry-1');
    expect(storage.list()).toHaveLength(1);
    expect(insights[0]?.summary).toContain('Possible missed detail');
  });

  it('linkScreenshotToTimeline handles empty signals', () => {
    const ids = linkScreenshotToTimeline([], { ocrText: null, windowTitle: null, inferredTask: null });
    expect(ids).toEqual([]);
  });
});
