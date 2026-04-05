import type { TimelineEntry } from '@daily-timeline/domain';
import { TimelineCanvas } from './components/TimelineCanvas';
import { EndOfDayReviewPanel } from './components/EndOfDayReviewPanel';

const sampleEntries: TimelineEntry[] = [
  {
    id: 'entry-1',
    timestamp: new Date().toISOString(),
    type: 'transcript',
    summary: 'Discussed architecture boundaries for ingestion and analysis.',
    projectIds: ['project-core'],
    taskIds: ['task-scaffold'],
    contextTagIds: ['context-architecture']
  }
];

export function App() {
  return (
    <main style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1rem', padding: '1rem' }}>
      <TimelineCanvas entries={sampleEntries} />
      <EndOfDayReviewPanel />
    </main>
  );
}
